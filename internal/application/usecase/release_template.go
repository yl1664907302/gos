package usecase

import (
	"context"
	"encoding/json"
	"fmt"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	appdomain "gos/internal/domain/application"
	argocddomain "gos/internal/domain/argocdapp"
	pipelineparamdomain "gos/internal/domain/executorparam"
	gitopsdomain "gos/internal/domain/gitops"
	pipelinedomain "gos/internal/domain/pipeline"
	platformparamdomain "gos/internal/domain/platformparam"
	releasedomain "gos/internal/domain/release"
	"gos/internal/support/logx"
)

type ReleaseTemplateManager struct {
	repo         releasedomain.Repository
	appRepo      appdomain.Repository
	pipelineRepo pipelinedomain.Repository
	paramRepo    pipelineparamdomain.Repository
	platformRepo platformparamdomain.Repository
	argocdRepo   argocddomain.Repository
	gitopsReader ReleaseTemplateGitOpsFieldCandidateReader
	now          func() time.Time
}

type ReleaseTemplateGitOpsFieldCandidateReader interface {
	ListFieldCandidates(ctx context.Context, appKey string) ([]gitopsdomain.FieldCandidate, error)
	ListValuesCandidates(ctx context.Context, appKey string) ([]gitopsdomain.ValuesCandidate, error)
}

type ReleaseTemplateGitOpsRuleInput struct {
	SourceParamKey   string
	SourceFrom       releasedomain.GitOpsRuleSourceFrom
	LocatorParamKey  string
	FilePathTemplate string
	DocumentKind     string
	DocumentName     string
	TargetPath       string
	ValueTemplate    string
}

type gitOpsValuesTargetSelection struct {
	FilePathTemplate string `json:"file_path_template"`
	TargetPath       string `json:"target_path"`
}

type CreateReleaseTemplateInput struct {
	Name          string
	ApplicationID string
	CIBindingID   string
	CDBindingID   string
	CDProvider    pipelinedomain.Provider
	GitOpsType    releasedomain.GitOpsType
	Status        releasedomain.TemplateStatus
	Remark        string
	CIParamDefIDs []string
	CDParamDefIDs []string
	GitOpsRules   []ReleaseTemplateGitOpsRuleInput
}

type UpdateReleaseTemplateInput struct {
	Name          string
	CIBindingID   string
	CDBindingID   string
	CDProvider    pipelinedomain.Provider
	GitOpsType    releasedomain.GitOpsType
	Status        releasedomain.TemplateStatus
	Remark        string
	CIParamDefIDs []string
	CDParamDefIDs []string
	GitOpsRules   []ReleaseTemplateGitOpsRuleInput
}

type ListReleaseTemplateInput struct {
	ApplicationID  string
	ApplicationIDs []string
	BindingID      string
	Status         releasedomain.TemplateStatus
	Page           int
	PageSize       int
}

