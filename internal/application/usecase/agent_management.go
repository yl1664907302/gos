package usecase

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"sort"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
	agentdomain "gos/internal/domain/agent"
)

const defaultAgentOfflineAfter = 45 * time.Second

type AgentManager struct {
	repo         agentdomain.Repository
	now          func() time.Time
	offlineAfter time.Duration
}

type CreateAgentInput struct {
	AgentCode       string
	Name            string
	EnvironmentCode string
	WorkDir         string
	Tags            []string
	Status          agentdomain.Status
	Remark          string
}

type UpdateAgentInput = CreateAgentInput

type AgentListOutput struct {
	Items []AgentOutput
	Total int64
}

type AgentOutput struct {
	ID                        string                     `json:"id"`
	AgentCode                 string                     `json:"agent_code"`
	Name                      string                     `json:"name"`
	EnvironmentCode           string                     `json:"environment_code"`
	WorkDir                   string                     `json:"work_dir"`
	Token                     string                     `json:"token,omitempty"`
	Tags                      []string                   `json:"tags"`
	Hostname                  string                     `json:"hostname"`
	HostIP                    string                     `json:"host_ip"`
	AgentVersion              string                     `json:"agent_version"`
	OS                        string                     `json:"os"`
	Arch                      string                     `json:"arch"`
	Status                    agentdomain.Status         `json:"status"`
	RuntimeState              agentdomain.RuntimeState   `json:"runtime_state"`
	LastHeartbeatAt           *time.Time                 `json:"last_heartbeat_at,omitempty"`
	HeartbeatAgeSec           int64                      `json:"heartbeat_age_sec"`
	CurrentTaskID             string                     `json:"current_task_id"`
	CurrentTaskName           string                     `json:"current_task_name"`
	CurrentTaskType           string                     `json:"current_task_type"`
	CurrentTaskStartedAt      *time.Time                 `json:"current_task_started_at,omitempty"`
	CurrentResidentTaskID     string                     `json:"current_resident_task_id"`
	CurrentResidentTaskName   string                     `json:"current_resident_task_name"`
	CurrentResidentTaskStatus agentdomain.TaskStatus     `json:"current_resident_task_status"`
	LastTaskStatus            agentdomain.LastTaskStatus `json:"last_task_status"`
	LastTaskSummary           string                     `json:"last_task_summary"`
	LastTaskFinishedAt        *time.Time                 `json:"last_task_finished_at,omitempty"`
	Remark                    string                     `json:"remark"`
	CreatedAt                 time.Time                  `json:"created_at"`
	UpdatedAt                 time.Time                  `json:"updated_at"`
}

type AgentHeartbeatInput struct {
	AgentCode          string
	Token              string
	Hostname           string
	HostIP             string
	AgentVersion       string
	OS                 string
	Arch               string
	WorkDir            string
	Tags               []string
	CurrentTaskID      string
	CurrentTaskName    string
	CurrentTaskType    string
	CurrentTaskStarted *time.Time
	LastTaskStatus     agentdomain.LastTaskStatus
	LastTaskSummary    string
	LastTaskFinishedAt *time.Time
}

type AgentInstallConfigOutput struct {
	AgentID           string `json:"agent_id"`
	AgentCode         string `json:"agent_code"`
	SuggestedPath     string `json:"suggested_path"`
	LaunchCommand     string `json:"launch_command"`
	ConfigYAML        string `json:"config_yaml"`
	ResolvedServerURL string `json:"resolved_server_url"`
	HeartbeatInterval string `json:"heartbeat_interval"`
}

func NewAgentManager(repo agentdomain.Repository) *AgentManager {
	return &AgentManager{repo: repo, now: func() time.Time { return time.Now().UTC() }, offlineAfter: defaultAgentOfflineAfter}
}

