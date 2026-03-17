package usecase

import (
	"context"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/release"
)

var queueURLPattern = regexp.MustCompile(`queue:\s*([^\s]+)`)
var buildURLPattern = regexp.MustCompile(`build:\s*([^\s]+)`)
var rawURLPattern = regexp.MustCompile(`https?://[^\s]+`)

type JenkinsReleaseStatusClient interface {
	GetQueueItem(ctx context.Context, queueURL string) (executableURL string, cancelled bool, why string, err error)
	GetBuildStatus(ctx context.Context, buildURL string) (building bool, result string, err error)
}

type TrackReleaseExecutionOutput struct {
	RunningOrders int `json:"running_orders"`
	UpdatedOrders int `json:"updated_orders"`
	SkippedOrders int `json:"skipped_orders"`
	FailedOrders  int `json:"failed_orders"`
}

type TrackReleaseExecution struct {
	manager *ReleaseOrderManager
	jenkins JenkinsReleaseStatusClient
	argocd  ArgoCDReleaseExecutor
	now     func() time.Time
}

func NewTrackReleaseExecution(
	manager *ReleaseOrderManager,
	jenkins JenkinsReleaseStatusClient,
	argocd ArgoCDReleaseExecutor,
) *TrackReleaseExecution {
	return &TrackReleaseExecution{
		manager: manager,
		jenkins: jenkins,
		argocd:  argocd,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *TrackReleaseExecution) Execute(ctx context.Context) (TrackReleaseExecutionOutput, error) {
	if uc == nil || uc.manager == nil {
		return TrackReleaseExecutionOutput{}, nil
	}
	if uc.jenkins == nil && uc.argocd == nil {
		return TrackReleaseExecutionOutput{}, nil
	}

	orders, err := uc.listRunningOrders(ctx)
	if err != nil {
		return TrackReleaseExecutionOutput{}, err
	}

	output := TrackReleaseExecutionOutput{
		RunningOrders: len(orders),
	}

	for _, order := range orders {
		updated, skipped, runErr := uc.syncOrder(ctx, order)
		if runErr != nil {
			output.FailedOrders++
			continue
		}
		if skipped {
			output.SkippedOrders++
			continue
		}
		if updated {
			output.UpdatedOrders++
		}
	}

	return output, nil
}

func (uc *TrackReleaseExecution) listRunningOrders(ctx context.Context) ([]domain.ReleaseOrder, error) {
	const pageSize = 100

	result := make([]domain.ReleaseOrder, 0)
	page := 1
	for {
		items, total, err := uc.manager.List(ctx, ListReleaseOrderInput{
			Status:   domain.OrderStatusRunning,
			Page:     page,
			PageSize: pageSize,
		})
		if err != nil {
			return nil, err
		}
		if len(items) == 0 {
			break
		}
		result = append(result, items...)
		if int64(page*pageSize) >= total {
			break
		}
		page++
	}
	return result, nil
}

func (uc *TrackReleaseExecution) syncOrder(ctx context.Context, order domain.ReleaseOrder) (bool, bool, error) {
	executions, err := uc.manager.ListExecutions(ctx, order.ID)
	if err != nil {
		return false, false, err
	}
	if len(executions) == 0 {
		return false, true, nil
	}

	runningExecution := findExecutionByStatus(executions, domain.ExecutionStatusRunning)
	if runningExecution == nil {
		pendingExecution := findExecutionByStatus(executions, domain.ExecutionStatusPending)
		if pendingExecution != nil {
			orderParams, paramErr := uc.manager.ListParams(ctx, order.ID)
			if paramErr != nil {
				return false, false, paramErr
			}
			if err := uc.manager.startNextPendingExecution(ctx, order, executions, orderParams); err != nil {
				return false, false, err
			}
			return true, false, nil
		}
		return uc.finalizeOrder(ctx, order, executions)
	}

	switch strings.ToLower(strings.TrimSpace(runningExecution.Provider)) {
	case string(pipelinedomain.ProviderJenkins):
		// continue below
	case string(pipelinedomain.ProviderArgoCD):
		return uc.syncArgoCDExecution(ctx, order, *runningExecution, executions)
	default:
		return uc.finalizeOrder(ctx, order, executions)
	}

	queueURL := strings.TrimSpace(runningExecution.QueueURL)
	buildURL := strings.TrimSpace(runningExecution.BuildURL)
	if queueURL == "" && buildURL == "" {
		if uc.now().Sub(order.UpdatedAt) < 2*time.Minute {
			return false, true, nil
		}
		updated, finishErr := uc.finishStep(
			ctx,
			order.ID,
			scopeStepCode(runningExecution.PipelineScope, "pipeline_running"),
			domain.StepStatusFailed,
			"未记录 Jenkins 队列/构建地址，无法追踪执行结果",
		)
		return updated, false, finishErr
	}

	if buildURL == "" && queueURL != "" {
		resolvedBuildURL, cancelled, why, queueErr := uc.jenkins.GetQueueItem(ctx, queueURL)
		if queueErr != nil {
			if isResourceNotFoundError(queueErr) {
				if uc.now().Sub(order.UpdatedAt) < 2*time.Minute {
					return false, true, nil
				}
				updated, finishErr := uc.finishStep(
					ctx,
					order.ID,
					scopeStepCode(runningExecution.PipelineScope, "pipeline_running"),
					domain.StepStatusFailed,
					"Jenkins 队列记录已过期，无法追踪结果",
				)
				return updated, false, finishErr
			}
			return false, false, queueErr
		}
		if cancelled {
			now := uc.now()
			_, _ = uc.manager.repo.UpdateExecutionByScope(ctx, order.ID, runningExecution.PipelineScope, domain.ExecutionUpdateInput{
				Status:     domain.ExecutionStatusCancelled,
				QueueURL:   queueURL,
				StartedAt:  runningExecution.StartedAt,
				FinishedAt: &now,
				UpdatedAt:  now,
			})
			updated, finishErr := uc.finishStep(
				ctx,
				order.ID,
				scopeStepCode(runningExecution.PipelineScope, "pipeline_running"),
				domain.StepStatusFailed,
				"Jenkins 队列已取消: "+strings.TrimSpace(why),
			)
			return updated, false, finishErr
		}
		buildURL = strings.TrimSpace(resolvedBuildURL)
		if buildURL == "" {
			return false, false, nil
		}
		now := uc.now()
		if _, err := uc.manager.repo.UpdateExecutionByScope(ctx, order.ID, runningExecution.PipelineScope, domain.ExecutionUpdateInput{
			Status:    domain.ExecutionStatusRunning,
			QueueURL:  queueURL,
			BuildURL:  buildURL,
			StartedAt: runningExecution.StartedAt,
			UpdatedAt: now,
		}); err != nil {
			return false, false, err
		}
	}

	if binding, bindingErr := uc.manager.resolveExecutionBinding(ctx, order, *runningExecution); bindingErr == nil {
		_, _ = uc.manager.refreshPipelineStages(ctx, order, *runningExecution, binding)
	}

	building, result, statusErr := uc.jenkins.GetBuildStatus(ctx, buildURL)
	if statusErr != nil {
		if isResourceNotFoundError(statusErr) {
			if uc.now().Sub(order.UpdatedAt) < 2*time.Minute {
				return false, true, nil
			}
			updated, finishErr := uc.finishStep(
				ctx,
				order.ID,
				scopeStepCode(runningExecution.PipelineScope, "pipeline_running"),
				domain.StepStatusFailed,
				"Jenkins 构建记录不存在，无法追踪结果",
			)
			return updated, false, finishErr
		}
		return false, false, statusErr
	}
	if building {
		return false, false, nil
	}

	result = strings.ToUpper(strings.TrimSpace(result))
	if result == "" {
		return false, false, nil
	}

	switch result {
	case "SUCCESS":
		now := uc.now()
		_, _ = uc.manager.repo.UpdateExecutionByScope(ctx, order.ID, runningExecution.PipelineScope, domain.ExecutionUpdateInput{
			Status:     domain.ExecutionStatusSuccess,
			QueueURL:   queueURL,
			BuildURL:   buildURL,
			StartedAt:  runningExecution.StartedAt,
			FinishedAt: &now,
			UpdatedAt:  now,
		})
		updated1, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_running"), domain.StepStatusSuccess, messageWithBuildURL("Jenkins 构建成功", buildURL))
		if err != nil {
			return false, false, err
		}
		updated2, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_success"), domain.StepStatusSuccess, "Jenkins 结果: "+result)
		if err != nil {
			return false, false, err
		}
		updated3, err := uc.syncNextStepAfterExecution(ctx, order)
		if err != nil {
			return false, false, err
		}
		return updated1 || updated2 || updated3, false, nil
	case "FAILURE", "ABORTED", "UNSTABLE", "NOT_BUILT":
		now := uc.now()
		nextStatus := domain.ExecutionStatusFailed
		if result == "ABORTED" {
			nextStatus = domain.ExecutionStatusCancelled
		}
		_, _ = uc.manager.repo.UpdateExecutionByScope(ctx, order.ID, runningExecution.PipelineScope, domain.ExecutionUpdateInput{
			Status:     nextStatus,
			QueueURL:   queueURL,
			BuildURL:   buildURL,
			StartedAt:  runningExecution.StartedAt,
			FinishedAt: &now,
			UpdatedAt:  now,
		})
		updated, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_running"), domain.StepStatusFailed, messageWithBuildURL("Jenkins 结果: "+result, buildURL))
		if err != nil {
			return false, false, err
		}
		updated2, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_success"), domain.StepStatusFailed, "Jenkins 结果: "+result)
		if err != nil {
			return false, false, err
		}
		updated3, err := uc.failRemainingExecutions(ctx, order, executions, runningExecution.PipelineScope, "前置阶段失败，未继续执行")
		if err != nil {
			return false, false, err
		}
		return updated || updated2 || updated3, false, nil
	default:
		return false, false, nil
	}
}

func (uc *TrackReleaseExecution) syncArgoCDExecution(
	ctx context.Context,
	order domain.ReleaseOrder,
	runningExecution domain.ReleaseOrderExecution,
	executions []domain.ReleaseOrderExecution,
) (bool, bool, error) {
	if uc.argocd == nil {
		return false, false, fmt.Errorf("%w: argocd executor is not configured", ErrInvalidInput)
	}

	binding, err := uc.manager.resolveExecutionBinding(ctx, order, runningExecution)
	if err != nil {
		return false, false, err
	}
	if _, refreshErr := uc.manager.refreshPipelineStages(ctx, order, runningExecution, binding); refreshErr != nil {
		// 阶段刷新失败不直接打断主状态同步，避免短暂接口抖动影响发布闭环。
	}

	appName, app, err := resolveArgoCDApplicationByRef(ctx, uc.argocd, binding.ExternalRef, strings.TrimSpace(order.EnvCode))
	if err != nil {
		if errors.Is(err, ErrInvalidInput) {
			updated, finishErr := uc.finishStep(
				ctx,
				order.ID,
				scopeStepCode(runningExecution.PipelineScope, "pipeline_running"),
				domain.StepStatusFailed,
				"ArgoCD 绑定未配置可用的 GitOps 子目录或 Application 标识",
			)
			return updated, false, finishErr
		}
		if isResourceNotFoundError(err) {
			if uc.now().Sub(order.UpdatedAt) < 2*time.Minute {
				return false, true, nil
			}
			updated, finishErr := uc.finishStep(
				ctx,
				order.ID,
				scopeStepCode(runningExecution.PipelineScope, "pipeline_running"),
				domain.StepStatusFailed,
				"ArgoCD Application 不存在，无法继续追踪部署状态",
			)
			return updated, false, finishErr
		}
		return false, false, err
	}
	if appName == "" || app == nil {
		updated, finishErr := uc.finishStep(
			ctx,
			order.ID,
			scopeStepCode(runningExecution.PipelineScope, "pipeline_running"),
			domain.StepStatusFailed,
			"ArgoCD 绑定未配置可用的 GitOps 子目录或 Application 标识",
		)
		return updated, false, finishErr
	}

	syncStatus := strings.ToLower(strings.TrimSpace(app.GetSyncStatus()))
	healthStatus := strings.ToLower(strings.TrimSpace(app.GetHealthStatus()))
	operationPhase := strings.ToLower(strings.TrimSpace(app.GetOperationPhase()))

	switch {
	case (syncStatus == "synced" || syncStatus == "") && healthStatus == "healthy" && operationPhase != "running":
		now := uc.now()
		_, _ = uc.manager.repo.UpdateExecutionByScope(ctx, order.ID, runningExecution.PipelineScope, domain.ExecutionUpdateInput{
			Status:        domain.ExecutionStatusSuccess,
			ExternalRunID: runningExecution.ExternalRunID,
			StartedAt:     runningExecution.StartedAt,
			FinishedAt:    &now,
			UpdatedAt:     now,
		})
		updated1, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_running"), domain.StepStatusSuccess, fmt.Sprintf("ArgoCD 应用已同步，sync=%s，health=%s", firstNonEmpty(app.GetSyncStatus(), "Synced"), firstNonEmpty(app.GetHealthStatus(), "Healthy")))
		if err != nil {
			return false, false, err
		}
		updated2, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_success"), domain.StepStatusSuccess, "ArgoCD 部署完成")
		if err != nil {
			return false, false, err
		}
		updated3, err := uc.syncNextStepAfterExecution(ctx, order)
		if err != nil {
			return false, false, err
		}
		return updated1 || updated2 || updated3, false, nil
	case operationPhase == "failed" || healthStatus == "degraded":
		now := uc.now()
		_, _ = uc.manager.repo.UpdateExecutionByScope(ctx, order.ID, runningExecution.PipelineScope, domain.ExecutionUpdateInput{
			Status:        domain.ExecutionStatusFailed,
			ExternalRunID: runningExecution.ExternalRunID,
			StartedAt:     runningExecution.StartedAt,
			FinishedAt:    &now,
			UpdatedAt:     now,
		})
		message := fmt.Sprintf("ArgoCD 同步失败，sync=%s，health=%s，phase=%s", firstNonEmpty(app.GetSyncStatus(), "Unknown"), firstNonEmpty(app.GetHealthStatus(), "Unknown"), firstNonEmpty(app.GetOperationPhase(), "Unknown"))
		updated, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_running"), domain.StepStatusFailed, message)
		if err != nil {
			return false, false, err
		}
		updated2, err := uc.finishStep(ctx, order.ID, scopeStepCode(runningExecution.PipelineScope, "pipeline_success"), domain.StepStatusFailed, "ArgoCD 部署失败")
		if err != nil {
			return false, false, err
		}
		updated3, err := uc.failRemainingExecutions(ctx, order, executions, runningExecution.PipelineScope, "ArgoCD 部署失败，未继续执行后续阶段")
		if err != nil {
			return false, false, err
		}
		return updated || updated2 || updated3, false, nil
	default:
		return false, false, nil
	}
}

func findExecutionByStatus(items []domain.ReleaseOrderExecution, status domain.ExecutionStatus) *domain.ReleaseOrderExecution {
	for idx := range items {
		if items[idx].Status == status {
			return &items[idx]
		}
	}
	return nil
}

func (uc *TrackReleaseExecution) syncNextStepAfterExecution(ctx context.Context, order domain.ReleaseOrder) (bool, error) {
	executions, err := uc.manager.ListExecutions(ctx, order.ID)
	if err != nil {
		return false, err
	}
	if findExecutionByStatus(executions, domain.ExecutionStatusPending) != nil {
		orderParams, err := uc.manager.ListParams(ctx, order.ID)
		if err != nil {
			return false, err
		}
		if err := uc.manager.startNextPendingExecution(ctx, order, executions, orderParams); err != nil {
			return false, err
		}
		return true, nil
	}
	updated, _, err := uc.finalizeOrder(ctx, order, executions)
	return updated, err
}

func (uc *TrackReleaseExecution) finalizeOrder(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
) (bool, bool, error) {
	now := uc.now()
	if len(executions) == 0 {
		return false, true, nil
	}

	orderStatus := domain.OrderStatusSuccess
	message := "发布完成"
	for _, item := range executions {
		switch item.Status {
		case domain.ExecutionStatusFailed:
			orderStatus = domain.OrderStatusFailed
			message = "存在失败执行单元"
		case domain.ExecutionStatusCancelled:
			if orderStatus != domain.OrderStatusFailed {
				orderStatus = domain.OrderStatusCancelled
				message = "存在已取消执行单元"
			}
		case domain.ExecutionStatusPending, domain.ExecutionStatusRunning:
			return false, false, nil
		}
	}

	stepStatus := domain.StepStatusSuccess
	if orderStatus != domain.OrderStatusSuccess {
		stepStatus = domain.StepStatusFailed
	}
	updated, err := uc.finishStep(ctx, order.ID, "global:release_finish", stepStatus, message)
	if err != nil {
		return false, false, err
	}
	if _, err := uc.manager.repo.UpdateStatus(ctx, order.ID, orderStatus, order.StartedAt, &now, now); err != nil {
		return false, false, err
	}
	return updated, false, nil
}

func (uc *TrackReleaseExecution) failRemainingExecutions(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	failedScope domain.PipelineScope,
	message string,
) (bool, error) {
	now := uc.now()
	updated := false
	for _, item := range executions {
		if item.PipelineScope == failedScope || item.Status != domain.ExecutionStatusPending {
			continue
		}
		if _, err := uc.manager.repo.UpdateExecutionByScope(ctx, order.ID, item.PipelineScope, domain.ExecutionUpdateInput{
			Status:     domain.ExecutionStatusSkipped,
			StartedAt:  &now,
			FinishedAt: &now,
			UpdatedAt:  now,
		}); err != nil {
			return false, err
		}
		if ok, err := uc.finishStep(ctx, order.ID, scopeStepCode(item.PipelineScope, "trigger_pipeline"), domain.StepStatusFailed, message); err != nil {
			return false, err
		} else if ok {
			updated = true
		}
		if ok, err := uc.finishStep(ctx, order.ID, scopeStepCode(item.PipelineScope, "pipeline_running"), domain.StepStatusFailed, message); err != nil {
			return false, err
		} else if ok {
			updated = true
		}
		if ok, err := uc.finishStep(ctx, order.ID, scopeStepCode(item.PipelineScope, "pipeline_success"), domain.StepStatusFailed, message); err != nil {
			return false, err
		} else if ok {
			updated = true
		}
	}
	if _, err := uc.finishStep(ctx, order.ID, "global:release_finish", domain.StepStatusFailed, message); err != nil {
		return false, err
	}
	if _, err := uc.manager.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusFailed, order.StartedAt, &now, now); err != nil {
		return false, err
	}
	return updated || true, nil
}

