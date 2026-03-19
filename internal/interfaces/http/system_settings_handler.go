package httpapi

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
)

type SystemSettingsHandler struct {
	query  *usecase.QueryReleaseSettings
	update *usecase.UpdateReleaseSettings
	authz  RequestAuthorizer
}

func NewSystemSettingsHandler(
	query *usecase.QueryReleaseSettings,
	update *usecase.UpdateReleaseSettings,
	authz RequestAuthorizer,
) *SystemSettingsHandler {
	return &SystemSettingsHandler{
		query:  query,
		update: update,
		authz:  authz,
	}
}

func (h *SystemSettingsHandler) RegisterRoutes(router gin.IRouter) {
	router.GET("/system/settings/release", h.GetReleaseSettings)
	router.PUT("/system/settings/release", h.UpdateReleaseSettings)
}

type ReleaseSettingsResponse struct {
	Data usecase.ReleaseSettingsOutput `json:"data"`
}

type UpdateReleaseSettingsRequest struct {
	EnvOptions []string `json:"env_options"`
}

func (h *SystemSettingsHandler) GetReleaseSettings(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "release.create", "release.template.manage", "system.permission.manage") {
		return
	}
	if h.query == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "release settings are not configured"})
		return
	}
	output, err := h.query.Execute(c.Request.Context())
	if err != nil {
		switch {
		case errors.Is(err, usecase.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *SystemSettingsHandler) UpdateReleaseSettings(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	if h.update == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "release settings are not configured"})
		return
	}
	var req UpdateReleaseSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	output, err := h.update.Execute(c.Request.Context(), usecase.UpdateReleaseSettingsInput{
		EnvOptions: req.EnvOptions,
	})
	if err != nil {
		switch {
		case errors.Is(err, usecase.ErrInvalidInput):
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}
