package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"gos/internal/application/usecase"
	appdomain "gos/internal/domain/application"
	pipelinedomain "gos/internal/domain/pipeline"
	domain "gos/internal/domain/release"
	userdomain "gos/internal/domain/user"
)

type ReleaseOrderHandler struct {
	manager     *usecase.ReleaseOrderManager
	logStreamer ReleaseOrderLogStreamer
	authz       RequestAuthorizer
	access      ReleaseParamAccessResolver
}

type ReleaseParamAccessResolver interface {
	ResolveParamAccess(
		ctx context.Context,
		user userdomain.User,
		applicationID string,
		paramKey string,
	) (canView bool, canEdit bool, err error)
}

type ReleaseOrderLogStreamer interface {
	Stream(
		ctx context.Context,
		input usecase.StreamReleaseOrderLogInput,
		emit func(event usecase.ReleaseOrderLogEvent) error,
	) error
}

func NewReleaseOrderHandler(
	manager *usecase.ReleaseOrderManager,
	logStreamer ReleaseOrderLogStreamer,
	authz RequestAuthorizer,
	access ReleaseParamAccessResolver,
) *ReleaseOrderHandler {
	return &ReleaseOrderHandler{
		manager:     manager,
		logStreamer: logStreamer,
		authz:       authz,
		access:      access,
	}
}

func (h *ReleaseOrderHandler) RegisterRoutes(router gin.IRouter) {
	router.POST("/applications/:id/release-orders/rollback", h.CreateRollbackByApplication)
	router.POST("/release-orders", h.Create)
	router.POST("/release-orders/batch-execute", h.BatchExecute)
	router.POST("/release-orders/:id/rollback", h.CreateRollbackByOrder)
	router.POST("/release-orders/:id/replay", h.CreateReplayByOrder)
	router.GET("/release-orders", h.List)
	router.GET("/release-orders/:id", h.GetByID)
	router.GET("/release-orders/:id/precheck", h.GetPrecheck)
	router.GET("/release-orders/:id/concurrent-batch-progress", h.GetConcurrentBatchProgress)
	router.POST("/release-orders/:id/cancel", h.Cancel)
	router.POST("/release-orders/:id/execute", h.Execute)
	router.GET("/release-orders/:id/logs/stream", h.StreamLogs)

	router.GET("/release-orders/:id/params", h.ListParams)
	router.GET("/release-orders/:id/value-progress", h.ListValueProgress)
	router.GET("/release-orders/:id/executions", h.ListExecutions)
	router.GET("/release-orders/:id/steps", h.ListSteps)
	router.GET("/release-orders/:id/pipeline-stages", h.ListPipelineStages)
	router.GET("/release-orders/:id/pipeline-stages/:stage_id/log", h.GetPipelineStageLog)
	router.POST("/release-orders/:id/steps/:step_code/start", h.StartStep)
	router.POST("/release-orders/:id/steps/:step_code/finish", h.FinishStep)
}

type CreateReleaseOrderRequest struct {
	ApplicationID string                           `json:"application_id"`
	TemplateID    string                           `json:"template_id"`
	EnvCode       string                           `json:"env_code"`
	ProjectName   string                           `json:"project_name"`
	SonService    string                           `json:"son_service"`
	GitRef        string                           `json:"git_ref"`
	ImageTag      string                           `json:"image_tag"`
	TriggerType   string                           `json:"trigger_type"`
	Remark        string                           `json:"remark"`
	TriggeredBy   string                           `json:"triggered_by"`
	Params        []CreateReleaseOrderParamRequest `json:"params"`
	Steps         []CreateReleaseOrderStepRequest  `json:"steps"`
}

