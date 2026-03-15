package usecase

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"

	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/release"
)

type ReleaseOrderPipelineStageView struct {
	ShowModule   bool
	ExecutorType string
	Message      string
	Stages       []domain.ReleaseOrderPipelineStage
}

func (uc *ReleaseOrderManager) ListPipelineStagesView(
	ctx context.Context,
	orderID string,
) (ReleaseOrderPipelineStageView, error) {
	orderID = strings.TrimSpace(orderID)
	if orderID == "" {
		return ReleaseOrderPipelineStageView{}, ErrInvalidID
	}

	order, err := uc.repo.GetByID(ctx, orderID)
	if err != nil {
		return ReleaseOrderPipelineStageView{}, err
	}

	executions, err := uc.repo.ListExecutions(ctx, order.ID)
	if err != nil {
		return ReleaseOrderPipelineStageView{}, err
	}

	view := ReleaseOrderPipelineStageView{}
	syncMessages := make([]string, 0)
	for _, execution := range executions {
		if strings.ToLower(strings.TrimSpace(execution.Provider)) != string(pipelinedomain.ProviderJenkins) {
			continue
		}
		view.ShowModule = true
		view.ExecutorType = strings.TrimSpace(execution.Provider)
		binding, bindingErr := uc.pipelineRepo.GetBindingByID(ctx, execution.BindingID)
		if bindingErr != nil {
			continue
		}
		syncMessage, _ := uc.refreshPipelineStages(ctx, order, execution, binding)
		if strings.TrimSpace(syncMessage) != "" {
			syncMessages = append(syncMessages, syncMessage)
		}
	}
	if !view.ShowModule {
		return view, nil
	}

	stages, err := uc.repo.ListPipelineStages(ctx, order.ID)
	if err != nil {
		return ReleaseOrderPipelineStageView{}, err
	}
	view.Stages = stages

	if len(syncMessages) > 0 {
		view.Message = strings.Join(syncMessages, "；")
		return view, nil
	}

	if len(stages) == 0 {
		view.Message = defaultPipelineStageMessage(order.Status)
	}
	return view, nil
}

func (uc *ReleaseOrderManager) GetPipelineStageLog(
	ctx context.Context,
	orderID string,
	stageID string,
) (domain.ReleaseOrderPipelineStage, domain.ReleaseOrderPipelineStageLog, error) {
	orderID = strings.TrimSpace(orderID)
	stageID = strings.TrimSpace(stageID)
	if orderID == "" || stageID == "" {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, ErrInvalidID
	}
	if uc.jenkins == nil {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, fmt.Errorf("%w: jenkins executor is not configured", ErrInvalidInput)
	}

	stage, err := uc.repo.GetPipelineStageByID(ctx, orderID, stageID)
	if err != nil {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, err
	}
	order, err := uc.repo.GetByID(ctx, orderID)
	if err != nil {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, err
	}
	execution, err := uc.repo.GetExecutionByScope(ctx, order.ID, domain.PipelineScope(strings.ToLower(strings.TrimSpace(stage.PipelineScope))))
	if err != nil {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, err
	}
	if strings.ToLower(strings.TrimSpace(execution.Provider)) != string(pipelinedomain.ProviderJenkins) {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, fmt.Errorf("%w: only jenkins binding supports pipeline stages", ErrInvalidInput)
	}
	buildURL, message, err := uc.resolveBuildURLForPipelineStages(ctx, order, execution)
	if err != nil {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, err
	}
	if buildURL == "" {
		if strings.TrimSpace(message) == "" {
			message = defaultPipelineStageMessage(order.Status)
		}
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, fmt.Errorf("%w: %s", ErrInvalidInput, message)
	}

	logResult, err := uc.jenkins.GetBuildStageLog(ctx, buildURL, stage.StageKey)
	if err != nil {
		return domain.ReleaseOrderPipelineStage{}, domain.ReleaseOrderPipelineStageLog{}, err
	}
	logResult.ReleaseOrderID = orderID
	logResult.StageID = stage.ID
	logResult.PipelineScope = stage.PipelineScope
	logResult.ExecutorType = stage.ExecutorType
	if strings.TrimSpace(logResult.StageName) == "" {
		logResult.StageName = stage.StageName
	}
	if logResult.FetchedAt.IsZero() {
		logResult.FetchedAt = uc.now()
	}

	return stage, logResult, nil
}

