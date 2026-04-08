package project

import "errors"

var (
	ErrNotFound      = errors.New("project not found")
	ErrKeyDuplicated = errors.New("project key already exists")
	ErrInUse         = errors.New("project is referenced by applications")
)
