package usecase

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	appdomain "gos/internal/domain/application"
	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/release"
)

type ReleaseOrderManager struct {
	repo         domain.Repository
	appRepo      appdomain.Repository
	pipelineRepo pipelinedomain.Repository
	jenkins      JenkinsReleaseExecutor
	now          func() time.Time
}

type CreateReleaseOrderInput struct {
	ApplicationID string
	BindingID     string
	EnvCode       string
	SonService    string
	GitRef        string
	ImageTag      string
	TriggerType   domain.TriggerType
	Remark        string
	TriggeredBy   string
	Params        []CreateReleaseOrderParamInput
	Steps         []CreateReleaseOrderStepInput
}

type CreateReleaseOrderParamInput struct {
	ParamKey          string
	ExecutorParamName string
	ParamValue        string
	ValueSource       domain.ValueSource
}

type CreateReleaseOrderStepInput struct {
	StepCode string
	StepName string
	SortNo   int
}

type ListReleaseOrderInput struct {
	ApplicationID string
	BindingID     string
	EnvCode       string
	Status        domain.OrderStatus
	TriggerType   domain.TriggerType
	Page          int
	PageSize      int
}

type FinishReleaseOrderStepInput struct {
	Status  domain.StepStatus
	Message string
}

type JenkinsReleaseExecutor interface {
	TriggerBuild(ctx context.Context, fullName string, params map[string]string) (queueURL string, err error)
	GetQueueItem(ctx context.Context, queueURL string) (executableURL string, cancelled bool, why string, err error)
	AbortQueueItem(ctx context.Context, queueURL string) error
	AbortBuild(ctx context.Context, buildURL string) error
}

