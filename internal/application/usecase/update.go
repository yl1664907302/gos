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
		Name:                 strings.TrimSpace(input.Name),
		Key:                  strings.TrimSpace(input.Key),
		RepoURL:              strings.TrimSpace(input.RepoURL),
		Description:          strings.TrimSpace(input.Description),
		OwnerUserID:          strings.TrimSpace(input.OwnerUserID),
		Owner:                strings.TrimSpace(input.Owner),
		Status:               input.Status,
		ArtifactType:         strings.TrimSpace(input.ArtifactType),
		Language:             strings.TrimSpace(input.Language),
		GitOpsBranchMappings: normalizeGitOpsBranchMappings(input.GitOpsBranchMappings),
	}
	return uc.repo.Update(ctx, id, clean, uc.now())
}

func normalizeGitOpsBranchMappings(values []domain.GitOpsBranchMapping) []domain.GitOpsBranchMapping {
	if len(values) == 0 {
		return nil
	}
	result := make([]domain.GitOpsBranchMapping, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, item := range values {
		envCode := strings.TrimSpace(item.EnvCode)
		branch := strings.TrimSpace(item.Branch)
		if envCode == "" || branch == "" {
			continue
		}
		key := strings.ToLower(envCode)
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, domain.GitOpsBranchMapping{
			EnvCode: envCode,
			Branch:  branch,
		})
	}
	if len(result) == 0 {
		return nil
	}
	return result
}
