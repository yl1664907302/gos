package usecase

import (
	"context"
	"fmt"
	"strings"
	"time"

	domain "gos/internal/domain/application"
)

type CreateApplication struct {
	repo domain.Repository
	now  func() time.Time
}

func NewCreateApplication(repo domain.Repository) *CreateApplication {
	return &CreateApplication{
		repo: repo,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *CreateApplication) Execute(ctx context.Context, input CreateInput) (domain.Application, error) {
	if strings.TrimSpace(input.Name) == "" || strings.TrimSpace(input.Key) == "" {
		return domain.Application{}, fmt.Errorf("%w: name and key are required", ErrInvalidInput)
	}
	if input.Status != "" && !input.Status.Valid() {
		return domain.Application{}, ErrInvalidStatus
	}

	status := input.Status
	if status == "" {
		status = domain.StatusActive
	}

	now := uc.now()
	app := domain.Application{
		ID:           generateID("app"),
		Name:         strings.TrimSpace(input.Name),
		Key:          strings.TrimSpace(input.Key),
		RepoURL:      strings.TrimSpace(input.RepoURL),
		Description:  strings.TrimSpace(input.Description),
		Owner:        strings.TrimSpace(input.Owner),
		Status:       status,
		ArtifactType: strings.TrimSpace(input.ArtifactType),
		CreatedAt:    now,
		UpdatedAt:    now,
	}
	app.SetLanguage(strings.TrimSpace(input.Language))

	if err := uc.repo.Create(ctx, app); err != nil {
		return domain.Application{}, err
	}
	return app, nil
}
