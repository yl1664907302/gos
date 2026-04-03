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

type OperationType string

const (
	OperationTypeDeploy   OperationType = "deploy"
	OperationTypeRollback OperationType = "rollback"
	OperationTypeReplay   OperationType = "replay"
)

func (t OperationType) Valid() bool {
	switch t {
	case OperationTypeDeploy, OperationTypeRollback, OperationTypeReplay:
		return true
	default:
		return false
	}
}

type ReleaseBusinessStatus string

const (
	ReleaseBusinessStatusDraft            ReleaseBusinessStatus = "draft"
	ReleaseBusinessStatusPendingExecution ReleaseBusinessStatus = "pending_execution"
	ReleaseBusinessStatusPendingApproval  ReleaseBusinessStatus = "pending_approval"
	ReleaseBusinessStatusApproving        ReleaseBusinessStatus = "approving"
	ReleaseBusinessStatusApproved         ReleaseBusinessStatus = "approved"
	ReleaseBusinessStatusRejected         ReleaseBusinessStatus = "rejected"
	ReleaseBusinessStatusQueued           ReleaseBusinessStatus = "queued"
	ReleaseBusinessStatusDeploying        ReleaseBusinessStatus = "deploying"
	ReleaseBusinessStatusDeploySuccess    ReleaseBusinessStatus = "deploy_success"
	ReleaseBusinessStatusDeployFailed     ReleaseBusinessStatus = "deploy_failed"
	ReleaseBusinessStatusCancelled        ReleaseBusinessStatus = "cancelled"
)

func (s ReleaseBusinessStatus) Valid() bool {
	switch s {
	case ReleaseBusinessStatusDraft,
		ReleaseBusinessStatusPendingExecution,
		ReleaseBusinessStatusPendingApproval,
		ReleaseBusinessStatusApproving,
		ReleaseBusinessStatusApproved,
		ReleaseBusinessStatusRejected,
		ReleaseBusinessStatusQueued,
		ReleaseBusinessStatusDeploying,
		ReleaseBusinessStatusDeploySuccess,
		ReleaseBusinessStatusDeployFailed,
		ReleaseBusinessStatusCancelled:
		return true
	default:
		return false
	}
}

type OrderStatus string

const (
	OrderStatusPending         OrderStatus = "pending"
	OrderStatusRunning         OrderStatus = "running"
	OrderStatusSuccess         OrderStatus = "success"
	OrderStatusFailed          OrderStatus = "failed"
	OrderStatusCancelled       OrderStatus = "cancelled"
	OrderStatusDraft           OrderStatus = "draft"
	OrderStatusPendingApproval OrderStatus = "pending_approval"
	OrderStatusApproving       OrderStatus = "approving"
	OrderStatusApproved        OrderStatus = "approved"
	OrderStatusRejected        OrderStatus = "rejected"
	OrderStatusQueued          OrderStatus = "queued"
	OrderStatusDeploying       OrderStatus = "deploying"
	OrderStatusDeploySuccess   OrderStatus = "deploy_success"
	OrderStatusDeployFailed    OrderStatus = "deploy_failed"
)

func (s OrderStatus) Valid() bool {
	switch s {
	case OrderStatusPending,
		OrderStatusRunning,
		OrderStatusSuccess,
		OrderStatusFailed,
		OrderStatusCancelled,
		OrderStatusDraft,
		OrderStatusPendingApproval,
		OrderStatusApproving,
		OrderStatusApproved,
		OrderStatusRejected,
		OrderStatusQueued,
		OrderStatusDeploying,
		OrderStatusDeploySuccess,
		OrderStatusDeployFailed:
		return true
	default:
		return false
	}
}

