package release

import "time"

type PipelineScope string

const (
	PipelineScopeCI PipelineScope = "ci"
	PipelineScopeCD PipelineScope = "cd"
)

func (s PipelineScope) Valid() bool {
	switch s {
	case PipelineScopeCI, PipelineScopeCD:
		return true
	default:
		return false
	}
}

type StepScope string

const (
	StepScopeGlobal StepScope = "global"
	StepScopeCI     StepScope = "ci"
	StepScopeCD     StepScope = "cd"
)

func (s StepScope) Valid() bool {
	switch s {
	case StepScopeGlobal, StepScopeCI, StepScopeCD:
		return true
	default:
		return false
	}
}

type TriggerType string

const (
	TriggerTypeManual   TriggerType = "manual"
	TriggerTypeWebhook  TriggerType = "webhook"
	TriggerTypeSchedule TriggerType = "schedule"
)

func (t TriggerType) Valid() bool {
	switch t {
	case TriggerTypeManual, TriggerTypeWebhook, TriggerTypeSchedule:
		return true
	default:
		return false
	}
}

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusRunning   OrderStatus = "running"
	OrderStatusSuccess   OrderStatus = "success"
	OrderStatusFailed    OrderStatus = "failed"
	OrderStatusCancelled OrderStatus = "cancelled"
)

func (s OrderStatus) Valid() bool {
	switch s {
	case OrderStatusPending, OrderStatusRunning, OrderStatusSuccess, OrderStatusFailed, OrderStatusCancelled:
		return true
	default:
		return false
	}
}

func (s OrderStatus) IsTerminal() bool {
	switch s {
	case OrderStatusSuccess, OrderStatusFailed, OrderStatusCancelled:
		return true
	default:
		return false
	}
}

type ExecutionStatus string

const (
	ExecutionStatusPending   ExecutionStatus = "pending"
	ExecutionStatusRunning   ExecutionStatus = "running"
	ExecutionStatusSuccess   ExecutionStatus = "success"
	ExecutionStatusFailed    ExecutionStatus = "failed"
	ExecutionStatusCancelled ExecutionStatus = "cancelled"
	ExecutionStatusSkipped   ExecutionStatus = "skipped"
)

func (s ExecutionStatus) Valid() bool {
	switch s {
	case ExecutionStatusPending,
		ExecutionStatusRunning,
		ExecutionStatusSuccess,
		ExecutionStatusFailed,
		ExecutionStatusCancelled,
		ExecutionStatusSkipped:
		return true
	default:
		return false
	}
}

func (s ExecutionStatus) IsTerminal() bool {
	switch s {
	case ExecutionStatusSuccess, ExecutionStatusFailed, ExecutionStatusCancelled, ExecutionStatusSkipped:
		return true
	default:
		return false
	}
}

type StepStatus string

const (
	StepStatusPending StepStatus = "pending"
	StepStatusRunning StepStatus = "running"
	StepStatusSuccess StepStatus = "success"
	StepStatusFailed  StepStatus = "failed"
)

func (s StepStatus) Valid() bool {
	switch s {
	case StepStatusPending, StepStatusRunning, StepStatusSuccess, StepStatusFailed:
		return true
	default:
		return false
	}
}

type ValueSource string

const (
	ValueSourceApplication  ValueSource = "application"
	ValueSourceEnvironment  ValueSource = "environment"
	ValueSourceReleaseInput ValueSource = "release_input"
	ValueSourceFixed        ValueSource = "fixed"
)

func (s ValueSource) Valid() bool {
	switch s {
	case ValueSourceApplication, ValueSourceEnvironment, ValueSourceReleaseInput, ValueSourceFixed:
		return true
	default:
		return false
	}
}

