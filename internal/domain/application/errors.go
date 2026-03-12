package application

import "errors"

var (
	ErrNotFound      = errors.New("application not found")
	ErrKeyDuplicated = errors.New("application key already exists")
)
