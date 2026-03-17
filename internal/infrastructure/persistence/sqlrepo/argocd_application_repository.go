package sqlrepo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	domain "gos/internal/domain/argocdapp"
)

type ArgoCDApplicationRepository struct {
	db       *sql.DB
	dbDriver string
}

func NewArgoCDApplicationRepository(db *sql.DB, dbDriver string) *ArgoCDApplicationRepository {
	return &ArgoCDApplicationRepository{db: db, dbDriver: strings.ToLower(strings.TrimSpace(dbDriver))}
}

func (r *ArgoCDApplicationRepository) InitSchema(ctx context.Context) error {
	var statements []string
	switch r.dbDriver {
	case "mysql":
		statements = []string{`
CREATE TABLE IF NOT EXISTS argocd_application (
	id VARCHAR(64) PRIMARY KEY,
	app_name VARCHAR(200) NOT NULL,
	project VARCHAR(100) NOT NULL DEFAULT '',
	repo_url VARCHAR(500) NOT NULL DEFAULT '',
	source_path VARCHAR(500) NOT NULL DEFAULT '',
	target_revision VARCHAR(200) NOT NULL DEFAULT '',
	dest_server VARCHAR(500) NOT NULL DEFAULT '',
	dest_namespace VARCHAR(200) NOT NULL DEFAULT '',
	sync_status VARCHAR(50) NOT NULL DEFAULT '',
	health_status VARCHAR(50) NOT NULL DEFAULT '',
	operation_phase VARCHAR(50) NOT NULL DEFAULT '',
	argocd_url VARCHAR(500) NOT NULL DEFAULT '',
	status VARCHAR(20) NOT NULL DEFAULT 'active',
	raw_meta JSON NULL,
	last_synced_at BIGINT NOT NULL,
	created_at BIGINT NOT NULL,
	updated_at BIGINT NOT NULL,
	UNIQUE KEY uk_argocd_application_name (app_name),
	KEY idx_argocd_project (project),
	KEY idx_argocd_sync_status (sync_status),
	KEY idx_argocd_health_status (health_status),
	KEY idx_argocd_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}
	case "sqlite":
		statements = []string{
			`CREATE TABLE IF NOT EXISTS argocd_application (
	id TEXT PRIMARY KEY,
	app_name TEXT NOT NULL UNIQUE,
	project TEXT NOT NULL DEFAULT '',
	repo_url TEXT NOT NULL DEFAULT '',
	source_path TEXT NOT NULL DEFAULT '',
	target_revision TEXT NOT NULL DEFAULT '',
	dest_server TEXT NOT NULL DEFAULT '',
	dest_namespace TEXT NOT NULL DEFAULT '',
	sync_status TEXT NOT NULL DEFAULT '',
	health_status TEXT NOT NULL DEFAULT '',
	operation_phase TEXT NOT NULL DEFAULT '',
	argocd_url TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'active',
	raw_meta TEXT NOT NULL DEFAULT '',
	last_synced_at INTEGER NOT NULL,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL
);`,
			`CREATE INDEX IF NOT EXISTS idx_argocd_project ON argocd_application (project);`,
			`CREATE INDEX IF NOT EXISTS idx_argocd_sync_status ON argocd_application (sync_status);`,
			`CREATE INDEX IF NOT EXISTS idx_argocd_health_status ON argocd_application (health_status);`,
			`CREATE INDEX IF NOT EXISTS idx_argocd_status ON argocd_application (status);`,
		}
	default:
		return fmt.Errorf("unsupported db driver: %s", r.dbDriver)
	}

	for _, stmt := range statements {
		if _, err := r.db.ExecContext(ctx, stmt); err != nil {
			return err
		}
	}
	return nil
}

func (r *ArgoCDApplicationRepository) UpsertApplications(ctx context.Context, items []domain.Application) (created int, updated int, err error) {
	if len(items) == 0 {
		return 0, 0, nil
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, 0, err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	const q = `SELECT COUNT(1) FROM argocd_application WHERE app_name = ?;`
	const mysqlUpsert = `
INSERT INTO argocd_application (
	id, app_name, project, repo_url, source_path, target_revision, dest_server, dest_namespace,
	sync_status, health_status, operation_phase, argocd_url, status, raw_meta, last_synced_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
	project = VALUES(project),
	repo_url = VALUES(repo_url),
	source_path = VALUES(source_path),
	target_revision = VALUES(target_revision),
	dest_server = VALUES(dest_server),
	dest_namespace = VALUES(dest_namespace),
	sync_status = VALUES(sync_status),
	health_status = VALUES(health_status),
	operation_phase = VALUES(operation_phase),
	argocd_url = VALUES(argocd_url),
	status = VALUES(status),
	raw_meta = VALUES(raw_meta),
	last_synced_at = VALUES(last_synced_at),
	updated_at = VALUES(updated_at);`
	const sqliteUpsert = `
INSERT INTO argocd_application (
	id, app_name, project, repo_url, source_path, target_revision, dest_server, dest_namespace,
	sync_status, health_status, operation_phase, argocd_url, status, raw_meta, last_synced_at, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(app_name) DO UPDATE SET
	project = excluded.project,
	repo_url = excluded.repo_url,
	source_path = excluded.source_path,
	target_revision = excluded.target_revision,
	dest_server = excluded.dest_server,
	dest_namespace = excluded.dest_namespace,
	sync_status = excluded.sync_status,
	health_status = excluded.health_status,
	operation_phase = excluded.operation_phase,
	argocd_url = excluded.argocd_url,
	status = excluded.status,
	raw_meta = excluded.raw_meta,
	last_synced_at = excluded.last_synced_at,
	updated_at = excluded.updated_at;`
	stmtText := mysqlUpsert
	if r.dbDriver == "sqlite" {
		stmtText = sqliteUpsert
	}
	stmt, err := tx.PrepareContext(ctx, stmtText)
	if err != nil {
		return 0, 0, err
	}
	defer stmt.Close()

	for _, item := range items {
		var exists int
		if err = tx.QueryRowContext(ctx, q, item.AppName).Scan(&exists); err != nil {
			return 0, 0, err
		}
		if exists > 0 {
			updated++
		} else {
			created++
		}
		if _, err = stmt.ExecContext(
			ctx,
			item.ID,
			item.AppName,
			item.Project,
			item.RepoURL,
			item.SourcePath,
			item.TargetRevision,
			item.DestServer,
			item.DestNamespace,
			item.SyncStatus,
			item.HealthStatus,
			item.OperationPhase,
			item.ArgoCDURL,
			string(item.Status),
			item.RawMeta,
			item.LastSyncedAt.UTC().UnixNano(),
			item.CreatedAt.UTC().UnixNano(),
			item.UpdatedAt.UTC().UnixNano(),
		); err != nil {
			return 0, 0, err
		}
	}

	if err = tx.Commit(); err != nil {
		return 0, 0, err
	}
	return created, updated, nil
}

func (r *ArgoCDApplicationRepository) MarkMissingApplicationsInactive(ctx context.Context, keepNames []string, updatedAt time.Time) (int, error) {
	args := make([]any, 0, 2+len(keepNames))
	builder := strings.Builder{}
	builder.WriteString(`UPDATE argocd_application SET status = ?, updated_at = ? WHERE status <> ?`)
	args = append(args, string(domain.StatusInactive), updatedAt.UTC().UnixNano(), string(domain.StatusInactive))
	if len(keepNames) > 0 {
		placeholders := make([]string, 0, len(keepNames))
		for _, item := range keepNames {
			placeholders = append(placeholders, "?")
			args = append(args, item)
		}
		builder.WriteString(" AND app_name NOT IN (")
		builder.WriteString(strings.Join(placeholders, ", "))
		builder.WriteString(")")
	}
	result, err := r.db.ExecContext(ctx, builder.String(), args...)
	if err != nil {
		return 0, err
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return 0, err
	}
	return int(affected), nil
}

func (r *ArgoCDApplicationRepository) ListApplications(ctx context.Context, filter domain.ListFilter) ([]domain.Application, int64, error) {
	args := make([]any, 0, 8)
	where := make([]string, 0, 5)
	if name := strings.TrimSpace(filter.AppName); name != "" {
		where = append(where, "app_name LIKE ?")
		args = append(args, "%"+name+"%")
	}
	if project := strings.TrimSpace(filter.Project); project != "" {
		where = append(where, "project = ?")
		args = append(args, project)
	}
	if syncStatus := strings.TrimSpace(filter.SyncStatus); syncStatus != "" {
		where = append(where, "sync_status = ?")
		args = append(args, syncStatus)
	}
	if healthStatus := strings.TrimSpace(filter.HealthStatus); healthStatus != "" {
		where = append(where, "health_status = ?")
		args = append(args, healthStatus)
	}
	if filter.Status != "" {
		where = append(where, "status = ?")
		args = append(args, string(filter.Status))
	}

	countSQL := "SELECT COUNT(1) FROM argocd_application"
	if len(where) > 0 {
		countSQL += " WHERE " + strings.Join(where, " AND ")
	}
	var total int64
	if err := r.db.QueryRowContext(ctx, countSQL, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	querySQL := `SELECT id, app_name, project, repo_url, source_path, target_revision, dest_server, dest_namespace,
	sync_status, health_status, operation_phase, argocd_url, status, raw_meta, last_synced_at, created_at, updated_at
FROM argocd_application`
	if len(where) > 0 {
		querySQL += " WHERE " + strings.Join(where, " AND ")
	}
	querySQL += " ORDER BY app_name ASC LIMIT ? OFFSET ?"
	offset := (filter.Page - 1) * filter.PageSize
	queryArgs := append(args, filter.PageSize, offset)
	rows, err := r.db.QueryContext(ctx, querySQL, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	items := make([]domain.Application, 0)
	for rows.Next() {
		item, scanErr := scanArgoCDApplication(rows)
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

func (r *ArgoCDApplicationRepository) GetApplicationByID(ctx context.Context, id string) (domain.Application, error) {
	const q = `SELECT id, app_name, project, repo_url, source_path, target_revision, dest_server, dest_namespace,
	sync_status, health_status, operation_phase, argocd_url, status, raw_meta, last_synced_at, created_at, updated_at
FROM argocd_application WHERE id = ?;`
	row := r.db.QueryRowContext(ctx, q, id)
	item, err := scanArgoCDApplication(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return domain.Application{}, domain.ErrNotFound
		}
		return domain.Application{}, err
	}
	return item, nil
}

type argocdApplicationScanner interface {
	Scan(dest ...any) error
}

func scanArgoCDApplication(scanner argocdApplicationScanner) (domain.Application, error) {
	var (
		item         domain.Application
		status       string
		rawMeta      sql.NullString
		lastSyncedAt int64
		createdAt    int64
		updatedAt    int64
	)
	if err := scanner.Scan(
		&item.ID,
		&item.AppName,
		&item.Project,
		&item.RepoURL,
		&item.SourcePath,
		&item.TargetRevision,
		&item.DestServer,
		&item.DestNamespace,
		&item.SyncStatus,
		&item.HealthStatus,
		&item.OperationPhase,
		&item.ArgoCDURL,
		&status,
		&rawMeta,
		&lastSyncedAt,
		&createdAt,
		&updatedAt,
	); err != nil {
		return domain.Application{}, err
	}
	item.Status = domain.Status(status)
	item.RawMeta = rawMeta.String
	item.LastSyncedAt = time.Unix(0, lastSyncedAt).UTC()
	item.CreatedAt = time.Unix(0, createdAt).UTC()
	item.UpdatedAt = time.Unix(0, updatedAt).UTC()
	return item, nil
}
