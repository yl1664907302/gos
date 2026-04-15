package usecase

import (
	"context"
	"testing"
	"time"

	domain "gos/internal/domain/release"
)

func TestCreateStandardRollbackByOrderPreservesTemplateHooks(t *testing.T) {
	t.Parallel()

	manager, repo := newReleaseOrderManagerForCancelTest(t)
	ctx := context.Background()
	now := time.Now().UTC()
	manager.now = func() time.Time { return now }

	template := domain.ReleaseTemplate{
		ID:              "rt-rollback",
		Name:            "rollback-template",
		ApplicationID:   "app-1",
		ApplicationName: "App 1",
		BindingID:       "app-1",
		BindingName:     "App 1",
		BindingType:     "application",
		GitOpsType:      domain.GitOpsTypeHelm,
		Status:          domain.TemplateStatusActive,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	bindings := []domain.ReleaseTemplateBinding{
		{
			ID:            "rtb-cd",
			TemplateID:    template.ID,
			PipelineScope: domain.PipelineScopeCD,
			BindingID:     "binding-cd",
			BindingName:   "ArgoCD",
			Provider:      "argocd",
			PipelineID:    "argocd-app",
			Enabled:       true,
			SortNo:        1,
			CreatedAt:     now,
			UpdatedAt:     now,
		},
	}
	hooks := []domain.ReleaseTemplateHook{
		{
			ID:               "hook-1",
			TemplateID:       template.ID,
			HookType:         domain.TemplateHookTypeWebhookNotification,
			Name:             "rollback notify",
			TriggerCondition: domain.TemplateHookTriggerAlways,
			FailurePolicy:    domain.TemplateHookFailurePolicyWarnOnly,
			WebhookMethod:    "POST",
			WebhookURL:       "https://example.com/hook",
			WebhookBody:      "{}",
			SortNo:           1,
			CreatedAt:        now,
			UpdatedAt:        now,
		},
	}
	if err := repo.CreateTemplate(ctx, template, bindings, nil, nil, hooks); err != nil {
		t.Fatalf("CreateTemplate failed: %v", err)
	}

	sourceOrder := testReleaseOrder("ro-source", "RO-SOURCE", domain.OrderStatusSuccess, now)
	sourceOrder.TemplateID = template.ID
	sourceOrder.TemplateName = template.Name
	sourceOrder.BindingID = "binding-cd"
	sourceExecution := domain.ReleaseOrderExecution{
		ID:             "exec-source-cd",
		ReleaseOrderID: sourceOrder.ID,
		PipelineScope:  domain.PipelineScopeCD,
		BindingID:      "binding-cd",
		BindingName:    "ArgoCD",
		Provider:       "argocd",
		PipelineID:     "argocd-app",
		Status:         domain.ExecutionStatusSuccess,
		CreatedAt:      now,
		UpdatedAt:      now,
	}
	if err := repo.Create(ctx, sourceOrder, []domain.ReleaseOrderExecution{sourceExecution}, nil, nil); err != nil {
		t.Fatalf("Create source order failed: %v", err)
	}
	if err := repo.CreateDeploySnapshot(ctx, domain.DeploySnapshot{
		ID:              "snapshot-1",
		ReleaseOrderID:  sourceOrder.ID,
		Provider:        "argocd",
		GitOpsType:      domain.GitOpsTypeHelm,
		RepoURL:         "https://example.com/repo.git",
		Branch:          "demo-prod",
		SourcePath:      "apps/demo/helm",
		EnvCode:         "prod",
		SnapshotPayload: `{"image_version":"175"}`,
		CreatedAt:       now,
	}); err != nil {
		t.Fatalf("CreateDeploySnapshot failed: %v", err)
	}

	rollbackOrder, err := manager.CreateStandardRollbackByOrder(ctx, sourceOrder.ID, "tester", "tester")
	if err != nil {
		t.Fatalf("CreateStandardRollbackByOrder failed: %v", err)
	}

	steps, err := repo.ListSteps(ctx, rollbackOrder.ID)
	if err != nil {
		t.Fatalf("ListSteps failed: %v", err)
	}

	foundHook := false
	for _, step := range steps {
		if step.StepCode == "hook:post_release:webhook_notification:1" || step.StepCode == "hook:webhook_notification:1" {
			foundHook = true
			if step.StepName != "rollback notify" {
				t.Fatalf("hook step name = %q, want %q", step.StepName, "rollback notify")
			}
		}
	}
	if !foundHook {
		t.Fatalf("expected rollback order %s to preserve hook step, got steps: %#v", rollbackOrder.ID, steps)
	}
}
