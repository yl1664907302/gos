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
	return nil
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
	required TINYINT(1) NOT NULL,
	default_value VARCHAR(500) NOT NULL,
	description VARCHAR(500) NOT NULL,
	visible TINYINT(1) NOT NULL,
	editable TINYINT(1) NOT NULL,
	source_from VARCHAR(50) NOT NULL,
	raw_meta JSON NULL,
	sort_no INT NOT NULL,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uq_pipeline_param_unique (pipeline_id, executor_type, executor_param_name),
	KEY idx_pipeline_param_pipeline_sort (pipeline_id, sort_no),
	KEY idx_pipeline_param_param_key (param_key)
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
	required INTEGER NOT NULL,
	default_value TEXT NOT NULL,
	description TEXT NOT NULL,
	visible INTEGER NOT NULL,
	editable INTEGER NOT NULL,
	source_from TEXT NOT NULL,
	raw_meta TEXT NOT NULL,
	sort_no INTEGER NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	UNIQUE(pipeline_id, executor_type, executor_param_name)
);`,
			`CREATE INDEX IF NOT EXISTS idx_pipeline_param_pipeline_sort ON pipeline_param_def (pipeline_id, sort_no);`,
			`CREATE INDEX IF NOT EXISTS idx_pipeline_param_param_key ON pipeline_param_def (param_key);`,
		}, nil
	default:
		return nil, fmt.Errorf("unsupported db driver: %s", r.dbDriver)
	}
}

func (r *PipelineParamRepository) Upsert(ctx context.Context, items []domain.PipelineParamDef) (int, int, error) {
	const (
		updateByKey = `UPDATE pipeline_param_def
SET param_type = ?, required = ?, default_value = ?, description = ?, visible = ?, editable = ?, source_from = ?, raw_meta = ?, sort_no = ?, updated_at = ?
WHERE pipeline_id = ? AND executor_type = ? AND executor_param_name = ?;`
		insert = `INSERT INTO pipeline_param_def (
	id, pipeline_id, executor_type, executor_param_name, param_key, param_type, required, default_value, description, visible, editable, source_from, raw_meta, sort_no, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
	)

	created := 0
	updated := 0
	for _, item := range items {
		res, err := r.db.ExecContext(
			ctx,
			updateByKey,
			string(item.ParamType),
			boolToInt(item.Required),
			item.DefaultValue,
			item.Description,
			boolToInt(item.Visible),
			boolToInt(item.Editable),
			string(item.SourceFrom),
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

		_, err = r.db.ExecContext(
			ctx,
			insert,
			item.ID,
			item.PipelineID,
			string(item.ExecutorType),
			item.ExecutorParamName,
			item.ParamKey,
			string(item.ParamType),
			boolToInt(item.Required),
			item.DefaultValue,
			item.Description,
			boolToInt(item.Visible),
			boolToInt(item.Editable),
			string(item.SourceFrom),
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
	return created, updated, nil
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

	countQuery := "SELECT COUNT(1) FROM pipeline_param_def WHERE " + strings.Join(where, " AND ")
	var total int64
	if err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	listQuery := `
SELECT id, pipeline_id, executor_type, executor_param_name, param_key, param_type, required, default_value, description, visible, editable, source_from, raw_meta, sort_no, created_at, updated_at
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
SELECT id, pipeline_id, executor_type, executor_param_name, param_key, param_type, required, default_value, description, visible, editable, source_from, raw_meta, sort_no, created_at, updated_at
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
		required     int
		visible      int
		editable     int
		sourceFrom   string
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
		&required,
		&item.DefaultValue,
		&item.Description,
		&visible,
		&editable,
		&sourceFrom,
		&rawMeta,
		&item.SortNo,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.PipelineParamDef{}, err
	}

	item.ExecutorType = domain.ExecutorType(executorType)
	item.ParamType = domain.ParamType(paramType)
	item.Required = required > 0
	item.Visible = visible > 0
	item.Editable = editable > 0
	item.SourceFrom = domain.SourceFrom(sourceFrom)
	item.RawMeta = rawMeta.String
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}
