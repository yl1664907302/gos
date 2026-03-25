package httpapi

import (
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	pipelinedomain "gos/internal/domain/pipeline"
	releasedomain "gos/internal/domain/release"
	userdomain "gos/internal/domain/user"
)

type ReleaseTemplateHandler struct {
	manager *usecase.ReleaseTemplateManager
	authz   RequestAuthorizer
}

func NewReleaseTemplateHandler(
	manager *usecase.ReleaseTemplateManager,
	authz RequestAuthorizer,
) *ReleaseTemplateHandler {
	return &ReleaseTemplateHandler{
		manager: manager,
		authz:   authz,
	}
}

func (h *ReleaseTemplateHandler) RegisterRoutes(router gin.IRouter) {
	router.GET("/release-templates", h.List)
	router.POST("/release-templates", h.Create)
	router.GET("/release-templates/:id", h.GetByID)
	router.PUT("/release-templates/:id", h.Update)
	router.DELETE("/release-templates/:id", h.Delete)
}

type CreateReleaseTemplateRequest struct {
	Name           string                              `json:"name"`
	ApplicationID  string                              `json:"application_id"`
	CIBindingID    string                              `json:"ci_binding_id"`
	CDBindingID    string                              `json:"cd_binding_id"`
	CDProvider     string                              `json:"cd_provider"`
	GitOpsType     string                              `json:"gitops_type"`
	Status         string                              `json:"status"`
	Remark         string                              `json:"remark"`
	CIParamDefIDs  []string                            `json:"ci_param_def_ids"`
	CDParamDefIDs  []string                            `json:"cd_param_def_ids"`
	CIParamConfigs []ReleaseTemplateParamConfigRequest `json:"ci_param_configs"`
	CDParamConfigs []ReleaseTemplateParamConfigRequest `json:"cd_param_configs"`
	GitOpsRules    []ReleaseTemplateGitOpsRuleRequest  `json:"gitops_rules"`
}

type UpdateReleaseTemplateRequest struct {
	Name           string                              `json:"name"`
	CIBindingID    string                              `json:"ci_binding_id"`
	CDBindingID    string                              `json:"cd_binding_id"`
	CDProvider     string                              `json:"cd_provider"`
	GitOpsType     string                              `json:"gitops_type"`
	Status         string                              `json:"status"`
	Remark         string                              `json:"remark"`
	CIParamDefIDs  []string                            `json:"ci_param_def_ids"`
	CDParamDefIDs  []string                            `json:"cd_param_def_ids"`
	CIParamConfigs []ReleaseTemplateParamConfigRequest `json:"ci_param_configs"`
	CDParamConfigs []ReleaseTemplateParamConfigRequest `json:"cd_param_configs"`
	GitOpsRules    []ReleaseTemplateGitOpsRuleRequest  `json:"gitops_rules"`
}

type ReleaseTemplateParamConfigRequest struct {
	ExecutorParamDefID string `json:"executor_param_def_id"`
	ValueSource        string `json:"value_source"`
	SourceParamKey     string `json:"source_param_key"`
	FixedValue         string `json:"fixed_value"`
}

