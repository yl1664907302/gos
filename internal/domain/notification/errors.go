package notification

import "errors"

var (
	ErrSourceNotFound           = errors.New("notification source not found")
	ErrMarkdownTemplateNotFound = errors.New("notification markdown template not found")
	ErrHookNotFound             = errors.New("notification hook not found")
)
