package pipeline

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	UpsertPipelines(ctx context.Context, items []Pipeline) (created int, updated int, err error)
	ListPipelines(ctx context.Context, filter PipelineListFilter) ([]Pipeline, int64, error)
	GetPipelineByID(ctx context.Context, id string) (Pipeline, error)
	MarkPipelineVerified(ctx context.Context, id string, verifiedAt time.Time, updatedAt time.Time) (Pipeline, error)

	CreateBinding(ctx context.Context, binding PipelineBinding) error
	ListBindingsByApplication(ctx context.Context, filter BindingListFilter) ([]PipelineBinding, int64, error)
	GetBindingByID(ctx context.Context, id string) (PipelineBinding, error)
	UpdateBinding(ctx context.Context, id string, input BindingUpdateInput, updatedAt time.Time) (PipelineBinding, error)
	DeleteBinding(ctx context.Context, id string) error
}

type PipelineListFilter struct {
	Name     string
	Provider Provider
	Status   Status
	Page     int
	PageSize int
}

type BindingListFilter struct {
	ApplicationID string
	BindingType   BindingType
	Provider      Provider
	Status        Status
	Page          int
	PageSize      int
}

type BindingUpdateInput struct {
	Name        string
	Provider    Provider
	PipelineID  string
	ExternalRef string
	TriggerMode TriggerMode
	Status      Status
}
