package httpapi

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	domain "gos/internal/domain/application"
)

type ApplicationHandler struct {
	creator *usecase.CreateApplication
	query   *usecase.QueryApplication
	updater *usecase.UpdateApplication
	deleter *usecase.DeleteApplication
}

func NewApplicationHandler(
	creator *usecase.CreateApplication,
	query *usecase.QueryApplication,
	updater *usecase.UpdateApplication,
	deleter *usecase.DeleteApplication,
) *ApplicationHandler {
	return &ApplicationHandler{
		creator: creator,
		query:   query,
		updater: updater,
		deleter: deleter,
	}
}

func (h *ApplicationHandler) RegisterRoutes(router gin.IRouter) {
	router.POST("/applications", h.Create)
	router.GET("/applications/:id", h.GetByID)
	router.GET("/applications", h.List)
	router.PUT("/applications/:id", h.Update)
	router.DELETE("/applications/:id", h.Delete)
}

type createApplicationRequest struct {
	Name         string        `json:"name"`
	Key          string        `json:"key"`
	RepoURL      string        `json:"repo_url"`
	Description  string        `json:"description"`
	Owner        string        `json:"owner"`
	Status       domain.Status `json:"status"`
	ArtifactType string        `json:"artifact_type"`
	Language     string        `json:"language"`
}

type updateApplicationRequest struct {
	Name         string        `json:"name"`
	Key          string        `json:"key"`
	RepoURL      string        `json:"repo_url"`
	Description  string        `json:"description"`
	Owner        string        `json:"owner"`
	Status       domain.Status `json:"status"`
	ArtifactType string        `json:"artifact_type"`
	Language     string        `json:"language"`
}

type applicationResponse struct {
	ID           string        `json:"id"`
	Name         string        `json:"name"`
	Key          string        `json:"key"`
	RepoURL      string        `json:"repo_url"`
	Description  string        `json:"description"`
	Owner        string        `json:"owner"`
	Status       domain.Status `json:"status"`
	ArtifactType string        `json:"artifact_type"`
	Language     string        `json:"language"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
}

func (h *ApplicationHandler) Create(c *gin.Context) {
	var req createApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	app, err := h.creator.Execute(c.Request.Context(), usecase.CreateInput{
		Name:         req.Name,
		Key:          req.Key,
		RepoURL:      req.RepoURL,
		Description:  req.Description,
		Owner:        req.Owner,
		Status:       req.Status,
		ArtifactType: req.ArtifactType,
		Language:     req.Language,
	})
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": toResponse(app)})
}

func (h *ApplicationHandler) GetByID(c *gin.Context) {
	app, err := h.query.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toResponse(app)})
}

func (h *ApplicationHandler) List(c *gin.Context) {
	apps, err := h.query.List(c.Request.Context(), domain.ListFilter{
		Key:    c.Query("key"),
		Name:   c.Query("name"),
		Status: domain.Status(strings.TrimSpace(c.Query("status"))),
	})
	if err != nil {
		writeHTTPError(c, err)
		return
	}

	resp := make([]applicationResponse, 0, len(apps))
	for _, app := range apps {
		resp = append(resp, toResponse(app))
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func (h *ApplicationHandler) Update(c *gin.Context) {
	var req updateApplicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	app, err := h.updater.Execute(c.Request.Context(), c.Param("id"), domain.UpdateInput{
		Name:         req.Name,
		Key:          req.Key,
		RepoURL:      req.RepoURL,
		Description:  req.Description,
		Owner:        req.Owner,
		Status:       req.Status,
		ArtifactType: req.ArtifactType,
		Language:     req.Language,
	})
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toResponse(app)})
}

func (h *ApplicationHandler) Delete(c *gin.Context) {
	err := h.deleter.Execute(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func toResponse(app domain.Application) applicationResponse {
	return applicationResponse{
		ID:           app.ID,
		Name:         app.Name,
		Key:          app.Key,
		RepoURL:      app.RepoURL,
		Description:  app.Description,
		Owner:        app.Owner,
		Status:       app.Status,
		ArtifactType: app.ArtifactType,
		Language:     app.Language(),
		CreatedAt:    app.CreatedAt,
		UpdatedAt:    app.UpdatedAt,
	}
}

func writeHTTPError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput), errors.Is(err, usecase.ErrInvalidID), errors.Is(err, usecase.ErrInvalidStatus):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, domain.ErrNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	case errors.Is(err, domain.ErrKeyDuplicated):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}