func (uc *AgentManager) List(ctx context.Context, filter agentdomain.ListFilter) (AgentListOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentListOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	if filter.Status != "" && !filter.Status.Valid() {
		return AgentListOutput{}, fmt.Errorf("%w: invalid agent status", ErrInvalidStatus)
	}
	if filter.RuntimeState != "" && !filter.RuntimeState.Valid() {
		return AgentListOutput{}, fmt.Errorf("%w: invalid runtime state", ErrInvalidStatus)
	}
	page := filter.Page
	if page <= 0 {
		page = 1
	}
	pageSize := filter.PageSize
	if pageSize <= 0 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}
	queryFilter := filter
	queryFilter.Page = 1
	queryFilter.PageSize = 500
	items, _, err := uc.repo.ListInstances(ctx, queryFilter)
	if err != nil {
		return AgentListOutput{}, err
	}
	outputs := make([]AgentOutput, 0, len(items))
	for _, item := range items {
		output := uc.toOutput(item, false)
		uc.enrichCurrentTask(ctx, &output)
		uc.enrichCurrentResidentTask(ctx, &output)
		if filter.RuntimeState != "" && output.RuntimeState != filter.RuntimeState {
			continue
		}
		outputs = append(outputs, output)
	}
	total := int64(len(outputs))
	start := (page - 1) * pageSize
	if start >= len(outputs) {
		return AgentListOutput{Items: []AgentOutput{}, Total: total}, nil
	}
	end := start + pageSize
	if end > len(outputs) {
		end = len(outputs)
	}
	return AgentListOutput{Items: outputs[start:end], Total: total}, nil
}

func (uc *AgentManager) Get(ctx context.Context, id string) (AgentOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	item, err := uc.repo.GetInstanceByID(ctx, strings.TrimSpace(id))
	if err != nil {
		return AgentOutput{}, err
	}
	output := uc.toOutput(item, false)
	uc.enrichCurrentTask(ctx, &output)
	uc.enrichCurrentResidentTask(ctx, &output)
	return output, nil
}

func (uc *AgentManager) Create(ctx context.Context, input CreateAgentInput) (AgentOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	now := uc.now()
	item, err := uc.normalizeInput("", input, now)
	if err != nil {
		return AgentOutput{}, err
	}
	item.ID = generateID("agt")
	item.CreatedAt = now
	item.UpdatedAt = now
	created, err := uc.repo.CreateInstance(ctx, item)
	if err != nil {
		return AgentOutput{}, err
	}
	return uc.toOutput(created, true), nil
}

func (uc *AgentManager) Update(ctx context.Context, id string, input UpdateAgentInput) (AgentOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	id = strings.TrimSpace(id)
	if id == "" {
		return AgentOutput{}, ErrInvalidID
	}
	current, err := uc.repo.GetInstanceByID(ctx, id)
	if err != nil {
		return AgentOutput{}, err
	}
	item, err := uc.normalizeInput(id, input, uc.now())
	if err != nil {
		return AgentOutput{}, err
	}
	item.ID = current.ID
	item.CreatedAt = current.CreatedAt
	item.UpdatedAt = uc.now()
	item.Token = current.Token
	item.Hostname = current.Hostname
	item.HostIP = current.HostIP
	item.AgentVersion = current.AgentVersion
	item.OS = current.OS
	item.Arch = current.Arch
	item.LastHeartbeatAt = current.LastHeartbeatAt
	item.CurrentTaskID = current.CurrentTaskID
	item.CurrentTaskName = current.CurrentTaskName
	item.CurrentTaskType = current.CurrentTaskType
	item.CurrentTaskStarted = current.CurrentTaskStarted
	item.LastTaskStatus = current.LastTaskStatus
	item.LastTaskSummary = current.LastTaskSummary
	item.LastTaskFinishedAt = current.LastTaskFinishedAt
	item.Token = current.Token
	updated, err := uc.repo.UpdateInstance(ctx, item)
	if err != nil {
		return AgentOutput{}, err
	}
	return uc.toOutput(updated, true), nil
}

func (uc *AgentManager) ResetToken(ctx context.Context, id string) (AgentOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	id = strings.TrimSpace(id)
	if id == "" {
		return AgentOutput{}, ErrInvalidID
	}
	current, err := uc.repo.GetInstanceByID(ctx, id)
	if err != nil {
		return AgentOutput{}, err
	}
	current.Token = generateAgentToken()
	current.UpdatedAt = uc.now()
	updated, err := uc.repo.UpdateInstance(ctx, current)
	if err != nil {
		return AgentOutput{}, err
	}
	return uc.toOutput(updated, true), nil
}