func NewReleaseOrderManager(
	repo domain.Repository,
	appRepo appdomain.Repository,
	pipelineRepo pipelinedomain.Repository,
	jenkins JenkinsReleaseExecutor,
) *ReleaseOrderManager {
	return &ReleaseOrderManager{
		repo:         repo,
		appRepo:      appRepo,
		pipelineRepo: pipelineRepo,
		jenkins:      jenkins,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *ReleaseOrderManager) Create(
	ctx context.Context,
	input CreateReleaseOrderInput,
) (domain.ReleaseOrder, error) {
	applicationID := strings.TrimSpace(input.ApplicationID)
	bindingID := strings.TrimSpace(input.BindingID)
	envCode := strings.TrimSpace(input.EnvCode)
	if applicationID == "" || bindingID == "" || envCode == "" {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: application_id, binding_id and env_code are required", ErrInvalidInput)
	}

	app, err := uc.appRepo.GetByID(ctx, applicationID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	binding, err := uc.pipelineRepo.GetBindingByID(ctx, bindingID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if binding.ApplicationID != applicationID {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: binding does not belong to application", ErrInvalidInput)
	}

	triggerType := input.TriggerType
	if triggerType == "" {
		triggerType = domain.TriggerTypeManual
	}
	if !triggerType.Valid() {
		return domain.ReleaseOrder{}, ErrInvalidInput
	}

	now := uc.now()
	order := domain.ReleaseOrder{
		ID:              generateID("ro"),
		OrderNo:         generateOrderNo(now),
		ApplicationID:   applicationID,
		ApplicationName: app.Name,
		BindingID:       bindingID,
		PipelineID:      strings.TrimSpace(binding.PipelineID),
		EnvCode:         envCode,
		SonService:      strings.TrimSpace(input.SonService),
		GitRef:          strings.TrimSpace(input.GitRef),
		ImageTag:        strings.TrimSpace(input.ImageTag),
		TriggerType:     triggerType,
		Status:          domain.OrderStatusPending,
		Remark:          strings.TrimSpace(input.Remark),
		TriggeredBy:     strings.TrimSpace(input.TriggeredBy),
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	params, err := uc.buildCreateParams(order.ID, now, input.Params)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	steps, err := uc.buildCreateSteps(order.ID, now, input.Steps)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	if err := uc.repo.Create(ctx, order, params, steps); err != nil {
		return domain.ReleaseOrder{}, err
	}
	return uc.repo.GetByID(ctx, order.ID)
}

func (uc *ReleaseOrderManager) List(ctx context.Context, input ListReleaseOrderInput) ([]domain.ReleaseOrder, int64, error) {
	const (
		defaultPage     = 1
		defaultPageSize = 20
		maxPageSize     = 100
	)

	input.ApplicationID = strings.TrimSpace(input.ApplicationID)
	input.BindingID = strings.TrimSpace(input.BindingID)
	input.EnvCode = strings.TrimSpace(input.EnvCode)
	if input.Status != "" && !input.Status.Valid() {
		return nil, 0, ErrInvalidStatus
	}
	if input.TriggerType != "" && !input.TriggerType.Valid() {
		return nil, 0, ErrInvalidInput
	}
	if input.Page <= 0 {
		input.Page = defaultPage
	}
	if input.PageSize <= 0 {
		input.PageSize = defaultPageSize
	}
	if input.PageSize > maxPageSize {
		input.PageSize = maxPageSize
	}

	return uc.repo.List(ctx, domain.ListFilter{
		ApplicationID: input.ApplicationID,
		BindingID:     input.BindingID,
		EnvCode:       input.EnvCode,
		Status:        input.Status,
		TriggerType:   input.TriggerType,
		Page:          input.Page,
		PageSize:      input.PageSize,
	})
}

func (uc *ReleaseOrderManager) GetByID(ctx context.Context, id string) (domain.ReleaseOrder, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.ReleaseOrder{}, ErrInvalidID
	}
	return uc.repo.GetByID(ctx, id)
}

func (uc *ReleaseOrderManager) Cancel(ctx context.Context, id string) (domain.ReleaseOrder, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.ReleaseOrder{}, ErrInvalidID
	}

	order, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	switch order.Status {
	case domain.OrderStatusPending, domain.OrderStatusRunning:
		// allowed
	default:
		return domain.ReleaseOrder{}, fmt.Errorf("%w: release order cannot be cancelled in current status", ErrInvalidInput)
	}

	now := uc.now()
	steps, err := uc.repo.ListSteps(ctx, id)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	cancelNote := ""
	if order.Status == domain.OrderStatusRunning {
		cancelNote = uc.abortJenkinsExecution(ctx, order, steps)
	}

	// Mark jenkins-related in-flight steps as finished to avoid stale "running/pending" states after cancel.
	for _, step := range steps {
		if !shouldFinishStepOnCancel(step) {
			continue
		}
		startedAt := step.StartedAt
		if startedAt == nil {
			startedAt = &now
		}
		message := "发布已取消"
		if cancelNote != "" {
			message = message + "，" + cancelNote
		}
		_, updateErr := uc.repo.UpdateStep(ctx, id, step.StepCode, domain.StepUpdateInput{
			Status:     domain.StepStatusFailed,
			Message:    message,
			StartedAt:  startedAt,
			FinishedAt: &now,
		})
		if updateErr != nil && !errors.Is(updateErr, domain.ErrStepNotFound) {
			return domain.ReleaseOrder{}, updateErr
		}
	}

	return uc.repo.UpdateStatus(ctx, id, domain.OrderStatusCancelled, order.StartedAt, &now, now)
}

func shouldFinishStepOnCancel(step domain.ReleaseOrderStep) bool {
	if step.Status == domain.StepStatusRunning {
		return true
	}
	if step.Status != domain.StepStatusPending {
		return false
	}
	switch step.StepCode {
	case "trigger_pipeline", "pipeline_running", "pipeline_success":
		return true
	default:
		return false
	}
}

func (uc *ReleaseOrderManager) abortJenkinsExecution(
	ctx context.Context,
	order domain.ReleaseOrder,
	steps []domain.ReleaseOrderStep,
) string {
	if uc.jenkins == nil {
		return ""
	}

	binding, err := uc.pipelineRepo.GetBindingByID(ctx, order.BindingID)
	if err != nil || binding.Provider != pipelinedomain.ProviderJenkins {
		return ""
	}

	queueURL := strings.TrimSpace(extractQueueURLFromSteps(steps))
	if queueURL == "" {
		return ""
	}

	buildURL, cancelled, _, queueErr := uc.jenkins.GetQueueItem(ctx, queueURL)
	if queueErr != nil {
		if !isResourceNotFoundError(queueErr) {
			return "尝试终止 Jenkins 任务失败"
		}
		return ""
	}
	if cancelled {
		return "Jenkins 队列已取消"
	}

	buildURL = strings.TrimSpace(buildURL)
	if buildURL != "" {
		if err := uc.jenkins.AbortBuild(ctx, buildURL); err != nil {
			return "尝试停止 Jenkins 构建失败"
		}
		return "已发送 Jenkins 停止构建请求"
	}

	if err := uc.jenkins.AbortQueueItem(ctx, queueURL); err != nil {
		return "尝试取消 Jenkins 队列失败"
	}
	return "已发送 Jenkins 取消队列请求"
}

func (uc *ReleaseOrderManager) Execute(ctx context.Context, id string) (domain.ReleaseOrder, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.ReleaseOrder{}, ErrInvalidID
	}
	if uc.jenkins == nil {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: jenkins executor is not configured", ErrInvalidInput)
	}

	order, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if !isPendingOrderStatus(order.Status) {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: only pending release order can be executed", ErrInvalidInput)
	}

	binding, err := uc.pipelineRepo.GetBindingByID(ctx, order.BindingID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if binding.Provider != pipelinedomain.ProviderJenkins {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: only jenkins provider is supported", ErrInvalidInput)
	}

	pipelineID := strings.TrimSpace(order.PipelineID)
	if pipelineID == "" {
		pipelineID = strings.TrimSpace(binding.PipelineID)
	}
	if pipelineID == "" {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: pipeline_id is required", ErrInvalidInput)
	}

	pipeline, err := uc.pipelineRepo.GetPipelineByID(ctx, pipelineID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if pipeline.Provider != pipelinedomain.ProviderJenkins {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: bound pipeline provider is not jenkins", ErrInvalidInput)
	}
	if strings.TrimSpace(pipeline.JobFullName) == "" {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: jenkins job full name is empty", ErrInvalidInput)
	}

	orderParams, err := uc.repo.ListParams(ctx, order.ID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	buildParams := make(map[string]string)
	for _, item := range orderParams {
		name := strings.TrimSpace(item.ExecutorParamName)
		if name == "" {
			continue
		}
		buildParams[name] = strings.TrimSpace(item.ParamValue)
	}

	startedAt := uc.now()
	order, err = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusRunning, &startedAt, nil, startedAt)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	_ = uc.markStepRunning(ctx, order.ID, "param_resolve", "开始解析发布参数")
	_ = uc.markStepFinished(ctx, order.ID, "param_resolve", domain.StepStatusSuccess, fmt.Sprintf("参数解析完成，总计 %d 项", len(buildParams)))
	_ = uc.markStepRunning(ctx, order.ID, "trigger_pipeline", "开始触发 Jenkins 管线")

	queueURL, triggerErr := uc.jenkins.TriggerBuild(ctx, pipeline.JobFullName, buildParams)
	if triggerErr != nil {
		_ = uc.markStepFinished(ctx, order.ID, "trigger_pipeline", domain.StepStatusFailed, "触发 Jenkins 失败: "+triggerErr.Error())
		finishedAt := uc.now()
		_, _ = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusFailed, order.StartedAt, &finishedAt, finishedAt)
		return domain.ReleaseOrder{}, fmt.Errorf("%w: trigger jenkins failed: %v", ErrInvalidInput, triggerErr)
	}

	triggerMessage := "Jenkins 触发成功"
	if strings.TrimSpace(queueURL) != "" {
		triggerMessage = triggerMessage + "，queue: " + strings.TrimSpace(queueURL)
	}
	_ = uc.markStepFinished(ctx, order.ID, "trigger_pipeline", domain.StepStatusSuccess, triggerMessage)
	_ = uc.markStepRunning(ctx, order.ID, "pipeline_running", "管线已触发，等待执行结果回传")

	return uc.repo.GetByID(ctx, order.ID)
}

func (uc *ReleaseOrderManager) ListParams(ctx context.Context, orderID string) ([]domain.ReleaseOrderParam, error) {
	orderID = strings.TrimSpace(orderID)
	if orderID == "" {
		return nil, ErrInvalidID
	}
	if _, err := uc.repo.GetByID(ctx, orderID); err != nil {
		return nil, err
	}
	return uc.repo.ListParams(ctx, orderID)
}

func (uc *ReleaseOrderManager) markStepRunning(ctx context.Context, orderID string, stepCode string, message string) error {
	now := uc.now()
	return uc.markStep(ctx, orderID, stepCode, domain.StepStatusRunning, strings.TrimSpace(message), &now, nil)
}

func (uc *ReleaseOrderManager) markStepFinished(
	ctx context.Context,
	orderID string,
	stepCode string,
	status domain.StepStatus,
	message string,
) error {
	if status != domain.StepStatusSuccess && status != domain.StepStatusFailed {
		return ErrInvalidStatus
	}
	current, err := uc.repo.GetStepByCode(ctx, orderID, stepCode)
	if err != nil {
		if errors.Is(err, domain.ErrStepNotFound) {
			return nil
		}
		return err
	}

	startedAt := current.StartedAt
	now := uc.now()
	if startedAt == nil {
		startedAt = &now
	}
	return uc.markStep(ctx, orderID, stepCode, status, strings.TrimSpace(message), startedAt, &now)
}

func (uc *ReleaseOrderManager) markStep(
	ctx context.Context,
	orderID string,
	stepCode string,
	status domain.StepStatus,
	message string,
	startedAt *time.Time,
	finishedAt *time.Time,
) error {
	_, err := uc.repo.UpdateStep(ctx, orderID, stepCode, domain.StepUpdateInput{
		Status:     status,
		Message:    message,
		StartedAt:  startedAt,
		FinishedAt: finishedAt,
	})
	if err != nil {
		if errors.Is(err, domain.ErrStepNotFound) {
			return nil
		}
		return err
	}
	return nil
}

func (uc *ReleaseOrderManager) ListSteps(ctx context.Context, orderID string) ([]domain.ReleaseOrderStep, error) {
	orderID = strings.TrimSpace(orderID)
	if orderID == "" {
		return nil, ErrInvalidID
	}
	if _, err := uc.repo.GetByID(ctx, orderID); err != nil {
		return nil, err
	}
	return uc.repo.ListSteps(ctx, orderID)
}

func (uc *ReleaseOrderManager) StartStep(
	ctx context.Context,
	orderID string,
	stepCode string,
	message string,
) (domain.ReleaseOrderStep, domain.ReleaseOrder, error) {
	orderID = strings.TrimSpace(orderID)
	stepCode = strings.TrimSpace(stepCode)
	message = strings.TrimSpace(message)
	if orderID == "" || stepCode == "" {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, ErrInvalidID
	}

	order, err := uc.repo.GetByID(ctx, orderID)
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}
	if order.Status.IsTerminal() {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, fmt.Errorf("%w: release order is already finished", ErrInvalidInput)
	}

	step, err := uc.repo.GetStepByCode(ctx, orderID, stepCode)
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}
	if step.Status != domain.StepStatusPending {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, fmt.Errorf("%w: step is not pending", ErrInvalidInput)
	}

	allSteps, err := uc.repo.ListSteps(ctx, orderID)
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}
	if err := ensureStepOrder(allSteps, step); err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}

	now := uc.now()
	updatedStep, err := uc.repo.UpdateStep(ctx, orderID, stepCode, domain.StepUpdateInput{
		Status:     domain.StepStatusRunning,
		Message:    message,
		StartedAt:  &now,
		FinishedAt: nil,
	})
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}

	if order.Status == domain.OrderStatusPending {
		order, err = uc.repo.UpdateStatus(ctx, orderID, domain.OrderStatusRunning, &now, nil, now)
		if err != nil {
			return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
		}
	} else {
		order, err = uc.repo.GetByID(ctx, orderID)
		if err != nil {
			return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
		}
	}

	return updatedStep, order, nil
}

