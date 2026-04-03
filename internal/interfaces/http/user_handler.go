package httpapi

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	userdomain "gos/internal/domain/user"
)

type UserHandler struct {
	users *usecase.UserManagement
	authz RequestAuthorizer
}

func NewUserHandler(users *usecase.UserManagement, authz RequestAuthorizer) *UserHandler {
	return &UserHandler{
		users: users,
		authz: authz,
	}
}

func (h *UserHandler) RegisterRoutes(router gin.IRouter) {
	router.GET("/users", h.ListUsers)
	router.GET("/users/options", h.ListUserOptions)
	router.GET("/users/:id", h.GetUserByID)
	router.POST("/users", h.CreateUser)
	router.PUT("/users/:id", h.UpdateUser)
	router.DELETE("/users/:id", h.DeleteUser)

	router.GET("/permissions", h.ListPermissions)
	router.GET("/users/:id/permissions", h.ListUserPermissions)
	router.POST("/users/:id/permissions", h.GrantUserPermissions)
	router.DELETE("/users/:id/permissions", h.RevokeUserPermissions)

	router.GET("/users/:id/param-permissions", h.ListUserParamPermissions)
	router.POST("/users/:id/param-permissions", h.UpsertUserParamPermission)
	router.PUT("/users/:id/param-permissions/:permission_id", h.UpsertUserParamPermission)
	router.DELETE("/users/:id/param-permissions/:permission_id", h.DeleteUserParamPermission)
}

type UserResponse struct {
	ID          string    `json:"id"`
	Username    string    `json:"username"`
	DisplayName string    `json:"display_name"`
	Email       string    `json:"email"`
	Phone       string    `json:"phone"`
	Role        string    `json:"role"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type UserDataResponse struct {
	Data UserResponse `json:"data"`
}

type UserListResponse struct {
	Data     []UserResponse `json:"data"`
	Page     int            `json:"page"`
	PageSize int            `json:"page_size"`
	Total    int64          `json:"total"`
}

type UserOptionResponse struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
}

type UserOptionListResponse struct {
	Data []UserOptionResponse `json:"data"`
}

type CreateUserRequest struct {
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Role        string `json:"role"`
	Status      string `json:"status"`
	Password    string `json:"password"`
}

type UpdateUserRequest struct {
	DisplayName string `json:"display_name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Role        string `json:"role"`
	Status      string `json:"status"`
	Password    string `json:"password"`
}

type UserPermissionRequest struct {
	Items []UserPermissionItem `json:"items"`
}

type UserPermissionItem struct {
	PermissionCode string `json:"permission_code"`
	ScopeType      string `json:"scope_type"`
	ScopeValue     string `json:"scope_value"`
}

type UserPermissionResponse struct {
	ID             string    `json:"id"`
	UserID         string    `json:"user_id"`
	PermissionCode string    `json:"permission_code"`
	ScopeType      string    `json:"scope_type"`
	ScopeValue     string    `json:"scope_value"`
	Enabled        bool      `json:"enabled"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type UserPermissionListResponse struct {
	Data []UserPermissionResponse `json:"data"`
}

type PermissionResponse struct {
	ID          string    `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	Module      string    `json:"module"`
	Action      string    `json:"action"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type PermissionListResponse struct {
	Data []PermissionResponse `json:"data"`
}

type UserParamPermissionRequest struct {
	ParamKey      string `json:"param_key"`
	ApplicationID string `json:"application_id"`
	CanView       bool   `json:"can_view"`
	CanEdit       bool   `json:"can_edit"`
}

type UserParamPermissionResponse struct {
	ID            string    `json:"id"`
	UserID        string    `json:"user_id"`
	ParamKey      string    `json:"param_key"`
	ApplicationID string    `json:"application_id"`
	CanView       bool      `json:"can_view"`
	CanEdit       bool      `json:"can_edit"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type UserParamPermissionDataResponse struct {
	Data UserParamPermissionResponse `json:"data"`
}

type UserParamPermissionListResponse struct {
	Data []UserParamPermissionResponse `json:"data"`
}

func (h *UserHandler) ListUsers(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.user.manage", "", "") {
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
	items, total, err := h.users.ListUsers(c.Request.Context(), userdomain.UserListFilter{
		Username: c.Query("username"),
		Name:     c.Query("name"),
		Role:     userdomain.Role(strings.TrimSpace(c.Query("role"))),
		Status:   userdomain.Status(strings.TrimSpace(c.Query("status"))),
		Page:     page,
		PageSize: pageSize,
	})
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}

	resp := make([]UserResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toUserResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      resolvedPage(page),
		"page_size": resolvedPageSize(pageSize),
		"total":     total,
	})
}

