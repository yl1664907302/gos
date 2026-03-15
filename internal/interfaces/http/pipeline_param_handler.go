package httpapi

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	appdomain "gos/internal/domain/application"
	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/pipelineparam"
	platformparamdomain "gos/internal/domain/platformparam"
	userdomain "gos/internal/domain/user"
)

type PipelineParamHandler struct {
	manager *usecase.PipelineParamDefManager
	syncer  *usecase.SyncPipelineParamDefs
	authz   RequestAuthorizer
	access  PipelineParamAccessResolver
}

type PipelineParamAccessResolver interface {
	ResolveParamAccess(
		ctx context.Context,
		user userdomain.User,
		applicationID string,
		paramKey string,
	) (canView bool, canEdit bool, err error)
}

func NewPipelineParamHandler(
	manager *usecase.PipelineParamDefManager,
	syncer *usecase.SyncPipelineParamDefs,
	authz RequestAuthorizer,
	access PipelineParamAccessResolver,
) *PipelineParamHandler {
	return &PipelineParamHandler{
		manager: manager,
		syncer:  syncer,
		authz:   authz,
		access:  access,
	}
}

func (h *PipelineParamHandler) RegisterRoutes(router gin.IRouter) {
	router.GET("/applications/:id/pipeline-param-defs", h.ListByApplication)
	router.GET("/pipelines/:id/param-defs", h.ListByPipeline)
	router.GET("/pipeline-param-defs/:id", h.GetByID)
	router.PUT("/pipeline-param-defs/:id", h.Update)
	router.POST("/jenkins/pipeline-param-defs/sync", h.Sync)
}

type UpdatePipelineParamDefRequest struct {
	ParamKey string `json:"param_key"`
}

