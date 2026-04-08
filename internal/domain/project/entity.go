package project

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

type Project struct {
	ID          string
	Name        string
	Key         string
	Description string
	Status      Status
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
