# GOS Docker 单容器部署说明

## 1. 构建镜像
在仓库根目录执行：

```bash
cd /Users/lingyunxieqing/Desktop/gos
docker build -t gos-release:latest .
```

## 2. 使用 MySQL 启动
下面是一条最常用的启动命令，前端和后端都在同一个容器里：

```bash
docker run -d \
  --name gos-release \
  -p 5174:5174 \
  -p 8081:8081 \
  -e GOS_DB_DRIVER=mysql \
  -e GOS_MYSQL_DSN='root:password@tcp(192.168.49.227:3306)/deploy_platform?charset=utf8mb4&parseTime=true&loc=Local' \
  -e GOS_JENKINS_ENABLED=true \
  -e GOS_JENKINS_BASE_URL='http://192.168.1.208:8000/' \
  -e GOS_JENKINS_USERNAME='admin' \
  -e GOS_JENKINS_API_TOKEN='your-token' \
  -e GOS_AUTH_ADMIN_USERNAME='admin' \
  -e GOS_AUTH_ADMIN_PASSWORD='admin123' \
  -e GOS_SECURITY_ENCRYPTION_KEY='gos-release-prod-key-2026' \
  -v /Users/lingyunxieqing/Desktop/deploy-manifests:/gitops/deploy-manifests \
  -e GOS_GITOPS_PATH_MAPS='/Users/lingyunxieqing/Desktop/deploy-manifests=/gitops/deploy-manifests' \
  gos-release:latest
```

访问地址：
- 前端：`http://127.0.0.1:5174`
- 后端：`http://127.0.0.1:8081`

## 3. 使用 SQLite 启动
如果你只是本地试跑，也可以直接切到 SQLite：

```bash
docker run -d \
  --name gos-release \
  -p 5174:5174 \
  -p 8081:8081 \
  -v gos_release_data:/app/data \
  -e GOS_DB_DRIVER=sqlite \
  -e GOS_SQLITE_PATH='/app/data/demo.db' \
  -e GOS_JENKINS_ENABLED=false \
  -e GOS_AUTH_ADMIN_PASSWORD='admin123' \
  -e GOS_SECURITY_ENCRYPTION_KEY='gos-release-local-key-2026' \
  gos-release:latest
```

## 4. 运行时参数
容器启动时支持以下常用参数：

- `GOS_DB_DRIVER`：`mysql` 或 `sqlite`
- `GOS_MYSQL_DSN`：MySQL 连接串
- `GOS_SQLITE_PATH`：SQLite 文件路径
- `GOS_JENKINS_ENABLED`：是否启用 Jenkins
- `GOS_JENKINS_BASE_URL`：Jenkins 地址
- `GOS_JENKINS_USERNAME`：Jenkins 用户名
- `GOS_JENKINS_API_TOKEN`：Jenkins Token
- `GOS_AUTH_ADMIN_USERNAME`：管理员账号
- `GOS_AUTH_ADMIN_PASSWORD`：管理员密码
- `GOS_SECURITY_ENCRYPTION_KEY`：平台加密密钥
- `GOS_RELEASE_ENV_OPTIONS`：发布环境列表，逗号分隔，例如 `dev,test,prod`
- `GOS_GITOPS_PATH_MAPS`：GitOps 路径映射，格式 `数据库中的local_root=容器内挂载目录`，多条用 `;` 分隔

容器会在启动时自动生成：
- `/app/configs/config.runtime.json`

## 5. 常用命令
查看日志：

```bash
docker logs -f gos-release
```

进入容器：

```bash
docker exec -it gos-release sh
```

停止并删除容器：

```bash
docker rm -f gos-release
```

## 6. 说明
- 这是单容器方案：同一个容器内运行前端静态服务和后端 API。
- 数据库、Jenkins、ArgoCD、GitOps 建议继续使用外部现有服务。
- `master` / GitOps 实例等业务数据仍然走平台数据库，不写死在镜像里。

## 7. GitOps 目录挂载
如果平台数据库里的 GitOps 实例 `local_root` 保存的是宿主机绝对路径，例如：

- `/Users/lingyunxieqing/Desktop/deploy-manifests`

建议在启动容器时：

1. 把仓库挂进容器，例如挂到 `/gitops/deploy-manifests`
2. 通过 `GOS_GITOPS_PATH_MAPS` 建立兼容映射

这样不需要修改数据库里已有的 `local_root`。
