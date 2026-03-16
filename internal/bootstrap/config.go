package bootstrap

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Environment string         `json:"environment"`
	Server      ServerConfig   `json:"server"`
	Database    DatabaseConfig `json:"database"`
	Jenkins     JenkinsConfig  `json:"jenkins"`
	Auth        AuthConfig     `json:"auth"`
}

type ServerConfig struct {
	Addr                 string `json:"addr"`
	ReadHeaderTimeoutSec int    `json:"read_header_timeout_sec"`
	ReadTimeoutSec       int    `json:"read_timeout_sec"`
	WriteTimeoutSec      int    `json:"write_timeout_sec"`
	IdleTimeoutSec       int    `json:"idle_timeout_sec"`
	ShutdownTimeoutSec   int    `json:"shutdown_timeout_sec"`
}

type DatabaseConfig struct {
	Driver                  string `json:"driver"`
	MySQLDSN                string `json:"mysql_dsn"`
	SQLitePath              string `json:"sqlite_path"`
	MaxOpenConns            int    `json:"max_open_conns"`
	MaxIdleConns            int    `json:"max_idle_conns"`
	ConnMaxLifetimeSec      int    `json:"conn_max_lifetime_sec"`
	ConnMaxIdleTimeSec      int    `json:"conn_max_idle_time_sec"`
	PingTimeoutSec          int    `json:"ping_timeout_sec"`
	StartupMaxRetries       int    `json:"startup_max_retries"`
	StartupRetryIntervalSec int    `json:"startup_retry_interval_sec"`
}

type JenkinsConfig struct {
	Enabled                 bool   `json:"enabled"`
	BaseURL                 string `json:"base_url"`
	Username                string `json:"username"`
	APIToken                string `json:"api_token"`
	TimeoutSec              int    `json:"timeout_sec"`
	StartupCheckEnabled     bool   `json:"startup_check_enabled"`
	StartupMaxRetries       int    `json:"startup_max_retries"`
	StartupRetryIntervalSec int    `json:"startup_retry_interval_sec"`
	AutoSyncEnabled         bool   `json:"auto_sync_enabled"`
	AutoSyncIntervalSec     int    `json:"auto_sync_interval_sec"`
	ReleaseTrackEnabled     bool   `json:"release_track_enabled"`
	ReleaseTrackIntervalSec int    `json:"release_track_interval_sec"`
}

type AuthConfig struct {
	SessionTTLHours  int    `json:"session_ttl_hours"`
	AdminUsername    string `json:"admin_username"`
	AdminDisplayName string `json:"admin_display_name"`
	AdminPassword    string `json:"admin_password"`
}

func LoadConfig() (Config, error) {
	cfg := defaultConfig()

	configPath := strings.TrimSpace(os.Getenv("APP_CONFIG_FILE"))
	if configPath == "" {
		configPath = "configs/config.local.json"
	}

	if err := loadFromFile(configPath, &cfg); err != nil {
		return Config{}, err
	}
	overrideFromEnv(&cfg)
	applyConfigDefaults(&cfg)

	if err := validateConfig(cfg); err != nil {
		return Config{}, err
	}
	return cfg, nil
}

func defaultConfig() Config {
	return Config{
		Environment: "local",
		Server: ServerConfig{
			Addr:                 ":8080",
			ReadHeaderTimeoutSec: 5,
			ReadTimeoutSec:       120,
			WriteTimeoutSec:      120,
			IdleTimeoutSec:       60,
			ShutdownTimeoutSec:   10,
		},
		Database: DatabaseConfig{
			Driver:                  "mysql",
			MySQLDSN:                "root:root@tcp(127.0.0.1:3306)/deploy_platform?charset=utf8mb4&parseTime=true&loc=UTC",
			SQLitePath:              "data/demo.db",
			MaxOpenConns:            10,
			MaxIdleConns:            5,
			ConnMaxLifetimeSec:      1800,
			ConnMaxIdleTimeSec:      600,
			PingTimeoutSec:          5,
			StartupMaxRetries:       10,
			StartupRetryIntervalSec: 2,
		},
		Jenkins: JenkinsConfig{
			Enabled:                 false,
			BaseURL:                 "http://127.0.0.1:8080",
			Username:                "admin",
			APIToken:                "",
			TimeoutSec:              5,
			StartupCheckEnabled:     false,
			StartupMaxRetries:       5,
			StartupRetryIntervalSec: 2,
			AutoSyncEnabled:         false,
			AutoSyncIntervalSec:     300,
			ReleaseTrackEnabled:     true,
			ReleaseTrackIntervalSec: 10,
		},
		Auth: AuthConfig{
			SessionTTLHours:  24,
			AdminUsername:    "admin",
			AdminDisplayName: "Administrator",
			AdminPassword:    "admin123",
		},
	}
}

