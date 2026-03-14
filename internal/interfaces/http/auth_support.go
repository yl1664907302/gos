package httpapi

import (
	"context"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	userdomain "gos/internal/domain/user"
)

const currentUserContextKey = "current_user"

type RequestAuthorizer interface {
	HasPermission(ctx context.Context, user userdomain.User, permissionCode string, scopeType string, scopeValue string) (bool, error)
}

func setCurrentUser(c *gin.Context, user userdomain.User) {
	c.Set(currentUserContextKey, user)
}

func getCurrentUser(c *gin.Context) (userdomain.User, bool) {
	value, exists := c.Get(currentUserContextKey)
	if !exists {
		return userdomain.User{}, false
	}
	user, ok := value.(userdomain.User)
	if !ok {
		return userdomain.User{}, false
	}
	return user, true
}

func extractBearerToken(value string) string {
	text := strings.TrimSpace(value)
	if text == "" {
		return ""
	}
	const prefix = "Bearer "
	if len(text) < len(prefix) || !strings.EqualFold(text[:len(prefix)], prefix) {
		return ""
	}
	return strings.TrimSpace(text[len(prefix):])
}

func ensurePermission(
	c *gin.Context,
	authz RequestAuthorizer,
	permissionCode string,
	scopeType string,
	scopeValue string,
) bool {
	return ensurePermissionWithMessage(c, authz, permissionCode, scopeType, scopeValue, "")
}

func ensurePermissionWithMessage(
	c *gin.Context,
	authz RequestAuthorizer,
	permissionCode string,
	scopeType string,
	scopeValue string,
	forbiddenMessage string,
) bool {
	user, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false
	}
	if authz == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
		return false
	}
	allowed, err := authz.HasPermission(c.Request.Context(), user, permissionCode, scopeType, scopeValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return false
	}
	if !allowed {
		message := strings.TrimSpace(forbiddenMessage)
		if message == "" {
			message = "forbidden: permission denied"
		}
		c.JSON(http.StatusForbidden, gin.H{"error": message})
		return false
	}
	return true
}

func ensureAnyPermission(
	c *gin.Context,
	authz RequestAuthorizer,
	permissionCodes ...string,
) bool {
	user, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false
	}
	if authz == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
		return false
	}
	for _, code := range permissionCodes {
		allowed, err := authz.HasPermission(c.Request.Context(), user, strings.TrimSpace(code), "", "")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return false
		}
		if allowed {
			return true
		}
	}
	c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: permission denied"})
	return false
}
