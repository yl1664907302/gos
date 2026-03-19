package usecase

import (
	"context"
	"fmt"
	"strings"
)

type ReleaseSettingsStore interface {
	LoadEnvOptions(ctx context.Context) ([]string, error)
	SaveEnvOptions(ctx context.Context, values []string) error
}

type ReleaseSettingsOutput struct {
	EnvOptions []string `json:"env_options"`
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
	return ReleaseSettingsOutput{EnvOptions: normalizeReleaseEnvOptions(options)}, nil
}

type UpdateReleaseSettingsInput struct {
	EnvOptions []string
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
