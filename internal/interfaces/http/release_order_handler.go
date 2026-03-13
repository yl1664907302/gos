package httpapi

import (
	"errors"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	appdomain "gos/internal/domain/application"
	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/release"
)

type ReleaseOrderHandler struct {
	manager *usecase.ReleaseOrderManager
}

func NewReleaseOrderHandler(manager *usecase.ReleaseOrderManager) *ReleaseOrderHandler {
	return &ReleaseOrderHandler{manager: manager}
}

func (h *ReleaseOrderHandler) RegisterRoutes(router gin.IRouter) {
	router.POST("/release-orders", h.Create)
	router.GET("/release-orders", h.List)
	router.GET("/release-orders/:id", h.GetByID)
	router.POST("/release-orders/:id/cancel", h.Cancel)
	router.POST("/release-orders/:id/execute", h.Execute)

	router.GET("/release-orders/:id/params", h.ListParams)
	router.GET("/release-orders/:id/steps", h.ListSteps)
	router.POST("/release-orders/:id/steps/:step_code/start", h.StartStep)
	router.POST("/release-orders/:id/steps/:step_code/finish", h.FinishStep)
}

type CreateReleaseOrderRequest struct {
	ApplicationID string                           `json:"application_id"`
	BindingID     string                           `json:"binding_id"`
	EnvCode       string                           `json:"env_code"`
	GitRef        string                           `json:"git_ref"`
	ImageTag      string                           `json:"image_tag"`
	TriggerType   string                           `json:"trigger_type"`
	Remark        string                           `json:"remark"`
	TriggeredBy   string                           `json:"triggered_by"`
	Params        []CreateReleaseOrderParamRequest `json:"params"`
	Steps         []CreateReleaseOrderStepRequest  `json:"steps"`
}

type CreateReleaseOrderParamRequest struct {
	ParamKey          string `json:"param_key"`
	ExecutorParamName string `json:"executor_param_name"`
	ParamValue        string `json:"param_value"`
	ValueSource       string `json:"value_source"`
}

type CreateReleaseOrderStepRequest struct {
	StepCode string `json:"step_code"`
	StepName string `json:"step_name"`
	SortNo   int    `json:"sort_no"`
}

type StartReleaseOrderStepRequest struct {
	Message string `json:"message"`
}

