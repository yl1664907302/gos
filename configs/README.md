# Config Usage

## Local
`APP_CONFIG_FILE=configs/config.local.json go run ./cmd/server`

## Production
`APP_CONFIG_FILE=configs/config.production.json MYSQL_PASSWORD='your-real-password' go run ./cmd/server`

Notes:
- `configs/config.local.json` 默认已切到 MySQL（`127.0.0.1:3306`，库名 `deploy_platform`）。
- `database.mysql_dsn` supports environment variable expansion via `${VAR}`.
- 启动阶段会执行 MySQL 连接重试检查：
- `database.startup_max_retries`
- `database.startup_retry_interval_sec`
- 多次检查失败会直接启动失败并退出。
- Environment variables `APP_ADDR`, `DB_DRIVER`, `MYSQL_DSN`, `SQLITE_PATH` can override file values.
