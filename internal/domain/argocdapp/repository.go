package argocdapp

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	UpsertApplications(ctx context.Context, items []Application) (created int, updated int, err error)
	MarkMissingApplicationsInactive(ctx context.Context, keepNames []string, updatedAt time.Time) (int, error)
	ListApplications(ctx context.Context, filter ListFilter) ([]Application, int64, error)
	GetApplicationByID(ctx context.Context, id string) (Application, error)
}
