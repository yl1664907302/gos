package sqlrepo

import (
	"context"
	"database/sql"
	"errors"
	"testing"
	"time"

	domain "gos/internal/domain/agent"

	_ "modernc.org/sqlite"
)

func TestClaimNextPendingTask_RequeuesStaleClaimedTask(t *testing.T) {
	t.Parallel()

	repo := newTestAgentRepository(t)
	ctx := context.Background()
	now := time.Now().UTC()

	instance := domain.Instance{
		ID:              "agt-1",
		AgentCode:       "agent-1",
		Name:            "Agent 1",
		EnvironmentCode: "prod",
		WorkDir:         "/tmp/agent-1",
		Token:           "token-1",
		Status:          domain.StatusActive,
		LastTaskStatus:  domain.LastTaskStatusUnknown,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	if _, err := repo.CreateInstance(ctx, instance); err != nil {
		t.Fatalf("CreateInstance failed: %v", err)
	}

	staleClaimed := domain.Task{
		ID:         "task-stale",
		AgentID:    instance.ID,
		AgentCode:  instance.AgentCode,
		Name:       "stale claimed",
		TaskMode:   domain.TaskModeTemporary,
		TaskType:   string(domain.TaskTypeShellScript),
		ShellType:  "sh",
		WorkDir:    instance.WorkDir,
		ScriptText: "echo stale",
		Variables:  map[string]string{},
		TimeoutSec: 30,
		Status:     domain.TaskStatusClaimed,
		ClaimedAt:  timePtr(now.Add(-2 * time.Minute)),
		CreatedBy:  "test",
		CreatedAt:  now.Add(-2 * time.Minute),
		UpdatedAt:  now.Add(-2 * time.Minute),
	}
	if _, err := repo.CreateTask(ctx, staleClaimed); err != nil {
		t.Fatalf("CreateTask stale failed: %v", err)
	}

	pending := domain.Task{
		ID:         "task-pending",
		AgentID:    instance.ID,
		AgentCode:  instance.AgentCode,
		Name:       "pending task",
		TaskMode:   domain.TaskModeTemporary,
		TaskType:   string(domain.TaskTypeShellScript),
		ShellType:  "sh",
		WorkDir:    instance.WorkDir,
		ScriptText: "echo pending",
		Variables:  map[string]string{},
		TimeoutSec: 30,
		Status:     domain.TaskStatusPending,
		CreatedBy:  "test",
		CreatedAt:  now.Add(-time.Minute),
		UpdatedAt:  now.Add(-time.Minute),
	}
	if _, err := repo.CreateTask(ctx, pending); err != nil {
		t.Fatalf("CreateTask pending failed: %v", err)
	}

	claimedTask, claimed, err := repo.ClaimNextPendingTask(ctx, instance.ID, now)
	if err != nil {
		t.Fatalf("ClaimNextPendingTask failed: %v", err)
	}
	if !claimed {
		t.Fatalf("ClaimNextPendingTask claimed = false, want true")
	}
	if claimedTask.ID != pending.ID {
		t.Fatalf("ClaimNextPendingTask claimed %s, want %s", claimedTask.ID, pending.ID)
	}

	reloadedStale, err := repo.GetTaskByID(ctx, staleClaimed.ID)
	if err != nil {
		t.Fatalf("GetTaskByID stale failed: %v", err)
	}
	if reloadedStale.Status != domain.TaskStatusQueued {
		t.Fatalf("stale task status = %s, want %s", reloadedStale.Status, domain.TaskStatusQueued)
	}
	if reloadedStale.ClaimedAt != nil {
		t.Fatalf("stale task claimed_at = %v, want nil", reloadedStale.ClaimedAt)
	}
}

func TestMarkTaskRunning_RequiresClaimedStatus(t *testing.T) {
	t.Parallel()

	repo := newTestAgentRepository(t)
	ctx := context.Background()
	now := time.Now().UTC()

	instance := domain.Instance{
		ID:              "agt-2",
		AgentCode:       "agent-2",
		Name:            "Agent 2",
		EnvironmentCode: "prod",
		WorkDir:         "/tmp/agent-2",
		Token:           "token-2",
		Status:          domain.StatusActive,
		LastTaskStatus:  domain.LastTaskStatusUnknown,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	if _, err := repo.CreateInstance(ctx, instance); err != nil {
		t.Fatalf("CreateInstance failed: %v", err)
	}

	pending := domain.Task{
		ID:         "task-pending-only",
		AgentID:    instance.ID,
		AgentCode:  instance.AgentCode,
		Name:       "pending only",
		TaskMode:   domain.TaskModeTemporary,
		TaskType:   string(domain.TaskTypeShellScript),
		ShellType:  "sh",
		WorkDir:    instance.WorkDir,
		ScriptText: "echo pending",
		Variables:  map[string]string{},
		TimeoutSec: 30,
		Status:     domain.TaskStatusPending,
		CreatedBy:  "test",
		CreatedAt:  now,
		UpdatedAt:  now,
	}
	if _, err := repo.CreateTask(ctx, pending); err != nil {
		t.Fatalf("CreateTask failed: %v", err)
	}

	_, err := repo.MarkTaskRunning(ctx, pending.ID, now.Add(time.Second))
	if !errors.Is(err, domain.ErrTaskNotClaimable) {
		t.Fatalf("MarkTaskRunning error = %v, want %v", err, domain.ErrTaskNotClaimable)
	}
}

func newTestAgentRepository(t *testing.T) *AgentRepository {
	t.Helper()

	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("sql.Open failed: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })

	repo := NewAgentRepository(db, "sqlite")
	if err := repo.InitSchema(context.Background()); err != nil {
		t.Fatalf("InitSchema failed: %v", err)
	}
	return repo
}

func timePtr(value time.Time) *time.Time {
	return &value
}
