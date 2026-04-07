package usecase

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"

	agentdomain "gos/internal/domain/agent"
	notificationdomain "gos/internal/domain/notification"
	domain "gos/internal/domain/release"
)

var hookTaskIDPattern = regexp.MustCompile(`task_id=([A-Za-z0-9-]+)`)
var templateWebhookHTTPTimeout = 10 * time.Second

func (uc *ReleaseOrderManager) syncHooksAfterRelease(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
) (bool, bool, domain.OrderStatus, string, error) {
	mainStatus, finalMessage, mainDone := evaluateMainReleaseStatus(executions)
	if !mainDone {
		return false, false, order.Status, "", nil
	}

	if err := uc.ensureMainReleaseFinishStep(ctx, order.ID, mainStatus); err != nil {
		return false, false, order.Status, "", err
	}

	steps, err := uc.repo.ListSteps(ctx, order.ID)
	if err != nil {
		return false, false, order.Status, "", err
	}
	hookSteps := collectHookSteps(steps)
	if len(hookSteps) == 0 {
		return false, true, mainStatus, finalMessage, nil
	}

	if order.Status.IsTerminal() {
		now := uc.now()
		order, err = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusRunning, order.StartedAt, nil, now)
		if err != nil {
			return false, false, order.Status, "", err
		}
	}

	templateHooks, err := uc.loadTemplateHooksForOrder(ctx, order)
	if err != nil {
		return false, false, order.Status, "", err
	}
	hookBySort := make(map[int]domain.ReleaseTemplateHook, len(templateHooks))
	for _, item := range templateHooks {
		hookBySort[item.SortNo] = item
	}

	updated := false
	blockingHookFailed := false
	for _, step := range hookSteps {
		hookCfg, ok := hookBySort[parseHookSortNo(step.StepCode)]
		if !ok {
			if step.Status != domain.StepStatusFailed && step.Status != domain.StepStatusSuccess {
				if err := uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusFailed, "未找到 Hook 模板快照，无法继续执行"); err != nil {
					return updated, false, order.Status, "", err
				}
				updated = true
			}
			blockingHookFailed = true
			continue
		}

		if !shouldTriggerTemplateHook(hookCfg.TriggerCondition, mainStatus) {
			if step.Status != domain.StepStatusSuccess {
				if err := uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, "已按触发条件跳过"); err != nil {
					return updated, false, order.Status, "", err
				}
				updated = true
			}
			continue
		}

		switch step.Status {
		case domain.StepStatusPending:
			stepUpdated, dispatchErr := uc.dispatchTemplateHookStep(ctx, order, executions, hookCfg, step)
			if dispatchErr != nil {
				if hookCfg.FailurePolicy == domain.TemplateHookFailurePolicyWarnOnly {
					if err := uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, "Hook 执行失败已忽略："+dispatchErr.Error()); err != nil {
						return updated, false, order.Status, "", err
					}
				} else {
					if err := uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusFailed, dispatchErr.Error()); err != nil {
						return updated, false, order.Status, "", err
					}
					blockingHookFailed = true
				}
				updated = true
				return updated, false, domain.OrderStatusRunning, "", nil
			}
			updated = updated || stepUpdated
			return updated, false, domain.OrderStatusRunning, "", nil
		case domain.StepStatusRunning:
			stepUpdated, finished, failed, syncErr := uc.syncRunningHookStep(ctx, order, hookCfg, step)
			if syncErr != nil {
				return updated, false, order.Status, "", syncErr
			}
			updated = updated || stepUpdated
			if !finished {
				return updated, false, domain.OrderStatusRunning, "", nil
			}
			if failed && hookCfg.FailurePolicy == domain.TemplateHookFailurePolicyBlockRelease {
				blockingHookFailed = true
			}
		case domain.StepStatusFailed:
			if hookCfg.FailurePolicy == domain.TemplateHookFailurePolicyBlockRelease {
				blockingHookFailed = true
			}
		}
	}

	if blockingHookFailed {
		return updated, true, domain.OrderStatusFailed, "Hook 执行失败", nil
	}
	return updated, true, mainStatus, finalMessage, nil
}