type CreateReleaseOrderParamRequest struct {
	PipelineScope     string `json:"pipeline_scope"`
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

type BatchExecuteReleaseOrdersRequest struct {
	OrderIDs []string `json:"order_ids"`
}

type ReleaseOrderResponse struct {
	ID                 string     `json:"id"`
	OrderNo            string     `json:"order_no"`
	PreviousOrderNo    string     `json:"previous_order_no"`
	OperationType      string     `json:"operation_type"`
	SourceOrderID      string     `json:"source_order_id"`
	SourceOrderNo      string     `json:"source_order_no"`
	IsConcurrent       bool       `json:"is_concurrent"`
	ConcurrentBatchNo  string     `json:"concurrent_batch_no"`
	ConcurrentBatchSeq int        `json:"concurrent_batch_seq"`
	CDProvider         string     `json:"cd_provider"`
	ApplicationID      string     `json:"application_id"`
	ApplicationName    string     `json:"application_name"`
	TemplateID         string     `json:"template_id"`
	TemplateName       string     `json:"template_name"`
	BindingID          string     `json:"binding_id"`
	PipelineID         string     `json:"pipeline_id"`
	EnvCode            string     `json:"env_code"`
	ProjectName        string     `json:"project_name"`
	SonService         string     `json:"son_service"`
	GitRef             string     `json:"git_ref"`
	ImageTag           string     `json:"image_tag"`
	TriggerType        string     `json:"trigger_type"`
	Status             string     `json:"status"`
	Remark             string     `json:"remark"`
	CreatorUserID      string     `json:"creator_user_id"`
	TriggeredBy        string     `json:"triggered_by"`
	StartedAt          *time.Time `json:"started_at"`
	FinishedAt         *time.Time `json:"finished_at"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
}

type ReleaseOrderParamResponse struct {
	ID                string    `json:"id"`
	ReleaseOrderID    string    `json:"release_order_id"`
	PipelineScope     string    `json:"pipeline_scope"`
	BindingID         string    `json:"binding_id"`
	ParamKey          string    `json:"param_key"`
	ExecutorParamName string    `json:"executor_param_name"`
	ParamValue        string    `json:"param_value"`
	ValueSource       string    `json:"value_source"`
	CreatedAt         time.Time `json:"created_at"`
}

type ReleaseOrderStepResponse struct {
	ID             string     `json:"id"`
	ReleaseOrderID string     `json:"release_order_id"`
	StepScope      string     `json:"step_scope"`
	ExecutionID    string     `json:"execution_id"`
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

type ReleaseOrderExecutionResponse struct {
	ID             string     `json:"id"`
	ReleaseOrderID string     `json:"release_order_id"`
	PipelineScope  string     `json:"pipeline_scope"`
	BindingID      string     `json:"binding_id"`
	BindingName    string     `json:"binding_name"`
	Provider       string     `json:"provider"`
	PipelineID     string     `json:"pipeline_id"`
	Status         string     `json:"status"`
	QueueURL       string     `json:"queue_url"`
	BuildURL       string     `json:"build_url"`
	ExternalRunID  string     `json:"external_run_id"`
	StartedAt      *time.Time `json:"started_at"`
	FinishedAt     *time.Time `json:"finished_at"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}

type ReleaseOrderExecutionListResponse struct {
	Data []ReleaseOrderExecutionResponse `json:"data"`
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

type ReleaseOrderPrecheckItemResponse struct {
	Key     string `json:"key"`
	Name    string `json:"name"`
	Status  string `json:"status"`
	Message string `json:"message"`
}

type ReleaseOrderPrecheckResponse struct {
	Data struct {
		OrderID          string                             `json:"order_id"`
		OrderNo          string                             `json:"order_no"`
		Executable       bool                               `json:"executable"`
		WaitingForLock   bool                               `json:"waiting_for_lock"`
		LockEnabled      bool                               `json:"lock_enabled"`
		LockScope        string                             `json:"lock_scope"`
		ConflictStrategy string                             `json:"conflict_strategy"`
		LockKey          string                             `json:"lock_key"`
		ConflictOrderNo  string                             `json:"conflict_order_no"`
		ConflictMessage  string                             `json:"conflict_message"`
		Items            []ReleaseOrderPrecheckItemResponse `json:"items"`
	} `json:"data"`
}

type ReleaseOrderConcurrentBatchProgressItemResponse struct {
	OrderID             string     `json:"order_id"`
	OrderNo             string     `json:"order_no"`
	ApplicationID       string     `json:"application_id"`
	ApplicationName     string     `json:"application_name"`
	EnvCode             string     `json:"env_code"`
	Status              string     `json:"status"`
	OperationType       string     `json:"operation_type"`
	ConcurrentBatchSeq  int        `json:"concurrent_batch_seq"`
	QueueState          string     `json:"queue_state"`
	QueuePosition       int        `json:"queue_position"`
	HasRunningExecution bool       `json:"has_running_execution"`
	StartedAt           *time.Time `json:"started_at"`
	FinishedAt          *time.Time `json:"finished_at"`
}

type ReleaseOrderConcurrentBatchProgressResponse struct {
	Data struct {
		OrderID      string                                            `json:"order_id"`
		OrderNo      string                                            `json:"order_no"`
		BatchNo      string                                            `json:"batch_no"`
		IsConcurrent bool                                              `json:"is_concurrent"`
		Total        int                                               `json:"total"`
		Queued       int                                               `json:"queued"`
		Executing    int                                               `json:"executing"`
		Success      int                                               `json:"success"`
		Failed       int                                               `json:"failed"`
		Cancelled    int                                               `json:"cancelled"`
		Items        []ReleaseOrderConcurrentBatchProgressItemResponse `json:"items"`
	} `json:"data"`
}

type ReleaseOrderBatchExecuteResponse struct {
	Data struct {
		BatchNo        string                 `json:"batch_no"`
		Orders         []ReleaseOrderResponse `json:"orders"`
		DispatchErrors []string               `json:"dispatch_errors"`
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
	if !ensureReleaseApplicationPermission(c, h.authz, "release.create", req.ApplicationID) {
		return
	}

	currentUser, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	params := make([]usecase.CreateReleaseOrderParamInput, 0, len(req.Params))
	for _, item := range req.Params {
		params = append(params, usecase.CreateReleaseOrderParamInput{
			PipelineScope:     domain.PipelineScope(strings.ToLower(strings.TrimSpace(item.PipelineScope))),
			ParamKey:          strings.ToLower(strings.TrimSpace(item.ParamKey)),
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
		TemplateID:    req.TemplateID,
		EnvCode:       req.EnvCode,
		SonService:    "",
		GitRef:        req.GitRef,
		ImageTag:      req.ImageTag,
		TriggerType:   domain.TriggerType(strings.TrimSpace(req.TriggerType)),
		Remark:        req.Remark,
		CreatorUserID: strings.TrimSpace(currentUser.ID),
		TriggeredBy:   firstNonEmpty(resolveTriggeredBy(currentUser), req.TriggeredBy),
		Params:        params,
		Steps:         steps,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	order = h.enrichReleaseOrderResponseMeta(c.Request.Context(), order)

	c.JSON(http.StatusCreated, gin.H{"data": toReleaseOrderResponse(order)})
}

func (h *ReleaseOrderHandler) BatchExecute(c *gin.Context) {
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	var req BatchExecuteReleaseOrdersRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	if len(req.OrderIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order_ids is required"})
		return
	}
	for _, orderID := range req.OrderIDs {
		item, err := h.manager.GetByID(c.Request.Context(), orderID)
		if err != nil {
			writeReleaseOrderHTTPError(c, err)
			return
		}
		if !ensureReleaseOrderVisible(c, h.authz, item.ApplicationID, item.CreatorUserID) {
			return
		}
		if !ensureReleaseApplicationPermission(c, h.authz, "release.execute", item.ApplicationID) {
			return
		}
	}
	output, err := h.manager.BatchExecute(c.Request.Context(), usecase.BatchExecuteReleaseOrdersInput{
		OrderIDs: req.OrderIDs,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	resp := ReleaseOrderBatchExecuteResponse{}
	resp.Data.BatchNo = output.BatchNo
	resp.Data.DispatchErrors = append(resp.Data.DispatchErrors, output.DispatchErrors...)
	resp.Data.Orders = make([]ReleaseOrderResponse, 0, len(output.Orders))
	for _, item := range output.Orders {
		enriched := h.enrichReleaseOrderResponseMeta(c.Request.Context(), item)
		resp.Data.Orders = append(resp.Data.Orders, toReleaseOrderResponse(enriched))
	}
	c.JSON(http.StatusOK, resp)
}

// CreateRollbackByApplication godoc
// @Summary      Create rollback release order by application
// @Tags         release-orders
// @Produce      json
// @Param        id   path      string  true  "Application ID"
// @Success      201  {object}  ReleaseOrderDataResponse
// @Failure      400  {object}  ErrorResponse
// @Failure      401  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /applications/{id}/release-orders/rollback [post]
func (h *ReleaseOrderHandler) CreateRollbackByApplication(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"error": "按应用自动回滚已废弃，请从成功发布单发起恢复"})
}

func (h *ReleaseOrderHandler) CreateRollbackByOrder(c *gin.Context) {
	sourceOrderID := strings.TrimSpace(c.Param("id"))
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	sourceOrder, err := h.manager.GetByID(c.Request.Context(), sourceOrderID)
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseApplicationPermission(c, h.authz, "release.create", sourceOrder.ApplicationID) {
		return
	}
	currentUser, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	order, err := h.manager.CreateStandardRollbackByOrder(
		c.Request.Context(),
		sourceOrderID,
		strings.TrimSpace(currentUser.ID),
		resolveTriggeredBy(currentUser),
	)
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	order = h.enrichReleaseOrderResponseMeta(c.Request.Context(), order)
	c.JSON(http.StatusCreated, gin.H{"data": toReleaseOrderResponse(order)})
}

func (h *ReleaseOrderHandler) CreateReplayByOrder(c *gin.Context) {
	sourceOrderID := strings.TrimSpace(c.Param("id"))
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	sourceOrder, err := h.manager.GetByID(c.Request.Context(), sourceOrderID)
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseApplicationPermission(c, h.authz, "release.create", sourceOrder.ApplicationID) {
		return
	}
	currentUser, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	order, err := h.manager.CreatePipelineReplayByOrder(
		c.Request.Context(),
		sourceOrderID,
		strings.TrimSpace(currentUser.ID),
		resolveTriggeredBy(currentUser),
	)
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	order = h.enrichReleaseOrderResponseMeta(c.Request.Context(), order)
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
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	currentUser, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
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
	applicationID := strings.TrimSpace(c.Query("application_id"))
	allowAll, visibleApplicationIDs, ok := resolveVisibleReleaseOrderApplicationIDs(c, h.authz)
	if !ok {
		return
	}
	if !allowAll {
		if applicationID != "" {
			if !containsString(visibleApplicationIDs, applicationID) {
				writeEmptyReleaseOrderList(c, page, pageSize)
				return
			}
		} else if len(visibleApplicationIDs) == 0 {
			writeEmptyReleaseOrderList(c, page, pageSize)
			return
		}
	}

	items, total, err := h.manager.List(c.Request.Context(), usecase.ListReleaseOrderInput{
		ApplicationID:  applicationID,
		ApplicationIDs: resolveReleaseListApplicationIDs(applicationID, allowAll, visibleApplicationIDs),
		CreatorUserID:  resolveReleaseOrderCreatorFilter(currentUser),
		BindingID:      c.Query("binding_id"),
		EnvCode:        c.Query("env_code"),
		Status:         domain.OrderStatus(strings.TrimSpace(c.Query("status"))),
		TriggerType:    domain.TriggerType(strings.TrimSpace(c.Query("trigger_type"))),
		Page:           page,
		PageSize:       pageSize,
	})
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	for idx := range items {
		items[idx] = h.enrichReleaseOrderResponseMeta(c.Request.Context(), items[idx])
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
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	item, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, item.ApplicationID, item.CreatorUserID) {
		return
	}
	item = h.enrichReleaseOrderResponseMeta(c.Request.Context(), item)
	c.JSON(http.StatusOK, gin.H{"data": toReleaseOrderResponse(item)})
}

func (h *ReleaseOrderHandler) GetPrecheck(c *gin.Context) {
	existing, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, existing.ApplicationID, existing.CreatorUserID) {
		return
	}
	output, err := h.manager.PrecheckExecute(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	resp := ReleaseOrderPrecheckResponse{}
	resp.Data.OrderID = output.OrderID
	resp.Data.OrderNo = output.OrderNo
	resp.Data.Executable = output.Executable
	resp.Data.WaitingForLock = output.WaitingForLock
	resp.Data.LockEnabled = output.LockEnabled
	resp.Data.LockScope = output.LockScope
	resp.Data.ConflictStrategy = output.ConflictStrategy
	resp.Data.LockKey = output.LockKey
	resp.Data.ConflictOrderNo = output.ConflictOrderNo
	resp.Data.ConflictMessage = output.ConflictMessage
	resp.Data.Items = make([]ReleaseOrderPrecheckItemResponse, 0, len(output.Items))
	for _, item := range output.Items {
		resp.Data.Items = append(resp.Data.Items, ReleaseOrderPrecheckItemResponse{
			Key:     item.Key,
			Name:    item.Name,
			Status:  string(item.Status),
			Message: item.Message,
		})
	}
	c.JSON(http.StatusOK, resp)
}

func (h *ReleaseOrderHandler) GetConcurrentBatchProgress(c *gin.Context) {
	existing, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, existing.ApplicationID, existing.CreatorUserID) {
		return
	}
	output, err := h.manager.GetConcurrentBatchProgress(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	resp := ReleaseOrderConcurrentBatchProgressResponse{}
	resp.Data.OrderID = output.OrderID
	resp.Data.OrderNo = output.OrderNo
	resp.Data.BatchNo = output.BatchNo
	resp.Data.IsConcurrent = output.IsConcurrent
	resp.Data.Total = output.Total
	resp.Data.Queued = output.Queued
	resp.Data.Executing = output.Executing
	resp.Data.Success = output.Success
	resp.Data.Failed = output.Failed
	resp.Data.Cancelled = output.Cancelled
	resp.Data.Items = make([]ReleaseOrderConcurrentBatchProgressItemResponse, 0, len(output.Items))
	for _, item := range output.Items {
		resp.Data.Items = append(resp.Data.Items, ReleaseOrderConcurrentBatchProgressItemResponse{
			OrderID:             item.OrderID,
			OrderNo:             item.OrderNo,
			ApplicationID:       item.ApplicationID,
			ApplicationName:     item.ApplicationName,
			EnvCode:             item.EnvCode,
			Status:              string(item.Status),
			OperationType:       string(item.OperationType),
			ConcurrentBatchSeq:  item.ConcurrentBatchSeq,
			QueueState:          string(item.QueueState),
			QueuePosition:       item.QueuePosition,
			HasRunningExecution: item.HasRunningExecution,
			StartedAt:           item.StartedAt,
			FinishedAt:          item.FinishedAt,
		})
	}
	c.JSON(http.StatusOK, resp)
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
	existing, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, existing.ApplicationID, existing.CreatorUserID) {
		return
	}
	if !ensureReleaseApplicationPermission(c, h.authz, "release.cancel", existing.ApplicationID) {
		return
	}
	item, err := h.manager.Cancel(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	item = h.enrichReleaseOrderResponseMeta(c.Request.Context(), item)
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
	existing, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, existing.ApplicationID, existing.CreatorUserID) {
		return
	}
	if !ensureReleaseApplicationPermission(c, h.authz, "release.execute", existing.ApplicationID) {
		return
	}
	item, err := h.manager.Execute(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	item = h.enrichReleaseOrderResponseMeta(c.Request.Context(), item)
	c.JSON(http.StatusOK, gin.H{"data": toReleaseOrderResponse(item)})
}

// StreamLogs godoc
// @Summary      Stream release order logs
// @Tags         release-orders
// @Produce      text/event-stream
// @Param        id     path   string  true   "Release order ID"
// @Param        start  query  int     false  "Start offset for progressive logs"
// @Success      200
// @Failure      400  {object}  ErrorResponse
// @Failure      404  {object}  ErrorResponse
// @Failure      500  {object}  ErrorResponse
// @Router       /release-orders/{id}/logs/stream [get]
func (h *ReleaseOrderHandler) StreamLogs(c *gin.Context) {
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	if h.logStreamer == nil {
		c.JSON(http.StatusNotImplemented, gin.H{"error": "log stream is not configured"})
		return
	}
	order, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, order.ApplicationID, order.CreatorUserID) {
		return
	}

	startOffset, err := parseNonNegativeInt64Query(c, "start")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "streaming is not supported"})
		return
	}

	c.Header("Content-Type", "text/event-stream; charset=utf-8")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")
	c.Status(http.StatusOK)

	writeEvent := func(event usecase.ReleaseOrderLogEvent) error {
		eventName := strings.TrimSpace(event.Type)
		if eventName == "" {
			eventName = "message"
		}
		payload, marshalErr := json.Marshal(event)
		if marshalErr != nil {
			return marshalErr
		}
		if _, writeErr := fmt.Fprintf(c.Writer, "event: %s\n", eventName); writeErr != nil {
			return writeErr
		}
		if _, writeErr := fmt.Fprintf(c.Writer, "data: %s\n\n", payload); writeErr != nil {
			return writeErr
		}
		flusher.Flush()
		return nil
	}

	streamErr := h.logStreamer.Stream(c.Request.Context(), usecase.StreamReleaseOrderLogInput{
		ReleaseOrderID: c.Param("id"),
		PipelineScope:  domain.PipelineScope(strings.ToLower(strings.TrimSpace(c.Query("scope")))),
		StartOffset:    startOffset,
	}, writeEvent)
	if streamErr != nil && !errors.Is(streamErr, context.Canceled) {
		_ = writeEvent(usecase.ReleaseOrderLogEvent{
			Type:      usecase.ReleaseOrderLogEventTypeError,
			Timestamp: time.Now().UTC(),
			Message:   normalizeReleaseOrderErrorMessage(streamErr),
		})
	}
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
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	if !ensurePermission(c, h.authz, "release.param_snapshot.view", "", "") {
		return
	}
	order, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, order.ApplicationID, order.CreatorUserID) {
		return
	}
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

func (h *ReleaseOrderHandler) ListExecutions(c *gin.Context) {
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	order, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, order.ApplicationID, order.CreatorUserID) {
		return
	}
	items, err := h.manager.ListExecutions(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	resp := make([]ReleaseOrderExecutionResponse, 0, len(items))
	for _, item := range items {
		resp = append(resp, toReleaseOrderExecutionResponse(item))
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
	if !ensureAnyReleaseOrderDisplayPermission(c, h.authz) {
		return
	}
	order, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, order.ApplicationID, order.CreatorUserID) {
		return
	}
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
	existing, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, existing.ApplicationID, existing.CreatorUserID) {
		return
	}
	if !ensureReleaseApplicationPermission(c, h.authz, "release.execute", existing.ApplicationID) {
		return
	}
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
	existing, err := h.manager.GetByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		writeReleaseOrderHTTPError(c, err)
		return
	}
	if !ensureReleaseOrderVisible(c, h.authz, existing.ApplicationID, existing.CreatorUserID) {
		return
	}
	if !ensureReleaseApplicationPermission(c, h.authz, "release.execute", existing.ApplicationID) {
		return
	}
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
		ID:                 item.ID,
		OrderNo:            item.OrderNo,
		PreviousOrderNo:    item.PreviousOrderNo,
		OperationType:      string(item.OperationType),
		SourceOrderID:      item.SourceOrderID,
		SourceOrderNo:      item.SourceOrderNo,
		IsConcurrent:       item.IsConcurrent,
		ConcurrentBatchNo:  item.ConcurrentBatchNo,
		ConcurrentBatchSeq: item.ConcurrentBatchSeq,
		CDProvider:         item.CDProvider,
		ApplicationID:      item.ApplicationID,
		ApplicationName:    item.ApplicationName,
		TemplateID:         item.TemplateID,
		TemplateName:       item.TemplateName,
		BindingID:          item.BindingID,
		PipelineID:         item.PipelineID,
		EnvCode:            item.EnvCode,
		ProjectName:        item.SonService,
		SonService:         item.SonService,
		GitRef:             item.GitRef,
		ImageTag:           item.ImageTag,
		TriggerType:        string(item.TriggerType),
		Status:             string(item.Status),
		Remark:             item.Remark,
		CreatorUserID:      item.CreatorUserID,
		TriggeredBy:        item.TriggeredBy,
		StartedAt:          item.StartedAt,
		FinishedAt:         item.FinishedAt,
		CreatedAt:          item.CreatedAt,
		UpdatedAt:          item.UpdatedAt,
	}
}

