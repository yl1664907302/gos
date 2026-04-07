package application

import (
	"time"
)

type GitOpsBranchMapping struct {
	EnvCode string `json:"env_code"`
	Branch  string `json:"branch"`
}

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

type Application struct {
	ID                   string
	Name                 string
	Key                  string
	RepoURL              string
	Description          string
	OwnerUserID          string
	Owner                string
	Status               Status
	ArtifactType         string
	GitOpsBranchMappings []GitOpsBranchMapping
	language             string
	CreatedAt            time.Time
	UpdatedAt            time.Time
}

func (a Application) Language() string {
	return a.language
}

func (a *Application) SetLanguage(language string) {
	a.language = language
}