func evaluateMainReleaseStatus(executions []domain.ReleaseOrderExecution) (domain.OrderStatus, string, bool) {
	if len(executions) == 0 {
		return domain.OrderStatusSuccess, "发布完成", true
	}

	orderStatus := domain.OrderStatusSuccess
	message := "发布完成"
	for _, item := range executions {
		switch item.Status {
		case domain.ExecutionStatusFailed:
			orderStatus = domain.OrderStatusFailed
			message = "存在失败执行单元"
		case domain.ExecutionStatusCancelled:
			if orderStatus != domain.OrderStatusFailed {
				orderStatus = domain.OrderStatusCancelled
				message = "存在已取消执行单元"
			}
		case domain.ExecutionStatusPending, domain.ExecutionStatusRunning:
			return domain.OrderStatusRunning, "", false
		}
	}
	return orderStatus, message, true
}

func (uc *ReleaseOrderManager) ensureMainReleaseFinishStep(
	ctx context.Context,
	orderID string,
	mainStatus domain.OrderStatus,
) error {
	stepStatus := domain.StepStatusSuccess
	message := "主发布流程完成"
	if mainStatus != domain.OrderStatusSuccess {
		stepStatus = domain.StepStatusFailed
		message = "主发布流程失败"
	}
	return uc.markStepFinished(ctx, orderID, "global:release_finish", stepStatus, message)
}

func collectHookSteps(steps []domain.ReleaseOrderStep) []domain.ReleaseOrderStep {
	result := make([]domain.ReleaseOrderStep, 0)
	for _, item := range steps {
		code := strings.ToLower(strings.TrimSpace(item.StepCode))
		if strings.HasPrefix(code, "hook:") {
			result = append(result, item)
		}
	}
	sort.Slice(result, func(i, j int) bool {
		if result[i].SortNo != result[j].SortNo {
			return result[i].SortNo < result[j].SortNo
		}
		return result[i].CreatedAt.Before(result[j].CreatedAt)
	})
	return result
}

func parseHookSortNo(stepCode string) int {
	parts := strings.Split(strings.TrimSpace(stepCode), ":")
	if len(parts) < 3 {
		return 0
	}
	value, _ := strconv.Atoi(strings.TrimSpace(parts[len(parts)-1]))
	return value
}

func shouldTriggerTemplateHook(condition domain.TemplateHookTriggerCondition, mainStatus domain.OrderStatus) bool {
	switch condition {
	case domain.TemplateHookTriggerOnFailed:
		return mainStatus == domain.OrderStatusFailed || mainStatus == domain.OrderStatusCancelled
	case domain.TemplateHookTriggerAlways:
		return true
	default:
		return mainStatus == domain.OrderStatusSuccess
	}
}

func (uc *ReleaseOrderManager) loadTemplateHooksForOrder(ctx context.Context, order domain.ReleaseOrder) ([]domain.ReleaseTemplateHook, error) {
	templateID := strings.TrimSpace(order.TemplateID)
	if templateID == "" {
		return nil, nil
	}
	_, _, _, _, hooks, err := uc.repo.GetTemplateByID(ctx, templateID)
	if err != nil {
		return nil, err
	}
	sort.Slice(hooks, func(i, j int) bool {
		if hooks[i].SortNo != hooks[j].SortNo {
			return hooks[i].SortNo < hooks[j].SortNo
		}
		return hooks[i].CreatedAt.Before(hooks[j].CreatedAt)
	})
	return hooks, nil
}

func (uc *ReleaseOrderManager) dispatchTemplateHookStep(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	hook domain.ReleaseTemplateHook,
	step domain.ReleaseOrderStep,
) (bool, error) {
	switch hook.HookType {
	case domain.TemplateHookTypeAgentTask:
		return uc.dispatchAgentTaskHookStep(ctx, order, executions, hook, step)
	case domain.TemplateHookTypeNotificationHook:
		return uc.dispatchNotificationHookStep(ctx, order, executions, hook, step)
	case domain.TemplateHookTypeWebhookNotification:
		return uc.dispatchWebhookHookStep(ctx, order, executions, hook, step)
	default:
		return false, fmt.Errorf("%w: unsupported hook type %s", ErrInvalidInput, hook.HookType)
	}
}

