# ArgoCD 入门与部署准备

## 1. 文档目的

本文面向当前还没有实际部署过 ArgoCD 的场景，目标不是一次讲全，而是先帮助建立最小认知，并为 `v0.0.8` 的平台接入做准备。

适用对象：

- 了解 Jenkins，但没接触过 ArgoCD
- 想把平台的 `CD` 能力从 Jenkins 扩展到 ArgoCD
- 希望先用最小成本验证方案，再进入正式开发

## 2. 先用一句话理解 ArgoCD

ArgoCD 是一个基于 GitOps 思想的 Kubernetes 持续部署系统。

更直白一点：

- Jenkins 更擅长“执行流程”
- ArgoCD 更擅长“让集群状态持续对齐 Git 中定义的部署状态”

它最核心的事情只有一件：

- 把 Git 仓库中的 Kubernetes 部署声明，持续同步到 Kubernetes 集群

## 3. 在当前平台中的角色定位

在 GOS 里，建议把 ArgoCD 定位为：

- `CD 执行器`

而不是：

- 替代 Jenkins
- 替代整个平台

平台和 ArgoCD 的职责建议保持如下边界：

| 组件 | 主要职责 |
| --- | --- |
| GOS 平台 | 应用治理、模板、权限、发布入口、发布单、审计展示 |
| Jenkins | CI 流程执行、构建日志、流水线阶段 |
| ArgoCD | 部署同步、健康检查、资源状态、同步事件 |

## 4. 先掌握的 5 个 ArgoCD 核心概念

### 4.1 Application

ArgoCD 的核心对象。

你可以把它理解成：

- “一个被 ArgoCD 管理的部署应用”

它通常会指向：

- 一个 Git 仓库
- 一个目录
- 一个目标 revision
- 一个 Kubernetes 目标集群 / 命名空间

### 4.2 Sync

表示把 Git 中定义的目标状态同步到 Kubernetes 集群。

在平台里可以近似理解为：

- “执行 CD 发布”

### 4.3 Health

表示应用当前的健康状态。

常见值：

- `Healthy`
- `Progressing`
- `Degraded`
- `Missing`

### 4.4 Revision

表示当前发布对应的 Git 版本。

可以是：

- branch
- tag
- commit SHA

### 4.5 Project

ArgoCD 中对 Application 的逻辑分组。

当前阶段可以先简单理解为：

- 应用分组

## 5. 为什么它和 Jenkins 不一样

这点很重要，因为它会直接影响平台设计。

Jenkins 常见模式：

- 传入参数
- 跑流水线
- 输出控制台日志
- 结束

ArgoCD 常见模式：

- 指向某个 Git revision
- 触发一次同步
- 观察同步状态
- 观察健康状态
- 观察资源事件

因此：

- Jenkins 更像“过程执行器”
- ArgoCD 更像“部署状态控制器”

所以后续平台里：

- `CD 日志` 对 Jenkins 来说是控制台日志
- `CD 日志` 对 ArgoCD 来说更像同步事件 / 应用事件

## 6. 当前阶段最推荐的接入目标

如果你还没部署过 ArgoCD，不建议第一步就做复杂能力。

推荐 `v0.0.8` 只做最小闭环：

1. 接入 ArgoCD 配置
2. 能连通 ArgoCD
3. 能同步 ArgoCD Application 列表
4. 平台应用可以绑定一个 ArgoCD Application
5. 发布单执行时可以触发一次 ArgoCD Sync
6. 发布详情可以看到：
   - 同步状态
   - 健康状态
   - 事件流

先不要做：

1. 平台创建 ArgoCD Application
2. 平台管理 ArgoCD Project / Cluster / Repo 凭据
3. 平台内编辑 Helm 全量 values
4. 多实例 ArgoCD

## 7. 最小部署思路

如果你现在没部署过，建议先做一套“最小实验环境”。

### 7.1 最小依赖

至少需要：

- 一个 Kubernetes 集群
- 一个 ArgoCD
- 一个示例 Git 仓库
- 一份可部署到 Kubernetes 的 YAML / Helm Chart / Kustomize 配置

### 7.2 推荐的最小验证环境

最推荐先用测试环境，而不是生产环境。

推荐优先级：

1. 已有测试 Kubernetes 集群
2. 本地或测试机 `k3s`
3. 本地 `kind`

如果只是为了理解和联调，`kind` 或 `k3s` 都足够。

### 7.3 最小部署目标

你第一阶段只需要验证 4 件事：

1. ArgoCD 能安装成功
2. 能登录 ArgoCD UI
3. 能创建或看到一个 Application
4. 能手动执行一次 Sync