type ReleaseTemplateResponse struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	ApplicationID   string    `json:"application_id"`
	ApplicationName string    `json:"application_name"`
	BindingID       string    `json:"binding_id"`
	BindingName     string    `json:"binding_name"`
	BindingType     string    `json:"binding_type"`
	GitOpsType      string    `json:"gitops_type"`
	Status          string    `json:"status"`
	Remark          string    `json:"remark"`
	ParamCount      int       `json:"param_count"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type ReleaseTemplateParamResponse struct {
	ID                 string    `json:"id"`
	TemplateID         string    `json:"template_id"`
	TemplateBindingID  string    `json:"template_binding_id"`
	PipelineScope      string    `json:"pipeline_scope"`
	BindingID          string    `json:"binding_id"`
	ExecutorParamDefID string    `json:"executor_param_def_id"`
	ParamKey           string    `json:"param_key"`
	ParamName          string    `json:"param_name"`
	ExecutorParamName  string    `json:"executor_param_name"`
	ValueSource        string    `json:"value_source"`
	SourceParamKey     string    `json:"source_param_key"`
	SourceParamName    string    `json:"source_param_name"`
	FixedValue         string    `json:"fixed_value"`
	Required           bool      `json:"required"`
	SortNo             int       `json:"sort_no"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type ReleaseTemplateBindingResponse struct {
	ID            string    `json:"id"`
	TemplateID    string    `json:"template_id"`
	PipelineScope string    `json:"pipeline_scope"`
	BindingID     string    `json:"binding_id"`
	BindingName   string    `json:"binding_name"`
	Provider      string    `json:"provider"`
	PipelineID    string    `json:"pipeline_id"`
	Enabled       bool      `json:"enabled"`
	SortNo        int       `json:"sort_no"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type ReleaseTemplateGitOpsRuleRequest struct {
	SourceParamKey   string `json:"source_param_key"`
	SourceFrom       string `json:"source_from"`
	LocatorParamKey  string `json:"locator_param_key"`
	FilePathTemplate string `json:"file_path_template"`
	DocumentKind     string `json:"document_kind"`
	DocumentName     string `json:"document_name"`
	TargetPath       string `json:"target_path"`
	ValueTemplate    string `json:"value_template"`
}

type ReleaseTemplateGitOpsRuleResponse struct {
	ID               string    `json:"id"`
	TemplateID       string    `json:"template_id"`
	PipelineScope    string    `json:"pipeline_scope"`
	SourceParamKey   string    `json:"source_param_key"`
	SourceParamName  string    `json:"source_param_name"`
	SourceFrom       string    `json:"source_from"`
	LocatorParamKey  string    `json:"locator_param_key"`
	LocatorParamName string    `json:"locator_param_name"`
	FilePathTemplate string    `json:"file_path_template"`
	DocumentKind     string    `json:"document_kind"`
	DocumentName     string    `json:"document_name"`
	TargetPath       string    `json:"target_path"`
	ValueTemplate    string    `json:"value_template"`
	SortNo           int       `json:"sort_no"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type ReleaseTemplateDataResponse struct {
	Data struct {
		Template    ReleaseTemplateResponse             `json:"template"`
		Bindings    []ReleaseTemplateBindingResponse    `json:"bindings"`
		Params      []ReleaseTemplateParamResponse      `json:"params"`
		GitOpsRules []ReleaseTemplateGitOpsRuleResponse `json:"gitops_rules"`
	} `json:"data"`
}

type ReleaseTemplateListResponse struct {
	Data     []ReleaseTemplateResponse `json:"data"`
	Page     int                       `json:"page"`
	PageSize int                       `json:"page_size"`
	Total    int64                     `json:"total"`
}

func (h *ReleaseTemplateHandler) Create(c *gin.Context) {
	if !ensurePermission(c, h.authz, "release.template.manage", "", "") {
		return
	}
	var req CreateReleaseTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	template, bindings, params, gitopsRules, err := h.manager.Create(c.Request.Context(), usecase.CreateReleaseTemplateInput{
		Name:           req.Name,
		ApplicationID:  req.ApplicationID,
		CIBindingID:    req.CIBindingID,
		CDBindingID:    req.CDBindingID,
		CDProvider:     pipelinedomain.Provider(strings.ToLower(strings.TrimSpace(req.CDProvider))),
		GitOpsType:     releasedomain.GitOpsType(strings.ToLower(strings.TrimSpace(req.GitOpsType))),
		Status:         releasedomain.TemplateStatus(strings.TrimSpace(req.Status)),
		Remark:         req.Remark,
		CIParamDefIDs:  req.CIParamDefIDs,
		CDParamDefIDs:  req.CDParamDefIDs,
		CIParamConfigs: toReleaseTemplateParamConfigInputs(req.CIParamConfigs),
		CDParamConfigs: toReleaseTemplateParamConfigInputs(req.CDParamConfigs),
		GitOpsRules:    toReleaseTemplateGitOpsRuleInputs(req.GitOpsRules),
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toReleaseTemplateDataResponse(template, bindings, params, gitopsRules))
}

func (h *ReleaseTemplateHandler) List(c *gin.Context) {
	allowAll, applicationIDs, ok := h.resolveListApplications(c)
	if !ok {
		return
	}
	page, err := parsePositiveInt(c, "page")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pageSize, err := parsePositiveInt(c, "page_size")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	items, total, err := h.manager.List(c.Request.Context(), usecase.ListReleaseTemplateInput{
		ApplicationID:  c.Query("application_id"),
		ApplicationIDs: resolveReleaseTemplateListFilterApplications(strings.TrimSpace(c.Query("application_id")), allowAll, applicationIDs),
		BindingID:      c.Query("binding_id"),
		Status:         releasedomain.TemplateStatus(strings.TrimSpace(c.Query("status"))),
		Page:           page,
		PageSize:       pageSize,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	resp := make([]ReleaseTemplateResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toReleaseTemplateResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      resolvedPage(page),
		"page_size": resolvedPageSize(pageSize),
		"total":     total,
	})
}

func (h *ReleaseTemplateHandler) GetByID(c *gin.Context) {
	template, bindings, params, gitopsRules, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !h.ensureTemplateAccess(c, template) {
		return
	}
	c.JSON(http.StatusOK, toReleaseTemplateDataResponse(template, bindings, params, gitopsRules))
}

func (h *ReleaseTemplateHandler) Update(c *gin.Context) {
	template, _, _, _, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensurePermission(c, h.authz, "release.template.manage", "", "") {
		return
	}
	var req UpdateReleaseTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	updated, bindings, params, gitopsRules, err := h.manager.Update(c.Request.Context(), template.ID, usecase.UpdateReleaseTemplateInput{
		Name:           req.Name,
		CIBindingID:    req.CIBindingID,
		CDBindingID:    req.CDBindingID,
		CDProvider:     pipelinedomain.Provider(strings.ToLower(strings.TrimSpace(req.CDProvider))),
		GitOpsType:     releasedomain.GitOpsType(strings.ToLower(strings.TrimSpace(req.GitOpsType))),
		Status:         releasedomain.TemplateStatus(strings.TrimSpace(req.Status)),
		Remark:         req.Remark,
		CIParamDefIDs:  req.CIParamDefIDs,
		CDParamDefIDs:  req.CDParamDefIDs,
		CIParamConfigs: toReleaseTemplateParamConfigInputs(req.CIParamConfigs),
		CDParamConfigs: toReleaseTemplateParamConfigInputs(req.CDParamConfigs),
		GitOpsRules:    toReleaseTemplateGitOpsRuleInputs(req.GitOpsRules),
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, toReleaseTemplateDataResponse(updated, bindings, params, gitopsRules))
}

func (h *ReleaseTemplateHandler) Delete(c *gin.Context) {
	if !ensurePermission(c, h.authz, "release.template.manage", "", "") {
		return
	}
	if err := h.manager.Delete(c.Request.Context(), c.Param("id")); err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *ReleaseTemplateHandler) resolveListApplications(c *gin.Context) (allowAll bool, applicationIDs []string, ok bool) {
	user, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false, nil, false
	}
	if user.Role == userdomain.RoleAdmin {
		return true, nil, true
	}
	if h.authz == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
		return false, nil, false
	}
	manageAllowed, err := h.authz.HasPermission(c.Request.Context(), user, "release.template.manage", "", "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return false, nil, false
	}
	if manageAllowed {
		return true, nil, true
	}
	applicationID := strings.TrimSpace(c.Query("application_id"))
	if applicationID != "" {
		allowed, err := h.authz.HasPermission(c.Request.Context(), user, "release.create", "application", applicationID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return false, nil, false
		}
		if !allowed {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: permission denied"})
			return false, nil, false
		}
		return false, nil, true
	}

	items, err := h.authz.ListEffectivePermissions(c.Request.Context(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return false, nil, false
	}

	seen := make(map[string]struct{})
	result := make([]string, 0)
	for _, item := range items {
		if !item.Enabled || strings.ToLower(strings.TrimSpace(item.PermissionCode)) != "release.create" {
			continue
		}
		if strings.ToLower(strings.TrimSpace(item.ScopeType)) != "application" {
			continue
		}
		value := strings.TrimSpace(item.ScopeValue)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	sort.Strings(result)
	return false, result, true
}

func (h *ReleaseTemplateHandler) ensureTemplateAccess(c *gin.Context, template releasedomain.ReleaseTemplate) bool {
	user, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false
	}
	if user.Role == userdomain.RoleAdmin {
		return true
	}
	manageAllowed, err := h.authz.HasPermission(c.Request.Context(), user, "release.template.manage", "", "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return false
	}
	if manageAllowed {
		return true
	}
	createAllowed, err := h.authz.HasPermission(c.Request.Context(), user, "release.create", "application", template.ApplicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return false
	}
	if !createAllowed {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: permission denied"})
		return false
	}
	return true
}

func resolveReleaseTemplateListFilterApplications(
	applicationID string,
	allowAll bool,
	visibleApplicationIDs []string,
) []string {
	if allowAll || strings.TrimSpace(applicationID) != "" {
		return nil
	}
	if len(visibleApplicationIDs) == 0 {
		return []string{}
	}
	result := make([]string, 0, len(visibleApplicationIDs))
	for _, item := range visibleApplicationIDs {
		value := strings.TrimSpace(item)
		if value == "" {
			continue
		}
		result = append(result, value)
	}
	return result
}

func toReleaseTemplateResponse(item releasedomain.ReleaseTemplate) ReleaseTemplateResponse {
	return ReleaseTemplateResponse{
		ID:              item.ID,
		Name:            item.Name,
		ApplicationID:   item.ApplicationID,
		ApplicationName: item.ApplicationName,
		BindingID:       item.BindingID,
		BindingName:     item.BindingName,
		BindingType:     item.BindingType,
		GitOpsType:      string(item.GitOpsType),
		Status:          string(item.Status),
		Remark:          item.Remark,
		ParamCount:      item.ParamCount,
		CreatedAt:       item.CreatedAt,
		UpdatedAt:       item.UpdatedAt,
	}
}

func toReleaseTemplateParamResponse(item releasedomain.ReleaseTemplateParam) ReleaseTemplateParamResponse {
	return ReleaseTemplateParamResponse{
		ID:                 item.ID,
		TemplateID:         item.TemplateID,
		TemplateBindingID:  item.TemplateBindingID,
		PipelineScope:      string(item.PipelineScope),
		BindingID:          item.BindingID,
		ExecutorParamDefID: item.ExecutorParamDefID,
		ParamKey:           item.ParamKey,
		ParamName:          item.ParamName,
		ExecutorParamName:  item.ExecutorParamName,
		ValueSource:        string(item.ValueSource),
		SourceParamKey:     item.SourceParamKey,
		SourceParamName:    item.SourceParamName,
		FixedValue:         item.FixedValue,
		Required:           item.Required,
		SortNo:             item.SortNo,
		CreatedAt:          item.CreatedAt,
		UpdatedAt:          item.UpdatedAt,
	}
}

func toReleaseTemplateBindingResponse(item releasedomain.ReleaseTemplateBinding) ReleaseTemplateBindingResponse {
	return ReleaseTemplateBindingResponse{
		ID:            item.ID,
		TemplateID:    item.TemplateID,
		PipelineScope: string(item.PipelineScope),
		BindingID:     item.BindingID,
		BindingName:   item.BindingName,
		Provider:      item.Provider,
		PipelineID:    item.PipelineID,
		Enabled:       item.Enabled,
		SortNo:        item.SortNo,
		CreatedAt:     item.CreatedAt,
		UpdatedAt:     item.UpdatedAt,
	}
}

func toReleaseTemplateGitOpsRuleInputs(items []ReleaseTemplateGitOpsRuleRequest) []usecase.ReleaseTemplateGitOpsRuleInput {
	result := make([]usecase.ReleaseTemplateGitOpsRuleInput, 0, len(items))
	for _, item := range items {
		result = append(result, usecase.ReleaseTemplateGitOpsRuleInput{
			SourceParamKey:   item.SourceParamKey,
			SourceFrom:       releasedomain.GitOpsRuleSourceFrom(strings.ToLower(strings.TrimSpace(item.SourceFrom))),
			LocatorParamKey:  item.LocatorParamKey,
			FilePathTemplate: item.FilePathTemplate,
			DocumentKind:     item.DocumentKind,
			DocumentName:     item.DocumentName,
			TargetPath:       item.TargetPath,
			ValueTemplate:    item.ValueTemplate,
		})
	}
	return result
}

func toReleaseTemplateParamConfigInputs(items []ReleaseTemplateParamConfigRequest) []usecase.ReleaseTemplateParamConfigInput {
	result := make([]usecase.ReleaseTemplateParamConfigInput, 0, len(items))
	for _, item := range items {
		result = append(result, usecase.ReleaseTemplateParamConfigInput{
			ExecutorParamDefID: item.ExecutorParamDefID,
			ValueSource:        releasedomain.TemplateParamValueSource(strings.ToLower(strings.TrimSpace(item.ValueSource))),
			SourceParamKey:     item.SourceParamKey,
			FixedValue:         item.FixedValue,
		})
	}
	return result
}

func toReleaseTemplateGitOpsRuleResponse(item releasedomain.ReleaseTemplateGitOpsRule) ReleaseTemplateGitOpsRuleResponse {
	return ReleaseTemplateGitOpsRuleResponse{
		ID:               item.ID,
		TemplateID:       item.TemplateID,
		PipelineScope:    string(item.PipelineScope),
		SourceParamKey:   item.SourceParamKey,
		SourceParamName:  item.SourceParamName,
		SourceFrom:       string(item.SourceFrom),
		LocatorParamKey:  item.LocatorParamKey,
		LocatorParamName: item.LocatorParamName,
		FilePathTemplate: item.FilePathTemplate,
		DocumentKind:     item.DocumentKind,
		DocumentName:     item.DocumentName,
		TargetPath:       item.TargetPath,
		ValueTemplate:    item.ValueTemplate,
		SortNo:           item.SortNo,
		CreatedAt:        item.CreatedAt,
		UpdatedAt:        item.UpdatedAt,
	}
}

func toReleaseTemplateDataResponse(
	template releasedomain.ReleaseTemplate,
	bindings []releasedomain.ReleaseTemplateBinding,
	params []releasedomain.ReleaseTemplateParam,
	gitopsRules []releasedomain.ReleaseTemplateGitOpsRule,
) ReleaseTemplateDataResponse {
	resp := ReleaseTemplateDataResponse{}
	resp.Data.Template = toReleaseTemplateResponse(template)
	resp.Data.Bindings = make([]ReleaseTemplateBindingResponse, 0, len(bindings))
	for _, item := range bindings {
		resp.Data.Bindings = append(resp.Data.Bindings, toReleaseTemplateBindingResponse(item))
	}
	resp.Data.Params = make([]ReleaseTemplateParamResponse, 0, len(params))
	for _, item := range params {
		resp.Data.Params = append(resp.Data.Params, toReleaseTemplateParamResponse(item))
	}
	resp.Data.GitOpsRules = make([]ReleaseTemplateGitOpsRuleResponse, 0, len(gitopsRules))
	for _, item := range gitopsRules {
		resp.Data.GitOpsRules = append(resp.Data.GitOpsRules, toReleaseTemplateGitOpsRuleResponse(item))
	}
	return resp
}