func loadFromFile(path string, cfg *Config) error {
	file, err := os.Open(path)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return nil
		}
		return fmt.Errorf("open config file %q: %w", path, err)
	}
	defer func() { _ = file.Close() }()

	decoder := json.NewDecoder(file)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(cfg); err != nil {
		return fmt.Errorf("decode config file %q: %w", path, err)
	}
	return nil
}

func overrideFromEnv(cfg *Config) {
	if v := strings.TrimSpace(os.Getenv("APP_ENV")); v != "" {
		cfg.Environment = v
	}
	if v := strings.TrimSpace(os.Getenv("APP_ADDR")); v != "" {
		cfg.Server.Addr = v
	}
	if v := strings.TrimSpace(os.Getenv("DB_DRIVER")); v != "" {
		cfg.Database.Driver = strings.ToLower(v)
	}
	if v := strings.TrimSpace(os.Getenv("MYSQL_DSN")); v != "" {
		cfg.Database.MySQLDSN = v
	}
	if v := strings.TrimSpace(os.Getenv("SQLITE_PATH")); v != "" {
		cfg.Database.SQLitePath = v
	}
	if v, ok := boolFromEnv("JENKINS_ENABLED"); ok {
		cfg.Jenkins.Enabled = v
	}
	if v := strings.TrimSpace(os.Getenv("JENKINS_BASE_URL")); v != "" {
		cfg.Jenkins.BaseURL = v
	}
	if v := strings.TrimSpace(os.Getenv("JENKINS_USERNAME")); v != "" {
		cfg.Jenkins.Username = v
	}
	if v := strings.TrimSpace(os.Getenv("JENKINS_API_TOKEN")); v != "" {
		cfg.Jenkins.APIToken = v
	}
	if v, ok := intFromEnv("JENKINS_TIMEOUT_SEC"); ok {
		cfg.Jenkins.TimeoutSec = v
	}
	if v, ok := boolFromEnv("JENKINS_STARTUP_CHECK_ENABLED"); ok {
		cfg.Jenkins.StartupCheckEnabled = v
	}
	if v, ok := intFromEnv("JENKINS_STARTUP_MAX_RETRIES"); ok {
		cfg.Jenkins.StartupMaxRetries = v
	}
	if v, ok := intFromEnv("JENKINS_STARTUP_RETRY_INTERVAL_SEC"); ok {
		cfg.Jenkins.StartupRetryIntervalSec = v
	}
	if v, ok := boolFromEnv("JENKINS_AUTO_SYNC_ENABLED"); ok {
		cfg.Jenkins.AutoSyncEnabled = v
	}
	if v, ok := intFromEnv("JENKINS_AUTO_SYNC_INTERVAL_SEC"); ok {
		cfg.Jenkins.AutoSyncIntervalSec = v
	}
	if v, ok := boolFromEnv("JENKINS_RELEASE_TRACK_ENABLED"); ok {
		cfg.Jenkins.ReleaseTrackEnabled = v
	}
	if v, ok := intFromEnv("JENKINS_RELEASE_TRACK_INTERVAL_SEC"); ok {
		cfg.Jenkins.ReleaseTrackIntervalSec = v
	}
	if v, ok := intFromEnv("AUTH_SESSION_TTL_HOURS"); ok {
		cfg.Auth.SessionTTLHours = v
	}
	if v := strings.TrimSpace(os.Getenv("AUTH_ADMIN_USERNAME")); v != "" {
		cfg.Auth.AdminUsername = v
	}
	if v := strings.TrimSpace(os.Getenv("AUTH_ADMIN_DISPLAY_NAME")); v != "" {
		cfg.Auth.AdminDisplayName = v
	}
	if v := strings.TrimSpace(os.Getenv("AUTH_ADMIN_PASSWORD")); v != "" {
		cfg.Auth.AdminPassword = v
	}
}

