package sqlrepo

import (
	"context"
	"database/sql"
	"testing"
	"time"

	domain "gos/internal/domain/release"

	_ "modernc.org/sqlite"
)

func TestCountActiveOrdersByApplicationEnv_IncludesQueuedAndRunning(t *testing.T) {
	t.Parallel()

	repo := newTestReleaseRepository(t)
	ctx := context.Background()
	now := time.Now().UTC()

	activeQueued := newTestReleaseOrder("ro-queued", "RO-QUEUED", "app-1", "prod", domain.OrderStatusQueued, now)
	activeDeploying := newTestReleaseOrder("ro-deploying", "RO-DEPLOYING", "app-1", "prod", domain.OrderStatusDeploying, now.Add(time.Second))
	inactiveSuccess := newTestReleaseOrder("ro-success", "RO-SUCCESS", "app-1", "prod", domain.OrderStatusSuccess, now.Add(2*time.Second))
	otherApp := newTestReleaseOrder("ro-other", "RO-OTHER", "app-2", "prod", domain.OrderStatusDeploying, now.Add(3*time.Second))

	for _, item := range []domain.ReleaseOrder{activeQueued, activeDeploying, inactiveSuccess, otherApp} {
		if err := repo.Create(ctx, item, nil, nil, nil); err != nil {
			t.Fatalf("Create(%s) failed: %v", item.OrderNo, err)
		}
	}

	count, err := repo.CountActiveOrdersByApplicationEnv(ctx, "app-1", "prod", "")
	if err != nil {
		t.Fatalf("CountActiveOrdersByApplicationEnv failed: %v", err)
	}
	if count != 2 {
		t.Fatalf("CountActiveOrdersByApplicationEnv = %d, want 2", count)
	}
}

func TestFindActiveOrderByApplicationEnv_PrioritizesDeployingBeforeQueued(t *testing.T) {
	t.Parallel()

	repo := newTestReleaseRepository(t)
	ctx := context.Background()
	now := time.Now().UTC()

	queued := newTestReleaseOrder("ro-queued", "RO-QUEUED", "app-1", "prod", domain.OrderStatusQueued, now)
	deploying := newTestReleaseOrder("ro-deploying", "RO-DEPLOYING", "app-1", "prod", domain.OrderStatusDeploying, now.Add(time.Second))

	if err := repo.Create(ctx, queued, nil, nil, nil); err != nil {
		t.Fatalf("Create queued failed: %v", err)
	}
	if err := repo.Create(ctx, deploying, nil, nil, nil); err != nil {
		t.Fatalf("Create deploying failed: %v", err)
	}

	item, err := repo.FindActiveOrderByApplicationEnv(ctx, "app-1", "prod", "")
	if err != nil {
		t.Fatalf("FindActiveOrderByApplicationEnv failed: %v", err)
	}
	if item.ID != deploying.ID {
		t.Fatalf("FindActiveOrderByApplicationEnv returned %s, want %s", item.ID, deploying.ID)
	}
}

func TestList_VisibilityIncludesAppCreatorAndApprover(t *testing.T) {
	t.Parallel()

	repo := newTestReleaseRepository(t)
	ctx := context.Background()
	now := time.Now().UTC()

	appVisible := newTestReleaseOrder("ro-visible-app", "RO-VISIBLE-APP", "app-visible", "prod", domain.OrderStatusApproved, now)
	creatorVisible := newTestReleaseOrder("ro-visible-creator", "RO-VISIBLE-CREATOR", "app-hidden", "prod", domain.OrderStatusApproved, now.Add(time.Second))
	creatorVisible.CreatorUserID = "viewer"
	approverVisible := newTestReleaseOrder("ro-visible-approver", "RO-VISIBLE-APPROVER", "app-hidden", "prod", domain.OrderStatusApproved, now.Add(2*time.Second))
	approverVisible.ApprovalApproverIDs = []string{"viewer"}
	hidden := newTestReleaseOrder("ro-hidden", "RO-HIDDEN", "app-hidden", "prod", domain.OrderStatusApproved, now.Add(3*time.Second))

	for _, item := range []domain.ReleaseOrder{appVisible, creatorVisible, approverVisible, hidden} {
		if err := repo.Create(ctx, item, nil, nil, nil); err != nil {
			t.Fatalf("Create(%s) failed: %v", item.OrderNo, err)
		}
	}

	items, total, err := repo.List(ctx, domain.ListFilter{
		ApplicationIDs:  []string{"app-visible"},
		VisibleToUserID: "viewer",
		Page:            1,
		PageSize:        20,
	})
	if err != nil {
		t.Fatalf("List failed: %v", err)
	}
	if total != 3 {
		t.Fatalf("List total = %d, want 3", total)
	}
	got := make(map[string]struct{}, len(items))
	for _, item := range items {
		got[item.ID] = struct{}{}
	}
	for _, expected := range []string{appVisible.ID, creatorVisible.ID, approverVisible.ID} {
		if _, ok := got[expected]; !ok {
			t.Fatalf("expected visible order %s to be returned", expected)
		}
	}
	if _, ok := got[hidden.ID]; ok {
		t.Fatalf("did not expect hidden order %s to be returned", hidden.ID)
	}
}