func (uc *ReleaseOrderManager) FinishStep(
	ctx context.Context,
	orderID string,
	stepCode string,
	input FinishReleaseOrderStepInput,
) (domain.ReleaseOrderStep, domain.ReleaseOrder, error) {
	orderID = strings.TrimSpace(orderID)
	stepCode = strings.TrimSpace(stepCode)
	input.Message = strings.TrimSpace(input.Message)
	if orderID == "" || stepCode == "" {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, ErrInvalidID
	}

	if input.Status == "" {
		input.Status = domain.StepStatusSuccess
	}
	if input.Status != domain.StepStatusSuccess && input.Status != domain.StepStatusFailed {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, ErrInvalidStatus
	}

	order, err := uc.repo.GetByID(ctx, orderID)
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}
	if order.Status.IsTerminal() {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, fmt.Errorf("%w: release order is already finished", ErrInvalidInput)
	}

	step, err := uc.repo.GetStepByCode(ctx, orderID, stepCode)
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}
	if step.Status != domain.StepStatusRunning {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, fmt.Errorf("%w: step is not running", ErrInvalidInput)
	}

	now := uc.now()
	startedAt := step.StartedAt
	if startedAt == nil {
		startedAt = &now
	}

	updatedStep, err := uc.repo.UpdateStep(ctx, orderID, stepCode, domain.StepUpdateInput{
		Status:     input.Status,
		Message:    input.Message,
		StartedAt:  startedAt,
		FinishedAt: &now,
	})
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}

	steps, err := uc.repo.ListSteps(ctx, orderID)
	if err != nil {
		return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
	}

	nextOrderStatus, shouldUpdateOrder := deriveOrderStatusFromSteps(steps)
	if input.Status == domain.StepStatusFailed {
		nextOrderStatus = domain.OrderStatusFailed
		shouldUpdateOrder = true
	}
	if shouldUpdateOrder && nextOrderStatus != order.Status {
		started := order.StartedAt
		if started == nil {
			started = &now
		}
		finished := &now
		if nextOrderStatus == domain.OrderStatusRunning {
			finished = nil
		}
		order, err = uc.repo.UpdateStatus(ctx, orderID, nextOrderStatus, started, finished, now)
		if err != nil {
			return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
		}
	} else {
		order, err = uc.repo.GetByID(ctx, orderID)
		if err != nil {
			return domain.ReleaseOrderStep{}, domain.ReleaseOrder{}, err
		}
	}

	return updatedStep, order, nil
}

