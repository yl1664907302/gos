package platformparam

import "errors"

var (
	ErrNotFound           = errors.New("platform param dict not found")
	ErrParamKeyDuplicated = errors.New("platform param key already exists")
)
