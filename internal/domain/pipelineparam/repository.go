package pipelineparam

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	Upsert(ctx context.Context, items []PipelineParamDef) (created int, updated int, err error)
	MarkMissingInactive(ctx context.Context, executorType ExecutorType, keepIDs []string, updatedAt time.Time) (int, error)
	ListByPipeline(ctx context.Context, filter ListFilter) ([]PipelineParamDef, int64, error)
	GetByID(ctx context.Context, id string) (PipelineParamDef, error)
	UpdateParamKey(ctx context.Context, id string, paramKey string, updatedAt time.Time) (PipelineParamDef, error)
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
