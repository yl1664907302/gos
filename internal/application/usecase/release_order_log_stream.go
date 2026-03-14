package usecase

import (
	"context"
	"fmt"
	"strings"
	"time"

	pipelinedomain "gos/internal/domain/pipeline"
	releasedomain "gos/internal/domain/release"
)

const (
	ReleaseOrderLogEventTypeStatus = "status"
	ReleaseOrderLogEventTypeLog    = "log"
	ReleaseOrderLogEventTypeDone   = "done"
	ReleaseOrderLogEventTypeError  = "error"
)

type JenkinsReleaseLogClient interface {
	GetQueueItem(ctx context.Context, queueURL string) (executableURL string, cancelled bool, why string, err error)
	GetBuildStatus(ctx context.Context, buildURL string) (building bool, result string, err error)
	GetBuildConsoleText(ctx context.Context, buildURL string, start int64) (content string, nextStart int64, moreData bool, err error)
}

type ReleaseOrderLogEvent struct {
	Type        string    `json:"type"`
	Timestamp   time.Time `json:"timestamp"`
	Message     string    `json:"message,omitempty"`
	Content     string    `json:"content,omitempty"`
	QueueURL    string    `json:"queue_url,omitempty"`
	BuildURL    string    `json:"build_url,omitempty"`
	Offset      int64     `json:"offset,omitempty"`
	MoreData    bool      `json:"more_data,omitempty"`
	Result      string    `json:"result,omitempty"`
	OrderStatus string    `json:"order_status,omitempty"`
}

type StreamReleaseOrderLogInput struct {
	ReleaseOrderID string
	StartOffset    int64
	PollInterval   time.Duration
}

type ReleaseOrderLogStreamer struct {
	releaseRepo  releasedomain.Repository
	pipelineRepo pipelinedomain.Repository
	jenkins      JenkinsReleaseLogClient
	now          func() time.Time
}

