package release

import "errors"

var (
	ErrOrderNotFound          = errors.New("release order not found")
	ErrOrderDuplicated        = errors.New("release order already exists")
	ErrExecutionNotFound      = errors.New("release order execution not found")
	ErrStepNotFound           = errors.New("release order step not found")
	ErrPipelineStageNotFound  = errors.New("release order pipeline stage not found")
	ErrTemplateNotFound       = errors.New("release template not found")
	ErrTemplateDuplicated     = errors.New("release template already exists")
	ErrDeploySnapshotNotFound = errors.New("release order deploy snapshot not found")
)