func (uc *ReleaseOrderManager) dispatchAgentTaskHookStep(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	hook domain.ReleaseTemplateHook,
	step domain.ReleaseOrderStep,
) (bool, error) {
	if uc.agentRepo == nil {
		return false, fmt.Errorf("%w: agent repository is not configured", ErrInvalidInput)
	}

	sourceTask, err := uc.agentRepo.GetTaskByID(ctx, strings.TrimSpace(hook.TargetID))
	if err != nil {
		return false, err
	}
	agentInstance, err := uc.resolveHookTargetAgent(ctx, order, sourceTask)
	if err != nil {
		return false, err
	}
	variables, err := uc.buildHookTaskVariables(ctx, order, executions)
	if err != nil {
		return false, err
	}
	for key, value := range sourceTask.Variables {
		normalizedKey := strings.TrimSpace(key)
		if normalizedKey == "" {
			continue
		}
		if _, exists := variables[normalizedKey]; !exists {
			variables[normalizedKey] = strings.TrimSpace(value)
		}
	}

	now := uc.now()
	nextStatus, err := uc.resolveHookTaskInitialStatus(ctx, agentInstance.ID)
	if err != nil {
		return false, err
	}
	workDir := firstNonEmpty(strings.TrimSpace(sourceTask.WorkDir), strings.TrimSpace(agentInstance.WorkDir))
	createdTask, err := uc.agentRepo.CreateTask(ctx, agentdomain.Task{
		ID:         generateID("agtask"),
		AgentID:    agentInstance.ID,
		AgentCode:  agentInstance.AgentCode,
		Name:       fmt.Sprintf("%s · %s", firstNonEmpty(strings.TrimSpace(hook.Name), "发布后 Hook"), strings.TrimSpace(order.OrderNo)),
		TaskMode:   agentdomain.TaskModeTemporary,
		TaskType:   sourceTask.TaskType,
		ShellType:  sourceTask.ShellType,
		WorkDir:    workDir,
		ScriptID:   sourceTask.ScriptID,
		ScriptName: sourceTask.ScriptName,
		ScriptPath: sourceTask.ScriptPath,
		ScriptText: sourceTask.ScriptText,
		Variables:  variables,
		TimeoutSec: sourceTask.TimeoutSec,
		Status:     nextStatus,
		CreatedBy:  "release_hook",
		CreatedAt:  now,
		UpdatedAt:  now,
	})
	if err != nil {
		return false, err
	}

	message := buildHookTaskProgressMessage(hook, createdTask, agentInstance)
	if step.Status == domain.StepStatusPending {
		return true, uc.markStep(ctx, order.ID, step.StepCode, domain.StepStatusRunning, message, &now, nil)
	}
	return true, uc.markStep(ctx, order.ID, step.StepCode, domain.StepStatusRunning, message, step.StartedAt, nil)
}

func (uc *ReleaseOrderManager) dispatchWebhookHookStep(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	hook domain.ReleaseTemplateHook,
	step domain.ReleaseOrderStep,
) (bool, error) {
	webhookURL := strings.TrimSpace(hook.WebhookURL)
	if webhookURL == "" {
		return false, fmt.Errorf("%w: webhook url is required", ErrInvalidInput)
	}
	variables, err := uc.buildHookTaskVariables(ctx, order, executions)
	if err != nil {
		return false, err
	}
	body := renderHookString(variables, strings.TrimSpace(hook.WebhookBody))
	req, err := http.NewRequestWithContext(ctx, strings.ToUpper(firstNonEmpty(strings.TrimSpace(hook.WebhookMethod), "POST")), webhookURL, bytes.NewBufferString(body))
	if err != nil {
		return false, err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := sendTemplateWebhook(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	respBody, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	message := fmt.Sprintf("Webhook：%s %s", req.Method, webhookURL)
	if len(bytes.TrimSpace(respBody)) > 0 {
		message += "，响应：" + strings.TrimSpace(string(respBody))
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		summary := strings.TrimSpace(string(respBody))
		if summary == "" {
			return false, fmt.Errorf("%w: webhook returned %d", ErrInvalidInput, resp.StatusCode)
		}
		return false, fmt.Errorf("%w: webhook returned %d: %s", ErrInvalidInput, resp.StatusCode, summary)
	}
	if step.Status == domain.StepStatusPending {
		now := uc.now()
		if err := uc.markStep(ctx, order.ID, step.StepCode, domain.StepStatusRunning, message, &now, nil); err != nil {
			return false, err
		}
		return true, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, message)
	}
	return true, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, message)
}

