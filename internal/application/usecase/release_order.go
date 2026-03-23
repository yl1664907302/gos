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
	argocddomain "gos/internal/domain/argocdapp"
	pipelineparamdomain "gos/internal/domain/executorparam"
	gitopsdomain "gos/internal/domain/gitops"
	pipelinedomain "gos/internal/domain/pipeline"
	platformparamdomain "gos/internal/domain/platformparam"
	domain "gos/internal/domain/release"
	"gos/internal/support/logx"
)

type ReleaseOrderManager struct {
	repo          domain.Repository
	appRepo       appdomain.Repository
	pipelineRepo  pipelinedomain.Repository
	paramRepo     pipelineparamdomain.Repository
	platformRepo  platformparamdomain.Repository
	jenkins       JenkinsReleaseExecutor
	argocdRepo    argocddomain.Repository
	gitopsRepo    gitopsdomain.Repository
	argocdFactory ArgoCDClientFactory
	gitopsFactory GitOpsServiceFactory
	gitops        GitOpsReleaseService
	now           func() time.Time
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
	ApplyManifestRules(
		ctx context.Context,
		repoURL string,
		branch string,
		rules []gitopsdomain.ManifestRule,
		commitMessage string,
	) (workspacePath string, changedFiles []string, commitSHA string, changed bool, err error)
	ApplyValuesRules(
		ctx context.Context,
		repoURL string,
		branch string,
		rules []gitopsdomain.ValuesRule,
		commitMessage string,
	) (workspacePath string, changedFiles []string, commitSHA string, changed bool, err error)
	BuildCommitMessage(fields map[string]string) string
	RenderTemplate(template string, fields map[string]string) string
}

