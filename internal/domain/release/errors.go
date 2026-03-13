package release

import "errors"

var (
	ErrOrderNotFound   = errors.New("release order not found")
	ErrOrderDuplicated = errors.New("release order already exists")
	ErrStepNotFound    = errors.New("release order step not found")
)