func (uc *ReleaseOrderManager) dispatchNotificationHookStep(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	hook domain.ReleaseTemplateHook,
	step domain.ReleaseOrderStep,
) (bool, error) {
	if uc.notificationRepo == nil {
		return false, fmt.Errorf("%w: notification repository is not configured", ErrInvalidInput)
	}

	notificationHook, err := uc.notificationRepo.GetHookByID(ctx, strings.TrimSpace(hook.TargetID))
	if err != nil {
		return false, err
	}
	if !notificationHook.Enabled {
		return false, fmt.Errorf("%w: notification hook is disabled", ErrInvalidInput)
	}
	source, err := uc.notificationRepo.GetSourceByID(ctx, notificationHook.SourceID)
	if err != nil {
		return false, err
	}
	if !source.Enabled {
		return false, fmt.Errorf("%w: notification source is disabled", ErrInvalidInput)
	}
	template, err := uc.notificationRepo.GetMarkdownTemplateByID(ctx, notificationHook.MarkdownTemplateID)
	if err != nil {
		return false, err
	}
	if !template.Enabled {
		return false, fmt.Errorf("%w: notification markdown template is disabled", ErrInvalidInput)
	}

	variables, err := uc.buildHookTaskVariables(ctx, order, executions)
	if err != nil {
		return false, err
	}
	title, body := renderNotificationMarkdownTemplate(variables, template)
	if strings.TrimSpace(title) == "" && strings.TrimSpace(body) == "" {
		return false, fmt.Errorf("%w: notification markdown content is empty", ErrInvalidInput)
	}
	req, err := buildNotificationHookRequest(ctx, source, title, body)
	if err != nil {
		return false, err
	}
	resp, err := sendTemplateWebhook(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()
	respBody, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	message := fmt.Sprintf("通知 Hook：%s · %s", firstNonEmpty(strings.TrimSpace(notificationHook.Name), strings.TrimSpace(hook.Name), strings.TrimSpace(notificationHook.ID)), source.Name)
	if len(bytes.TrimSpace(respBody)) > 0 {
		message += "，响应：" + strings.TrimSpace(string(respBody))
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		summary := strings.TrimSpace(string(respBody))
		if summary == "" {
			return false, fmt.Errorf("%w: notification hook returned %d", ErrInvalidInput, resp.StatusCode)
		}
		return false, fmt.Errorf("%w: notification hook returned %d: %s", ErrInvalidInput, resp.StatusCode, summary)
	}
	if step.Status == domain.StepStatusPending {
		now := uc.now()
		if err := uc.markStep(ctx, order.ID, step.StepCode, domain.StepStatusRunning, message, &now, nil); err != nil {
			return false, err
		}
	}
	return true, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, message)
}

func buildNotificationHookRequest(ctx context.Context, source notificationdomain.Source, title string, body string) (*http.Request, error) {
	webhookURL := strings.TrimSpace(source.WebhookURL)
	if webhookURL == "" {
		return nil, fmt.Errorf("%w: notification source webhook_url is required", ErrInvalidInput)
	}
	if source.SourceType == notificationdomain.SourceTypeDingTalk {
		signedURL, err := buildDingTalkWebhookURL(webhookURL, source.VerificationParam)
		if err != nil {
			return nil, err
		}
		webhookURL = signedURL
	}
	payload := make(map[string]any)
	switch source.SourceType {
	case notificationdomain.SourceTypeDingTalk:
		payload["msgtype"] = "markdown"
		payload["markdown"] = map[string]string{
			"title": strings.TrimSpace(firstNonEmpty(title, "GOS Release Notification")),
			"text":  strings.TrimSpace(firstNonEmpty(body, title)),
		}
	case notificationdomain.SourceTypeWeCom:
		content := strings.TrimSpace(body)
		if content == "" {
			content = strings.TrimSpace(title)
		} else if strings.TrimSpace(title) != "" {
			content = fmt.Sprintf("## %s\n\n%s", strings.TrimSpace(title), content)
		}
		payload["msgtype"] = "markdown"
		payload["markdown"] = map[string]string{
			"content": content,
		}
	default:
		return nil, fmt.Errorf("%w: unsupported notification source type %s", ErrInvalidInput, source.SourceType)
	}
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, webhookURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	return req, nil
}

