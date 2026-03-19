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
) error {
	if uc.argocd == nil {
		return fmt.Errorf("%w: argocd executor is not configured", ErrInvalidInput)
	}
	if uc.gitops == nil {
		return fmt.Errorf("%w: gitops service is not configured", ErrInvalidInput)
	}

	binding, err := uc.resolveExecutionBinding(ctx, order, execution)
	if err != nil {
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
	appName, app, err := resolveArgoCDApplicationByRef(ctx, uc.argocd, binding.ExternalRef, environment)
	if err != nil {
		return fmt.Errorf("%w: get argocd application failed: %v", ErrInvalidInput, err)
	}

	repoURL := strings.TrimSpace(app.GetRepoURL())
	sourcePath := strings.TrimSpace(app.GetSourcePath())
	if repoURL == "" || sourcePath == "" {
		return fmt.Errorf("%w: argocd application source repo/path is incomplete", ErrInvalidInput)
	}

	imageVersion := uc.resolveArgoCDImageVersion(order, orderParams)
	if imageVersion == "" {
		return fmt.Errorf("%w: image_version is required when cd executor is argocd", ErrInvalidInput)
	}
	commitFields := buildGitOpsCommitMessageFields(order, orderParams, appKey, environment, imageVersion, sourcePath)
	_, _, _, templateGitOpsRules, err := uc.repo.GetTemplateByID(ctx, order.TemplateID)
	if err != nil {
		return err
	}
	commitMessage := uc.gitops.BuildCommitMessage(commitFields)

	triggerCode := scopeStepCode(execution.PipelineScope, "trigger_pipeline")
	runningCode := scopeStepCode(execution.PipelineScope, "pipeline_running")
	successCode := scopeStepCode(execution.PipelineScope, "pipeline_success")

	_ = uc.markStepRunning(ctx, order.ID, triggerCode, "开始写入 GitOps 仓库并触发 ArgoCD Sync")

	manifestChangedFiles := make([]string, 0)
	commitSHA := ""
	manifestChanged := false
	if len(templateGitOpsRules) > 0 {
		manifestRules, buildErr := uc.buildArgoCDManifestRules(templateGitOpsRules, commitFields)
		if buildErr != nil {
			_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusFailed, "GitOps 规则渲染失败: "+buildErr.Error())
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
				_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusFailed, "GitOps YAML 替换失败: "+applyErr.Error())
				return fmt.Errorf("%w: apply gitops manifest rules failed: %v", ErrInvalidInput, applyErr)
			}
			manifestChangedFiles = append(manifestChangedFiles, manifestFiles...)
			if strings.TrimSpace(manifestCommitSHA) != "" {
				commitSHA = strings.TrimSpace(manifestCommitSHA)
			}
			manifestChanged = changed
		}
	}

	_, manifestPath, imageCommitSHA, previousTag, changed, err := uc.gitops.UpdateKustomizationImage(
		ctx,
		repoURL,
		sourcePath,
		strings.TrimSpace(app.GetTargetRevision()),
		imageVersion,
		commitMessage,
	)
	if err != nil {
		_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusFailed, "GitOps 仓库更新失败: "+err.Error())
		return fmt.Errorf("%w: update gitops repo failed: %v", ErrInvalidInput, err)
	}
	if strings.TrimSpace(imageCommitSHA) != "" {
		commitSHA = strings.TrimSpace(imageCommitSHA)
	}
	if err := uc.argocd.SyncApplication(ctx, appName); err != nil {
		_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusFailed, "触发 ArgoCD Sync 失败: "+err.Error())
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

	triggerMessage := fmt.Sprintf("GitOps 仓库写入成功，app: %s，commit: %s", appName, strings.TrimSpace(commitSHA))
	if len(manifestChangedFiles) > 0 {
		triggerMessage += fmt.Sprintf("，yaml_changed: %d", len(manifestChangedFiles))
	}
	if manifestPath != "" {
		triggerMessage += "，file: " + strings.TrimSpace(manifestPath)
	}
	if changed {
		triggerMessage += fmt.Sprintf("，image_version: %s -> %s", previousTag, imageVersion)
	} else {
		triggerMessage += fmt.Sprintf("，image_version 已是 %s", imageVersion)
	}
	if !changed && manifestChanged {
		triggerMessage += "，已应用 GitOps YAML 字段替换"
	}
	_ = uc.markStepFinished(ctx, order.ID, triggerCode, domain.StepStatusSuccess, triggerMessage)
	_ = uc.markStepRunning(ctx, order.ID, runningCode, "ArgoCD Sync 已触发，等待应用状态回传")
	_ = uc.markStep(ctx, order.ID, successCode, domain.StepStatusPending, "", nil, nil)

	if _, refreshErr := uc.refreshPipelineStages(ctx, order, execution, binding); refreshErr != nil {
		// 阶段同步只是补充视图，失败不阻断实际发布链路。
	}
	return nil
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
	candidatePaths := buildArgoCDSourcePathCandidates(normalizedRef, environment)
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

func buildArgoCDSourcePathCandidates(ref string, environment string) []string {
	ref = normalizeArgoCDSourcePath(ref)
	if ref == "" {
		return nil
	}
	candidates := make([]string, 0, 2)
	if strings.Contains(ref, "/overlays/") {
		candidates = append(candidates, ref)
	} else if env := strings.Trim(strings.TrimSpace(environment), "/"); env != "" {
		candidates = append(candidates, normalizeArgoCDSourcePath(ref+"/overlays/"+env))
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
