package usecase

import (
	"context"
	"strings"

	domain "gos/internal/domain/application"
)

type DeleteApplication struct {
	repo domain.Repository
}

func NewDeleteApplication(repo domain.Repository) *DeleteApplication {
	return &DeleteApplication{repo: repo}
}

func (uc *DeleteApplication) Execute(ctx context.Context, id string) error {
	if strings.TrimSpace(id) == "" {
		return ErrInvalidID
	}
	return uc.repo.Delete(ctx, id)
}