func NewReleaseTemplateManager(
	repo releasedomain.Repository,
	appRepo appdomain.Repository,
	pipelineRepo pipelinedomain.Repository,
	paramRepo pipelineparamdomain.Repository,
	platformRepo platformparamdomain.Repository,
	argocdRepo argocddomain.Repository,
	gitopsReader ReleaseTemplateGitOpsFieldCandidateReader,
) *ReleaseTemplateManager {
	return &ReleaseTemplateManager{
		repo:         repo,
		appRepo:      appRepo,
		pipelineRepo: pipelineRepo,
		paramRepo:    paramRepo,
		platformRepo: platformRepo,
		argocdRepo:   argocdRepo,
		gitopsReader: gitopsReader,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *ReleaseTemplateManager) Create(
	ctx context.Context,
	input CreateReleaseTemplateInput,
) (releasedomain.ReleaseTemplate, []releasedomain.ReleaseTemplateBinding, []releasedomain.ReleaseTemplateParam, []releasedomain.ReleaseTemplateGitOpsRule, error) {
	name := strings.TrimSpace(input.Name)
	applicationID := strings.TrimSpace(input.ApplicationID)
	logx.Info("release_template", "create_start",
		logx.F("name", name),
		logx.F("application_id", applicationID),
		logx.F("ci_binding_id", input.CIBindingID),
		logx.F("cd_binding_id", input.CDBindingID),
		logx.F("cd_provider", input.CDProvider),
		logx.F("gitops_type", input.GitOpsType),
	)
	if name == "" || applicationID == "" {
		err := fmt.Errorf("%w: name and application_id are required", ErrInvalidInput)
		logx.Error("release_template", "create_failed", err,
			logx.F("name", name),
			logx.F("application_id", applicationID),
		)
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}

	status := input.Status
	if status == "" {
		status = releasedomain.TemplateStatusActive
	}
	if !status.Valid() {
		logx.Error("release_template", "create_failed", ErrInvalidStatus,
			logx.F("name", name),
			logx.F("application_id", applicationID),
			logx.F("status", status),
		)
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, ErrInvalidStatus
	}

	templateBindings, params, gitopsRules, appName, err := uc.buildTemplatePayload(
		ctx,
		applicationID,
		input.CIBindingID,
		input.CDBindingID,
		input.CDProvider,
		input.GitOpsType,
		input.CIParamDefIDs,
		input.CDParamDefIDs,
		input.GitOpsRules,
	)
	if err != nil {
		logx.Error("release_template", "create_failed", err,
			logx.F("name", name),
			logx.F("application_id", applicationID),
		)
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}

	now := uc.now()
	summaryName, summaryType := summarizeTemplateBindings(templateBindings)
	template := releasedomain.ReleaseTemplate{
		ID:              generateID("rt"),
		Name:            name,
		ApplicationID:   applicationID,
		ApplicationName: appName,
		BindingID:       applicationID,
		BindingName:     summaryName,
		BindingType:     summaryType,
		GitOpsType:      normalizeTemplateGitOpsType(input.GitOpsType, templateUsesArgoCD(templateBindings)),
		Status:          status,
		Remark:          strings.TrimSpace(input.Remark),
		ParamCount:      len(params),
		CreatedAt:       now,
		UpdatedAt:       now,
	}
	for idx := range templateBindings {
		templateBindings[idx].TemplateID = template.ID
		templateBindings[idx].CreatedAt = now
		templateBindings[idx].UpdatedAt = now
	}
	for idx := range params {
		params[idx].TemplateID = template.ID
		params[idx].CreatedAt = now
		params[idx].UpdatedAt = now
	}
	for idx := range gitopsRules {
		gitopsRules[idx].TemplateID = template.ID
		gitopsRules[idx].CreatedAt = now
		gitopsRules[idx].UpdatedAt = now
	}

	if err := uc.repo.CreateTemplate(ctx, template, templateBindings, params, gitopsRules); err != nil {
		logx.Error("release_template", "create_failed", err,
			logx.F("template_id", template.ID),
			logx.F("name", template.Name),
			logx.F("application_id", template.ApplicationID),
		)
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}
	logx.Info("release_template", "create_success",
		logx.F("template_id", template.ID),
		logx.F("name", template.Name),
		logx.F("application_id", template.ApplicationID),
		logx.F("bindings_count", len(templateBindings)),
		logx.F("params_count", len(params)),
		logx.F("gitops_rules_count", len(gitopsRules)),
	)
	return uc.repo.GetTemplateByID(ctx, template.ID)
}

func (uc *ReleaseTemplateManager) GetByID(
	ctx context.Context,
	id string,
) (releasedomain.ReleaseTemplate, []releasedomain.ReleaseTemplateBinding, []releasedomain.ReleaseTemplateParam, []releasedomain.ReleaseTemplateGitOpsRule, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, ErrInvalidID
	}
	return uc.repo.GetTemplateByID(ctx, id)
}

func (uc *ReleaseTemplateManager) List(
	ctx context.Context,
	input ListReleaseTemplateInput,
) ([]releasedomain.ReleaseTemplate, int64, error) {
	const (
		defaultPage     = 1
		defaultPageSize = 20
		maxPageSize     = 100
	)

	filter := releasedomain.TemplateListFilter{
		ApplicationID:  strings.TrimSpace(input.ApplicationID),
		ApplicationIDs: append([]string(nil), input.ApplicationIDs...),
		BindingID:      strings.TrimSpace(input.BindingID),
		Status:         input.Status,
		Page:           input.Page,
		PageSize:       input.PageSize,
	}
	if filter.Status != "" && !filter.Status.Valid() {
		return nil, 0, ErrInvalidStatus
	}
	if filter.Page <= 0 {
		filter.Page = defaultPage
	}
	if filter.PageSize <= 0 {
		filter.PageSize = defaultPageSize
	}
	if filter.PageSize > maxPageSize {
		filter.PageSize = maxPageSize
	}
	return uc.repo.ListTemplates(ctx, filter)
}

