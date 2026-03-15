package sqlrepo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	domain "gos/internal/domain/pipelineparam"
)

type PipelineParamRepository struct {
	db       *sql.DB
	dbDriver string
}

func NewPipelineParamRepository(db *sql.DB, dbDriver string) *PipelineParamRepository {
	return &PipelineParamRepository{
		db:       db,
		dbDriver: strings.ToLower(strings.TrimSpace(dbDriver)),
	}
}

func (r *PipelineParamRepository) InitSchema(ctx context.Context) error {
	statements, err := r.schemaStatements()
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

func (r *PipelineParamRepository) schemaStatements() ([]string, error) {
	switch r.dbDriver {
	case "mysql":
		return []string{
			`CREATE TABLE IF NOT EXISTS pipeline_param_def (
	id VARCHAR(64) PRIMARY KEY,
	pipeline_id VARCHAR(64) NOT NULL,
	executor_type VARCHAR(50) NOT NULL,
	executor_param_name VARCHAR(100) NOT NULL,
	param_key VARCHAR(100) NOT NULL DEFAULT '',
	param_type VARCHAR(50) NOT NULL,
	single_select TINYINT(1) NOT NULL DEFAULT 0,
	required TINYINT(1) NOT NULL,
	default_value VARCHAR(500) NOT NULL,
	description VARCHAR(500) NOT NULL,
	visible TINYINT(1) NOT NULL,
	editable TINYINT(1) NOT NULL,
	source_from VARCHAR(50) NOT NULL,
	status VARCHAR(32) NOT NULL DEFAULT 'active',
	raw_meta JSON NULL,
	sort_no INT NOT NULL,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uq_pipeline_param_unique (pipeline_id, executor_type, executor_param_name),
	KEY idx_pipeline_param_pipeline_sort (pipeline_id, sort_no),
	KEY idx_pipeline_param_param_key (param_key),
	KEY idx_pipeline_param_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
		}, nil
	case "sqlite":
		return []string{
			`CREATE TABLE IF NOT EXISTS pipeline_param_def (
	id TEXT PRIMARY KEY,
	pipeline_id TEXT NOT NULL,
	executor_type TEXT NOT NULL,
	executor_param_name TEXT NOT NULL,
	param_key TEXT NOT NULL DEFAULT '',
	param_type TEXT NOT NULL,
	single_select INTEGER NOT NULL DEFAULT 0,
	required INTEGER NOT NULL,
	default_value TEXT NOT NULL,
	description TEXT NOT NULL,
	visible INTEGER NOT NULL,
	editable INTEGER NOT NULL,
	source_from TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'active',
	raw_meta TEXT NOT NULL,
	sort_no INTEGER NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(pipeline_id, executor_type, executor_param_name)
);`,
			`CREATE INDEX IF NOT EXISTS idx_pipeline_param_pipeline_sort ON pipeline_param_def (pipeline_id, sort_no);`,
			`CREATE INDEX IF NOT EXISTS idx_pipeline_param_param_key ON pipeline_param_def (param_key);`,
			`CREATE INDEX IF NOT EXISTS idx_pipeline_param_status ON pipeline_param_def (status);`,
		}, nil
	default:
		return nil, fmt.Errorf("unsupported db driver: %s", r.dbDriver)
	}
}

func (r *PipelineParamRepository) migrateSchema(ctx context.Context) error {
	switch r.dbDriver {
	case "mysql":
		type columnDef struct {
			name string
			ddl  string
		}
		additions := []columnDef{
			{
				name: "single_select",
				ddl:  `ALTER TABLE pipeline_param_def ADD COLUMN single_select TINYINT(1) NOT NULL DEFAULT 0 AFTER param_type;`,
			},
			{
				name: "status",
				ddl:  `ALTER TABLE pipeline_param_def ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'active' AFTER source_from;`,
			},
		}
		for _, item := range additions {
			exists, err := r.mysqlColumnExists(ctx, "pipeline_param_def", item.name)
			if err != nil {
				return err
			}
			if exists {
				continue
			}
			if _, err := r.db.ExecContext(ctx, item.ddl); err != nil {
				return err
			}
		}
		return nil
	case "sqlite":
		columns, err := r.sqliteTableColumns(ctx, "pipeline_param_def")
		if err != nil {
			return err
		}
		if _, ok := columns["single_select"]; !ok {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE pipeline_param_def ADD COLUMN single_select INTEGER NOT NULL DEFAULT 0;`,
			); err != nil {
				return err
			}
		}
		if _, ok := columns["status"]; !ok {
			if _, err = r.db.ExecContext(
				ctx,
				`ALTER TABLE pipeline_param_def ADD COLUMN status TEXT NOT NULL DEFAULT 'active';`,
			); err != nil {
				return err
			}
		}
		return nil
	default:
		return fmt.Errorf("unsupported db driver: %s", r.dbDriver)
	}
}

