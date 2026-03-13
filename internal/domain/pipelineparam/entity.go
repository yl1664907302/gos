package pipelineparam

import "time"

type ExecutorType string

const (
	ExecutorTypeJenkins ExecutorType = "jenkins"
	ExecutorTypeArgoCD  ExecutorType = "argocd"
	ExecutorTypeCustom  ExecutorType = "custom"
)

func (t ExecutorType) Valid() bool {
	switch t {
	case ExecutorTypeJenkins, ExecutorTypeArgoCD, ExecutorTypeCustom:
		return true
	default:
		return false
	}
}

type ParamType string

const (
	ParamTypeString ParamType = "string"
	ParamTypeChoice ParamType = "choice"
	ParamTypeBool   ParamType = "bool"
	ParamTypeNumber ParamType = "number"
)

func (t ParamType) Valid() bool {
	switch t {
	case ParamTypeString, ParamTypeChoice, ParamTypeBool, ParamTypeNumber:
		return true
	default:
		return false
	}
}

type SourceFrom string

const (
	SourceFromSyncJenkins SourceFrom = "sync_jenkins"
	SourceFromManual      SourceFrom = "manual"
)

func (s SourceFrom) Valid() bool {
	switch s {
	case SourceFromSyncJenkins, SourceFromManual:
		return true
	default:
		return false
	}
}

type PipelineParamDef struct {
	ID                string
	PipelineID        string
	ExecutorType      ExecutorType
	ExecutorParamName string
	ParamKey          string
	ParamType         ParamType
	SingleSelect      bool
	Required          bool
	DefaultValue      string
	Description       string
	Visible           bool
	Editable          bool
	SourceFrom        SourceFrom
	RawMeta           string
	SortNo            int
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

type JenkinsParamSnapshot struct {
	Name         string
	ParamType    ParamType
	SingleSelect bool
	Required     bool
	DefaultValue string
	Description  string
	RawMeta      string
	SortNo       int
}

type JenkinsJobParamSet struct {
	JobName     string
	JobFullName string
	Params      []JenkinsParamSnapshot
}
