package sqlrepo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	domain "gos/internal/domain/release"
)

type ReleaseRepository struct {
	db       *sql.DB
	dbDriver string
}

func NewReleaseRepository(db *sql.DB, dbDriver string) *ReleaseRepository {
	return &ReleaseRepository{
		db:       db,
		dbDriver: strings.ToLower(strings.TrimSpace(dbDriver)),
	}
}

func (r *ReleaseRepository) InitSchema(ctx context.Context) error {
	statements, err := releaseSchemaStatements(r.dbDriver)
	if err != nil {
		return err
	}
	for _, stmt := range statements {
		if _, execErr := r.db.ExecContext(ctx, stmt); execErr != nil {
			return execErr
		}
	}
	return r.migrateSchema(ctx)
}

func releaseSchemaStatements(dbDriver string) ([]string, error) {
	switch dbDriver {
	case "mysql":
		return []string{
			`CREATE TABLE IF NOT EXISTS release_order (
	id VARCHAR(64) PRIMARY KEY,
	order_no VARCHAR(64) NOT NULL,
	previous_order_no VARCHAR(64) NOT NULL DEFAULT '',
	operation_type VARCHAR(32) NOT NULL DEFAULT 'deploy',
	source_order_id VARCHAR(64) NOT NULL DEFAULT '',
	source_order_no VARCHAR(64) NOT NULL DEFAULT '',
	is_concurrent TINYINT(1) NOT NULL DEFAULT 0,
	concurrent_batch_no VARCHAR(64) NOT NULL DEFAULT '',
	concurrent_batch_seq INT NOT NULL DEFAULT 0,
	application_id VARCHAR(64) NOT NULL,
	application_name VARCHAR(100) NOT NULL DEFAULT '',
	template_id VARCHAR(64) NOT NULL DEFAULT '',
	template_name VARCHAR(128) NOT NULL DEFAULT '',
	binding_id VARCHAR(64) NOT NULL,
	pipeline_id VARCHAR(64) NOT NULL DEFAULT '',
	env_code VARCHAR(50) NOT NULL,
	son_service VARCHAR(200) NOT NULL DEFAULT '',
	git_ref VARCHAR(200) NOT NULL DEFAULT '',
	image_tag VARCHAR(200) NOT NULL DEFAULT '',
	trigger_type VARCHAR(50) NOT NULL,
	status VARCHAR(50) NOT NULL DEFAULT 'pending',
	remark VARCHAR(500) NOT NULL DEFAULT '',
	creator_user_id VARCHAR(64) NOT NULL DEFAULT '',
	triggered_by VARCHAR(64) NOT NULL DEFAULT '',
	started_at BIGINT NULL,
	finished_at BIGINT NULL,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_order_no (order_no),
	KEY idx_release_order_application (application_id),
	KEY idx_release_order_binding (binding_id),
	KEY idx_release_order_batch (concurrent_batch_no),
	KEY idx_release_order_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_order_execution (
	id VARCHAR(64) PRIMARY KEY,
	release_order_id VARCHAR(64) NOT NULL,
	pipeline_scope VARCHAR(20) NOT NULL,
	binding_id VARCHAR(64) NOT NULL,
	binding_name VARCHAR(128) NOT NULL DEFAULT '',
	provider VARCHAR(32) NOT NULL DEFAULT '',
	pipeline_id VARCHAR(64) NOT NULL DEFAULT '',
	status VARCHAR(32) NOT NULL DEFAULT 'pending',
	queue_url VARCHAR(500) NOT NULL DEFAULT '',
	build_url VARCHAR(500) NOT NULL DEFAULT '',
	external_run_id VARCHAR(128) NOT NULL DEFAULT '',
	started_at BIGINT NULL,
	finished_at BIGINT NULL,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_order_execution_scope (release_order_id, pipeline_scope),
	KEY idx_release_order_execution_order (release_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_order_deploy_snapshot (
	id VARCHAR(64) PRIMARY KEY,
	release_order_id VARCHAR(64) NOT NULL,
	provider VARCHAR(32) NOT NULL DEFAULT '',
	gitops_type VARCHAR(32) NOT NULL DEFAULT '',
	argocd_instance_id VARCHAR(64) NOT NULL DEFAULT '',
	gitops_instance_id VARCHAR(64) NOT NULL DEFAULT '',
	argocd_app_name VARCHAR(255) NOT NULL DEFAULT '',
	repo_url VARCHAR(500) NOT NULL DEFAULT '',
	branch VARCHAR(128) NOT NULL DEFAULT '',
	source_path VARCHAR(255) NOT NULL DEFAULT '',
	env_code VARCHAR(64) NOT NULL DEFAULT '',
	snapshot_payload_json LONGTEXT NOT NULL,
	created_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_order_snapshot_order (release_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_execution_lock (
	id VARCHAR(64) PRIMARY KEY,
	lock_scope VARCHAR(32) NOT NULL,
	lock_key VARCHAR(500) NOT NULL,
	application_id VARCHAR(64) NOT NULL DEFAULT '',
	env_code VARCHAR(64) NOT NULL DEFAULT '',
	release_order_id VARCHAR(64) NOT NULL DEFAULT '',
	release_order_no VARCHAR(64) NOT NULL DEFAULT '',
	status VARCHAR(32) NOT NULL DEFAULT 'active',
	owner_type VARCHAR(32) NOT NULL DEFAULT 'release_order',
	created_at BIGINT NOT NULL,
	expired_at BIGINT NULL,
	released_at BIGINT NULL,
	KEY idx_release_execution_lock_key_status (lock_key, status),
	KEY idx_release_execution_lock_order (release_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_order_param (
	id VARCHAR(64) PRIMARY KEY,
	release_order_id VARCHAR(64) NOT NULL,
	pipeline_scope VARCHAR(20) NOT NULL DEFAULT '',
	binding_id VARCHAR(64) NOT NULL DEFAULT '',
	param_key VARCHAR(100) NOT NULL,
	executor_param_name VARCHAR(100) NOT NULL DEFAULT '',
	param_value VARCHAR(1000) NOT NULL DEFAULT '',
	value_source VARCHAR(50) NOT NULL,
	created_at BIGINT NOT NULL,
	KEY idx_release_order_param_order (release_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_order_step (
	id VARCHAR(64) PRIMARY KEY,
	release_order_id VARCHAR(64) NOT NULL,
	step_scope VARCHAR(20) NOT NULL DEFAULT 'global',
	execution_id VARCHAR(64) NOT NULL DEFAULT '',
	step_code VARCHAR(100) NOT NULL,
	step_name VARCHAR(200) NOT NULL DEFAULT '',
	status VARCHAR(50) NOT NULL,
	message VARCHAR(1000) NOT NULL DEFAULT '',
	sort_no INT NOT NULL DEFAULT 0,
	started_at BIGINT NULL,
	finished_at BIGINT NULL,
	created_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_order_step_code (release_order_id, step_code),
	KEY idx_release_order_step_order_sort (release_order_id, sort_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_order_pipeline_stage (
	id VARCHAR(64) PRIMARY KEY,
	release_order_id VARCHAR(64) NOT NULL,
	execution_id VARCHAR(64) NOT NULL DEFAULT '',
	pipeline_scope VARCHAR(32) NOT NULL DEFAULT '',
	executor_type VARCHAR(32) NOT NULL DEFAULT '',
	stage_key VARCHAR(128) NOT NULL,
	stage_name VARCHAR(255) NOT NULL DEFAULT '',
	status VARCHAR(32) NOT NULL DEFAULT 'pending',
	raw_status VARCHAR(64) NOT NULL DEFAULT '',
	sort_no INT NOT NULL DEFAULT 0,
	duration_millis BIGINT NOT NULL DEFAULT 0,
	started_at BIGINT NULL,
	finished_at BIGINT NULL,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_order_pipeline_stage_key (release_order_id, executor_type, pipeline_scope, stage_key),
	KEY idx_release_order_pipeline_stage_order_sort (release_order_id, pipeline_scope, sort_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_template (
	id VARCHAR(64) PRIMARY KEY,
	name VARCHAR(128) NOT NULL,
	application_id VARCHAR(64) NOT NULL,
	application_name VARCHAR(128) NOT NULL DEFAULT '',
	binding_id VARCHAR(64) NOT NULL,
	binding_name VARCHAR(128) NOT NULL DEFAULT '',
	binding_type VARCHAR(32) NOT NULL DEFAULT '',
	gitops_type VARCHAR(32) NOT NULL DEFAULT '',
	status VARCHAR(32) NOT NULL DEFAULT 'active',
	remark VARCHAR(500) NOT NULL DEFAULT '',
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_template_binding_name (binding_id, name),
	KEY idx_release_template_application (application_id),
	KEY idx_release_template_binding (binding_id),
	KEY idx_release_template_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_template_binding (
	id VARCHAR(64) PRIMARY KEY,
	template_id VARCHAR(64) NOT NULL,
	pipeline_scope VARCHAR(20) NOT NULL,
	binding_id VARCHAR(64) NOT NULL,
	binding_name VARCHAR(128) NOT NULL DEFAULT '',
	provider VARCHAR(32) NOT NULL DEFAULT '',
	pipeline_id VARCHAR(64) NOT NULL DEFAULT '',
	enabled TINYINT(1) NOT NULL DEFAULT 1,
	sort_no INT NOT NULL DEFAULT 1,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_template_scope (template_id, pipeline_scope),
	KEY idx_release_template_binding_template (template_id),
	KEY idx_release_template_binding_binding (binding_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_template_param (
	id VARCHAR(64) PRIMARY KEY,
	template_id VARCHAR(64) NOT NULL,
	template_binding_id VARCHAR(64) NOT NULL DEFAULT '',
	pipeline_scope VARCHAR(20) NOT NULL DEFAULT '',
	binding_id VARCHAR(64) NOT NULL DEFAULT '',
	executor_param_def_id VARCHAR(64) NOT NULL,
	param_key VARCHAR(100) NOT NULL,
	param_name VARCHAR(100) NOT NULL DEFAULT '',
	executor_param_name VARCHAR(100) NOT NULL DEFAULT '',
	value_source VARCHAR(32) NOT NULL DEFAULT 'release_input',
	source_param_key VARCHAR(100) NOT NULL DEFAULT '',
	source_param_name VARCHAR(100) NOT NULL DEFAULT '',
	fixed_value VARCHAR(500) NOT NULL DEFAULT '',
	required TINYINT(1) NOT NULL DEFAULT 0,
	sort_no INT NOT NULL DEFAULT 0,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_template_param_unique (template_id, executor_param_def_id),
	KEY idx_release_template_param_template_sort (template_id, sort_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
			`CREATE TABLE IF NOT EXISTS release_template_gitops_rule (
	id VARCHAR(64) PRIMARY KEY,
	template_id VARCHAR(64) NOT NULL,
	pipeline_scope VARCHAR(20) NOT NULL DEFAULT 'cd',
	source_param_key VARCHAR(100) NOT NULL,
	source_param_name VARCHAR(100) NOT NULL DEFAULT '',
	source_from VARCHAR(32) NOT NULL DEFAULT '',
	locator_param_key VARCHAR(100) NOT NULL DEFAULT '',
	locator_param_name VARCHAR(100) NOT NULL DEFAULT '',
	file_path_template VARCHAR(255) NOT NULL,
	document_kind VARCHAR(100) NOT NULL DEFAULT '',
	document_name VARCHAR(150) NOT NULL DEFAULT '',
	target_path VARCHAR(255) NOT NULL,
	value_template VARCHAR(255) NOT NULL DEFAULT '',
	sort_no INT NOT NULL DEFAULT 0,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	KEY idx_release_template_gitops_rule_template_sort (template_id, sort_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
		}, nil

	case "sqlite":
		return []string{
			`CREATE TABLE IF NOT EXISTS release_order (
	id TEXT PRIMARY KEY,
	order_no TEXT NOT NULL UNIQUE,
	previous_order_no TEXT NOT NULL DEFAULT '',
	operation_type TEXT NOT NULL DEFAULT 'deploy',
	source_order_id TEXT NOT NULL DEFAULT '',
	source_order_no TEXT NOT NULL DEFAULT '',
	is_concurrent INTEGER NOT NULL DEFAULT 0,
	concurrent_batch_no TEXT NOT NULL DEFAULT '',
	concurrent_batch_seq INTEGER NOT NULL DEFAULT 0,
	application_id TEXT NOT NULL,
	application_name TEXT NOT NULL DEFAULT '',
	template_id TEXT NOT NULL DEFAULT '',
	template_name TEXT NOT NULL DEFAULT '',
	binding_id TEXT NOT NULL,
	pipeline_id TEXT NOT NULL DEFAULT '',
	env_code TEXT NOT NULL,
	son_service TEXT NOT NULL DEFAULT '',
	git_ref TEXT NOT NULL DEFAULT '',
	image_tag TEXT NOT NULL DEFAULT '',
	trigger_type TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending',
	remark TEXT NOT NULL DEFAULT '',
	creator_user_id TEXT NOT NULL DEFAULT '',
	triggered_by TEXT NOT NULL DEFAULT '',
	started_at INTEGER NULL,
	finished_at INTEGER NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_application ON release_order (application_id);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_binding ON release_order (binding_id);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_batch ON release_order (concurrent_batch_no);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_created_at ON release_order (created_at);`,
			`CREATE TABLE IF NOT EXISTS release_order_execution (
	id TEXT PRIMARY KEY,
	release_order_id TEXT NOT NULL,
	pipeline_scope TEXT NOT NULL,
	binding_id TEXT NOT NULL,
	binding_name TEXT NOT NULL DEFAULT '',
	provider TEXT NOT NULL DEFAULT '',
	pipeline_id TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'pending',
	queue_url TEXT NOT NULL DEFAULT '',
	build_url TEXT NOT NULL DEFAULT '',
	external_run_id TEXT NOT NULL DEFAULT '',
	started_at INTEGER NULL,
	finished_at INTEGER NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(release_order_id, pipeline_scope)
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_execution_order ON release_order_execution (release_order_id);`,
			`CREATE TABLE IF NOT EXISTS release_order_deploy_snapshot (
	id TEXT PRIMARY KEY,
	release_order_id TEXT NOT NULL UNIQUE,
	provider TEXT NOT NULL DEFAULT '',
	gitops_type TEXT NOT NULL DEFAULT '',
	argocd_instance_id TEXT NOT NULL DEFAULT '',
	gitops_instance_id TEXT NOT NULL DEFAULT '',
	argocd_app_name TEXT NOT NULL DEFAULT '',
	repo_url TEXT NOT NULL DEFAULT '',
	branch TEXT NOT NULL DEFAULT '',
	source_path TEXT NOT NULL DEFAULT '',
	env_code TEXT NOT NULL DEFAULT '',
	snapshot_payload_json TEXT NOT NULL,
	created_at INTEGER NOT NULL
);`,
			`CREATE TABLE IF NOT EXISTS release_execution_lock (
	id TEXT PRIMARY KEY,
	lock_scope TEXT NOT NULL,
	lock_key TEXT NOT NULL,
	application_id TEXT NOT NULL DEFAULT '',
	env_code TEXT NOT NULL DEFAULT '',
	release_order_id TEXT NOT NULL DEFAULT '',
	release_order_no TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'active',
	owner_type TEXT NOT NULL DEFAULT 'release_order',
	created_at INTEGER NOT NULL,
	expired_at INTEGER NULL,
	released_at INTEGER NULL
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_execution_lock_key_status ON release_execution_lock (lock_key, status);`,
			`CREATE INDEX IF NOT EXISTS idx_release_execution_lock_order ON release_execution_lock (release_order_id);`,
			`CREATE TABLE IF NOT EXISTS release_order_param (
	id TEXT PRIMARY KEY,
	release_order_id TEXT NOT NULL,
	pipeline_scope TEXT NOT NULL DEFAULT '',
	binding_id TEXT NOT NULL DEFAULT '',
	param_key TEXT NOT NULL,
	executor_param_name TEXT NOT NULL DEFAULT '',
	param_value TEXT NOT NULL DEFAULT '',
	value_source TEXT NOT NULL,
	created_at INTEGER NOT NULL
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_param_order ON release_order_param (release_order_id);`,
			`CREATE TABLE IF NOT EXISTS release_order_step (
	id TEXT PRIMARY KEY,
	release_order_id TEXT NOT NULL,
	step_scope TEXT NOT NULL DEFAULT 'global',
	execution_id TEXT NOT NULL DEFAULT '',
	step_code TEXT NOT NULL,
	step_name TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL,
	message TEXT NOT NULL DEFAULT '',
	sort_no INTEGER NOT NULL DEFAULT 0,
	started_at INTEGER NULL,
	finished_at INTEGER NULL,
	created_at INTEGER NOT NULL,
	UNIQUE(release_order_id, step_code)
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_step_order_sort ON release_order_step (release_order_id, sort_no);`,
			`CREATE TABLE IF NOT EXISTS release_order_pipeline_stage (
	id TEXT PRIMARY KEY,
	release_order_id TEXT NOT NULL,
	execution_id TEXT NOT NULL DEFAULT '',
	pipeline_scope TEXT NOT NULL DEFAULT '',
	executor_type TEXT NOT NULL DEFAULT '',
	stage_key TEXT NOT NULL,
	stage_name TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'pending',
	raw_status TEXT NOT NULL DEFAULT '',
	sort_no INTEGER NOT NULL DEFAULT 0,
	duration_millis INTEGER NOT NULL DEFAULT 0,
	started_at INTEGER NULL,
	finished_at INTEGER NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(release_order_id, executor_type, pipeline_scope, stage_key)
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_pipeline_stage_order_sort ON release_order_pipeline_stage (release_order_id, pipeline_scope, sort_no);`,
			`CREATE TABLE IF NOT EXISTS release_template (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	application_id TEXT NOT NULL,
	application_name TEXT NOT NULL DEFAULT '',
	binding_id TEXT NOT NULL,
	binding_name TEXT NOT NULL DEFAULT '',
	binding_type TEXT NOT NULL DEFAULT '',
	gitops_type TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'active',
	remark TEXT NOT NULL DEFAULT '',
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(binding_id, name)
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_application ON release_template (application_id);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_binding ON release_template (binding_id);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_created_at ON release_template (created_at);`,
			`CREATE TABLE IF NOT EXISTS release_template_binding (
	id TEXT PRIMARY KEY,
	template_id TEXT NOT NULL,
	pipeline_scope TEXT NOT NULL,
	binding_id TEXT NOT NULL,
	binding_name TEXT NOT NULL DEFAULT '',
	provider TEXT NOT NULL DEFAULT '',
	pipeline_id TEXT NOT NULL DEFAULT '',
	enabled INTEGER NOT NULL DEFAULT 1,
	sort_no INTEGER NOT NULL DEFAULT 1,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(template_id, pipeline_scope)
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_binding_template ON release_template_binding (template_id);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_binding_binding ON release_template_binding (binding_id);`,
			`CREATE TABLE IF NOT EXISTS release_template_param (
	id TEXT PRIMARY KEY,
	template_id TEXT NOT NULL,
	template_binding_id TEXT NOT NULL DEFAULT '',
	pipeline_scope TEXT NOT NULL DEFAULT '',
	binding_id TEXT NOT NULL DEFAULT '',
	executor_param_def_id TEXT NOT NULL,
	param_key TEXT NOT NULL,
	param_name TEXT NOT NULL DEFAULT '',
	executor_param_name TEXT NOT NULL DEFAULT '',
	value_source TEXT NOT NULL DEFAULT 'release_input',
	source_param_key TEXT NOT NULL DEFAULT '',
	source_param_name TEXT NOT NULL DEFAULT '',
	fixed_value TEXT NOT NULL DEFAULT '',
	required INTEGER NOT NULL DEFAULT 0,
	sort_no INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(template_id, executor_param_def_id)
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_param_template_sort ON release_template_param (template_id, sort_no);`,
			`CREATE TABLE IF NOT EXISTS release_template_gitops_rule (
	id TEXT PRIMARY KEY,
	template_id TEXT NOT NULL,
	pipeline_scope TEXT NOT NULL DEFAULT 'cd',
	source_param_key TEXT NOT NULL,
	source_param_name TEXT NOT NULL DEFAULT '',
	source_from TEXT NOT NULL DEFAULT '',
	locator_param_key TEXT NOT NULL DEFAULT '',
	locator_param_name TEXT NOT NULL DEFAULT '',
	file_path_template TEXT NOT NULL,
	document_kind TEXT NOT NULL DEFAULT '',
	document_name TEXT NOT NULL DEFAULT '',
	target_path TEXT NOT NULL,
	value_template TEXT NOT NULL DEFAULT '',
	sort_no INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_gitops_rule_template_sort ON release_template_gitops_rule (template_id, sort_no);`,
		}, nil

	default:
		return nil, fmt.Errorf("unsupported db driver: %s", dbDriver)
	}
}

func (r *ReleaseRepository) migrateSchema(ctx context.Context) error {
	switch r.dbDriver {
	case "mysql":
		// `release_template_param` 历史上使用的是 `pipeline_param_def_id`。
		// 现在主模型已经升级为 `executor_param_def_id`，这里在启动阶段做一次平滑迁移。
		exists, err := r.mysqlColumnExists(ctx, "release_template_param", "pipeline_param_def_id")
		if err != nil {
			return err
		}
		if exists {
			newExists, newErr := r.mysqlColumnExists(ctx, "release_template_param", "executor_param_def_id")
			if newErr != nil {
				return newErr
			}
			if !newExists {
				if _, err = r.db.ExecContext(
					ctx,
					`ALTER TABLE release_template_param CHANGE COLUMN pipeline_param_def_id executor_param_def_id VARCHAR(64) NOT NULL;`,
				); err != nil {
					return err
				}
			}
		}

		exists, err = r.mysqlColumnExists(ctx, "release_order", "son_service")
		if err != nil {
			return err
		}
		if !exists {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE release_order ADD COLUMN son_service VARCHAR(200) NOT NULL DEFAULT '' AFTER env_code;`,
			); err != nil {
				return err
			}
		}
		exists, err = r.mysqlColumnExists(ctx, "release_order", "creator_user_id")
		if err != nil {
			return err
		}
		if !exists {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE release_order ADD COLUMN creator_user_id VARCHAR(64) NOT NULL DEFAULT '' AFTER remark;`,
			); err != nil {
				return err
			}
		}
		exists, err = r.mysqlColumnExists(ctx, "release_order", "previous_order_no")
		if err != nil {
			return err
		}
		if !exists {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE release_order ADD COLUMN previous_order_no VARCHAR(64) NOT NULL DEFAULT '' AFTER order_no;`,
			); err != nil {
				return err
			}
		}
		for _, columnStmt := range []struct {
			table  string
			column string
			stmt   string
		}{
			{"release_order", "operation_type", `ALTER TABLE release_order ADD COLUMN operation_type VARCHAR(32) NOT NULL DEFAULT 'deploy' AFTER previous_order_no;`},
			{"release_order", "source_order_id", `ALTER TABLE release_order ADD COLUMN source_order_id VARCHAR(64) NOT NULL DEFAULT '' AFTER operation_type;`},
			{"release_order", "source_order_no", `ALTER TABLE release_order ADD COLUMN source_order_no VARCHAR(64) NOT NULL DEFAULT '' AFTER source_order_id;`},
			{"release_order", "is_concurrent", `ALTER TABLE release_order ADD COLUMN is_concurrent TINYINT(1) NOT NULL DEFAULT 0 AFTER source_order_no;`},
			{"release_order", "concurrent_batch_no", `ALTER TABLE release_order ADD COLUMN concurrent_batch_no VARCHAR(64) NOT NULL DEFAULT '' AFTER is_concurrent;`},
			{"release_order", "concurrent_batch_seq", `ALTER TABLE release_order ADD COLUMN concurrent_batch_seq INT NOT NULL DEFAULT 0 AFTER concurrent_batch_no;`},
		} {
			exists, err = r.mysqlColumnExists(ctx, columnStmt.table, columnStmt.column)
			if err != nil {
				return err
			}
			if !exists {
				if _, err = r.db.ExecContext(ctx, columnStmt.stmt); err != nil {
					return err
				}
			}
		}
		exists, err = r.mysqlColumnExists(ctx, "release_order", "template_id")
		if err != nil {
			return err
		}
		if !exists {
			if _, err = r.db.ExecContext(ctx, `ALTER TABLE release_order ADD COLUMN template_id VARCHAR(64) NOT NULL DEFAULT '' AFTER application_name;`); err != nil {
				return err
			}
		}
		exists, err = r.mysqlColumnExists(ctx, "release_order", "template_name")
		if err != nil {
			return err
		}
		if !exists {
			if _, err = r.db.ExecContext(ctx, `ALTER TABLE release_order ADD COLUMN template_name VARCHAR(128) NOT NULL DEFAULT '' AFTER template_id;`); err != nil {
				return err
			}
		}
		for _, columnStmt := range []struct {
			table  string
			column string
			stmt   string
		}{
			{"release_order_param", "pipeline_scope", `ALTER TABLE release_order_param ADD COLUMN pipeline_scope VARCHAR(20) NOT NULL DEFAULT '' AFTER release_order_id;`},
			{"release_order_param", "binding_id", `ALTER TABLE release_order_param ADD COLUMN binding_id VARCHAR(64) NOT NULL DEFAULT '' AFTER pipeline_scope;`},
			{"release_order_step", "step_scope", `ALTER TABLE release_order_step ADD COLUMN step_scope VARCHAR(20) NOT NULL DEFAULT 'global' AFTER release_order_id;`},
			{"release_order_step", "execution_id", `ALTER TABLE release_order_step ADD COLUMN execution_id VARCHAR(64) NOT NULL DEFAULT '' AFTER step_scope;`},
			{"release_order_pipeline_stage", "execution_id", `ALTER TABLE release_order_pipeline_stage ADD COLUMN execution_id VARCHAR(64) NOT NULL DEFAULT '' AFTER release_order_id;`},
			{"release_template", "gitops_type", `ALTER TABLE release_template ADD COLUMN gitops_type VARCHAR(32) NOT NULL DEFAULT '' AFTER binding_type;`},
			{"release_template_param", "template_binding_id", `ALTER TABLE release_template_param ADD COLUMN template_binding_id VARCHAR(64) NOT NULL DEFAULT '' AFTER template_id;`},
			{"release_template_param", "pipeline_scope", `ALTER TABLE release_template_param ADD COLUMN pipeline_scope VARCHAR(20) NOT NULL DEFAULT '' AFTER template_binding_id;`},
			{"release_template_param", "binding_id", `ALTER TABLE release_template_param ADD COLUMN binding_id VARCHAR(64) NOT NULL DEFAULT '' AFTER pipeline_scope;`},
			{"release_template_param", "value_source", `ALTER TABLE release_template_param ADD COLUMN value_source VARCHAR(32) NOT NULL DEFAULT 'release_input' AFTER executor_param_name;`},
			{"release_template_param", "source_param_key", `ALTER TABLE release_template_param ADD COLUMN source_param_key VARCHAR(100) NOT NULL DEFAULT '' AFTER value_source;`},
			{"release_template_param", "source_param_name", `ALTER TABLE release_template_param ADD COLUMN source_param_name VARCHAR(100) NOT NULL DEFAULT '' AFTER source_param_key;`},
			{"release_template_param", "fixed_value", `ALTER TABLE release_template_param ADD COLUMN fixed_value VARCHAR(500) NOT NULL DEFAULT '' AFTER source_param_name;`},
			{"release_template_gitops_rule", "locator_param_key", `ALTER TABLE release_template_gitops_rule ADD COLUMN locator_param_key VARCHAR(100) NOT NULL DEFAULT '' AFTER source_from;`},
			{"release_template_gitops_rule", "locator_param_name", `ALTER TABLE release_template_gitops_rule ADD COLUMN locator_param_name VARCHAR(100) NOT NULL DEFAULT '' AFTER locator_param_key;`},
		} {
			exists, err = r.mysqlColumnExists(ctx, columnStmt.table, columnStmt.column)
			if err != nil {
				return err
			}
			if !exists {
				if _, err = r.db.ExecContext(ctx, columnStmt.stmt); err != nil {
					return err
				}
			}
		}
		if _, err = r.db.ExecContext(
			ctx,
			`ALTER TABLE release_order MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'pending';`,
		); err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`UPDATE release_order
SET status = 'pending'
WHERE status IS NULL OR TRIM(status) = '' OR LOWER(TRIM(status)) = 'pengding';`,
		)
		if err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`UPDATE release_order_param SET pipeline_scope = '' WHERE pipeline_scope IS NULL;`,
		)
		if err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`UPDATE release_order ro
SET creator_user_id = COALESCE(
	(SELECT su.id FROM sys_user su WHERE su.display_name = ro.triggered_by ORDER BY su.updated_at DESC LIMIT 1),
	(SELECT su.id FROM sys_user su WHERE su.username = ro.triggered_by ORDER BY su.updated_at DESC LIMIT 1),
	creator_user_id
)
WHERE (ro.creator_user_id IS NULL OR TRIM(ro.creator_user_id) = '')
  AND ro.triggered_by IS NOT NULL
  AND TRIM(ro.triggered_by) <> '';`,
		)
		if err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`CREATE TABLE IF NOT EXISTS release_order_deploy_snapshot (
	id VARCHAR(64) PRIMARY KEY,
	release_order_id VARCHAR(64) NOT NULL,
	provider VARCHAR(32) NOT NULL DEFAULT '',
	gitops_type VARCHAR(32) NOT NULL DEFAULT '',
	argocd_instance_id VARCHAR(64) NOT NULL DEFAULT '',
	gitops_instance_id VARCHAR(64) NOT NULL DEFAULT '',
	argocd_app_name VARCHAR(255) NOT NULL DEFAULT '',
	repo_url VARCHAR(500) NOT NULL DEFAULT '',
	branch VARCHAR(128) NOT NULL DEFAULT '',
	source_path VARCHAR(255) NOT NULL DEFAULT '',
	env_code VARCHAR(64) NOT NULL DEFAULT '',
	snapshot_payload_json LONGTEXT NOT NULL,
	created_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_order_snapshot_order (release_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
		)
		if err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`CREATE TABLE IF NOT EXISTS release_execution_lock (
	id VARCHAR(64) PRIMARY KEY,
	lock_scope VARCHAR(32) NOT NULL,
	lock_key VARCHAR(500) NOT NULL,
	application_id VARCHAR(64) NOT NULL DEFAULT '',
	env_code VARCHAR(64) NOT NULL DEFAULT '',
	release_order_id VARCHAR(64) NOT NULL DEFAULT '',
	release_order_no VARCHAR(64) NOT NULL DEFAULT '',
	status VARCHAR(32) NOT NULL DEFAULT 'active',
	owner_type VARCHAR(32) NOT NULL DEFAULT 'release_order',
	created_at BIGINT NOT NULL,
	expired_at BIGINT NULL,
	released_at BIGINT NULL,
	KEY idx_release_execution_lock_key_status (lock_key, status),
	KEY idx_release_execution_lock_order (release_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
		)
		if err != nil {
			return err
		}
		_, err = r.db.ExecContext(ctx, `CREATE INDEX idx_release_order_batch ON release_order (concurrent_batch_no);`)
		if err != nil && !strings.Contains(strings.ToLower(err.Error()), "duplicate key name") {
			return err
		}
		return nil
	case "sqlite":
		columns, err := r.sqliteTableColumns(ctx, "release_template_param")
		if err != nil {
			return err
		}
		if _, ok := columns["pipeline_param_def_id"]; ok {
			if _, hasNew := columns["executor_param_def_id"]; !hasNew {
				if _, err = r.db.ExecContext(
					ctx,
					`ALTER TABLE release_template_param RENAME COLUMN pipeline_param_def_id TO executor_param_def_id;`,
				); err != nil {
					return err
				}
			}
		}

		columns, err = r.sqliteTableColumns(ctx, "release_order")
		if err != nil {
			return err
		}
		if _, ok := columns["son_service"]; !ok {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE release_order ADD COLUMN son_service TEXT NOT NULL DEFAULT '';`,
			); err != nil {
				return err
			}
		}
		if _, ok := columns["creator_user_id"]; !ok {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE release_order ADD COLUMN creator_user_id TEXT NOT NULL DEFAULT '';`,
			); err != nil {
				return err
			}
		}
		if _, ok := columns["previous_order_no"]; !ok {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE release_order ADD COLUMN previous_order_no TEXT NOT NULL DEFAULT '';`,
			); err != nil {
				return err
			}
		}
		for _, stmt := range []struct {
			column string
			sql    string
		}{
			{"operation_type", `ALTER TABLE release_order ADD COLUMN operation_type TEXT NOT NULL DEFAULT 'deploy';`},
			{"source_order_id", `ALTER TABLE release_order ADD COLUMN source_order_id TEXT NOT NULL DEFAULT '';`},
			{"source_order_no", `ALTER TABLE release_order ADD COLUMN source_order_no TEXT NOT NULL DEFAULT '';`},
			{"is_concurrent", `ALTER TABLE release_order ADD COLUMN is_concurrent INTEGER NOT NULL DEFAULT 0;`},
			{"concurrent_batch_no", `ALTER TABLE release_order ADD COLUMN concurrent_batch_no TEXT NOT NULL DEFAULT '';`},
			{"concurrent_batch_seq", `ALTER TABLE release_order ADD COLUMN concurrent_batch_seq INTEGER NOT NULL DEFAULT 0;`},
		} {
			tableColumns, tableErr := r.sqliteTableColumns(ctx, "release_order")
			if tableErr != nil {
				return tableErr
			}
			if _, ok := tableColumns[stmt.column]; ok {
				continue
			}
			if _, err = r.db.ExecContext(ctx, stmt.sql); err != nil {
				return err
			}
		}
		if _, ok := columns["template_id"]; !ok {
			if _, err = r.db.ExecContext(ctx, `ALTER TABLE release_order ADD COLUMN template_id TEXT NOT NULL DEFAULT '';`); err != nil {
				return err
			}
		}
		if _, ok := columns["template_name"]; !ok {
			if _, err = r.db.ExecContext(ctx, `ALTER TABLE release_order ADD COLUMN template_name TEXT NOT NULL DEFAULT '';`); err != nil {
				return err
			}
		}
		for _, columnStmt := range []struct {
			table  string
			column string
			stmt   string
		}{
			{"release_order_param", "pipeline_scope", `ALTER TABLE release_order_param ADD COLUMN pipeline_scope TEXT NOT NULL DEFAULT '';`},
			{"release_order_param", "binding_id", `ALTER TABLE release_order_param ADD COLUMN binding_id TEXT NOT NULL DEFAULT '';`},
			{"release_order_step", "step_scope", `ALTER TABLE release_order_step ADD COLUMN step_scope TEXT NOT NULL DEFAULT 'global';`},
			{"release_order_step", "execution_id", `ALTER TABLE release_order_step ADD COLUMN execution_id TEXT NOT NULL DEFAULT '';`},
			{"release_order_pipeline_stage", "execution_id", `ALTER TABLE release_order_pipeline_stage ADD COLUMN execution_id TEXT NOT NULL DEFAULT '';`},
			{"release_template", "gitops_type", `ALTER TABLE release_template ADD COLUMN gitops_type TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "template_binding_id", `ALTER TABLE release_template_param ADD COLUMN template_binding_id TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "pipeline_scope", `ALTER TABLE release_template_param ADD COLUMN pipeline_scope TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "binding_id", `ALTER TABLE release_template_param ADD COLUMN binding_id TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "value_source", `ALTER TABLE release_template_param ADD COLUMN value_source TEXT NOT NULL DEFAULT 'release_input';`},
			{"release_template_param", "source_param_key", `ALTER TABLE release_template_param ADD COLUMN source_param_key TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "source_param_name", `ALTER TABLE release_template_param ADD COLUMN source_param_name TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "fixed_value", `ALTER TABLE release_template_param ADD COLUMN fixed_value TEXT NOT NULL DEFAULT '';`},
			{"release_template_gitops_rule", "locator_param_key", `ALTER TABLE release_template_gitops_rule ADD COLUMN locator_param_key TEXT NOT NULL DEFAULT '';`},
			{"release_template_gitops_rule", "locator_param_name", `ALTER TABLE release_template_gitops_rule ADD COLUMN locator_param_name TEXT NOT NULL DEFAULT '';`},
		} {
			tableColumns, tableErr := r.sqliteTableColumns(ctx, columnStmt.table)
			if tableErr != nil {
				return tableErr
			}
			if _, ok := tableColumns[columnStmt.column]; ok {
				continue
			}
			if _, err = r.db.ExecContext(ctx, columnStmt.stmt); err != nil {
				return err
			}
		}
		_, err = r.db.ExecContext(
			ctx,
			`UPDATE release_order
SET status = 'pending'
WHERE status IS NULL OR TRIM(status) = '' OR LOWER(TRIM(status)) = 'pengding';`,
		)
		if err != nil {
			return err
		}
		if _, err = r.db.ExecContext(ctx, `CREATE INDEX IF NOT EXISTS idx_release_order_batch ON release_order (concurrent_batch_no);`); err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`UPDATE release_order
SET creator_user_id = COALESCE(
	(SELECT su.id FROM sys_user su WHERE su.display_name = release_order.triggered_by ORDER BY su.updated_at DESC LIMIT 1),
	(SELECT su.id FROM sys_user su WHERE su.username = release_order.triggered_by ORDER BY su.updated_at DESC LIMIT 1),
	creator_user_id
)
WHERE (creator_user_id IS NULL OR TRIM(creator_user_id) = '')
  AND triggered_by IS NOT NULL
  AND TRIM(triggered_by) <> '';`,
		)
		if err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`CREATE TABLE IF NOT EXISTS release_order_deploy_snapshot (
	id TEXT PRIMARY KEY,
	release_order_id TEXT NOT NULL UNIQUE,
	provider TEXT NOT NULL DEFAULT '',
	gitops_type TEXT NOT NULL DEFAULT '',
	argocd_instance_id TEXT NOT NULL DEFAULT '',
	gitops_instance_id TEXT NOT NULL DEFAULT '',
	argocd_app_name TEXT NOT NULL DEFAULT '',
	repo_url TEXT NOT NULL DEFAULT '',
	branch TEXT NOT NULL DEFAULT '',
	source_path TEXT NOT NULL DEFAULT '',
	env_code TEXT NOT NULL DEFAULT '',
	snapshot_payload_json TEXT NOT NULL,
	created_at INTEGER NOT NULL
);`,
		)
		if err != nil {
			return err
		}
		_, err = r.db.ExecContext(
			ctx,
			`CREATE TABLE IF NOT EXISTS release_execution_lock (
	id TEXT PRIMARY KEY,
	lock_scope TEXT NOT NULL,
	lock_key TEXT NOT NULL,
	application_id TEXT NOT NULL DEFAULT '',
	env_code TEXT NOT NULL DEFAULT '',
	release_order_id TEXT NOT NULL DEFAULT '',
	release_order_no TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'active',
	owner_type TEXT NOT NULL DEFAULT 'release_order',
	created_at INTEGER NOT NULL,
	expired_at INTEGER NULL,
	released_at INTEGER NULL
);`,
		)
		if err != nil {
			return err
		}
		if _, err = r.db.ExecContext(ctx, `CREATE INDEX IF NOT EXISTS idx_release_execution_lock_key_status ON release_execution_lock (lock_key, status);`); err != nil {
			return err
		}
		if _, err = r.db.ExecContext(ctx, `CREATE INDEX IF NOT EXISTS idx_release_execution_lock_order ON release_execution_lock (release_order_id);`); err != nil {
			return err
		}
		return nil
	default:
		return fmt.Errorf("unsupported db driver: %s", r.dbDriver)
	}
}

