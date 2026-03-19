package usecase

import (
	"context"
	"fmt"
	"regexp"
	"strings"

	gitopsdomain "gos/internal/domain/gitops"
	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/release"
)

var gitopsTemplatePlaceholderPattern = regexp.MustCompile(`\{([a-zA-Z0-9_]+)\}`)

func (uc *ReleaseOrderManager) startArgoCDExecution(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
	orderParams []domain.ReleaseOrderParam,
	executions []domain.ReleaseOrderExecution,
) error {
	if uc.argocd == nil {
		return fmt.Errorf("%w: argocd executor is not configured", ErrInvalidInput)
	}
	if uc.gitops == nil {
		return fmt.Errorf("%w: gitops service is not configured", ErrInvalidInput)
	}

	template, _, _, templateGitOpsRules, err := uc.repo.GetTemplateByID(ctx, order.TemplateID)
	if err != nil {
		return err
	}
	gitopsType := normalizeTemplateGitOpsType(template.GitOpsType, true)
	if err := uc.ensureArgoCDExecutionSteps(ctx, order, executions, gitopsType); err != nil {
		return err
	}

	updateCode := scopeStepCode(execution.PipelineScope, "gitops_update")
	commitCode := scopeStepCode(execution.PipelineScope, "git_commit")
	pushCode := scopeStepCode(execution.PipelineScope, "git_push")
	syncCode := scopeStepCode(execution.PipelineScope, "argocd_sync")
	healthCode := scopeStepCode(execution.PipelineScope, "health_check")

	_ = uc.markStepRunning(ctx, order.ID, updateCode, "开始更新 GitOps 配置")

	binding, err := uc.resolveExecutionBinding(ctx, order, execution)
	if err != nil {
		_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "解析 ArgoCD 绑定失败: "+err.Error())
		return err
	}
	appKey := ""
	if uc.appRepo != nil {
		appRecord, appErr := uc.appRepo.GetByID(ctx, strings.TrimSpace(order.ApplicationID))
		if appErr == nil {
			appKey = strings.TrimSpace(appRecord.Key)
		}
	}
	environment := uc.resolveArgoCDEnvironment(order, orderParams)
	appName, app, err := resolveArgoCDApplicationByRef(ctx, uc.argocd, binding.ExternalRef, environment, gitopsType)
	if err != nil {
		_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "加载 ArgoCD Application 失败: "+err.Error())
		return fmt.Errorf("%w: get argocd application failed: %v", ErrInvalidInput, err)
	}

	repoURL := strings.TrimSpace(app.GetRepoURL())
	sourcePath := strings.TrimSpace(app.GetSourcePath())
	if repoURL == "" || sourcePath == "" {
		_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "ArgoCD Application 缺少仓库地址或源路径")
		return fmt.Errorf("%w: argocd application source repo/path is incomplete", ErrInvalidInput)
	}

	imageVersion := uc.resolveArgoCDImageVersion(order, orderParams, executions)
	if imageVersion == "" {
		_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "未解析到 image_version，无法继续写入 GitOps 配置")
		return fmt.Errorf("%w: image_version is required when cd executor is argocd", ErrInvalidInput)
	}
	commitFields := buildGitOpsCommitMessageFields(order, orderParams, appKey, environment, imageVersion, sourcePath)
	commitMessage := uc.gitops.BuildCommitMessage(commitFields)

	manifestChangedFiles := make([]string, 0)
	commitSHA := ""
	manifestChanged := false
	manifestPath := ""
	previousTag := ""
	changed := false
	switch gitopsType {
	case domain.GitOpsTypeHelm:
		valuesRules, buildErr := uc.buildArgoCDValuesRules(templateGitOpsRules, commitFields)
		if buildErr != nil {
			_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "GitOps 规则渲染失败: "+buildErr.Error())
			return buildErr
		}
		_, valuesFiles, valuesCommitSHA, valuesChanged, applyErr := uc.gitops.ApplyValuesRules(
			ctx,
			repoURL,
			strings.TrimSpace(app.GetTargetRevision()),
			valuesRules,
			commitMessage,
		)
		if applyErr != nil {
			_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "Helm values 写回失败: "+applyErr.Error())
			return fmt.Errorf("%w: apply gitops values rules failed: %v", ErrInvalidInput, applyErr)
		}
		manifestChangedFiles = append(manifestChangedFiles, valuesFiles...)
		if strings.TrimSpace(valuesCommitSHA) != "" {
			commitSHA = strings.TrimSpace(valuesCommitSHA)
		}
		manifestChanged = valuesChanged
	default:
		if len(templateGitOpsRules) > 0 {
			manifestRules, buildErr := uc.buildArgoCDManifestRules(templateGitOpsRules, commitFields)
			if buildErr != nil {
				_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "GitOps 规则渲染失败: "+buildErr.Error())
				return buildErr
			}
			if len(manifestRules) > 0 {
				_, manifestFiles, manifestCommitSHA, changed, applyErr := uc.gitops.ApplyManifestRules(
					ctx,
					repoURL,
					strings.TrimSpace(app.GetTargetRevision()),
					manifestRules,
					commitMessage,
				)
				if applyErr != nil {
					_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "GitOps YAML 替换失败: "+applyErr.Error())
					return fmt.Errorf("%w: apply gitops manifest rules failed: %v", ErrInvalidInput, applyErr)
				}
				manifestChangedFiles = append(manifestChangedFiles, manifestFiles...)
				if strings.TrimSpace(manifestCommitSHA) != "" {
					commitSHA = strings.TrimSpace(manifestCommitSHA)
				}
				manifestChanged = changed
			}
		}

		var imageCommitSHA string
		var imagePreviousTag string
		var imageChanged bool
		var updateErr error
		_, manifestPath, imageCommitSHA, imagePreviousTag, imageChanged, updateErr = uc.gitops.UpdateKustomizationImage(
			ctx,
			repoURL,
			sourcePath,
			strings.TrimSpace(app.GetTargetRevision()),
			imageVersion,
			commitMessage,
		)
		if updateErr != nil {
			_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusFailed, "GitOps 仓库更新失败: "+updateErr.Error())
			return fmt.Errorf("%w: update gitops repo failed: %v", ErrInvalidInput, updateErr)
		}
		if strings.TrimSpace(imageCommitSHA) != "" {
			commitSHA = strings.TrimSpace(imageCommitSHA)
		}
		previousTag = imagePreviousTag
		changed = imageChanged
	}

	updateMessage := "GitOps 配置已更新"
	switch gitopsType {
	case domain.GitOpsTypeHelm:
		if manifestChanged {
			updateMessage = "Helm values 已更新"
		} else {
			updateMessage = "Helm values 无变化"
		}
	default:
		if changed {
			updateMessage = fmt.Sprintf("GitOps 配置已更新，image_version: %s -> %s", previousTag, imageVersion)
		} else if manifestChanged {
			updateMessage = "GitOps YAML 字段替换已应用"
		} else {
			updateMessage = fmt.Sprintf("GitOps 配置无变化，image_version 已是 %s", imageVersion)
		}
	}
	if len(manifestChangedFiles) > 0 {
		updateMessage += fmt.Sprintf("，变更文件 %d 个", len(manifestChangedFiles))
	}
	if manifestPath != "" {
		updateMessage += "，file: " + strings.TrimSpace(manifestPath)
	}
	_ = uc.markStepFinished(ctx, order.ID, updateCode, domain.StepStatusSuccess, updateMessage)

	_ = uc.markStepRunning(ctx, order.ID, commitCode, "开始提交 Git 变更")
	if strings.TrimSpace(commitSHA) != "" && (manifestChanged || changed) {
		_ = uc.markStepFinished(ctx, order.ID, commitCode, domain.StepStatusSuccess, "Git commit 成功，commit: "+strings.TrimSpace(commitSHA))
		_ = uc.markStepRunning(ctx, order.ID, pushCode, "开始推送 Git 变更")
		_ = uc.markStepFinished(ctx, order.ID, pushCode, domain.StepStatusSuccess, "Git push 成功，commit: "+strings.TrimSpace(commitSHA))
	} else {
		_ = uc.markStepFinished(ctx, order.ID, commitCode, domain.StepStatusSuccess, "GitOps 配置无变化，无需生成新的 commit")
		_ = uc.markStepFinished(ctx, order.ID, pushCode, domain.StepStatusSuccess, "GitOps 配置无变化，无需推送到远端仓库")
	}

	_ = uc.markStepRunning(ctx, order.ID, syncCode, "开始触发 ArgoCD Sync")
	if err := uc.argocd.SyncApplication(ctx, appName); err != nil {
		_ = uc.markStepFinished(ctx, order.ID, syncCode, domain.StepStatusFailed, "触发 ArgoCD Sync 失败: "+err.Error())
		return fmt.Errorf("%w: trigger argocd sync failed: %v", ErrInvalidInput, err)
	}

	now := uc.now()
	if _, err := uc.repo.UpdateExecutionByScope(ctx, order.ID, execution.PipelineScope, domain.ExecutionUpdateInput{
		Status:        domain.ExecutionStatusRunning,
		ExternalRunID: commitSHA,
		StartedAt:     &now,
		UpdatedAt:     now,
	}); err != nil {
		return err
	}

	syncMessage := fmt.Sprintf("ArgoCD Sync 已触发，app: %s", appName)
	if strings.TrimSpace(commitSHA) != "" {
		syncMessage += "，commit: " + strings.TrimSpace(commitSHA)
	}
	_ = uc.markStepFinished(ctx, order.ID, syncCode, domain.StepStatusSuccess, syncMessage)
	_ = uc.markStepRunning(ctx, order.ID, healthCode, "ArgoCD Sync 已触发，等待健康检查回传")

	if _, refreshErr := uc.refreshPipelineStages(ctx, order, execution, binding); refreshErr != nil {
		// 阶段同步只是补充视图，失败不阻断实际发布链路。
	}
	return nil
}

