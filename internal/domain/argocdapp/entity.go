package argocdapp

import "time"

type Status string

const (
	StatusActive   Status = "active"
	StatusInactive Status = "inactive"
)

func (s Status) Valid() bool {
	switch s {
	case StatusActive, StatusInactive:
		return true
	default:
		return false
	}
}

// Application 是平台侧同步保存的 ArgoCD Application 快照。
//
// 这里有意将模型命名为 Application，而不是 Pipeline：
// 1. ArgoCD 的核心对象是 Application，而不是 Jenkins 风格的 Job/Pipeline；
// 2. 平台当前阶段只需要管理和观察 ArgoCD Application 元数据；
// 3. 后续若将 CD 真正接入 ArgoCD，可在此基础上继续扩展 sync 状态、事件流和 GitOps 提交信息。
type Application struct {
	ID             string
	AppName        string
	Project        string
	RepoURL        string
	SourcePath     string
	TargetRevision string
	DestServer     string
	DestNamespace  string
	SyncStatus     string
	HealthStatus   string
	OperationPhase string
	ArgoCDURL      string
	Status         Status
	RawMeta        string
	LastSyncedAt   time.Time
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type ListFilter struct {
	AppName      string
	Project      string
	SyncStatus   string
	HealthStatus string
	Status       Status
	Page         int
	PageSize     int
}
