package argocdapp

import "errors"

var (
	ErrNotFound           = errors.New("argocd application not found")
	ErrInstanceNotFound   = errors.New("argocd instance not found")
	ErrEnvBindingNotFound = errors.New("argocd env binding not found")
)