type FinishReleaseOrderStepRequest struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type ReleaseOrderResponse struct {
	ID              string     `json:"id"`
	OrderNo         string     `json:"order_no"`
	ApplicationID   string     `json:"application_id"`
	ApplicationName string     `json:"application_name"`
	BindingID       string     `json:"binding_id"`
	PipelineID      string     `json:"pipeline_id"`
	EnvCode         string     `json:"env_code"`
	GitRef          string     `json:"git_ref"`
	ImageTag        string     `json:"image_tag"`
	TriggerType     string     `json:"trigger_type"`
	Status          string     `json:"status"`
	Remark          string     `json:"remark"`
	TriggeredBy     string     `json:"triggered_by"`
	StartedAt       *time.Time `json:"started_at"`
	FinishedAt      *time.Time `json:"finished_at"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type ReleaseOrderParamResponse struct {
	ID                string    `json:"id"`
	ReleaseOrderID    string    `json:"release_order_id"`
	ParamKey          string    `json:"param_key"`
	ExecutorParamName string    `json:"executor_param_name"`
	ParamValue        string    `json:"param_value"`
	ValueSource       string    `json:"value_source"`
	CreatedAt         time.Time `json:"created_at"`
}

type ReleaseOrderStepResponse struct {
	ID             string     `json:"id"`
	ReleaseOrderID string     `json:"release_order_id"`
	StepCode       string     `json:"step_code"`
	StepName       string     `json:"step_name"`
	Status         string     `json:"status"`
	Message        string     `json:"message"`
	SortNo         int        `json:"sort_no"`
	StartedAt      *time.Time `json:"started_at"`
	FinishedAt     *time.Time `json:"finished_at"`
	CreatedAt      time.Time  `json:"created_at"`
}

type ReleaseOrderDataResponse struct {
	Data ReleaseOrderResponse `json:"data"`
}

type ReleaseOrderListResponse struct {
	Data     []ReleaseOrderResponse `json:"data"`
	Page     int                    `json:"page"`
	PageSize int                    `json:"page_size"`
	Total    int64                  `json:"total"`
}

type ReleaseOrderParamListResponse struct {
	Data []ReleaseOrderParamResponse `json:"data"`
}

type ReleaseOrderStepListResponse struct {
	Data []ReleaseOrderStepResponse `json:"data"`
}

type ReleaseOrderStepActionResponse struct {
	Data struct {
		Order ReleaseOrderResponse     `json:"order"`
		Step  ReleaseOrderStepResponse `json:"step"`
	} `json:"data"`
}

// Create godoc
// @Summary      Create release order
// @Tags         release-orders
// @Accept       json
// @Produce      json
// @Param        request  body      CreateReleaseOrderRequest  true  "Create release order request"
// @Success      201      {object}  ReleaseOrderDataResponse
// @Failure      400      {object}  ErrorResponse
// @Failure      404      {object}  ErrorResponse
// @Failure      409      {object}  ErrorResponse
// @Failure      500      {object}  ErrorResponse
// @Router       /release-orders [post]
func (h *ReleaseOrderHandler) Create(c *gin.Context) {
	var req CreateReleaseOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	params := make([]usecase.CreateReleaseOrderParamInput, 0, len(req.Params))
	for _, item := range req.Params {
		params = append(params, usecase.CreateReleaseOrderParamInput{
			ParamKey:          item.ParamKey,
			ExecutorParamName: item.ExecutorParamName,
			ParamValue:        item.ParamValue,
			ValueSource:       domain.ValueSource(strings.TrimSpace(item.ValueSource)),
		})
	}

	steps := make([]usecase.CreateReleaseOrderStepInput, 0, len(req.Steps))
	for _, item := range req.Steps {
		steps = append(steps, usecase.CreateReleaseOrderStepInput{
			StepCode: item.StepCode,
			StepName: item.StepName,
			SortNo:   item.SortNo,
		})
	}

	order, err := h.manager.Create(c.Request.Context(), usecase.CreateReleaseOrderInput{
		ApplicationID: req.ApplicationID,
		BindingID:     req.BindingID,
		EnvCode:       req.EnvCode,
		GitRef:        req.GitRef,
		ImageTag:      req.ImageTag,
		TriggerType:   domain.TriggerType(strings.TrimSpace(req.TriggerType)),
		Remark:        req.Remark,
		TriggeredBy:   req.TriggeredBy,
		Params:        params,
		Steps:         steps,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": toReleaseOrderResponse(order)})
}

// List godoc
// @Summary      List release orders
// @Tags         release-orders
// @Produce      json
// @Param        application_id  query     string  false  "Application ID"
// @Param        binding_id      query     string  false  "Pipeline binding ID"
// @Param        env_code        query     string  false  "Environment code"
// @Param        status          query     string  false  "Release status"
// @Param        trigger_type    query     string  false  "Trigger type"
// @Param        page            query     int     false  "Page number"
// @Param        page_size       query     int     false  "Page size"
// @Success      200  {object}  ReleaseOrderListResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /release-orders [get]
func (h *ReleaseOrderHandler) List(c *gin.Context) {
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

	items, total, err := h.manager.List(c.Request.Context(), usecase.ListReleaseOrderInput{
		ApplicationID: c.Query("application_id"),
		BindingID:     c.Query("binding_id"),
		EnvCode:       c.Query("env_code"),
		Status:        domain.OrderStatus(strings.TrimSpace(c.Query("status"))),
		TriggerType:   domain.TriggerType(strings.TrimSpace(c.Query("trigger_type"))),
		Page:          page,
		PageSize:      pageSize,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}

	resp := make([]ReleaseOrderResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toReleaseOrderResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{
		"data":      resp,
		"page":      resolvedPage(page),
		"page_size": resolvedPageSize(pageSize),
		"total":     total,
	})
}

// GetByID godoc
// @Summary      Get release order by ID
// @Tags         release-orders
// @Produce      json
// @Param        id   path      string  true  "Release order ID"
// @Success      200  {object}  ReleaseOrderDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /release-orders/{id} [get]
func (h *ReleaseOrderHandler) GetByID(c *gin.Context) {
	item, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toReleaseOrderResponse(item)})
}

// Cancel godoc
// @Summary      Cancel release order
// @Tags         release-orders
// @Produce      json
// @Param        id   path      string  true  "Release order ID"
// @Success      200  {object}  ReleaseOrderDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /release-orders/{id}/cancel [post]
func (h *ReleaseOrderHandler) Cancel(c *gin.Context) {
	item, err := h.manager.Cancel(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toReleaseOrderResponse(item)})
}

// Execute godoc
// @Summary      Execute release order
// @Tags         release-orders
// @Produce      json
// @Param        id   path      string  true  "Release order ID"
// @Success      200  {object}  ReleaseOrderDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /release-orders/{id}/execute [post]
func (h *ReleaseOrderHandler) Execute(c *gin.Context) {
	item, err := h.manager.Execute(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": toReleaseOrderResponse(item)})
}

// ListParams godoc
// @Summary      List release order params
// @Tags         release-orders
// @Produce      json
// @Param        id   path      string  true  "Release order ID"
// @Success      200  {object}  ReleaseOrderParamListResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /release-orders/{id}/params [get]
func (h *ReleaseOrderHandler) ListParams(c *gin.Context) {
	items, err := h.manager.ListParams(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}

	resp := make([]ReleaseOrderParamResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toReleaseOrderParamResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

// ListSteps godoc
// @Summary      List release order steps
// @Tags         release-orders
// @Produce      json
// @Param        id   path      string  true  "Release order ID"
// @Success      200  {object}  ReleaseOrderStepListResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /release-orders/{id}/steps [get]
func (h *ReleaseOrderHandler) ListSteps(c *gin.Context) {
	items, err := h.manager.ListSteps(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}

	resp := make([]ReleaseOrderStepResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toReleaseOrderStepResponse(item))
	}
	c.JSON(http.StatusOK, gin.H{"data": resp})
}

// StartStep godoc
// @Summary      Start release order step
// @Tags         release-orders
// @Accept       json
// @Produce      json
// @Param        id         path      string                        true  "Release order ID"
// @Param        step_code  path      string                        true  "Step code"
// @Param        request    body      StartReleaseOrderStepRequest  false "Start step request"
// @Success      200        {object}  ReleaseOrderStepActionResponse
// @Failure      400        {object}  ErrorResponse
// @Failure      404        {object}  ErrorResponse
// @Failure      500        {object}  ErrorResponse
// @Router       /release-orders/{id}/steps/{step_code}/start [post]
func (h *ReleaseOrderHandler) StartStep(c *gin.Context) {
	var req StartReleaseOrderStepRequest
	if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	step, order, err := h.manager.StartStep(c.Request.Context(), c.Param("id"), c.Param("step_code"), req.Message)
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"order": toReleaseOrderResponse(order),
			"step":  toReleaseOrderStepResponse(step),
		},
	})
}

// FinishStep godoc
// @Summary      Finish release order step
// @Tags         release-orders
// @Accept       json
// @Produce      json
// @Param        id         path      string                         true  "Release order ID"
// @Param        step_code  path      string                         true  "Step code"
// @Param        request    body      FinishReleaseOrderStepRequest  false "Finish step request"
// @Success      200        {object}  ReleaseOrderStepActionResponse
// @Failure      400        {object}  ErrorResponse
// @Failure      404        {object}  ErrorResponse
// @Failure      500        {object}  ErrorResponse
// @Router       /release-orders/{id}/steps/{step_code}/finish [post]
func (h *ReleaseOrderHandler) FinishStep(c *gin.Context) {
	var req FinishReleaseOrderStepRequest
	if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	step, order, err := h.manager.FinishStep(c.Request.Context(), c.Param("id"), c.Param("step_code"), usecase.FinishReleaseOrderStepInput{
		Status:  domain.StepStatus(strings.TrimSpace(req.Status)),
		Message: req.Message,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"order": toReleaseOrderResponse(order),
			"step":  toReleaseOrderStepResponse(step),
		},
	})
}

func toReleaseOrderResponse(item domain.ReleaseOrder) ReleaseOrderResponse {
	return ReleaseOrderResponse{
		ID:              item.ID,
		OrderNo:         item.OrderNo,
		ApplicationID:   item.ApplicationID,
		ApplicationName: item.ApplicationName,
		BindingID:       item.BindingID,
		PipelineID:      item.PipelineID,
		EnvCode:         item.EnvCode,
		GitRef:          item.GitRef,
		ImageTag:        item.ImageTag,
		TriggerType:     string(item.TriggerType),
		Status:          string(item.Status),
		Remark:          item.Remark,
		TriggeredBy:     item.TriggeredBy,
		StartedAt:       item.StartedAt,
		FinishedAt:      item.FinishedAt,
		CreatedAt:       item.CreatedAt,
		UpdatedAt:       item.UpdatedAt,
	}
}

func toReleaseOrderParamResponse(item domain.ReleaseOrderParam) ReleaseOrderParamResponse {
	return ReleaseOrderParamResponse{
		ID:                item.ID,
		ReleaseOrderID:    item.ReleaseOrderID,
		ParamKey:          item.ParamKey,
		ExecutorParamName: item.ExecutorParamName,
		ParamValue:        item.ParamValue,
		ValueSource:       string(item.ValueSource),
		CreatedAt:         item.CreatedAt,
	}
}

func toReleaseOrderStepResponse(item domain.ReleaseOrderStep) ReleaseOrderStepResponse {
	return ReleaseOrderStepResponse{
		ID:             item.ID,
		ReleaseOrderID: item.ReleaseOrderID,
		StepCode:       item.StepCode,
		StepName:       item.StepName,
		Status:         string(item.Status),
		Message:        item.Message,
		SortNo:         item.SortNo,
		StartedAt:      item.StartedAt,
		FinishedAt:     item.FinishedAt,
		CreatedAt:      item.CreatedAt,
	}
}

func writeReleaseOrderHTTPError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput),
		errors.Is(err, usecase.ErrInvalidID),
		errors.Is(err, usecase.ErrInvalidStatus),
		errors.Is(err, usecase.ErrInvalidSourceFrom):
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

	case errors.Is(err, appdomain.ErrNotFound),
		errors.Is(err, pipelinedomain.ErrBindingNotFound),
		errors.Is(err, domain.ErrOrderNotFound),
		errors.Is(err, domain.ErrStepNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})

	case errors.Is(err, domain.ErrOrderDuplicated):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})

	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}