func buildDingTalkWebhookURL(webhookURL string, verificationParam string) (string, error) {
	secret := strings.TrimSpace(verificationParam)
	if secret == "" {
		return webhookURL, nil
	}
	parsedURL, err := url.Parse(webhookURL)
	if err != nil {
		return "", fmt.Errorf("%w: invalid dingtalk webhook_url", ErrInvalidInput)
	}
	timestamp := strconv.FormatInt(time.Now().UnixMilli(), 10)
	stringToSign := timestamp + "\n" + secret
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write([]byte(stringToSign))
	signature := base64.StdEncoding.EncodeToString(mac.Sum(nil))
	query := parsedURL.Query()
	query.Set("timestamp", timestamp)
	query.Set("sign", signature)
	parsedURL.RawQuery = query.Encode()
	return parsedURL.String(), nil
}

func sendTemplateWebhook(req *http.Request) (*http.Response, error) {
	webhookClient := &http.Client{Timeout: templateWebhookHTTPTimeout}
	return webhookClient.Do(req)
}

func (uc *ReleaseOrderManager) syncRunningHookStep(
	ctx context.Context,
	order domain.ReleaseOrder,
	hook domain.ReleaseTemplateHook,
	step domain.ReleaseOrderStep,
) (bool, bool, bool, error) {
	switch hook.HookType {
	case domain.TemplateHookTypeAgentTask:
		return uc.syncRunningAgentTaskHookStep(ctx, order, hook, step)
	case domain.TemplateHookTypeNotificationHook:
		return false, true, false, nil
	case domain.TemplateHookTypeWebhookNotification:
		return false, true, false, nil
	default:
		return false, true, true, fmt.Errorf("%w: unsupported hook type %s", ErrInvalidInput, hook.HookType)
	}
}

func (uc *ReleaseOrderManager) syncRunningAgentTaskHookStep(
	ctx context.Context,
	order domain.ReleaseOrder,
	hook domain.ReleaseTemplateHook,
	step domain.ReleaseOrderStep,
) (bool, bool, bool, error) {
	taskID := parseHookTaskID(step.Message)
	if taskID == "" {
		failMessage := "Hook 任务缺少任务号，无法继续追踪"
		if hook.FailurePolicy == domain.TemplateHookFailurePolicyWarnOnly {
			return true, true, false, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, "Hook 执行失败已忽略："+failMessage)
		}
		return true, true, true, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusFailed, failMessage)
	}
	task, err := uc.agentRepo.GetTaskByID(ctx, taskID)
	if err != nil {
		return false, false, false, err
	}

	progressMessage := buildHookTaskProgressMessage(hook, task, agentdomain.Instance{
		AgentCode: task.AgentCode,
		Name:      task.AgentCode,
	})
	switch task.Status {
	case agentdomain.TaskStatusPending, agentdomain.TaskStatusQueued, agentdomain.TaskStatusClaimed, agentdomain.TaskStatusRunning:
		if strings.TrimSpace(progressMessage) != strings.TrimSpace(step.Message) {
			return true, false, false, uc.markStep(ctx, order.ID, step.StepCode, domain.StepStatusRunning, progressMessage, step.StartedAt, nil)
		}
		return false, false, false, nil
	case agentdomain.TaskStatusSuccess:
		return true, true, false, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, buildHookTaskTerminalMessage(hook, task, "执行成功"))
	case agentdomain.TaskStatusCancelled:
		if hook.FailurePolicy == domain.TemplateHookFailurePolicyWarnOnly {
			return true, true, false, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, "Hook 执行已取消并忽略："+buildHookTaskTerminalMessage(hook, task, "已取消"))
		}
		return true, true, true, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusFailed, buildHookTaskTerminalMessage(hook, task, "已取消"))
	case agentdomain.TaskStatusFailed:
		if hook.FailurePolicy == domain.TemplateHookFailurePolicyWarnOnly {
			return true, true, false, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusSuccess, "Hook 执行失败已忽略："+buildHookTaskTerminalMessage(hook, task, "执行失败"))
		}
		return true, true, true, uc.markStepFinished(ctx, order.ID, step.StepCode, domain.StepStatusFailed, buildHookTaskTerminalMessage(hook, task, "执行失败"))
	default:
		return false, false, false, nil
	}
}

