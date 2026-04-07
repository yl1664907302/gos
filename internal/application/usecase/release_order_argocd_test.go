package usecase

import (
	"context"
	"testing"
	"time"

	appdomain "gos/internal/domain/application"
	argocddomain "gos/internal/domain/argocdapp"
	releasedomain "gos/internal/domain/release"
)

type applicationRepositoryStub struct {
	app appdomain.Application
	err error
}

func (s applicationRepositoryStub) Create(context.Context, appdomain.Application) error {
	return nil
}

func (s applicationRepositoryStub) GetByID(context.Context, string) (appdomain.Application, error) {
	if s.err != nil {
		return appdomain.Application{}, s.err
	}
	return s.app, nil
}

func (s applicationRepositoryStub) List(context.Context, appdomain.ListFilter) ([]appdomain.Application, int64, error) {
	return nil, 0, nil
}

func (s applicationRepositoryStub) Update(context.Context, string, appdomain.UpdateInput, time.Time) (appdomain.Application, error) {
	return appdomain.Application{}, nil
}

func (s applicationRepositoryStub) Delete(context.Context, string) error {
	return nil
}

func (s applicationRepositoryStub) InitSchema(context.Context) error {
	return nil
}

type argoAppSnapshotStub struct {
	targetRevision string
}

func (s argoAppSnapshotStub) GetName() string           { return "demo" }
func (s argoAppSnapshotStub) GetProject() string        { return "" }
func (s argoAppSnapshotStub) GetRepoURL() string        { return "" }
func (s argoAppSnapshotStub) GetSourcePath() string     { return "" }
func (s argoAppSnapshotStub) GetTargetRevision() string { return s.targetRevision }
func (s argoAppSnapshotStub) GetDestServer() string     { return "" }
func (s argoAppSnapshotStub) GetDestNamespace() string  { return "" }
func (s argoAppSnapshotStub) GetSyncStatus() string     { return "" }
func (s argoAppSnapshotStub) GetHealthStatus() string   { return "" }
func (s argoAppSnapshotStub) GetOperationPhase() string { return "" }
func (s argoAppSnapshotStub) GetRawMeta() string        { return "" }

func TestResolveGitOpsTargetBranchUsesApplicationMapping(t *testing.T) {
	manager := &ReleaseOrderManager{
		appRepo: applicationRepositoryStub{
			app: appdomain.Application{
				ID:  "app-1",
				Key: "java-nantong-test",
				GitOpsBranchMappings: []appdomain.GitOpsBranchMapping{
					{EnvCode: "prod", Branch: "java-nantong-test-prod"},
				},
			},
		},
	}

	branch := manager.resolveGitOpsTargetBranch(
		context.Background(),
		releasedomain.ReleaseOrder{ApplicationID: "app-1", EnvCode: "prod"},
		nil,
		argocddomain.Instance{},
		argoAppSnapshotStub{targetRevision: "master"},
	)

	if branch != "java-nantong-test-prod" {
		t.Fatalf("expected mapped branch, got %q", branch)
	}
}

func TestResolveGitOpsTargetBranchDefaultsToAppKeyEnv(t *testing.T) {
	manager := &ReleaseOrderManager{
		appRepo: applicationRepositoryStub{
			app: appdomain.Application{
				ID:  "app-1",
				Key: "java-nantong-test",
			},
		},
	}

	branch := manager.resolveGitOpsTargetBranch(
		context.Background(),
		releasedomain.ReleaseOrder{ApplicationID: "app-1", EnvCode: "test"},
		nil,
		argocddomain.Instance{},
		argoAppSnapshotStub{targetRevision: "master"},
	)

	if branch != "java-nantong-test-test" {
		t.Fatalf("expected default app-env branch, got %q", branch)
	}
}

func TestBuildArgoCDSourcePathCandidatesPrefersHoistedHelmPath(t *testing.T) {
	items := buildArgoCDSourcePathCandidates("apps/java-nantong-test", "dev", releasedomain.GitOpsTypeHelm)
	if len(items) < 2 {
		t.Fatalf("expected multiple helm path candidates, got %v", items)
	}
	if items[0] != "apps/helm" {
		t.Fatalf("expected first candidate apps/helm, got %q", items[0])
	}
	if items[1] != "apps/java-nantong-test/helm" {
		t.Fatalf("expected second candidate old app helm path, got %q", items[1])
	}
}
