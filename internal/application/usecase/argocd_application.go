package usecase

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	domain "gos/internal/domain/argocdapp"
)

type ArgoCDApplicationClient interface {
	Ping(ctx context.Context) error
	ListApplications(ctx context.Context) ([]ArgoCDApplicationSnapshot, error)
	GetApplication(ctx context.Context, name string) (ArgoCDApplicationSnapshot, error)
	SyncApplication(ctx context.Context, name string) error
	BuildApplicationURL(name string) string
}

type ArgoCDApplicationSnapshot interface {
	GetName() string
	GetProject() string
	GetRepoURL() string
	GetSourcePath() string
	GetTargetRevision() string
	GetDestServer() string
	GetDestNamespace() string
	GetSyncStatus() string
	GetHealthStatus() string
	GetOperationPhase() string
	GetRawMeta() string
}

type SyncArgoCDApplications struct {
	repo   domain.Repository
	client ArgoCDApplicationClient
	now    func() time.Time
}

type SyncArgoCDApplicationsOutput struct {
	Total       int `json:"total"`
	Created     int `json:"created"`
	Updated     int `json:"updated"`
	Inactivated int `json:"inactivated"`
}

type QueryArgoCDApplications struct {
	repo    domain.Repository
	client  ArgoCDApplicationClient
	baseURL string
}

type ArgoCDApplicationOriginalLinkOutput struct {
	Application  domain.Application `json:"application"`
	OriginalLink string             `json:"original_link"`
}