func (uc *ReleaseOrderManager) ensureArgoCDExecutionSteps(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	gitopsType domain.GitOpsType,
) error {
	steps, err := uc.repo.ListSteps(ctx, order.ID)
	if err != nil {
		return err
	}
	if findStepByCode(steps, scopeStepCode(domain.PipelineScopeCD, "gitops_update")) != nil {
		return nil
	}
	if findStepByCode(steps, scopeStepCode(domain.PipelineScopeCD, "trigger_pipeline")) == nil {
		return nil
	}

	rebuilt := defaultReleaseOrderSteps(order.ID, executions, uc.now(), gitopsType)
	existingByCode := make(map[string]domain.ReleaseOrderStep, len(steps))
	for _, item := range steps {
		existingByCode[item.StepCode] = item
	}
	for idx := range rebuilt {
		if current, ok := existingByCode[rebuilt[idx].StepCode]; ok {
			rebuilt[idx].ID = current.ID
			rebuilt[idx].ExecutionID = firstNonEmpty(strings.TrimSpace(current.ExecutionID), strings.TrimSpace(rebuilt[idx].ExecutionID))
			rebuilt[idx].Status = current.Status
			rebuilt[idx].Message = current.Message
			rebuilt[idx].StartedAt = current.StartedAt
			rebuilt[idx].FinishedAt = current.FinishedAt
			rebuilt[idx].CreatedAt = current.CreatedAt
		}
	}
	return uc.repo.ReplaceSteps(ctx, order.ID, rebuilt)
}