func (uc *ReleaseTemplateManager) Update(
	ctx context.Context,
	id string,
	input UpdateReleaseTemplateInput,
) (releasedomain.ReleaseTemplate, []releasedomain.ReleaseTemplateBinding, []releasedomain.ReleaseTemplateParam, []releasedomain.ReleaseTemplateGitOpsRule, error) {
	id = strings.TrimSpace(id)
	logx.Info("release_template", "update_start",
		logx.F("template_id", id),
		logx.F("ci_binding_id", input.CIBindingID),
		logx.F("cd_binding_id", input.CDBindingID),
		logx.F("cd_provider", input.CDProvider),
		logx.F("gitops_type", input.GitOpsType),
	)
	if id == "" {
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, ErrInvalidID
	}
	current, _, _, _, err := uc.repo.GetTemplateByID(ctx, id)
	if err != nil {
		logx.Error("release_template", "update_failed", err, logx.F("template_id", id))
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}

	name := strings.TrimSpace(input.Name)
	if name == "" {
		name = current.Name
	}

	status := input.Status
	if status == "" {
		status = current.Status
	}
	if !status.Valid() {
		logx.Error("release_template", "update_failed", ErrInvalidStatus,
			logx.F("template_id", id),
			logx.F("status", status),
		)
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, ErrInvalidStatus
	}

	templateBindings, params, gitopsRules, appName, err := uc.buildTemplatePayload(
		ctx,
		current.ApplicationID,
		input.CIBindingID,
		input.CDBindingID,
		input.CDProvider,
		input.GitOpsType,
		input.CIParamDefIDs,
		input.CDParamDefIDs,
		input.GitOpsRules,
	)
	if err != nil {
		logx.Error("release_template", "update_failed", err,
			logx.F("template_id", id),
			logx.F("application_id", current.ApplicationID),
		)
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}

	now := uc.now()
	summaryName, summaryType := summarizeTemplateBindings(templateBindings)
	template := releasedomain.ReleaseTemplate{
		ID:              current.ID,
		Name:            name,
		ApplicationID:   current.ApplicationID,
		ApplicationName: appName,
		BindingID:       current.ApplicationID,
		BindingName:     summaryName,
		BindingType:     summaryType,
		GitOpsType:      normalizeTemplateGitOpsType(input.GitOpsType, templateUsesArgoCD(templateBindings)),
		Status:          status,
		Remark:          strings.TrimSpace(input.Remark),
		ParamCount:      len(params),
		CreatedAt:       current.CreatedAt,
		UpdatedAt:       now,
	}
	for idx := range templateBindings {
		templateBindings[idx].TemplateID = template.ID
		templateBindings[idx].CreatedAt = now
		templateBindings[idx].UpdatedAt = now
	}
	for idx := range params {
		params[idx].TemplateID = template.ID
		params[idx].CreatedAt = now
		params[idx].UpdatedAt = now
	}
	for idx := range gitopsRules {
		gitopsRules[idx].TemplateID = template.ID
		gitopsRules[idx].CreatedAt = now
		gitopsRules[idx].UpdatedAt = now
	}

	if err := uc.repo.UpdateTemplate(ctx, template, templateBindings, params, gitopsRules); err != nil {
		logx.Error("release_template", "update_failed", err,
			logx.F("template_id", template.ID),
			logx.F("application_id", template.ApplicationID),
		)
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}
	logx.Info("release_template", "update_success",
		logx.F("template_id", template.ID),
		logx.F("name", template.Name),
		logx.F("application_id", template.ApplicationID),
		logx.F("bindings_count", len(templateBindings)),
		logx.F("params_count", len(params)),
		logx.F("gitops_rules_count", len(gitopsRules)),
	)
	return uc.repo.GetTemplateByID(ctx, template.ID)
}

func (uc *ReleaseTemplateManager) Delete(ctx context.Context, id string) error {
	id = strings.TrimSpace(id)
	if id == "" {
		return ErrInvalidID
	}
	logx.Info("release_template", "delete_start", logx.F("template_id", id))
	if err := uc.repo.DeleteTemplate(ctx, id); err != nil {
		logx.Error("release_template", "delete_failed", err, logx.F("template_id", id))
		return err
	}
	logx.Info("release_template", "delete_success", logx.F("template_id", id))
	return nil
}

func (uc *ReleaseTemplateManager) buildTemplatePayload(
	ctx context.Context,
	applicationID string,
	ciBindingID string,
	cdBindingID string,
	cdProvider pipelinedomain.Provider,
	gitopsType releasedomain.GitOpsType,
	ciParamDefIDs []string,
	cdParamDefIDs []string,
	gitopsRuleInputs []ReleaseTemplateGitOpsRuleInput,
) ([]releasedomain.ReleaseTemplateBinding, []releasedomain.ReleaseTemplateParam, []releasedomain.ReleaseTemplateGitOpsRule, string, error) {
	bindings := make([]releasedomain.ReleaseTemplateBinding, 0, 2)
	params := make([]releasedomain.ReleaseTemplateParam, 0)

	appName := ""
	if uc.pipelineRepo == nil {
		return nil, nil, nil, "", fmt.Errorf("%w: pipeline repository is not configured", ErrInvalidInput)
	}

	ciBinding, ciParams, appName, err := uc.buildTemplateScopePayload(
		ctx,
		applicationID,
		releasedomain.PipelineScopeCI,
		ciBindingID,
		"",
		ciParamDefIDs,
		1,
	)
	if err != nil {
		return nil, nil, nil, "", err
	}
	if ciBinding != nil {
		bindings = append(bindings, *ciBinding)
		params = append(params, ciParams...)
	}

	cdBinding, cdParams, derivedAppName, err := uc.buildTemplateScopePayload(
		ctx,
		applicationID,
		releasedomain.PipelineScopeCD,
		cdBindingID,
		cdProvider,
		cdParamDefIDs,
		2,
	)
	if err != nil {
		return nil, nil, nil, "", err
	}
	if appName == "" {
		appName = derivedAppName
	}
	if cdBinding != nil {
		bindings = append(bindings, *cdBinding)
		params = append(params, cdParams...)
	}

	if len(bindings) == 0 {
		return nil, nil, nil, "", fmt.Errorf("%w: at least one of ci/cd must be enabled", ErrInvalidInput)
	}
	gitopsType = normalizeTemplateGitOpsType(gitopsType, templateUsesArgoCD(bindings))
	if err := uc.validateArgoCDTemplateConfig(ctx, bindings, params, gitopsType); err != nil {
		return nil, nil, nil, "", err
	}
	gitopsRules, err := uc.buildGitOpsRules(ctx, applicationID, bindings, params, gitopsType, gitopsRuleInputs)
	if err != nil {
		return nil, nil, nil, "", err
	}
	if appName == "" && len(bindings) > 0 {
		appName = bindings[0].BindingName
	}
	return bindings, params, gitopsRules, appName, nil
}

