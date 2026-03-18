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
	pipelineparamdomain "gos/internal/domain/executorparam"
	pipelinedomain "gos/internal/domain/pipeline"
	platformparamdomain "gos/internal/domain/platformparam"
	domain "gos/internal/domain/release"
)

type ReleaseOrderManager struct {
	repo         domain.Repository
	appRepo      appdomain.Repository
	pipelineRepo pipelinedomain.Repository
	paramRepo    pipelineparamdomain.Repository
	platformRepo platformparamdomain.Repository
	jenkins      JenkinsReleaseExecutor
	argocd       ArgoCDReleaseExecutor
	gitops       GitOpsReleaseService
	now          func() time.Time
}

type CreateReleaseOrderInput struct {
	ApplicationID   string
	TemplateID      string
	PreviousOrderNo string
	EnvCode         string
	SonService      string
	GitRef          string
	ImageTag        string
	TriggerType     domain.TriggerType
	Remark          string
	CreatorUserID   string
	TriggeredBy     string
	Params          []CreateReleaseOrderParamInput
	Steps           []CreateReleaseOrderStepInput
}

type CreateReleaseOrderParamInput struct {
	PipelineScope     domain.PipelineScope
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
	ApplicationID  string
	ApplicationIDs []string
	CreatorUserID  string
	BindingID      string
	EnvCode        string
	Status         domain.OrderStatus
	TriggerType    domain.TriggerType
	Page           int
	PageSize       int
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
	GetBuildStages(ctx context.Context, buildURL string) ([]domain.ReleaseOrderPipelineStage, error)
	GetBuildStageLog(ctx context.Context, buildURL string, stageKey string) (domain.ReleaseOrderPipelineStageLog, error)
}

type ArgoCDReleaseExecutor interface {
	ListApplications(ctx context.Context) ([]ArgoCDApplicationSnapshot, error)
	GetApplication(ctx context.Context, name string) (ArgoCDApplicationSnapshot, error)
	SyncApplication(ctx context.Context, name string) error
}

// GitOpsReleaseService 只暴露 ArgoCD CD 模式下真正需要的最小能力：
// 在本地工作目录里受控修改 kustomization.yaml，并以平台身份提交推送。
type GitOpsReleaseService interface {
	UpdateKustomizationImage(
		ctx context.Context,
		repoURL string,
		sourcePath string,
		branch string,
		newTag string,
		commitMessage string,
	) (workspacePath string, manifestPath string, commitSHA string, previousTag string, changed bool, err error)
	BuildCommitMessage(fields map[string]string) string
}