func (uc *AgentManager) BuildInstallConfig(ctx context.Context, id string, baseURL string) (AgentInstallConfigOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentInstallConfigOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	id = strings.TrimSpace(id)
	if id == "" {
		return AgentInstallConfigOutput{}, ErrInvalidID
	}
	item, err := uc.repo.GetInstanceByID(ctx, id)
	if err != nil {
		return AgentInstallConfigOutput{}, err
	}
	resolvedBaseURL := normalizeAgentBaseURL(baseURL)
	configDoc := struct {
		Server struct {
			BaseURL string `yaml:"base_url"`
		} `yaml:"server"`
		Agent struct {
			Code              string   `yaml:"code"`
			Token             string   `yaml:"token"`
			WorkDir           string   `yaml:"work_dir"`
			HeartbeatInterval string   `yaml:"heartbeat_interval"`
			PollInterval      string   `yaml:"poll_interval"`
			Version           string   `yaml:"version"`
			Tags              []string `yaml:"tags,omitempty"`
		} `yaml:"agent"`
	}{}
	configDoc.Server.BaseURL = resolvedBaseURL
	configDoc.Agent.Code = item.AgentCode
	configDoc.Agent.Token = item.Token
	configDoc.Agent.WorkDir = item.WorkDir
	configDoc.Agent.HeartbeatInterval = "15s"
	configDoc.Agent.PollInterval = "5s"
	configDoc.Agent.Version = firstNonEmptyAgentString(item.AgentVersion, "v0.2")
	configDoc.Agent.Tags = append([]string(nil), item.Tags...)

	content, err := yaml.Marshal(configDoc)
	if err != nil {
		return AgentInstallConfigOutput{}, err
	}
	suggestedPath := "/etc/gos-agent/config.yaml"
	return AgentInstallConfigOutput{
		AgentID:           item.ID,
		AgentCode:         item.AgentCode,
		SuggestedPath:     suggestedPath,
		LaunchCommand:     fmt.Sprintf("./gos-agent -config %s", suggestedPath),
		ConfigYAML:        string(content),
		ResolvedServerURL: resolvedBaseURL,
		HeartbeatInterval: configDoc.Agent.HeartbeatInterval,
	}, nil
}

func (uc *AgentManager) UpdateStatus(ctx context.Context, id string, status agentdomain.Status) (AgentOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	if !status.Valid() {
		return AgentOutput{}, fmt.Errorf("%w: invalid agent status", ErrInvalidStatus)
	}
	current, err := uc.repo.GetInstanceByID(ctx, strings.TrimSpace(id))
	if err != nil {
		return AgentOutput{}, err
	}
	current.Status = status
	current.UpdatedAt = uc.now()
	updated, err := uc.repo.UpdateInstance(ctx, current)
	if err != nil {
		return AgentOutput{}, err
	}
	return uc.toOutput(updated, false), nil
}

func (uc *AgentManager) Heartbeat(ctx context.Context, input AgentHeartbeatInput) (AgentOutput, error) {
	if uc == nil || uc.repo == nil {
		return AgentOutput{}, fmt.Errorf("%w: agent manager is not configured", ErrInvalidInput)
	}
	agentCode := strings.TrimSpace(input.AgentCode)
	if agentCode == "" {
		return AgentOutput{}, fmt.Errorf("%w: agent_code is required", ErrInvalidInput)
	}
	item, err := uc.repo.GetInstanceByCode(ctx, agentCode)
	if err != nil {
		return AgentOutput{}, err
	}
	if strings.TrimSpace(input.Token) == "" || subtleConstantTimeCompare(strings.TrimSpace(item.Token), strings.TrimSpace(input.Token)) == false {
		return AgentOutput{}, agentdomain.ErrHeartbeatAuthRejected
	}
	if item.Status == agentdomain.StatusDisabled {
		return AgentOutput{}, agentdomain.ErrHeartbeatAuthRejected
	}
	payload := agentdomain.HeartbeatPayload{
		Hostname:           firstNonEmptyAgentString(strings.TrimSpace(input.Hostname), strings.TrimSpace(item.Hostname)),
		HostIP:             strings.TrimSpace(input.HostIP),
		AgentVersion:       strings.TrimSpace(input.AgentVersion),
		OS:                 strings.TrimSpace(input.OS),
		Arch:               strings.TrimSpace(input.Arch),
		WorkDir:            firstNonEmptyAgentString(strings.TrimSpace(input.WorkDir), strings.TrimSpace(item.WorkDir)),
		Tags:               normalizeAgentTags(input.Tags),
		CurrentTaskID:      strings.TrimSpace(input.CurrentTaskID),
		CurrentTaskName:    strings.TrimSpace(input.CurrentTaskName),
		CurrentTaskType:    strings.TrimSpace(input.CurrentTaskType),
		CurrentTaskStarted: input.CurrentTaskStarted,
		LastTaskStatus:     normalizeLastTaskStatus(input.LastTaskStatus, item.LastTaskStatus),
		LastTaskSummary:    strings.TrimSpace(input.LastTaskSummary),
		LastTaskFinishedAt: input.LastTaskFinishedAt,
	}
	updated, err := uc.repo.UpdateHeartbeat(ctx, item.ID, payload)
	if err != nil {
		return AgentOutput{}, err
	}
	return uc.toOutput(updated, false), nil
}

