package httpapi

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "gos/docs"
)

func NewRouter(applicationHandler *ApplicationHandler, pipelineHandler *PipelineHandler) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	router.Use(cors())
	registerSystemRoutes(router)
	registerApplicationRoutes(router, applicationHandler)
	registerPipelineRoutes(router, pipelineHandler)
	return router
}

func registerApplicationRoutes(router gin.IRouter, applicationHandler *ApplicationHandler) {
	applicationHandler.RegisterRoutes(router)
}

func registerPipelineRoutes(router gin.IRouter, pipelineHandler *PipelineHandler) {
	pipelineHandler.RegisterRoutes(router)
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