func (uc *ReleaseTemplateManager) buildTemplateScopePayload(
	ctx context.Context,
	applicationID string,
	scope releasedomain.PipelineScope,
	bindingID string,
	desiredProvider pipelinedomain.Provider,
	paramDefIDs []string,
	sortNo int,
) (*releasedomain.ReleaseTemplateBinding, []releasedomain.ReleaseTemplateParam, string, error) {
	bindingID = strings.TrimSpace(bindingID)
	if bindingID == "" {
		if scope == releasedomain.PipelineScopeCD && desiredProvider == pipelinedomain.ProviderArgoCD {
			if len(normalizeStringIDs(paramDefIDs)) > 0 {
				return nil, nil, "", fmt.Errorf("%w: argocd cd 暂不支持额外执行器参数", ErrInvalidInput)
			}
			if uc.appRepo == nil {
				return nil, nil, "", fmt.Errorf("%w: application repository is not configured", ErrInvalidInput)
			}
			app, err := uc.appRepo.GetByID(ctx, applicationID)
			if err != nil {
				return nil, nil, "", err
			}
			// ArgoCD 模式下，CD 执行器不再依赖单独的“管线绑定”记录；
			// 模板只要显式启用 CD 且未选择 Jenkins 绑定，就视为走 ArgoCD。
			return &releasedomain.ReleaseTemplateBinding{
				ID:            generateID("rtb"),
				PipelineScope: scope,
				BindingID:     "",
				BindingName:   "ArgoCD",
				Provider:      string(pipelinedomain.ProviderArgoCD),
				PipelineID:    "",
				Enabled:       true,
				SortNo:        sortNo,
			}, nil, app.Name, nil
		}
		if len(normalizeStringIDs(paramDefIDs)) > 0 {
			return nil, nil, "", fmt.Errorf("%w: %s binding is required", ErrInvalidInput, strings.ToUpper(string(scope)))
		}
		return nil, nil, "", nil
	}

	binding, err := uc.pipelineRepo.GetBindingByID(ctx, bindingID)
	if err != nil {
		return nil, nil, "", err
	}
	if strings.TrimSpace(binding.ApplicationID) != strings.TrimSpace(applicationID) {
		return nil, nil, "", fmt.Errorf("%w: binding does not belong to application", ErrInvalidInput)
	}
	if strings.TrimSpace(string(binding.BindingType)) != string(scope) {
		return nil, nil, "", fmt.Errorf("%w: binding scope does not match template scope", ErrInvalidInput)
	}
	if binding.Status != pipelinedomain.StatusActive {
		return nil, nil, "", fmt.Errorf("%w: selected binding is disabled", ErrInvalidInput)
	}
	if scope == releasedomain.PipelineScopeCI && binding.Provider != pipelinedomain.ProviderJenkins {
		return nil, nil, "", fmt.Errorf("%w: ci binding only supports jenkins", ErrInvalidInput)
	}
	if strings.TrimSpace(binding.PipelineID) != "" {
		pipeline, err := uc.pipelineRepo.GetPipelineByID(ctx, binding.PipelineID)
		if err != nil {
			return nil, nil, "", err
		}
		if err := ensureActivePipelineRecord(pipeline, "绑定管线"); err != nil {
			return nil, nil, "", err
		}
	}

	templateBinding := &releasedomain.ReleaseTemplateBinding{
		ID:            generateID("rtb"),
		PipelineScope: scope,
		BindingID:     binding.ID,
		BindingName:   strings.TrimSpace(binding.Name),
		Provider:      strings.TrimSpace(string(binding.Provider)),
		PipelineID:    strings.TrimSpace(binding.PipelineID),
		Enabled:       true,
		SortNo:        sortNo,
	}

	normalizedIDs := normalizeStringIDs(paramDefIDs)
	if len(normalizedIDs) == 0 {
		return templateBinding, nil, binding.ApplicationName, nil
	}
	if binding.Provider != pipelinedomain.ProviderJenkins {
		return nil, nil, "", fmt.Errorf("%w: only jenkins binding supports template params", ErrInvalidInput)
	}

	params := make([]releasedomain.ReleaseTemplateParam, 0, len(normalizedIDs))
	for idx, id := range normalizedIDs {
		paramDef, err := uc.paramRepo.GetByID(ctx, id)
		if err != nil {
			return nil, nil, "", err
		}
		if err := ensureActiveExecutorParamDef(paramDef, "所选模板参数"); err != nil {
			return nil, nil, "", err
		}
		if strings.TrimSpace(paramDef.PipelineID) != strings.TrimSpace(binding.PipelineID) {
			return nil, nil, "", fmt.Errorf("%w: template param does not belong to selected binding", ErrInvalidInput)
		}
		paramKey := strings.ToLower(strings.TrimSpace(paramDef.ParamKey))
		if paramKey == "" {
			return nil, nil, "", fmt.Errorf("%w: template param must be mapped to platform key", ErrInvalidInput)
		}
		dict, err := uc.platformRepo.GetByParamKey(ctx, paramKey)
		if err != nil {
			return nil, nil, "", err
		}
		if dict.Status != platformparamdomain.StatusEnabled {
			return nil, nil, "", fmt.Errorf("%w: platform param dict is disabled", ErrInvalidInput)
		}
		params = append(params, releasedomain.ReleaseTemplateParam{
			ID:                 generateID("rtp"),
			TemplateBindingID:  templateBinding.ID,
			PipelineScope:      scope,
			BindingID:          binding.ID,
			ExecutorParamDefID: paramDef.ID,
			ParamKey:           paramKey,
			ParamName:          strings.TrimSpace(dict.Name),
			ExecutorParamName:  strings.TrimSpace(paramDef.ExecutorParamName),
			Required:           paramDef.Required,
			SortNo:             idx + 1,
		})
	}
	return templateBinding, params, binding.ApplicationName, nil
}

