package platformparam

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	Create(ctx context.Context, item PlatformParamDict) error
	GetByID(ctx context.Context, id string) (PlatformParamDict, error)
	GetByParamKey(ctx context.Context, paramKey string) (PlatformParamDict, error)
	List(ctx context.Context, filter ListFilter) ([]PlatformParamDict, int64, error)
	Update(ctx context.Context, id string, input UpdateInput, updatedAt time.Time) (PlatformParamDict, error)
	Delete(ctx context.Context, id string) error
}

type ListFilter struct {
	ParamKey      string
	Name          string
	Status        *Status
	Builtin       *bool
	GitOpsLocator *bool
	Page          int
	PageSize      int
}

type UpdateInput struct {
	ParamKey      string
	Name          string
	Description   string
	ParamType     ParamType
	Required      bool
	GitOpsLocator bool
	Builtin       bool
	Status        Status
}