func (h *ReleaseOrderHandler) enrichReleaseOrderResponseMeta(ctx context.Context, item domain.ReleaseOrder) domain.ReleaseOrder {
	if h == nil || h.manager == nil || strings.TrimSpace(item.ID) == "" {
		return item
	}
	executions, err := h.manager.ListExecutions(ctx, item.ID)
	if err != nil {
		return item
	}
	for _, execution := range executions {
		if execution.PipelineScope != domain.PipelineScopeCD {
			continue
		}
		item.CDProvider = strings.TrimSpace(execution.Provider)
		break
	}
	return item
}

func toReleaseOrderParamResponse(item domain.ReleaseOrderParam) ReleaseOrderParamResponse {
	return ReleaseOrderParamResponse{
		ID:                item.ID,
		ReleaseOrderID:    item.ReleaseOrderID,
		PipelineScope:     string(item.PipelineScope),
		BindingID:         item.BindingID,
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
		StepScope:      string(item.StepScope),
		ExecutionID:    item.ExecutionID,
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

func toReleaseOrderExecutionResponse(item domain.ReleaseOrderExecution) ReleaseOrderExecutionResponse {
	return ReleaseOrderExecutionResponse{
		ID:             item.ID,
		ReleaseOrderID: item.ReleaseOrderID,
		PipelineScope:  string(item.PipelineScope),
		BindingID:      item.BindingID,
		BindingName:    item.BindingName,
		Provider:       item.Provider,
		PipelineID:     item.PipelineID,
		Status:         string(item.Status),
		QueueURL:       item.QueueURL,
		BuildURL:       item.BuildURL,
		ExternalRunID:  item.ExternalRunID,
		StartedAt:      item.StartedAt,
		FinishedAt:     item.FinishedAt,
		CreatedAt:      item.CreatedAt,
		UpdatedAt:      item.UpdatedAt,
	}
}

func writeReleaseOrderHTTPError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, usecase.ErrInvalidInput),
		errors.Is(err, usecase.ErrInvalidID),
		errors.Is(err, usecase.ErrInvalidStatus),
		errors.Is(err, usecase.ErrInvalidSourceFrom):
		c.JSON(http.StatusBadRequest, gin.H{"error": normalizeReleaseOrderErrorMessage(err)})

	case errors.Is(err, appdomain.ErrNotFound),
		errors.Is(err, pipelinedomain.ErrBindingNotFound),
		errors.Is(err, domain.ErrOrderNotFound),
		errors.Is(err, domain.ErrExecutionNotFound),
		errors.Is(err, domain.ErrStepNotFound),
		errors.Is(err, domain.ErrPipelineStageNotFound),
		errors.Is(err, domain.ErrTemplateNotFound),
		errors.Is(err, domain.ErrDeploySnapshotNotFound):
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})

	case errors.Is(err, domain.ErrOrderDuplicated),
		errors.Is(err, domain.ErrTemplateDuplicated),
		errors.Is(err, usecase.ErrConcurrentReleaseBlocked):
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})

	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}
}