type PipelineParamDefResponse struct {
	ID                string    `json:"id"`
	PipelineID        string    `json:"pipeline_id"`
	ExecutorType      string    `json:"executor_type"`
	ExecutorParamName string    `json:"executor_param_name"`
	ParamKey          string    `json:"param_key"`
	ParamType         string    `json:"param_type"`
	SingleSelect      bool      `json:"single_select"`
	Required          bool      `json:"required"`
	DefaultValue      string    `json:"default_value"`
	Description       string    `json:"description"`
	Visible           bool      `json:"visible"`
	Editable          bool      `json:"editable"`
	SourceFrom        string    `json:"source_from"`
	Status            string    `json:"status"`
	RawMeta           string    `json:"raw_meta"`
	SortNo            int       `json:"sort_no"`
	CanView           bool      `json:"can_view"`
	CanEdit           bool      `json:"can_edit"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type PipelineParamDefDataResponse struct {
	Data PipelineParamDefResponse `json:"data"`
}

type PipelineParamDefListResponse struct {
	Data     []PipelineParamDefResponse `json:"data"`
	Page     int                        `json:"page"`
	PageSize int                        `json:"page_size"`
	Total    int64                      `json:"total"`
}

type SyncPipelineParamDefsResponse struct {
	Data usecase.SyncPipelineParamDefsOutput `json:"data"`
}

// ListByApplication godoc
// @Summary      List bound Jenkins pipeline param definitions by application
// @Tags         pipeline-param-defs
// @Produce      json
// @Param        id            path      string  true   "Application ID"
// @Param        binding_type  query     string  false  "Binding type, default ci"
// @Param        visible       query     bool    false  "Visible flag"
// @Param        editable      query     bool    false  "Editable flag"
// @Param        param_key     query     string  false  "Mapped platform param key"
// @Param        page          query     int     false  "Page number"
// @Param        page_size     query     int     false  "Page size"
// @Success      200  {object}  PipelineParamDefListResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /applications/{id}/pipeline-param-defs [get]
func (h *PipelineParamHandler) ListByApplication(c *gin.Context) {
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
	visible, err := parseOptionalBool(c, "visible")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	editable, err := parseOptionalBool(c, "editable")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	items, total, err := h.manager.ListByApplication(
		c.Request.Context(),
		c.Param("id"),
		pipelinedomain.BindingType(strings.TrimSpace(c.Query("binding_type"))),
		domain.ListFilter{
			Visible:  visible,
			Editable: editable,
			ParamKey: c.Query("param_key"),
			Status:   domain.Status(strings.TrimSpace(c.Query("status"))),
			Page:     page,
			PageSize: pageSize,
		},
	)
	if err != nil {
		writePipelineParamHTTPError(c, err)
		return
	}

	currentUser, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	manageAll := false
	hasReleaseCreate := false
	if currentUser.Role != userdomain.RoleAdmin {
		if h.authz == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
			return
		}
		allowed, authErr := h.authz.HasPermission(c.Request.Context(), currentUser, "pipeline_param.manage", "", "")
		if authErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		manageAll = allowed

		createAllowed, createErr := h.authz.HasPermission(
			c.Request.Context(),
			currentUser,
			"release.create",
			"application",
			c.Param("id"),
		)
		if createErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		hasReleaseCreate = createAllowed
		if !manageAll && !hasReleaseCreate {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: permission denied"})
			return
		}
	}

	resp := make([]PipelineParamDefResponse, 0, len(items))
	for _, item := range items {
		entry := toPipelineParamResponse(item)
		if currentUser.Role == userdomain.RoleAdmin || manageAll {
			entry.CanView = true
			entry.CanEdit = true
			resp = append(resp, entry)
			continue
		}
		if h.access == nil {
			if hasReleaseCreate && strings.TrimSpace(item.ParamKey) != "" {
				entry.CanView = true
				entry.CanEdit = true
				resp = append(resp, entry)
			}
			continue
		}
		canView, canEdit, accessErr := h.access.ResolveParamAccess(
			c.Request.Context(),
			currentUser,
			c.Param("id"),
			item.ParamKey,
		)
		if accessErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		if hasReleaseCreate && strings.TrimSpace(item.ParamKey) != "" {
			entry.CanView = true
			entry.CanEdit = true
			resp = append(resp, entry)
			continue
		}
		if !canView {
			continue
		}
		entry.CanView = canView
		entry.CanEdit = canEdit
		resp = append(resp, entry)
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      resolvedPage(page),
		"page_size": resolvedPageSize(pageSize),
		"total":     total,
	})
}

// ListByPipeline godoc
// @Summary      List pipeline param definitions
// @Tags         pipeline-param-defs
// @Produce      json
// @Param        id             path      string  true   "Pipeline ID"
// @Param        executor_type  query     string  false  "Executor type"
// @Param        visible        query     bool    false  "Visible flag"
// @Param        editable       query     bool    false  "Editable flag"
// @Param        param_key      query     string  false  "Mapped platform param key"
// @Param        page           query     int     false  "Page number"
// @Param        page_size      query     int     false  "Page size"
// @Success      200  {object}  PipelineParamDefListResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /pipelines/{id}/param-defs [get]
func (h *PipelineParamHandler) ListByPipeline(c *gin.Context) {
	if !ensurePermission(c, h.authz, "pipeline_param.manage", "", "") {
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
	visible, err := parseOptionalBool(c, "visible")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	editable, err := parseOptionalBool(c, "editable")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	items, total, err := h.manager.ListByPipeline(c.Request.Context(), domain.ListFilter{
		PipelineID:   c.Param("id"),
		ExecutorType: domain.ExecutorType(strings.TrimSpace(c.Query("executor_type"))),
		Visible:      visible,
		Editable:     editable,
		ParamKey:     c.Query("param_key"),
		Status:       domain.Status(strings.TrimSpace(c.Query("status"))),
		Page:         page,
		PageSize:     pageSize,
	})
	if err != nil {
		writePipelineParamHTTPError(c, err)
		return
	}

	resp := make([]PipelineParamDefResponse, 0, len(items))
	for _, item := range items {
		entry := toPipelineParamResponse(item)
		entry.CanView = entry.Visible
		entry.CanEdit = entry.Editable
		resp = append(resp, entry)
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      resolvedPage(page),
		"page_size": resolvedPageSize(pageSize),
		"total":     total,
	})
}

// GetByID godoc
// @Summary      Get pipeline param definition by ID
// @Tags         pipeline-param-defs
// @Produce      json
// @Param        id   path      string  true  "Pipeline param definition ID"
// @Success      200  {object}  PipelineParamDefDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /pipeline-param-defs/{id} [get]
func (h *PipelineParamHandler) GetByID(c *gin.Context) {
	if !ensurePermission(c, h.authz, "pipeline_param.manage", "", "") {
		return
	}
	item, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writePipelineParamHTTPError(c, err)
		return
	}
	resp := toPipelineParamResponse(item)
	resp.CanView = resp.Visible
	resp.CanEdit = resp.Editable
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

// Update godoc
// @Summary      Update pipeline param definition mapping
// @Tags         pipeline-param-defs
// @Accept       json
// @Produce      json
// @Param        id       path      string                         true  "Pipeline param definition ID"
// @Param        request  body      UpdatePipelineParamDefRequest  true  "Update pipeline param definition request"
// @Success      200      {object}  PipelineParamDefDataResponse
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /pipeline-param-defs/{id} [put]
func (h *PipelineParamHandler) Update(c *gin.Context) {
	if !ensurePermission(c, h.authz, "pipeline_param.manage", "", "") {
		return
	}
	var req UpdatePipelineParamDefRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	item, err := h.manager.UpdateParamKey(c.Request.Context(), c.Param("id"), req.ParamKey)
	if err != nil {
		writePipelineParamHTTPError(c, err)
		return
	}
	resp := toPipelineParamResponse(item)
	resp.CanView = resp.Visible
	resp.CanEdit = resp.Editable
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

// Sync godoc
// @Summary      Sync pipeline param definitions from Jenkins
// @Tags         pipeline-param-defs
// @Produce      json
// @Success      200  {object}  SyncPipelineParamDefsResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /jenkins/pipeline-param-defs/sync [post]
func (h *PipelineParamHandler) Sync(c *gin.Context) {
	if !ensurePermission(c, h.authz, "pipeline_param.manage", "", "") {
		return
	}
	result, err := h.syncer.Execute(c.Request.Context())
	if err != nil {
		writePipelineParamHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func toPipelineParamResponse(item domain.PipelineParamDef) PipelineParamDefResponse {
	return PipelineParamDefResponse{
		ID:                item.ID,
		PipelineID:        item.PipelineID,
		ExecutorType:      string(item.ExecutorType),
		ExecutorParamName: item.ExecutorParamName,
		ParamKey:          item.ParamKey,
		ParamType:         string(item.ParamType),
		SingleSelect:      item.SingleSelect,
		Required:          item.Required,
		DefaultValue:      item.DefaultValue,
		Description:       item.Description,
		Visible:           item.Visible,
		Editable:          item.Editable,
		SourceFrom:        string(item.SourceFrom),
		Status:            string(item.Status),
		RawMeta:           item.RawMeta,
		SortNo:            item.SortNo,
		CanView:           item.Visible,
		CanEdit:           item.Editable,
		CreatedAt:         item.CreatedAt,
		UpdatedAt:         item.UpdatedAt,
	}
}

func writePipelineParamHTTPError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput),
		errors.Is(err, usecase.ErrInvalidID),
		errors.Is(err, usecase.ErrInvalidStatus),
		errors.Is(err, usecase.ErrInvalidParamKey),
		errors.Is(err, usecase.ErrInvalidExecutorType),
		errors.Is(err, usecase.ErrInvalidBindingType):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, appdomain.ErrNotFound),
		errors.Is(err, pipelinedomain.ErrPipelineNotFound),
		errors.Is(err, pipelinedomain.ErrBindingNotFound),
		errors.Is(err, domain.ErrNotFound),
		errors.Is(err, platformparamdomain.ErrNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}

func parseOptionalBool(c *gin.Context, name string) (*bool, error) {
	raw := strings.TrimSpace(c.Query(name))
	if raw == "" {
		return nil, nil
	}
	value, err := strconv.ParseBool(raw)
	if err != nil {
		return nil, errors.New(name + " must be a boolean")
	}
	return &value, nil
}
