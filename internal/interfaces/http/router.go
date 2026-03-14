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
	userHandler *UserHandler,
	sessionResolver SessionUserResolver,
	applicationHandler *ApplicationHandler,
	pipelineHandler *PipelineHandler,
	platformParamHandler *PlatformParamHandler,
	pipelineParamHandler *PipelineParamHandler,
	releaseOrderHandler *ReleaseOrderHandler,
	releaseTemplateHandler *ReleaseTemplateHandler,
) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	router.Use(cors())
	registerSystemRoutes(router)
	registerPublicAuthRoutes(router, authHandler)
	router.Use(authMiddleware(sessionResolver))
	registerProtectedAuthRoutes(router, authHandler)
	registerUserRoutes(router, userHandler)
	registerApplicationRoutes(router, applicationHandler)
	registerPipelineRoutes(router, pipelineHandler)
	registerPlatformParamRoutes(router, platformParamHandler)
	registerPipelineParamRoutes(router, pipelineParamHandler)
	registerReleaseOrderRoutes(router, releaseOrderHandler)
	registerReleaseTemplateRoutes(router, releaseTemplateHandler)
	return router
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

func registerApplicationRoutes(router gin.IRouter, applicationHandler *ApplicationHandler) {
	applicationHandler.RegisterRoutes(router)
}

func registerPipelineRoutes(router gin.IRouter, pipelineHandler *PipelineHandler) {
	pipelineHandler.RegisterRoutes(router)
}

func registerPlatformParamRoutes(router gin.IRouter, platformParamHandler *PlatformParamHandler) {
	platformParamHandler.RegisterRoutes(router)
}

func registerPipelineParamRoutes(router gin.IRouter, pipelineParamHandler *PipelineParamHandler) {
	pipelineParamHandler.RegisterRoutes(router)
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
