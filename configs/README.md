# Config Usage

## 基本原则

- 服务端只读取 JSON 配置文件，不再使用环境变量覆盖配置值。
- 默认启动配置文件是 `configs/config.local.json`。
- 需要切换配置时，使用启动参数 `-config` 指定文件路径。

## Local

```bash
go run ./cmd/server
```

默认会读取：

- `configs/config.local.json`

本地配置默认使用：

- MySQL：以 `configs/config.local.json` 中的 `database.mysql_dsn` 为准
- 管理员账号：`admin`
- 管理员密码：`admin123`

## Production

先编辑：

- `configs/config.production.json`

重点检查：

- `database.mysql_dsn`
- `jenkins.*`
- `release.*`
- `auth.admin_password`
- `security.encryption_key`

然后启动：

```bash
go run ./cmd/server -config configs/config.production.json
```

## Notes

- 生产环境请直接在配置文件中填写真实配置，不再使用 `${VAR}` 占位。
- `security.encryption_key` 用于加密 Agent Token、GitOps / ArgoCD 凭据、通知源 Secret。
- `config.production.json` 中的示例密码、Token、DSN 仅为占位示例，上线前必须替换。
- 当 `jenkins.enabled=true` 且 `jenkins.startup_check_enabled=true`，服务启动时会先检查 Jenkins 连通性。
- ArgoCD 与 GitOps 实例改为数据库管理，不再要求在配置文件中维护默认实例。
- 服务会后台定时拉取数据库中 `active` 的 ArgoCD 实例应用信息并写入数据库。