func normalizeReleaseOrderErrorMessage(err error) string {
	if err == nil {
		return "invalid input"
	}

	message := strings.Join(strings.Fields(strings.TrimSpace(err.Error())), " ")
	if message == "" {
		return "invalid input"
	}

	lower := strings.ToLower(message)
	const triggerPrefix = "trigger jenkins failed:"
	if index := strings.Index(lower, triggerPrefix); index >= 0 {
		reason := strings.TrimSpace(message[index+len(triggerPrefix):])
		if reason == "" {
			return "发布执行失败"
		}
		if messageIndex := strings.Index(strings.ToLower(reason), "message="); messageIndex >= 0 {
			reason = strings.TrimSpace(reason[messageIndex+len("message="):])
		}
		if len(reason) > 220 {
			reason = reason[:220] + "..."
		}
		return "发布执行失败：" + reason
	}

	if len(message) > 220 {
		return message[:220] + "..."
	}
	return message
}

func ensureReleaseApplicationPermission(
	c *gin.Context,
	authz RequestAuthorizer,
	permissionCode string,
	applicationID string,
) bool {
	return ensurePermissionWithMessage(
		c,
		authz,
		permissionCode,
		"application",
		strings.TrimSpace(applicationID),
		"无权限：当前应用的发布权限已变更，请刷新页面后重试",
	)
}

