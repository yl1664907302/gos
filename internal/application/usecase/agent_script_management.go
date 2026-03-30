package usecase

import (
	"context"
	"fmt"
	"path/filepath"
	"strings"
	"time"

	agentdomain "gos/internal/domain/agent"
)

type AgentScriptManager struct {
	repo agentdomain.Repository
	now  func() time.Time
}

type CreateAgentScriptInput struct {
	Name        string
	Description string
	TaskType    string
	ShellType   string
	ScriptPath  string
	ScriptText  string
	CreatedBy   string
}

type UpdateAgentScriptInput struct {
	Name        string
	Description string
	TaskType    string
	ShellType   string
	ScriptPath  string
	ScriptText  string
	UpdatedBy   string
}

type AgentScriptOutput struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	TaskType    string    `json:"task_type"`
	ShellType   string    `json:"shell_type"`
	ScriptPath  string    `json:"script_path"`
	ScriptText  string    `json:"script_text"`
	CreatedBy   string    `json:"created_by"`
	UpdatedBy   string    `json:"updated_by"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type AgentScriptListOutput struct {
	Items []AgentScriptOutput
	Total int64
}

func NewAgentScriptManager(repo agentdomain.Repository) *AgentScriptManager {
	return &AgentScriptManager{repo: repo, now: func() time.Time { return time.Now().UTC() }}
}

func (uc *AgentScriptManager) List(ctx context.Context, filter agentdomain.ScriptListFilter) (AgentScriptListOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentScriptListOutput{}, fmt.Errorf("%w: agent script manager is not configured", ErrInvalidInput)
	}
	if filter.TaskType != "" && !filter.TaskType.ScriptLibrarySupported() {
		return AgentScriptListOutput{}, fmt.Errorf("%w: unsupported script task_type", ErrInvalidInput)
	}
	items, total, err := uc.repo.ListScripts(ctx, filter)
	if err != nil {
		return AgentScriptListOutput{}, err
	}
	outputs := make([]AgentScriptOutput, 0, len(items))
	for _, item := range items {
		outputs = append(outputs, toAgentScriptOutput(item))
	}
	return AgentScriptListOutput{Items: outputs, Total: total}, nil
}

func (uc *AgentScriptManager) Get(ctx context.Context, id string) (AgentScriptOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentScriptOutput{}, fmt.Errorf("%w: agent script manager is not configured", ErrInvalidInput)
	}
	item, err := uc.repo.GetScriptByID(ctx, strings.TrimSpace(id))
	if err != nil {
		return AgentScriptOutput{}, err
	}
	return toAgentScriptOutput(item), nil
}

func (uc *AgentScriptManager) Create(ctx context.Context, input CreateAgentScriptInput) (AgentScriptOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentScriptOutput{}, fmt.Errorf("%w: agent script manager is not configured", ErrInvalidInput)
	}
	item, err := uc.normalizeScriptInput(input.Name, input.Description, input.TaskType, input.ShellType, input.ScriptPath, input.ScriptText)
	if err != nil {
		return AgentScriptOutput{}, err
	}
	now := uc.now()
	item.ID = generateID("agtscr")
	item.CreatedBy = strings.TrimSpace(input.CreatedBy)
	item.UpdatedBy = strings.TrimSpace(input.CreatedBy)
	item.CreatedAt = now
	item.UpdatedAt = now
	created, err := uc.repo.CreateScript(ctx, item)
	if err != nil {
		return AgentScriptOutput{}, err
	}
	return toAgentScriptOutput(created), nil
}

func (uc *AgentScriptManager) Update(ctx context.Context, id string, input UpdateAgentScriptInput) (AgentScriptOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentScriptOutput{}, fmt.Errorf("%w: agent script manager is not configured", ErrInvalidInput)
	}
	id = strings.TrimSpace(id)
	if id == "" {
		return AgentScriptOutput{}, ErrInvalidID
	}
	current, err := uc.repo.GetScriptByID(ctx, id)
	if err != nil {
		return AgentScriptOutput{}, err
	}
	item, err := uc.normalizeScriptInput(input.Name, input.Description, input.TaskType, input.ShellType, input.ScriptPath, input.ScriptText)
	if err != nil {
		return AgentScriptOutput{}, err
	}
	item.ID = current.ID
	item.CreatedBy = current.CreatedBy
	item.CreatedAt = current.CreatedAt
	item.UpdatedBy = strings.TrimSpace(input.UpdatedBy)
	item.UpdatedAt = uc.now()
	updated, err := uc.repo.UpdateScript(ctx, item)
	if err != nil {
		return AgentScriptOutput{}, err
	}
	return toAgentScriptOutput(updated), nil
}

func (uc *AgentScriptManager) Delete(ctx context.Context, id string) error {
	if uc == nil || uc.repo == nil {
		return fmt.Errorf("%w: agent script manager is not configured", ErrInvalidInput)
	}
	id = strings.TrimSpace(id)
	if id == "" {
		return ErrInvalidID
	}
	return uc.repo.DeleteScript(ctx, id)
}

func (uc *AgentScriptManager) normalizeScriptInput(name, description, taskType, shellType, scriptPath, scriptText string) (agentdomain.Script, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return agentdomain.Script{}, fmt.Errorf("%w: script name is required", ErrInvalidInput)
	}
	typeValue := agentdomain.TaskType(strings.TrimSpace(taskType))
	if typeValue == "" {
		typeValue = agentdomain.TaskTypeShellScript
	}
	if !typeValue.ScriptLibrarySupported() {
		return agentdomain.Script{}, fmt.Errorf("%w: only shell script or script file task can be managed as reusable scripts", ErrInvalidInput)
	}
	shellType = firstNonEmptyAgentString(strings.TrimSpace(shellType), "sh")
	if shellType != "sh" && shellType != "bash" {
		return agentdomain.Script{}, fmt.Errorf("%w: unsupported shell_type", ErrInvalidInput)
	}
	scriptText = strings.TrimSpace(strings.ReplaceAll(scriptText, "\r\n", "\n"))
	if scriptText == "" {
		return agentdomain.Script{}, fmt.Errorf("%w: script content is required", ErrInvalidInput)
	}
	scriptPath = strings.TrimSpace(scriptPath)
	if typeValue == agentdomain.TaskTypeScriptFile {
		if scriptPath == "" {
			return agentdomain.Script{}, fmt.Errorf("%w: script_path is required", ErrInvalidInput)
		}
		if !isSupportedAgentScriptPath(scriptPath) {
			return agentdomain.Script{}, fmt.Errorf("%w: script file only supports .sh/.bash", ErrInvalidInput)
		}
	} else {
		scriptPath = ""
	}
	return agentdomain.Script{
		Name:        name,
		Description: strings.TrimSpace(description),
		TaskType:    string(typeValue),
		ShellType:   shellType,
		ScriptPath:  scriptPath,
		ScriptText:  scriptText,
	}, nil
}

func toAgentScriptOutput(item agentdomain.Script) AgentScriptOutput {
	return AgentScriptOutput{
		ID:          item.ID,
		Name:        item.Name,
		Description: item.Description,
		TaskType:    item.TaskType,
		ShellType:   item.ShellType,
		ScriptPath:  item.ScriptPath,
		ScriptText:  item.ScriptText,
		CreatedBy:   item.CreatedBy,
		UpdatedBy:   item.UpdatedBy,
		CreatedAt:   item.CreatedAt,
		UpdatedAt:   item.UpdatedAt,
	}
}

func isSupportedAgentScriptPath(path string) bool {
	lowerExt := strings.ToLower(filepath.Ext(strings.TrimSpace(path)))
	return lowerExt == ".sh" || lowerExt == ".bash"
}
