package httpapi

import (
	"github.com/gin-gonic/gin"
)

func NewRouter(applicationHandler *ApplicationHandler) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())
	//registerSystemRoutes(router)
	registerApplicationRoutes(router, applicationHandler)
	return router
}

//注册示范
//func registerSystemRoutes(router gin.IRouter) {
//	router.GET("/healthz", healthz)
//}

//func healthz(c *gin.Context) {
//	c.JSON(http.StatusOK, gin.H{"status": "ok"})
//}

func registerApplicationRoutes(router gin.IRouter, applicationHandler *ApplicationHandler) {
	applicationHandler.RegisterRoutes(router)
}