func NewReleaseOrderManager(
	repo domain.Repository,
	appRepo appdomain.Repository,
	pipelineRepo pipelinedomain.Repository,
	paramRepo pipelineparamdomain.Repository,
	platformRepo platformparamdomain.Repository,
	jenkins JenkinsReleaseExecutor,
	argocdRepo argocddomain.Repository,
	argocdFactory ArgoCDClientFactory,
	gitopsRepo gitopsdomain.Repository,
	gitopsFactory GitOpsServiceFactory,
	gitops GitOpsReleaseService,
) *ReleaseOrderManager {
	return &ReleaseOrderManager{
		repo:          repo,
		appRepo:       appRepo,
		pipelineRepo:  pipelineRepo,
		paramRepo:     paramRepo,
		platformRepo:  platformRepo,
		jenkins:       jenkins,
		argocdRepo:    argocdRepo,
		gitopsRepo:    gitopsRepo,
		argocdFactory: argocdFactory,
		gitopsFactory: gitopsFactory,
		gitops:        gitops,
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
	logx.Info("release_order", "create_start",
		logx.F("application_id", applicationID),
		logx.F("template_id", templateID),
		logx.F("creator_user_id", input.CreatorUserID),
		logx.F("trigger_type", input.TriggerType),
		logx.F("env_code", input.EnvCode),
		logx.F("params_count", len(input.Params)),
	)
	if applicationID == "" || templateID == "" {
		err := fmt.Errorf("%w: application_id and template_id are required", ErrInvalidInput)
		logx.Error("release_order", "create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("template_id", templateID),
		)
		return domain.ReleaseOrder{}, err
	}
	input.EnvCode = strings.TrimSpace(input.EnvCode)

	app, err := uc.appRepo.GetByID(ctx, applicationID)
	if err != nil {
		logx.Error("release_order", "create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("template_id", templateID),
		)
		return domain.ReleaseOrder{}, err
	}

	triggerType := input.TriggerType
	if triggerType == "" {
		triggerType = domain.TriggerTypeManual
	}
	if !triggerType.Valid() {
		logx.Error("release_order", "create_failed", ErrInvalidInput,
			logx.F("application_id", applicationID),
			logx.F("template_id", templateID),
			logx.F("reason", "invalid_trigger_type"),
			logx.F("trigger_type", triggerType),
		)
		return domain.ReleaseOrder{}, ErrInvalidInput
	}

	template, templateBindings, templateParams, err := uc.resolveTemplateForCreate(ctx, applicationID, templateID)
	if err != nil {
		logx.Error("release_order", "create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("template_id", templateID),
		)
		return domain.ReleaseOrder{}, err
	}
	if err := uc.validateCreateTemplateParams(ctx, template.ID, templateBindings, templateParams, input.Params); err != nil {
		logx.Error("release_order", "create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("template_id", templateID),
			logx.F("template_name", template.Name),
		)
		return domain.ReleaseOrder{}, err
	}
	executions := uc.buildCreateExecutions("", uc.now(), templateBindings)
	summary := resolveReleaseOrderSummaryFields(input.Params)
	envCode := firstNonEmpty(input.EnvCode, summary.EnvCode)
	if envCode == "" {
		err := fmt.Errorf("%w: env_code is required", ErrInvalidInput)
		logx.Error("release_order", "create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("template_id", templateID),
		)
		return domain.ReleaseOrder{}, err
	}
	primaryExecution, ok := pickPrimaryExecution(executions)
	if !ok {
		err := fmt.Errorf("%w: release template has no enabled executions", ErrInvalidInput)
		logx.Error("release_order", "create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("template_id", templateID),
		)
		return domain.ReleaseOrder{}, err
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
		EnvCode:         envCode,
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
		logx.Error("release_order", "create_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
			logx.F("application_id", applicationID),
		)
		return domain.ReleaseOrder{}, err
	}
	steps, err := uc.buildCreateSteps(order.ID, now, executions, template.GitOpsType, input.Steps)
	if err != nil {
		logx.Error("release_order", "create_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}

	if err := uc.repo.Create(ctx, order, executions, params, steps); err != nil {
		logx.Error("release_order", "create_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}
	logx.Info("release_order", "create_success",
		logx.F("order_id", order.ID),
		logx.F("order_no", order.OrderNo),
		logx.F("application_id", order.ApplicationID),
		logx.F("template_id", order.TemplateID),
		logx.F("env_code", order.EnvCode),
		logx.F("executions_count", len(executions)),
		logx.F("params_count", len(params)),
		logx.F("steps_count", len(steps)),
	)
	return uc.repo.GetByID(ctx, order.ID)
}

func (uc *ReleaseOrderManager) CreateRollbackByApplication(
	ctx context.Context,
	applicationID string,
	creatorUserID string,
	triggeredBy string,
) (domain.ReleaseOrder, error) {
	applicationID = strings.TrimSpace(applicationID)
	logx.Info("release_order", "rollback_create_start",
		logx.F("application_id", applicationID),
		logx.F("creator_user_id", creatorUserID),
	)
	if applicationID == "" {
		err := fmt.Errorf("%w: application_id is required", ErrInvalidInput)
		logx.Error("release_order", "rollback_create_failed", err,
			logx.F("application_id", applicationID),
		)
		return domain.ReleaseOrder{}, err
	}

	items, _, err := uc.repo.List(ctx, domain.ListFilter{
		ApplicationID: applicationID,
		Status:        domain.OrderStatusSuccess,
		Page:          1,
		PageSize:      1,
	})
	if err != nil {
		logx.Error("release_order", "rollback_create_failed", err,
			logx.F("application_id", applicationID),
		)
		return domain.ReleaseOrder{}, err
	}
	if len(items) == 0 {
		err := fmt.Errorf("%w: 当前应用暂无可回滚的成功发布单", ErrInvalidInput)
		logx.Warn("release_order", "rollback_create_failed",
			logx.F("application_id", applicationID),
			logx.F("reason", err.Error()),
		)
		return domain.ReleaseOrder{}, err
	}

	sourceOrder := items[0]
	logx.Info("release_order", "rollback_source_selected",
		logx.F("application_id", applicationID),
		logx.F("source_order_id", sourceOrder.ID),
		logx.F("source_order_no", sourceOrder.OrderNo),
	)
	sourceParams, err := uc.repo.ListParams(ctx, sourceOrder.ID)
	if err != nil {
		logx.Error("release_order", "rollback_create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("source_order_id", sourceOrder.ID),
		)
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

	order, err := uc.Create(ctx, CreateReleaseOrderInput{
		ApplicationID:   sourceOrder.ApplicationID,
		TemplateID:      sourceOrder.TemplateID,
		PreviousOrderNo: sourceOrder.OrderNo,
		EnvCode:         sourceOrder.EnvCode,
		TriggerType:     domain.TriggerTypeManual,
		Remark:          buildRollbackRemark(sourceOrder),
		CreatorUserID:   strings.TrimSpace(creatorUserID),
		TriggeredBy:     strings.TrimSpace(triggeredBy),
		Params:          params,
	})
	if err != nil {
		logx.Error("release_order", "rollback_create_failed", err,
			logx.F("application_id", applicationID),
			logx.F("source_order_no", sourceOrder.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}
	logx.Info("release_order", "rollback_create_success",
		logx.F("application_id", applicationID),
		logx.F("source_order_no", sourceOrder.OrderNo),
		logx.F("new_order_id", order.ID),
		logx.F("new_order_no", order.OrderNo),
	)
	return order, nil
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

func templateUsesArgoCD(bindings []domain.ReleaseTemplateBinding) bool {
	for _, item := range bindings {
		if item.PipelineScope != domain.PipelineScopeCD {
			continue
		}
		if strings.EqualFold(strings.TrimSpace(item.Provider), string(pipelinedomain.ProviderArgoCD)) {
			return true
		}
	}
	return false
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
	template, templateBindings, templateParams, _, err := uc.repo.GetTemplateByID(ctx, templateID)
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
		case "env", "env_code":
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
	logx.Info("release_order", "cancel_start", logx.F("order_id", id))

	order, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		logx.Error("release_order", "cancel_failed", err, logx.F("order_id", id))
		return domain.ReleaseOrder{}, err
	}

	switch order.Status {
	case domain.OrderStatusPending, domain.OrderStatusRunning:
		// allowed
	default:
		err := fmt.Errorf("%w: release order cannot be cancelled in current status", ErrInvalidInput)
		logx.Warn("release_order", "cancel_failed",
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
			logx.F("status", order.Status),
			logx.F("reason", err.Error()),
		)
		return domain.ReleaseOrder{}, err
	}

	now := uc.now()
	steps, err := uc.repo.ListSteps(ctx, id)
	if err != nil {
		logx.Error("release_order", "cancel_failed", err, logx.F("order_id", order.ID))
		return domain.ReleaseOrder{}, err
	}
	executions, err := uc.repo.ListExecutions(ctx, id)
	if err != nil {
		logx.Error("release_order", "cancel_failed", err, logx.F("order_id", order.ID))
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
				logx.Error("release_order", "cancel_failed", updateErr,
					logx.F("order_id", order.ID),
					logx.F("pipeline_scope", execution.PipelineScope),
				)
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
			logx.Error("release_order", "cancel_failed", updateErr,
				logx.F("order_id", order.ID),
				logx.F("step_code", step.StepCode),
			)
			return domain.ReleaseOrder{}, updateErr
		}
	}

	item, err := uc.repo.UpdateStatus(ctx, id, domain.OrderStatusCancelled, order.StartedAt, &now, now)
	if err != nil {
		logx.Error("release_order", "cancel_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}
	logx.Info("release_order", "cancel_success",
		logx.F("order_id", order.ID),
		logx.F("order_no", order.OrderNo),
		logx.F("cancel_notes_count", len(cancelNotes)),
	)
	return item, nil
}

func shouldFinishStepOnCancel(step domain.ReleaseOrderStep) bool {
	if step.Status == domain.StepStatusRunning {
		return true
	}
	if step.Status != domain.StepStatusPending {
		return false
	}
	return step.StepScope != domain.StepScopeGlobal || step.StepCode == "global:release_finish"
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
	logx.Info("release_order", "execute_start", logx.F("order_id", id))
	if uc.jenkins == nil && uc.argocdFactory == nil && uc.gitops == nil {
		err := fmt.Errorf("%w: release executor is not configured", ErrInvalidInput)
		logx.Error("release_order", "execute_failed", err, logx.F("order_id", id))
		return domain.ReleaseOrder{}, err
	}

	order, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		logx.Error("release_order", "execute_failed", err, logx.F("order_id", id))
		return domain.ReleaseOrder{}, err
	}
	if !isPendingOrderStatus(order.Status) {
		err := fmt.Errorf("%w: only pending release order can be executed", ErrInvalidInput)
		logx.Warn("release_order", "execute_failed",
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
			logx.F("status", order.Status),
			logx.F("reason", err.Error()),
		)
		return domain.ReleaseOrder{}, err
	}
	executions, err := uc.repo.ListExecutions(ctx, order.ID)
	if err != nil {
		logx.Error("release_order", "execute_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}
	if len(executions) == 0 {
		err := fmt.Errorf("%w: release order has no executions", ErrInvalidInput)
		logx.Error("release_order", "execute_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}

	startedAt := uc.now()
	order, err = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusRunning, &startedAt, nil, startedAt)
	if err != nil {
		logx.Error("release_order", "execute_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}

	orderParams, err := uc.repo.ListParams(ctx, order.ID)
	if err != nil {
		logx.Error("release_order", "execute_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}

	_ = uc.markStepRunning(ctx, order.ID, "global:param_resolve", "开始解析发布参数")
	_ = uc.markStepFinished(ctx, order.ID, "global:param_resolve", domain.StepStatusSuccess, fmt.Sprintf("参数解析完成，总计 %d 项", len(orderParams)))

	if err := uc.startNextPendingExecution(ctx, order, executions, orderParams); err != nil {
		finishedAt := uc.now()
		_, _ = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusFailed, order.StartedAt, &finishedAt, finishedAt)
		logx.Error("release_order", "execute_failed", err,
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
		)
		return domain.ReleaseOrder{}, err
	}

	logx.Info("release_order", "execute_dispatched",
		logx.F("order_id", order.ID),
		logx.F("order_no", order.OrderNo),
		logx.F("executions_count", len(executions)),
		logx.F("params_count", len(orderParams)),
	)
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
	order, err := uc.repo.GetByID(ctx, orderID)
	if err != nil {
		return nil, err
	}
	items, err := uc.repo.ListExecutions(ctx, orderID)
	if err != nil {
		return nil, err
	}
	return uc.reconcileExecutionStates(ctx, order, items)
}

func (uc *ReleaseOrderManager) reconcileExecutionStates(
	ctx context.Context,
	order domain.ReleaseOrder,
	items []domain.ReleaseOrderExecution,
) ([]domain.ReleaseOrderExecution, error) {
	if len(items) == 0 {
		return items, nil
	}

	steps, err := uc.repo.ListSteps(ctx, order.ID)
	if err != nil {
		return nil, err
	}
	stages, err := uc.repo.ListPipelineStages(ctx, order.ID)
	if err != nil {
		return nil, err
	}

	changed := false
	for idx := range items {
		nextStatus, finishedAt, ok := uc.deriveExecutionTerminalState(order, items[idx], steps, stages)
		if !ok || nextStatus == items[idx].Status {
			continue
		}
		updated, updateErr := uc.repo.UpdateExecutionByScope(ctx, order.ID, items[idx].PipelineScope, domain.ExecutionUpdateInput{
			Status:        nextStatus,
			QueueURL:      items[idx].QueueURL,
			BuildURL:      items[idx].BuildURL,
			ExternalRunID: items[idx].ExternalRunID,
			StartedAt:     items[idx].StartedAt,
			FinishedAt:    finishedAt,
			UpdatedAt:     uc.now(),
		})
		if updateErr != nil {
			return nil, updateErr
		}
		items[idx] = updated
		changed = true
	}

	if !changed {
		return items, nil
	}
	return uc.repo.ListExecutions(ctx, order.ID)
}

func (uc *ReleaseOrderManager) deriveExecutionTerminalState(
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	steps []domain.ReleaseOrderStep,
	stages []domain.ReleaseOrderPipelineStage,
) (domain.ExecutionStatus, *time.Time, bool) {
	if execution.Status != domain.ExecutionStatusPending && execution.Status != domain.ExecutionStatusRunning {
		return "", nil, false
	}

	healthStep := findStepByCode(steps, scopeStepCode(execution.PipelineScope, "health_check"))
	switch {
	case healthStep != nil && healthStep.Status == domain.StepStatusSuccess:
		return domain.ExecutionStatusSuccess, firstNonNilTime(healthStep.FinishedAt, order.FinishedAt, ptrTime(uc.now())), true
	case healthStep != nil && healthStep.Status == domain.StepStatusFailed:
		return domain.ExecutionStatusFailed, firstNonNilTime(healthStep.FinishedAt, order.FinishedAt, ptrTime(uc.now())), true
	}

	healthStage := findPipelineStageByScopeAndKey(stages, execution.PipelineScope, "health_check")
	switch {
	case healthStage != nil && healthStage.Status == domain.PipelineStageStatusSuccess:
		return domain.ExecutionStatusSuccess, firstNonNilTime(healthStage.FinishedAt, order.FinishedAt, ptrTime(uc.now())), true
	case healthStage != nil && healthStage.Status == domain.PipelineStageStatusFailed:
		return domain.ExecutionStatusFailed, firstNonNilTime(healthStage.FinishedAt, order.FinishedAt, ptrTime(uc.now())), true
	}

	return "", nil, false
}

func findPipelineStageByScopeAndKey(
	stages []domain.ReleaseOrderPipelineStage,
	scope domain.PipelineScope,
	stageKey string,
) *domain.ReleaseOrderPipelineStage {
	for idx := range stages {
		if strings.EqualFold(strings.TrimSpace(stages[idx].PipelineScope), string(scope)) &&
			strings.EqualFold(strings.TrimSpace(stages[idx].StageKey), strings.TrimSpace(stageKey)) {
			return &stages[idx]
		}
	}
	return nil
}

func ptrTime(value time.Time) *time.Time {
	return &value
}

func firstNonNilTime(values ...*time.Time) *time.Time {
	for _, item := range values {
		if item != nil {
			return item
		}
	}
	return nil
}

func (uc *ReleaseOrderManager) startNextPendingExecution(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	orderParams []domain.ReleaseOrderParam,
) error {
	for _, execution := range executions {
		if execution.Status == domain.ExecutionStatusRunning {
			logx.Info("release_order", "start_next_skip_running_exists",
				logx.F("order_id", order.ID),
				logx.F("order_no", order.OrderNo),
				logx.F("pipeline_scope", execution.PipelineScope),
				logx.F("provider", execution.Provider),
			)
			return nil
		}
	}

	for _, execution := range orderExecutionsByScope(executions) {
		if execution.Status != domain.ExecutionStatusPending {
			continue
		}
		logx.Info("release_order", "execution_start_attempt",
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
			logx.F("execution_id", execution.ID),
			logx.F("pipeline_scope", execution.PipelineScope),
			logx.F("provider", execution.Provider),
		)
		switch strings.ToLower(strings.TrimSpace(execution.Provider)) {
		case string(pipelinedomain.ProviderJenkins):
			// Jenkins 执行继续走现有触发链路。
		case string(pipelinedomain.ProviderArgoCD):
			if err := uc.startArgoCDExecution(ctx, order, execution, orderParams, executions); err != nil {
				uc.markExecutionStartFailed(ctx, order, execution, err.Error())
				logx.Error("release_order", "execution_start_failed", err,
					logx.F("order_id", order.ID),
					logx.F("order_no", order.OrderNo),
					logx.F("execution_id", execution.ID),
					logx.F("pipeline_scope", execution.PipelineScope),
					logx.F("provider", execution.Provider),
				)
				return err
			}
			logx.Info("release_order", "execution_start_success",
				logx.F("order_id", order.ID),
				logx.F("order_no", order.OrderNo),
				logx.F("execution_id", execution.ID),
				logx.F("pipeline_scope", execution.PipelineScope),
				logx.F("provider", execution.Provider),
			)
			return nil
		default:
			now := uc.now()
			_, err := uc.repo.UpdateExecutionByScope(ctx, order.ID, execution.PipelineScope, domain.ExecutionUpdateInput{
				Status:     domain.ExecutionStatusSkipped,
				StartedAt:  &now,
				FinishedAt: &now,
				UpdatedAt:  now,
			})
			if err != nil {
				logx.Error("release_order", "execution_skip_failed", err,
					logx.F("order_id", order.ID),
					logx.F("execution_id", execution.ID),
					logx.F("provider", execution.Provider),
				)
				return err
			}
			for idx, code := range executionStepCodes(execution) {
				message := strings.ToUpper(string(execution.PipelineScope)) + " 非受支持执行器暂记为跳过"
				if idx == len(executionStepCodes(execution))-1 {
					message = strings.ToUpper(string(execution.PipelineScope)) + " 已跳过"
				}
				_ = uc.markStepFinished(ctx, order.ID, code, domain.StepStatusSuccess, message)
			}
			continue
		}

		binding, err := uc.pipelineRepo.GetBindingByID(ctx, execution.BindingID)
		if err != nil {
			logx.Error("release_order", "execution_start_failed", err,
				logx.F("order_id", order.ID),
				logx.F("execution_id", execution.ID),
				logx.F("binding_id", execution.BindingID),
			)
			return err
		}
		pipelineID := strings.TrimSpace(execution.PipelineID)
		if pipelineID == "" {
			pipelineID = strings.TrimSpace(binding.PipelineID)
		}
		if pipelineID == "" {
			err := fmt.Errorf("%w: pipeline_id is required", ErrInvalidInput)
			logx.Error("release_order", "execution_start_failed", err,
				logx.F("order_id", order.ID),
				logx.F("execution_id", execution.ID),
				logx.F("binding_id", execution.BindingID),
			)
			return err
		}
		pipeline, err := uc.pipelineRepo.GetPipelineByID(ctx, pipelineID)
		if err != nil {
			logx.Error("release_order", "execution_start_failed", err,
				logx.F("order_id", order.ID),
				logx.F("execution_id", execution.ID),
				logx.F("pipeline_id", pipelineID),
			)
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
			uc.markExecutionStartFailed(ctx, order, execution, "触发 Jenkins 失败: "+triggerErr.Error())
			logx.Error("release_order", "execution_start_failed", triggerErr,
				logx.F("order_id", order.ID),
				logx.F("order_no", order.OrderNo),
				logx.F("execution_id", execution.ID),
				logx.F("pipeline_scope", execution.PipelineScope),
				logx.F("pipeline_id", pipeline.ID),
				logx.F("job_full_name", pipeline.JobFullName),
			)
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
			logx.Error("release_order", "execution_start_failed", err,
				logx.F("order_id", order.ID),
				logx.F("execution_id", execution.ID),
				logx.F("queue_url", queueURL),
			)
			return err
		}

		triggerMessage := "Jenkins 触发成功"
		if strings.TrimSpace(queueURL) != "" {
			triggerMessage += "，queue: " + strings.TrimSpace(queueURL)
		}
		_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusSuccess, triggerMessage)
		_ = uc.markStepRunning(ctx, order.ID, runningCode, "管线已触发，等待执行结果回传，queue: "+strings.TrimSpace(queueURL))
		_ = uc.markStep(ctx, order.ID, successCode, domain.StepStatusPending, "", nil, nil)
		logx.Info("release_order", "execution_start_success",
			logx.F("order_id", order.ID),
			logx.F("order_no", order.OrderNo),
			logx.F("execution_id", execution.ID),
			logx.F("pipeline_scope", execution.PipelineScope),
			logx.F("provider", execution.Provider),
			logx.F("pipeline_id", pipeline.ID),
			logx.F("job_full_name", pipeline.JobFullName),
			logx.F("queue_url", queueURL),
			logx.F("build_params_count", len(buildParams)),
		)
		return nil
	}

	for _, execution := range executions {
		if execution.Status == domain.ExecutionStatusRunning {
			return nil
		}
	}

	_ = uc.markStepRunning(ctx, order.ID, "global:release_finish", "所有执行单元已完成")
	_ = uc.markStepFinished(ctx, order.ID, "global:release_finish", domain.StepStatusSuccess, "发布完成")
	logx.Info("release_order", "all_executions_finished",
		logx.F("order_id", order.ID),
		logx.F("order_no", order.OrderNo),
	)
	return nil
}

func (uc *ReleaseOrderManager) markExecutionStartFailed(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	message string,
) {
	message = strings.TrimSpace(message)
	logx.Error("release_order", "execution_mark_failed", fmt.Errorf("%s", message),
		logx.F("order_id", order.ID),
		logx.F("order_no", order.OrderNo),
		logx.F("execution_id", execution.ID),
		logx.F("pipeline_scope", execution.PipelineScope),
		logx.F("provider", execution.Provider),
	)
	now := uc.now()
	_, _ = uc.repo.UpdateExecutionByScope(ctx, order.ID, execution.PipelineScope, domain.ExecutionUpdateInput{
		Status:     domain.ExecutionStatusFailed,
		StartedAt:  &now,
		FinishedAt: &now,
		UpdatedAt:  now,
	})
	_ = uc.markOpenExecutionStepsFailed(ctx, order.ID, execution, message)
	_ = uc.markStepFinished(ctx, order.ID, "global:release_finish", domain.StepStatusFailed, message)
	_, _ = uc.repo.UpdateStatus(ctx, order.ID, domain.OrderStatusFailed, order.StartedAt, &now, now)
}

func (uc *ReleaseOrderManager) markOpenExecutionStepsFailed(
	ctx context.Context,
	orderID string,
	execution domain.ReleaseOrderExecution,
	message string,
) error {
	steps, err := uc.repo.ListSteps(ctx, orderID)
	if err != nil {
		return err
	}
	for _, code := range executionStepCodes(execution) {
		current := findStepByCode(steps, code)
		if current == nil || current.Status == domain.StepStatusSuccess || current.Status == domain.StepStatusFailed {
			continue
		}
		if err := uc.markStepFinished(ctx, orderID, code, domain.StepStatusFailed, message); err != nil {
			return err
		}
	}
	return nil
}

func (uc *ReleaseOrderManager) resolveOrderGitOpsType(
	ctx context.Context,
	order domain.ReleaseOrder,
) (domain.GitOpsType, error) {
	template, _, _, _, err := uc.repo.GetTemplateByID(ctx, strings.TrimSpace(order.TemplateID))
	if err != nil {
		return "", err
	}
	return normalizeTemplateGitOpsType(template.GitOpsType, true), nil
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
	if syncErr := uc.syncPipelineStageFromStep(ctx, orderID, stepCode, status, message, startedAt, finishedAt); syncErr != nil {
		return syncErr
	}
	return nil
}

func (uc *ReleaseOrderManager) syncPipelineStageFromStep(
	ctx context.Context,
	orderID string,
	stepCode string,
	status domain.StepStatus,
	message string,
	startedAt *time.Time,
	finishedAt *time.Time,
) error {
	scope, suffix, ok := strings.Cut(strings.TrimSpace(stepCode), ":")
	if !ok {
		return nil
	}
	if !isArgoCDPipelineStageKey(suffix) {
		return nil
	}
	stages, err := uc.repo.ListPipelineStages(ctx, orderID)
	if err != nil {
		return err
	}
	if len(stages) == 0 {
		return nil
	}
	now := uc.now()
	changed := false
	for idx := range stages {
		if !strings.EqualFold(strings.TrimSpace(stages[idx].PipelineScope), scope) {
			continue
		}
		if !strings.EqualFold(strings.TrimSpace(stages[idx].StageKey), suffix) {
			continue
		}
		nextStatus := pipelineStageStatusFromStepStatus(status)
		if stages[idx].Status != nextStatus {
			stages[idx].Status = nextStatus
			changed = true
		}
		if strings.TrimSpace(message) != strings.TrimSpace(stages[idx].RawStatus) {
			stages[idx].RawStatus = strings.TrimSpace(message)
			changed = true
		}
		if startedAt != nil && (stages[idx].StartedAt == nil || !stages[idx].StartedAt.Equal(*startedAt)) {
			value := startedAt.UTC()
			stages[idx].StartedAt = &value
			changed = true
		}
		if finishedAt != nil && (stages[idx].FinishedAt == nil || !stages[idx].FinishedAt.Equal(*finishedAt)) {
			value := finishedAt.UTC()
			stages[idx].FinishedAt = &value
			changed = true
		}
		duration := computePipelineStageDurationFromTimes(stages[idx].StartedAt, stages[idx].FinishedAt, status, now)
		if stages[idx].DurationMillis != duration {
			stages[idx].DurationMillis = duration
			changed = true
		}
		stages[idx].UpdatedAt = now
		changed = true
	}
	if !changed {
		return nil
	}
	return uc.repo.ReplacePipelineStages(ctx, orderID, stages)
}

func isArgoCDPipelineStageKey(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "gitops_update", "git_commit", "git_push", "argocd_sync", "health_check":
		return true
	default:
		return false
	}
}

func pipelineStageStatusFromStepStatus(status domain.StepStatus) domain.PipelineStageStatus {
	switch status {
	case domain.StepStatusSuccess:
		return domain.PipelineStageStatusSuccess
	case domain.StepStatusFailed:
		return domain.PipelineStageStatusFailed
	case domain.StepStatusRunning:
		return domain.PipelineStageStatusRunning
	default:
		return domain.PipelineStageStatusPending
	}
}

func computePipelineStageDurationFromTimes(startedAt *time.Time, finishedAt *time.Time, status domain.StepStatus, now time.Time) int64 {
	if startedAt == nil {
		return 0
	}
	end := finishedAt
	if end == nil && status == domain.StepStatusRunning {
		current := now.UTC()
		end = &current
	}
	if end == nil || end.Before(*startedAt) {
		return 0
	}
	return end.Sub(*startedAt).Milliseconds()
}

func (uc *ReleaseOrderManager) ListSteps(ctx context.Context, orderID string) ([]domain.ReleaseOrderStep, error) {
	orderID = strings.TrimSpace(orderID)
	if orderID == "" {
		return nil, ErrInvalidID
	}
	order, err := uc.repo.GetByID(ctx, orderID)
	if err != nil {
		return nil, err
	}
	items, err := uc.repo.ListSteps(ctx, orderID)
	if err != nil {
		return nil, err
	}
	return uc.reconcileTerminalSteps(ctx, order, items)
}

func (uc *ReleaseOrderManager) reconcileTerminalSteps(
	ctx context.Context,
	order domain.ReleaseOrder,
	steps []domain.ReleaseOrderStep,
) ([]domain.ReleaseOrderStep, error) {
	if len(steps) == 0 {
		return steps, nil
	}

	executions, err := uc.ListExecutions(ctx, order.ID)
	if err != nil {
		return nil, err
	}

	changed := false
	now := uc.now()
	for _, execution := range executions {
		if !isArgoCDExecution(execution) || !execution.Status.IsTerminal() {
			continue
		}
		healthCode := scopeStepCode(execution.PipelineScope, "health_check")
		current := findStepByCode(steps, healthCode)
		if current == nil {
			continue
		}

		nextStatus := domain.StepStatusFailed
		nextMessage := strings.TrimSpace(current.Message)
		if execution.Status == domain.ExecutionStatusSuccess {
			nextStatus = domain.StepStatusSuccess
			if nextMessage == "" || isWaitingArgoCDHealthCheckMessage(nextMessage) {
				nextMessage = "ArgoCD 部署完成"
			}
		} else if nextMessage == "" || isWaitingArgoCDHealthCheckMessage(nextMessage) {
			nextMessage = "ArgoCD 部署失败"
		}
		if current.Status == nextStatus && strings.TrimSpace(current.Message) == nextMessage {
			continue
		}

		startedAt := current.StartedAt
		if startedAt == nil {
			startedAt = firstNonNilTime(execution.StartedAt, order.StartedAt, ptrTime(now))
		}
		finishedAt := firstNonNilTime(execution.FinishedAt, order.FinishedAt, ptrTime(now))
		if _, updateErr := uc.repo.UpdateStep(ctx, order.ID, healthCode, domain.StepUpdateInput{
			Status:     nextStatus,
			Message:    nextMessage,
			StartedAt:  startedAt,
			FinishedAt: finishedAt,
		}); updateErr != nil {
			return nil, updateErr
		}
		changed = true
	}

	globalStep := findStepByCode(steps, "global:release_finish")
	if globalStep != nil && order.Status.IsTerminal() {
		globalStatus := domain.StepStatusSuccess
		globalMessage := "发布完成"
		if order.Status != domain.OrderStatusSuccess {
			globalStatus = domain.StepStatusFailed
			globalMessage = "发布结束"
		}
		if globalStep.Status != globalStatus || strings.TrimSpace(globalStep.Message) != globalMessage {
			startedAt := globalStep.StartedAt
			if startedAt == nil {
				startedAt = firstNonNilTime(order.StartedAt, ptrTime(now))
			}
			finishedAt := firstNonNilTime(order.FinishedAt, ptrTime(now))
			if _, updateErr := uc.repo.UpdateStep(ctx, order.ID, "global:release_finish", domain.StepUpdateInput{
				Status:     globalStatus,
				Message:    globalMessage,
				StartedAt:  startedAt,
				FinishedAt: finishedAt,
			}); updateErr != nil {
				return nil, updateErr
			}
			changed = true
		}
	}
	if !changed {
		return steps, nil
	}
	return uc.repo.ListSteps(ctx, order.ID)
}

func isWaitingArgoCDHealthCheckMessage(message string) bool {
	text := strings.TrimSpace(message)
	return strings.Contains(text, "等待健康检查回传")
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
	gitopsType domain.GitOpsType,
	input []CreateReleaseOrderStepInput,
) ([]domain.ReleaseOrderStep, error) {
	if len(input) == 0 {
		return defaultReleaseOrderSteps(orderID, executions, now, gitopsType), nil
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

type releaseExecutionStepDef struct {
	Suffix string
	Name   string
}

func defaultExecutionStepDefs(
	execution domain.ReleaseOrderExecution,
	gitopsType domain.GitOpsType,
) []releaseExecutionStepDef {
	scopeLabel := strings.ToUpper(string(execution.PipelineScope))
	if isArgoCDExecution(execution) {
		updateName := "CD 更新 GitOps 配置"
		if normalizeTemplateGitOpsType(gitopsType, true) == domain.GitOpsTypeHelm {
			updateName = "CD 更新 Helm Values"
		}
		return []releaseExecutionStepDef{
			{Suffix: "gitops_update", Name: updateName},
			{Suffix: "git_commit", Name: "CD Git 提交"},
			{Suffix: "git_push", Name: "CD Git 推送"},
			{Suffix: "argocd_sync", Name: "CD 触发 ArgoCD"},
			{Suffix: "health_check", Name: "CD 健康检查"},
		}
	}
	return []releaseExecutionStepDef{
		{Suffix: "trigger_pipeline", Name: scopeLabel + " 触发管线"},
		{Suffix: "pipeline_running", Name: scopeLabel + " 管线运行"},
		{Suffix: "pipeline_success", Name: scopeLabel + " 发布完成"},
	}
}

func executionStepCodes(execution domain.ReleaseOrderExecution) []string {
	defs := defaultExecutionStepDefs(execution, "")
	result := make([]string, 0, len(defs))
	for _, item := range defs {
		result = append(result, scopeStepCode(execution.PipelineScope, item.Suffix))
	}
	return result
}

func defaultReleaseOrderSteps(orderID string, executions []domain.ReleaseOrderExecution, now time.Time, gitopsType domain.GitOpsType) []domain.ReleaseOrderStep {
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
		stepScope := domain.StepScope(strings.ToLower(string(execution.PipelineScope)))
		for _, stepDef := range defaultExecutionStepDefs(execution, gitopsType) {
			appendStep(stepScope, execution.ID, scopeStepCode(execution.PipelineScope, stepDef.Suffix), stepDef.Name)
		}
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