func (s OrderStatus) IsTerminal() bool {
	switch s {
	case OrderStatusSuccess,
		OrderStatusFailed,
		OrderStatusCancelled,
		OrderStatusRejected,
		OrderStatusDeploySuccess,
		OrderStatusDeployFailed:
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
	ValueSourceCIParam      ValueSource = "ci_param"
	ValueSourceBuiltin      ValueSource = "builtin"
)

func (s ValueSource) Valid() bool {
	switch s {
	case ValueSourceApplication, ValueSourceEnvironment, ValueSourceReleaseInput, ValueSourceFixed, ValueSourceCIParam, ValueSourceBuiltin:
		return true
	default:
		return false
	}
}

type ReleaseOrder struct {
	ID                    string
	OrderNo               string
	PreviousOrderNo       string
	OperationType         OperationType
	SourceOrderID         string
	SourceOrderNo         string
	IsConcurrent          bool
	ConcurrentBatchNo     string
	ConcurrentBatchSeq    int
	CDProvider            string
	ApplicationID         string
	ApplicationName       string
	TemplateID            string
	TemplateName          string
	BindingID             string
	PipelineID            string
	EnvCode               string
	SonService            string
	GitRef                string
	ImageTag              string
	TriggerType           TriggerType
	Status                OrderStatus
	BusinessStatus        ReleaseBusinessStatus
	ApprovalRequired      bool
	ApprovalMode          TemplateApprovalMode
	ApprovalApproverIDs   []string
	ApprovalApproverNames []string
	ApprovedAt            *time.Time
	ApprovedBy            string
	RejectedAt            *time.Time
	RejectedBy            string
	RejectedReason        string
	QueuePosition         int
	QueuedReason          string
	Remark                string
	CreatorUserID         string
	TriggeredBy           string
	StartedAt             *time.Time
	FinishedAt            *time.Time
	CreatedAt             time.Time
	UpdatedAt             time.Time
}

type DeploySnapshot struct {
	ID               string
	ReleaseOrderID   string
	Provider         string
	GitOpsType       GitOpsType
	ArgoCDInstanceID string
	GitOpsInstanceID string
	ArgoCDAppName    string
	RepoURL          string
	Branch           string
	SourcePath       string
	EnvCode          string
	SnapshotPayload  string
	CreatedAt        time.Time
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

type ExecutionLockScope string

const (
	ExecutionLockScopeApplication      ExecutionLockScope = "application"
	ExecutionLockScopeApplicationEnv   ExecutionLockScope = "application_env"
	ExecutionLockScopeGitOpsRepoBranch ExecutionLockScope = "gitops_repo_branch"
)

func (s ExecutionLockScope) Valid() bool {
	switch s {
	case ExecutionLockScopeApplication, ExecutionLockScopeApplicationEnv, ExecutionLockScopeGitOpsRepoBranch:
		return true
	default:
		return false
	}
}

type ExecutionLockStatus string

const (
	ExecutionLockStatusActive   ExecutionLockStatus = "active"
	ExecutionLockStatusReleased ExecutionLockStatus = "released"
	ExecutionLockStatusExpired  ExecutionLockStatus = "expired"
)

func (s ExecutionLockStatus) Valid() bool {
	switch s {
	case ExecutionLockStatusActive, ExecutionLockStatusReleased, ExecutionLockStatusExpired:
		return true
	default:
		return false
	}
}

type ReleaseExecutionLock struct {
	ID             string
	LockScope      ExecutionLockScope
	LockKey        string
	ApplicationID  string
	EnvCode        string
	ReleaseOrderID string
	ReleaseOrderNo string
	Status         ExecutionLockStatus
	OwnerType      string
	CreatedAt      time.Time
	ExpiredAt      *time.Time
	ReleasedAt     *time.Time
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
	ID                    string
	Name                  string
	ApplicationID         string
	ApplicationName       string
	BindingID             string
	BindingName           string
	BindingType           string
	GitOpsType            GitOpsType
	Status                TemplateStatus
	ApprovalEnabled       bool
	ApprovalMode          TemplateApprovalMode
	ApprovalApproverIDs   []string
	ApprovalApproverNames []string
	Remark                string
	ParamCount            int
	CreatedAt             time.Time
	UpdatedAt             time.Time
}

type TemplateApprovalMode string

const (
	TemplateApprovalModeAny TemplateApprovalMode = "any"
	TemplateApprovalModeAll TemplateApprovalMode = "all"
)

func (s TemplateApprovalMode) Valid() bool {
	switch s {
	case "", TemplateApprovalModeAny, TemplateApprovalModeAll:
		return true
	default:
		return false
	}
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
	ValueSource        TemplateParamValueSource
	SourceParamKey     string
	SourceParamName    string
	FixedValue         string
	Required           bool
	SortNo             int
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

type TemplateParamValueSource string

const (
	TemplateParamValueSourceReleaseInput TemplateParamValueSource = "release_input"
	TemplateParamValueSourceFixed        TemplateParamValueSource = "fixed"
	TemplateParamValueSourceCIParam      TemplateParamValueSource = "ci_param"
	TemplateParamValueSourceBuiltin      TemplateParamValueSource = "builtin"
)

func (s TemplateParamValueSource) Valid() bool {
	switch s {
	case TemplateParamValueSourceReleaseInput, TemplateParamValueSourceFixed, TemplateParamValueSourceCIParam, TemplateParamValueSourceBuiltin:
		return true
	default:
		return false
	}
}

type GitOpsRuleSourceFrom string

const (
	GitOpsRuleSourceCI      GitOpsRuleSourceFrom = "ci"
	GitOpsRuleSourceBuiltin GitOpsRuleSourceFrom = "builtin"
	GitOpsRuleSourceCDInput GitOpsRuleSourceFrom = "cd_input"
)

func (s GitOpsRuleSourceFrom) Valid() bool {
	switch s {
	case GitOpsRuleSourceCI, GitOpsRuleSourceBuiltin, GitOpsRuleSourceCDInput:
		return true
	default:
		return false
	}
}

type GitOpsType string

const (
	GitOpsTypeKustomize GitOpsType = "kustomize"
	GitOpsTypeHelm      GitOpsType = "helm"
)

func (s GitOpsType) Valid() bool {
	switch s {
	case "", GitOpsTypeKustomize, GitOpsTypeHelm:
		return true
	default:
		return false
	}
}

// ReleaseTemplateGitOpsRule 描述 CD=ArgoCD 时，标准平台 Key 与 YAML 字段之间的替换关系。
//
// 当前版本先把规则挂在“发布模板”上，而不是直接挂在应用上：
// 1. 模板已经定义了本次发布采用的 CI/CD 结构；
// 2. GitOps 字段替换与模板里的参数暴露方式强相关；
// 3. 这样可以让不同模板在同一应用下拥有不同的 GitOps 写回策略。
type ReleaseTemplateGitOpsRule struct {
	ID               string
	TemplateID       string
	PipelineScope    PipelineScope
	SourceParamKey   string
	SourceParamName  string
	SourceFrom       GitOpsRuleSourceFrom
	LocatorParamKey  string
	LocatorParamName string
	FilePathTemplate string
	DocumentKind     string
	DocumentName     string
	TargetPath       string
	ValueTemplate    string
	SortNo           int
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

type TemplateHookType string

const (
	TemplateHookTypeAgentTask           TemplateHookType = "agent_task"
	TemplateHookTypeWebhookNotification TemplateHookType = "webhook_notification"
)

func (s TemplateHookType) Valid() bool {
	switch s {
	case TemplateHookTypeAgentTask, TemplateHookTypeWebhookNotification:
		return true
	default:
		return false
	}
}

type TemplateHookTriggerCondition string

const (
	TemplateHookTriggerOnSuccess TemplateHookTriggerCondition = "on_success"
	TemplateHookTriggerOnFailed  TemplateHookTriggerCondition = "on_failed"
	TemplateHookTriggerAlways    TemplateHookTriggerCondition = "always"
)

func (s TemplateHookTriggerCondition) Valid() bool {
	switch s {
	case TemplateHookTriggerOnSuccess, TemplateHookTriggerOnFailed, TemplateHookTriggerAlways:
		return true
	default:
		return false
	}
}

type TemplateHookFailurePolicy string

const (
	TemplateHookFailurePolicyBlockRelease TemplateHookFailurePolicy = "block_release"
	TemplateHookFailurePolicyWarnOnly     TemplateHookFailurePolicy = "warn_only"
)

func (s TemplateHookFailurePolicy) Valid() bool {
	switch s {
	case TemplateHookFailurePolicyBlockRelease, TemplateHookFailurePolicyWarnOnly:
		return true
	default:
		return false
	}
}

type ReleaseTemplateHook struct {
	ID               string
	TemplateID       string
	HookType         TemplateHookType
	Name             string
	TriggerCondition TemplateHookTriggerCondition
	FailurePolicy    TemplateHookFailurePolicy
	TargetID         string
	TargetName       string
	WebhookMethod    string
	WebhookURL       string
	WebhookBody      string
	Note             string
	SortNo           int
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

type ReleaseOrderApprovalAction string

const (
	ReleaseOrderApprovalActionSubmit  ReleaseOrderApprovalAction = "submit"
	ReleaseOrderApprovalActionApprove ReleaseOrderApprovalAction = "approve"
	ReleaseOrderApprovalActionReject  ReleaseOrderApprovalAction = "reject"
)

func (s ReleaseOrderApprovalAction) Valid() bool {
	switch s {
	case ReleaseOrderApprovalActionSubmit, ReleaseOrderApprovalActionApprove, ReleaseOrderApprovalActionReject:
		return true
	default:
		return false
	}
}

type ReleaseOrderApprovalRecord struct {
	ID             string
	ReleaseOrderID string
	Action         ReleaseOrderApprovalAction
	OperatorUserID string
	OperatorName   string
	Comment        string
	CreatedAt      time.Time
}

type ReleaseOrderApprovalRecordSummary struct {
	ReleaseOrderApprovalRecord
	OrderNo         string
	OrderStatus     OrderStatus
	ApplicationID   string
	ApplicationName string
	EnvCode         string
	OperationType   OperationType
	TriggeredBy     string
}