func (uc *ReleaseOrderManager) resolveExecutionBinding(
	ctx context.Context,
	order domain.ReleaseOrder,
	execution domain.ReleaseOrderExecution,
) (pipelinedomain.PipelineBinding, error) {
	bindingID := strings.TrimSpace(execution.BindingID)
	if bindingID != "" {
		binding, err := uc.pipelineRepo.GetBindingByID(ctx, bindingID)
		if err == nil {
			return binding, nil
		}
		if !strings.EqualFold(strings.TrimSpace(execution.Provider), string(pipelinedomain.ProviderArgoCD)) {
			return pipelinedomain.PipelineBinding{}, err
		}
	}
	if !strings.EqualFold(strings.TrimSpace(execution.Provider), string(pipelinedomain.ProviderArgoCD)) {
		return pipelinedomain.PipelineBinding{}, fmt.Errorf("%w: binding_id is required", ErrInvalidInput)
	}
	if uc.appRepo == nil {
		return pipelinedomain.PipelineBinding{}, fmt.Errorf("%w: application repository is not configured", ErrInvalidInput)
	}
	app, err := uc.appRepo.GetByID(ctx, strings.TrimSpace(order.ApplicationID))
	if err != nil {
		return pipelinedomain.PipelineBinding{}, err
	}
	externalRef, err := deriveArgoCDExternalRef(app)
	if err != nil {
		return pipelinedomain.PipelineBinding{}, err
	}
	// ArgoCD 已迁移到“模板直接启用”的模式后，CD 执行单元可能没有独立的绑定记录。
	// 这里兜底构造一个虚拟绑定，让执行、跟踪和进度模块仍然能复用统一逻辑。
	return pipelinedomain.PipelineBinding{
		ID:              bindingID,
		Name:            firstNonEmpty(strings.TrimSpace(execution.BindingName), "ArgoCD"),
		ApplicationID:   app.ID,
		ApplicationName: app.Name,
		BindingType:     pipelinedomain.BindingType(execution.PipelineScope),
		Provider:        pipelinedomain.ProviderArgoCD,
		ExternalRef:     externalRef,
		Status:          pipelinedomain.StatusActive,
	}, nil
}