func (h *UserHandler) ListUserOptions(c *gin.Context) {
	if !ensureAnyPermission(c, h.authz, "application.manage", "release.template.manage", "system.user.manage") {
		return
	}
	items, err := h.users.ListUserOptions(c.Request.Context())
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	resp := make([]UserOptionResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, UserOptionResponse{
			ID:          item.ID,
			Username:    item.Username,
			DisplayName: item.DisplayName,
		})
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func (h *UserHandler) GetUserByID(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.user.manage", "", "") {
		return
	}
	item, err := h.users.GetUserByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toUserResponse(item)})
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.user.manage", "", "") {
		return
	}
	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	item, err := h.users.CreateUser(c.Request.Context(), usecase.CreateUserInput{
		Username:    req.Username,
		DisplayName: req.DisplayName,
		Email:       req.Email,
		Phone:       req.Phone,
		Role:        userdomain.Role(strings.TrimSpace(req.Role)),
		Status:      userdomain.Status(strings.TrimSpace(req.Status)),
		Password:    req.Password,
	})
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": toUserResponse(item)})
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.user.manage", "", "") {
		return
	}
	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	item, err := h.users.UpdateUser(c.Request.Context(), c.Param("id"), usecase.UpdateUserInput{
		DisplayName: req.DisplayName,
		Email:       req.Email,
		Phone:       req.Phone,
		Role:        userdomain.Role(strings.TrimSpace(req.Role)),
		Status:      userdomain.Status(strings.TrimSpace(req.Status)),
		Password:    req.Password,
	})
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toUserResponse(item)})
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.user.manage", "", "") {
		return
	}
	if err := h.users.DeleteUser(c.Request.Context(), c.Param("id")); err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func (h *UserHandler) ListPermissions(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	items, err := h.users.ListPermissions(c.Request.Context(), userdomain.PermissionFilter{
		Module: c.Query("module"),
		Action: c.Query("action"),
	})
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	resp := make([]PermissionResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, PermissionResponse{
			ID:          item.ID,
			Code:        item.Code,
			Name:        item.Name,
			Module:      item.Module,
			Action:      item.Action,
			Description: item.Description,
			CreatedAt:   item.CreatedAt,
			UpdatedAt:   item.UpdatedAt,
		})
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func (h *UserHandler) ListUserPermissions(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	items, err := h.users.ListUserPermissions(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	resp := make([]UserPermissionResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toUserPermissionResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func (h *UserHandler) GrantUserPermissions(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	var req UserPermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	items := make([]userdomain.UserPermissionGrant, 0, len(req.Items))
	for _, item := range req.Items {
		items = append(items, userdomain.UserPermissionGrant{
			PermissionCode: item.PermissionCode,
			ScopeType:      item.ScopeType,
			ScopeValue:     item.ScopeValue,
		})
	}
	if err := h.users.GrantUserPermissions(c.Request.Context(), c.Param("id"), items); err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": gin.H{"ok": true}})
}

func (h *UserHandler) RevokeUserPermissions(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	var req UserPermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	items := make([]userdomain.UserPermissionGrant, 0, len(req.Items))
	for _, item := range req.Items {
		items = append(items, userdomain.UserPermissionGrant{
			PermissionCode: item.PermissionCode,
			ScopeType:      item.ScopeType,
			ScopeValue:     item.ScopeValue,
		})
	}
	if err := h.users.RevokeUserPermissions(c.Request.Context(), c.Param("id"), items); err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": gin.H{"ok": true}})
}

func (h *UserHandler) ListUserParamPermissions(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	items, err := h.users.ListUserParamPermissions(c.Request.Context(), c.Param("id"), c.Query("application_id"))
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	resp := make([]UserParamPermissionResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toUserParamPermissionResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

func (h *UserHandler) UpsertUserParamPermission(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	var req UserParamPermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	item := userdomain.UserParamPermission{
		ID:            strings.TrimSpace(c.Param("permission_id")),
		UserID:        strings.TrimSpace(c.Param("id")),
		ParamKey:      req.ParamKey,
		ApplicationID: req.ApplicationID,
		CanView:       req.CanView,
		CanEdit:       req.CanEdit,
	}
	updated, err := h.users.UpsertUserParamPermission(c.Request.Context(), item)
	if err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toUserParamPermissionResponse(updated)})
}

func (h *UserHandler) DeleteUserParamPermission(c *gin.Context) {
	if !ensurePermission(c, h.authz, "system.permission.manage", "", "") {
		return
	}
	if err := h.users.DeleteUserParamPermission(c.Request.Context(), c.Param("permission_id")); err != nil {
		writeUserHTTPError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}

func toUserResponse(item userdomain.User) UserResponse {
	return UserResponse{
		ID:          item.ID,
		Username:    item.Username,
		DisplayName: item.DisplayName,
		Email:       item.Email,
		Phone:       item.Phone,
		Role:        string(item.Role),
		Status:      string(item.Status),
		CreatedAt:   item.CreatedAt,
		UpdatedAt:   item.UpdatedAt,
	}
}

func toUserPermissionResponse(item userdomain.UserPermission) UserPermissionResponse {
	return UserPermissionResponse{
		ID:             item.ID,
		UserID:         item.UserID,
		PermissionCode: item.PermissionCode,
		ScopeType:      item.ScopeType,
		ScopeValue:     item.ScopeValue,
		Enabled:        item.Enabled,
		CreatedAt:      item.CreatedAt,
		UpdatedAt:      item.UpdatedAt,
	}
}

func toUserParamPermissionResponse(item userdomain.UserParamPermission) UserParamPermissionResponse {
	return UserParamPermissionResponse{
		ID:            item.ID,
		UserID:        item.UserID,
		ParamKey:      item.ParamKey,
		ApplicationID: item.ApplicationID,
		CanView:       item.CanView,
		CanEdit:       item.CanEdit,
		CreatedAt:     item.CreatedAt,
		UpdatedAt:     item.UpdatedAt,
	}
}

func writeUserHTTPError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput),
		errors.Is(err, usecase.ErrInvalidID),
		errors.Is(err, usecase.ErrInvalidStatus):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	case errors.Is(err, userdomain.ErrUserNotFound),
		errors.Is(err, userdomain.ErrSessionNotFound),
		errors.Is(err, userdomain.ErrPermissionNotFound),
		errors.Is(err, userdomain.ErrParamPermissionNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
	case errors.Is(err, userdomain.ErrUsernameDuplicated):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}