func (uc *ReleaseOrderManager) resolveHookTargetAgent(
	ctx context.Context,
	order domain.ReleaseOrder,
	sourceTask agentdomain.Task,
) (agentdomain.Instance, error) {
	if uc.agentRepo == nil {
		return agentdomain.Instance{}, fmt.Errorf("%w: agent repository is not configured", ErrInvalidInput)
	}
	if strings.TrimSpace(sourceTask.AgentID) != "" {
		instance, err := uc.agentRepo.GetInstanceByID(ctx, sourceTask.AgentID)
		if err == nil && instance.Status == agentdomain.StatusActive {
			return instance, nil
		}
	}

	items, _, err := uc.agentRepo.ListInstances(ctx, agentdomain.ListFilter{
		Status:   agentdomain.StatusActive,
		Page:     1,
		PageSize: 500,
	})
	if err != nil {
		return agentdomain.Instance{}, err
	}
	if len(items) == 0 {
		return agentdomain.Instance{}, fmt.Errorf("%w: no active agent instance", ErrInvalidInput)
	}

	targetEnv := strings.ToLower(strings.TrimSpace(order.EnvCode))
	sort.SliceStable(items, func(i, j int) bool {
		left := agentInstancePriority(items[i], targetEnv)
		right := agentInstancePriority(items[j], targetEnv)
		if left != right {
			return left < right
		}
		return strings.Compare(items[i].AgentCode, items[j].AgentCode) < 0
	})
	return items[0], nil
}

func agentInstancePriority(item agentdomain.Instance, targetEnv string) int {
	priority := 30
	if strings.EqualFold(strings.TrimSpace(item.EnvironmentCode), targetEnv) {
		priority -= 20
	}
	switch deriveAgentRuntimeState(item) {
	case agentdomain.RuntimeStateOnline:
		priority -= 8
	case agentdomain.RuntimeStateBusy:
		priority -= 4
	}
	return priority
}

func (uc *ReleaseOrderManager) buildHookTaskVariables(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
) (map[string]string, error) {
	orderParams, err := uc.repo.ListParams(ctx, order.ID)
	if err != nil {
		return nil, err
	}
	appKey := ""
	if uc.appRepo != nil && strings.TrimSpace(order.ApplicationID) != "" {
		if appItem, appErr := uc.appRepo.GetByID(ctx, order.ApplicationID); appErr == nil {
			appKey = strings.TrimSpace(appItem.Key)
		}
	}

	keys := []string{
		"app_key",
		"app_name",
		"project_name",
		"env",
		"env_code",
		"branch",
		"git_ref",
		"image_version",
		"image_tag",
	}
	values := make(map[string]string, len(keys)+4)
	for _, key := range keys {
		if value := strings.TrimSpace(uc.resolveStandardFieldValue(order, orderParams, executions, appKey, key)); value != "" {
			values[key] = value
		}
	}
	values["order_no"] = strings.TrimSpace(order.OrderNo)
	values["operation_type"] = strings.TrimSpace(string(order.OperationType))
	values["source_order_no"] = strings.TrimSpace(order.SourceOrderNo)
	mainStatus, _, mainDone := evaluateMainReleaseStatus(executions)
	if mainDone {
		values["release_status"] = strings.TrimSpace(string(mainStatus))
	}
	for _, item := range orderParams {
		key := strings.ToLower(strings.TrimSpace(item.ParamKey))
		if key == "" {
			continue
		}
		if _, exists := values[key]; exists {
			continue
		}
		value := strings.TrimSpace(item.ParamValue)
		if value == "" {
			continue
		}
		values[key] = value
	}
	return values, nil
}

