package httpapi

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	notificationdomain "gos/internal/domain/notification"
)

type NotificationHandler struct {
	manager *usecase.NotificationManager
	authz   RequestAuthorizer
}

func NewNotificationHandler(manager *usecase.NotificationManager, authz RequestAuthorizer) *NotificationHandler {
	return &NotificationHandler{manager: manager, authz: authz}
}

func (h *NotificationHandler) RegisterRoutes(router gin.IRouter) {
	if h == nil {
		return
	}
	router.GET("/notification-sources", h.ListSources)
	router.GET("/notification-sources/:id", h.GetSource)
	router.POST("/notification-sources", h.CreateSource)
	router.PUT("/notification-sources/:id", h.UpdateSource)
	router.DELETE("/notification-sources/:id", h.DeleteSource)

	router.GET("/notification-markdown-templates", h.ListMarkdownTemplates)
	router.GET("/notification-markdown-templates/:id", h.GetMarkdownTemplate)
	router.POST("/notification-markdown-templates", h.CreateMarkdownTemplate)
	router.PUT("/notification-markdown-templates/:id", h.UpdateMarkdownTemplate)
	router.DELETE("/notification-markdown-templates/:id", h.DeleteMarkdownTemplate)

	router.GET("/notification-hooks", h.ListHooks)
	router.GET("/notification-hooks/:id", h.GetHook)
	router.POST("/notification-hooks", h.CreateHook)
	router.PUT("/notification-hooks/:id", h.UpdateHook)
	router.DELETE("/notification-hooks/:id", h.DeleteHook)
}

type NotificationSourceListResponse struct {
	Data     []usecase.NotificationSourceOutput `json:"data"`
	Page     int                                `json:"page"`
	PageSize int                                `json:"page_size"`
	Total    int64                              `json:"total"`
}

type NotificationSourceDataResponse struct {
	Data usecase.NotificationSourceOutput `json:"data"`
}

type NotificationMarkdownTemplateListResponse struct {
	Data     []usecase.NotificationMarkdownTemplateOutput `json:"data"`
	Page     int                                          `json:"page"`
	PageSize int                                          `json:"page_size"`
	Total    int64                                        `json:"total"`
}

type NotificationMarkdownTemplateDataResponse struct {
	Data usecase.NotificationMarkdownTemplateOutput `json:"data"`
}

type NotificationHookListResponse struct {
	Data     []usecase.NotificationHookOutput `json:"data"`
	Page     int                              `json:"page"`
	PageSize int                              `json:"page_size"`
	Total    int64                            `json:"total"`
}

type NotificationHookDataResponse struct {
	Data usecase.NotificationHookOutput `json:"data"`
}

type upsertNotificationSourceRequest struct {
	Name              string `json:"name"`
	SourceType        string `json:"source_type"`
	WebhookURL        string `json:"webhook_url"`
	VerificationParam string `json:"verification_param"`
	Enabled           bool   `json:"enabled"`
	Remark            string `json:"remark"`
}

type notificationMarkdownTemplateConditionRequest struct {
	ParamKey      string `json:"param_key"`
	Operator      string `json:"operator"`
	ExpectedValue string `json:"expected_value"`
	MarkdownText  string `json:"markdown_text"`
}

type upsertNotificationMarkdownTemplateRequest struct {
	Name          string                                         `json:"name"`
	TitleTemplate string                                         `json:"title_template"`
	BodyTemplate  string                                         `json:"body_template"`
	Conditions    []notificationMarkdownTemplateConditionRequest `json:"conditions"`
	Enabled       bool                                           `json:"enabled"`
	Remark        string                                         `json:"remark"`
}

type upsertNotificationHookRequest struct {
	Name               string `json:"name"`
	SourceID           string `json:"source_id"`
	MarkdownTemplateID string `json:"markdown_template_id"`
	Enabled            bool   `json:"enabled"`
	Remark             string `json:"remark"`
}

func (h *NotificationHandler) ListSources(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
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
	var enabled *bool
	if raw := strings.TrimSpace(c.Query("enabled")); raw != "" {
		value := raw == "1" || strings.EqualFold(raw, "true")
		enabled = &value
	}
	output, err := h.manager.ListSources(c.Request.Context(), notificationdomain.SourceListFilter{
		Keyword:  strings.TrimSpace(c.Query("keyword")),
		Type:     notificationdomain.SourceType(strings.ToLower(strings.TrimSpace(c.Query("source_type")))),
		Enabled:  enabled,
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output.Items, "page": resolvedPage(page), "page_size": resolvedPageSize(pageSize), "total": output.Total})
}

