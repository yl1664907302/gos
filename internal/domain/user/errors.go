package user

import "errors"

var (
	ErrUserNotFound            = errors.New("user not found")
	ErrUsernameDuplicated      = errors.New("username duplicated")
	ErrPermissionNotFound      = errors.New("permission not found")
	ErrSessionNotFound         = errors.New("session not found")
	ErrParamPermissionNotFound = errors.New("param permission not found")
)