func NewReleaseOrderLogStreamer(
	releaseRepo releasedomain.Repository,
	pipelineRepo pipelinedomain.Repository,
	jenkins JenkinsReleaseLogClient,
) *ReleaseOrderLogStreamer {
	return &ReleaseOrderLogStreamer{
		releaseRepo:  releaseRepo,
		pipelineRepo: pipelineRepo,
		jenkins:      jenkins,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *ReleaseOrderLogStreamer) Stream(
	ctx context.Context,
	input StreamReleaseOrderLogInput,
	emit func(event ReleaseOrderLogEvent) error,
) error {
	if uc == nil || uc.releaseRepo == nil || uc.pipelineRepo == nil || uc.jenkins == nil {
		return fmt.Errorf("%w: log streamer is not configured", ErrInvalidInput)
	}
	if emit == nil {
		return fmt.Errorf("%w: event sink is required", ErrInvalidInput)
	}

	releaseOrderID := strings.TrimSpace(input.ReleaseOrderID)
	if releaseOrderID == "" {
		return ErrInvalidID
	}

	pollInterval := input.PollInterval
	if pollInterval <= 0 {
		pollInterval = 2 * time.Second
	}

	offset := input.StartOffset
	if offset < 0 {
		offset = 0
	}

	order, err := uc.releaseRepo.GetByID(ctx, releaseOrderID)
	if err != nil {
		return err
	}

	binding, err := uc.pipelineRepo.GetBindingByID(ctx, order.BindingID)
	if err != nil {
		return err
	}
	if binding.Provider != pipelinedomain.ProviderJenkins {
		return fmt.Errorf("%w: only jenkins binding supports log stream", ErrInvalidInput)
	}

	queueURL := ""
	buildURL := ""
	lastStatusMessage := ""

	if err := emit(ReleaseOrderLogEvent{
		Type:      ReleaseOrderLogEventTypeStatus,
		Timestamp: uc.now(),
		Message:   "日志流已连接，等待 Jenkins 执行信息",
		Offset:    offset,
	}); err != nil {
		return err
	}

	for {
		if ctxErr := ctx.Err(); ctxErr != nil {
			return nil
		}

		order, err = uc.releaseRepo.GetByID(ctx, releaseOrderID)
		if err != nil {
			return err
		}

		steps, err := uc.releaseRepo.ListSteps(ctx, releaseOrderID)
		if err != nil {
			return err
		}

		if queueURL == "" {
			queueURL = extractQueueURLFromSteps(steps)
		}
		if buildURL == "" {
			buildURL = extractBuildURLFromSteps(steps)
		}

		if queueURL == "" && buildURL == "" {
			if order.Status.IsTerminal() {
				return uc.emitDone(emit, order, offset, "")
			}
			if err := uc.emitStatusOnce(emit, &lastStatusMessage, "等待 Jenkins 队列分配", queueURL, buildURL, offset); err != nil {
				return err
			}
			if err := sleepWithContext(ctx, pollInterval); err != nil {
				return nil
			}
			continue
		}

		if buildURL == "" {
			executableURL, cancelled, why, queueErr := uc.jenkins.GetQueueItem(ctx, queueURL)
			if queueErr != nil {
				if isResourceNotFoundError(queueErr) {
					if order.Status.IsTerminal() {
						return uc.emitDone(emit, order, offset, "")
					}
					if err := uc.emitStatusOnce(emit, &lastStatusMessage, "Jenkins 队列信息暂不可用，稍后自动重试", queueURL, buildURL, offset); err != nil {
						return err
					}
					if err := sleepWithContext(ctx, pollInterval); err != nil {
						return nil
					}
					continue
				}
				return fmt.Errorf("%w: query jenkins queue failed: %v", ErrInvalidInput, queueErr)
			}
			if cancelled {
				cancelMessage := "Jenkins 队列任务已取消"
				if strings.TrimSpace(why) != "" {
					cancelMessage += ": " + strings.TrimSpace(why)
				}
				if err := emit(ReleaseOrderLogEvent{
					Type:      ReleaseOrderLogEventTypeError,
					Timestamp: uc.now(),
					Message:   cancelMessage,
					QueueURL:  queueURL,
					Offset:    offset,
				}); err != nil {
					return err
				}
				return uc.emitDone(emit, order, offset, "CANCELLED")
			}

			buildURL = strings.TrimSpace(executableURL)
			if buildURL == "" {
				if order.Status.IsTerminal() {
					return uc.emitDone(emit, order, offset, "")
				}
				if err := uc.emitStatusOnce(emit, &lastStatusMessage, "Jenkins 排队中，等待分配构建任务", queueURL, buildURL, offset); err != nil {
					return err
				}
				if err := sleepWithContext(ctx, pollInterval); err != nil {
					return nil
				}
				continue
			}

			if err := uc.emitStatusOnce(emit, &lastStatusMessage, "Jenkins 已分配构建任务，开始拉取日志", queueURL, buildURL, offset); err != nil {
				return err
			}
		}

		content, nextOffset, moreData, logErr := uc.jenkins.GetBuildConsoleText(ctx, buildURL, offset)
		if logErr != nil {
			if isResourceNotFoundError(logErr) {
				if order.Status.IsTerminal() {
					return uc.emitDone(emit, order, offset, "")
				}
				if err := uc.emitStatusOnce(emit, &lastStatusMessage, "Jenkins 构建尚未产生日志，继续等待", queueURL, buildURL, offset); err != nil {
					return err
				}
				if err := sleepWithContext(ctx, pollInterval); err != nil {
					return nil
				}
				continue
			}
			return fmt.Errorf("%w: fetch jenkins logs failed: %v", ErrInvalidInput, logErr)
		}

		if nextOffset >= offset {
			offset = nextOffset
		}
		if content != "" {
			if err := emit(ReleaseOrderLogEvent{
				Type:      ReleaseOrderLogEventTypeLog,
				Timestamp: uc.now(),
				Content:   content,
				QueueURL:  queueURL,
				BuildURL:  buildURL,
				Offset:    offset,
				MoreData:  moreData,
			}); err != nil {
				return err
			}
		}

		building, result, statusErr := uc.jenkins.GetBuildStatus(ctx, buildURL)
		if statusErr != nil {
			if isResourceNotFoundError(statusErr) {
				if order.Status.IsTerminal() {
					return uc.emitDone(emit, order, offset, "")
				}
				if err := uc.emitStatusOnce(emit, &lastStatusMessage, "Jenkins 构建状态暂不可用，稍后重试", queueURL, buildURL, offset); err != nil {
					return err
				}
				if err := sleepWithContext(ctx, pollInterval); err != nil {
					return nil
				}
				continue
			}
			return fmt.Errorf("%w: query jenkins build status failed: %v", ErrInvalidInput, statusErr)
		}

		if !building {
			tailOffset, tailErr := uc.flushTailLogs(ctx, emit, queueURL, buildURL, offset)
			if tailErr != nil {
				return tailErr
			}
			offset = tailOffset
			return uc.emitDone(emit, order, offset, strings.TrimSpace(result))
		}

		if err := uc.emitStatusOnce(emit, &lastStatusMessage, "Jenkins 构建执行中", queueURL, buildURL, offset); err != nil {
			return err
		}
		if err := sleepWithContext(ctx, pollInterval); err != nil {
			return nil
		}
	}
}

func (uc *ReleaseOrderLogStreamer) flushTailLogs(
	ctx context.Context,
	emit func(event ReleaseOrderLogEvent) error,
	queueURL string,
	buildURL string,
	startOffset int64,
) (int64, error) {
	offset := startOffset
	for range 20 {
		if ctxErr := ctx.Err(); ctxErr != nil {
			return offset, nil
		}
		content, nextOffset, moreData, err := uc.jenkins.GetBuildConsoleText(ctx, buildURL, offset)
		if err != nil {
			if isResourceNotFoundError(err) {
				return offset, nil
			}
			return offset, fmt.Errorf("%w: fetch tail jenkins logs failed: %v", ErrInvalidInput, err)
		}
		if nextOffset >= offset {
			offset = nextOffset
		}
		if content != "" {
			if emitErr := emit(ReleaseOrderLogEvent{
				Type:      ReleaseOrderLogEventTypeLog,
				Timestamp: uc.now(),
				Content:   content,
				QueueURL:  queueURL,
				BuildURL:  buildURL,
				Offset:    offset,
				MoreData:  moreData,
			}); emitErr != nil {
				return offset, emitErr
			}
		}
		if !moreData {
			return offset, nil
		}
	}
	return offset, nil
}

func (uc *ReleaseOrderLogStreamer) emitDone(
	emit func(event ReleaseOrderLogEvent) error,
	order releasedomain.ReleaseOrder,
	offset int64,
	result string,
) error {
	normalizedResult := strings.ToUpper(strings.TrimSpace(result))
	if normalizedResult == "" {
		normalizedResult = orderResultFromStatus(order.Status)
	}
	message := "发布执行结束"
	if normalizedResult != "" {
		message = "发布执行结束，结果: " + normalizedResult
	}
	return emit(ReleaseOrderLogEvent{
		Type:        ReleaseOrderLogEventTypeDone,
		Timestamp:   uc.now(),
		Message:     message,
		Result:      normalizedResult,
		OrderStatus: string(order.Status),
		Offset:      offset,
	})
}

func (uc *ReleaseOrderLogStreamer) emitStatusOnce(
	emit func(event ReleaseOrderLogEvent) error,
	lastMessage *string,
	message string,
	queueURL string,
	buildURL string,
	offset int64,
) error {
	current := strings.TrimSpace(message)
	if current == "" {
		return nil
	}
	if lastMessage != nil && *lastMessage == current {
		return nil
	}
	if lastMessage != nil {
		*lastMessage = current
	}
	return emit(ReleaseOrderLogEvent{
		Type:      ReleaseOrderLogEventTypeStatus,
		Timestamp: uc.now(),
		Message:   current,
		QueueURL:  queueURL,
		BuildURL:  buildURL,
		Offset:    offset,
	})
}

func sleepWithContext(ctx context.Context, d time.Duration) error {
	timer := time.NewTimer(d)
	defer timer.Stop()

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		return nil
	}
}

func orderResultFromStatus(status releasedomain.OrderStatus) string {
	switch status {
	case releasedomain.OrderStatusSuccess:
		return "SUCCESS"
	case releasedomain.OrderStatusFailed:
		return "FAILED"
	case releasedomain.OrderStatusCancelled:
		return "CANCELLED"
	case releasedomain.OrderStatusRunning:
		return "RUNNING"
	case releasedomain.OrderStatusPending:
		return "PENDING"
	default:
		return strings.ToUpper(strings.TrimSpace(string(status)))
	}
}
