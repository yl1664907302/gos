package usecase

import "errors"

var (
	ErrInvalidInput  = errors.New("invalid input")
	ErrInvalidID     = errors.New("invalid id")
	ErrInvalidStatus = errors.New("invalid status")
)