func normalizeStringIDs(values []string) []string {
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
	return result
}

func normalizeTemplateGitOpsType(candidate releasedomain.GitOpsType, usesArgoCD bool) releasedomain.GitOpsType {
	if !usesArgoCD {
		return ""
	}
	candidate = releasedomain.GitOpsType(strings.ToLower(strings.TrimSpace(string(candidate))))
	if candidate == "" {
		return releasedomain.GitOpsTypeKustomize
	}
	if !candidate.Valid() {
		return releasedomain.GitOpsTypeKustomize
	}
	return candidate
}

func (uc *ReleaseTemplateManager) buildGitOpsRules(
	ctx context.Context,
	applicationID string,
	bindings []releasedomain.ReleaseTemplateBinding,
	params []releasedomain.ReleaseTemplateParam,
	gitopsType releasedomain.GitOpsType,
	inputs []ReleaseTemplateGitOpsRuleInput,
) ([]releasedomain.ReleaseTemplateGitOpsRule, error) {
	if !templateUsesArgoCD(bindings) {
		if len(inputs) > 0 {
			return nil, fmt.Errorf("%w: 仅当 cd 使用 argocd 时才可配置 gitops 替换规则", ErrInvalidInput)
		}
		return nil, nil
	}
	if len(inputs) == 0 {
		return nil, nil
	}
	if uc.appRepo == nil {
		return nil, fmt.Errorf("%w: application repository is not configured", ErrInvalidInput)
	}
	if uc.platformRepo == nil {
		return nil, fmt.Errorf("%w: platform param repository is not configured", ErrInvalidInput)
	}
	if uc.gitopsReader == nil {
		return nil, fmt.Errorf("%w: gitops manager is not configured", ErrInvalidInput)
	}
	gitopsType = normalizeTemplateGitOpsType(gitopsType, true)

	app, err := uc.appRepo.GetByID(ctx, applicationID)
	if err != nil {
		return nil, err
	}
	appKey := strings.TrimSpace(app.Key)
	if appKey == "" {
		return nil, fmt.Errorf("%w: application key is required for argocd gitops rules", ErrInvalidInput)
	}

	fieldCandidateSet := make(map[string]gitopsdomain.FieldCandidate)
	valuesCandidateSet := make(map[string]gitopsdomain.ValuesCandidate)
	switch gitopsType {
	case releasedomain.GitOpsTypeHelm:
		candidates, listErr := uc.gitopsReader.ListValuesCandidates(ctx, appKey)
		if listErr != nil {
			return nil, listErr
		}
		for _, item := range candidates {
			valuesCandidateSet[buildGitOpsValuesCandidateKey(item.FilePathTemplate, item.TargetPath)] = item
		}
	default:
		candidates, listErr := uc.gitopsReader.ListFieldCandidates(ctx, appKey)
		if listErr != nil {
			return nil, listErr
		}
		for _, item := range candidates {
			fieldCandidateSet[buildGitOpsCandidateKey(item.FilePathTemplate, item.DocumentKind, item.DocumentName, item.TargetPath)] = item
		}
	}

	builtinParams, err := uc.listBuiltinPlatformParamsForTemplate(ctx)
	if err != nil {
		return nil, err
	}
	cdInputParams, err := uc.listCDInputPlatformParamsForTemplate(ctx)
	if err != nil {
		return nil, err
	}
	ciParams := make(map[string]releasedomain.ReleaseTemplateParam)
	for _, item := range params {
		if item.PipelineScope != releasedomain.PipelineScopeCI {
			continue
		}
		key := strings.ToLower(strings.TrimSpace(item.ParamKey))
		if key == "" {
			continue
		}
		ciParams[key] = item
	}

	result := make([]releasedomain.ReleaseTemplateGitOpsRule, 0, len(inputs))
	seen := make(map[string]struct{}, len(inputs))
	for idx, input := range inputs {
		paramKey := strings.ToLower(strings.TrimSpace(input.SourceParamKey))
		if paramKey == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则的 source_param_key 不能为空", ErrInvalidInput)
		}

		sourceFrom := input.SourceFrom
		if sourceFrom == "" {
			if _, ok := ciParams[paramKey]; ok {
				sourceFrom = releasedomain.GitOpsRuleSourceCI
			} else if _, ok := cdInputParams[paramKey]; ok {
				sourceFrom = releasedomain.GitOpsRuleSourceCDInput
			} else if _, ok := builtinParams[paramKey]; ok {
				sourceFrom = releasedomain.GitOpsRuleSourceBuiltin
			}
		}
		if !sourceFrom.Valid() {
			return nil, fmt.Errorf("%w: gitops 替换规则的 source_from 无效", ErrInvalidInput)
		}

		var sourceName string
		switch sourceFrom {
		case releasedomain.GitOpsRuleSourceCI:
			param, ok := ciParams[paramKey]
			if !ok {
				return nil, fmt.Errorf("%w: gitops 替换规则只能引用 ci 中已勾选的标准字段：%s", ErrInvalidInput, paramKey)
			}
			sourceName = firstNonEmpty(param.ParamName, paramKey)
		case releasedomain.GitOpsRuleSourceCDInput:
			dict, ok := cdInputParams[paramKey]
			if !ok {
				return nil, fmt.Errorf("%w: gitops 替换规则只能引用已启用的 CD 自填字段：%s", ErrInvalidInput, paramKey)
			}
			sourceName = firstNonEmpty(dict.Name, paramKey)
		case releasedomain.GitOpsRuleSourceBuiltin:
			dict, ok := builtinParams[paramKey]
			if !ok {
				return nil, fmt.Errorf("%w: gitops 替换规则只能引用已启用的内置字段：%s", ErrInvalidInput, paramKey)
			}
			sourceName = firstNonEmpty(dict.Name, paramKey)
		}

		locatorParamKey := strings.ToLower(strings.TrimSpace(input.LocatorParamKey))
		locatorParamName := ""
		if locatorParamKey != "" {
			dict, err := uc.platformRepo.GetByParamKey(ctx, locatorParamKey)
			if err != nil {
				return nil, fmt.Errorf("%w: gitops 定位字段不存在：%s", ErrInvalidInput, locatorParamKey)
			}
			if dict.Status != platformparamdomain.StatusEnabled {
				return nil, fmt.Errorf("%w: gitops 定位字段已停用：%s", ErrInvalidInput, locatorParamKey)
			}
			if !dict.GitOpsLocator {
				return nil, fmt.Errorf("%w: 请选择已标记为 gitops 定位字段的标准 Key：%s", ErrInvalidInput, locatorParamKey)
			}
			if _, ok := ciParams[locatorParamKey]; !ok {
				if _, builtin := builtinParams[locatorParamKey]; !builtin {
					return nil, fmt.Errorf("%w: gitops 定位字段必须来自 ci 已勾选字段或系统内置字段：%s", ErrInvalidInput, locatorParamKey)
				}
			}
			locatorParamName = firstNonEmpty(dict.Name, locatorParamKey)
		}

		filePathTemplate := filepathSlash(strings.TrimSpace(input.FilePathTemplate))
		targetPath := strings.TrimSpace(input.TargetPath)
		documentKind := strings.TrimSpace(input.DocumentKind)
		documentName := strings.TrimSpace(input.DocumentName)
		if gitopsType == releasedomain.GitOpsTypeHelm {
			selection := gitOpsValuesTargetSelection{}
			if targetPath != "" && strings.HasPrefix(targetPath, "{") && json.Unmarshal([]byte(targetPath), &selection) == nil {
				filePathTemplate = firstNonEmpty(filepathSlash(selection.FilePathTemplate), filePathTemplate)
				targetPath = strings.TrimSpace(selection.TargetPath)
			}
		}
		if filePathTemplate == "" || targetPath == "" {
			switch gitopsType {
			case releasedomain.GitOpsTypeHelm:
				return nil, fmt.Errorf("%w: gitops 替换规则必须选择 values 路径目标", ErrInvalidInput)
			default:
				return nil, fmt.Errorf("%w: gitops 替换规则必须选择 YAML 字段目标", ErrInvalidInput)
			}
		}

		candidateIdentity := ""
		switch gitopsType {
		case releasedomain.GitOpsTypeHelm:
			documentKind = "values"
			documentName = ""
			if !isPlatformValuesFileTemplate(filePathTemplate) {
				return nil, fmt.Errorf("%w: helm 模式下，gitops 替换规则只能写入 platform.values-{env}.yaml", ErrInvalidInput)
			}
			candidateKey := buildGitOpsValuesCandidateKey(filePathTemplate, targetPath)
			if _, ok := valuesCandidateSet[candidateKey]; !ok {
				return nil, fmt.Errorf("%w: 选中的 values 路径目标不存在或已变更", ErrInvalidInput)
			}
			candidateIdentity = candidateKey
		default:
			if documentKind == "" {
				return nil, fmt.Errorf("%w: gitops 替换规则必须选择 YAML 字段目标", ErrInvalidInput)
			}
			candidateKey := buildGitOpsCandidateKey(filePathTemplate, documentKind, documentName, targetPath)
			if _, ok := fieldCandidateSet[candidateKey]; !ok && !matchGitOpsCandidateTemplate(fieldCandidateSet, filePathTemplate, documentKind, documentName, targetPath, locatorParamKey) {
				return nil, fmt.Errorf("%w: 选中的 YAML 字段目标不存在或已变更", ErrInvalidInput)
			}
			candidateIdentity = candidateKey
		}
		seenKey := strings.Join([]string{candidateIdentity, paramKey, locatorParamKey}, "::")
		if _, exists := seen[seenKey]; exists {
			return nil, fmt.Errorf("%w: gitops 替换规则存在重复项", ErrInvalidInput)
		}
		seen[seenKey] = struct{}{}

		valueTemplate := strings.TrimSpace(input.ValueTemplate)
		if valueTemplate == "" && sourceFrom != releasedomain.GitOpsRuleSourceCDInput {
			valueTemplate = "{" + paramKey + "}"
		}
		if sourceFrom == releasedomain.GitOpsRuleSourceCDInput && valueTemplate == "" {
			return nil, fmt.Errorf("%w: CD 自填字段必须在模板里填写固定值", ErrInvalidInput)
		}

		result = append(result, releasedomain.ReleaseTemplateGitOpsRule{
			ID:               generateID("rtgr"),
			PipelineScope:    releasedomain.PipelineScopeCD,
			SourceParamKey:   paramKey,
			SourceParamName:  sourceName,
			SourceFrom:       sourceFrom,
			LocatorParamKey:  locatorParamKey,
			LocatorParamName: locatorParamName,
			FilePathTemplate: filePathTemplate,
			DocumentKind:     documentKind,
			DocumentName:     documentName,
			TargetPath:       targetPath,
			ValueTemplate:    valueTemplate,
			SortNo:           idx + 1,
		})
	}
	return result, nil
}

