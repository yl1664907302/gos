package usecase

import (
	"context"
	"database/sql"
	"testing"
	"time"

	agentdomain "gos/internal/domain/agent"
	"gos/internal/infrastructure/persistence/sqlrepo"

	_ "modernc.org/sqlite"
)

func TestExecuteBoundTemporaryTaskDispatchesToAllBoundAgents(t *testing.T) {
	t.Parallel()

	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("sql.Open failed: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })

	repo := sqlrepo.NewAgentRepository(db, "sqlite")
	ctx := context.Background()
	if err := repo.InitSchema(ctx); err != nil {
		t.Fatalf("InitSchema failed: %v", err)
	}

	now := time.Now().UTC()
	manager := NewAgentTaskManager(repo)
	manager.now = func() time.Time { return now }

	instances := []agentdomain.Instance{
		{
			ID:              "agt-1",
			AgentCode:       "agent-1",
			Name:            "Agent 1",
			EnvironmentCode: "prod",
			WorkDir:         "/tmp/agent-1",
			Token:           "token-1",
			Status:          agentdomain.StatusActive,
			LastTaskStatus:  agentdomain.LastTaskStatusUnknown,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
		{
			ID:              "agt-2",
			AgentCode:       "agent-2",
			Name:            "Agent 2",
			EnvironmentCode: "prod",
			WorkDir:         "/tmp/agent-2",
			Token:           "token-2",
			Status:          agentdomain.StatusActive,
			LastTaskStatus:  agentdomain.LastTaskStatusUnknown,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
	}
	for _, item := range instances {
		if _, err := repo.CreateInstance(ctx, item); err != nil {
			t.Fatalf("CreateInstance failed: %v", err)
		}
	}

	source, err := repo.CreateTask(ctx, agentdomain.Task{
		ID:             "agtask-source",
		Name:           "批量下载产物",
		TaskMode:       agentdomain.TaskModeTemporary,
		TaskType:       string(agentdomain.TaskTypeShellScript),
		ShellType:      "sh",
		WorkDir:        "/tmp/source",
		ScriptText:     "echo deploy",
		Variables:      map[string]string{"artifact_url": "https://example.com/app.jar"},
		TimeoutSec:     60,
		Status:         agentdomain.TaskStatusDraft,
		TargetAgentIDs: []string{instances[0].ID, instances[1].ID},
		CreatedBy:      "tester",
		CreatedAt:      now,
		UpdatedAt:      now,
	})
	if err != nil {
		t.Fatalf("CreateTask source failed: %v", err)
	}

	updated, err := manager.Execute(ctx, source.ID, ExecuteAgentTaskInput{})
	if err != nil {
		t.Fatalf("Execute failed: %v", err)
	}
	if updated.DispatchBatchID == "" {
		t.Fatal("DispatchBatchID = empty, want non-empty")
	}
	if updated.RunCount != 1 {
		t.Fatalf("RunCount = %d, want 1", updated.RunCount)
	}

	children, _, err := repo.ListTasks(ctx, agentdomain.TaskListFilter{
		SourceTaskID:    source.ID,
		DispatchBatchID: updated.DispatchBatchID,
		Page:            1,
		PageSize:        10,
	})
	if err != nil {
		t.Fatalf("ListTasks children failed: %v", err)
	}
	if len(children) != 2 {
		t.Fatalf("len(children) = %d, want 2", len(children))
	}
	for _, child := range children {
		if child.AgentID == "" {
			t.Fatalf("child %s AgentID = empty", child.ID)
		}
		if child.SourceTaskID != source.ID {
			t.Fatalf("child %s SourceTaskID = %q, want %q", child.ID, child.SourceTaskID, source.ID)
		}
	}

	for _, child := range children {
		var token string
		var agentCode string
		switch child.AgentID {
		case instances[0].ID:
			agentCode, token = instances[0].AgentCode, instances[0].Token
		case instances[1].ID:
			agentCode, token = instances[1].AgentCode, instances[1].Token
		default:
			t.Fatalf("unexpected child agent id: %s", child.AgentID)
		}
		polled, err := manager.Poll(ctx, AgentTaskPollInput{
			AgentCode: agentCode,
			Token:     token,
		})
		if err != nil {
			t.Fatalf("Poll child %s failed: %v", child.ID, err)
		}
		if polled == nil || polled.ID != child.ID {
			t.Fatalf("polled child = %#v, want task %s", polled, child.ID)
		}
		if _, err := manager.Start(ctx, agentCode, token, child.ID); err != nil {
			t.Fatalf("Start child %s failed: %v", child.ID, err)
		}
		if _, err := manager.Finish(ctx, FinishAgentTaskInput{
			AgentCode: agentCode,
			Token:     token,
			TaskID:    child.ID,
			ExitCode:  0,
		}); err != nil {
			t.Fatalf("Finish child %s failed: %v", child.ID, err)
		}
	}

	reloadedSource, err := repo.GetTaskByID(ctx, source.ID)
	if err != nil {
		t.Fatalf("GetTaskByID source failed: %v", err)
	}
	if reloadedSource.Status != agentdomain.TaskStatusSuccess {
		t.Fatalf("source status = %s, want %s", reloadedSource.Status, agentdomain.TaskStatusSuccess)
	}
	if reloadedSource.DispatchBatchID != "" {
		t.Fatalf("source DispatchBatchID = %q, want empty", reloadedSource.DispatchBatchID)
	}
	if reloadedSource.SuccessCount != 1 {
		t.Fatalf("source SuccessCount = %d, want 1", reloadedSource.SuccessCount)
	}
}
