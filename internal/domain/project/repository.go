package project

import (
	"context"
	"time"
)

type Repository interface {
	Create(ctx context.Context, item Project) error
	GetByID(ctx context.Context, id string) (Project, error)
	List(ctx context.Context, filter ListFilter) ([]Project, int64, error)
	Update(ctx context.Context, id string, input UpdateInput, updatedAt time.Time) (Project, error)
	Delete(ctx context.Context, id string) error
	InitSchema(ctx context.Context) error
}

type ListFilter struct {
	Key      string
	Name     string
	Status   Status
	Page     int
	PageSize int
}

type UpdateInput struct {
	Name        string
	Key         string
	Description string
	Status      Status
}
