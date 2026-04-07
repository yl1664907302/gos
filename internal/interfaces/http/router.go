package httpapi

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "gos/docs"
)

func NewRouter(
	authHandler *AuthHandler,
	agentHandler *AgentHandler,
	userHandler *UserHandler,
	sessionResolver SessionUserResolver,
	applicationHandler *ApplicationHandler,
	systemSettingsHandler *SystemSettingsHandler,
	pipelineHandler *PipelineHandler,
	argocdHandler *ArgoCDHandler,
	gitopsHandler *GitOpsHandler,
	platformParamHandler *PlatformParamHandler,
	notificationHandler *NotificationHandler,
	executorParamHandler *ExecutorParamHandler,
	releaseOrderHandler *ReleaseOrderHandler,
	releaseTemplateHandler *ReleaseTemplateHandler,
) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	router.Use(cors())
	registerSystemRoutes(router)
	registerPublicAuthRoutes(router, authHandler)
	registerPublicAgentRoutes(router, agentHandler)
	router.Use(authMiddleware(sessionResolver))
	registerProtectedAuthRoutes(router, authHandler)
	registerAgentRoutes(router, agentHandler)
	registerUserRoutes(router, userHandler)
	registerApplicationRoutes(router, applicationHandler)
	registerSystemSettingsRoutes(router, systemSettingsHandler)
	registerPipelineRoutes(router, pipelineHandler)
	registerArgoCDRoutes(router, argocdHandler)
	registerGitOpsRoutes(router, gitopsHandler)
	registerPlatformParamRoutes(router, platformParamHandler)
	registerNotificationRoutes(router, notificationHandler)
	registerExecutorParamRoutes(router, executorParamHandler)
	registerReleaseOrderRoutes(router, releaseOrderHandler)
	registerReleaseTemplateRoutes(router, releaseTemplateHandler)
	return router
}

func registerPublicAgentRoutes(router gin.IRouter, agentHandler *AgentHandler) {
	if agentHandler == nil {
		return
	}
	agentHandler.RegisterPublicRoutes(router)
}

func registerPublicAuthRoutes(router gin.IRouter, authHandler *AuthHandler) {
	authHandler.RegisterPublicRoutes(router)
}

func registerProtectedAuthRoutes(router gin.IRouter, authHandler *AuthHandler) {
	authHandler.RegisterProtectedRoutes(router)
}

func registerUserRoutes(router gin.IRouter, userHandler *UserHandler) {
	userHandler.RegisterRoutes(router)
}

func registerAgentRoutes(router gin.IRouter, agentHandler *AgentHandler) {
	if agentHandler == nil {
		return
	}
	agentHandler.RegisterRoutes(router)
}

func registerApplicationRoutes(router gin.IRouter, applicationHandler *ApplicationHandler) {
	applicationHandler.RegisterRoutes(router)
}

func registerSystemSettingsRoutes(router gin.IRouter, systemSettingsHandler *SystemSettingsHandler) {
	if systemSettingsHandler == nil {
		return
	}
	systemSettingsHandler.RegisterRoutes(router)
}

func registerPipelineRoutes(router gin.IRouter, pipelineHandler *PipelineHandler) {
	pipelineHandler.RegisterRoutes(router)
}

func registerArgoCDRoutes(router gin.IRouter, argocdHandler *ArgoCDHandler) {
	if argocdHandler == nil {
		return
	}
	argocdHandler.RegisterRoutes(router)
}

func registerGitOpsRoutes(router gin.IRouter, gitopsHandler *GitOpsHandler) {
	if gitopsHandler == nil {
		return
	}
	gitopsHandler.RegisterRoutes(router)
}

func registerPlatformParamRoutes(router gin.IRouter, platformParamHandler *PlatformParamHandler) {
	platformParamHandler.RegisterRoutes(router)
}

func registerNotificationRoutes(router gin.IRouter, notificationHandler *NotificationHandler) {
	if notificationHandler == nil {
		return
	}
	notificationHandler.RegisterRoutes(router)
}

func registerExecutorParamRoutes(router gin.IRouter, executorParamHandler *ExecutorParamHandler) {
	executorParamHandler.RegisterRoutes(router)
}

func registerReleaseOrderRoutes(router gin.IRouter, releaseOrderHandler *ReleaseOrderHandler) {
	releaseOrderHandler.RegisterRoutes(router)
}

func registerReleaseTemplateRoutes(router gin.IRouter, releaseTemplateHandler *ReleaseTemplateHandler) {
	releaseTemplateHandler.RegisterRoutes(router)
}

func registerSystemRoutes(router gin.IRouter) {
	router.GET("/healthz", healthz)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}

func healthz(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := strings.TrimSpace(c.GetHeader("Origin"))
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
		}
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
