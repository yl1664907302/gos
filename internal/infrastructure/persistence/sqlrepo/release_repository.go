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
	return nil
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
	binding_id VARCHAR(64) NOT NULL,
	pipeline_id VARCHAR(64) NOT NULL DEFAULT '',
	env_code VARCHAR(50) NOT NULL,
	git_ref VARCHAR(200) NOT NULL DEFAULT '',
	image_tag VARCHAR(200) NOT NULL DEFAULT '',
	trigger_type VARCHAR(50) NOT NULL,
	status VARCHAR(50) NOT NULL,
	remark VARCHAR(500) NOT NULL DEFAULT '',
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
			`CREATE TABLE IF NOT EXISTS release_order_param (
	id VARCHAR(64) PRIMARY KEY,
	release_order_id VARCHAR(64) NOT NULL,
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
		}, nil

	case "sqlite":
		return []string{
			`CREATE TABLE IF NOT EXISTS release_order (
	id TEXT PRIMARY KEY,
	order_no TEXT NOT NULL UNIQUE,
	application_id TEXT NOT NULL,
	application_name TEXT NOT NULL DEFAULT '',
	binding_id TEXT NOT NULL,
	pipeline_id TEXT NOT NULL DEFAULT '',
	env_code TEXT NOT NULL,
	git_ref TEXT NOT NULL DEFAULT '',
	image_tag TEXT NOT NULL DEFAULT '',
	trigger_type TEXT NOT NULL,
	status TEXT NOT NULL,
	remark TEXT NOT NULL DEFAULT '',
	triggered_by TEXT NOT NULL DEFAULT '',
	started_at INTEGER NULL,
	finished_at INTEGER NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_application ON release_order (application_id);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_binding ON release_order (binding_id);`,
			`CREATE INDEX IF NOT EXISTS idx_release_order_created_at ON release_order (created_at);`,
			`CREATE TABLE IF NOT EXISTS release_order_param (
	id TEXT PRIMARY KEY,
	release_order_id TEXT NOT NULL,
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
		}, nil

	default:
		return nil, fmt.Errorf("unsupported db driver: %s", dbDriver)
	}
}

func (r *ReleaseRepository) Create(
	ctx context.Context,
	order domain.ReleaseOrder,
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
	id, order_no, application_id, application_name, binding_id, pipeline_id, env_code,
	git_ref, image_tag, trigger_type, status, remark, triggered_by, started_at, finished_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	_, err = tx.ExecContext(
		ctx,
		insertOrder,
		order.ID,
		order.OrderNo,
		order.ApplicationID,
		order.ApplicationName,
		order.BindingID,
		order.PipelineID,
		order.EnvCode,
		order.GitRef,
		order.ImageTag,
		string(order.TriggerType),
		string(order.Status),
		order.Remark,
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

	const insertParam = `
INSERT INTO release_order_param (
	id, release_order_id, param_key, executor_param_name, param_value, value_source, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?);`
	for _, item := range params {
		if _, execErr := tx.ExecContext(
			ctx,
			insertParam,
			item.ID,
			item.ReleaseOrderID,
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
	id, release_order_id, step_code, step_name, status, message, sort_no, started_at, finished_at, created_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
	for _, item := range steps {
		if _, execErr := tx.ExecContext(
			ctx,
			insertStep,
			item.ID,
			item.ReleaseOrderID,
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
SELECT id, order_no, application_id, application_name, binding_id, pipeline_id, env_code, git_ref, image_tag,
	trigger_type, status, remark, triggered_by, started_at, finished_at, created_at, updated_at
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
	}
	if filter.BindingID != "" {
		where = append(where, "binding_id = ?")
		args = append(args, filter.BindingID)
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
SELECT id, order_no, application_id, application_name, binding_id, pipeline_id, env_code, git_ref, image_tag,
	trigger_type, status, remark, triggered_by, started_at, finished_at, created_at, updated_at
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
SELECT id, release_order_id, param_key, executor_param_name, param_value, value_source, created_at
FROM release_order_param
WHERE release_order_id = ?
ORDER BY created_at ASC, id ASC;`

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
SELECT id, release_order_id, step_code, step_name, status, message, sort_no, started_at, finished_at, created_at
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

func (r *ReleaseRepository) GetStepByCode(
	ctx context.Context,
	releaseOrderID string,
	stepCode string,
) (domain.ReleaseOrderStep, error) {
	const q = `
SELECT id, release_order_id, step_code, step_name, status, message, sort_no, started_at, finished_at, created_at
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
		&item.BindingID,
		&item.PipelineID,
		&item.EnvCode,
		&item.GitRef,
		&item.ImageTag,
		&triggerType,
		&status,
		&item.Remark,
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
		item        domain.ReleaseOrderParam
		valueSource string
		createdAt   int64
	)
	if err := s.Scan(
		&item.ID,
		&item.ReleaseOrderID,
		&item.ParamKey,
		&item.ExecutorParamName,
		&item.ParamValue,
		&valueSource,
		&createdAt,
	); err != nil {
		return domain.ReleaseOrderParam{}, err
	}
	item.ValueSource = domain.ValueSource(valueSource)
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	return item, nil
}

func scanReleaseOrderStep(s scanner) (domain.ReleaseOrderStep, error) {
	var (
		item       domain.ReleaseOrderStep
		statusRaw  string
		startedAt  sql.NullInt64
		finishedAt sql.NullInt64
		createdAt  int64
	)
	if err := s.Scan(
		&item.ID,
		&item.ReleaseOrderID,
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

func nullableUnixNano(t *time.Time) any {
	if t == nil {
		return nil
	}
	return t.UTC().UnixNano()
}