func renderHookString(values map[string]string, template string) string {
	text := strings.TrimSpace(template)
	if text == "" {
		return ""
	}
	if len(values) == 0 {
		return text
	}
	replacerArgs := make([]string, 0, len(values)*2)
	for key, value := range values {
		replacerArgs = append(replacerArgs, "{"+key+"}", value)
	}
	return strings.NewReplacer(replacerArgs...).Replace(text)
}

func (uc *ReleaseOrderManager) resolveHookTaskInitialStatus(ctx context.Context, agentID string) (agentdomain.TaskStatus, error) {
	if uc.agentRepo == nil || strings.TrimSpace(agentID) == "" {
		return agentdomain.TaskStatusPending, nil
	}
	items, _, err := uc.agentRepo.ListTasks(ctx, agentdomain.TaskListFilter{
		AgentID:  strings.TrimSpace(agentID),
		Statuses: []agentdomain.TaskStatus{agentdomain.TaskStatusPending, agentdomain.TaskStatusQueued, agentdomain.TaskStatusClaimed, agentdomain.TaskStatusRunning},
		Page:     1,
		PageSize: 500,
	})
	if err != nil {
		return agentdomain.TaskStatusPending, err
	}
	if len(items) > 0 {
		return agentdomain.TaskStatusQueued, nil
	}
	return agentdomain.TaskStatusPending, nil
}

func buildHookTaskProgressMessage(hook domain.ReleaseTemplateHook, task agentdomain.Task, agentInstance agentdomain.Instance) string {
	agentName := firstNonEmpty(strings.TrimSpace(agentInstance.Name), strings.TrimSpace(agentInstance.AgentCode), strings.TrimSpace(task.AgentCode), "未指定 Agent")
	taskName := firstNonEmpty(strings.TrimSpace(hook.TargetName), strings.TrimSpace(task.Name), strings.TrimSpace(task.ScriptName), strings.TrimSpace(task.ID))
	statusText := "待领取"
	switch task.Status {
	case agentdomain.TaskStatusQueued:
		statusText = "排队中"
	case agentdomain.TaskStatusClaimed:
		statusText = "已领取"
	case agentdomain.TaskStatusRunning:
		statusText = "执行中"
	}
	return fmt.Sprintf("任务：%s，目标 Agent：%s，当前状态：%s，task_id=%s", taskName, agentName, statusText, strings.TrimSpace(task.ID))
}

func buildHookTaskTerminalMessage(hook domain.ReleaseTemplateHook, task agentdomain.Task, prefix string) string {
	taskName := firstNonEmpty(strings.TrimSpace(hook.TargetName), strings.TrimSpace(task.Name), strings.TrimSpace(task.ScriptName), strings.TrimSpace(task.ID))
	summary := firstNonEmpty(strings.TrimSpace(task.LastRunSummary), strings.TrimSpace(task.FailureReason))
	if summary == "" {
		return fmt.Sprintf("%s：%s，任务号：%s", prefix, taskName, strings.TrimSpace(task.ID))
	}
	return fmt.Sprintf("%s：%s，任务号：%s，摘要：%s", prefix, taskName, strings.TrimSpace(task.ID), summary)
}

func parseHookTaskID(message string) string {
	matches := hookTaskIDPattern.FindStringSubmatch(strings.TrimSpace(message))
	if len(matches) < 2 {
		return ""
	}
	return strings.TrimSpace(matches[1])
}

func deriveAgentRuntimeState(item agentdomain.Instance) agentdomain.RuntimeState {
	if item.Status == agentdomain.StatusDisabled {
		return agentdomain.RuntimeStateDisabled
	}
	if item.Status == agentdomain.StatusMaintenance {
		return agentdomain.RuntimeStateMaintenance
	}
	if item.CurrentTaskID != "" {
		return agentdomain.RuntimeStateBusy
	}
	if item.LastHeartbeatAt.IsZero() {
		return agentdomain.RuntimeStateOffline
	}
	if time.Since(item.LastHeartbeatAt.UTC()) > 2*time.Minute {
		return agentdomain.RuntimeStateOffline
	}
	return agentdomain.RuntimeStateOnline
}