func ensureAnyReleaseOrderDisplayPermission(c *gin.Context, authz RequestAuthorizer) bool {
	if _, ok := getCurrentUser(c); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false
	}
	if authz == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
		return false
	}
	// 发布记录展示权限已取消：所有已登录用户都可以查看发布记录。
	return true
}

func ensureReleaseOrderVisible(
	c *gin.Context,
	authz RequestAuthorizer,
	applicationID string,
	creatorUserID string,
) bool {
	if _, ok := getCurrentUser(c); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false
	}
	if authz == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
		return false
	}
	// 发布记录展示权限已取消：所有已登录用户都可以查看任意发布记录详情。
	return true
}

func resolveVisibleReleaseOrderApplicationIDs(
	c *gin.Context,
	authz RequestAuthorizer,
) (allowAll bool, applicationIDs []string, ok bool) {
	user, ok := getCurrentUser(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return false, nil, false
	}
	if authz == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "authorizer is not configured"})
		return false, nil, false
	}
	_ = user
	// 发布记录列表不再按应用范围过滤。
	return true, nil, true
}

func resolveReleaseListApplicationIDs(applicationID string, allowAll bool, visibleApplicationIDs []string) []string {
	if allowAll || strings.TrimSpace(applicationID) != "" {
		return nil
	}
	return visibleApplicationIDs
}

