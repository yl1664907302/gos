# Config Usage

## Local
`APP_CONFIG_FILE=configs/config.local.json go run ./cmd/server`

## Production
`APP_CONFIG_FILE=configs/config.production.json MYSQL_PASSWORD='your-real-password' JENKINS_API_TOKEN='your-jenkins-token' ARGOCD_TOKEN='your-argocd-token' go run ./cmd/server`

Notes:
- `configs/config.local.json` 默认已切到 MySQL（`127.0.0.1:3306`，库名 `deploy_platform`）。
- `database.mysql_dsn` supports environment variable expansion via `${VAR}`.
- 启动阶段会执行 MySQL 连接重试检查：
- `database.startup_max_retries`
- `database.startup_retry_interval_sec`
- 多次检查失败会直接启动失败并退出。
- Jenkins 接入配置位于 `jenkins` 节点：
- `jenkins.enabled`
- `jenkins.base_url`
- `jenkins.username`
- `jenkins.api_token`
- `jenkins.startup_check_enabled`
- `jenkins.startup_max_retries`
- `jenkins.startup_retry_interval_sec`
- `jenkins.auto_sync_enabled`
- `jenkins.auto_sync_interval_sec`
- 当 `jenkins.enabled=true` 且 `jenkins.startup_check_enabled=true`，服务启动时会先检查 Jenkins 连通性（`/api/json`）。
- 当 `jenkins.enabled=true` 且 `jenkins.auto_sync_enabled=true`，服务会后台定时拉取 Jenkins 管线并写入数据库（先执行一次，再按间隔执行）。
- ArgoCD 接入配置位于 `argocd` 节点：
- `argocd.enabled`
- `argocd.base_url`
- `argocd.insecure_skip_verify`
- `argocd.auth_mode`
- `argocd.token`
- `argocd.username`
- `argocd.password`
- `argocd.startup_check_enabled`
- `argocd.sync_enabled`
- `argocd.sync_interval_sec`
- `argocd.request_timeout_sec`
- 当 `argocd.enabled=true` 且 `argocd.startup_check_enabled=true`，服务启动时会检查 ArgoCD Application API 连通性。
- 当 `argocd.enabled=true` 且 `argocd.sync_enabled=true`，服务会后台定时拉取 ArgoCD Applications 并写入数据库（先执行一次，再按间隔执行）。
- Environment variables `APP_ADDR`, `DB_DRIVER`, `MYSQL_DSN`, `SQLITE_PATH`, `JENKINS_ENABLED`, `JENKINS_BASE_URL`, `JENKINS_USERNAME`, `JENKINS_API_TOKEN`, `JENKINS_AUTO_SYNC_ENABLED`, `JENKINS_AUTO_SYNC_INTERVAL_SEC`, `ARGOCD_ENABLED`, `ARGOCD_BASE_URL`, `ARGOCD_INSECURE_SKIP_VERIFY`, `ARGOCD_AUTH_MODE`, `ARGOCD_TOKEN`, `ARGOCD_USERNAME`, `ARGOCD_PASSWORD`, `ARGOCD_STARTUP_CHECK_ENABLED`, `ARGOCD_SYNC_ENABLED`, `ARGOCD_SYNC_INTERVAL_SEC`, `ARGOCD_REQUEST_TIMEOUT_SEC` can override file values.