func (uc *ReleaseOrderManager) resolveArgoCDImageVersion(
	order domain.ReleaseOrder,
	params []domain.ReleaseOrderParam,
	executions []domain.ReleaseOrderExecution,
) string {
	searchScopes := []domain.PipelineScope{domain.PipelineScopeCI, domain.PipelineScopeCD}
	for _, scope := range searchScopes {
		if value := findReleaseParamValue(params, scope, "image_version", "image_tag"); value != "" {
			return value
		}
	}
	if value := findReleaseParamValue(params, "", "image_version", "image_tag"); value != "" {
		return value
	}
	for _, item := range executions {
		if item.PipelineScope != domain.PipelineScopeCI {
			continue
		}
		if !strings.EqualFold(strings.TrimSpace(item.Provider), string(pipelinedomain.ProviderJenkins)) {
			continue
		}
		if buildNumber := parseJenkinsBuildNumber(item.BuildURL); buildNumber != "" {
			return buildNumber
		}
	}
	return strings.TrimSpace(order.ImageTag)
}

func (uc *ReleaseOrderManager) resolveArgoCDEnvironment(
	order domain.ReleaseOrder,
	params []domain.ReleaseOrderParam,
) string {
	searchScopes := []domain.PipelineScope{domain.PipelineScopeCD, domain.PipelineScopeCI}
	for _, scope := range searchScopes {
		if value := findReleaseParamValue(params, scope, "env", "env_code"); value != "" {
			return value
		}
	}
	if value := findReleaseParamValue(params, "", "env", "env_code"); value != "" {
		return value
	}
	return strings.TrimSpace(order.EnvCode)
}

func findReleaseParamValue(params []domain.ReleaseOrderParam, scope domain.PipelineScope, keys ...string) string {
	normalizedKeys := make([]string, 0, len(keys))
	for _, key := range keys {
		value := strings.ToLower(strings.TrimSpace(key))
		if value != "" {
			normalizedKeys = append(normalizedKeys, value)
		}
	}
	for _, item := range params {
		if scope != "" && item.PipelineScope != scope {
			continue
		}
		paramKey := strings.ToLower(strings.TrimSpace(item.ParamKey))
		for _, key := range normalizedKeys {
			if paramKey == key {
				value := strings.TrimSpace(item.ParamValue)
				if value != "" {
					return value
				}
			}
		}
	}
	return ""
}

func isArgoCDExecution(execution domain.ReleaseOrderExecution) bool {
	return strings.EqualFold(strings.TrimSpace(execution.Provider), string(pipelinedomain.ProviderArgoCD))
}