func (r *PipelineParamRepository) mysqlColumnExists(ctx context.Context, table, column string) (bool, error) {
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

func (r *PipelineParamRepository) sqliteTableColumns(ctx context.Context, table string) (map[string]struct{}, error) {
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

func (r *PipelineParamRepository) Upsert(ctx context.Context, items []domain.PipelineParamDef) (int, int, error) {
	if r.dbDriver == "mysql" {
		return r.upsertMySQL(ctx, items)
	}

	const (
		updateByKey = `UPDATE pipeline_param_def
SET param_type = ?, single_select = ?, required = ?, default_value = ?, description = ?, visible = ?, editable = ?, source_from = ?, status = ?, raw_meta = ?, sort_no = ?, updated_at = ?
WHERE pipeline_id = ? AND executor_type = ? AND executor_param_name = ?;`
		insert = `INSERT INTO pipeline_param_def (
	id, pipeline_id, executor_type, executor_param_name, param_key, param_type, single_select, required, default_value, description, visible, editable, source_from, status, raw_meta, sort_no, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
	)

	created := 0
	updated := 0
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return created, updated, err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	updateStmt, err := tx.PrepareContext(ctx, updateByKey)
	if err != nil {
		return created, updated, err
	}
	defer func() { _ = updateStmt.Close() }()

	insertStmt, err := tx.PrepareContext(ctx, insert)
	if err != nil {
		return created, updated, err
	}
	defer func() { _ = insertStmt.Close() }()

	for _, item := range items {
		res, err := updateStmt.ExecContext(
			ctx,
			string(item.ParamType),
			boolToInt(item.SingleSelect),
			boolToInt(item.Required),
			item.DefaultValue,
			item.Description,
			boolToInt(item.Visible),
			boolToInt(item.Editable),
			string(item.SourceFrom),
			string(item.Status),
			item.RawMeta,
			item.SortNo,
			item.UpdatedAt.UTC().UnixNano(),
			item.PipelineID,
			string(item.ExecutorType),
			item.ExecutorParamName,
		)
		if err != nil {
			return created, updated, err
		}
		affected, err := res.RowsAffected()
		if err != nil {
			return created, updated, err
		}
		if affected > 0 {
			updated++
			continue
		}

		_, err = insertStmt.ExecContext(
			ctx,
			item.ID,
			item.PipelineID,
			string(item.ExecutorType),
			item.ExecutorParamName,
			item.ParamKey,
			string(item.ParamType),
			boolToInt(item.SingleSelect),
			boolToInt(item.Required),
			item.DefaultValue,
			item.Description,
			boolToInt(item.Visible),
			boolToInt(item.Editable),
			string(item.SourceFrom),
			string(item.Status),
			item.RawMeta,
			item.SortNo,
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		)
		if err != nil {
			if isDuplicateKeyError(r.dbDriver, err) {
				updated++
				continue
			}
			return created, updated, err
		}
		created++
	}

	if err := tx.Commit(); err != nil {
		return created, updated, err
	}
	return created, updated, nil
}

func (r *PipelineParamRepository) upsertMySQL(ctx context.Context, items []domain.PipelineParamDef) (int, int, error) {
	if len(items) == 0 {
		return 0, 0, nil
	}

	existingKeys, err := r.mysqlExistingParamKeys(ctx, items)
	if err != nil {
		return 0, 0, err
	}

	created := 0
	updated := 0
	for _, item := range items {
		if _, ok := existingKeys[pipelineParamUniqueKey(item.PipelineID, item.ExecutorType, item.ExecutorParamName)]; ok {
			updated++
			continue
		}
		created++
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, 0, err
	}
	defer func() {
		_ = tx.Rollback()
	}()

	const batchSize = 200
	for start := 0; start < len(items); start += batchSize {
		end := start + batchSize
		if end > len(items) {
			end = len(items)
		}
		if err := r.mysqlBatchUpsert(ctx, tx, items[start:end]); err != nil {
			return 0, 0, err
		}
	}

	if err := tx.Commit(); err != nil {
		return 0, 0, err
	}
	return created, updated, nil
}

func (r *PipelineParamRepository) mysqlBatchUpsert(ctx context.Context, tx *sql.Tx, items []domain.PipelineParamDef) error {
	if len(items) == 0 {
		return nil
	}

	var builder strings.Builder
	builder.WriteString(`INSERT INTO pipeline_param_def (
id, pipeline_id, executor_type, executor_param_name, param_key, param_type, single_select, required, default_value, description, visible, editable, source_from, status, raw_meta, sort_no, created_at, updated_at
) VALUES `)

	args := make([]any, 0, len(items)*18)
	for idx, item := range items {
		if idx > 0 {
			builder.WriteString(",")
		}
		builder.WriteString("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
		args = append(args,
			item.ID,
			item.PipelineID,
			string(item.ExecutorType),
			item.ExecutorParamName,
			item.ParamKey,
			string(item.ParamType),
			boolToInt(item.SingleSelect),
			boolToInt(item.Required),
			item.DefaultValue,
			item.Description,
			boolToInt(item.Visible),
			boolToInt(item.Editable),
			string(item.SourceFrom),
			string(item.Status),
			item.RawMeta,
			item.SortNo,
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		)
	}

	builder.WriteString(` ON DUPLICATE KEY UPDATE
param_type = VALUES(param_type),
single_select = VALUES(single_select),
required = VALUES(required),
default_value = VALUES(default_value),
description = VALUES(description),
visible = VALUES(visible),
editable = VALUES(editable),
source_from = VALUES(source_from),
status = VALUES(status),
raw_meta = VALUES(raw_meta),
sort_no = VALUES(sort_no),
updated_at = VALUES(updated_at)`)

	_, err := tx.ExecContext(ctx, builder.String(), args...)
	return err
}

func (r *PipelineParamRepository) mysqlExistingParamKeys(ctx context.Context, items []domain.PipelineParamDef) (map[string]struct{}, error) {
	pipelineIDs := make([]string, 0, len(items))
	seenPipelineIDs := make(map[string]struct{}, len(items))
	for _, item := range items {
		if _, ok := seenPipelineIDs[item.PipelineID]; ok {
			continue
		}
		seenPipelineIDs[item.PipelineID] = struct{}{}
		pipelineIDs = append(pipelineIDs, item.PipelineID)
	}

	result := make(map[string]struct{}, len(items))
	const chunkSize = 200
	for start := 0; start < len(pipelineIDs); start += chunkSize {
		end := start + chunkSize
		if end > len(pipelineIDs) {
			end = len(pipelineIDs)
		}

		placeholders := strings.TrimRight(strings.Repeat("?,", end-start), ",")
		query := fmt.Sprintf(`SELECT pipeline_id, executor_type, executor_param_name
FROM pipeline_param_def
WHERE executor_type = ? AND pipeline_id IN (%s)`, placeholders)

		args := make([]any, 0, end-start+1)
		args = append(args, string(domain.ExecutorTypeJenkins))
		for _, pipelineID := range pipelineIDs[start:end] {
			args = append(args, pipelineID)
		}

		rows, err := r.db.QueryContext(ctx, query, args...)
		if err != nil {
			return nil, err
		}

		for rows.Next() {
			var (
				pipelineID        string
				executorType      string
				executorParamName string
			)
			if err := rows.Scan(&pipelineID, &executorType, &executorParamName); err != nil {
				_ = rows.Close()
				return nil, err
			}
			result[pipelineParamUniqueKey(pipelineID, domain.ExecutorType(executorType), executorParamName)] = struct{}{}
		}
		if err := rows.Err(); err != nil {
			_ = rows.Close()
			return nil, err
		}
		_ = rows.Close()
	}

	return result, nil
}

func pipelineParamUniqueKey(pipelineID string, executorType domain.ExecutorType, executorParamName string) string {
	return pipelineID + "\x00" + string(executorType) + "\x00" + executorParamName
}

func (r *PipelineParamRepository) MarkMissingInactive(
	ctx context.Context,
	executorType domain.ExecutorType,
	keepIDs []string,
	updatedAt time.Time,
) (int, error) {
	if !executorType.Valid() {
		return 0, fmt.Errorf("invalid executor type: %s", executorType)
	}

	query := `UPDATE pipeline_param_def
SET status = ?, updated_at = ?
WHERE executor_type = ? AND source_from = ? AND status <> ?`
	args := []any{
		string(domain.StatusInactive),
		updatedAt.UTC().UnixNano(),
		string(executorType),
		string(domain.SourceFromSyncJenkins),
		string(domain.StatusInactive),
	}

	keep := make([]string, 0, len(keepIDs))
	for _, id := range keepIDs {
		id = strings.TrimSpace(id)
		if id == "" {
			continue
		}
		keep = append(keep, id)
	}
	if len(keep) > 0 {
		query += " AND id NOT IN (" + strings.TrimRight(strings.Repeat("?,", len(keep)), ",") + ")"
		for _, id := range keep {
			args = append(args, id)
		}
	}

	res, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return 0, err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return 0, err
	}
	return int(affected), nil
}

func (r *PipelineParamRepository) ListByPipeline(ctx context.Context, filter domain.ListFilter) ([]domain.PipelineParamDef, int64, error) {
	where := []string{"pipeline_id = ?"}
	args := []any{filter.PipelineID}

	if filter.ExecutorType != "" {
		where = append(where, "executor_type = ?")
		args = append(args, string(filter.ExecutorType))
	}
	if filter.Visible != nil {
		where = append(where, "visible = ?")
		args = append(args, boolToInt(*filter.Visible))
	}
	if filter.Editable != nil {
		where = append(where, "editable = ?")
		args = append(args, boolToInt(*filter.Editable))
	}
	if filter.ParamKey != "" {
		where = append(where, "param_key = ?")
		args = append(args, filter.ParamKey)
	}
	if filter.Status != "" {
		where = append(where, "status = ?")
		args = append(args, string(filter.Status))
	}

	countQuery := "SELECT COUNT(1) FROM pipeline_param_def WHERE " + strings.Join(where, " AND ")
	var total int64
	if err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	listQuery := `
SELECT id, pipeline_id, executor_type, executor_param_name, param_key, param_type, single_select, required, default_value, description, visible, editable, source_from, status, raw_meta, sort_no, created_at, updated_at
	FROM pipeline_param_def
WHERE ` + strings.Join(where, " AND ") + `
ORDER BY sort_no ASC, created_at ASC LIMIT ? OFFSET ?;`

	offset := (filter.Page - 1) * filter.PageSize
	rows, err := r.db.QueryContext(ctx, listQuery, append(args, filter.PageSize, offset)...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]domain.PipelineParamDef, 0)
	for rows.Next() {
		item, scanErr := scanPipelineParam(rows)
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

func (r *PipelineParamRepository) GetByID(ctx context.Context, id string) (domain.PipelineParamDef, error) {
	const q = `
SELECT id, pipeline_id, executor_type, executor_param_name, param_key, param_type, single_select, required, default_value, description, visible, editable, source_from, status, raw_meta, sort_no, created_at, updated_at
FROM pipeline_param_def
WHERE id = ?;`

	row := r.db.QueryRowContext(ctx, q, id)
	item, err := scanPipelineParam(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.PipelineParamDef{}, domain.ErrNotFound
		}
		return domain.PipelineParamDef{}, err
	}
	return item, nil
}

func (r *PipelineParamRepository) UpdateParamKey(ctx context.Context, id string, paramKey string, updatedAt time.Time) (domain.PipelineParamDef, error) {
	const q = `
UPDATE pipeline_param_def
SET param_key = ?, updated_at = ?
WHERE id = ?;`

	res, err := r.db.ExecContext(ctx, q, paramKey, updatedAt.UTC().UnixNano(), id)
	if err != nil {
		return domain.PipelineParamDef{}, err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return domain.PipelineParamDef{}, err
	}
	if affected == 0 {
		return domain.PipelineParamDef{}, domain.ErrNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *PipelineParamRepository) CountByParamKey(ctx context.Context, paramKey string) (int64, error) {
	const q = `SELECT COUNT(1) FROM pipeline_param_def WHERE param_key = ?;`
	var total int64
	if err := r.db.QueryRowContext(ctx, q, paramKey).Scan(&total); err != nil {
		return 0, err
	}
	return total, nil
}

func scanPipelineParam(s scanner) (domain.PipelineParamDef, error) {
	var (
		item         domain.PipelineParamDef
		executorType string
		paramType    string
		singleSelect int
		required     int
		visible      int
		editable     int
		sourceFrom   string
		status       string
		rawMeta      sql.NullString
		createdAt    int64
		updatedAt    int64
	)

	if err := s.Scan(
		&item.ID,
		&item.PipelineID,
		&executorType,
		&item.ExecutorParamName,
		&item.ParamKey,
		&paramType,
		&singleSelect,
		&required,
		&item.DefaultValue,
		&item.Description,
		&visible,
		&editable,
		&sourceFrom,
		&status,
		&rawMeta,
		&item.SortNo,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.PipelineParamDef{}, err
	}

	item.ExecutorType = domain.ExecutorType(executorType)
	item.ParamType = domain.ParamType(paramType)
	item.SingleSelect = singleSelect > 0
	item.Required = required > 0
	item.Visible = visible > 0
	item.Editable = editable > 0
	item.SourceFrom = domain.SourceFrom(sourceFrom)
	item.Status = domain.Status(status)
	if item.Status == "" {
		item.Status = domain.StatusActive
	}
	item.RawMeta = rawMeta.String
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}
