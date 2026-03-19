package configstore

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

var defaultReleaseEnvOptions = []string{"dev", "test", "prod"}

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

func readMapNode(payload map[string]interface{}, key string) map[string]interface{} {
	if payload == nil {
		return map[string]interface{}{}
	}
	if node, ok := payload[key].(map[string]interface{}); ok && node != nil {
		return node
	}
	return map[string]interface{}{}
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
