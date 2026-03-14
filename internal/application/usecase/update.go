package usecase

import (
	"context"
	"fmt"
	"strings"
	"time"

	domain "gos/internal/domain/application"
)

type UpdateApplication struct {
	repo domain.Repository
	now  func() time.Time
}

func NewUpdateApplication(repo domain.Repository) *UpdateApplication {
	return &UpdateApplication{
		repo: repo,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *UpdateApplication) Execute(ctx context.Context, id string, input domain.UpdateInput) (domain.Application, error) {
	if strings.TrimSpace(id) == "" {
		return domain.Application{}, ErrInvalidID
	}
	if strings.TrimSpace(input.Name) == "" || strings.TrimSpace(input.Key) == "" {
		return domain.Application{}, fmt.Errorf("%w: name and key are required", ErrInvalidInput)
	}
	if strings.TrimSpace(input.ArtifactType) == "" || strings.TrimSpace(input.Language) == "" {
		return domain.Application{}, fmt.Errorf("%w: artifact_type and language are required", ErrInvalidInput)
	}
	if strings.TrimSpace(input.OwnerUserID) == "" {
		return domain.Application{}, fmt.Errorf("%w: owner_user_id is required", ErrInvalidInput)
	}
	if !input.Status.Valid() {
		return domain.Application{}, ErrInvalidStatus
	}

	clean := domain.UpdateInput{
		Name:         strings.TrimSpace(input.Name),
		Key:          strings.TrimSpace(input.Key),
		RepoURL:      strings.TrimSpace(input.RepoURL),
		Description:  strings.TrimSpace(input.Description),
		OwnerUserID:  strings.TrimSpace(input.OwnerUserID),
		Owner:        strings.TrimSpace(input.Owner),
		Status:       input.Status,
		ArtifactType: strings.TrimSpace(input.ArtifactType),
		Language:     strings.TrimSpace(input.Language),
	}
	return uc.repo.Update(ctx, id, clean, uc.now())
}