func buildGitOpsCommitMessageFields(
	order domain.ReleaseOrder,
	params []domain.ReleaseOrderParam,
	appKey string,
	environment string,
	imageVersion string,
	sourcePath string,
) map[string]string {
	fields := map[string]string{
		"order_no":      strings.TrimSpace(order.OrderNo),
		"app_name":      strings.TrimSpace(order.ApplicationName),
		"app_key":       strings.TrimSpace(appKey),
		"env":           strings.TrimSpace(environment),
		"image_version": strings.TrimSpace(imageVersion),
		"source_path":   strings.TrimSpace(sourcePath),
	}
	for _, item := range params {
		paramKey := strings.ToLower(strings.TrimSpace(item.ParamKey))
		paramValue := strings.TrimSpace(item.ParamValue)
		if paramKey == "" || paramValue == "" {
			continue
		}
		if _, exists := fields[paramKey]; exists && strings.TrimSpace(fields[paramKey]) != "" {
			continue
		}
		fields[paramKey] = paramValue
	}
	return fields
}

func (uc *ReleaseOrderManager) buildArgoCDManifestRules(
	rules []domain.ReleaseTemplateGitOpsRule,
	fields map[string]string,
) ([]gitopsdomain.ManifestRule, error) {
	result := make([]gitopsdomain.ManifestRule, 0, len(rules))
	for _, item := range rules {
		sourceKey := strings.ToLower(strings.TrimSpace(item.SourceParamKey))
		if sourceKey != "" && strings.TrimSpace(fields[sourceKey]) == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则缺少取值字段 %s", ErrInvalidInput, sourceKey)
		}
		locatorKey := strings.ToLower(strings.TrimSpace(item.LocatorParamKey))
		if locatorKey != "" && strings.TrimSpace(fields[locatorKey]) == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则缺少定位字段 %s", ErrInvalidInput, locatorKey)
		}

		filePath := strings.TrimSpace(uc.gitops.RenderTemplate(strings.TrimSpace(item.FilePathTemplate), fields))
		documentName := strings.TrimSpace(uc.gitops.RenderTemplate(strings.TrimSpace(item.DocumentName), fields))
		value := strings.TrimSpace(uc.gitops.RenderTemplate(strings.TrimSpace(item.ValueTemplate), fields))
		if filePath == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则缺少目标文件路径", ErrInvalidInput)
		}
		if value == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则字段 %s 未取到值", ErrInvalidInput, firstNonEmpty(item.SourceParamName, item.SourceParamKey))
		}
		if unresolvedGitOpsTemplate(filePath) || unresolvedGitOpsTemplate(documentName) || unresolvedGitOpsTemplate(value) {
			return nil, fmt.Errorf("%w: gitops 替换规则仍存在未解析占位符，请检查字段映射", ErrInvalidInput)
		}
		result = append(result, gitopsdomain.ManifestRule{
			FilePath:     normalizeArgoCDSourcePath(filePath),
			DocumentKind: strings.TrimSpace(item.DocumentKind),
			DocumentName: documentName,
			TargetPath:   strings.TrimSpace(item.TargetPath),
			Value:        value,
		})
	}
	return result, nil
}

func (uc *ReleaseOrderManager) buildArgoCDValuesRules(
	rules []domain.ReleaseTemplateGitOpsRule,
	fields map[string]string,
) ([]gitopsdomain.ValuesRule, error) {
	result := make([]gitopsdomain.ValuesRule, 0, len(rules))
	for _, item := range rules {
		sourceKey := strings.ToLower(strings.TrimSpace(item.SourceParamKey))
		if sourceKey != "" && strings.TrimSpace(fields[sourceKey]) == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则缺少取值字段 %s", ErrInvalidInput, sourceKey)
		}
		locatorKey := strings.ToLower(strings.TrimSpace(item.LocatorParamKey))
		if locatorKey != "" && strings.TrimSpace(fields[locatorKey]) == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则缺少定位字段 %s", ErrInvalidInput, locatorKey)
		}

		filePath := strings.TrimSpace(uc.gitops.RenderTemplate(strings.TrimSpace(item.FilePathTemplate), fields))
		value := strings.TrimSpace(uc.gitops.RenderTemplate(strings.TrimSpace(item.ValueTemplate), fields))
		if filePath == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则缺少目标 values 文件路径", ErrInvalidInput)
		}
		if value == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则字段 %s 未取到值", ErrInvalidInput, firstNonEmpty(item.SourceParamName, item.SourceParamKey))
		}
		if unresolvedGitOpsTemplate(filePath) || unresolvedGitOpsTemplate(value) {
			return nil, fmt.Errorf("%w: gitops 替换规则仍存在未解析占位符，请检查字段映射", ErrInvalidInput)
		}
		targetPath := strings.TrimSpace(item.TargetPath)
		if targetPath == "" {
			return nil, fmt.Errorf("%w: gitops 替换规则缺少 values_path", ErrInvalidInput)
		}
		result = append(result, gitopsdomain.ValuesRule{
			FilePath:   normalizeArgoCDSourcePath(filePath),
			TargetPath: targetPath,
			Value:      value,
		})
	}
	return result, nil
}

