package release

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	Create(ctx context.Context, order ReleaseOrder, params []ReleaseOrderParam, steps []ReleaseOrderStep) error
	GetByID(ctx context.Context, id string) (ReleaseOrder, error)
	List(ctx context.Context, filter ListFilter) ([]ReleaseOrder, int64, error)
	UpdateStatus(
		ctx context.Context,
		id string,
		status OrderStatus,
		startedAt *time.Time,
		finishedAt *time.Time,
		updatedAt time.Time,
	) (ReleaseOrder, error)
	ListParams(ctx context.Context, releaseOrderID string) ([]ReleaseOrderParam, error)
	ListSteps(ctx context.Context, releaseOrderID string) ([]ReleaseOrderStep, error)
	GetStepByCode(ctx context.Context, releaseOrderID string, stepCode string) (ReleaseOrderStep, error)
	UpdateStep(
		ctx context.Context,
		releaseOrderID string,
		stepCode string,
		input StepUpdateInput,
	) (ReleaseOrderStep, error)
}

type ListFilter struct {
	ApplicationID string
	BindingID     string
	EnvCode       string
	Status        OrderStatus
	TriggerType   TriggerType
	Page          int
	PageSize      int
}

type StepUpdateInput struct {
	Status     StepStatus
	Message    string
	StartedAt  *time.Time
	FinishedAt *time.Time
}
