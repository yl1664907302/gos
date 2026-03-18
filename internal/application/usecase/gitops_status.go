package usecase

import (
	"context"
	"fmt"
	"strings"

	platformparamdomain "gos/internal/domain/platformparam"
	gitopsinfra "gos/internal/infrastructure/gitops"
)

type GitOpsStatusReader interface {
	GetStatus(ctx context.Context) (gitopsinfra.Status, error)
}

type QueryGitOpsStatusOutput struct {
	Enabled               bool     `json:"enabled"`
	LocalRoot             string   `json:"local_root"`
	Mode                  string   `json:"mode"`
	DefaultBranch         string   `json:"default_branch"`
	Username              string   `json:"username"`
	AuthorName            string   `json:"author_name"`
	AuthorEmail           string   `json:"author_email"`
	CommitMessageTemplate string   `json:"commit_message_template"`
	CommandTimeoutSec     int      `json:"command_timeout_sec"`
	PathExists            bool     `json:"path_exists"`
	IsGitRepo             bool     `json:"is_git_repo"`
	RemoteOrigin          string   `json:"remote_origin"`
	RemoteReachable       bool     `json:"remote_reachable"`
	CurrentBranch         string   `json:"current_branch"`
	HeadCommit            string   `json:"head_commit"`
	HeadCommitShort       string   `json:"head_commit_short"`
	HeadCommitSubject     string   `json:"head_commit_subject"`
	WorktreeDirty         bool     `json:"worktree_dirty"`
	StatusSummary         []string `json:"status_summary"`
}

type QueryGitOpsStatus struct {
	reader GitOpsStatusReader
}

type GitOpsBindingTargetReader interface {
	ListBindingTargets(ctx context.Context) ([]gitopsinfra.BindingTarget, error)
}

type QueryGitOpsBindingTargetOutput struct {
	Path                  string   `json:"path"`
	AppDirectory          string   `json:"app_directory"`
	DisplayName           string   `json:"display_name"`
	HierarchyHint         string   `json:"hierarchy_hint"`
	AvailableEnvironments []string `json:"available_environments"`
}

type QueryGitOpsBindingTargets struct {
	reader GitOpsBindingTargetReader
}

type GitOpsTemplateFieldReader interface {
	List(ctx context.Context, filter platformparamdomain.ListFilter) ([]platformparamdomain.PlatformParamDict, int64, error)
}

type QueryGitOpsTemplateFieldOutput struct {
	ParamKey    string `json:"param_key"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Builtin     bool   `json:"builtin"`
	Required    bool   `json:"required"`
}

type QueryGitOpsTemplateFields struct {
	reader GitOpsTemplateFieldReader
}

func NewQueryGitOpsStatus(reader GitOpsStatusReader) *QueryGitOpsStatus {
	return &QueryGitOpsStatus{reader: reader}
}

func NewQueryGitOpsBindingTargets(reader GitOpsBindingTargetReader) *QueryGitOpsBindingTargets {
	return &QueryGitOpsBindingTargets{reader: reader}
}

func NewQueryGitOpsTemplateFields(reader GitOpsTemplateFieldReader) *QueryGitOpsTemplateFields {
	return &QueryGitOpsTemplateFields{reader: reader}
}

func (uc *QueryGitOpsStatus) Execute(ctx context.Context) (QueryGitOpsStatusOutput, error) {
	if uc == nil || uc.reader == nil {
		return QueryGitOpsStatusOutput{}, fmt.Errorf("%w: gitops manager is not configured", ErrInvalidInput)
	}
	status, err := uc.reader.GetStatus(ctx)
	if err != nil {
		return QueryGitOpsStatusOutput{}, err
	}
	headCommit := strings.TrimSpace(status.HeadCommit)
	return QueryGitOpsStatusOutput{
		Enabled:               status.Enabled,
		LocalRoot:             strings.TrimSpace(status.LocalRoot),
		Mode:                  strings.TrimSpace(status.Mode),
		DefaultBranch:         strings.TrimSpace(status.DefaultBranch),
		Username:              strings.TrimSpace(status.Username),
		AuthorName:            strings.TrimSpace(status.AuthorName),
		AuthorEmail:           strings.TrimSpace(status.AuthorEmail),
		CommitMessageTemplate: strings.TrimSpace(status.CommitMessageTemplate),
		CommandTimeoutSec:     status.CommandTimeoutSec,
		PathExists:            status.PathExists,
		IsGitRepo:             status.IsGitRepo,
		RemoteOrigin:          strings.TrimSpace(status.RemoteOrigin),
		RemoteReachable:       status.RemoteReachable,
		CurrentBranch:         strings.TrimSpace(status.CurrentBranch),
		HeadCommit:            headCommit,
		HeadCommitShort:       shortCommit(headCommit),
		HeadCommitSubject:     strings.TrimSpace(status.HeadCommitSubject),
		WorktreeDirty:         status.WorktreeDirty,
		StatusSummary:         append([]string(nil), status.StatusSummary...),
	}, nil
}

func shortCommit(value string) string {
	value = strings.TrimSpace(value)
	if len(value) <= 12 {
		return value
	}
	return value[:12]
}

func (uc *QueryGitOpsBindingTargets) Execute(ctx context.Context) ([]QueryGitOpsBindingTargetOutput, error) {
	if uc == nil || uc.reader == nil {
		return nil, fmt.Errorf("%w: gitops manager is not configured", ErrInvalidInput)
	}
	items, err := uc.reader.ListBindingTargets(ctx)
	if err != nil {
		return nil, err
	}
	result := make([]QueryGitOpsBindingTargetOutput, 0, len(items))
	for _, item := range items {
		result = append(result, QueryGitOpsBindingTargetOutput{
			Path:                  strings.TrimSpace(item.Path),
			AppDirectory:          strings.TrimSpace(item.AppDirectory),
			DisplayName:           strings.TrimSpace(item.DisplayName),
			HierarchyHint:         strings.TrimSpace(item.HierarchyHint),
			AvailableEnvironments: append([]string(nil), item.AvailableEnvironments...),
		})
	}
	return result, nil
}

func (uc *QueryGitOpsTemplateFields) Execute(ctx context.Context) ([]QueryGitOpsTemplateFieldOutput, error) {
	if uc == nil || uc.reader == nil {
		return nil, fmt.Errorf("%w: gitops manager is not configured", ErrInvalidInput)
	}
	status := platformparamdomain.StatusEnabled
	items, _, err := uc.reader.List(ctx, platformparamdomain.ListFilter{
		Status:   &status,
		Page:     1,
		PageSize: 500,
	})
	if err != nil {
		return nil, err
	}

	result := make([]QueryGitOpsTemplateFieldOutput, 0, len(items))
	for _, item := range items {
		result = append(result, QueryGitOpsTemplateFieldOutput{
			ParamKey:    strings.TrimSpace(item.ParamKey),
			Name:        strings.TrimSpace(item.Name),
			Description: strings.TrimSpace(item.Description),
			Builtin:     item.Builtin,
			Required:    item.Required,
		})
	}
	return result, nil
}