func TestListApprovalRecordSummaries_VisibilityIncludesAppCreatorAndApprover(t *testing.T) {
	t.Parallel()

	repo := newTestReleaseRepository(t)
	ctx := context.Background()
	now := time.Now().UTC()

	appVisible := newTestReleaseOrder("ro-summary-app", "RO-SUMMARY-APP", "app-visible", "prod", domain.OrderStatusApproving, now)
	creatorVisible := newTestReleaseOrder("ro-summary-creator", "RO-SUMMARY-CREATOR", "app-hidden", "prod", domain.OrderStatusApproving, now.Add(time.Second))
	creatorVisible.CreatorUserID = "viewer"
	approverVisible := newTestReleaseOrder("ro-summary-approver", "RO-SUMMARY-APPROVER", "app-hidden", "prod", domain.OrderStatusApproving, now.Add(2*time.Second))
	approverVisible.ApprovalApproverIDs = []string{"viewer"}
	hidden := newTestReleaseOrder("ro-summary-hidden", "RO-SUMMARY-HIDDEN", "app-hidden", "prod", domain.OrderStatusApproving, now.Add(3*time.Second))

	for _, item := range []domain.ReleaseOrder{appVisible, creatorVisible, approverVisible, hidden} {
		if err := repo.Create(ctx, item, nil, nil, nil); err != nil {
			t.Fatalf("Create(%s) failed: %v", item.OrderNo, err)
		}
		if err := repo.CreateApprovalRecord(ctx, domain.ReleaseOrderApprovalRecord{
			ID:             "rec-" + item.ID,
			ReleaseOrderID: item.ID,
			Action:         domain.ReleaseOrderApprovalActionSubmit,
			OperatorUserID: "operator",
			OperatorName:   "operator",
			Comment:        "submitted",
			CreatedAt:      item.CreatedAt,
		}); err != nil {
			t.Fatalf("CreateApprovalRecord(%s) failed: %v", item.OrderNo, err)
		}
	}

	items, total, err := repo.ListApprovalRecordSummaries(ctx, domain.ApprovalRecordListFilter{
		ApplicationIDs:  []string{"app-visible"},
		VisibleToUserID: "viewer",
		Page:            1,
		PageSize:        20,
	})
	if err != nil {
		t.Fatalf("ListApprovalRecordSummaries failed: %v", err)
	}
	if total != 3 {
		t.Fatalf("ListApprovalRecordSummaries total = %d, want 3", total)
	}
	got := make(map[string]struct{}, len(items))
	for _, item := range items {
		got[item.ReleaseOrderID] = struct{}{}
	}
	for _, expected := range []string{appVisible.ID, creatorVisible.ID, approverVisible.ID} {
		if _, ok := got[expected]; !ok {
			t.Fatalf("expected visible summary %s to be returned", expected)
		}
	}
	if _, ok := got[hidden.ID]; ok {
		t.Fatalf("did not expect hidden summary %s to be returned", hidden.ID)
	}
}

func newTestReleaseRepository(t *testing.T) *ReleaseRepository {
	t.Helper()

	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("sql.Open failed: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })

	if _, err := db.Exec(`
CREATE TABLE IF NOT EXISTS sys_user (
	id TEXT PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	display_name TEXT NOT NULL,
	email TEXT NOT NULL DEFAULT '',
	phone TEXT NOT NULL DEFAULT '',
	role TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'active',
	password_hash TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);`); err != nil {
		t.Fatalf("create sys_user failed: %v", err)
	}

	repo := NewReleaseRepository(db, "sqlite")
	if err := repo.InitSchema(context.Background()); err != nil {
		t.Fatalf("InitSchema failed: %v", err)
	}
	return repo
}

func newTestReleaseOrder(id, orderNo, applicationID, envCode string, status domain.OrderStatus, createdAt time.Time) domain.ReleaseOrder {
	return domain.ReleaseOrder{
		ID:                  id,
		OrderNo:             orderNo,
		OperationType:       domain.OperationTypeDeploy,
		ApplicationID:       applicationID,
		ApplicationName:     applicationID,
		BindingID:           "binding-1",
		EnvCode:             envCode,
		TriggerType:         domain.TriggerTypeManual,
		Status:              status,
		ApprovalApproverIDs: []string{},
		CreatorUserID:       "tester",
		TriggeredBy:         "tester",
		CreatedAt:           createdAt,
		UpdatedAt:           createdAt,
	}
}