func (uc *ReleaseTemplateManager) listBuiltinPlatformParamsForTemplate(
	ctx context.Context,
) (map[string]platformparamdomain.PlatformParamDict, error) {
	builtin := true
	status := platformparamdomain.StatusEnabled
	items, _, err := uc.platformRepo.List(ctx, platformparamdomain.ListFilter{
		Builtin:  &builtin,
		Status:   &status,
		Page:     1,
		PageSize: 500,
	})
	if err != nil {
		return nil, err
	}
	result := make(map[string]platformparamdomain.PlatformParamDict, len(items))
	for _, item := range items {
		key := strings.ToLower(strings.TrimSpace(item.ParamKey))
		if key == "" {
			continue
		}
		result[key] = item
	}
	return result, nil
}

func (uc *ReleaseTemplateManager) listCDInputPlatformParamsForTemplate(
	ctx context.Context,
) (map[string]platformparamdomain.PlatformParamDict, error) {
	cdSelfFill := true
	status := platformparamdomain.StatusEnabled
	items, _, err := uc.platformRepo.List(ctx, platformparamdomain.ListFilter{
		CDSelfFill: &cdSelfFill,
		Status:     &status,
		Page:       1,
		PageSize:   500,
	})
	if err != nil {
		return nil, err
	}
	result := make(map[string]platformparamdomain.PlatformParamDict, len(items))
	for _, item := range items {
		key := strings.ToLower(strings.TrimSpace(item.ParamKey))
		if key == "" {
			continue
		}
		result[key] = item
	}
	return result, nil
}