func (uc *AgentManager) normalizeInput(id string, input CreateAgentInput, now time.Time) (agentdomain.Instance, error) {
	agentCode := strings.ToLower(strings.TrimSpace(input.AgentCode))
	if agentCode == "" {
		return agentdomain.Instance{}, fmt.Errorf("%w: agent_code is required", ErrInvalidInput)
	}
	name := strings.TrimSpace(input.Name)
	if name == "" {
		return agentdomain.Instance{}, fmt.Errorf("%w: name is required", ErrInvalidInput)
	}
	workDir := strings.TrimSpace(input.WorkDir)
	if workDir == "" {
		return agentdomain.Instance{}, fmt.Errorf("%w: work_dir is required", ErrInvalidInput)
	}
	status := input.Status
	if status == "" {
		status = agentdomain.StatusActive
	}
	if !status.Valid() {
		return agentdomain.Instance{}, fmt.Errorf("%w: invalid agent status", ErrInvalidStatus)
	}
	token := generateAgentToken()
	return agentdomain.Instance{
		ID:              id,
		AgentCode:       agentCode,
		Name:            name,
		EnvironmentCode: strings.TrimSpace(input.EnvironmentCode),
		WorkDir:         workDir,
		Token:           token,
		Tags:            normalizeAgentTags(input.Tags),
		Status:          status,
		LastTaskStatus:  agentdomain.LastTaskStatusUnknown,
		Remark:          strings.TrimSpace(input.Remark),
		UpdatedAt:       now,
	}, nil
}

func (uc *AgentManager) toOutput(item agentdomain.Instance, includeToken bool) AgentOutput {
	now := uc.now()
	runtimeState := resolveAgentRuntimeState(item, now, uc.offlineAfter)
	heartbeatAge := int64(0)
	if !item.LastHeartbeatAt.IsZero() {
		heartbeatAge = int64(now.Sub(item.LastHeartbeatAt).Seconds())
		if heartbeatAge < 0 {
			heartbeatAge = 0
		}
	}
	output := AgentOutput{
		ID:              item.ID,
		AgentCode:       item.AgentCode,
		Name:            item.Name,
		EnvironmentCode: item.EnvironmentCode,
		WorkDir:         item.WorkDir,
		Tags:            append([]string(nil), item.Tags...),
		Hostname:        item.Hostname,
		HostIP:          item.HostIP,
		AgentVersion:    item.AgentVersion,
		OS:              item.OS,
		Arch:            item.Arch,
		Status:          item.Status,
		RuntimeState:    runtimeState,
		HeartbeatAgeSec: heartbeatAge,
		CurrentTaskID:   item.CurrentTaskID,
		CurrentTaskName: item.CurrentTaskName,
		CurrentTaskType: item.CurrentTaskType,
		LastTaskStatus:  item.LastTaskStatus,
		LastTaskSummary: item.LastTaskSummary,
		Remark:          item.Remark,
		CreatedAt:       item.CreatedAt,
		UpdatedAt:       item.UpdatedAt,
	}
	if includeToken {
		output.Token = item.Token
	}
	if !item.LastHeartbeatAt.IsZero() {
		value := item.LastHeartbeatAt
		output.LastHeartbeatAt = &value
	}
	if item.CurrentTaskStarted != nil && !item.CurrentTaskStarted.IsZero() {
		value := item.CurrentTaskStarted.UTC()
		output.CurrentTaskStartedAt = &value
	}
	if item.LastTaskFinishedAt != nil && !item.LastTaskFinishedAt.IsZero() {
		value := item.LastTaskFinishedAt.UTC()
		output.LastTaskFinishedAt = &value
	}
	return output
}

