package bootstrap

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
)

type Config struct {
	Environment string         `json:"environment"`
	Server      ServerConfig   `json:"server"`
	Database    DatabaseConfig `json:"database"`
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
			ReadTimeoutSec:       15,
			WriteTimeoutSec:      15,
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
	return nil
}