func (uc *TrackReleaseExecution) finishStep(
	ctx context.Context,
	orderID string,
	stepCode string,
	status domain.StepStatus,
	message string,
) (bool, error) {
	steps, err := uc.manager.ListSteps(ctx, orderID)
	if err != nil {
		return false, err
	}
	current := findStepByCode(steps, stepCode)
	if current == nil {
		return false, nil
	}
	switch current.Status {
	case domain.StepStatusSuccess, domain.StepStatusFailed:
		return false, nil
	case domain.StepStatusPending:
		_, _, err := uc.manager.StartStep(ctx, orderID, stepCode, "")
		if err != nil && !errors.Is(err, ErrInvalidInput) {
			return false, err
		}
	}

	steps, err = uc.manager.ListSteps(ctx, orderID)
	if err != nil {
		return false, err
	}
	current = findStepByCode(steps, stepCode)
	if current == nil || current.Status != domain.StepStatusRunning {
		return false, nil
	}

	_, _, err = uc.manager.FinishStep(ctx, orderID, stepCode, FinishReleaseOrderStepInput{
		Status:  status,
		Message: message,
	})
	if err != nil {
		if errors.Is(err, ErrInvalidInput) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func findStepByCode(steps []domain.ReleaseOrderStep, stepCode string) *domain.ReleaseOrderStep {
	for index := range steps {
		if steps[index].StepCode == stepCode {
			return &steps[index]
		}
	}
	return nil
}

func extractQueueURLFromSteps(steps []domain.ReleaseOrderStep) string {
	for _, step := range steps {
		if step.StepCode != "trigger_pipeline" {
			continue
		}
		if queueURL := extractQueueURL(step.Message); queueURL != "" {
			return queueURL
		}
	}
	for _, step := range steps {
		if queueURL := extractQueueURL(step.Message); queueURL != "" {
			return queueURL
		}
	}
	return ""
}

func extractBuildURLFromSteps(steps []domain.ReleaseOrderStep) string {
	for _, step := range steps {
		if step.StepCode == "pipeline_running" || step.StepCode == "trigger_pipeline" {
			if buildURL := extractBuildURL(step.Message); buildURL != "" {
				return buildURL
			}
		}
	}
	for _, step := range steps {
		if buildURL := extractBuildURL(step.Message); buildURL != "" {
			return buildURL
		}
	}
	return ""
}

func extractQueueURL(message string) string {
	matches := queueURLPattern.FindStringSubmatch(strings.TrimSpace(message))
	if len(matches) < 2 {
		return ""
	}
	queueURL := strings.TrimSpace(matches[1])
	queueURL = strings.TrimRight(queueURL, "，,;；")
	return queueURL
}

func extractBuildURL(message string) string {
	matches := buildURLPattern.FindStringSubmatch(strings.TrimSpace(message))
	if len(matches) < 2 {
		for _, candidate := range rawURLPattern.FindAllString(strings.TrimSpace(message), -1) {
			buildURL := strings.TrimSpace(candidate)
			buildURL = strings.TrimRight(buildURL, "，,;；")
			lowerURL := strings.ToLower(buildURL)
			if strings.Contains(lowerURL, "/queue/item/") {
				continue
			}
			if strings.Contains(lowerURL, "/job/") {
				return buildURL
			}
		}
		return ""
	}
	buildURL := strings.TrimSpace(matches[1])
	buildURL = strings.TrimRight(buildURL, "，,;；")
	return buildURL
}

func messageWithBuildURL(message string, buildURL string) string {
	message = strings.TrimSpace(message)
	buildURL = strings.TrimSpace(buildURL)
	if buildURL == "" {
		return message
	}
	if extracted := extractBuildURL(message); extracted != "" {
		return message
	}
	message = strings.TrimRight(message, "，,;； ")
	if message == "" {
		return "build: " + buildURL
	}
	return message + "，build: " + buildURL
}

func isResourceNotFoundError(err error) bool {
	if err == nil {
		return false
	}
	text := strings.ToLower(err.Error())
	return strings.Contains(text, "status=404") || strings.Contains(text, "status=410")
}
