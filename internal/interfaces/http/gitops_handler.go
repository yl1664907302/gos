package httpapi

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
)

type GitOpsHandler struct {
	query          *usecase.QueryGitOpsStatus
	targets        *usecase.QueryGitOpsBindingTargets
	templateFields *usecase.QueryGitOpsTemplateFields
	update         *usecase.UpdateGitOpsCommitTemplate
	authz          RequestAuthorizer
}

func NewGitOpsHandler(
	query *usecase.QueryGitOpsStatus,
	targets *usecase.QueryGitOpsBindingTargets,
	templateFields *usecase.QueryGitOpsTemplateFields,
	update *usecase.UpdateGitOpsCommitTemplate,
	authz RequestAuthorizer,
) *GitOpsHandler {
	return &GitOpsHandler{query: query, targets: targets, templateFields: templateFields, update: update, authz: authz}
}

func (h *GitOpsHandler) RegisterRoutes(router gin.IRouter) {
	router.GET("/gitops/status", h.GetStatus)
	router.GET("/gitops/targets", h.ListBindingTargets)
	router.GET("/gitops/template-fields", h.ListTemplateFields)
	router.PUT("/gitops/settings/commit-message-template", h.UpdateCommitMessageTemplate)
}

type GitOpsStatusDataResponse struct {
	Data usecase.QueryGitOpsStatusOutput `json:"data"`
}

type GitOpsBindingTargetsResponse struct {
	Data []usecase.QueryGitOpsBindingTargetOutput `json:"data"`
}

type GitOpsTemplateFieldsResponse struct {
	Data []usecase.QueryGitOpsTemplateFieldOutput `json:"data"`
}

type UpdateGitOpsCommitTemplateRequest struct {
	Template string `json:"template"`
}

// GetStatus godoc
// @Summary      Get GitOps workspace status
// @Tags         gitops
// @Produce      json
// @Success      200  {object}  GitOpsStatusDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /gitops/status [get]
func (h *GitOpsHandler) GetStatus(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "component.gitops.view", "component.gitops.manage") {
		return
	}
	if h.query == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gitops manager is not configured"})
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

// ListBindingTargets godoc
// @Summary      List GitOps binding targets
// @Tags         gitops
// @Produce      json
// @Success      200  {object}  GitOpsBindingTargetsResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /gitops/targets [get]
func (h *GitOpsHandler) ListBindingTargets(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "component.gitops.view", "pipeline.manage") {
		return
	}
	if h.targets == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gitops manager is not configured"})
		return
	}
	output, err := h.targets.Execute(c.Request.Context())
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

// ListTemplateFields godoc
// @Summary      List GitOps commit template fields
// @Tags         gitops
// @Produce      json
// @Success      200  {object}  GitOpsTemplateFieldsResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /gitops/template-fields [get]
func (h *GitOpsHandler) ListTemplateFields(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "component.gitops.view", "component.gitops.manage") {
		return
	}
	if h.templateFields == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gitops manager is not configured"})
		return
	}
	output, err := h.templateFields.Execute(c.Request.Context())
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

// UpdateCommitMessageTemplate godoc
// @Summary      Update GitOps commit message template
// @Tags         gitops
// @Accept       json
// @Produce      json
// @Param        request  body      UpdateGitOpsCommitTemplateRequest  true  "commit message template"
// @Success      200      {object}  GitOpsStatusDataResponse
// @Failure      400      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /gitops/settings/commit-message-template [put]
func (h *GitOpsHandler) UpdateCommitMessageTemplate(c *gin.Context) {
	if !ensurePermission(c, h.authz, "component.gitops.manage", "", "") {
		return
	}
	if h.update == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gitops manager is not configured"})
		return
	}

	var req UpdateGitOpsCommitTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	output, err := h.update.Execute(c.Request.Context(), usecase.UpdateGitOpsCommitTemplateInput{
		Template: req.Template,
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