type ReleaseOrder struct {
	ID              string
	OrderNo         string
	PreviousOrderNo string
	ApplicationID   string
	ApplicationName string
	TemplateID      string
	TemplateName    string
	BindingID       string
	PipelineID      string
	EnvCode         string
	SonService      string
	GitRef          string
	ImageTag        string
	TriggerType     TriggerType
	Status          OrderStatus
	Remark          string
	CreatorUserID   string
	TriggeredBy     string
	StartedAt       *time.Time
	FinishedAt      *time.Time
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type ReleaseOrderParam struct {
	ID                string
	ReleaseOrderID    string
	PipelineScope     PipelineScope
	BindingID         string
	ParamKey          string
	ExecutorParamName string
	ParamValue        string
	ValueSource       ValueSource
	CreatedAt         time.Time
}

type ReleaseOrderExecution struct {
	ID             string
	ReleaseOrderID string
	PipelineScope  PipelineScope
	BindingID      string
	BindingName    string
	Provider       string
	PipelineID     string
	Status         ExecutionStatus
	QueueURL       string
	BuildURL       string
	ExternalRunID  string
	StartedAt      *time.Time
	FinishedAt     *time.Time
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type ReleaseOrderStep struct {
	ID             string
	ReleaseOrderID string
	StepScope      StepScope
	ExecutionID    string
	StepCode       string
	StepName       string
	Status         StepStatus
	Message        string
	SortNo         int
	StartedAt      *time.Time
	FinishedAt     *time.Time
	CreatedAt      time.Time
}

type PipelineStageStatus string

const (
	PipelineStageStatusPending   PipelineStageStatus = "pending"
	PipelineStageStatusRunning   PipelineStageStatus = "running"
	PipelineStageStatusSuccess   PipelineStageStatus = "success"
	PipelineStageStatusFailed    PipelineStageStatus = "failed"
	PipelineStageStatusCancelled PipelineStageStatus = "cancelled"
	PipelineStageStatusSkipped   PipelineStageStatus = "skipped"
)

func (s PipelineStageStatus) Valid() bool {
	switch s {
	case PipelineStageStatusPending,
		PipelineStageStatusRunning,
		PipelineStageStatusSuccess,
		PipelineStageStatusFailed,
		PipelineStageStatusCancelled,
		PipelineStageStatusSkipped:
		return true
	default:
		return false
	}
}

type ReleaseOrderPipelineStage struct {
	ID             string
	ReleaseOrderID string
	ExecutionID    string
	PipelineScope  string
	ExecutorType   string
	StageKey       string
	StageName      string
	Status         PipelineStageStatus
	RawStatus      string
	SortNo         int
	DurationMillis int64
	StartedAt      *time.Time
	FinishedAt     *time.Time
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type ReleaseOrderPipelineStageLog struct {
	ReleaseOrderID string
	StageID        string
	PipelineScope  string
	ExecutorType   string
	StageName      string
	RawStatus      string
	Content        string
	HasMore        bool
	FetchedAt      time.Time
}

type TemplateStatus string

const (
	TemplateStatusActive   TemplateStatus = "active"
	TemplateStatusInactive TemplateStatus = "inactive"
)

func (s TemplateStatus) Valid() bool {
	switch s {
	case TemplateStatusActive, TemplateStatusInactive:
		return true
	default:
		return false
	}
}

type ReleaseTemplate struct {
	ID              string
	Name            string
	ApplicationID   string
	ApplicationName string
	BindingID       string
	BindingName     string
	BindingType     string
	Status          TemplateStatus
	Remark          string
	ParamCount      int
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

type ReleaseTemplateBinding struct {
	ID            string
	TemplateID    string
	PipelineScope PipelineScope
	BindingID     string
	BindingName   string
	Provider      string
	PipelineID    string
	Enabled       bool
	SortNo        int
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type ReleaseTemplateParam struct {
	ID                string
	TemplateID        string
	TemplateBindingID string
	PipelineScope     PipelineScope
	BindingID         string
	// ExecutorParamDefID 关联统一的执行器参数定义。
	// 这里不再使用 pipeline_param_def 的命名，是为了让发布模板同时兼容 Jenkins 与 ArgoCD。
	ExecutorParamDefID string
	ParamKey           string
	ParamName          string
	ExecutorParamName  string
	Required           bool
	SortNo             int
	CreatedAt          time.Time
	UpdatedAt          time.Time
}
