package pipeline

import "errors"

var (
	ErrPipelineNotFound   = errors.New("pipeline not found")
	ErrBindingNotFound    = errors.New("pipeline binding not found")
	ErrBindingDuplicated  = errors.New("pipeline binding already exists for application")
	ErrPipelineDuplicated = errors.New("pipeline already exists")
)