只要这 4 件事成功，后续平台接入就会顺很多。

## 8. 建议的部署路线

### 方案 A：测试 Kubernetes 集群部署

最适合后续真实接入。

优点：

- 和真实环境最接近
- 后续平台联调最方便

缺点：

- 需要已有 K8s 环境
- 需要基础集群权限

### 方案 B：本地 kind / k3s 部署

最适合快速学习与自测。

优点：

- 成本低
- 可快速试错

缺点：

- 和真实环境仍有差异
- 网络、Ingress、凭据等问题可能和正式环境不同

## 9. 第一次部署时建议准备的信息

在真正开始安装前，建议先准备下面这些信息：

### 9.1 Kubernetes 侧

- 当前集群访问方式
- 是否已有测试 namespace
- 是否可安装 ArgoCD 到独立 namespace
- 是否可访问 Kubernetes API

### 9.2 Git 仓库侧

- 部署仓库地址
- 仓库访问方式
- 分支 / tag 策略
- 部署目录位置

### 9.3 应用侧

- 示例应用名称
- 目标 namespace
- 目标部署资源类型
- 是否是 Helm Chart / Kustomize / 原生 YAML

## 10. 与平台接入相关的关键设计建议

### 10.1 平台中把 ArgoCD 视为 CD Provider

建议统一模型：

- `CI = Jenkins`
- `CD = Jenkins / ArgoCD`

这样平台层只需要关注：

- `scope`
- `provider`

而不是把 ArgoCD 硬做成 Jenkins 的变体。

### 10.2 平台先绑定“已有的 ArgoCD Application”

当前阶段最稳的方式是：

- 平台不负责创建 ArgoCD Application
- 平台只同步并选择现有 Application

这样能大幅减少复杂度。

### 10.3 参数设计要偏“部署参数”

ArgoCD 参数不像 Jenkins 那样天然就是一张表单。

建议第一版只支持这些常见参数：

- `revision`
- `image_tag`
- `namespace`
- `helm.parameters`
- `sync options`

并通过平台标准 Key 做统一映射。

### 10.4 日志展示要换思路

ArgoCD 不一定有 Jenkins 那种完整控制台日志。

所以平台中的 `CD 日志` 对 ArgoCD 更合理的含义应该是：

- 同步事件
- 操作事件
- 应用状态变化

### 10.5 进度展示要看“同步阶段”

ArgoCD 进度不应直接套 Jenkins stage 模型。

建议映射为部署阶段，例如：

1. `refresh_application`
2. `compare_revision`
3. `start_sync`
4. `apply_resources`
5. `wait_healthy`
6. `sync_completed`

## 11. 平台 v0.0.8 的建议范围

如果按最稳路径推进，`v0.0.8` 建议只做：

### 后端

1. ArgoCD 配置节点
2. 启动连通性检查
3. ArgoCD Application 同步
4. 应用 CD 绑定支持 `provider=argocd`
5. 发布模板支持 `CD=ArgoCD`
6. 发布单执行支持触发 ArgoCD Sync
7. 发布详情支持展示 ArgoCD 状态与事件

### 前端

1. 组件管理新增 `ArgoCD 管理`
2. 展示 ArgoCD Application 列表
3. 管线绑定页可选择 `CD = ArgoCD`
4. 发布模板页支持配置 `CD = ArgoCD`
5. 发布详情页支持展示：
   - CD 状态
   - CD 事件
   - CD 进度

## 12. 当前最重要的不是“立刻开发”，而是“先验证”

对你当前阶段最合理的节奏是：

1. 先理解 ArgoCD 的角色
2. 先做最小部署
3. 先验证一个 Application 可以 Sync
4. 再开始平台接入设计和编码

## 13. 第一阶段验收标准

只要下面几条跑通，就可以进入平台 v0.0.8：

1. 已成功部署 ArgoCD
2. 能访问 ArgoCD UI
3. 能看到一个示例 Application
4. 能手动执行 Sync
5. 能看到 Sync 状态和 Health 状态变化

## 14. 下一步建议

建议按下面顺序推进：

1. 先出一份 `后端需求v0.0.8.md`
2. 再出一份 `前端需求v0.0.8.md`
3. 明确第一版只接“已有 ArgoCD Application”
4. 最后再开始实际编码

## 15. 结论

你现在没部署过 ArgoCD，不会阻碍平台设计。

更合理的顺序是：

- 先把 ArgoCD 看成 `CD 执行器`
- 先搭一个最小可用环境
- 先验证 Sync 和状态
- 再做平台接入

这样成本最低，成功率也最高。