func unresolvedGitOpsTemplate(value string) bool {
	return gitopsTemplatePlaceholderPattern.MatchString(strings.TrimSpace(value))
}

// resolveArgoCDApplicationByRef 兼容两种 external_ref：
// 1. 历史数据：直接填写 ArgoCD Application 名称；
// 2. 当前推荐：选择 GitOps 应用目录（apps/<应用目录>）。
//
// 当 external_ref 是 GitOps 应用目录时，平台会结合标准 Key `env`，
// 自动拼成 apps/<应用目录>/overlays/<env> 来定位真正的 ArgoCD Application。
func resolveArgoCDApplicationByRef(
	ctx context.Context,
	client ArgoCDReleaseExecutor,
	externalRef string,
	environment string,
	gitopsType domain.GitOpsType,
) (string, ArgoCDApplicationSnapshot, error) {
	ref := strings.TrimSpace(externalRef)
	if ref == "" {
		return "", nil, fmt.Errorf("%w: cd argocd binding requires external_ref", ErrInvalidInput)
	}
	app, err := client.GetApplication(ctx, ref)
	if err == nil {
		return ref, app, nil
	}
	if !isResourceNotFoundError(err) {
		return "", nil, err
	}
	normalizedRef := normalizeArgoCDSourcePath(ref)
	candidatePaths := buildArgoCDSourcePathCandidates(normalizedRef, environment, gitopsType)
	if len(candidatePaths) == 0 {
		return "", nil, fmt.Errorf("%w: env is required when cd argocd binding uses gitops application directory", ErrInvalidInput)
	}

	items, listErr := client.ListApplications(ctx)
	if listErr != nil {
		return "", nil, listErr
	}
	for _, targetPath := range candidatePaths {
		matched := make([]ArgoCDApplicationSnapshot, 0)
		for _, item := range items {
			if normalizeArgoCDSourcePath(item.GetSourcePath()) == targetPath {
				matched = append(matched, item)
			}
		}
		if len(matched) == 1 {
			return strings.TrimSpace(matched[0].GetName()), matched[0], nil
		}
		if len(matched) > 1 {
			return "", nil, fmt.Errorf("%w: multiple argocd applications match source path %s", ErrInvalidInput, targetPath)
		}
	}
	return "", nil, err
}

func buildArgoCDSourcePathCandidates(ref string, environment string, gitopsType domain.GitOpsType) []string {
	ref = normalizeArgoCDSourcePath(ref)
	if ref == "" {
		return nil
	}
	candidates := make([]string, 0, 2)
	switch normalizeTemplateGitOpsType(gitopsType, true) {
	case domain.GitOpsTypeHelm:
		if strings.HasSuffix(ref, "/helm") {
			candidates = append(candidates, ref)
		} else {
			candidates = append(candidates, normalizeArgoCDSourcePath(ref+"/helm"))
		}
	default:
		if strings.Contains(ref, "/overlays/") {
			candidates = append(candidates, ref)
		} else if env := strings.Trim(strings.TrimSpace(environment), "/"); env != "" {
			candidates = append(candidates, normalizeArgoCDSourcePath(ref+"/overlays/"+env))
		}
	}
	candidates = append(candidates, ref)
	return uniqueStringSlice(candidates)
}

func uniqueStringSlice(values []string) []string {
	result := make([]string, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, item := range values {
		value := strings.TrimSpace(item)
		if value == "" {
			continue
		}
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func normalizeArgoCDSourcePath(value string) string {
	normalized := strings.TrimSpace(value)
	normalized = strings.TrimPrefix(normalized, "./")
	normalized = strings.TrimPrefix(normalized, "/")
	return strings.TrimSuffix(normalized, "/")
}
