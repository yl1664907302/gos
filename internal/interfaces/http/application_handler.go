package httpapi

import (
	"errors"
	"net/http"
	"strconv"
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

type CreateApplicationRequest struct {
	Name         string `json:"name"`
	Key          string `json:"key"`
	RepoURL      string `json:"repo_url"`
	Description  string `json:"description"`
	Owner        string `json:"owner"`
	Status       string `json:"status"`
	ArtifactType string `json:"artifact_type"`
	Language     string `json:"language"`
}

type UpdateApplicationRequest struct {
	Name         string `json:"name"`
	Key          string `json:"key"`
	RepoURL      string `json:"repo_url"`
	Description  string `json:"description"`
	Owner        string `json:"owner"`
	Status       string `json:"status"`
	ArtifactType string `json:"artifact_type"`
	Language     string `json:"language"`
}

type ApplicationResponse struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Key          string    `json:"key"`
	RepoURL      string    `json:"repo_url"`
	Description  string    `json:"description"`
	Owner        string    `json:"owner"`
	Status       string    `json:"status"`
	ArtifactType string    `json:"artifact_type"`
	Language     string    `json:"language"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ApplicationDataResponse struct {
	Data ApplicationResponse `json:"data"`
}

type ApplicationListResponse struct {
	Data     []ApplicationResponse `json:"data"`
	Page     int                   `json:"page"`
	PageSize int                   `json:"page_size"`
	Total    int64                 `json:"total"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// Create godoc
// @Summary      Create application
// @Tags         applications
// @Accept       json
// @Produce      json
// @Param        request  body      CreateApplicationRequest  true  "Create application request"
// @Success      201      {object}  ApplicationDataResponse
// @Failure      400      {object}  ErrorResponse
// @Failure      409      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /applications [post]
func (h *ApplicationHandler) Create(c *gin.Context) {
	var req CreateApplicationRequest
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
		Status:       domain.Status(strings.TrimSpace(req.Status)),
		ArtifactType: req.ArtifactType,
		Language:     req.Language,
	})
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": toResponse(app)})
}

// GetByID godoc
// @Summary      Get application by ID
// @Tags         applications
// @Produce      json
// @Param        id   path      string  true  "Application ID"
// @Success      200  {object}  ApplicationDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /applications/{id} [get]
func (h *ApplicationHandler) GetByID(c *gin.Context) {
	app, err := h.query.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toResponse(app)})
}

// List godoc
// @Summary      List applications
// @Tags         applications
// @Produce      json
// @Param        key     query     string  false  "Application key"
// @Param        name    query     string  false  "Application name"
// @Param        status  query     string  false  "Application status"
// @Param        page      query     int     false  "Page number, starts from 1"
// @Param        page_size query     int     false  "Page size, max 100"
// @Success      200     {object}  ApplicationListResponse
// @Failure      400     {object}  ErrorResponse
// @Failure      500     {object}  ErrorResponse
// @Router       /applications [get]
func (h *ApplicationHandler) List(c *gin.Context) {
	page, err := parsePositiveIntQuery(c, "page")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	pageSize, err := parsePositiveIntQuery(c, "page_size")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	apps, total, err := h.query.List(c.Request.Context(), domain.ListFilter{
		Key:      c.Query("key"),
		Name:     c.Query("name"),
		Status:   domain.Status(strings.TrimSpace(c.Query("status"))),
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		writeHTTPError(c, err)
		return
	}

	resp := make([]ApplicationResponse, 0, len(apps))
	for _, app := range apps {
		resp = append(resp, toResponse(app))
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      resolvePage(page),
		"page_size": resolvePageSize(pageSize),
		"total":     total,
	})
}

// Update godoc
// @Summary      Update application
// @Tags         applications
// @Accept       json
// @Produce      json
// @Param        id       path      string                    true  "Application ID"
// @Param        request  body      UpdateApplicationRequest  true  "Update application request"
// @Success      200      {object}  ApplicationDataResponse
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      409      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /applications/{id} [put]
func (h *ApplicationHandler) Update(c *gin.Context) {
	var req UpdateApplicationRequest
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
		Status:       domain.Status(strings.TrimSpace(req.Status)),
		ArtifactType: req.ArtifactType,
		Language:     req.Language,
	})
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toResponse(app)})
}

// Delete godoc
// @Summary      Delete application
// @Tags         applications
// @Produce      json
// @Param        id   path  string  true  "Application ID"
// @Success      204  {string}  string  "No Content"
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /applications/{id} [delete]
func (h *ApplicationHandler) Delete(c *gin.Context) {
	err := h.deleter.Execute(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeHTTPError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func toResponse(app domain.Application) ApplicationResponse {
	return ApplicationResponse{
		ID:           app.ID,
		Name:         app.Name,
		Key:          app.Key,
		RepoURL:      app.RepoURL,
		Description:  app.Description,
		Owner:        app.Owner,
		Status:       string(app.Status),
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

func parsePositiveIntQuery(c *gin.Context, name string) (int, error) {
	raw := strings.TrimSpace(c.Query(name))
	if raw == "" {
		return 0, nil
	}
	value, err := strconv.Atoi(raw)
	if err != nil {
		return 0, errors.New(name + " must be an integer")
	}
	if value < 1 {
		return 0, errors.New(name + " must be greater than 0")
	}
	return value, nil
}

func resolvePage(page int) int {
	if page > 0 {
		return page
	}
	return 1
}

func resolvePageSize(pageSize int) int {
	const (
		defaultPageSize = 20
		maxPageSize     = 100
	)
	if pageSize < 1 {
		return defaultPageSize
	}
	if pageSize > maxPageSize {
		return maxPageSize
	}
	return pageSize
}
