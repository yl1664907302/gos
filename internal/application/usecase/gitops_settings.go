package usecase

import (
	"context"
	"fmt"
	"strings"

	gitopsinfra "gos/internal/infrastructure/gitops"
)

type GitOpsCommitTemplateUpdater interface {
	UpdateCommitMessageTemplate(template string) string
}

type GitOpsCommitTemplateStore interface {
	SaveCommitMessageTemplate(ctx context.Context, template string) error
}

type UpdateGitOpsCommitTemplateInput struct {
	Template string
}

type UpdateGitOpsCommitTemplate struct {
	store   GitOpsCommitTemplateStore
	updater GitOpsCommitTemplateUpdater
	reader  *QueryGitOpsStatus
}

func NewUpdateGitOpsCommitTemplate(
	store GitOpsCommitTemplateStore,
	updater GitOpsCommitTemplateUpdater,
	reader *QueryGitOpsStatus,
) *UpdateGitOpsCommitTemplate {
	return &UpdateGitOpsCommitTemplate{
		store:   store,
		updater: updater,
		reader:  reader,
	}
}

func (uc *UpdateGitOpsCommitTemplate) Execute(
	ctx context.Context,
	input UpdateGitOpsCommitTemplateInput,
) (QueryGitOpsStatusOutput, error) {
	if uc == nil || uc.store == nil || uc.updater == nil || uc.reader == nil {
		return QueryGitOpsStatusOutput{}, fmt.Errorf("%w: gitops manager is not configured", ErrInvalidInput)
	}

	normalized := gitopsinfra.NormalizeCommitMessageTemplate(strings.TrimSpace(input.Template))
	if err := uc.store.SaveCommitMessageTemplate(ctx, normalized); err != nil {
		return QueryGitOpsStatusOutput{}, err
	}
	uc.updater.UpdateCommitMessageTemplate(normalized)
	return uc.reader.Execute(ctx)
}
