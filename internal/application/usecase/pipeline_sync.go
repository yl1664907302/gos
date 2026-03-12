package usecase

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"strings"
	"time"

	domain "gos/internal/domain/pipeline"
)

type JenkinsPipelineClient interface {
	ListJobs(ctx context.Context) ([]domain.JenkinsJob, error)
	GetJob(ctx context.Context, fullName string) (domain.JenkinsJob, error)
}

type SyncPipelines struct {
	repo    domain.Repository
	jenkins JenkinsPipelineClient
	now     func() time.Time
}

type SyncPipelinesOutput struct {
	Total   int `json:"total"`
	Created int `json:"created"`
	Updated int `json:"updated"`
	Skipped int `json:"skipped"`
}

func NewSyncPipelines(repo domain.Repository, jenkins JenkinsPipelineClient) *SyncPipelines {
	return &SyncPipelines{
		repo:    repo,
		jenkins: jenkins,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *SyncPipelines) Execute(ctx context.Context) (SyncPipelinesOutput, error) {
	jobs, err := uc.jenkins.ListJobs(ctx)
	if err != nil {
		return SyncPipelinesOutput{}, err
	}

	now := uc.now()
	items := make([]domain.Pipeline, 0, len(jobs))
	seen := make(map[string]struct{}, len(jobs))
	skipped := 0

	for _, job := range jobs {
		fullName := strings.Trim(strings.TrimSpace(job.FullName), "/")
		if fullName == "" {
			skipped++
			continue
		}
		if _, exists := seen[fullName]; exists {
			skipped++
			continue
		}
		seen[fullName] = struct{}{}

		items = append(items, domain.Pipeline{
			ID:            pipelineID(string(domain.ProviderJenkins), fullName),
			Provider:      domain.ProviderJenkins,
			JobFullName:   fullName,
			JobName:       strings.TrimSpace(job.Name),
			JobURL:        strings.TrimSpace(job.URL),
			Description:   "",
			CredentialRef: "",
			DefaultBranch: "",
			Status:        domain.StatusActive,
			LastSyncedAt:  now,
			CreatedAt:     now,
			UpdatedAt:     now,
		})
	}

	created, updated, err := uc.repo.UpsertPipelines(ctx, items)
	if err != nil {
		return SyncPipelinesOutput{}, err
	}

	return SyncPipelinesOutput{
		Total:   len(items),
		Created: created,
		Updated: updated,
		Skipped: skipped,
	}, nil
}

func pipelineID(provider, fullName string) string {
	sum := sha1.Sum([]byte(provider + ":" + fullName))
	return "pln-" + hex.EncodeToString(sum[:12])
}