func (uc *ReleaseOrderManager) buildCreateParams(
	orderID string,
	now time.Time,
	input []CreateReleaseOrderParamInput,
) ([]domain.ReleaseOrderParam, error) {
	items := make([]domain.ReleaseOrderParam, 0, len(input))
	for _, item := range input {
		paramKey := strings.TrimSpace(item.ParamKey)
		if paramKey == "" {
			return nil, fmt.Errorf("%w: param_key is required", ErrInvalidInput)
		}
		source := item.ValueSource
		if source == "" {
			source = domain.ValueSourceReleaseInput
		}
		if !source.Valid() {
			return nil, ErrInvalidSourceFrom
		}
		items = append(items, domain.ReleaseOrderParam{
			ID:                generateID("rop"),
			ReleaseOrderID:    orderID,
			ParamKey:          paramKey,
			ExecutorParamName: strings.TrimSpace(item.ExecutorParamName),
			ParamValue:        strings.TrimSpace(item.ParamValue),
			ValueSource:       source,
			CreatedAt:         now,
		})
	}
	return items, nil
}

func (uc *ReleaseOrderManager) buildCreateSteps(
	orderID string,
	now time.Time,
	input []CreateReleaseOrderStepInput,
) ([]domain.ReleaseOrderStep, error) {
	if len(input) == 0 {
		return defaultReleaseOrderSteps(orderID, now), nil
	}

	items := make([]domain.ReleaseOrderStep, 0, len(input))
	seen := make(map[string]struct{}, len(input))
	for idx, item := range input {
		stepCode := strings.TrimSpace(item.StepCode)
		if stepCode == "" {
			return nil, fmt.Errorf("%w: step_code is required", ErrInvalidInput)
		}
		if _, exists := seen[stepCode]; exists {
			return nil, fmt.Errorf("%w: duplicated step_code %s", ErrInvalidInput, stepCode)
		}
		seen[stepCode] = struct{}{}

		stepName := strings.TrimSpace(item.StepName)
		if stepName == "" {
			stepName = stepCode
		}
		sortNo := item.SortNo
		if sortNo <= 0 {
			sortNo = idx + 1
		}
		items = append(items, domain.ReleaseOrderStep{
			ID:             generateID("ros"),
			ReleaseOrderID: orderID,
			StepCode:       stepCode,
			StepName:       stepName,
			Status:         domain.StepStatusPending,
			Message:        "",
			SortNo:         sortNo,
			CreatedAt:      now,
		})
	}
	return items, nil
}

