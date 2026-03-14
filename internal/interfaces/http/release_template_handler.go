package httpapi

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
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
	Name          string   `json:"name"`
	ApplicationID string   `json:"application_id"`
	BindingID     string   `json:"binding_id"`
	Status        string   `json:"status"`
	Remark        string   `json:"remark"`
	ParamDefIDs   []string `json:"param_def_ids"`
}

type UpdateReleaseTemplateRequest struct {
	Name        string   `json:"name"`
	Status      string   `json:"status"`
	Remark      string   `json:"remark"`
	ParamDefIDs []string `json:"param_def_ids"`
}

type ReleaseTemplateResponse struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	ApplicationID   string    `json:"application_id"`
	ApplicationName string    `json:"application_name"`
	BindingID       string    `json:"binding_id"`
	BindingName     string    `json:"binding_name"`
	BindingType     string    `json:"binding_type"`
	Status          string    `json:"status"`
	Remark          string    `json:"remark"`
	ParamCount      int       `json:"param_count"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type ReleaseTemplateParamResponse struct {
	ID                 string    `json:"id"`
	TemplateID         string    `json:"template_id"`
	PipelineParamDefID string    `json:"pipeline_param_def_id"`
	ParamKey           string    `json:"param_key"`
	ParamName          string    `json:"param_name"`
	ExecutorParamName  string    `json:"executor_param_name"`
	Required           bool      `json:"required"`
	SortNo             int       `json:"sort_no"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type ReleaseTemplateDataResponse struct {
	Data struct {
		Template ReleaseTemplateResponse        `json:"template"`
		Params   []ReleaseTemplateParamResponse `json:"params"`
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

	template, params, err := h.manager.Create(c.Request.Context(), usecase.CreateReleaseTemplateInput{
		Name:          req.Name,
		ApplicationID: req.ApplicationID,
		BindingID:     req.BindingID,
		Status:        releasedomain.TemplateStatus(strings.TrimSpace(req.Status)),
		Remark:        req.Remark,
		ParamDefIDs:   req.ParamDefIDs,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.JSON(http.StatusCreated, toReleaseTemplateDataResponse(template, params))
}

func (h *ReleaseTemplateHandler) List(c *gin.Context) {
	if !h.ensureListPermission(c) {
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
		ApplicationID: c.Query("application_id"),
		BindingID:     c.Query("binding_id"),
		Status:        releasedomain.TemplateStatus(strings.TrimSpace(c.Query("status"))),
		Page:          page,
		PageSize:      pageSize,
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
	template, params, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !h.ensureTemplateAccess(c, template) {
		return
	}
	c.JSON(http.StatusOK, toReleaseTemplateDataResponse(template, params))
}

func (h *ReleaseTemplateHandler) Update(c *gin.Context) {
	template, _, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
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
	updated, params, err := h.manager.Update(c.Request.Context(), template.ID, usecase.UpdateReleaseTemplateInput{
		Name:        req.Name,
		Status:      releasedomain.TemplateStatus(strings.TrimSpace(req.Status)),
		Remark:      req.Remark,
		ParamDefIDs: req.ParamDefIDs,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, toReleaseTemplateDataResponse(updated, params))
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

func (h *ReleaseTemplateHandler) ensureListPermission(c *gin.Context) bool {
	user, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false
	}
	if user.Role == userdomain.RoleAdmin {
		return true
	}
	if h.authz == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
		return false
	}
	manageAllowed, err := h.authz.HasPermission(c.Request.Context(), user, "release.template.manage", "", "")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return false
	}
	if manageAllowed {
		return true
	}
	applicationID := strings.TrimSpace(c.Query("application_id"))
	if applicationID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: permission denied"})
		return false
	}
	allowed, err := h.authz.HasPermission(c.Request.Context(), user, "release.create", "application", applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return false
	}
	if !allowed {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: permission denied"})
		return false
	}
	return true
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

func toReleaseTemplateResponse(item releasedomain.ReleaseTemplate) ReleaseTemplateResponse {
	return ReleaseTemplateResponse{
		ID:              item.ID,
		Name:            item.Name,
		ApplicationID:   item.ApplicationID,
		ApplicationName: item.ApplicationName,
		BindingID:       item.BindingID,
		BindingName:     item.BindingName,
		BindingType:     item.BindingType,
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
		PipelineParamDefID: item.PipelineParamDefID,
		ParamKey:           item.ParamKey,
		ParamName:          item.ParamName,
		ExecutorParamName:  item.ExecutorParamName,
		Required:           item.Required,
		SortNo:             item.SortNo,
		CreatedAt:          item.CreatedAt,
		UpdatedAt:          item.UpdatedAt,
	}
}

func toReleaseTemplateDataResponse(
	template releasedomain.ReleaseTemplate,
	params []releasedomain.ReleaseTemplateParam,
) ReleaseTemplateDataResponse {
	resp := ReleaseTemplateDataResponse{}
	resp.Data.Template = toReleaseTemplateResponse(template)
	resp.Data.Params = make([]ReleaseTemplateParamResponse, 0, len(params))
	for _, item := range params {
		resp.Data.Params = append(resp.Data.Params, toReleaseTemplateParamResponse(item))
	}
	return resp
}