func buildGitOpsCandidateKey(filePathTemplate string, documentKind string, documentName string, targetPath string) string {
	return strings.Join([]string{
		filepathSlash(strings.TrimSpace(filePathTemplate)),
		strings.TrimSpace(documentKind),
		strings.TrimSpace(documentName),
		strings.TrimSpace(targetPath),
	}, "::")
}

func buildGitOpsValuesCandidateKey(filePathTemplate string, targetPath string) string {
	return strings.Join([]string{
		filepathSlash(strings.TrimSpace(filePathTemplate)),
		strings.TrimSpace(targetPath),
	}, "::")
}

func isPlatformValuesFileTemplate(filePathTemplate string) bool {
	base := strings.TrimSpace(filepath.Base(filepathSlash(filePathTemplate)))
	if base == "" {
		return false
	}
	matched, _ := regexp.MatchString(`(?i)^platform\.values(?:-[^.]+)?\.ya?ml$`, base)
	return matched
}

func matchGitOpsCandidateTemplate(
	candidateSet map[string]gitopsdomain.FieldCandidate,
	filePathTemplate string,
	documentKind string,
	documentName string,
	targetPath string,
	locatorParamKey string,
) bool {
	locatorParamKey = strings.TrimSpace(locatorParamKey)
	if locatorParamKey == "" {
		return false
	}
	placeholder := "{" + locatorParamKey + "}"
	for _, candidate := range candidateSet {
		if strings.TrimSpace(candidate.DocumentKind) != strings.TrimSpace(documentKind) {
			continue
		}
		if strings.TrimSpace(candidate.TargetPath) != strings.TrimSpace(targetPath) {
			continue
		}
		fileTemplate := buildLocatorTemplateFromCandidate(candidate.FilePathTemplate, candidate.DocumentName, placeholder)
		documentTemplate := buildLocatorDocumentTemplate(candidate.DocumentName, placeholder)
		if fileTemplate == filepathSlash(strings.TrimSpace(filePathTemplate)) &&
			strings.TrimSpace(documentTemplate) == strings.TrimSpace(documentName) {
			return true
		}
	}
	return false
}

