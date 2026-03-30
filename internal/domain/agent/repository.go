package agent

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	CreateInstance(ctx context.Context, item Instance) (Instance, error)
	UpdateInstance(ctx context.Context, item Instance) (Instance, error)
	GetInstanceByID(ctx context.Context, id string) (Instance, error)
	GetInstanceByCode(ctx context.Context, code string) (Instance, error)
	ListInstances(ctx context.Context, filter ListFilter) ([]Instance, int64, error)
	UpdateHeartbeat(ctx context.Context, instanceID string, payload HeartbeatPayload) (Instance, error)
	UpdateRuntimeTask(ctx context.Context, instanceID string, payload RuntimeTaskPayload) (Instance, error)

	CreateScript(ctx context.Context, item Script) (Script, error)
	UpdateScript(ctx context.Context, item Script) (Script, error)
	GetScriptByID(ctx context.Context, id string) (Script, error)
	ListScripts(ctx context.Context, filter ScriptListFilter) ([]Script, int64, error)
	DeleteScript(ctx context.Context, id string) error

	CreateTask(ctx context.Context, item Task) (Task, error)
	UpdateTask(ctx context.Context, item Task) (Task, error)
	GetTaskByID(ctx context.Context, id string) (Task, error)
	ListTasks(ctx context.Context, filter TaskListFilter) ([]Task, int64, error)
	DeleteTask(ctx context.Context, taskID string) error
	ClaimNextPendingTask(ctx context.Context, agentID string, now time.Time) (Task, bool, error)
	MarkTaskRunning(ctx context.Context, taskID string, startedAt time.Time) (Task, error)
	CancelTask(ctx context.Context, taskID string, cancelledAt time.Time, reason string) (Task, error)
	ResumeTask(ctx context.Context, taskID string, nextStatus TaskStatus, resumedAt time.Time, summary string) (Task, error)
	FinishTask(ctx context.Context, taskID string, status TaskStatus, exitCode int, stdoutText, stderrText, failureReason string, finishedAt time.Time) (Task, error)
}