func applyConfigDefaults(cfg *Config) {
	cfg.Environment = strings.TrimSpace(cfg.Environment)
	if cfg.Environment == "" {
		cfg.Environment = "local"
	}

	cfg.Server.Addr = strings.TrimSpace(cfg.Server.Addr)
	if cfg.Server.Addr == "" {
		cfg.Server.Addr = ":8080"
	}
	if cfg.Server.ReadHeaderTimeoutSec <= 0 {
		cfg.Server.ReadHeaderTimeoutSec = 5
	}
	if cfg.Server.ReadTimeoutSec <= 0 {
		cfg.Server.ReadTimeoutSec = 15
	}
	if cfg.Server.WriteTimeoutSec <= 0 {
		cfg.Server.WriteTimeoutSec = 15
	}
	if cfg.Server.IdleTimeoutSec <= 0 {
		cfg.Server.IdleTimeoutSec = 60
	}
	if cfg.Server.ShutdownTimeoutSec <= 0 {
		cfg.Server.ShutdownTimeoutSec = 10
	}

	cfg.Database.Driver = strings.ToLower(strings.TrimSpace(cfg.Database.Driver))
	if cfg.Database.Driver == "" {
		cfg.Database.Driver = "mysql"
	}
	cfg.Database.MySQLDSN = strings.TrimSpace(os.ExpandEnv(cfg.Database.MySQLDSN))
	cfg.Database.SQLitePath = strings.TrimSpace(os.ExpandEnv(cfg.Database.SQLitePath))
	if cfg.Database.MaxOpenConns <= 0 {
		cfg.Database.MaxOpenConns = 10
	}
	if cfg.Database.MaxIdleConns <= 0 {
		cfg.Database.MaxIdleConns = 5
	}
	if cfg.Database.ConnMaxLifetimeSec <= 0 {
		cfg.Database.ConnMaxLifetimeSec = 1800
	}
	if cfg.Database.ConnMaxIdleTimeSec <= 0 {
		cfg.Database.ConnMaxIdleTimeSec = 600
	}
	if cfg.Database.PingTimeoutSec <= 0 {
		cfg.Database.PingTimeoutSec = 5
	}
	if cfg.Database.StartupMaxRetries <= 0 {
		cfg.Database.StartupMaxRetries = 10
	}
	if cfg.Database.StartupRetryIntervalSec <= 0 {
		cfg.Database.StartupRetryIntervalSec = 2
	}

	cfg.Jenkins.BaseURL = strings.TrimSpace(os.ExpandEnv(cfg.Jenkins.BaseURL))
	cfg.Jenkins.Username = strings.TrimSpace(os.ExpandEnv(cfg.Jenkins.Username))
	cfg.Jenkins.APIToken = strings.TrimSpace(os.ExpandEnv(cfg.Jenkins.APIToken))
	if cfg.Jenkins.TimeoutSec <= 0 {
		cfg.Jenkins.TimeoutSec = 5
	}
	if cfg.Jenkins.StartupMaxRetries <= 0 {
		cfg.Jenkins.StartupMaxRetries = 5
	}
	if cfg.Jenkins.StartupRetryIntervalSec <= 0 {
		cfg.Jenkins.StartupRetryIntervalSec = 2
	}
	if cfg.Jenkins.AutoSyncIntervalSec <= 0 {
		cfg.Jenkins.AutoSyncIntervalSec = 300
	}
	if cfg.Jenkins.ReleaseTrackIntervalSec <= 0 {
		cfg.Jenkins.ReleaseTrackIntervalSec = 10
	}

	if cfg.Auth.SessionTTLHours <= 0 {
		cfg.Auth.SessionTTLHours = 24
	}
	cfg.Auth.AdminUsername = strings.TrimSpace(os.ExpandEnv(cfg.Auth.AdminUsername))
	cfg.Auth.AdminDisplayName = strings.TrimSpace(os.ExpandEnv(cfg.Auth.AdminDisplayName))
	cfg.Auth.AdminPassword = strings.TrimSpace(os.ExpandEnv(cfg.Auth.AdminPassword))
	if cfg.Auth.AdminUsername == "" {
		cfg.Auth.AdminUsername = "admin"
	}
	if cfg.Auth.AdminDisplayName == "" {
		cfg.Auth.AdminDisplayName = "Administrator"
	}
	if cfg.Auth.AdminPassword == "" {
		cfg.Auth.AdminPassword = "admin123"
	}
}

func validateConfig(cfg Config) error {
	switch cfg.Database.Driver {
	case "sqlite":
		if cfg.Database.SQLitePath == "" {
			return errors.New("database.sqlite_path is required when database.driver=sqlite")
		}
	case "mysql":
		if cfg.Database.MySQLDSN == "" {
			return errors.New("database.mysql_dsn is required when database.driver=mysql")
		}
	default:
		return fmt.Errorf("unsupported database.driver %q", cfg.Database.Driver)
	}

	if cfg.Jenkins.Enabled {
		if cfg.Jenkins.BaseURL == "" {
			return errors.New("jenkins.base_url is required when jenkins.enabled=true")
		}
		if (cfg.Jenkins.Username == "") != (cfg.Jenkins.APIToken == "") {
			return errors.New("jenkins.username and jenkins.api_token must be set together")
		}
	}

	return nil
}

func boolFromEnv(key string) (bool, bool) {
	raw := strings.TrimSpace(os.Getenv(key))
	if raw == "" {
		return false, false
	}
	value, err := strconv.ParseBool(raw)
	if err != nil {
		return false, false
	}
	return value, true
}

func intFromEnv(key string) (int, bool) {
	raw := strings.TrimSpace(os.Getenv(key))
	if raw == "" {
		return 0, false
	}
	value, err := strconv.Atoi(raw)
	if err != nil {
		return 0, false
	}
	return value, true
}
