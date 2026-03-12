package usecase

import domain "gos/internal/domain/application"

type CreateInput struct {
	Name         string
	Key          string
	RepoURL      string
	Description  string
	Owner        string
	Status       domain.Status
	ArtifactType string
	Language     string
}
