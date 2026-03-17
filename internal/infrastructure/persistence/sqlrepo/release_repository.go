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
	required TINYINT(1) NOT NULL DEFAULT 0,
	sort_no INT NOT NULL DEFAULT 0,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_release_template_param_unique (template_id, executor_param_def_id),
	KEY idx_release_template_param_template_sort (template_id, sort_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
		}, nil

	case "sqlite":
		return []string{
			`CREATE TABLE IF NOT EXISTS release_order (
	id TEXT PRIMARY KEY,
	order_no TEXT NOT NULL UNIQUE,
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
	required INTEGER NOT NULL DEFAULT 0,
	sort_no INTEGER NOT NULL DEFAULT 0,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(template_id, executor_param_def_id)
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_template_param_template_sort ON release_template_param (template_id, sort_no);`,
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
			{"release_template_param", "template_binding_id", `ALTER TABLE release_template_param ADD COLUMN template_binding_id VARCHAR(64) NOT NULL DEFAULT '' AFTER template_id;`},
			{"release_template_param", "pipeline_scope", `ALTER TABLE release_template_param ADD COLUMN pipeline_scope VARCHAR(20) NOT NULL DEFAULT '' AFTER template_binding_id;`},
			{"release_template_param", "binding_id", `ALTER TABLE release_template_param ADD COLUMN binding_id VARCHAR(64) NOT NULL DEFAULT '' AFTER pipeline_scope;`},
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
		return err
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
			{"release_template_param", "template_binding_id", `ALTER TABLE release_template_param ADD COLUMN template_binding_id TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "pipeline_scope", `ALTER TABLE release_template_param ADD COLUMN pipeline_scope TEXT NOT NULL DEFAULT '';`},
			{"release_template_param", "binding_id", `ALTER TABLE release_template_param ADD COLUMN binding_id TEXT NOT NULL DEFAULT '';`},
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
		return err
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
	id, order_no, application_id, application_name, template_id, template_name, binding_id, pipeline_id, env_code,
	son_service, git_ref, image_tag, trigger_type, status, remark, creator_user_id, triggered_by, started_at, finished_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	_, err = tx.ExecContext(
		ctx,
		insertOrder,
		order.ID,
		order.OrderNo,
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
SELECT id, order_no, application_id, application_name, template_id, template_name, binding_id, pipeline_id, env_code, son_service, git_ref, image_tag,
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
SELECT id, order_no, application_id, application_name, template_id, template_name, binding_id, pipeline_id, env_code, son_service, git_ref, image_tag,
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
	id, name, application_id, application_name, binding_id, binding_name, binding_type, status, remark, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

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

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *ReleaseRepository) GetTemplateByID(
	ctx context.Context,
	id string,
) (domain.ReleaseTemplate, []domain.ReleaseTemplateBinding, []domain.ReleaseTemplateParam, error) {
	const q = `
SELECT id, name, application_id, application_name, binding_id, binding_name, binding_type, status, remark, created_at, updated_at
FROM release_template
WHERE id = ?;`

	row := r.db.QueryRowContext(ctx, q, strings.TrimSpace(id))
	item, err := scanReleaseTemplate(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.ReleaseTemplate{}, nil, nil, domain.ErrTemplateNotFound
		}
		return domain.ReleaseTemplate{}, nil, nil, err
	}
	bindings, err := r.listTemplateBindings(ctx, item.ID)
	if err != nil {
		return domain.ReleaseTemplate{}, nil, nil, err
	}
	params, err := r.listTemplateParams(ctx, item.ID)
	if err != nil {
		return domain.ReleaseTemplate{}, nil, nil, err
	}
	item.ParamCount = len(params)
	return item, bindings, params, nil
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
	t.id, t.name, t.application_id, t.application_name, t.binding_id, t.binding_name, t.binding_type, t.status, t.remark, t.created_at, t.updated_at,
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
SET name = ?, application_name = ?, binding_name = ?, binding_type = ?, status = ?, remark = ?, updated_at = ?
WHERE id = ?;`
	res, err := tx.ExecContext(
		ctx,
		updateTemplate,
		template.Name,
		template.ApplicationName,
		template.BindingName,
		template.BindingType,
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
	if _, err := tx.ExecContext(ctx, `DELETE FROM release_template_binding WHERE template_id = ?;`, template.ID); err != nil {
		return err
	}
	if err := r.insertTemplateBindings(ctx, tx, bindings); err != nil {
		return err
	}
	if err := r.insertTemplateParams(ctx, tx, params); err != nil {
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
	id, template_id, template_binding_id, pipeline_scope, binding_id, executor_param_def_id, param_key, param_name, executor_param_name, required, sort_no, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

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
SELECT id, template_id, template_binding_id, pipeline_scope, binding_id, executor_param_def_id, param_key, param_name, executor_param_name, required, sort_no, created_at, updated_at
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

func scanReleaseOrder(s scanner) (domain.ReleaseOrder, error) {
	var (
		item        domain.ReleaseOrder
		triggerType string
		status      string
		startedAt   sql.NullInt64
		finishedAt  sql.NullInt64
		createdAt   int64
		updatedAt   int64
	)
	if err := s.Scan(
		&item.ID,
		&item.OrderNo,
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
		&statusRaw,
		&item.Remark,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseTemplate{}, err
	}
	item.Status = domain.TemplateStatus(statusRaw)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseTemplateWithCount(s scanner) (domain.ReleaseTemplate, error) {
	var (
		item      domain.ReleaseTemplate
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
		&statusRaw,
		&item.Remark,
		&createdAt,
		&updatedAt,
		&item.ParamCount,
	); err != nil {
		return domain.ReleaseTemplate{}, err
	}
	item.Status = domain.TemplateStatus(statusRaw)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func scanReleaseTemplateParam(s scanner) (domain.ReleaseTemplateParam, error) {
	var (
		item          domain.ReleaseTemplateParam
		pipelineScope string
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
		&required,
		&item.SortNo,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.ReleaseTemplateParam{}, err
	}
	item.PipelineScope = domain.PipelineScope(pipelineScope)
	item.Required = required > 0
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}

func nullableUnixNano(t *time.Time) any {
	if t == nil {
		return nil
	}
	return t.UTC().UnixNano()
}
