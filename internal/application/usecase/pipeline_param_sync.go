package usecase

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"strings"
	"time"

	domain "gos/internal/domain/pipelineparam"
)

type JenkinsPipelineParamClient interface {
	ListJobParamSets(ctx context.Context) ([]domain.JenkinsJobParamSet, error)
}

type SyncPipelineParamDefs struct {
	repo    domain.Repository
	jenkins JenkinsPipelineParamClient
	now     func() time.Time
}

type SyncPipelineParamDefsOutput struct {
	Total   int `json:"total"`
	Created int `json:"created"`
	Updated int `json:"updated"`
	Skipped int `json:"skipped"`
}

func NewSyncPipelineParamDefs(repo domain.Repository, jenkins JenkinsPipelineParamClient) *SyncPipelineParamDefs {
	return &SyncPipelineParamDefs{
		repo:    repo,
		jenkins: jenkins,
		now: func() time.Time {
			return time.Now().UTC()
		},
	}
}

func (uc *SyncPipelineParamDefs) Execute(ctx context.Context) (SyncPipelineParamDefsOutput, error) {
	jobSets, err := uc.jenkins.ListJobParamSets(ctx)
	if err != nil {
		return SyncPipelineParamDefsOutput{}, err
	}

	now := uc.now()
	items := make([]domain.PipelineParamDef, 0)
	seen := make(map[string]struct{})
	skipped := 0

	for _, jobSet := range jobSets {
		fullName := strings.Trim(strings.TrimSpace(jobSet.JobFullName), "/")
		if fullName == "" {
			skipped++
			continue
		}

		pipelineID := pipelineID("jenkins", fullName)
		for index, snapshot := range jobSet.Params {
			paramName := strings.TrimSpace(snapshot.Name)
			if paramName == "" {
				skipped++
				continue
			}

			uniqueKey := pipelineID + ":" + string(domain.ExecutorTypeJenkins) + ":" + paramName
			if _, exists := seen[uniqueKey]; exists {
				skipped++
				continue
			}
			seen[uniqueKey] = struct{}{}

			paramType := snapshot.ParamType
			if !paramType.Valid() {
				paramType = domain.ParamTypeString
			}

			sortNo := snapshot.SortNo
			if sortNo <= 0 {
				sortNo = index + 1
			}

			items = append(items, domain.PipelineParamDef{
				ID:                pipelineParamDefID(pipelineID, string(domain.ExecutorTypeJenkins), paramName),
				PipelineID:        pipelineID,
				ExecutorType:      domain.ExecutorTypeJenkins,
				ExecutorParamName: paramName,
				ParamKey:          "",
				ParamType:         paramType,
				Required:          snapshot.Required,
				DefaultValue:      strings.TrimSpace(snapshot.DefaultValue),
				Description:       strings.TrimSpace(snapshot.Description),
				Visible:           true,
				Editable:          true,
				SourceFrom:        domain.SourceFromSyncJenkins,
				RawMeta:           strings.TrimSpace(snapshot.RawMeta),
				SortNo:            sortNo,
				CreatedAt:         now,
				UpdatedAt:         now,
			})
		}
	}

	created, updated, err := uc.repo.Upsert(ctx, items)
	if err != nil {
		return SyncPipelineParamDefsOutput{}, err
	}

	return SyncPipelineParamDefsOutput{
		Total:   len(items),
		Created: created,
		Updated: updated,
		Skipped: skipped,
	}, nil
}

func pipelineParamDefID(pipelineID, executorType, executorParamName string) string {
	sum := sha1.Sum([]byte(pipelineID + ":" + executorType + ":" + executorParamName))
	return "ppf-" + hex.EncodeToString(sum[:12])
}
