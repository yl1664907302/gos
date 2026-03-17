package executorparam

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	Upsert(ctx context.Context, items []ExecutorParamDef) (created int, updated int, err error)
	MarkMissingInactive(ctx context.Context, executorType ExecutorType, keepIDs []string, updatedAt time.Time) (int, error)
	ListByPipeline(ctx context.Context, filter ListFilter) ([]ExecutorParamDef, int64, error)
	GetByID(ctx context.Context, id string) (ExecutorParamDef, error)
	UpdateParamKey(ctx context.Context, id string, paramKey string, updatedAt time.Time) (ExecutorParamDef, error)
	CountByParamKey(ctx context.Context, paramKey string) (int64, error)
}

type ListFilter struct {
	PipelineID   string
	ExecutorType ExecutorType
	Visible      *bool
	Editable     *bool
	ParamKey     string
	Status       Status
	Page         int
	PageSize     int
}