func buildLocatorTemplateFromCandidate(filePathTemplate string, documentName string, placeholder string) string {
	filePathTemplate = filepathSlash(filePathTemplate)
	placeholder = strings.TrimSpace(placeholder)
	if filePathTemplate == "" || placeholder == "" || strings.TrimSpace(documentName) == "" {
		return filePathTemplate
	}
	baseName := filepath.Base(filePathTemplate)
	ext := filepath.Ext(baseName)
	stem := strings.TrimSuffix(baseName, ext)
	if stem == "" {
		return filePathTemplate
	}
	if !strings.Contains(strings.ToLower(strings.TrimSpace(documentName)), strings.ToLower(stem)) {
		return filePathTemplate
	}
	replacedBase := replaceLocatorToken(baseName, stem, placeholder)
	return strings.TrimSuffix(filePathTemplate, baseName) + replacedBase
}

func buildLocatorDocumentTemplate(documentName string, placeholder string) string {
	documentName = strings.TrimSpace(documentName)
	placeholder = strings.TrimSpace(placeholder)
	if documentName == "" || placeholder == "" {
		return documentName
	}
	base := documentName
	if idx := strings.IndexAny(documentName, "-_."); idx > 0 {
		base = documentName[:idx]
	}
	return replaceLocatorToken(documentName, base, placeholder)
}

func replaceLocatorToken(value string, token string, placeholder string) string {
	value = strings.TrimSpace(value)
	token = strings.TrimSpace(token)
	placeholder = strings.TrimSpace(placeholder)
	if value == "" || token == "" || placeholder == "" {
		return value
	}
	replacer := regexp.MustCompile(`(^|[-_./])` + regexp.QuoteMeta(token) + `($|[-_./])`)
	return replacer.ReplaceAllString(value, "${1}"+placeholder+"${2}")
}

func filepathSlash(value string) string {
	return strings.ReplaceAll(strings.TrimSpace(value), "\\", "/")
}

func summarizeTemplateBindings(bindings []releasedomain.ReleaseTemplateBinding) (string, string) {
	if len(bindings) == 0 {
		return "-", ""
	}
	scopeLabels := make([]string, 0, len(bindings))
	scopeTypes := make([]string, 0, len(bindings))
	for _, item := range bindings {
		scope := strings.ToLower(strings.TrimSpace(string(item.PipelineScope)))
		if scope == "" {
			continue
		}
		scopeTypes = append(scopeTypes, scope)
		switch scope {
		case "ci":
			scopeLabels = append(scopeLabels, "CI")
		case "cd":
			scopeLabels = append(scopeLabels, "CD")
		default:
			scopeLabels = append(scopeLabels, strings.ToUpper(scope))
		}
	}
	return strings.Join(scopeLabels, " + "), strings.Join(scopeTypes, "+")
}

func (uc *ReleaseTemplateManager) validateArgoCDTemplateConfig(
	ctx context.Context,
	bindings []releasedomain.ReleaseTemplateBinding,
	params []releasedomain.ReleaseTemplateParam,
	gitopsType releasedomain.GitOpsType,
) error {
	var (
		hasCIBinding bool
		hasArgoCDCD  bool
	)
	for _, item := range bindings {
		if item.PipelineScope == releasedomain.PipelineScopeCI {
			hasCIBinding = true
		}
		if item.PipelineScope == releasedomain.PipelineScopeCD && strings.EqualFold(strings.TrimSpace(item.Provider), string(pipelinedomain.ProviderArgoCD)) {
			hasArgoCDCD = true
		}
	}
	if !hasArgoCDCD {
		return nil
	}
	if !hasCIBinding {
		return fmt.Errorf("%w: cd 选择 argocd 时，必须同时启用 ci 执行单元", ErrInvalidInput)
	}
	if gitopsType != "" && !gitopsType.Valid() {
		return fmt.Errorf("%w: gitops_type 无效", ErrInvalidInput)
	}
	if uc.argocdRepo != nil {
		instances, _, err := uc.argocdRepo.ListInstances(ctx, argocddomain.InstanceListFilter{
			Status:   argocddomain.StatusActive,
			Page:     1,
			PageSize: 200,
		})
		if err != nil {
			return err
		}
		if len(instances) == 0 {
			return fmt.Errorf("%w: cd 选择 argocd 时，请先在组件管理中配置可用的 ArgoCD 实例", ErrInvalidInput)
		}
		bindings, err := uc.argocdRepo.ListEnvBindings(ctx)
		if err != nil {
			return err
		}
		activeBindingCount := 0
		for _, item := range bindings {
			if item.Status == argocddomain.StatusActive {
				activeBindingCount++
			}
		}
		if len(instances) > 1 && activeBindingCount == 0 {
			return fmt.Errorf("%w: 当前存在多个 ArgoCD 实例，请先配置环境与 ArgoCD 的绑定关系", ErrInvalidInput)
		}
	}
	_ = params
	return nil
}
