package httpapi

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	domain "gos/internal/domain/argocdapp"
)

type ArgoCDHandler struct {
	syncer *usecase.SyncArgoCDApplications
	query  *usecase.QueryArgoCDApplications
	authz  RequestAuthorizer
}

func NewArgoCDHandler(
	syncer *usecase.SyncArgoCDApplications,
	query *usecase.QueryArgoCDApplications,
	authz RequestAuthorizer,
) *ArgoCDHandler {
	return &ArgoCDHandler{syncer: syncer, query: query, authz: authz}
}

func (h *ArgoCDHandler) RegisterRoutes(router gin.IRouter) {
	router.GET("/argocd/applications", h.ListApplications)
	router.GET("/argocd/applications/:id", h.GetApplicationByID)
	router.POST("/argocd/applications/sync", h.SyncApplications)
	router.GET("/argocd/applications/:id/original-link", h.GetOriginalLink)
}

type ArgoCDApplicationResponse struct {
	ID             string    `json:"id"`
	AppName        string    `json:"app_name"`
	Project        string    `json:"project"`
	RepoURL        string    `json:"repo_url"`
	SourcePath     string    `json:"source_path"`
	TargetRevision string    `json:"target_revision"`
	DestServer     string    `json:"dest_server"`
	DestNamespace  string    `json:"dest_namespace"`
	SyncStatus     string    `json:"sync_status"`
	HealthStatus   string    `json:"health_status"`
	OperationPhase string    `json:"operation_phase"`
	ArgoCDURL      string    `json:"argocd_url"`
	Status         string    `json:"status"`
	RawMeta        string    `json:"raw_meta"`
	LastSyncedAt   time.Time `json:"last_synced_at"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ArgoCDApplicationDataResponse struct {
	Data ArgoCDApplicationResponse `json:"data"`
}

type ArgoCDApplicationListResponse struct {
	Data     []ArgoCDApplicationResponse `json:"data"`
	Page     int                         `json:"page"`
	PageSize int                         `json:"page_size"`
	Total    int64                       `json:"total"`
}

type ArgoCDApplicationSyncResponse struct {
	Data usecase.SyncArgoCDApplicationsOutput `json:"data"`
}

type ArgoCDOriginalLinkDataResponse struct {
	Data struct {
		Application  ArgoCDApplicationResponse `json:"application"`
		OriginalLink string                    `json:"original_link"`
	} `json:"data"`
}

// ListApplications godoc
// @Summary      List ArgoCD applications
// @Tags         argocd
// @Produce      json
// @Param        app_name       query     string  false  "Application name"
// @Param        project        query     string  false  "ArgoCD project"
// @Param        sync_status    query     string  false  "Sync status"
// @Param        health_status  query     string  false  "Health status"
// @Param        status         query     string  false  "Record status"
// @Param        page           query     int     false  "Page number"
// @Param        page_size      query     int     false  "Page size"
// @Success      200  {object}  ArgoCDApplicationListResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /argocd/applications [get]
func (h *ArgoCDHandler) ListApplications(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "component.argocd.view", "component.argocd.manage") {
		return
	}
	if h.query == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "argocd manager is not configured"})
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
	items, total, err := h.query.List(c.Request.Context(), domain.ListFilter{
		AppName:      c.Query("app_name"),
		Project:      c.Query("project"),
		SyncStatus:   c.Query("sync_status"),
		HealthStatus: c.Query("health_status"),
		Status:       domain.Status(strings.TrimSpace(c.Query("status"))),
		Page:         page,
		PageSize:     pageSize,
	})
	if err != nil {
		writeArgoCDHTTPError(c, err)
		return
	}
	resp := make([]ArgoCDApplicationResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toArgoCDApplicationResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      resolvedPage(page),
		"page_size": resolvedPageSize(pageSize),
		"total":     total,
	})
}

// GetApplicationByID godoc
// @Summary      Get ArgoCD application detail
// @Tags         argocd
// @Produce      json
// @Param        id   path      string  true  "Application ID"
// @Success      200  {object}  ArgoCDApplicationDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /argocd/applications/{id} [get]
func (h *ArgoCDHandler) GetApplicationByID(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "component.argocd.view", "component.argocd.manage") {
		return
	}
	if h.query == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "argocd manager is not configured"})
		return
	}
	item, err := h.query.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeArgoCDHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toArgoCDApplicationResponse(item)})
}

// SyncApplications godoc
// @Summary      Sync ArgoCD applications metadata
// @Tags         argocd
// @Produce      json
// @Success      200  {object}  ArgoCDApplicationSyncResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /argocd/applications/sync [post]
func (h *ArgoCDHandler) SyncApplications(c *gin.Context) {
	if !ensurePermission(c, h.authz, "component.argocd.manage", "", "") {
		return
	}
	if h.syncer == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "argocd manager is not configured"})
		return
	}
	result, err := h.syncer.Execute(c.Request.Context())
	if err != nil {
		writeArgoCDHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

// GetOriginalLink godoc
// @Summary      Get ArgoCD application original link
// @Tags         argocd
// @Produce      json
// @Param        id   path      string  true  "Application ID"
// @Success      200  {object}  ArgoCDOriginalLinkDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /argocd/applications/{id}/original-link [get]
func (h *ArgoCDHandler) GetOriginalLink(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "component.argocd.view", "component.argocd.manage") {
		return
	}
	if h.query == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "argocd manager is not configured"})
		return
	}
	item, err := h.query.GetOriginalLink(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeArgoCDHTTPError(c, err)
		return
	}
	resp := ArgoCDOriginalLinkDataResponse{}
	resp.Data.Application = toArgoCDApplicationResponse(item.Application)
	resp.Data.OriginalLink = item.OriginalLink
	c.JSON(http.StatusOK, resp)
}

func toArgoCDApplicationResponse(item domain.Application) ArgoCDApplicationResponse {
	return ArgoCDApplicationResponse{
		ID:             item.ID,
		AppName:        item.AppName,
		Project:        item.Project,
		RepoURL:        item.RepoURL,
		SourcePath:     item.SourcePath,
		TargetRevision: item.TargetRevision,
		DestServer:     item.DestServer,
		DestNamespace:  item.DestNamespace,
		SyncStatus:     item.SyncStatus,
		HealthStatus:   item.HealthStatus,
		OperationPhase: item.OperationPhase,
		ArgoCDURL:      item.ArgoCDURL,
		Status:         string(item.Status),
		RawMeta:        item.RawMeta,
		LastSyncedAt:   item.LastSyncedAt,
		CreatedAt:      item.CreatedAt,
		UpdatedAt:      item.UpdatedAt,
	}
}

func writeArgoCDHTTPError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput), errors.Is(err, usecase.ErrInvalidID), errors.Is(err, usecase.ErrInvalidStatus):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, domain.ErrNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}