func (uc *AgentManager) enrichCurrentTask(ctx context.Context, output *AgentOutput) {
	if uc == nil || uc.repo == nil || output == nil {
		return
	}
	if strings.TrimSpace(output.CurrentTaskID) == "" {
		return
	}
	if strings.TrimSpace(output.CurrentTaskName) != "" && strings.TrimSpace(output.CurrentTaskType) != "" {
		return
	}
	task, err := uc.repo.GetTaskByID(ctx, strings.TrimSpace(output.CurrentTaskID))
	if err != nil {
		return
	}
	if strings.TrimSpace(output.CurrentTaskName) == "" {
		output.CurrentTaskName = strings.TrimSpace(task.Name)
	}
	if strings.TrimSpace(output.CurrentTaskType) == "" {
		output.CurrentTaskType = strings.TrimSpace(task.TaskType)
	}
}

func (uc *AgentManager) enrichCurrentResidentTask(ctx context.Context, output *AgentOutput) {
	if uc == nil || uc.repo == nil || output == nil || strings.TrimSpace(output.ID) == "" {
		return
	}
	list, _, err := uc.repo.ListTasks(ctx, agentdomain.TaskListFilter{
		AgentID:  strings.TrimSpace(output.ID),
		Page:     1,
		PageSize: 100,
	})
	if err != nil {
		return
	}
	current, ok := selectCurrentResidentTask(list)
	if !ok {
		return
	}
	output.CurrentResidentTaskID = strings.TrimSpace(current.ID)
	output.CurrentResidentTaskName = strings.TrimSpace(current.Name)
	output.CurrentResidentTaskStatus = current.Status
}

func selectCurrentResidentTask(items []agentdomain.Task) (agentdomain.Task, bool) {
	bestIndex := -1
	bestScore := -1
	for idx, item := range items {
		if item.TaskMode != agentdomain.TaskModeResident {
			continue
		}
		score := residentTaskPriority(item.Status)
		if score > bestScore {
			bestScore = score
			bestIndex = idx
			continue
		}
		if score == bestScore && bestIndex >= 0 && item.UpdatedAt.After(items[bestIndex].UpdatedAt) {
			bestIndex = idx
		}
	}
	if bestIndex < 0 {
		return agentdomain.Task{}, false
	}
	return items[bestIndex], true
}

func residentTaskPriority(status agentdomain.TaskStatus) int {
	switch status {
	case agentdomain.TaskStatusRunning:
		return 4
	case agentdomain.TaskStatusClaimed:
		return 3
	case agentdomain.TaskStatusPending:
		return 2
	case agentdomain.TaskStatusCancelled:
		return 1
	default:
		return 0
	}
}

func resolveAgentRuntimeState(item agentdomain.Instance, now time.Time, offlineAfter time.Duration) agentdomain.RuntimeState {
	switch item.Status {
	case agentdomain.StatusDisabled:
		return agentdomain.RuntimeStateDisabled
	case agentdomain.StatusMaintenance:
		return agentdomain.RuntimeStateMaintenance
	}
	if item.LastHeartbeatAt.IsZero() || now.Sub(item.LastHeartbeatAt) > offlineAfter {
		return agentdomain.RuntimeStateOffline
	}
	if strings.TrimSpace(item.CurrentTaskID) != "" {
		return agentdomain.RuntimeStateBusy
	}
	return agentdomain.RuntimeStateOnline
}

func normalizeAgentTags(items []string) []string {
	set := make(map[string]struct{})
	result := make([]string, 0, len(items))
	for _, item := range items {
		value := strings.TrimSpace(item)
		if value == "" {
			continue
		}
		if _, exists := set[value]; exists {
			continue
		}
		set[value] = struct{}{}
		result = append(result, value)
	}
	sort.Strings(result)
	return result
}

func normalizeLastTaskStatus(value agentdomain.LastTaskStatus, fallback agentdomain.LastTaskStatus) agentdomain.LastTaskStatus {
	if value.Valid() {
		if value == "" {
			if fallback.Valid() && fallback != "" {
				return fallback
			}
			return agentdomain.LastTaskStatusUnknown
		}
		return value
	}
	if fallback.Valid() && fallback != "" {
		return fallback
	}
	return agentdomain.LastTaskStatusUnknown
}

func firstNonEmptyAgentString(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

func generateAgentToken() string {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return generateID("agtok")
	}
	return hex.EncodeToString(buf)
}

func subtleConstantTimeCompare(left string, right string) bool {
	if len(left) != len(right) {
		return false
	}
	var diff byte
	for i := 0; i < len(left); i++ {
		diff |= left[i] ^ right[i]
	}
	return diff == 0
}

func normalizeAgentBaseURL(baseURL string) string {
	value := strings.TrimSpace(baseURL)
	if value == "" {
		return "http://127.0.0.1:8081"
	}
	return strings.TrimRight(value, "/")
}
