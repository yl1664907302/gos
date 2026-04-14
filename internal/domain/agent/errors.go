package agent

import "errors"

var (
	ErrInstanceNotFound      = errors.New("agent instance not found")
	ErrInstanceDeleteBlocked = errors.New("agent instance cannot be deleted")
	ErrAgentCodeDuplicated   = errors.New("agent code already exists")
	ErrInvalidAgentToken     = errors.New("invalid agent token")
	ErrBootstrapTokenInvalid = errors.New("agent bootstrap token rejected")
	ErrHeartbeatAuthRejected = errors.New("agent heartbeat authentication rejected")
	ErrTaskNotFound          = errors.New("agent task not found")
	ErrTaskNotClaimable      = errors.New("agent task is not claimable")
	ErrScriptNotFound        = errors.New("agent script not found")
)