func defaultReleaseOrderSteps(orderID string, now time.Time) []domain.ReleaseOrderStep {
	templates := []struct {
		Code string
		Name string
	}{
		{Code: "param_resolve", Name: "参数解析"},
		{Code: "trigger_pipeline", Name: "触发管线"},
		{Code: "pipeline_running", Name: "管线运行"},
		{Code: "pipeline_success", Name: "发布成功"},
	}

	items := make([]domain.ReleaseOrderStep, 0, len(templates))
	for idx, item := range templates {
		items = append(items, domain.ReleaseOrderStep{
			ID:             generateID("ros"),
			ReleaseOrderID: orderID,
			StepCode:       item.Code,
			StepName:       item.Name,
			Status:         domain.StepStatusPending,
			SortNo:         idx + 1,
			CreatedAt:      now,
		})
	}
	return items
}

func deriveOrderStatusFromSteps(steps []domain.ReleaseOrderStep) (domain.OrderStatus, bool) {
	if len(steps) == 0 {
		return domain.OrderStatusRunning, false
	}

	allSuccess := true
	for _, step := range steps {
		switch step.Status {
		case domain.StepStatusFailed:
			return domain.OrderStatusFailed, true
		case domain.StepStatusSuccess:
			// continue
		case domain.StepStatusPending, domain.StepStatusRunning:
			allSuccess = false
		default:
			allSuccess = false
		}
	}

	if allSuccess {
		return domain.OrderStatusSuccess, true
	}
	return domain.OrderStatusRunning, false
}

func isPendingOrderStatus(status domain.OrderStatus) bool {
	normalized := strings.ToLower(strings.TrimSpace(string(status)))
	return normalized == "pending" || normalized == "pengding"
}

func ensureStepOrder(steps []domain.ReleaseOrderStep, current domain.ReleaseOrderStep) error {
	for _, item := range steps {
		if item.SortNo < current.SortNo && item.Status != domain.StepStatusSuccess {
			return fmt.Errorf("%w: previous step %s is not success", ErrInvalidInput, item.StepCode)
		}
	}
	return nil
}

func generateOrderNo(now time.Time) string {
	entropy := make([]byte, 4)
	if _, err := rand.Read(entropy); err != nil {
		return "RO-" + now.UTC().Format("20060102150405")
	}
	return "RO-" + now.UTC().Format("20060102150405") + "-" + strings.ToUpper(hex.EncodeToString(entropy))
}