func (uc *ReleaseOrderManager) refreshPipelineStages(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	binding pipelinedomain.PipelineBinding,
) (string, error) {
	if binding.Provider != pipelinedomain.ProviderJenkins {
		return "", nil
	}
	if uc.jenkins == nil {
		return "Jenkins 阶段同步未配置", fmt.Errorf("jenkins executor is not configured")
	}

	buildURL, message, err := uc.resolveBuildURLForPipelineStages(ctx, order, execution)
	if err != nil {
		return "Jenkins 阶段同步失败：" + trimPipelineStageError(err), err
	}
	if buildURL == "" {
		return message, nil
	}

	items, err := uc.jenkins.GetBuildStages(ctx, buildURL)
	if err != nil {
		if isResourceNotFoundError(err) {
			return "Jenkins 阶段数据暂不可用，稍后自动重试", nil
		}
		return "Jenkins 阶段同步失败：" + trimPipelineStageError(err), err
	}

	now := uc.now()
	persisted := make([]domain.ReleaseOrderPipelineStage, 0, len(items))
	for _, item := range items {
		stageKey := strings.TrimSpace(item.StageKey)
		if stageKey == "" {
			stageKey = strings.TrimSpace(item.StageName)
		}
		if stageKey == "" {
			continue
		}
		status := item.Status
		if !status.Valid() {
			status = domain.PipelineStageStatusPending
		}
		persisted = append(persisted, domain.ReleaseOrderPipelineStage{
			ID:             stablePipelineStageID(order.ID, string(binding.Provider), string(execution.PipelineScope), stageKey),
			ReleaseOrderID: order.ID,
			ExecutionID:    execution.ID,
			PipelineScope:  strings.TrimSpace(string(execution.PipelineScope)),
			ExecutorType:   strings.TrimSpace(execution.Provider),
			StageKey:       stageKey,
			StageName:      firstNonEmpty(strings.TrimSpace(item.StageName), stageKey),
			Status:         status,
			RawStatus:      strings.TrimSpace(item.RawStatus),
			SortNo:         item.SortNo,
			DurationMillis: item.DurationMillis,
			StartedAt:      item.StartedAt,
			FinishedAt:     item.FinishedAt,
			CreatedAt:      now,
			UpdatedAt:      now,
		})
	}
	existing, err := uc.repo.ListPipelineStages(ctx, order.ID)
	if err != nil {
		return "", err
	}
	merged := make([]domain.ReleaseOrderPipelineStage, 0, len(existing)+len(persisted))
	for _, item := range existing {
		if strings.EqualFold(strings.TrimSpace(item.PipelineScope), string(execution.PipelineScope)) {
			continue
		}
		merged = append(merged, item)
	}
	merged = append(merged, persisted...)

	if err := uc.repo.ReplacePipelineStages(ctx, order.ID, merged); err != nil {
		return "", err
	}
	if len(persisted) == 0 {
		return defaultPipelineStageMessage(order.Status), nil
	}
	return "", nil
}

func (uc *ReleaseOrderManager) resolveBuildURLForPipelineStages(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
) (buildURL string, message string, err error) {
	buildURL = strings.TrimSpace(execution.BuildURL)
	if buildURL != "" {
		return buildURL, "", nil
	}

	queueURL := strings.TrimSpace(execution.QueueURL)
	if queueURL == "" {
		return "", defaultPipelineStageMessage(order.Status), nil
	}
	if uc.jenkins == nil {
		return "", "Jenkins 阶段同步未配置", fmt.Errorf("jenkins executor is not configured")
	}

	resolvedBuildURL, cancelled, why, queueErr := uc.jenkins.GetQueueItem(ctx, queueURL)
	if queueErr != nil {
		if isResourceNotFoundError(queueErr) {
			return "", "Jenkins 队列信息暂不可用，稍后自动重试", nil
		}
		return "", "", queueErr
	}
	if cancelled {
		reason := strings.TrimSpace(why)
		if reason == "" {
			reason = "Jenkins 队列任务已取消"
		}
		return "", reason, nil
	}

	buildURL = strings.TrimSpace(resolvedBuildURL)
	if buildURL == "" {
		return "", "Jenkins 排队中，等待分配构建任务", nil
	}

	_, _ = uc.repo.UpdateExecutionByScope(ctx, order.ID, execution.PipelineScope, domain.ExecutionUpdateInput{
		Status:    execution.Status,
		QueueURL:  queueURL,
		BuildURL:  buildURL,
		StartedAt: execution.StartedAt,
		UpdatedAt: uc.now(),
	})
	return buildURL, "", nil
}

func stablePipelineStageID(orderID string, executorType string, pipelineScope string, stageKey string) string {
	sum := sha1.Sum([]byte(
		strings.TrimSpace(orderID) + ":" +
			strings.TrimSpace(executorType) + ":" +
			strings.TrimSpace(pipelineScope) + ":" +
			strings.TrimSpace(stageKey),
	))
	return "rps-" + hex.EncodeToString(sum[:12])
}

func defaultPipelineStageMessage(status domain.OrderStatus) string {
	switch status {
	case domain.OrderStatusPending:
		return "当前发布单尚未执行，执行后将展示 Jenkins 阶段进度。"
	case domain.OrderStatusRunning:
		return "Jenkins 已触发，等待阶段数据同步。"
	case domain.OrderStatusSuccess, domain.OrderStatusFailed, domain.OrderStatusCancelled:
		return "当前构建未返回阶段数据。"
	default:
		return "等待 Jenkins 阶段数据同步。"
	}
}

func trimPipelineStageError(err error) string {
	if err == nil {
		return "未知错误"
	}
	message := strings.Join(strings.Fields(strings.TrimSpace(err.Error())), " ")
	if message == "" {
		return "未知错误"
	}
	if len(message) > 180 {
		return message[:180] + "..."
	}
	return message
}
