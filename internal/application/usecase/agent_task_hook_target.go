package usecase

import (
	"strings"

	agentdomain "gos/internal/domain/agent"
)

func isReusableAgentTaskHookTarget(task agentdomain.Task) bool {
	return task.TaskMode == agentdomain.TaskModeTemporary && strings.TrimSpace(task.SourceTaskID) == ""
}
