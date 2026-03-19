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
	GetByID(ctx context.Context, id string) (ReleaseOrder, error)
	List(ctx context.Context, filter ListFilter) ([]ReleaseOrder, int64, error)
	UpdateStatus(
		ctx context.Context,
		id string,
		status OrderStatus,
		startedAt *time.Time,
		finishedAt *time.Time,
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
	) error
	GetTemplateByID(
		ctx context.Context,
		id string,
	) (ReleaseTemplate, []ReleaseTemplateBinding, []ReleaseTemplateParam, []ReleaseTemplateGitOpsRule, error)
	ListTemplates(ctx context.Context, filter TemplateListFilter) ([]ReleaseTemplate, int64, error)
	UpdateTemplate(
		ctx context.Context,
		template ReleaseTemplate,
		bindings []ReleaseTemplateBinding,
		params []ReleaseTemplateParam,
		gitopsRules []ReleaseTemplateGitOpsRule,
	) error
	DeleteTemplate(ctx context.Context, id string) error
}

type ListFilter struct {
	ApplicationID  string
	ApplicationIDs []string
	CreatorUserID  string
	BindingID      string
	EnvCode        string
	Status         OrderStatus
	TriggerType    TriggerType
	Page           int
	PageSize       int
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
