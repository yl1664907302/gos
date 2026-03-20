package gitops

import "context"

type Repository interface {
	InitSchema(ctx context.Context) error

	UpsertInstance(ctx context.Context, item Instance) (Instance, error)
	CreateInstance(ctx context.Context, item Instance) (Instance, error)
	UpdateInstance(ctx context.Context, item Instance) (Instance, error)
	GetInstanceByID(ctx context.Context, id string) (Instance, error)
	GetInstanceByCode(ctx context.Context, code string) (Instance, error)
	ListInstances(ctx context.Context, filter InstanceListFilter) ([]Instance, int64, error)
	ListActiveInstances(ctx context.Context) ([]Instance, error)
}