func resolveReleaseOrderCreatorFilter(user userdomain.User) string {
	_ = user
	return ""
}

func writeEmptyReleaseOrderList(c *gin.Context, page int, pageSize int) {
	c.JSON(http.StatusOK, gin.H{
		"data":      []ReleaseOrderResponse{},
		"page":      resolvedPage(page),
		"page_size": resolvedPageSize(pageSize),
		"total":     0,
	})
}

func containsString(items []string, target string) bool {
	value := strings.TrimSpace(target)
	if value == "" {
		return false
	}
	for _, item := range items {
		if strings.TrimSpace(item) == value {
			return true
		}
	}
	return false
}

func firstNonEmpty(values ...string) string {
	for _, item := range values {
		value := strings.TrimSpace(item)
		if value != "" {
			return value
		}
	}
	return ""
}

func resolveTriggeredBy(user userdomain.User) string {
	displayName := strings.TrimSpace(user.DisplayName)
	if displayName != "" {
		return displayName
	}
	username := strings.TrimSpace(user.Username)
	if username != "" {
		return username
	}
	return strings.TrimSpace(user.ID)
}

func parseNonNegativeInt64Query(c *gin.Context, name string) (int64, error) {
	raw := strings.TrimSpace(c.Query(name))
	if raw == "" {
		return 0, nil
	}
	value, err := strconv.ParseInt(raw, 10, 64)
	if err != nil {
		return 0, errors.New(name + " must be an integer")
	}
	if value < 0 {
		return 0, errors.New(name + " must be greater than or equal to 0")
	}
	return value, nil
}
