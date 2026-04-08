package httpapi

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	projectdomain "gos/internal/domain/project"
)

type ProjectHandler struct {
	manager *usecase.ProjectManager
	authz   RequestAuthorizer
}

func NewProjectHandler(manager *usecase.ProjectManager, authz RequestAuthorizer) *ProjectHandler {
	return &ProjectHandler{manager: manager, authz: authz}
}

func (h *ProjectHandler) RegisterRoutes(router gin.IRouter) {
	router.GET("/projects", h.List)
	router.GET("/projects/:id", h.GetByID)
	router.POST("/projects", h.Create)
	router.PUT("/projects/:id", h.Update)
	router.DELETE("/projects/:id", h.Delete)
}

type ProjectRequest struct {
	Name        string `json:"name"`
	Key         string `json:"key"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

type ProjectResponse struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Key         string    `json:"key"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (h *ProjectHandler) Create(c *gin.Context) {
	if !ensurePermission(c, h.authz, "application.manage", "", "") {
		return
	}
	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	item, err := h.manager.Create(c.Request.Context(), usecase.CreateProjectInput{
		Name:        req.Name,
		Key:         req.Key,
		Description: req.Description,
		Status:      projectdomain.Status(strings.TrimSpace(req.Status)),
	})
	if err != nil {
		writeProjectHTTPError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": toProjectResponse(item)})
}

func (h *ProjectHandler) GetByID(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "application.view", "application.manage") {
		return
	}
	item, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeProjectHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toProjectResponse(item)})
}

func (h *ProjectHandler) List(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "application.view", "application.manage") {
		return
	}
	page, err := strconv.Atoi(strings.TrimSpace(c.DefaultQuery("page", "1")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page"})
		return
	}
	pageSize, err := strconv.Atoi(strings.TrimSpace(c.DefaultQuery("page_size", "20")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page_size"})
		return
	}
	items, total, err := h.manager.List(c.Request.Context(), projectdomain.ListFilter{
		Key:      c.Query("key"),
		Name:     c.Query("name"),
		Status:   projectdomain.Status(strings.TrimSpace(c.Query("status"))),
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		writeProjectHTTPError(c, err)
		return
	}
	resp := make([]ProjectResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toProjectResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      page,
		"page_size": pageSize,
		"total":     total,
	})
}

func (h *ProjectHandler) Update(c *gin.Context) {
	if !ensurePermission(c, h.authz, "application.manage", "", "") {
		return
	}
	var req ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	item, err := h.manager.Update(c.Request.Context(), c.Param("id"), projectdomain.UpdateInput{
		Name:        req.Name,
		Key:         req.Key,
		Description: req.Description,
		Status:      projectdomain.Status(strings.TrimSpace(req.Status)),
	})
	if err != nil {
		writeProjectHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toProjectResponse(item)})
}

func (h *ProjectHandler) Delete(c *gin.Context) {
	if !ensurePermission(c, h.authz, "application.manage", "", "") {
		return
	}
	if err := h.manager.Delete(c.Request.Context(), c.Param("id")); err != nil {
		writeProjectHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": true})
}

func toProjectResponse(item projectdomain.Project) ProjectResponse {
	return ProjectResponse{
		ID:          item.ID,
		Name:        item.Name,
		Key:         item.Key,
		Description: item.Description,
		Status:      string(item.Status),
		CreatedAt:   item.CreatedAt,
		UpdatedAt:   item.UpdatedAt,
	}
}

func writeProjectHTTPError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput), errors.Is(err, usecase.ErrInvalidID), errors.Is(err, usecase.ErrInvalidStatus):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, projectdomain.ErrNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	case errors.Is(err, projectdomain.ErrKeyDuplicated), errors.Is(err, projectdomain.ErrInUse):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}
