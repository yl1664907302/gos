package usecase

import (
	"context"
	"fmt"
	"strings"
)

type ReleaseSettingsStore interface {
	LoadEnvOptions(ctx context.Context) ([]string, error)
	SaveEnvOptions(ctx context.Context, values []string) error
	LoadConcurrencySettings(ctx context.Context) (ReleaseConcurrencySettingsOutput, error)
	SaveConcurrencySettings(ctx context.Context, input ReleaseConcurrencySettingsInput) error
}

type ReleaseConcurrencyLockScope string

const (
	ReleaseConcurrencyLockScopeApplication      ReleaseConcurrencyLockScope = "application"
	ReleaseConcurrencyLockScopeApplicationEnv   ReleaseConcurrencyLockScope = "application_env"
	ReleaseConcurrencyLockScopeGitOpsRepoBranch ReleaseConcurrencyLockScope = "gitops_repo_branch"
)

func (s ReleaseConcurrencyLockScope) Valid() bool {
	switch s {
	case ReleaseConcurrencyLockScopeApplication, ReleaseConcurrencyLockScopeApplicationEnv, ReleaseConcurrencyLockScopeGitOpsRepoBranch:
		return true
	default:
		return false
	}
}

type ReleaseConcurrencyConflictStrategy string

const (
	ReleaseConcurrencyConflictStrategyReject ReleaseConcurrencyConflictStrategy = "reject"
	ReleaseConcurrencyConflictStrategyQueue  ReleaseConcurrencyConflictStrategy = "queue"
)

func (s ReleaseConcurrencyConflictStrategy) Valid() bool {
	switch s {
	case ReleaseConcurrencyConflictStrategyReject, ReleaseConcurrencyConflictStrategyQueue:
		return true
	default:
		return false
	}
}

type ReleaseConcurrencySettingsOutput struct {
	Enabled            bool                               `json:"enabled"`
	LockScope          ReleaseConcurrencyLockScope        `json:"lock_scope"`
	ConflictStrategy   ReleaseConcurrencyConflictStrategy `json:"conflict_strategy"`
	LockTimeoutSec     int                                `json:"lock_timeout_sec"`
	AllowAdminOverride bool                               `json:"allow_admin_override"`
}

type ReleaseConcurrencySettingsInput = ReleaseConcurrencySettingsOutput

type ReleaseSettingsOutput struct {
	EnvOptions  []string                         `json:"env_options"`
	Concurrency ReleaseConcurrencySettingsOutput `json:"concurrency"`
}

type QueryReleaseSettings struct {
	store ReleaseSettingsStore
}

func NewQueryReleaseSettings(store ReleaseSettingsStore) *QueryReleaseSettings {
	return &QueryReleaseSettings{store: store}
}

func (uc *QueryReleaseSettings) Execute(ctx context.Context) (ReleaseSettingsOutput, error) {
	if uc == nil || uc.store == nil {
		return ReleaseSettingsOutput{}, fmt.Errorf("%w: release settings are not configured", ErrInvalidInput)
	}
	options, err := uc.store.LoadEnvOptions(ctx)
	if err != nil {
		return ReleaseSettingsOutput{}, err
	}
	concurrency, err := uc.store.LoadConcurrencySettings(ctx)
	if err != nil {
		return ReleaseSettingsOutput{}, err
	}
	return ReleaseSettingsOutput{
		EnvOptions:  normalizeReleaseEnvOptions(options),
		Concurrency: normalizeConcurrencySettings(concurrency),
	}, nil
}

type UpdateReleaseSettingsInput struct {
	EnvOptions  []string
	Concurrency ReleaseConcurrencySettingsInput
}

type UpdateReleaseSettings struct {
	store  ReleaseSettingsStore
	reader *QueryReleaseSettings
}

func NewUpdateReleaseSettings(store ReleaseSettingsStore, reader *QueryReleaseSettings) *UpdateReleaseSettings {
	return &UpdateReleaseSettings{store: store, reader: reader}
}

func (uc *UpdateReleaseSettings) Execute(ctx context.Context, input UpdateReleaseSettingsInput) (ReleaseSettingsOutput, error) {
	if uc == nil || uc.store == nil || uc.reader == nil {
		return ReleaseSettingsOutput{}, fmt.Errorf("%w: release settings are not configured", ErrInvalidInput)
	}
	options := normalizeReleaseEnvOptions(input.EnvOptions)
	if len(options) == 0 {
		return ReleaseSettingsOutput{}, fmt.Errorf("%w: 至少需要配置一个发布环境", ErrInvalidInput)
	}
	if err := uc.store.SaveEnvOptions(ctx, options); err != nil {
		return ReleaseSettingsOutput{}, err
	}
	if err := uc.store.SaveConcurrencySettings(ctx, normalizeConcurrencySettings(input.Concurrency)); err != nil {
		return ReleaseSettingsOutput{}, err
	}
	return uc.reader.Execute(ctx)
}

func normalizeReleaseEnvOptions(values []string) []string {
	result := make([]string, 0, len(values))
	seen := make(map[string]struct{}, len(values))
	for _, item := range values {
		value := strings.TrimSpace(item)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func normalizeConcurrencySettings(input ReleaseConcurrencySettingsInput) ReleaseConcurrencySettingsOutput {
	scope := ReleaseConcurrencyLockScope(strings.TrimSpace(string(input.LockScope)))
	if !scope.Valid() {
		scope = ReleaseConcurrencyLockScopeApplicationEnv
	}

	strategy := ReleaseConcurrencyConflictStrategy(strings.TrimSpace(string(input.ConflictStrategy)))
	if !strategy.Valid() {
		strategy = ReleaseConcurrencyConflictStrategyReject
	}

	timeout := input.LockTimeoutSec
	if timeout <= 0 {
		timeout = 1800
	}
	if timeout < 30 {
		timeout = 30
	}
	if timeout > 86400 {
		timeout = 86400
	}

	return ReleaseConcurrencySettingsOutput{
		Enabled:            input.Enabled,
		LockScope:          scope,
		ConflictStrategy:   strategy,
		LockTimeoutSec:     timeout,
		AllowAdminOverride: input.AllowAdminOverride,
	}
}
