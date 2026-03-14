package sqlrepo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	domain "gos/internal/domain/application"

	mysqlDriver "github.com/go-sql-driver/mysql"
)

type ApplicationRepository struct {
	db       *sql.DB
	dbDriver string
}

func NewApplicationRepository(db *sql.DB, dbDriver string) *ApplicationRepository {
	return &ApplicationRepository{db: db, dbDriver: strings.ToLower(strings.TrimSpace(dbDriver))}
}

func (r *ApplicationRepository) InitSchema(ctx context.Context) error {
	var schema string
	switch r.dbDriver {
	case "mysql":
		schema = `
CREATE TABLE IF NOT EXISTS applications (
	id VARCHAR(64) PRIMARY KEY,
	name VARCHAR(128) NOT NULL,
	app_key VARCHAR(128) NOT NULL,
	repo_url TEXT NOT NULL,
	description TEXT NOT NULL,
	owner_user_id VARCHAR(64) NOT NULL DEFAULT '',
	owner VARCHAR(128) NOT NULL,
	status VARCHAR(32) NOT NULL,
	artifact_type VARCHAR(64) NOT NULL,
	language VARCHAR(64) NOT NULL,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uq_application_key (app_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
	case "sqlite":
		schema = `
CREATE TABLE IF NOT EXISTS applications (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	app_key TEXT NOT NULL UNIQUE,
	repo_url TEXT NOT NULL,
	description TEXT NOT NULL,
	owner_user_id TEXT NOT NULL DEFAULT '',
	owner TEXT NOT NULL,
	status TEXT NOT NULL,
	artifact_type TEXT NOT NULL,
	language TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);`
	default:
		return fmt.Errorf("unsupported db driver: %s", r.dbDriver)
	}

	if _, err := r.db.ExecContext(ctx, schema); err != nil {
		return err
	}
	return r.migrateSchema(ctx)
}

func (r *ApplicationRepository) migrateSchema(ctx context.Context) error {
	switch r.dbDriver {
	case "mysql":
		exists, err := r.mysqlColumnExists(ctx, "applications", "owner_user_id")
		if err != nil {
			return err
		}
		if exists {
			return nil
		}
		_, err = r.db.ExecContext(
			ctx,
			`ALTER TABLE applications ADD COLUMN owner_user_id VARCHAR(64) NOT NULL DEFAULT '' AFTER description;`,
		)
		return err
	case "sqlite":
		columns, err := r.sqliteTableColumns(ctx, "applications")
		if err != nil {
			return err
		}
		if _, ok := columns["owner_user_id"]; ok {
			return nil
		}
		_, err = r.db.ExecContext(
			ctx,
			`ALTER TABLE applications ADD COLUMN owner_user_id TEXT NOT NULL DEFAULT '';`,
		)
		return err
	default:
		return fmt.Errorf("unsupported db driver: %s", r.dbDriver)
	}
}

func (r *ApplicationRepository) Create(ctx context.Context, app domain.Application) error {
	const q = `
INSERT INTO applications (
	id, name, app_key, repo_url, description, owner_user_id, owner, status, artifact_type, language, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

	_, err := r.db.ExecContext(
		ctx,
		q,
		app.ID,
		app.Name,
		app.Key,
		app.RepoURL,
		app.Description,
		app.OwnerUserID,
		app.Owner,
		string(app.Status),
		app.ArtifactType,
		app.Language(),
		app.CreatedAt.UTC().UnixNano(),
		app.UpdatedAt.UTC().UnixNano(),
	)
	if err != nil {
		if isDuplicateKeyError(r.dbDriver, err) {
			return domain.ErrKeyDuplicated
		}
		return err
	}
	return nil
}

func (r *ApplicationRepository) GetByID(ctx context.Context, id string) (domain.Application, error) {
	const q = `
SELECT id, name, app_key, repo_url, description, owner_user_id, owner, status, artifact_type, language, created_at, updated_at
FROM applications
WHERE id = ?;`

	row := r.db.QueryRowContext(ctx, q, id)
	app, err := scanApplication(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.Application{}, domain.ErrNotFound
		}
		return domain.Application{}, err
	}
	return app, nil
}

func (r *ApplicationRepository) List(ctx context.Context, filter domain.ListFilter) ([]domain.Application, int64, error) {
	args := make([]any, 0, 3)
	builder := strings.Builder{}
	countBuilder := strings.Builder{}
	countBuilder.WriteString(`SELECT COUNT(1) FROM applications`)

	where := make([]string, 0, 3)
	if filter.Key != "" {
		where = append(where, "app_key = ?")
		args = append(args, filter.Key)
	}
	if filter.Name != "" {
		where = append(where, "name = ?")
		args = append(args, filter.Name)
	}
	if filter.Status != "" {
		where = append(where, "status = ?")
		args = append(args, string(filter.Status))
	}
	if len(where) > 0 {
		countBuilder.WriteString(" WHERE ")
		countBuilder.WriteString(strings.Join(where, " AND "))
	}

	var total int64
	if err := r.db.QueryRowContext(ctx, countBuilder.String(), args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	builder.WriteString(`
SELECT id, name, app_key, repo_url, description, owner_user_id, owner, status, artifact_type, language, created_at, updated_at
FROM applications`)
	if len(where) > 0 {
		builder.WriteString(" WHERE ")
		builder.WriteString(strings.Join(where, " AND "))
	}
	builder.WriteString(" ORDER BY created_at DESC LIMIT ? OFFSET ?;")

	offset := (filter.Page - 1) * filter.PageSize
	queryArgs := append(args, filter.PageSize, offset)

	rows, err := r.db.QueryContext(ctx, builder.String(), queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	apps := make([]domain.Application, 0)
	for rows.Next() {
		app, err := scanApplication(rows)
		if err != nil {
			return nil, 0, err
		}
		apps = append(apps, app)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, err
	}
	return apps, total, nil
}

func (r *ApplicationRepository) Update(ctx context.Context, id string, input domain.UpdateInput, updatedAt time.Time) (domain.Application, error) {
	const q = `
UPDATE applications
SET name = ?, app_key = ?, repo_url = ?, description = ?, owner_user_id = ?, owner = ?, status = ?, artifact_type = ?, language = ?, updated_at = ?
WHERE id = ?;`

	res, err := r.db.ExecContext(
		ctx,
		q,
		input.Name,
		input.Key,
		input.RepoURL,
		input.Description,
		input.OwnerUserID,
		input.Owner,
		string(input.Status),
		input.ArtifactType,
		input.Language,
		updatedAt.UTC().UnixNano(),
		id,
	)
	if err != nil {
		if isDuplicateKeyError(r.dbDriver, err) {
			return domain.Application{}, domain.ErrKeyDuplicated
		}
		return domain.Application{}, err
	}

	affected, err := res.RowsAffected()
	if err != nil {
		return domain.Application{}, err
	}
	if affected == 0 {
		return domain.Application{}, domain.ErrNotFound
	}
	return r.GetByID(ctx, id)
}

func (r *ApplicationRepository) Delete(ctx context.Context, id string) error {
	const q = `DELETE FROM applications WHERE id = ?;`

	res, err := r.db.ExecContext(ctx, q, id)
	if err != nil {
		return err
	}

	affected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return domain.ErrNotFound
	}
	return nil
}

type scanner interface {
	Scan(dest ...any) error
}

func scanApplication(s scanner) (domain.Application, error) {
	var (
		app       domain.Application
		statusRaw string
		langRaw   string
		createdAt int64
		updatedAt int64
	)

	if err := s.Scan(
		&app.ID,
		&app.Name,
		&app.Key,
		&app.RepoURL,
		&app.Description,
		&app.OwnerUserID,
		&app.Owner,
		&statusRaw,
		&app.ArtifactType,
		&langRaw,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.Application{}, err
	}

	app.Status = domain.Status(statusRaw)
	app.SetLanguage(langRaw)
	app.CreatedAt = time.Unix(0, createdAt).UTC()
	app.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return app, nil
}

func (r *ApplicationRepository) mysqlColumnExists(ctx context.Context, table, column string) (bool, error) {
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

func (r *ApplicationRepository) sqliteTableColumns(ctx context.Context, table string) (map[string]struct{}, error) {
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
		columns[strings.ToLower(strings.TrimSpace(name))] = struct{}{}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return columns, nil
}

func isDuplicateKeyError(dbDriver string, err error) bool {
	switch dbDriver {
	case "mysql":
		var mysqlErr *mysqlDriver.MySQLError
		return errors.As(err, &mysqlErr) && mysqlErr.Number == 1062
	case "sqlite":
		return strings.Contains(strings.ToLower(err.Error()), "unique constraint failed")
	default:
		return false
	}
}
