package usecase

import (
	"context"
	"fmt"
	"strings"
	"time"

	appdomain "gos/internal/domain/application"
	pipelineparamdomain "gos/internal/domain/executorparam"
	gitopsdomain "gos/internal/domain/gitops"
	pipelinedomain "gos/internal/domain/pipeline"
	platformparamdomain "gos/internal/domain/platformparam"
	releasedomain "gos/internal/domain/release"
)

type ReleaseTemplateManager struct {
	repo         releasedomain.Repository
	appRepo      appdomain.Repository
	pipelineRepo pipelinedomain.Repository
	paramRepo    pipelineparamdomain.Repository
	platformRepo platformparamdomain.Repository
	gitopsReader ReleaseTemplateGitOpsFieldCandidateReader
	now          func() time.Time
}

type ReleaseTemplateGitOpsFieldCandidateReader interface {
	ListFieldCandidates(ctx context.Context, appKey string) ([]gitopsdomain.FieldCandidate, error)
}

type ReleaseTemplateGitOpsRuleInput struct {
	SourceParamKey   string
	SourceFrom       releasedomain.GitOpsRuleSourceFrom
	FilePathTemplate string
	DocumentKind     string
	DocumentName     string
	TargetPath       string
	ValueTemplate    string
}

type CreateReleaseTemplateInput struct {
	Name          string
	ApplicationID string
	CIBindingID   string
	CDBindingID   string
	CDProvider    pipelinedomain.Provider
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
	gitopsReader ReleaseTemplateGitOpsFieldCandidateReader,
) *ReleaseTemplateManager {
	return &ReleaseTemplateManager{
		repo:         repo,
		appRepo:      appRepo,
		pipelineRepo: pipelineRepo,
		paramRepo:    paramRepo,
		platformRepo: platformRepo,
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
	if name == "" || applicationID == "" {
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, fmt.Errorf("%w: name and application_id are required", ErrInvalidInput)
	}

	status := input.Status
	if status == "" {
		status = releasedomain.TemplateStatusActive
	}
	if !status.Valid() {
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, ErrInvalidStatus
	}

	templateBindings, params, gitopsRules, appName, err := uc.buildTemplatePayload(
		ctx,
		applicationID,
		input.CIBindingID,
		input.CDBindingID,
		input.CDProvider,
		input.CIParamDefIDs,
		input.CDParamDefIDs,
		input.GitOpsRules,
	)
	if err != nil {
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
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}
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
	if id == "" {
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, ErrInvalidID
	}
	current, _, _, _, err := uc.repo.GetTemplateByID(ctx, id)
	if err != nil {
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
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, ErrInvalidStatus
	}

	templateBindings, params, gitopsRules, appName, err := uc.buildTemplatePayload(
		ctx,
		current.ApplicationID,
		input.CIBindingID,
		input.CDBindingID,
		input.CDProvider,
		input.CIParamDefIDs,
		input.CDParamDefIDs,
		input.GitOpsRules,
	)
	if err != nil {
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
		return releasedomain.ReleaseTemplate{}, nil, nil, nil, err
	}
	return uc.repo.GetTemplateByID(ctx, template.ID)
}

func (uc *ReleaseTemplateManager) Delete(ctx context.Context, id string) error {
	id = strings.TrimSpace(id)
	if id == "" {
		return ErrInvalidID
	}
	return uc.repo.DeleteTemplate(ctx, id)
}

func (uc *ReleaseTemplateManager) buildTemplatePayload(
	ctx context.Context,
	applicationID string,
	ciBindingID string,
	cdBindingID string,
	cdProvider pipelinedomain.Provider,
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
	if err := uc.validateArgoCDTemplateImageVersion(ctx, bindings, params); err != nil {
		return nil, nil, nil, "", err
	}
	gitopsRules, err := uc.buildGitOpsRules(ctx, applicationID, bindings, params, gitopsRuleInputs)
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

func (uc *ReleaseTemplateManager) buildGitOpsRules(
	ctx context.Context,
	applicationID string,
	bindings []releasedomain.ReleaseTemplateBinding,
	params []releasedomain.ReleaseTemplateParam,
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

	app, err := uc.appRepo.GetByID(ctx, applicationID)
	if err != nil {
		return nil, err
	}
	appKey := strings.TrimSpace(app.Key)
	if appKey == "" {
		return nil, fmt.Errorf("%w: application key is required for argocd gitops rules", ErrInvalidInput)
	}

	candidates, err := uc.gitopsReader.ListFieldCandidates(ctx, appKey)
	if err != nil {
		return nil, err
	}
	candidateSet := make(map[string]gitopsdomain.FieldCandidate, len(candidates))
	for _, item := range candidates {
		candidateSet[buildGitOpsCandidateKey(item.FilePathTemplate, item.DocumentKind, item.DocumentName, item.TargetPath)] = item
	}

	builtinParams, err := uc.listBuiltinPlatformParamsForTemplate(ctx)
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
		case releasedomain.GitOpsRuleSourceBuiltin:
			dict, ok := builtinParams[paramKey]
			if !ok {
				return nil, fmt.Errorf("%w: gitops 替换规则只能引用已启用的内置字段：%s", ErrInvalidInput, paramKey)
			}
			sourceName = firstNonEmpty(dict.Name, paramKey)
		}

		filePathTemplate := filepathSlash(strings.TrimSpace(input.FilePathTemplate))
		documentKind := strings.TrimSpace(input.DocumentKind)
		documentName := strings.TrimSpace(input.DocumentName)
		targetPath := strings.TrimSpace(input.TargetPath)
		if filePathTemplate == "" || documentKind == "" || targetPath == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则必须选择 YAML 字段目标", ErrInvalidInput)
		}

		candidateKey := buildGitOpsCandidateKey(filePathTemplate, documentKind, documentName, targetPath)
		if _, ok := candidateSet[candidateKey]; !ok {
			return nil, fmt.Errorf("%w: 选中的 YAML 字段目标不存在或已变更", ErrInvalidInput)
		}
		if _, exists := seen[candidateKey+"::"+paramKey]; exists {
			return nil, fmt.Errorf("%w: gitops 替换规则存在重复项", ErrInvalidInput)
		}
		seen[candidateKey+"::"+paramKey] = struct{}{}

		valueTemplate := strings.TrimSpace(input.ValueTemplate)
		if valueTemplate == "" {
			valueTemplate = "{" + paramKey + "}"
		}

		result = append(result, releasedomain.ReleaseTemplateGitOpsRule{
			ID:               generateID("rtgr"),
			PipelineScope:    releasedomain.PipelineScopeCD,
			SourceParamKey:   paramKey,
			SourceParamName:  sourceName,
			SourceFrom:       sourceFrom,
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

func buildGitOpsCandidateKey(filePathTemplate string, documentKind string, documentName string, targetPath string) string {
	return strings.Join([]string{
		filepathSlash(strings.TrimSpace(filePathTemplate)),
		strings.TrimSpace(documentKind),
		strings.TrimSpace(documentName),
		strings.TrimSpace(targetPath),
	}, "::")
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

func (uc *ReleaseTemplateManager) validateArgoCDTemplateImageVersion(
	ctx context.Context,
	bindings []releasedomain.ReleaseTemplateBinding,
	params []releasedomain.ReleaseTemplateParam,
) error {
	var (
		hasCIBinding bool
		hasArgoCDCD  bool
		hasEnvParam  bool
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
	for _, item := range params {
		if strings.EqualFold(strings.TrimSpace(item.ParamKey), "env") {
			hasEnvParam = true
		}
	}
	if !hasEnvParam {
		return fmt.Errorf("%w: cd 选择 argocd 时，模板参数必须包含 env", ErrInvalidInput)
	}
	return nil
}
