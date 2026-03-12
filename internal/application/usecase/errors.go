package usecase

import "errors"

var (
	ErrInvalidInput       = errors.New("invalid input")
	ErrInvalidID          = errors.New("invalid id")
	ErrInvalidStatus      = errors.New("invalid status")
	ErrInvalidProvider    = errors.New("invalid provider")
	ErrInvalidBindingType = errors.New("invalid binding type")
	ErrInvalidTriggerMode = errors.New("invalid trigger mode")
)