func (h *NotificationHandler) GetSource(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	output, err := h.manager.GetSource(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) CreateSource(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	var req upsertNotificationSourceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	output, err := h.manager.CreateSource(c.Request.Context(), usecase.CreateNotificationSourceInput{
		Name:              req.Name,
		SourceType:        req.SourceType,
		WebhookURL:        req.WebhookURL,
		VerificationParam: req.VerificationParam,
		Enabled:           req.Enabled,
		Remark:            req.Remark,
		CreatedBy:         currentUserDisplay(c),
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) UpdateSource(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	var req upsertNotificationSourceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	output, err := h.manager.UpdateSource(c.Request.Context(), c.Param("id"), usecase.UpdateNotificationSourceInput{
		Name:              req.Name,
		SourceType:        req.SourceType,
		WebhookURL:        req.WebhookURL,
		VerificationParam: req.VerificationParam,
		Enabled:           req.Enabled,
		Remark:            req.Remark,
		UpdatedBy:         currentUserDisplay(c),
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) DeleteSource(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	if err := h.manager.DeleteSource(c.Request.Context(), c.Param("id")); err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *NotificationHandler) ListMarkdownTemplates(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
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
	var enabled *bool
	if raw := strings.TrimSpace(c.Query("enabled")); raw != "" {
		value := raw == "1" || strings.EqualFold(raw, "true")
		enabled = &value
	}
	output, err := h.manager.ListMarkdownTemplates(c.Request.Context(), notificationdomain.MarkdownTemplateListFilter{
		Keyword:  strings.TrimSpace(c.Query("keyword")),
		Enabled:  enabled,
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output.Items, "page": resolvedPage(page), "page_size": resolvedPageSize(pageSize), "total": output.Total})
}

func (h *NotificationHandler) GetMarkdownTemplate(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	output, err := h.manager.GetMarkdownTemplate(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) CreateMarkdownTemplate(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	var req upsertNotificationMarkdownTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	output, err := h.manager.CreateMarkdownTemplate(c.Request.Context(), usecase.CreateNotificationMarkdownTemplateInput{
		Name:          req.Name,
		TitleTemplate: req.TitleTemplate,
		BodyTemplate:  req.BodyTemplate,
		Conditions:    toNotificationMarkdownConditionInputs(req.Conditions),
		Enabled:       req.Enabled,
		Remark:        req.Remark,
		CreatedBy:     currentUserDisplay(c),
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) UpdateMarkdownTemplate(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	var req upsertNotificationMarkdownTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	output, err := h.manager.UpdateMarkdownTemplate(c.Request.Context(), c.Param("id"), usecase.UpdateNotificationMarkdownTemplateInput{
		Name:          req.Name,
		TitleTemplate: req.TitleTemplate,
		BodyTemplate:  req.BodyTemplate,
		Conditions:    toNotificationMarkdownConditionInputs(req.Conditions),
		Enabled:       req.Enabled,
		Remark:        req.Remark,
		UpdatedBy:     currentUserDisplay(c),
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) DeleteMarkdownTemplate(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	if err := h.manager.DeleteMarkdownTemplate(c.Request.Context(), c.Param("id")); err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func (h *NotificationHandler) ListHooks(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "system.notification.manage", "release.template.manage") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
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
	var enabled *bool
	if raw := strings.TrimSpace(c.Query("enabled")); raw != "" {
		value := raw == "1" || strings.EqualFold(raw, "true")
		enabled = &value
	}
	output, err := h.manager.ListHooks(c.Request.Context(), notificationdomain.HookListFilter{
		Keyword:  strings.TrimSpace(c.Query("keyword")),
		Enabled:  enabled,
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output.Items, "page": resolvedPage(page), "page_size": resolvedPageSize(pageSize), "total": output.Total})
}

func (h *NotificationHandler) GetHook(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "system.notification.manage", "release.template.manage") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	output, err := h.manager.GetHook(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) CreateHook(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	var req upsertNotificationHookRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	output, err := h.manager.CreateHook(c.Request.Context(), usecase.CreateNotificationHookInput{
		Name:               req.Name,
		SourceID:           req.SourceID,
		MarkdownTemplateID: req.MarkdownTemplateID,
		Enabled:            req.Enabled,
		Remark:             req.Remark,
		CreatedBy:          currentUserDisplay(c),
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) UpdateHook(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	var req upsertNotificationHookRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	output, err := h.manager.UpdateHook(c.Request.Context(), c.Param("id"), usecase.UpdateNotificationHookInput{
		Name:               req.Name,
		SourceID:           req.SourceID,
		MarkdownTemplateID: req.MarkdownTemplateID,
		Enabled:            req.Enabled,
		Remark:             req.Remark,
		UpdatedBy:          currentUserDisplay(c),
	})
	if err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": output})
}

func (h *NotificationHandler) DeleteHook(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.notification.manage", "", "") {
		return
	}
	if h.manager == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "notification manager is not configured"})
		return
	}
	if err := h.manager.DeleteHook(c.Request.Context(), c.Param("id")); err != nil {
		writeNotificationHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func toNotificationMarkdownConditionInputs(items []notificationMarkdownTemplateConditionRequest) []usecase.NotificationMarkdownTemplateConditionInput {
	result := make([]usecase.NotificationMarkdownTemplateConditionInput, 0, len(items))
	for _, item := range items {
		result = append(result, usecase.NotificationMarkdownTemplateConditionInput{
			ParamKey:      item.ParamKey,
			Operator:      item.Operator,
			ExpectedValue: item.ExpectedValue,
			MarkdownText:  item.MarkdownText,
		})
	}
	return result
}

func currentUserDisplay(c *gin.Context) string {
	if currentUser, ok := getCurrentUser(c); ok {
		if display := strings.TrimSpace(currentUser.DisplayName); display != "" {
			return display
		}
		if username := strings.TrimSpace(currentUser.Username); username != "" {
			return username
		}
		return strings.TrimSpace(currentUser.ID)
	}
	return ""
}

func writeNotificationHTTPError(c *gin.Context, err error) {
	switch {
	case err == nil:
		c.JSON(http.StatusOK, gin.H{"ok": true})
	case errors.Is(err, usecase.ErrInvalidInput), errors.Is(err, usecase.ErrInvalidID):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, notificationdomain.ErrSourceNotFound), errors.Is(err, notificationdomain.ErrMarkdownTemplateNotFound), errors.Is(err, notificationdomain.ErrHookNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}
