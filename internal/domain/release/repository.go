package release

import (
	"context"
	"time"
)

type Repository interface {
	InitSchema(ctx context.Context) error
	Create(
		ctx context.Context,
		order ReleaseOrder,
		executions []ReleaseOrderExecution,
		params []ReleaseOrderParam,
		steps []ReleaseOrderStep,
	) error
	CreateDeploySnapshot(ctx context.Context, snapshot DeploySnapshot) error
	GetDeploySnapshotByOrderID(ctx context.Context, releaseOrderID string) (DeploySnapshot, error)
	UpdateConcurrentBatch(ctx context.Context, orderIDs []string, batchNo string, isConcurrent bool) error
	ListByConcurrentBatchNo(ctx context.Context, batchNo string) ([]ReleaseOrder, error)
	FindActiveOrderByApplicationEnv(ctx context.Context, applicationID string, envCode string, excludeReleaseOrderID string) (ReleaseOrder, error)
	CountActiveOrdersByApplicationEnv(ctx context.Context, applicationID string, envCode string, excludeReleaseOrderID string) (int, error)
	FindActiveExecutionLock(ctx context.Context, lockKey string, excludeReleaseOrderID string, now time.Time) (ReleaseExecutionLock, error)
	AcquireExecutionLock(ctx context.Context, lock ReleaseExecutionLock, now time.Time) (ReleaseExecutionLock, bool, error)
	TouchExecutionLocksByOrderID(ctx context.Context, releaseOrderID string, expiredAt time.Time) error
	ReleaseExecutionLocksByOrderID(ctx context.Context, releaseOrderID string, status ExecutionLockStatus, releasedAt time.Time) error
	GetByID(ctx context.Context, id string) (ReleaseOrder, error)
	List(ctx context.Context, filter ListFilter) ([]ReleaseOrder, int64, error)
	ListTrackableOrders(ctx context.Context, page int, pageSize int) ([]ReleaseOrder, int64, error)
	UpdateStatus(
		ctx context.Context,
		id string,
		status OrderStatus,
		startedAt *time.Time,
		finishedAt *time.Time,
		updatedAt time.Time,
	) (ReleaseOrder, error)
	UpdateApprovalStatus(
		ctx context.Context,
		id string,
		status OrderStatus,
		approvedAt *time.Time,
		approvedBy string,
		rejectedAt *time.Time,
		rejectedBy string,
		rejectedReason string,
		updatedAt time.Time,
	) (ReleaseOrder, error)
	ListExecutions(ctx context.Context, releaseOrderID string) ([]ReleaseOrderExecution, error)
	GetExecutionByScope(ctx context.Context, releaseOrderID string, scope PipelineScope) (ReleaseOrderExecution, error)
	UpdateExecutionByScope(
		ctx context.Context,
		releaseOrderID string,
		scope PipelineScope,
		input ExecutionUpdateInput,
	) (ReleaseOrderExecution, error)
	ListParams(ctx context.Context, releaseOrderID string) ([]ReleaseOrderParam, error)
	ListSteps(ctx context.Context, releaseOrderID string) ([]ReleaseOrderStep, error)
	GetStepByCode(ctx context.Context, releaseOrderID string, stepCode string) (ReleaseOrderStep, error)
	ReplaceSteps(ctx context.Context, releaseOrderID string, steps []ReleaseOrderStep) error
	ReplacePipelineStages(ctx context.Context, releaseOrderID string, stages []ReleaseOrderPipelineStage) error
	ListPipelineStages(ctx context.Context, releaseOrderID string) ([]ReleaseOrderPipelineStage, error)
	GetPipelineStageByID(ctx context.Context, releaseOrderID string, stageID string) (ReleaseOrderPipelineStage, error)
	UpdateStep(
		ctx context.Context,
		releaseOrderID string,
		stepCode string,
		input StepUpdateInput,
	) (ReleaseOrderStep, error)
	CreateTemplate(
		ctx context.Context,
		template ReleaseTemplate,
		bindings []ReleaseTemplateBinding,
		params []ReleaseTemplateParam,
		gitopsRules []ReleaseTemplateGitOpsRule,
		hooks []ReleaseTemplateHook,
	) error
	GetTemplateByID(
		ctx context.Context,
		id string,
	) (ReleaseTemplate, []ReleaseTemplateBinding, []ReleaseTemplateParam, []ReleaseTemplateGitOpsRule, []ReleaseTemplateHook, error)
	ListTemplates(ctx context.Context, filter TemplateListFilter) ([]ReleaseTemplate, int64, error)
	UpdateTemplate(
		ctx context.Context,
		template ReleaseTemplate,
		bindings []ReleaseTemplateBinding,
		params []ReleaseTemplateParam,
		gitopsRules []ReleaseTemplateGitOpsRule,
		hooks []ReleaseTemplateHook,
	) error
	DeleteTemplate(ctx context.Context, id string) error
	CreateApprovalRecord(ctx context.Context, item ReleaseOrderApprovalRecord) error
	ListApprovalRecords(ctx context.Context, releaseOrderID string) ([]ReleaseOrderApprovalRecord, error)
	ListApprovalRecordSummaries(ctx context.Context, filter ApprovalRecordListFilter) ([]ReleaseOrderApprovalRecordSummary, int64, error)
}

type ListFilter struct {
	ApplicationID               string
	ApplicationIDs              []string
	VisibleApplicationEnvScopes []ApplicationEnvScope
	VisibleToUserID             string
	ApprovalApproverUserID      string
	CreatorUserID               string
	BindingID                   string
	EnvCode                     string
	Status                      OrderStatus
	TriggerType                 TriggerType
	Page                        int
	PageSize                    int
}

type StepUpdateInput struct {
	Status     StepStatus
	Message    string
	StartedAt  *time.Time
	FinishedAt *time.Time
}

type ExecutionUpdateInput struct {
	Status        ExecutionStatus
	QueueURL      string
	BuildURL      string
	ExternalRunID string
	StartedAt     *time.Time
	FinishedAt    *time.Time
	UpdatedAt     time.Time
}

type TemplateListFilter struct {
	ApplicationID  string
	ApplicationIDs []string
	BindingID      string
	Status         TemplateStatus
	Page           int
	PageSize       int
}

type ApprovalRecordListFilter struct {
	ApplicationID               string
	ApplicationIDs              []string
	VisibleApplicationEnvScopes []ApplicationEnvScope
	VisibleToUserID             string
	OperatorUserID              string
	Page                        int
	PageSize                    int
}

type ApplicationEnvScope struct {
	ApplicationID string
	EnvCode       string
}