func (r *ReleaseRepository) mysqlColumnExists(ctx context.Context, table, column string) (bool, error) {
	const q = `
SELECT COUNT(1)
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?;`

	var count int
	if err := r.db.QueryRowContext(ctx, q, table, column).Scan(&count); err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *ReleaseRepository) sqliteTableColumns(ctx context.Context, table string) (map[string]struct{}, error) {
	q := fmt.Sprintf("PRAGMA table_info(%q);", table)
	rows, err := r.db.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns := make(map[string]struct{})
	for rows.Next() {
		var (
			cid       int
			name      string
			typ       string
			notNull   int
			defaultV  sql.NullString
			primaryID int
		)
		if err := rows.Scan(&cid, &name, &typ, &notNull, &defaultV, &primaryID); err != nil {
			return nil, err
		}
		columns[name] = struct{}{}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return columns, nil
}

func (r *ReleaseRepository) Create(
	ctx context.Context,
	order domain.ReleaseOrder,
	executions []domain.ReleaseOrderExecution,
	params []domain.ReleaseOrderParam,
	steps []domain.ReleaseOrderStep,
) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	const insertOrder = `
INSERT INTO release_order (
	id, order_no, previous_order_no, operation_type, source_order_id, source_order_no, is_concurrent, concurrent_batch_no, concurrent_batch_seq, application_id, application_name, template_id, template_name, binding_id, pipeline_id, env_code,
	son_service, git_ref, image_tag, trigger_type, status, remark, creator_user_id, triggered_by, started_at, finished_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	_, err = tx.ExecContext(
		ctx,
		insertOrder,
		order.ID,
		order.OrderNo,
		order.PreviousOrderNo,
		string(order.OperationType),
		order.SourceOrderID,
		order.SourceOrderNo,
		boolToDBValue(r.dbDriver, order.IsConcurrent),
		order.ConcurrentBatchNo,
		order.ConcurrentBatchSeq,
		order.ApplicationID,
		order.ApplicationName,
		order.TemplateID,
		order.TemplateName,
		order.BindingID,
		order.PipelineID,
		order.EnvCode,
		order.SonService,
		order.GitRef,
		order.ImageTag,
		string(order.TriggerType),
		string(order.Status),
		order.Remark,
		order.CreatorUserID,
		order.TriggeredBy,
		nullableUnixNano(order.StartedAt),
		nullableUnixNano(order.FinishedAt),
		order.CreatedAt.UTC().UnixNano(),
		order.UpdatedAt.UTC().UnixNano(),
	)
	if err != nil {
		if isDuplicateKeyError(r.dbDriver, err) {
			return domain.ErrOrderDuplicated
		}
		return err
	}

	const insertExecution = `
INSERT INTO release_order_execution (
	id, release_order_id, pipeline_scope, binding_id, binding_name, provider, pipeline_id, status, queue_url, build_url, external_run_id, started_at, finished_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
	for _, item := range executions {
		if _, execErr := tx.ExecContext(
			ctx,
			insertExecution,
			item.ID,
			item.ReleaseOrderID,
			string(item.PipelineScope),
			item.BindingID,
			item.BindingName,
			item.Provider,
			item.PipelineID,
			string(item.Status),
			item.QueueURL,
			item.BuildURL,
			item.ExternalRunID,
			nullableUnixNano(item.StartedAt),
			nullableUnixNano(item.FinishedAt),
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		); execErr != nil {
			return execErr
		}
	}

	const insertParam = `
INSERT INTO release_order_param (
	id, release_order_id, pipeline_scope, binding_id, param_key, executor_param_name, param_value, value_source, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
	for _, item := range params {
		if _, execErr := tx.ExecContext(
			ctx,
			insertParam,
			item.ID,
			item.ReleaseOrderID,
			string(item.PipelineScope),
			item.BindingID,
			item.ParamKey,
			item.ExecutorParamName,
			item.ParamValue,
			string(item.ValueSource),
			item.CreatedAt.UTC().UnixNano(),
		); execErr != nil {
			return execErr
		}
	}

	const insertStep = `
INSERT INTO release_order_step (
	id, release_order_id, step_scope, execution_id, step_code, step_name, status, message, sort_no, started_at, finished_at, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
	for _, item := range steps {
		if _, execErr := tx.ExecContext(
			ctx,
			insertStep,
			item.ID,
			item.ReleaseOrderID,
			string(item.StepScope),
			item.ExecutionID,
			item.StepCode,
			item.StepName,
			string(item.Status),
			item.Message,
			item.SortNo,
			nullableUnixNano(item.StartedAt),
			nullableUnixNano(item.FinishedAt),
			item.CreatedAt.UTC().UnixNano(),
		); execErr != nil {
			return execErr
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *ReleaseRepository) GetByID(ctx context.Context, id string) (domain.ReleaseOrder, error) {
	const q = `
SELECT id, order_no, previous_order_no, operation_type, source_order_id, source_order_no, is_concurrent, concurrent_batch_no, concurrent_batch_seq, application_id, application_name, template_id, template_name, binding_id, pipeline_id, env_code, son_service, git_ref, image_tag,
	trigger_type, status, remark, creator_user_id, triggered_by, started_at, finished_at, created_at, updated_at
FROM release_order
WHERE id = ?;`

	row := r.db.QueryRowContext(ctx, q, id)
	item, err := scanReleaseOrder(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.ReleaseOrder{}, domain.ErrOrderNotFound
		}
		return domain.ReleaseOrder{}, err
	}
	return item, nil
}

func (r *ReleaseRepository) List(ctx context.Context, filter domain.ListFilter) ([]domain.ReleaseOrder, int64, error) {
	where := make([]string, 0, 5)
	args := make([]any, 0, 7)

	if filter.ApplicationID != "" {
		where = append(where, "application_id = ?")
		args = append(args, filter.ApplicationID)
	} else if len(filter.ApplicationIDs) > 0 {
		placeholders := make([]string, 0, len(filter.ApplicationIDs))
		for _, item := range filter.ApplicationIDs {
			value := strings.TrimSpace(item)
			if value == "" {
				continue
			}
			placeholders = append(placeholders, "?")
			args = append(args, value)
		}
		if len(placeholders) == 0 {
			return []domain.ReleaseOrder{}, 0, nil
		}
		where = append(where, "application_id IN ("+strings.Join(placeholders, ", ")+")")
	}
	if filter.BindingID != "" {
		where = append(where, "binding_id = ?")
		args = append(args, filter.BindingID)
	}
	if filter.CreatorUserID != "" {
		where = append(where, "creator_user_id = ?")
		args = append(args, filter.CreatorUserID)
	}
	if filter.EnvCode != "" {
		where = append(where, "env_code = ?")
		args = append(args, filter.EnvCode)
	}
	if filter.Status != "" {
		where = append(where, "status = ?")
		args = append(args, string(filter.Status))
	}
	if filter.TriggerType != "" {
		where = append(where, "trigger_type = ?")
		args = append(args, string(filter.TriggerType))
	}

	countQuery := "SELECT COUNT(1) FROM release_order"
	if len(where) > 0 {
		countQuery += " WHERE " + strings.Join(where, " AND ")
	}
	var total int64
	if err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	listQuery := `
SELECT id, order_no, previous_order_no, operation_type, source_order_id, source_order_no, is_concurrent, concurrent_batch_no, concurrent_batch_seq, application_id, application_name, template_id, template_name, binding_id, pipeline_id, env_code, son_service, git_ref, image_tag,
	trigger_type, status, remark, creator_user_id, triggered_by, started_at, finished_at, created_at, updated_at
FROM release_order`
	if len(where) > 0 {
		listQuery += " WHERE " + strings.Join(where, " AND ")
	}
	listQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?;"

	offset := (filter.Page - 1) * filter.PageSize
	rows, err := r.db.QueryContext(ctx, listQuery, append(args, filter.PageSize, offset)...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseOrder, 0)
	for rows.Next() {
		item, scanErr := scanReleaseOrder(rows)
		if scanErr != nil {
			return nil, 0, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *ReleaseRepository) ListTrackableOrders(
	ctx context.Context,
	page int,
	pageSize int,
) ([]domain.ReleaseOrder, int64, error) {
	if page <= 0 {
		page = 1
	}
	if pageSize <= 0 {
		pageSize = 100
	}

	const countQuery = `
SELECT COUNT(DISTINCT ro.id)
FROM release_order ro
JOIN release_order_execution roe ON roe.release_order_id = ro.id
WHERE ro.status IN (?, ?, ?)
  AND roe.status IN (?, ?);`

	var total int64
	if err := r.db.QueryRowContext(
		ctx,
		countQuery,
		string(domain.OrderStatusRunning),
		string(domain.OrderStatusQueued),
		string(domain.OrderStatusDeploying),
		string(domain.ExecutionStatusPending),
		string(domain.ExecutionStatusRunning),
	).Scan(&total); err != nil {
		return nil, 0, err
	}

	const listQuery = `
SELECT DISTINCT ro.id, ro.order_no, ro.previous_order_no, ro.operation_type, ro.source_order_id, ro.source_order_no, ro.is_concurrent, ro.concurrent_batch_no, ro.concurrent_batch_seq, ro.application_id, ro.application_name, ro.template_id, ro.template_name, ro.binding_id, ro.pipeline_id, ro.env_code, ro.son_service, ro.git_ref, ro.image_tag,
	ro.trigger_type, ro.status, ro.remark, ro.creator_user_id, ro.triggered_by, ro.started_at, ro.finished_at, ro.created_at, ro.updated_at
FROM release_order ro
JOIN release_order_execution roe ON roe.release_order_id = ro.id
WHERE ro.status IN (?, ?, ?)
  AND roe.status IN (?, ?)
ORDER BY ro.created_at DESC
LIMIT ? OFFSET ?;`

	offset := (page - 1) * pageSize
	rows, err := r.db.QueryContext(
		ctx,
		listQuery,
		string(domain.OrderStatusRunning),
		string(domain.OrderStatusQueued),
		string(domain.OrderStatusDeploying),
		string(domain.ExecutionStatusPending),
		string(domain.ExecutionStatusRunning),
		pageSize,
		offset,
	)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseOrder, 0)
	for rows.Next() {
		item, scanErr := scanReleaseOrder(rows)
		if scanErr != nil {
			return nil, 0, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *ReleaseRepository) UpdateStatus(
	ctx context.Context,
	id string,
	status domain.OrderStatus,
	startedAt *time.Time,
	finishedAt *time.Time,
	updatedAt time.Time,
) (domain.ReleaseOrder, error) {
	const q = `
UPDATE release_order
SET status = ?, started_at = ?, finished_at = ?, updated_at = ?
WHERE id = ?;`

	res, err := r.db.ExecContext(
		ctx,
		q,
		string(status),
		nullableUnixNano(startedAt),
		nullableUnixNano(finishedAt),
		updatedAt.UTC().UnixNano(),
		id,
	)
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return domain.ReleaseOrder{}, err
	}
	if affected == 0 {
		return domain.ReleaseOrder{}, domain.ErrOrderNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *ReleaseRepository) CreateDeploySnapshot(ctx context.Context, snapshot domain.DeploySnapshot) error {
	const q = `
INSERT INTO release_order_deploy_snapshot (
	id, release_order_id, provider, gitops_type, argocd_instance_id, gitops_instance_id, argocd_app_name, repo_url, branch, source_path, env_code, snapshot_payload_json, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	_, err := r.db.ExecContext(
		ctx,
		q,
		snapshot.ID,
		snapshot.ReleaseOrderID,
		snapshot.Provider,
		string(snapshot.GitOpsType),
		snapshot.ArgoCDInstanceID,
		snapshot.GitOpsInstanceID,
		snapshot.ArgoCDAppName,
		snapshot.RepoURL,
		snapshot.Branch,
		snapshot.SourcePath,
		snapshot.EnvCode,
		snapshot.SnapshotPayload,
		snapshot.CreatedAt.UTC().UnixNano(),
	)
	if err == nil {
		return nil
	}
	if !isDuplicateKeyError(r.dbDriver, err) {
		return err
	}

	const updateQ = `
UPDATE release_order_deploy_snapshot
SET provider = ?, gitops_type = ?, argocd_instance_id = ?, gitops_instance_id = ?, argocd_app_name = ?, repo_url = ?, branch = ?, source_path = ?, env_code = ?, snapshot_payload_json = ?, created_at = ?
WHERE release_order_id = ?;`
	_, err = r.db.ExecContext(
		ctx,
		updateQ,
		snapshot.Provider,
		string(snapshot.GitOpsType),
		snapshot.ArgoCDInstanceID,
		snapshot.GitOpsInstanceID,
		snapshot.ArgoCDAppName,
		snapshot.RepoURL,
		snapshot.Branch,
		snapshot.SourcePath,
		snapshot.EnvCode,
		snapshot.SnapshotPayload,
		snapshot.CreatedAt.UTC().UnixNano(),
		snapshot.ReleaseOrderID,
	)
	return err
}

func (r *ReleaseRepository) GetDeploySnapshotByOrderID(ctx context.Context, releaseOrderID string) (domain.DeploySnapshot, error) {
	const q = `
SELECT id, release_order_id, provider, gitops_type, argocd_instance_id, gitops_instance_id, argocd_app_name, repo_url, branch, source_path, env_code, snapshot_payload_json, created_at
FROM release_order_deploy_snapshot
WHERE release_order_id = ?;`

	row := r.db.QueryRowContext(ctx, q, strings.TrimSpace(releaseOrderID))
	var (
		item        domain.DeploySnapshot
		gitOpsType  string
		createdAtNs int64
	)
	if err := row.Scan(
		&item.ID,
		&item.ReleaseOrderID,
		&item.Provider,
		&gitOpsType,
		&item.ArgoCDInstanceID,
		&item.GitOpsInstanceID,
		&item.ArgoCDAppName,
		&item.RepoURL,
		&item.Branch,
		&item.SourcePath,
		&item.EnvCode,
		&item.SnapshotPayload,
		&createdAtNs,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.DeploySnapshot{}, domain.ErrDeploySnapshotNotFound
		}
		return domain.DeploySnapshot{}, err
	}
	item.GitOpsType = domain.GitOpsType(gitOpsType)
	item.CreatedAt = time.Unix(0, createdAtNs).UTC()
	return item, nil
}

func (r *ReleaseRepository) UpdateConcurrentBatch(
	ctx context.Context,
	orderIDs []string,
	batchNo string,
	isConcurrent bool,
) error {
	batchNo = strings.TrimSpace(batchNo)
	if len(orderIDs) == 0 {
		return nil
	}
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	const q = `
UPDATE release_order
SET is_concurrent = ?, concurrent_batch_no = ?, concurrent_batch_seq = ?, updated_at = ?
WHERE id = ?;`

	now := time.Now().UTC().UnixNano()
	for idx, item := range orderIDs {
		orderID := strings.TrimSpace(item)
		if orderID == "" {
			continue
		}
		if _, err := tx.ExecContext(
			ctx,
			q,
			boolToDBValue(r.dbDriver, isConcurrent),
			batchNo,
			idx+1,
			now+int64(idx),
			orderID,
		); err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (r *ReleaseRepository) ListByConcurrentBatchNo(ctx context.Context, batchNo string) ([]domain.ReleaseOrder, error) {
	batchNo = strings.TrimSpace(batchNo)
	if batchNo == "" {
		return []domain.ReleaseOrder{}, nil
	}
	const q = `
SELECT id, order_no, previous_order_no, operation_type, source_order_id, source_order_no, is_concurrent, concurrent_batch_no, concurrent_batch_seq, application_id, application_name, template_id, template_name, binding_id, pipeline_id, env_code, son_service, git_ref, image_tag,
	trigger_type, status, remark, creator_user_id, triggered_by, started_at, finished_at, created_at, updated_at
FROM release_order
WHERE concurrent_batch_no = ?
ORDER BY concurrent_batch_seq ASC, created_at ASC;`

	rows, err := r.db.QueryContext(ctx, q, batchNo)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseOrder, 0)
	for rows.Next() {
		item, scanErr := scanReleaseOrder(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *ReleaseRepository) FindActiveExecutionLock(
	ctx context.Context,
	lockKey string,
	excludeReleaseOrderID string,
	now time.Time,
) (domain.ReleaseExecutionLock, error) {
	lockKey = strings.TrimSpace(lockKey)
	if lockKey == "" {
		return domain.ReleaseExecutionLock{}, domain.ErrExecutionLockNotFound
	}
	if err := r.expireExecutionLocks(ctx, now); err != nil {
		return domain.ReleaseExecutionLock{}, err
	}
	if err := r.releaseTerminalOrderExecutionLocks(ctx, now); err != nil {
		return domain.ReleaseExecutionLock{}, err
	}

	const q = `
SELECT id, lock_scope, lock_key, application_id, env_code, release_order_id, release_order_no, status, owner_type, created_at, expired_at, released_at
FROM release_execution_lock
WHERE lock_key = ?
  AND status = ?
  AND released_at IS NULL
ORDER BY created_at ASC
LIMIT 1;`

	row := r.db.QueryRowContext(ctx, q, lockKey, string(domain.ExecutionLockStatusActive))
	item, err := scanExecutionLock(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) || errors.Is(err, domain.ErrExecutionLockNotFound) {
			return domain.ReleaseExecutionLock{}, domain.ErrExecutionLockNotFound
		}
		return domain.ReleaseExecutionLock{}, err
	}
	if strings.TrimSpace(excludeReleaseOrderID) != "" && strings.TrimSpace(item.ReleaseOrderID) == strings.TrimSpace(excludeReleaseOrderID) {
		return domain.ReleaseExecutionLock{}, domain.ErrExecutionLockNotFound
	}
	return item, nil
}

func (r *ReleaseRepository) AcquireExecutionLock(
	ctx context.Context,
	lock domain.ReleaseExecutionLock,
	now time.Time,
) (domain.ReleaseExecutionLock, bool, error) {
	lock.LockKey = strings.TrimSpace(lock.LockKey)
	lock.ReleaseOrderID = strings.TrimSpace(lock.ReleaseOrderID)
	if lock.LockKey == "" || lock.ReleaseOrderID == "" {
		return domain.ReleaseExecutionLock{}, false, fmt.Errorf("lock_key and release_order_id are required")
	}
	if !lock.LockScope.Valid() {
		return domain.ReleaseExecutionLock{}, false, fmt.Errorf("invalid lock_scope")
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return domain.ReleaseExecutionLock{}, false, err
	}
	defer func() { _ = tx.Rollback() }()

	if err := r.expireExecutionLocksTx(ctx, tx, now); err != nil {
		return domain.ReleaseExecutionLock{}, false, err
	}
	if err := r.releaseTerminalOrderExecutionLocksTx(ctx, tx, now); err != nil {
		return domain.ReleaseExecutionLock{}, false, err
	}

	const findQ = `
SELECT id, lock_scope, lock_key, application_id, env_code, release_order_id, release_order_no, status, owner_type, created_at, expired_at, released_at
FROM release_execution_lock
WHERE lock_key = ?
  AND status = ?
  AND released_at IS NULL
ORDER BY created_at ASC
LIMIT 1;`

	row := tx.QueryRowContext(ctx, findQ, lock.LockKey, string(domain.ExecutionLockStatusActive))
	existing, scanErr := scanExecutionLock(row)
	switch {
	case scanErr == nil:
		if strings.TrimSpace(existing.ReleaseOrderID) == lock.ReleaseOrderID {
			if err := tx.Commit(); err != nil {
				return domain.ReleaseExecutionLock{}, false, err
			}
			return existing, true, nil
		}
		if err := tx.Commit(); err != nil {
			return domain.ReleaseExecutionLock{}, false, err
		}
		return existing, false, nil
	case errors.Is(scanErr, sql.ErrNoRows), errors.Is(scanErr, domain.ErrExecutionLockNotFound):
		// continue insert
	default:
		return domain.ReleaseExecutionLock{}, false, scanErr
	}

	const insertQ = `
INSERT INTO release_execution_lock (
	id, lock_scope, lock_key, application_id, env_code, release_order_id, release_order_no, status, owner_type, created_at, expired_at, released_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL);`

	_, err = tx.ExecContext(
		ctx,
		insertQ,
		lock.ID,
		string(lock.LockScope),
		lock.LockKey,
		lock.ApplicationID,
		lock.EnvCode,
		lock.ReleaseOrderID,
		lock.ReleaseOrderNo,
		string(lock.Status),
		lock.OwnerType,
		lock.CreatedAt.UTC().UnixNano(),
		timePtrToUnixNano(lock.ExpiredAt),
	)
	if err != nil {
		return domain.ReleaseExecutionLock{}, false, err
	}
	if err := tx.Commit(); err != nil {
		return domain.ReleaseExecutionLock{}, false, err
	}
	return lock, true, nil
}

func (r *ReleaseRepository) TouchExecutionLocksByOrderID(ctx context.Context, releaseOrderID string, expiredAt time.Time) error {
	const q = `
UPDATE release_execution_lock
SET expired_at = ?
WHERE release_order_id = ?
  AND status = ?
  AND released_at IS NULL;`
	_, err := r.db.ExecContext(
		ctx,
		q,
		expiredAt.UTC().UnixNano(),
		strings.TrimSpace(releaseOrderID),
		string(domain.ExecutionLockStatusActive),
	)
	return err
}

func (r *ReleaseRepository) ReleaseExecutionLocksByOrderID(
	ctx context.Context,
	releaseOrderID string,
	status domain.ExecutionLockStatus,
	releasedAt time.Time,
) error {
	if !status.Valid() {
		status = domain.ExecutionLockStatusReleased
	}
	const q = `
UPDATE release_execution_lock
SET status = ?, released_at = ?
WHERE release_order_id = ?
  AND released_at IS NULL;`
	_, err := r.db.ExecContext(
		ctx,
		q,
		string(status),
		releasedAt.UTC().UnixNano(),
		strings.TrimSpace(releaseOrderID),
	)
	return err
}

func (r *ReleaseRepository) releaseTerminalOrderExecutionLocks(ctx context.Context, releasedAt time.Time) error {
	const q = `
UPDATE release_execution_lock l
JOIN release_order o ON o.id = l.release_order_id
SET l.status = ?, l.released_at = ?
WHERE l.released_at IS NULL
  AND l.status = ?
  AND o.status IN (?, ?, ?);`
	_, err := r.db.ExecContext(
		ctx,
		q,
		string(domain.ExecutionLockStatusReleased),
		releasedAt.UTC().UnixNano(),
		string(domain.ExecutionLockStatusActive),
		string(domain.OrderStatusSuccess),
		string(domain.OrderStatusFailed),
		string(domain.OrderStatusCancelled),
	)
	return err
}

func (r *ReleaseRepository) releaseTerminalOrderExecutionLocksTx(ctx context.Context, tx *sql.Tx, releasedAt time.Time) error {
	const q = `
UPDATE release_execution_lock l
JOIN release_order o ON o.id = l.release_order_id
SET l.status = ?, l.released_at = ?
WHERE l.released_at IS NULL
  AND l.status = ?
  AND o.status IN (?, ?, ?);`
	_, err := tx.ExecContext(
		ctx,
		q,
		string(domain.ExecutionLockStatusReleased),
		releasedAt.UTC().UnixNano(),
		string(domain.ExecutionLockStatusActive),
		string(domain.OrderStatusSuccess),
		string(domain.OrderStatusFailed),
		string(domain.OrderStatusCancelled),
	)
	return err
}

func (r *ReleaseRepository) ListParams(ctx context.Context, releaseOrderID string) ([]domain.ReleaseOrderParam, error) {
	const q = `
SELECT id, release_order_id, pipeline_scope, binding_id, param_key, executor_param_name, param_value, value_source, created_at
FROM release_order_param
WHERE release_order_id = ?
ORDER BY pipeline_scope ASC, created_at ASC, id ASC;`

	rows, err := r.db.QueryContext(ctx, q, releaseOrderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseOrderParam, 0)
	for rows.Next() {
		item, scanErr := scanReleaseOrderParam(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *ReleaseRepository) ListSteps(ctx context.Context, releaseOrderID string) ([]domain.ReleaseOrderStep, error) {
	const q = `
SELECT id, release_order_id, step_scope, execution_id, step_code, step_name, status, message, sort_no, started_at, finished_at, created_at
FROM release_order_step
WHERE release_order_id = ?
ORDER BY sort_no ASC, created_at ASC;`

	rows, err := r.db.QueryContext(ctx, q, releaseOrderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseOrderStep, 0)
	for rows.Next() {
		item, scanErr := scanReleaseOrderStep(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *ReleaseRepository) ListExecutions(ctx context.Context, releaseOrderID string) ([]domain.ReleaseOrderExecution, error) {
	const q = `
SELECT id, release_order_id, pipeline_scope, binding_id, binding_name, provider, pipeline_id, status, queue_url, build_url, external_run_id, started_at, finished_at, created_at, updated_at
FROM release_order_execution
WHERE release_order_id = ?
ORDER BY pipeline_scope ASC, created_at ASC;`

	rows, err := r.db.QueryContext(ctx, q, strings.TrimSpace(releaseOrderID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseOrderExecution, 0)
	for rows.Next() {
		item, scanErr := scanReleaseOrderExecution(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *ReleaseRepository) GetExecutionByScope(
	ctx context.Context,
	releaseOrderID string,
	scope domain.PipelineScope,
) (domain.ReleaseOrderExecution, error) {
	const q = `
SELECT id, release_order_id, pipeline_scope, binding_id, binding_name, provider, pipeline_id, status, queue_url, build_url, external_run_id, started_at, finished_at, created_at, updated_at
FROM release_order_execution
WHERE release_order_id = ? AND pipeline_scope = ?;`

	row := r.db.QueryRowContext(ctx, q, strings.TrimSpace(releaseOrderID), strings.TrimSpace(string(scope)))
	item, err := scanReleaseOrderExecution(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.ReleaseOrderExecution{}, domain.ErrExecutionNotFound
		}
		return domain.ReleaseOrderExecution{}, err
	}
	return item, nil
}

func (r *ReleaseRepository) UpdateExecutionByScope(
	ctx context.Context,
	releaseOrderID string,
	scope domain.PipelineScope,
	input domain.ExecutionUpdateInput,
) (domain.ReleaseOrderExecution, error) {
	const q = `
UPDATE release_order_execution
SET status = ?, queue_url = ?, build_url = ?, external_run_id = ?, started_at = ?, finished_at = ?, updated_at = ?
WHERE release_order_id = ? AND pipeline_scope = ?;`

	res, err := r.db.ExecContext(
		ctx,
		q,
		string(input.Status),
		strings.TrimSpace(input.QueueURL),
		strings.TrimSpace(input.BuildURL),
		strings.TrimSpace(input.ExternalRunID),
		nullableUnixNano(input.StartedAt),
		nullableUnixNano(input.FinishedAt),
		input.UpdatedAt.UTC().UnixNano(),
		strings.TrimSpace(releaseOrderID),
		strings.TrimSpace(string(scope)),
	)
	if err != nil {
		return domain.ReleaseOrderExecution{}, err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return domain.ReleaseOrderExecution{}, err
	}
	if affected == 0 {
		return domain.ReleaseOrderExecution{}, domain.ErrExecutionNotFound
	}
	return r.GetExecutionByScope(ctx, releaseOrderID, scope)
}

func (r *ReleaseRepository) ReplacePipelineStages(
	ctx context.Context,
	releaseOrderID string,
	stages []domain.ReleaseOrderPipelineStage,
) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	if _, err := tx.ExecContext(ctx, `DELETE FROM release_order_pipeline_stage WHERE release_order_id = ?;`, strings.TrimSpace(releaseOrderID)); err != nil {
		return err
	}

	const insertStage = `
INSERT INTO release_order_pipeline_stage (
	id, release_order_id, execution_id, pipeline_scope, executor_type, stage_key, stage_name, status, raw_status, sort_no, duration_millis, started_at, finished_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
	for _, item := range stages {
		if _, err := tx.ExecContext(
			ctx,
			insertStage,
			item.ID,
			item.ReleaseOrderID,
			item.ExecutionID,
			item.PipelineScope,
			item.ExecutorType,
			item.StageKey,
			item.StageName,
			string(item.Status),
			item.RawStatus,
			item.SortNo,
			item.DurationMillis,
			nullableUnixNano(item.StartedAt),
			nullableUnixNano(item.FinishedAt),
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		); err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *ReleaseRepository) ListPipelineStages(
	ctx context.Context,
	releaseOrderID string,
) ([]domain.ReleaseOrderPipelineStage, error) {
	const q = `
SELECT id, release_order_id, execution_id, pipeline_scope, executor_type, stage_key, stage_name, status, raw_status, sort_no, duration_millis, started_at, finished_at, created_at, updated_at
FROM release_order_pipeline_stage
WHERE release_order_id = ?
ORDER BY pipeline_scope ASC, sort_no ASC, created_at ASC;`

	rows, err := r.db.QueryContext(ctx, q, strings.TrimSpace(releaseOrderID))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseOrderPipelineStage, 0)
	for rows.Next() {
		item, scanErr := scanReleaseOrderPipelineStage(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *ReleaseRepository) GetPipelineStageByID(
	ctx context.Context,
	releaseOrderID string,
	stageID string,
) (domain.ReleaseOrderPipelineStage, error) {
	const q = `
SELECT id, release_order_id, execution_id, pipeline_scope, executor_type, stage_key, stage_name, status, raw_status, sort_no, duration_millis, started_at, finished_at, created_at, updated_at
FROM release_order_pipeline_stage
WHERE release_order_id = ? AND id = ?;`

	row := r.db.QueryRowContext(ctx, q, strings.TrimSpace(releaseOrderID), strings.TrimSpace(stageID))
	item, err := scanReleaseOrderPipelineStage(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.ReleaseOrderPipelineStage{}, domain.ErrPipelineStageNotFound
		}
		return domain.ReleaseOrderPipelineStage{}, err
	}
	return item, nil
}

func (r *ReleaseRepository) ReplaceSteps(
	ctx context.Context,
	releaseOrderID string,
	steps []domain.ReleaseOrderStep,
) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	if _, err := tx.ExecContext(ctx, `DELETE FROM release_order_step WHERE release_order_id = ?;`, releaseOrderID); err != nil {
		return err
	}

	const insertStep = `
INSERT INTO release_order_step (
	id, release_order_id, step_scope, execution_id, step_code, step_name, status, message, sort_no, started_at, finished_at, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
	for _, item := range steps {
		if _, execErr := tx.ExecContext(
			ctx,
			insertStep,
			item.ID,
			item.ReleaseOrderID,
			string(item.StepScope),
			item.ExecutionID,
			item.StepCode,
			item.StepName,
			string(item.Status),
			item.Message,
			item.SortNo,
			nullableUnixNano(item.StartedAt),
			nullableUnixNano(item.FinishedAt),
			item.CreatedAt.UTC().UnixNano(),
		); execErr != nil {
			return execErr
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *ReleaseRepository) GetStepByCode(
	ctx context.Context,
	releaseOrderID string,
	stepCode string,
) (domain.ReleaseOrderStep, error) {
	const q = `
SELECT id, release_order_id, step_scope, execution_id, step_code, step_name, status, message, sort_no, started_at, finished_at, created_at
FROM release_order_step
WHERE release_order_id = ? AND step_code = ?;`

	row := r.db.QueryRowContext(ctx, q, releaseOrderID, stepCode)
	item, err := scanReleaseOrderStep(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.ReleaseOrderStep{}, domain.ErrStepNotFound
		}
		return domain.ReleaseOrderStep{}, err
	}
	return item, nil
}

func (r *ReleaseRepository) UpdateStep(
	ctx context.Context,
	releaseOrderID string,
	stepCode string,
	input domain.StepUpdateInput,
) (domain.ReleaseOrderStep, error) {
	const q = `
UPDATE release_order_step
SET status = ?, message = ?, started_at = ?, finished_at = ?
WHERE release_order_id = ? AND step_code = ?;`

	res, err := r.db.ExecContext(
		ctx,
		q,
		string(input.Status),
		input.Message,
		nullableUnixNano(input.StartedAt),
		nullableUnixNano(input.FinishedAt),
		releaseOrderID,
		stepCode,
	)
	if err != nil {
		return domain.ReleaseOrderStep{}, err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return domain.ReleaseOrderStep{}, err
	}
	if affected == 0 {
		return domain.ReleaseOrderStep{}, domain.ErrStepNotFound
	}
	return r.GetStepByCode(ctx, releaseOrderID, stepCode)
}

func (r *ReleaseRepository) CreateTemplate(
	ctx context.Context,
	template domain.ReleaseTemplate,
	bindings []domain.ReleaseTemplateBinding,
	params []domain.ReleaseTemplateParam,
	gitopsRules []domain.ReleaseTemplateGitOpsRule,
) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	const insertTemplate = `
INSERT INTO release_template (
	id, name, application_id, application_name, binding_id, binding_name, binding_type, gitops_type, status, remark, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	if _, err = tx.ExecContext(
		ctx,
		insertTemplate,
		template.ID,
		template.Name,
		template.ApplicationID,
		template.ApplicationName,
		template.BindingID,
		template.BindingName,
		template.BindingType,
		string(template.GitOpsType),
		string(template.Status),
		template.Remark,
		template.CreatedAt.UTC().UnixNano(),
		template.UpdatedAt.UTC().UnixNano(),
	); err != nil {
		if isDuplicateKeyError(r.dbDriver, err) {
			return domain.ErrTemplateDuplicated
		}
		return err
	}

	if err := r.insertTemplateBindings(ctx, tx, bindings); err != nil {
		return err
	}
	if err := r.insertTemplateParams(ctx, tx, params); err != nil {
		return err
	}
	if err := r.insertTemplateGitOpsRules(ctx, tx, gitopsRules); err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *ReleaseRepository) GetTemplateByID(
	ctx context.Context,
	id string,
) (domain.ReleaseTemplate, []domain.ReleaseTemplateBinding, []domain.ReleaseTemplateParam, []domain.ReleaseTemplateGitOpsRule, error) {
	const q = `
SELECT id, name, application_id, application_name, binding_id, binding_name, binding_type, gitops_type, status, remark, created_at, updated_at
FROM release_template
WHERE id = ?;`

	row := r.db.QueryRowContext(ctx, q, strings.TrimSpace(id))
	item, err := scanReleaseTemplate(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.ReleaseTemplate{}, nil, nil, nil, domain.ErrTemplateNotFound
		}
		return domain.ReleaseTemplate{}, nil, nil, nil, err
	}
	bindings, err := r.listTemplateBindings(ctx, item.ID)
	if err != nil {
		return domain.ReleaseTemplate{}, nil, nil, nil, err
	}
	params, err := r.listTemplateParams(ctx, item.ID)
	if err != nil {
		return domain.ReleaseTemplate{}, nil, nil, nil, err
	}
	gitopsRules, err := r.listTemplateGitOpsRules(ctx, item.ID)
	if err != nil {
		return domain.ReleaseTemplate{}, nil, nil, nil, err
	}
	item.ParamCount = len(params)
	return item, bindings, params, gitopsRules, nil
}

func (r *ReleaseRepository) ListTemplates(
	ctx context.Context,
	filter domain.TemplateListFilter,
) ([]domain.ReleaseTemplate, int64, error) {
	where := make([]string, 0, 4)
	args := make([]any, 0, 6)

	if filter.ApplicationID != "" {
		where = append(where, "application_id = ?")
		args = append(args, filter.ApplicationID)
	} else if len(filter.ApplicationIDs) > 0 {
		placeholders := make([]string, 0, len(filter.ApplicationIDs))
		for _, item := range filter.ApplicationIDs {
			value := strings.TrimSpace(item)
			if value == "" {
				continue
			}
			placeholders = append(placeholders, "?")
			args = append(args, value)
		}
		if len(placeholders) == 0 {
			return []domain.ReleaseTemplate{}, 0, nil
		}
		where = append(where, "application_id IN ("+strings.Join(placeholders, ", ")+")")
	}
	if filter.BindingID != "" {
		where = append(where, "binding_id = ?")
		args = append(args, filter.BindingID)
	}
	if filter.Status != "" {
		where = append(where, "status = ?")
		args = append(args, string(filter.Status))
	}

	countQuery := "SELECT COUNT(1) FROM release_template"
	if len(where) > 0 {
		countQuery += " WHERE " + strings.Join(where, " AND ")
	}
	var total int64
	if err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	listQuery := `
SELECT
	t.id, t.name, t.application_id, t.application_name, t.binding_id, t.binding_name, t.binding_type, t.gitops_type, t.status, t.remark, t.created_at, t.updated_at,
	COALESCE(p.param_count, 0)
FROM release_template t
LEFT JOIN (
	SELECT template_id, COUNT(1) AS param_count
	FROM release_template_param
	GROUP BY template_id
) p ON p.template_id = t.id`
	if len(where) > 0 {
		listQuery += " WHERE " + strings.Join(where, " AND ")
	}
	listQuery += " ORDER BY t.created_at DESC LIMIT ? OFFSET ?;"

	offset := (filter.Page - 1) * filter.PageSize
	rows, err := r.db.QueryContext(ctx, listQuery, append(args, filter.PageSize, offset)...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseTemplate, 0)
	for rows.Next() {
		item, scanErr := scanReleaseTemplateWithCount(rows)
		if scanErr != nil {
			return nil, 0, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *ReleaseRepository) UpdateTemplate(
	ctx context.Context,
	template domain.ReleaseTemplate,
	bindings []domain.ReleaseTemplateBinding,
	params []domain.ReleaseTemplateParam,
	gitopsRules []domain.ReleaseTemplateGitOpsRule,
) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	const updateTemplate = `
UPDATE release_template
SET name = ?, application_name = ?, binding_name = ?, binding_type = ?, gitops_type = ?, status = ?, remark = ?, updated_at = ?
WHERE id = ?;`
	res, err := tx.ExecContext(
		ctx,
		updateTemplate,
		template.Name,
		template.ApplicationName,
		template.BindingName,
		template.BindingType,
		string(template.GitOpsType),
		string(template.Status),
		template.Remark,
		template.UpdatedAt.UTC().UnixNano(),
		template.ID,
	)
	if err != nil {
		if isDuplicateKeyError(r.dbDriver, err) {
			return domain.ErrTemplateDuplicated
		}
		return err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return domain.ErrTemplateNotFound
	}

	if _, err := tx.ExecContext(ctx, `DELETE FROM release_template_param WHERE template_id = ?;`, template.ID); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `DELETE FROM release_template_gitops_rule WHERE template_id = ?;`, template.ID); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `DELETE FROM release_template_binding WHERE template_id = ?;`, template.ID); err != nil {
		return err
	}
	if err := r.insertTemplateBindings(ctx, tx, bindings); err != nil {
		return err
	}
	if err := r.insertTemplateParams(ctx, tx, params); err != nil {
		return err
	}
	if err := r.insertTemplateGitOpsRules(ctx, tx, gitopsRules); err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *ReleaseRepository) DeleteTemplate(ctx context.Context, id string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	if _, err := tx.ExecContext(ctx, `DELETE FROM release_template_param WHERE template_id = ?;`, strings.TrimSpace(id)); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `DELETE FROM release_template_gitops_rule WHERE template_id = ?;`, strings.TrimSpace(id)); err != nil {
		return err
	}
	if _, err := tx.ExecContext(ctx, `DELETE FROM release_template_binding WHERE template_id = ?;`, strings.TrimSpace(id)); err != nil {
		return err
	}
	res, err := tx.ExecContext(ctx, `DELETE FROM release_template WHERE id = ?;`, strings.TrimSpace(id))
	if err != nil {
		return err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return domain.ErrTemplateNotFound
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *ReleaseRepository) insertTemplateBindings(
	ctx context.Context,
	tx *sql.Tx,
	bindings []domain.ReleaseTemplateBinding,
) error {
	const insertBinding = `
INSERT INTO release_template_binding (
	id, template_id, pipeline_scope, binding_id, binding_name, provider, pipeline_id, enabled, sort_no, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	for _, item := range bindings {
		if _, err := tx.ExecContext(
			ctx,
			insertBinding,
			item.ID,
			item.TemplateID,
			string(item.PipelineScope),
			item.BindingID,
			item.BindingName,
			item.Provider,
			item.PipelineID,
			boolToInt(item.Enabled),
			item.SortNo,
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		); err != nil {
			return err
		}
	}
	return nil
}

func (r *ReleaseRepository) insertTemplateParams(
	ctx context.Context,
	tx *sql.Tx,
	params []domain.ReleaseTemplateParam,
) error {
	const insertParam = `
INSERT INTO release_template_param (
	id, template_id, template_binding_id, pipeline_scope, binding_id, executor_param_def_id, param_key, param_name, executor_param_name, value_source, source_param_key, source_param_name, fixed_value, required, sort_no, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	for _, item := range params {
		if _, err := tx.ExecContext(
			ctx,
			insertParam,
			item.ID,
			item.TemplateID,
			item.TemplateBindingID,
			string(item.PipelineScope),
			item.BindingID,
			item.ExecutorParamDefID,
			item.ParamKey,
			item.ParamName,
			item.ExecutorParamName,
			string(item.ValueSource),
			item.SourceParamKey,
			item.SourceParamName,
			item.FixedValue,
			boolToInt(item.Required),
			item.SortNo,
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		); err != nil {
			return err
		}
	}
	return nil
}

func (r *ReleaseRepository) insertTemplateGitOpsRules(
	ctx context.Context,
	tx *sql.Tx,
	rules []domain.ReleaseTemplateGitOpsRule,
) error {
	const insertRule = `
INSERT INTO release_template_gitops_rule (
	id, template_id, pipeline_scope, source_param_key, source_param_name, source_from, locator_param_key, locator_param_name, file_path_template, document_kind, document_name, target_path, value_template, sort_no, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	for _, item := range rules {
		if _, err := tx.ExecContext(
			ctx,
			insertRule,
			item.ID,
			item.TemplateID,
			string(item.PipelineScope),
			item.SourceParamKey,
			item.SourceParamName,
			string(item.SourceFrom),
			item.LocatorParamKey,
			item.LocatorParamName,
			item.FilePathTemplate,
			item.DocumentKind,
			item.DocumentName,
			item.TargetPath,
			item.ValueTemplate,
			item.SortNo,
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		); err != nil {
			return err
		}
	}
	return nil
}

func (r *ReleaseRepository) listTemplateBindings(
	ctx context.Context,
	templateID string,
) ([]domain.ReleaseTemplateBinding, error) {
	const q = `
SELECT id, template_id, pipeline_scope, binding_id, binding_name, provider, pipeline_id, enabled, sort_no, created_at, updated_at
FROM release_template_binding
WHERE template_id = ?
ORDER BY sort_no ASC, created_at ASC;`

	rows, err := r.db.QueryContext(ctx, q, templateID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseTemplateBinding, 0)
	for rows.Next() {
		item, scanErr := scanReleaseTemplateBinding(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *ReleaseRepository) listTemplateParams(
	ctx context.Context,
	templateID string,
) ([]domain.ReleaseTemplateParam, error) {
	const q = `
SELECT id, template_id, template_binding_id, pipeline_scope, binding_id, executor_param_def_id, param_key, param_name, executor_param_name, value_source, source_param_key, source_param_name, fixed_value, required, sort_no, created_at, updated_at
FROM release_template_param
WHERE template_id = ?
ORDER BY pipeline_scope ASC, sort_no ASC, created_at ASC;`

	rows, err := r.db.QueryContext(ctx, q, templateID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseTemplateParam, 0)
	for rows.Next() {
		item, scanErr := scanReleaseTemplateParam(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func (r *ReleaseRepository) listTemplateGitOpsRules(
	ctx context.Context,
	templateID string,
) ([]domain.ReleaseTemplateGitOpsRule, error) {
	const q = `
SELECT id, template_id, pipeline_scope, source_param_key, source_param_name, source_from, locator_param_key, locator_param_name, file_path_template, document_kind, document_name, target_path, value_template, sort_no, created_at, updated_at
FROM release_template_gitops_rule
WHERE template_id = ?
ORDER BY sort_no ASC, created_at ASC;`

	rows, err := r.db.QueryContext(ctx, q, templateID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]domain.ReleaseTemplateGitOpsRule, 0)
	for rows.Next() {
		item, scanErr := scanReleaseTemplateGitOpsRule(rows)
		if scanErr != nil {
			return nil, scanErr
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

func scanReleaseOrder(s scanner) (domain.ReleaseOrder, error) {
	var (
		item              domain.ReleaseOrder
		operationType     string
		triggerType       string
		status            string
		isConcurrentValue any
		startedAt         sql.NullInt64
		finishedAt        sql.NullInt64
		createdAt         int64
		updatedAt         int64
	)
	if err := s.Scan(
		&item.ID,
		&item.OrderNo,
		&item.PreviousOrderNo,
		&operationType,
		&item.SourceOrderID,
		&item.SourceOrderNo,
		&isConcurrentValue,
		&item.ConcurrentBatchNo,
		&item.ConcurrentBatchSeq,
		&item.ApplicationID,
		&item.ApplicationName,
		&item.TemplateID,
		&item.TemplateName,
		&item.BindingID,
		&item.PipelineID,
		&item.EnvCode,
		&item.SonService,
		&item.GitRef,
		&item.ImageTag,
		&triggerType,
		&status,
		&item.Remark,
		&item.CreatorUserID,
		&item.TriggeredBy,
		&startedAt,
		&finishedAt,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseOrder{}, err
	}

	item.OperationType = domain.OperationType(operationType)
	item.IsConcurrent = scanBoolValue(isConcurrentValue)
	item.TriggerType = domain.TriggerType(triggerType)
	item.Status = domain.OrderStatus(status)
	if startedAt.Valid {
		t := time.Unix(0, startedAt.Int64).UTC()
		item.StartedAt = &t
	}
	if finishedAt.Valid {
		t := time.Unix(0, finishedAt.Int64).UTC()
		item.FinishedAt = &t
	}
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseOrderParam(s scanner) (domain.ReleaseOrderParam, error) {
	var (
		item          domain.ReleaseOrderParam
		pipelineScope string
		valueSource   string
		createdAt     int64
	)
	if err := s.Scan(
		&item.ID,
		&item.ReleaseOrderID,
		&pipelineScope,
		&item.BindingID,
		&item.ParamKey,
		&item.ExecutorParamName,
		&item.ParamValue,
		&valueSource,
		&createdAt,
	); err != nil {
		return domain.ReleaseOrderParam{}, err
	}
	item.PipelineScope = domain.PipelineScope(pipelineScope)
	item.ValueSource = domain.ValueSource(valueSource)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	return item, nil
}

func scanReleaseOrderExecution(s scanner) (domain.ReleaseOrderExecution, error) {
	var (
		item          domain.ReleaseOrderExecution
		pipelineScope string
		statusRaw     string
		startedAt     sql.NullInt64
		finishedAt    sql.NullInt64
		createdAt     int64
		updatedAt     int64
	)
	if err := s.Scan(
		&item.ID,
		&item.ReleaseOrderID,
		&pipelineScope,
		&item.BindingID,
		&item.BindingName,
		&item.Provider,
		&item.PipelineID,
		&statusRaw,
		&item.QueueURL,
		&item.BuildURL,
		&item.ExternalRunID,
		&startedAt,
		&finishedAt,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseOrderExecution{}, err
	}
	item.PipelineScope = domain.PipelineScope(pipelineScope)
	item.Status = domain.ExecutionStatus(statusRaw)
	if startedAt.Valid {
		t := time.Unix(0, startedAt.Int64).UTC()
		item.StartedAt = &t
	}
	if finishedAt.Valid {
		t := time.Unix(0, finishedAt.Int64).UTC()
		item.FinishedAt = &t
	}
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseOrderStep(s scanner) (domain.ReleaseOrderStep, error) {
	var (
		item       domain.ReleaseOrderStep
		stepScope  string
		statusRaw  string
		startedAt  sql.NullInt64
		finishedAt sql.NullInt64
		createdAt  int64
	)
	if err := s.Scan(
		&item.ID,
		&item.ReleaseOrderID,
		&stepScope,
		&item.ExecutionID,
		&item.StepCode,
		&item.StepName,
		&statusRaw,
		&item.Message,
		&item.SortNo,
		&startedAt,
		&finishedAt,
		&createdAt,
	); err != nil {
		return domain.ReleaseOrderStep{}, err
	}
	item.StepScope = domain.StepScope(stepScope)
	item.Status = domain.StepStatus(statusRaw)
	if startedAt.Valid {
		t := time.Unix(0, startedAt.Int64).UTC()
		item.StartedAt = &t
	}
	if finishedAt.Valid {
		t := time.Unix(0, finishedAt.Int64).UTC()
		item.FinishedAt = &t
	}
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	return item, nil
}

func scanReleaseOrderPipelineStage(s scanner) (domain.ReleaseOrderPipelineStage, error) {
	var (
		item          domain.ReleaseOrderPipelineStage
		statusRaw     string
		startedAt     sql.NullInt64
		finishedAt    sql.NullInt64
		durationMilli int64
		createdAt     int64
		updatedAt     int64
	)
	if err := s.Scan(
		&item.ID,
		&item.ReleaseOrderID,
		&item.ExecutionID,
		&item.PipelineScope,
		&item.ExecutorType,
		&item.StageKey,
		&item.StageName,
		&statusRaw,
		&item.RawStatus,
		&item.SortNo,
		&durationMilli,
		&startedAt,
		&finishedAt,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseOrderPipelineStage{}, err
	}
	item.Status = domain.PipelineStageStatus(statusRaw)
	item.DurationMillis = durationMilli
	if startedAt.Valid {
		t := time.Unix(0, startedAt.Int64).UTC()
		item.StartedAt = &t
	}
	if finishedAt.Valid {
		t := time.Unix(0, finishedAt.Int64).UTC()
		item.FinishedAt = &t
	}
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseTemplateBinding(s scanner) (domain.ReleaseTemplateBinding, error) {
	var (
		item          domain.ReleaseTemplateBinding
		pipelineScope string
		enabled       int
		createdAt     int64
		updatedAt     int64
	)
	if err := s.Scan(
		&item.ID,
		&item.TemplateID,
		&pipelineScope,
		&item.BindingID,
		&item.BindingName,
		&item.Provider,
		&item.PipelineID,
		&enabled,
		&item.SortNo,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseTemplateBinding{}, err
	}
	item.PipelineScope = domain.PipelineScope(pipelineScope)
	item.Enabled = enabled > 0
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseTemplate(s scanner) (domain.ReleaseTemplate, error) {
	var (
		item      domain.ReleaseTemplate
		gitopsRaw string
		statusRaw string
		createdAt int64
		updatedAt int64
	)
	if err := s.Scan(
		&item.ID,
		&item.Name,
		&item.ApplicationID,
		&item.ApplicationName,
		&item.BindingID,
		&item.BindingName,
		&item.BindingType,
		&gitopsRaw,
		&statusRaw,
		&item.Remark,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseTemplate{}, err
	}
	item.GitOpsType = domain.GitOpsType(gitopsRaw)
	item.Status = domain.TemplateStatus(statusRaw)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseTemplateWithCount(s scanner) (domain.ReleaseTemplate, error) {
	var (
		item      domain.ReleaseTemplate
		gitopsRaw string
		statusRaw string
		createdAt int64
		updatedAt int64
	)
	if err := s.Scan(
		&item.ID,
		&item.Name,
		&item.ApplicationID,
		&item.ApplicationName,
		&item.BindingID,
		&item.BindingName,
		&item.BindingType,
		&gitopsRaw,
		&statusRaw,
		&item.Remark,
		&createdAt,
		&updatedAt,
		&item.ParamCount,
	); err != nil {
		return domain.ReleaseTemplate{}, err
	}
	item.GitOpsType = domain.GitOpsType(gitopsRaw)
	item.Status = domain.TemplateStatus(statusRaw)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseTemplateParam(s scanner) (domain.ReleaseTemplateParam, error) {
	var (
		item          domain.ReleaseTemplateParam
		pipelineScope string
		valueSource   string
		required      int
		createdAt     int64
		updatedAt     int64
	)
	if err := s.Scan(
		&item.ID,
		&item.TemplateID,
		&item.TemplateBindingID,
		&pipelineScope,
		&item.BindingID,
		&item.ExecutorParamDefID,
		&item.ParamKey,
		&item.ParamName,
		&item.ExecutorParamName,
		&valueSource,
		&item.SourceParamKey,
		&item.SourceParamName,
		&item.FixedValue,
		&required,
		&item.SortNo,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseTemplateParam{}, err
	}
	item.PipelineScope = domain.PipelineScope(pipelineScope)
	item.ValueSource = domain.TemplateParamValueSource(valueSource)
	item.Required = required > 0
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseTemplateGitOpsRule(s scanner) (domain.ReleaseTemplateGitOpsRule, error) {
	var (
		item          domain.ReleaseTemplateGitOpsRule
		pipelineScope string
		sourceFrom    string
		createdAt     int64
		updatedAt     int64
	)
	if err := s.Scan(
		&item.ID,
		&item.TemplateID,
		&pipelineScope,
		&item.SourceParamKey,
		&item.SourceParamName,
		&sourceFrom,
		&item.LocatorParamKey,
		&item.LocatorParamName,
		&item.FilePathTemplate,
		&item.DocumentKind,
		&item.DocumentName,
		&item.TargetPath,
		&item.ValueTemplate,
		&item.SortNo,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseTemplateGitOpsRule{}, err
	}
	item.PipelineScope = domain.PipelineScope(pipelineScope)
	item.SourceFrom = domain.GitOpsRuleSourceFrom(sourceFrom)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanExecutionLock(s scanner) (domain.ReleaseExecutionLock, error) {
	var (
		item       domain.ReleaseExecutionLock
		lockScope  string
		status     string
		createdAt  int64
		expiredAt  sql.NullInt64
		releasedAt sql.NullInt64
	)
	if err := s.Scan(
		&item.ID,
		&lockScope,
		&item.LockKey,
		&item.ApplicationID,
		&item.EnvCode,
		&item.ReleaseOrderID,
		&item.ReleaseOrderNo,
		&status,
		&item.OwnerType,
		&createdAt,
		&expiredAt,
		&releasedAt,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.ReleaseExecutionLock{}, domain.ErrExecutionLockNotFound
		}
		return domain.ReleaseExecutionLock{}, err
	}
	item.LockScope = domain.ExecutionLockScope(lockScope)
	item.Status = domain.ExecutionLockStatus(status)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	if expiredAt.Valid {
		value := time.Unix(0, expiredAt.Int64).UTC()
		item.ExpiredAt = &value
	}
	if releasedAt.Valid {
		value := time.Unix(0, releasedAt.Int64).UTC()
		item.ReleasedAt = &value
	}
	return item, nil
}

func (r *ReleaseRepository) expireExecutionLocks(ctx context.Context, now time.Time) error {
	_, err := r.db.ExecContext(
		ctx,
		`UPDATE release_execution_lock
SET status = ?, released_at = ?
WHERE status = ?
  AND released_at IS NULL
  AND expired_at IS NOT NULL
  AND expired_at <= ?;`,
		string(domain.ExecutionLockStatusExpired),
		now.UTC().UnixNano(),
		string(domain.ExecutionLockStatusActive),
		now.UTC().UnixNano(),
	)
	return err
}

func (r *ReleaseRepository) expireExecutionLocksTx(ctx context.Context, tx *sql.Tx, now time.Time) error {
	_, err := tx.ExecContext(
		ctx,
		`UPDATE release_execution_lock
SET status = ?, released_at = ?
WHERE status = ?
  AND released_at IS NULL
  AND expired_at IS NOT NULL
  AND expired_at <= ?;`,
		string(domain.ExecutionLockStatusExpired),
		now.UTC().UnixNano(),
		string(domain.ExecutionLockStatusActive),
		now.UTC().UnixNano(),
	)
	return err
}

func nullableUnixNano(t *time.Time) any {
	if t == nil {
		return nil
	}
	return t.UTC().UnixNano()
}

func boolToDBValue(driver string, value bool) any {
	switch strings.ToLower(strings.TrimSpace(driver)) {
	case "sqlite":
		if value {
			return 1
		}
		return 0
	default:
		return value
	}
}

func scanBoolValue(raw any) bool {
	switch value := raw.(type) {
	case bool:
		return value
	case int64:
		return value != 0
	case []byte:
		text := strings.TrimSpace(string(value))
		return text == "1" || strings.EqualFold(text, "true")
	case string:
		text := strings.TrimSpace(value)
		return text == "1" || strings.EqualFold(text, "true")
	default:
		return false
	}
}

func timePtrToUnixNano(t *time.Time) any {
	if t == nil {
		return nil
	}
	return t.UTC().UnixNano()
}
