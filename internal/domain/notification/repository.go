package notification

import "context"

type Repository interface {
	InitSchema(ctx context.Context) error

	CreateSource(ctx context.Context, item Source) (Source, error)
	UpdateSource(ctx context.Context, item Source) (Source, error)
	GetSourceByID(ctx context.Context, id string) (Source, error)
	ListSources(ctx context.Context, filter SourceListFilter) ([]Source, int64, error)
	DeleteSource(ctx context.Context, id string) error

	CreateMarkdownTemplate(ctx context.Context, item MarkdownTemplate) (MarkdownTemplate, error)
	UpdateMarkdownTemplate(ctx context.Context, item MarkdownTemplate) (MarkdownTemplate, error)
	GetMarkdownTemplateByID(ctx context.Context, id string) (MarkdownTemplate, error)
	ListMarkdownTemplates(ctx context.Context, filter MarkdownTemplateListFilter) ([]MarkdownTemplate, int64, error)
	DeleteMarkdownTemplate(ctx context.Context, id string) error

	CreateHook(ctx context.Context, item Hook) (Hook, error)
	UpdateHook(ctx context.Context, item Hook) (Hook, error)
	GetHookByID(ctx context.Context, id string) (Hook, error)
	ListHooks(ctx context.Context, filter HookListFilter) ([]Hook, int64, error)
	DeleteHook(ctx context.Context, id string) error
}
