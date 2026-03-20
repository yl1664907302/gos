package argocdapp

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	CleanupLegacyApplications(ctx context.Context) error

	UpsertInstance(ctx context.Context, item Instance) (Instance, error)
	CreateInstance(ctx context.Context, item Instance) (Instance, error)
	UpdateInstance(ctx context.Context, item Instance) (Instance, error)
	GetInstanceByID(ctx context.Context, id string) (Instance, error)
	GetInstanceByCode(ctx context.Context, code string) (Instance, error)
	ListInstances(ctx context.Context, filter InstanceListFilter) ([]Instance, int64, error)
	ListActiveInstances(ctx context.Context) ([]Instance, error)
	UpdateInstanceHealth(ctx context.Context, id string, healthStatus string, checkedAt time.Time) error

	ListEnvBindings(ctx context.Context) ([]EnvBinding, error)
	ReplaceEnvBindings(ctx context.Context, items []EnvBinding) error
	ResolveInstanceByEnv(ctx context.Context, envCode string) (Instance, error)

	UpsertApplications(ctx context.Context, items []Application) (created int, updated int, err error)
	MarkMissingApplicationsInactive(ctx context.Context, argocdInstanceID string, keepNames []string, updatedAt time.Time) (int, error)
	ListApplications(ctx context.Context, filter ListFilter) ([]Application, int64, error)
	GetApplicationByID(ctx context.Context, id string) (Application, error)
}
