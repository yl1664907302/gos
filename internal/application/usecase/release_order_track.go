package usecase

import (
	"context"
	"errors"
	"regexp"
	"strings"
	"time"

	domain "gos/internal/domain/release"
)

var queueURLPattern = regexp.MustCompile(`queue:\s*([^\s]+)`)

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
	now     func() time.Time
}

func NewTrackReleaseExecution(
	manager *ReleaseOrderManager,
	jenkins JenkinsReleaseStatusClient,
) *TrackReleaseExecution {
	return &TrackReleaseExecution{
		manager: manager,
		jenkins: jenkins,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *TrackReleaseExecution) Execute(ctx context.Context) (TrackReleaseExecutionOutput, error) {
	if uc == nil || uc.manager == nil || uc.jenkins == nil {
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
	steps, err := uc.manager.ListSteps(ctx, order.ID)
	if err != nil {
		return false, false, err
	}

	queueURL := extractQueueURLFromSteps(steps)
	if queueURL == "" {
		return false, true, nil
	}

	buildURL, cancelled, why, err := uc.jenkins.GetQueueItem(ctx, queueURL)
	if err != nil {
		if isResourceNotFoundError(err) {
			if uc.now().Sub(order.UpdatedAt) < 2*time.Minute {
				return false, true, nil
			}
			updated, finishErr := uc.finishStep(
				ctx,
				order.ID,
				"pipeline_running",
				domain.StepStatusFailed,
				"Jenkins 队列记录已过期，无法追踪结果",
			)
			return updated, false, finishErr
		}
		return false, false, err
	}
	if cancelled {
		updated, finishErr := uc.finishStep(ctx, order.ID, "pipeline_running", domain.StepStatusFailed, "Jenkins 队列已取消: "+strings.TrimSpace(why))
		return updated, false, finishErr
	}

	buildURL = strings.TrimSpace(buildURL)
	if buildURL == "" {
		return false, false, nil
	}

	building, result, err := uc.jenkins.GetBuildStatus(ctx, buildURL)
	if err != nil {
		if isResourceNotFoundError(err) {
			if uc.now().Sub(order.UpdatedAt) < 2*time.Minute {
				return false, true, nil
			}
			updated, finishErr := uc.finishStep(
				ctx,
				order.ID,
				"pipeline_running",
				domain.StepStatusFailed,
				"Jenkins 构建记录不存在，无法追踪结果",
			)
			return updated, false, finishErr
		}
		return false, false, err
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
		updated1, err := uc.finishStep(ctx, order.ID, "pipeline_running", domain.StepStatusSuccess, "Jenkins 构建成功: "+buildURL)
		if err != nil {
			return false, false, err
		}
		updated2, err := uc.finishStep(ctx, order.ID, "pipeline_success", domain.StepStatusSuccess, "Jenkins 结果: "+result)
		if err != nil {
			return false, false, err
		}
		return updated1 || updated2, false, nil
	case "FAILURE", "ABORTED", "UNSTABLE", "NOT_BUILT":
		updated, err := uc.finishStep(ctx, order.ID, "pipeline_running", domain.StepStatusFailed, "Jenkins 结果: "+result)
		return updated, false, err
	default:
		return false, false, nil
	}
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

func extractQueueURL(message string) string {
	matches := queueURLPattern.FindStringSubmatch(strings.TrimSpace(message))
	if len(matches) < 2 {
		return ""
	}
	queueURL := strings.TrimSpace(matches[1])
	queueURL = strings.TrimRight(queueURL, "，,;；")
	return queueURL
}

func isResourceNotFoundError(err error) bool {
	if err == nil {
		return false
	}
	text := strings.ToLower(err.Error())
	return strings.Contains(text, "status=404") || strings.Contains(text, "status=410")
}
