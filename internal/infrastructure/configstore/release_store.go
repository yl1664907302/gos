package configstore

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gos/internal/application/usecase"
)

var defaultReleaseEnvOptions = []string{"dev", "test", "prod"}

var defaultReleaseConcurrencySettings = usecase.ReleaseConcurrencySettingsOutput{
	Enabled:            false,
	LockScope:          usecase.ReleaseConcurrencyLockScopeApplicationEnv,
	ConflictStrategy:   usecase.ReleaseConcurrencyConflictStrategyReject,
	LockTimeoutSec:     1800,
	AllowAdminOverride: true,
}

type ReleaseStore struct {
	configPath string
}

func NewReleaseStore(configPath string) *ReleaseStore {
	return &ReleaseStore{configPath: strings.TrimSpace(configPath)}
}

func (s *ReleaseStore) LoadEnvOptions(_ context.Context) ([]string, error) {
	path := strings.TrimSpace(s.configPath)
	if path == "" {
		return cloneStringList(defaultReleaseEnvOptions), nil
	}

	content, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return cloneStringList(defaultReleaseEnvOptions), nil
		}
		return nil, fmt.Errorf("read config file failed: %w", err)
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(content, &payload); err != nil {
		return nil, fmt.Errorf("decode config file failed: %w", err)
	}

	node := readMapNode(payload, "release")
	options := normalizeStringListFromAny(node["env_options"])
	if len(options) == 0 {
		return cloneStringList(defaultReleaseEnvOptions), nil
	}
	return options, nil
}

func (s *ReleaseStore) LoadConcurrencySettings(_ context.Context) (usecase.ReleaseConcurrencySettingsOutput, error) {
	path := strings.TrimSpace(s.configPath)
	if path == "" {
		return defaultReleaseConcurrencySettings, nil
	}

	content, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return defaultReleaseConcurrencySettings, nil
		}
		return usecase.ReleaseConcurrencySettingsOutput{}, fmt.Errorf("read config file failed: %w", err)
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(content, &payload); err != nil {
		return usecase.ReleaseConcurrencySettingsOutput{}, fmt.Errorf("decode config file failed: %w", err)
	}

	releaseNode := readMapNode(payload, "release")
	concurrencyNode := readMapNode(releaseNode, "concurrency")

	settings := defaultReleaseConcurrencySettings
	settings.Enabled = boolFromAny(concurrencyNode["enabled"])
	if value := strings.TrimSpace(fmt.Sprint(concurrencyNode["lock_scope"])); value != "" {
		settings.LockScope = usecase.ReleaseConcurrencyLockScope(value)
	}
	if value := strings.TrimSpace(fmt.Sprint(concurrencyNode["conflict_strategy"])); value != "" {
		settings.ConflictStrategy = usecase.ReleaseConcurrencyConflictStrategy(value)
	}
	if value := intFromAny(concurrencyNode["lock_timeout_sec"]); value > 0 {
		settings.LockTimeoutSec = value
	}
	if _, ok := concurrencyNode["allow_admin_override"]; ok {
		settings.AllowAdminOverride = boolFromAny(concurrencyNode["allow_admin_override"])
	}
	return usecase.ReleaseConcurrencySettingsOutput{
		Enabled:            settings.Enabled,
		LockScope:          settings.LockScope,
		ConflictStrategy:   settings.ConflictStrategy,
		LockTimeoutSec:     settings.LockTimeoutSec,
		AllowAdminOverride: settings.AllowAdminOverride,
	}, nil
}

func (s *ReleaseStore) SaveEnvOptions(_ context.Context, values []string) error {
	path := strings.TrimSpace(s.configPath)
	if path == "" {
		return fmt.Errorf("config path is required")
	}

	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read config file failed: %w", err)
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(content, &payload); err != nil {
		return fmt.Errorf("decode config file failed: %w", err)
	}

	options := normalizeStringList(values)
	if len(options) == 0 {
		return fmt.Errorf("release env options are required")
	}

	releaseNode := readMapNode(payload, "release")
	releaseNode["env_options"] = options
	payload["release"] = releaseNode

	updated, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return fmt.Errorf("encode config file failed: %w", err)
	}
	updated = append(updated, '\n')

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return fmt.Errorf("prepare config directory failed: %w", err)
	}
	if err := os.WriteFile(path, updated, 0o644); err != nil {
		return fmt.Errorf("write config file failed: %w", err)
	}
	return nil
}

func (s *ReleaseStore) SaveConcurrencySettings(_ context.Context, input usecase.ReleaseConcurrencySettingsInput) error {
	path := strings.TrimSpace(s.configPath)
	if path == "" {
		return fmt.Errorf("config path is required")
	}

	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read config file failed: %w", err)
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(content, &payload); err != nil {
		return fmt.Errorf("decode config file failed: %w", err)
	}

	releaseNode := readMapNode(payload, "release")
	releaseNode["concurrency"] = map[string]interface{}{
		"enabled":              input.Enabled,
		"lock_scope":           strings.TrimSpace(string(input.LockScope)),
		"conflict_strategy":    strings.TrimSpace(string(input.ConflictStrategy)),
		"lock_timeout_sec":     input.LockTimeoutSec,
		"allow_admin_override": input.AllowAdminOverride,
	}
	payload["release"] = releaseNode

	updated, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		return fmt.Errorf("encode config file failed: %w", err)
	}
	updated = append(updated, '\n')

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return fmt.Errorf("prepare config directory failed: %w", err)
	}
	if err := os.WriteFile(path, updated, 0o644); err != nil {
		return fmt.Errorf("write config file failed: %w", err)
	}
	return nil
}

func readMapNode(payload map[string]interface{}, key string) map[string]interface{} {
	if payload == nil {
		return map[string]interface{}{}
	}
	if node, ok := payload[key].(map[string]interface{}); ok && node != nil {
		return node
	}
	return map[string]interface{}{}
}

func boolFromAny(raw interface{}) bool {
	switch value := raw.(type) {
	case bool:
		return value
	case string:
		return strings.EqualFold(strings.TrimSpace(value), "true")
	default:
		return false
	}
}

func intFromAny(raw interface{}) int {
	switch value := raw.(type) {
	case float64:
		return int(value)
	case int:
		return value
	case int32:
		return int(value)
	case int64:
		return int(value)
	case string:
		text := strings.TrimSpace(value)
		if text == "" {
			return 0
		}
		var result int
		_, _ = fmt.Sscanf(text, "%d", &result)
		return result
	default:
		return 0
	}
}

func normalizeStringListFromAny(raw interface{}) []string {
	items, ok := raw.([]interface{})
	if !ok {
		return nil
	}
	values := make([]string, 0, len(items))
	for _, item := range items {
		values = append(values, strings.TrimSpace(fmt.Sprint(item)))
	}
	return normalizeStringList(values)
}

func normalizeStringList(values []string) []string {
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

func cloneStringList(values []string) []string {
	if len(values) == 0 {
		return nil
	}
	result := make([]string, len(values))
	copy(result, values)
	return result
}