func NewReleaseOrderManager(
	repo domain.Repository,
	appRepo appdomain.Repository,
	pipelineRepo pipelinedomain.Repository,
	paramRepo pipelineparamdomain.Repository,
	platformRepo platformparamdomain.Repository,
	jenkins JenkinsReleaseExecutor,
	argocd ArgoCDReleaseExecutor,
	gitops GitOpsReleaseService,
) *ReleaseOrderManager {
	return &ReleaseOrderManager{
		repo:         repo,
		appRepo:      appRepo,
		pipelineRepo: pipelineRepo,
		paramRepo:    paramRepo,
		platformRepo: platformRepo,
		jenkins:      jenkins,
		argocd:       argocd,
		gitops:       gitops,
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
	templateID := strings.TrimSpace(input.TemplateID)
	if applicationID == "" || templateID == "" {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: application_id and template_id are required", ErrInvalidInput)
	}

	app, err := uc.appRepo.GetByID(ctx, applicationID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	triggerType := input.TriggerType
	if triggerType == "" {
		triggerType = domain.TriggerTypeManual
	}
	if !triggerType.Valid() {
		return domain.ReleaseOrder{}, ErrInvalidInput
	}

	template, templateBindings, templateParams, err := uc.resolveTemplateForCreate(ctx, applicationID, templateID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if err := uc.validateCreateTemplateParams(ctx, template.ID, templateBindings, templateParams, input.Params); err != nil {
		return domain.ReleaseOrder{}, err
	}
	executions := uc.buildCreateExecutions("", uc.now(), templateBindings)
	summary := resolveReleaseOrderSummaryFields(input.Params)
	primaryExecution, ok := pickPrimaryExecution(executions)
	if !ok {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: release template has no enabled executions", ErrInvalidInput)
	}

	now := uc.now()
	order := domain.ReleaseOrder{
		ID:              generateID("ro"),
		OrderNo:         generateOrderNo(now),
		PreviousOrderNo: strings.TrimSpace(input.PreviousOrderNo),
		ApplicationID:   applicationID,
		ApplicationName: app.Name,
		TemplateID:      template.ID,
		TemplateName:    template.Name,
		BindingID:       primaryExecution.BindingID,
		PipelineID:      primaryExecution.PipelineID,
		EnvCode:         summary.EnvCode,
		SonService:      firstNonEmpty(summary.ProjectName, strings.TrimSpace(input.SonService)),
		GitRef:          firstNonEmpty(summary.GitRef, strings.TrimSpace(input.GitRef)),
		ImageTag:        firstNonEmpty(summary.ImageTag, strings.TrimSpace(input.ImageTag)),
		TriggerType:     triggerType,
		Status:          domain.OrderStatusPending,
		Remark:          strings.TrimSpace(input.Remark),
		CreatorUserID:   strings.TrimSpace(input.CreatorUserID),
		TriggeredBy:     strings.TrimSpace(input.TriggeredBy),
		CreatedAt:       now,
		UpdatedAt:       now,
	}

	executions = uc.buildCreateExecutions(order.ID, now, templateBindings)
	params, err := uc.buildCreateParams(order.ID, now, input.Params, executions)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	steps, err := uc.buildCreateSteps(order.ID, now, executions, input.Steps)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	if err := uc.repo.Create(ctx, order, executions, params, steps); err != nil {
		return domain.ReleaseOrder{}, err
	}
	return uc.repo.GetByID(ctx, order.ID)
}

func (uc *ReleaseOrderManager) CreateRollbackByApplication(
	ctx context.Context,
	applicationID string,
	creatorUserID string,
	triggeredBy string,
) (domain.ReleaseOrder, error) {
	applicationID = strings.TrimSpace(applicationID)
	if applicationID == "" {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: application_id is required", ErrInvalidInput)
	}

	items, _, err := uc.repo.List(ctx, domain.ListFilter{
		ApplicationID: applicationID,
		Status:        domain.OrderStatusSuccess,
		Page:          1,
		PageSize:      1,
	})
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if len(items) == 0 {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: 当前应用暂无可回滚的成功发布单", ErrInvalidInput)
	}

	sourceOrder := items[0]
	sourceParams, err := uc.repo.ListParams(ctx, sourceOrder.ID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	params := make([]CreateReleaseOrderParamInput, 0, len(sourceParams))
	for _, item := range sourceParams {
		params = append(params, CreateReleaseOrderParamInput{
			PipelineScope:     item.PipelineScope,
			ParamKey:          strings.TrimSpace(item.ParamKey),
			ExecutorParamName: strings.TrimSpace(item.ExecutorParamName),
			ParamValue:        strings.TrimSpace(item.ParamValue),
			ValueSource:       item.ValueSource,
		})
	}

	return uc.Create(ctx, CreateReleaseOrderInput{
		ApplicationID:   sourceOrder.ApplicationID,
		TemplateID:      sourceOrder.TemplateID,
		PreviousOrderNo: sourceOrder.OrderNo,
		TriggerType:     domain.TriggerTypeManual,
		Remark:          buildRollbackRemark(sourceOrder),
		CreatorUserID:   strings.TrimSpace(creatorUserID),
		TriggeredBy:     strings.TrimSpace(triggeredBy),
		Params:          params,
	})
}

func (uc *ReleaseOrderManager) validateCreateTemplateParams(
	ctx context.Context,
	templateID string,
	templateBindings []domain.ReleaseTemplateBinding,
	templateParams []domain.ReleaseTemplateParam,
	params []CreateReleaseOrderParamInput,
) error {
	allowed := make(map[string]releasedTemplateParamRule)
	allowedByParamKey := make(map[string]releasedTemplateParamRule)
	duplicateParamKeys := make(map[string]struct{})
	required := make(map[string]releasedTemplateParamRule)
	bindingByScope := make(map[domain.PipelineScope]domain.ReleaseTemplateBinding, len(templateBindings))
	for _, item := range templateBindings {
		bindingByScope[item.PipelineScope] = item
	}

	if templateID != "" {
		for _, item := range templateParams {
			if uc.paramRepo != nil {
				paramDef, err := uc.paramRepo.GetByID(ctx, item.ExecutorParamDefID)
				if err != nil {
					return err
				}
				if err := ensureActiveExecutorParamDef(paramDef, item.ParamName); err != nil {
					return err
				}
			}
			key := buildReleaseTemplateParamKey(item.PipelineScope, item.ParamKey, item.ExecutorParamName)
			rule := releasedTemplateParamRule{
				PipelineScope:     item.PipelineScope,
				ParamKey:          strings.ToLower(strings.TrimSpace(item.ParamKey)),
				ExecutorParamName: strings.TrimSpace(item.ExecutorParamName),
				Required:          item.Required,
			}
			allowed[key] = rule
			paramKey := buildReleaseTemplateScopeParamKey(item.PipelineScope, item.ParamKey)
			if paramKey != "" {
				if _, exists := allowedByParamKey[paramKey]; exists {
					delete(allowedByParamKey, paramKey)
					duplicateParamKeys[paramKey] = struct{}{}
				} else if _, duplicated := duplicateParamKeys[paramKey]; !duplicated {
					allowedByParamKey[paramKey] = rule
				}
			}
			if item.Required {
				required[key] = rule
			}
		}
	}

	submitted := make(map[string]struct{}, len(params))
	for _, item := range params {
		scope := item.PipelineScope
		paramKey := strings.ToLower(strings.TrimSpace(item.ParamKey))
		executorParamName := strings.TrimSpace(item.ExecutorParamName)
		if templateID == "" {
			return fmt.Errorf("%w: extra release params require release template", ErrInvalidInput)
		}
		if !scope.Valid() {
			return fmt.Errorf("%w: pipeline_scope is required", ErrInvalidInput)
		}
		if _, ok := bindingByScope[scope]; !ok {
			return fmt.Errorf("%w: scope %s is not enabled in selected release template", ErrInvalidInput, strings.ToUpper(string(scope)))
		}
		rule, key, ok := resolveReleaseTemplateRule(allowed, allowedByParamKey, scope, paramKey, executorParamName)
		if !ok {
			return fmt.Errorf("%w: param %s is not included in selected release template", ErrInvalidInput, executorParamNameOrKey(executorParamName, paramKey))
		}
		if strings.TrimSpace(item.ParamValue) == "" {
			if rule.Required {
				return fmt.Errorf("%w: param %s is required by selected release template", ErrInvalidInput, executorParamNameOrKey(executorParamName, paramKey))
			}
			continue
		}
		submitted[key] = struct{}{}
	}

	for key, rule := range required {
		if _, ok := submitted[key]; ok {
			continue
		}
		return fmt.Errorf("%w: param %s is required by selected release template", ErrInvalidInput, executorParamNameOrKey(rule.ExecutorParamName, rule.ParamKey))
	}
	return nil
}

type releasedTemplateParamRule struct {
	PipelineScope     domain.PipelineScope
	ParamKey          string
	ExecutorParamName string
	Required          bool
}

func buildReleaseTemplateScopeParamKey(scope domain.PipelineScope, paramKey string) string {
	return strings.ToLower(strings.TrimSpace(string(scope))) + "::" + strings.ToLower(strings.TrimSpace(paramKey))
}

func buildReleaseTemplateParamKey(scope domain.PipelineScope, paramKey string, executorParamName string) string {
	return buildReleaseTemplateScopeParamKey(scope, paramKey) + "::" + strings.ToLower(strings.TrimSpace(executorParamName))
}

func resolveReleaseTemplateRule(
	allowed map[string]releasedTemplateParamRule,
	allowedByParamKey map[string]releasedTemplateParamRule,
	scope domain.PipelineScope,
	paramKey string,
	executorParamName string,
) (releasedTemplateParamRule, string, bool) {
	key := buildReleaseTemplateParamKey(scope, paramKey, executorParamName)
	if rule, ok := allowed[key]; ok {
		return rule, key, true
	}
	if strings.TrimSpace(executorParamName) != "" {
		return releasedTemplateParamRule{}, "", false
	}
	rule, ok := allowedByParamKey[buildReleaseTemplateScopeParamKey(scope, paramKey)]
	if !ok {
		return releasedTemplateParamRule{}, "", false
	}
	return rule, buildReleaseTemplateParamKey(rule.PipelineScope, rule.ParamKey, rule.ExecutorParamName), true
}

func executorParamNameOrKey(executorParamName string, paramKey string) string {
	if strings.TrimSpace(executorParamName) != "" {
		return strings.TrimSpace(executorParamName)
	}
	return strings.TrimSpace(paramKey)
}

func (uc *ReleaseOrderManager) resolveTemplateForCreate(
	ctx context.Context,
	applicationID string,
	templateID string,
) (domain.ReleaseTemplate, []domain.ReleaseTemplateBinding, []domain.ReleaseTemplateParam, error) {
	templateID = strings.TrimSpace(templateID)
	if templateID == "" {
		return domain.ReleaseTemplate{}, nil, nil, fmt.Errorf("%w: template_id is required", ErrInvalidInput)
	}
	template, templateBindings, templateParams, err := uc.repo.GetTemplateByID(ctx, templateID)
	if err != nil {
		return domain.ReleaseTemplate{}, nil, nil, err
	}
	if template.Status != domain.TemplateStatusActive {
		return domain.ReleaseTemplate{}, nil, nil, fmt.Errorf("%w: release template is disabled", ErrInvalidInput)
	}
	if strings.TrimSpace(template.ApplicationID) != strings.TrimSpace(applicationID) {
		return domain.ReleaseTemplate{}, nil, nil, fmt.Errorf("%w: release template does not belong to application", ErrInvalidInput)
	}
	if len(templateBindings) == 0 {
		return domain.ReleaseTemplate{}, nil, nil, fmt.Errorf("%w: release template has no enabled pipeline scopes", ErrInvalidInput)
	}
	return template, templateBindings, templateParams, nil
}

type releaseOrderSummaryFields struct {
	EnvCode     string
	ProjectName string
	GitRef      string
	ImageTag    string
}

func resolveReleaseOrderSummaryFields(params []CreateReleaseOrderParamInput) releaseOrderSummaryFields {
	result := releaseOrderSummaryFields{}
	for _, item := range params {
		key := strings.ToLower(strings.TrimSpace(item.ParamKey))
		value := strings.TrimSpace(item.ParamValue)
		if value == "" {
			continue
		}
		switch key {
		case "env":
			if result.EnvCode == "" {
				result.EnvCode = value
			}
		case "project_name":
			if result.ProjectName == "" {
				result.ProjectName = value
			}
		case "branch":
			if result.GitRef == "" {
				result.GitRef = value
			}
		case "image_tag":
			if result.ImageTag == "" {
				result.ImageTag = value
			}
		case "image_version":
			if result.ImageTag == "" {
				result.ImageTag = value
			}
		}
	}
	return result
}

func firstNonEmpty(values ...string) string {
	for _, item := range values {
		value := strings.TrimSpace(item)
		if value != "" {
			return value
		}
	}
	return ""
}

func buildRollbackRemark(source domain.ReleaseOrder) string {
	orderNo := strings.TrimSpace(source.OrderNo)
	if orderNo == "" {
		return "回滚创建"
	}
	return fmt.Sprintf("回滚自发布单 %s", orderNo)
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
		ApplicationID:  input.ApplicationID,
		ApplicationIDs: normalizeReleaseApplicationIDs(input.ApplicationIDs),
		CreatorUserID:  strings.TrimSpace(input.CreatorUserID),
		BindingID:      input.BindingID,
		EnvCode:        input.EnvCode,
		Status:         input.Status,
		TriggerType:    input.TriggerType,
		Page:           input.Page,
		PageSize:       input.PageSize,
	})
}

func normalizeReleaseApplicationIDs(values []string) []string {
	if len(values) == 0 {
		return nil
	}
	result := make([]string, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, item := range values {
		value := strings.TrimSpace(item)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	if len(result) == 0 {
		return nil
	}
	return result
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
	executions, err := uc.repo.ListExecutions(ctx, id)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	cancelNotes := make([]string, 0)
	if order.Status == domain.OrderStatusRunning {
		for _, execution := range executions {
			note := uc.abortExecution(ctx, execution)
			if note != "" {
				cancelNotes = append(cancelNotes, note)
			}
			if execution.Status.IsTerminal() {
				continue
			}
			_, updateErr := uc.repo.UpdateExecutionByScope(ctx, id, execution.PipelineScope, domain.ExecutionUpdateInput{
				Status:     domain.ExecutionStatusCancelled,
				QueueURL:   execution.QueueURL,
				BuildURL:   execution.BuildURL,
				StartedAt:  execution.StartedAt,
				FinishedAt: &now,
				UpdatedAt:  now,
			})
			if updateErr != nil && !errors.Is(updateErr, domain.ErrExecutionNotFound) {
				return domain.ReleaseOrder{}, updateErr
			}
		}
	}

	for _, step := range steps {
		if !shouldFinishStepOnCancel(step) {
			continue
		}
		startedAt := step.StartedAt
		if startedAt == nil {
			startedAt = &now
		}
		message := "发布已取消"
		if len(cancelNotes) > 0 {
			message = message + "，" + strings.Join(cancelNotes, "；")
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
	return strings.Contains(step.StepCode, ":trigger_pipeline") ||
		strings.Contains(step.StepCode, ":pipeline_running") ||
		strings.Contains(step.StepCode, ":pipeline_success") ||
		step.StepCode == "global:release_finish"
}

func (uc *ReleaseOrderManager) abortExecution(ctx context.Context, execution domain.ReleaseOrderExecution) string {
	if uc.jenkins == nil {
		return ""
	}
	if strings.ToLower(strings.TrimSpace(execution.Provider)) != string(pipelinedomain.ProviderJenkins) {
		return ""
	}
	queueURL := strings.TrimSpace(execution.QueueURL)
	buildURL := strings.TrimSpace(execution.BuildURL)
	if queueURL == "" && buildURL == "" {
		return ""
	}
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
	if uc.jenkins == nil && uc.argocd == nil && uc.gitops == nil {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: release executor is not configured", ErrInvalidInput)
	}

	order, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if !isPendingOrderStatus(order.Status) {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: only pending release order can be executed", ErrInvalidInput)
	}
	executions, err := uc.repo.ListExecutions(ctx, order.ID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if len(executions) == 0 {
		return domain.ReleaseOrder{}, fmt.Errorf("%w: release order has no executions", ErrInvalidInput)
	}

	startedAt := uc.now()
	order, err = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusRunning, &startedAt, nil, startedAt)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	orderParams, err := uc.repo.ListParams(ctx, order.ID)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}

	_ = uc.markStepRunning(ctx, order.ID, "global:param_resolve", "开始解析发布参数")
	_ = uc.markStepFinished(ctx, order.ID, "global:param_resolve", domain.StepStatusSuccess, fmt.Sprintf("参数解析完成，总计 %d 项", len(orderParams)))

	if err := uc.startNextPendingExecution(ctx, order, executions, orderParams); err != nil {
		finishedAt := uc.now()
		_, _ = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusFailed, order.StartedAt, &finishedAt, finishedAt)
		return domain.ReleaseOrder{}, err
	}

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

func (uc *ReleaseOrderManager) ListExecutions(ctx context.Context, orderID string) ([]domain.ReleaseOrderExecution, error) {
	orderID = strings.TrimSpace(orderID)
	if orderID == "" {
		return nil, ErrInvalidID
	}
	if _, err := uc.repo.GetByID(ctx, orderID); err != nil {
		return nil, err
	}
	return uc.repo.ListExecutions(ctx, orderID)
}

func (uc *ReleaseOrderManager) startNextPendingExecution(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	orderParams []domain.ReleaseOrderParam,
) error {
	for _, execution := range orderExecutionsByScope(executions) {
		if execution.Status != domain.ExecutionStatusPending {
			continue
		}
		switch strings.ToLower(strings.TrimSpace(execution.Provider)) {
		case string(pipelinedomain.ProviderJenkins):
			// Jenkins 执行继续走现有触发链路。
		case string(pipelinedomain.ProviderArgoCD):
			return uc.startArgoCDExecution(ctx, order, execution, orderParams)
		default:
			now := uc.now()
			_, err := uc.repo.UpdateExecutionByScope(ctx, order.ID, execution.PipelineScope, domain.ExecutionUpdateInput{
				Status:     domain.ExecutionStatusSkipped,
				StartedAt:  &now,
				FinishedAt: &now,
				UpdatedAt:  now,
			})
			if err != nil {
				return err
			}
			_ = uc.markStepFinished(ctx, order.ID, scopeStepCode(execution.PipelineScope, "trigger_pipeline"), domain.StepStatusSuccess, strings.ToUpper(string(execution.PipelineScope))+" 非受支持执行器暂记为跳过")
			_ = uc.markStepFinished(ctx, order.ID, scopeStepCode(execution.PipelineScope, "pipeline_running"), domain.StepStatusSuccess, strings.ToUpper(string(execution.PipelineScope))+" 非受支持执行器暂记为跳过")
			_ = uc.markStepFinished(ctx, order.ID, scopeStepCode(execution.PipelineScope, "pipeline_success"), domain.StepStatusSuccess, strings.ToUpper(string(execution.PipelineScope))+" 已跳过")
			continue
		}

		binding, err := uc.pipelineRepo.GetBindingByID(ctx, execution.BindingID)
		if err != nil {
			return err
		}
		pipelineID := strings.TrimSpace(execution.PipelineID)
		if pipelineID == "" {
			pipelineID = strings.TrimSpace(binding.PipelineID)
		}
		if pipelineID == "" {
			return fmt.Errorf("%w: pipeline_id is required", ErrInvalidInput)
		}
		pipeline, err := uc.pipelineRepo.GetPipelineByID(ctx, pipelineID)
		if err != nil {
			return err
		}
		if err := ensureActivePipelineRecord(pipeline, "绑定管线"); err != nil {
			return err
		}
		if pipeline.Provider != pipelinedomain.ProviderJenkins {
			return fmt.Errorf("%w: bound pipeline provider is not jenkins", ErrInvalidInput)
		}
		if strings.TrimSpace(pipeline.JobFullName) == "" {
			return fmt.Errorf("%w: jenkins job full name is empty", ErrInvalidInput)
		}

		buildParams := make(map[string]string)
		for _, item := range orderParams {
			if item.PipelineScope != execution.PipelineScope {
				continue
			}
			name := strings.TrimSpace(item.ExecutorParamName)
			if name == "" {
				continue
			}
			buildParams[name] = strings.TrimSpace(item.ParamValue)
		}

		triggerCode := scopeStepCode(execution.PipelineScope, "trigger_pipeline")
		runningCode := scopeStepCode(execution.PipelineScope, "pipeline_running")
		successCode := scopeStepCode(execution.PipelineScope, "pipeline_success")

		_ = uc.markStepRunning(ctx, order.ID, triggerCode, "开始触发 "+strings.ToUpper(string(execution.PipelineScope))+" Jenkins 管线")
		queueURL, triggerErr := uc.jenkins.TriggerBuild(ctx, pipeline.JobFullName, buildParams)
		if triggerErr != nil {
			_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusFailed, "触发 Jenkins 失败: "+triggerErr.Error())
			return fmt.Errorf("%w: trigger jenkins failed: %v", ErrInvalidInput, triggerErr)
		}

		now := uc.now()
		_, err = uc.repo.UpdateExecutionByScope(ctx, order.ID, execution.PipelineScope, domain.ExecutionUpdateInput{
			Status:    domain.ExecutionStatusRunning,
			QueueURL:  strings.TrimSpace(queueURL),
			BuildURL:  "",
			StartedAt: &now,
			UpdatedAt: now,
		})
		if err != nil {
			return err
		}

		triggerMessage := "Jenkins 触发成功"
		if strings.TrimSpace(queueURL) != "" {
			triggerMessage += "，queue: " + strings.TrimSpace(queueURL)
		}
		_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusSuccess, triggerMessage)
		_ = uc.markStepRunning(ctx, order.ID, runningCode, "管线已触发，等待执行结果回传，queue: "+strings.TrimSpace(queueURL))
		_ = uc.markStep(ctx, order.ID, successCode, domain.StepStatusPending, "", nil, nil)
		return nil
	}

	_ = uc.markStepRunning(ctx, order.ID, "global:release_finish", "所有执行单元已完成")
	_ = uc.markStepFinished(ctx, order.ID, "global:release_finish", domain.StepStatusSuccess, "发布完成")
	return nil
}

func scopeStepCode(scope domain.PipelineScope, suffix string) string {
	return strings.ToLower(strings.TrimSpace(string(scope))) + ":" + strings.TrimSpace(suffix)
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
	executions []domain.ReleaseOrderExecution,
) ([]domain.ReleaseOrderParam, error) {
	bindingByScope := make(map[domain.PipelineScope]domain.ReleaseOrderExecution, len(executions))
	for _, item := range executions {
		bindingByScope[item.PipelineScope] = item
	}
	items := make([]domain.ReleaseOrderParam, 0, len(input))
	for _, item := range input {
		if !item.PipelineScope.Valid() {
			return nil, fmt.Errorf("%w: pipeline_scope is required", ErrInvalidInput)
		}
		execution, ok := bindingByScope[item.PipelineScope]
		if !ok {
			return nil, fmt.Errorf("%w: pipeline_scope %s is not enabled", ErrInvalidInput, strings.ToUpper(string(item.PipelineScope)))
		}
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
			PipelineScope:     item.PipelineScope,
			BindingID:         execution.BindingID,
			ParamKey:          paramKey,
			ExecutorParamName: strings.TrimSpace(item.ExecutorParamName),
			ParamValue:        strings.TrimSpace(item.ParamValue),
			ValueSource:       source,
			CreatedAt:         now,
		})
	}
	return items, nil
}

func (uc *ReleaseOrderManager) buildCreateExecutions(
	orderID string,
	now time.Time,
	bindings []domain.ReleaseTemplateBinding,
) []domain.ReleaseOrderExecution {
	items := make([]domain.ReleaseOrderExecution, 0, len(bindings))
	for _, binding := range bindings {
		if !binding.Enabled {
			continue
		}
		items = append(items, domain.ReleaseOrderExecution{
			ID:             generateID("roe"),
			ReleaseOrderID: orderID,
			PipelineScope:  binding.PipelineScope,
			BindingID:      binding.BindingID,
			BindingName:    binding.BindingName,
			Provider:       binding.Provider,
			PipelineID:     binding.PipelineID,
			Status:         domain.ExecutionStatusPending,
			CreatedAt:      now,
			UpdatedAt:      now,
		})
	}
	return items
}

func (uc *ReleaseOrderManager) buildCreateSteps(
	orderID string,
	now time.Time,
	executions []domain.ReleaseOrderExecution,
	input []CreateReleaseOrderStepInput,
) ([]domain.ReleaseOrderStep, error) {
	if len(input) == 0 {
		return defaultReleaseOrderSteps(orderID, executions, now), nil
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
			StepScope:      domain.StepScopeGlobal,
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

func defaultReleaseOrderSteps(orderID string, executions []domain.ReleaseOrderExecution, now time.Time) []domain.ReleaseOrderStep {
	items := make([]domain.ReleaseOrderStep, 0, 8)
	sortNo := 1
	appendStep := func(scope domain.StepScope, executionID string, code string, name string) {
		items = append(items, domain.ReleaseOrderStep{
			ID:             generateID("ros"),
			ReleaseOrderID: orderID,
			StepScope:      scope,
			ExecutionID:    executionID,
			StepCode:       code,
			StepName:       name,
			Status:         domain.StepStatusPending,
			SortNo:         sortNo,
			CreatedAt:      now,
		})
		sortNo++
	}

	appendStep(domain.StepScopeGlobal, "", "global:param_resolve", "参数解析")
	for _, execution := range orderExecutionsByScope(executions) {
		scopeLabel := strings.ToUpper(string(execution.PipelineScope))
		stepScope := domain.StepScope(strings.ToLower(string(execution.PipelineScope)))
		appendStep(stepScope, execution.ID, string(execution.PipelineScope)+":trigger_pipeline", scopeLabel+" 触发管线")
		appendStep(stepScope, execution.ID, string(execution.PipelineScope)+":pipeline_running", scopeLabel+" 管线运行")
		appendStep(stepScope, execution.ID, string(execution.PipelineScope)+":pipeline_success", scopeLabel+" 发布完成")
	}
	appendStep(domain.StepScopeGlobal, "", "global:release_finish", "发布完成")
	return items
}

func orderExecutionsByScope(items []domain.ReleaseOrderExecution) []domain.ReleaseOrderExecution {
	result := make([]domain.ReleaseOrderExecution, 0, len(items))
	var ci, cd *domain.ReleaseOrderExecution
	for idx := range items {
		switch items[idx].PipelineScope {
		case domain.PipelineScopeCI:
			ci = &items[idx]
		case domain.PipelineScopeCD:
			cd = &items[idx]
		}
	}
	if ci != nil {
		result = append(result, *ci)
	}
	if cd != nil {
		result = append(result, *cd)
	}
	return result
}

func pickPrimaryExecution(items []domain.ReleaseOrderExecution) (domain.ReleaseOrderExecution, bool) {
	ordered := orderExecutionsByScope(items)
	if len(ordered) == 0 {
		return domain.ReleaseOrderExecution{}, false
	}
	return ordered[0], true
}

func deriveOrderStatusFromSteps(steps []domain.ReleaseOrderStep) (domain.OrderStatus, bool) {
	if len(steps) == 0 {
		return domain.OrderStatusRunning, false
	}

	allSuccess := true
	for _, step := range steps {
		if step.StepScope == domain.StepScopeGlobal && step.StepCode == "global:release_finish" {
			switch step.Status {
			case domain.StepStatusFailed:
				return domain.OrderStatusFailed, true
			case domain.StepStatusSuccess:
				return domain.OrderStatusSuccess, true
			case domain.StepStatusPending, domain.StepStatusRunning:
				allSuccess = false
				continue
			}
		}
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