func NewSyncArgoCDApplications(repo domain.Repository, client ArgoCDApplicationClient) *SyncArgoCDApplications {
	return &SyncArgoCDApplications{
		repo:   repo,
		client: client,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func NewQueryArgoCDApplications(repo domain.Repository, client ArgoCDApplicationClient, baseURL string) *QueryArgoCDApplications {
	return &QueryArgoCDApplications{
		repo:    repo,
		client:  client,
		baseURL: strings.TrimRight(strings.TrimSpace(baseURL), "/"),
	}
}

func (uc *SyncArgoCDApplications) Execute(ctx context.Context) (SyncArgoCDApplicationsOutput, error) {
	if uc == nil || uc.repo == nil || uc.client == nil {
		return SyncArgoCDApplicationsOutput{}, fmt.Errorf("%w: argocd syncer is not configured", ErrInvalidInput)
	}
	items, err := uc.client.ListApplications(ctx)
	if err != nil {
		return SyncArgoCDApplicationsOutput{}, err
	}
	now := uc.now()
	models := make([]domain.Application, 0, len(items))
	keepNames := make([]string, 0, len(items))
	for _, item := range items {
		name := strings.TrimSpace(item.GetName())
		if name == "" {
			continue
		}
		keepNames = append(keepNames, name)
		models = append(models, domain.Application{
			ID:             argocdApplicationID(name),
			AppName:        name,
			Project:        strings.TrimSpace(item.GetProject()),
			RepoURL:        strings.TrimSpace(item.GetRepoURL()),
			SourcePath:     strings.TrimSpace(item.GetSourcePath()),
			TargetRevision: strings.TrimSpace(item.GetTargetRevision()),
			DestServer:     strings.TrimSpace(item.GetDestServer()),
			DestNamespace:  strings.TrimSpace(item.GetDestNamespace()),
			SyncStatus:     strings.TrimSpace(item.GetSyncStatus()),
			HealthStatus:   strings.TrimSpace(item.GetHealthStatus()),
			OperationPhase: strings.TrimSpace(item.GetOperationPhase()),
			ArgoCDURL:      uc.client.BuildApplicationURL(name),
			Status:         domain.StatusActive,
			RawMeta:        strings.TrimSpace(item.GetRawMeta()),
			LastSyncedAt:   now,
			CreatedAt:      now,
			UpdatedAt:      now,
		})
	}
	created, updated, err := uc.repo.UpsertApplications(ctx, models)
	if err != nil {
		return SyncArgoCDApplicationsOutput{}, err
	}
	inactivated, err := uc.repo.MarkMissingApplicationsInactive(ctx, keepNames, now)
	if err != nil {
		return SyncArgoCDApplicationsOutput{}, err
	}
	return SyncArgoCDApplicationsOutput{
		Total:       len(models),
		Created:     created,
		Updated:     updated,
		Inactivated: inactivated,
	}, nil
}

func (uc *QueryArgoCDApplications) List(ctx context.Context, filter domain.ListFilter) ([]domain.Application, int64, error) {
	if uc == nil || uc.repo == nil {
		return nil, 0, fmt.Errorf("%w: argocd query service is not configured", ErrInvalidInput)
	}
	filter.AppName = strings.TrimSpace(filter.AppName)
	filter.Project = strings.TrimSpace(filter.Project)
	filter.SyncStatus = strings.TrimSpace(filter.SyncStatus)
	filter.HealthStatus = strings.TrimSpace(filter.HealthStatus)
	if filter.Status != "" && !filter.Status.Valid() {
		return nil, 0, ErrInvalidStatus
	}
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.PageSize <= 0 {
		filter.PageSize = 20
	}
	if filter.PageSize > 100 {
		filter.PageSize = 100
	}
	return uc.repo.ListApplications(ctx, filter)
}

func (uc *QueryArgoCDApplications) GetByID(ctx context.Context, id string) (domain.Application, error) {
	if uc == nil || uc.repo == nil {
		return domain.Application{}, fmt.Errorf("%w: argocd query service is not configured", ErrInvalidInput)
	}
	if strings.TrimSpace(id) == "" {
		return domain.Application{}, ErrInvalidID
	}
	return uc.repo.GetApplicationByID(ctx, id)
}

func (uc *QueryArgoCDApplications) GetOriginalLink(ctx context.Context, id string) (ArgoCDApplicationOriginalLinkOutput, error) {
	item, err := uc.GetByID(ctx, id)
	if err != nil {
		return ArgoCDApplicationOriginalLinkOutput{}, err
	}
	link := ""
	if uc.client != nil {
		link = uc.client.BuildApplicationURL(item.AppName)
	}
	if strings.TrimSpace(link) == "" && strings.TrimSpace(uc.baseURL) != "" {
		link = strings.TrimRight(uc.baseURL, "/") + "/applications/" + item.AppName
	}
	if strings.TrimSpace(link) == "" {
		return ArgoCDApplicationOriginalLinkOutput{}, fmt.Errorf("%w: argocd original link is unavailable", ErrInvalidInput)
	}
	return ArgoCDApplicationOriginalLinkOutput{Application: item, OriginalLink: link}, nil
}

type argoCDApplicationSnapshotAdapter struct {
	Name           string
	Project        string
	RepoURL        string
	SourcePath     string
	TargetRevision string
	DestServer     string
	DestNamespace  string
	SyncStatus     string
	HealthStatus   string
	OperationPhase string
	RawMeta        string
}

func (a argoCDApplicationSnapshotAdapter) GetName() string           { return a.Name }
func (a argoCDApplicationSnapshotAdapter) GetProject() string        { return a.Project }
func (a argoCDApplicationSnapshotAdapter) GetRepoURL() string        { return a.RepoURL }
func (a argoCDApplicationSnapshotAdapter) GetSourcePath() string     { return a.SourcePath }
func (a argoCDApplicationSnapshotAdapter) GetTargetRevision() string { return a.TargetRevision }
func (a argoCDApplicationSnapshotAdapter) GetDestServer() string     { return a.DestServer }
func (a argoCDApplicationSnapshotAdapter) GetDestNamespace() string  { return a.DestNamespace }
func (a argoCDApplicationSnapshotAdapter) GetSyncStatus() string     { return a.SyncStatus }
func (a argoCDApplicationSnapshotAdapter) GetHealthStatus() string   { return a.HealthStatus }
func (a argoCDApplicationSnapshotAdapter) GetOperationPhase() string { return a.OperationPhase }
func (a argoCDApplicationSnapshotAdapter) GetRawMeta() string        { return a.RawMeta }

func argocdApplicationID(name string) string {
	hash := sha1.Sum([]byte(strings.TrimSpace(name)))
	return "argocd-app-" + hex.EncodeToString(hash[:])[:24]
}
