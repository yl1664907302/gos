package usecase

import (
	"context"
	"strings"

	domain "gos/internal/domain/application"
)

type QueryApplication struct {
	repo domain.Repository
}

func NewQueryApplication(repo domain.Repository) *QueryApplication {
	return &QueryApplication{repo: repo}
}

func (uc *QueryApplication) GetByID(ctx context.Context, id string) (domain.Application, error) {
	if strings.TrimSpace(id) == "" {
		return domain.Application{}, ErrInvalidID
	}
	return uc.repo.GetByID(ctx, id)
}

func (uc *QueryApplication) List(ctx context.Context, filter domain.ListFilter) ([]domain.Application, error) {
	filter.Key = strings.TrimSpace(filter.Key)
	filter.Name = strings.TrimSpace(filter.Name)
	if filter.Status != "" && !filter.Status.Valid() {
		return nil, ErrInvalidStatus
	}
	return uc.repo.List(ctx, filter)
}
