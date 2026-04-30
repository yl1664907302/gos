<template>
  <div class="tutorial-page">
    <article class="tutorial-article">
      <!-- 标题区 -->
      <header class="tutorial-header">
        <h1 class="tutorial-title">GitOps 仓库配置教程</h1>
        <p class="tutorial-subtitle">
          面向运维/平台管理员的完整指南：从仓库初始化、目录规范、分支命名到平台接入的全流程。
        </p>
      </header>

      <!-- 目录 -->
      <nav class="tutorial-toc">
        <h2>目录</h2>
        <ol>
          <li><a href="#concept">前置概念：GOS 中的 GitOps 是什么</a></li>
          <li><a href="#repo-structure">仓库目录结构规范</a></li>
          <li><a href="#branch-naming">分支策略</a></li>
          <li><a href="#helm">Helm Values（当前推荐）</a></li>
          <li><a href="#kustomize">Kustomize Overlay（即将上线）</a></li>
          <li><a href="#platform-config">在 GOS 中完成配置（完整步骤）</a></li>
          <li><a href="#full-example">完整示例：从零搭建一个应用的 GitOps 部署</a></li>
          <li><a href="#troubleshooting">常见问题排查</a></li>
        </ol>
      </nav>

      <!-- 正文内容 -->
      <section id="concept">
        <h2>1. 前置概念：GOS 中的 GitOps 是什么</h2>
        <p>
          GitOps 是一种将 Git 仓库作为 Kubernetes 部署声明的「唯一事实来源」的运维模式。
          在 GOS 平台中，GitOps 层负责管理本地克隆的 Git 仓库，在发布执行时自动完成
          <code>git pull</code>、编辑 YAML 文件、<code>git commit</code>、<code>git push</code>
          等操作，将部署声明推送到远端。
        </p>
        <p>
          整体链路可以理解为：
        </p>
        <div class="flow-diagram">
          <div class="flow-step">开发提交代码</div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">Jenkins CI 构建镜像</div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">GOS 发布单执行</div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">平台更新 GitOps 仓库（改镜像 tag 等字段）</div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">ArgoCD 检测变更并 Sync 到 K8s 集群</div>
        </div>
        <p>
          因此，作为平台管理员，你需要准备好一个符合规范的 GitOps 仓库，并在 GOS 中完成
          GitOps 实例和 ArgoCD 实例的配置与绑定。
        </p>
      </section>

      <section id="repo-structure">
        <h2>2. 仓库目录结构规范</h2>
        <p>
          GitOps 仓库必须遵循以下目录层级，平台才能正确识别和操作：
        </p>

        <div class="code-block">
          <pre><code>&lt;仓库根目录&gt;/
├── apps/                          # 必须：所有应用的部署声明都放在 apps 下
│   ├── my-app/                    # 每个应用一个目录，目录名对应 app_key
│   │   ├── overlays/              # Kustomize overlay 目录（Kustomize 模式）
│   │   │   ├── dev/               # 环境目录：dev
│   │   │   │   └── kustomization.yaml
│   │   │   ├── test/              # 环境目录：test
│   │   │   │   └── kustomization.yaml
│   │   │   └── prod/              # 环境目录：prod
│   │   │       └── kustomization.yaml
│   │   └── helm/                  # Helm values 目录（Helm 模式）
│   │       ├── values-dev.yaml
│   │       ├── values-test.yaml
│   │       └── values-prod.yaml
│   └── another-app/               # 另一个应用的目录
│       └── overlays/
│           └── ...
└── (其他仓库文件，如 README.md 等，无影响)</code></pre>
        </div>

        <div class="info-box">
          <strong>核心约定：</strong>
          <ul>
            <li><code>apps/</code> 必须存在于仓库根目录下。</li>
            <li>每个应用在 <code>apps/</code> 下有自己的子目录，目录名与 GOS 应用的 <code>app_key</code> 对应。</li>
            <li>平台会自动忽略 <code>app_key</code> 目录名中的环境后缀（如 <code>-dev</code>、<code>-test</code>、<code>-prod</code>），所以你既可以用 <code>my-app</code> 也可以用 <code>my-app-dev</code> 作为目录名。</li>
            <li>环境目录名（<code>dev</code>、<code>test</code>、<code>prod</code> 等）与平台系统设置中的 <code>env_options</code> 对应。</li>
          </ul>
        </div>
      </section>

      <section id="branch-naming">
        <h2>3. 分支策略</h2>

        <h3>3.1 核心原则：一个环境 + 一个应用 = 一个分支</h3>
        <p>
          GOS 采用<strong>按应用 + 按环境独立分支</strong>的策略，确保不同应用、不同环境的发布互不干扰，
          支持同一应用在不同环境、或不同应用之间同时并发发布而不会产生 Git 冲突。
          每个分支上只承载该应用在该环境下的 Helm values 变更，各分支独立 commit 和 push，互不影响。
        </p>

        <p>以三个应用（<code>auth</code>、<code>gateway</code>、<code>platform</code>）和三个环境（dev、test、prod）为例：</p>

        <table class="tutorial-table">
          <thead>
            <tr>
              <th>分支名</th>
              <th>应用</th>
              <th>环境</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>auth-dev</code></td><td>auth</td><td>dev</td><td>auth 应用的开发环境</td></tr>
            <tr><td><code>auth-test</code></td><td>auth</td><td>test</td><td>auth 应用的测试环境</td></tr>
            <tr><td><code>auth-prod</code></td><td>auth</td><td>prod</td><td>auth 应用的生产环境</td></tr>
            <tr><td><code>gateway-dev</code></td><td>gateway</td><td>dev</td><td>gateway 应用的开发环境</td></tr>
            <tr><td><code>gateway-test</code></td><td>gateway</td><td>test</td><td>gateway 应用的测试环境</td></tr>
            <tr><td><code>gateway-prod</code></td><td>gateway</td><td>prod</td><td>gateway 应用的生产环境</td></tr>
            <tr><td><code>platform-dev</code></td><td>platform</td><td>dev</td><td>platform 应用的开发环境</td></tr>
            <tr><td><code>…</code></td><td>…</td><td>…</td><td>以此类推</td></tr>
          </tbody>
        </table>

        <h3>3.2 命名格式</h3>
        <p>分支名 = <code>{app_key}-{env_code}</code>，全部小写，连字符分隔。</p>

        <div class="info-box">
          <strong>规则：</strong>
          <ul>
            <li><code>app_key</code> 与 GOS 应用中配置的 Key 保持一致</li>
            <li><code>env_code</code> 与系统设置中的环境选项保持一致（如 dev、test、prod）</li>
            <li>app_key 中可以包含连字符（如 <code>nantong-gateway</code>），最终分支名为 <code>nantong-gateway-dev</code></li>
          </ul>
        </div>

        <h3>3.3 为什么要每个环境独立分支</h3>
        <p>避免并发发布冲突。假设 auth 应用同时在 dev 和 prod 执行发布：</p>
        <ul>
          <li>如果共用 <code>main</code> 分支 → 两个发布同时修改同一分支的 values 文件 → git push 冲突或覆盖</li>
          <li>如果各用 <code>auth-dev</code> 和 <code>auth-prod</code> → 互不干扰，各自独立 commit + push</li>
        </ul>

        <h3>3.4 分支解析优先级</h3>
        <p>发布执行时，平台按以下顺序确定操作哪个分支：</p>

        <table class="tutorial-table">
          <thead>
            <tr><th>优先级</th><th>来源</th><th>说明</th></tr>
          </thead>
          <tbody>
            <tr><td>1（最高）</td><td>应用 → GitOps 分支映射</td><td>在「我的应用 → 编辑应用」中为每个环境显式指定分支</td></tr>
            <tr><td>2</td><td>自动推导 <code>{appKey}-{envCode}</code></td><td>未映射时自动拼接，如 <code>auth-dev</code></td></tr>
            <tr><td>3</td><td>ArgoCD targetRevision</td><td>沿用 ArgoCD Application 中配置的 revision</td></tr>
            <tr><td>4（兜底）</td><td><code>master</code></td><td>以上均未命中时的默认值</td></tr>
          </tbody>
        </table>

        <h3>3.5 创建分支示例</h3>
        <div class="code-block">
          <pre><code># 以 auth 应用为例，在仓库根目录执行
git checkout master

# 创建 dev 环境分支
git checkout -b auth-dev
git push origin auth-dev

# 创建 test 环境分支
git checkout -b auth-test
git push origin auth-test

# 创建 prod 环境分支
git checkout -b auth-prod
git push origin auth-prod</code></pre>
        </div>

        <p>
          所有分支内容相同（都包含 <code>apps/helm/</code> 下的全套 values 文件），
          发布时平台只修改匹配的 values 文件（如 <code>auth.values-dev.yaml</code>）并提交到对应分支。
        </p>
      </section>

      <section id="helm">
        <h2>4. 方式：Helm Values（当前推荐）</h2>
        <p>
          GOS 当前主力支持 Helm 模式的 GitOps。应用使用共享 Helm Chart，通过不同的 values
          文件管理各环境的部署参数。平台在发布时会按规则修改指定的 values 字段，
          然后 commit + push 到对应分支。
        </p>

        <h3>4.1 推荐目录结构</h3>
        <p>使用集中式共享 Helm Chart，所有应用共用同一套模板：</p>

        <div class="code-block">
          <pre><code>&lt;仓库根目录&gt;/
└── apps/
    └── helm/                      # 共享 Helm Chart
        ├── Chart.yaml
        ├── templates/             # Helm 模板（Deployment、Service 等）
        │   ├── deployment.yaml
        │   ├── service.yaml
        │   └── configmap.yaml
        ├── values-dev.yaml        # 全局共享 values
        ├── values-test.yaml
        ├── values-prod.yaml
        ├── {app}.values-dev.yaml   # 应用级 values（如 auth.values-dev.yaml）
        ├── {app}.values-test.yaml
        └── {app}.values-prod.yaml</code></pre>
        </div>

        <div class="info-box">
          <strong>关键约定：</strong>
          <ul>
            <li>目录路径默认为 <code>apps/helm</code>，可在<strong>系统设置 → GitOps 读取目录</strong>中修改。</li>
            <li>文件名<strong>必须包含 "values"</strong> 字样（如 <code>auth.values-dev.yaml</code>），否则平台扫描不到。</li>
            <li>平台会自动将文件名中的环境名（dev/test/prod）替换为 <code>{env}</code> 占位符。</li>
          </ul>
        </div>

        <h3>4.2 Values 文件示例</h3>
        <p>以下以实际仓库为例，展示共享 values 和应用级 values 的写法。</p>

        <p><strong>apps/helm/values-dev.yaml（全局基础配置）：</strong></p>
        <div class="code-block">
          <pre><code>global:
  namespace: nantong-20
  nacos:
    username: nacos
    password: nacos
    serverAddr: register:8848
    namespace: 14a9f6dd-c66c-45e1-9a3a-970bc36b18c1</code></pre>
        </div>

        <p><strong>apps/helm/auth.values-dev.yaml（应用级 values，可被平台替换）：</strong></p>
        <div class="code-block">
          <pre><code>image:
  repository: registry.example.com/auth
  tag: "1.0.0"       # 平台发布时自动替换

replicaCount: 1

service:
  type: ClusterIP
  port: 8080

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 128Mi</code></pre>
        </div>

        <p><strong>apps/helm/auth.values-prod.yaml（生产环境增加副本数和资源）：</strong></p>
        <div class="code-block">
          <pre><code>image:
  repository: registry.example.com/auth
  tag: "1.0.0"

replicaCount: 3

resources:
  limits:
    cpu: 2000m
    memory: 2048Mi
  requests:
    cpu: 500m
    memory: 512Mi</code></pre>
        </div>
      </section>

      <section id="kustomize">
        <h2>5. Kustomize Overlay（即将上线）</h2>
        <p>
          Kustomize 模式目前正在开发中。上线后，平台将支持自动更新
          <code>kustomization.yaml</code> 的 <code>images[0].newTag</code>，
          并在仓库中按 <code>apps/{app_key}/overlays/{env}/</code> 目录结构扫描 Kubernetes 资源字段。
        </p>
        <p>
          目录结构规划如下：
        </p>
        <div class="code-block" v-pre>
          <pre><code>apps/{app}/
├── base/                  # 公共 Kubernetes YAML
│   ├── deployment.yaml
│   └── service.yaml
└── overlays/
    ├── dev/
    │   └── kustomization.yaml
    ├── test/
    │   └── kustomization.yaml
    └── prod/
        └── kustomization.yaml</code></pre>
        </div>
        <p>
          当前如需使用 GitOps，请先使用上方 Helm 模式。
        </p>
      </section>

      <section id="platform-config">
        <h2>6. 在 GOS 中完成配置（完整步骤）</h2>
        <p>
          准备好 Git 仓库后，按以下步骤在 GOS 平台中完成接入配置。
        </p>

        <h3>步骤 1：配置 GitOps 实例</h3>
        <p>进入 <strong>组件管理 → GitOps管理</strong>，点击「新建实例」，填写以下字段：</p>
        <table class="tutorial-table">
          <thead>
            <tr>
              <th>字段</th>
              <th>说明</th>
              <th>示例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>实例编码</td>
              <td>小写字母标识，创建后不可修改</td>
              <td><code>prod-gitops</code></td>
            </tr>
            <tr>
              <td>实例名称</td>
              <td>显示名称</td>
              <td>「生产环境 GitOps 仓库」</td>
            </tr>
            <tr>
              <td>工作目录</td>
              <td>服务器上的绝对路径，用于存放 Git 仓库的本地工作副本</td>
              <td><code>/data/gitops/prod</code></td>
            </tr>
            <tr>
              <td>默认分支</td>
              <td>分支解析失败时的兜底分支</td>
              <td><code>master</code></td>
            </tr>
            <tr>
              <td>Git 用户名/密码/Token</td>
              <td>远程仓库认证凭据，三选一配置即可</td>
              <td>Token: <code>glpat-xxxx</code></td>
            </tr>
            <tr>
              <td>提交者名称</td>
              <td>平台自动提交时的 Git author name</td>
              <td><code>gos-bot</code>（默认）</td>
            </tr>
            <tr>
              <td>提交者邮箱</td>
              <td>平台自动提交时的 Git author email</td>
              <td><code>gos@example.com</code>（默认）</td>
            </tr>
            <tr>
              <td>提交信息模板</td>
              <td>使用 <code>{key}</code> 占位符，key 必须是平台标准字库中已启用的参数</td>
              <td><code>chore(release): {app_key}/{project_name}/{env} → {image_version} ({branch})</code></td>
            </tr>
            <tr>
              <td>命令超时</td>
              <td>单次 Git 命令的最长等待秒数，默认 30，最大 600</td>
              <td><code>30</code></td>
            </tr>
          </tbody>
        </table>

        <p>创建后，选中该实例即可查看仓库状态：</p>
        <ul>
          <li><strong>路径存在：</strong>工作目录是否存在</li>
          <li><strong>Git 仓库：</strong>目录是否为合法的 Git 仓库</li>
          <li><strong>远端可达：</strong>凭据是否正确、能否连通远程</li>
          <li><strong>当前分支 / HEAD：</strong>当前检出的分支和最新 commit</li>
          <li><strong>工作区状态：</strong>是否有未提交的变更</li>
        </ul>
        <p>
          注意：如果工作目录下没有 Git 仓库，平台会在首次发布执行时自动 clone。
          你也可以提前手动 clone 到工作目录下。
        </p>

        <h3>步骤 2：配置 ArgoCD 实例</h3>
        <p>进入 <strong>组件管理 → ArgoCD管理</strong>，点击「新建实例」：</p>
        <table class="tutorial-table">
          <thead>
            <tr>
              <th>字段</th>
              <th>说明</th>
              <th>示例</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>实例编码</td>
              <td>小写字母标识</td>
              <td><code>prod-cn</code></td>
            </tr>
            <tr>
              <td>实例名称</td>
              <td>显示名称</td>
              <td>「华东生产集群」</td>
            </tr>
            <tr>
              <td>Base URL</td>
              <td>ArgoCD Server 地址</td>
              <td><code>https://argocd.example.com</code></td>
            </tr>
            <tr>
              <td>认证模式</td>
              <td>token / password / basic / session</td>
              <td><code>token</code></td>
            </tr>
            <tr>
              <td>关联 GitOps 实例</td>
              <td>选择步骤 1 中创建的 GitOps 实例</td>
              <td>「生产环境 GitOps 仓库」</td>
            </tr>
            <tr>
              <td>集群名称 / 默认命名空间</td>
              <td>K8s 集群标识</td>
              <td><code>prod-east</code> / <code>default</code></td>
            </tr>
            <tr>
              <td>跳过 TLS 验证</td>
              <td>内网自签名证书环境建议勾选</td>
              <td>勾选</td>
            </tr>
          </tbody>
        </table>

        <p>创建后可以点击「连接检测」验证 ArgoCD 是否可达。</p>

        <h3>步骤 3：环境绑定</h3>
        <p>
          在 <strong>ArgoCD管理</strong> 页面的「02. 环境绑定」区域，将系统的每个环境
          映射到对应的 ArgoCD 实例。例如：<code>dev → prod-cn</code>、<code>test → prod-cn</code>。
        </p>
        <p>这样当发布单指定某个环境时，平台就知道应该使用哪个 ArgoCD 实例来执行 CD。</p>

        <h3>步骤 4：配置发布模板（Helm 模式）</h3>
        <p>
          进入 <strong>发布管理 → 发布模板</strong>，新建或编辑模板，确保 CD 执行器选择「ArgoCD」：
        </p>
        <ol>
          <li>在 CD 区域绑定 ArgoCD 管线（选择步骤 2 中创建的实例对应的绑定）。</li>
          <li>GitOps 类型保持 <strong>Helm</strong>。</li>
          <li>点击「同步 Values」加载 <code>apps/helm</code> 目录下所有 values 文件的字段候选。</li>
          <li>点击「新增规则」，选择要替换的字段（如 <code>image.tag</code>），平台会在发布时自动将该字段值替换为 <code>image_version</code>。</li>
        </ol>
        <p>
          保存模板后，开发人员即可以此模板创建发布单。发布执行时平台会自动完成：
          checkout 对应分支 → 修改 values 文件 → commit → push → 触发 ArgoCD Sync。
        </p>
      </section>

      <section id="full-example">
        <h2>7. 完整示例：从零搭建一个应用的 GitOps 部署</h2>

        <p>以下以应用 <code>auth</code> 为例，使用共享 Helm Chart 方式。</p>

        <h3>7.1 创建 Git 仓库并初始化目录</h3>
        <div class="code-block">
          <pre><code># 创建仓库
mkdir deploy-manifests && cd deploy-manifests
git init

# 创建目录和初始文件
mkdir -p apps/helm/templates

# Chart.yaml
cat &gt; apps/helm/Chart.yaml &lt;&lt; 'EOF'
apiVersion: v2
name: auth
version: 0.1.0
appVersion: "1.0.0"
type: application
EOF</code></pre>
        </div>

        <h3>7.2 创建各环境 Values 文件</h3>
        <p><strong>apps/helm/values-dev.yaml（全局配置）：</strong></p>
        <div class="code-block">
          <pre><code>global:
  namespace: auth-dev</code></pre>
        </div>

        <p><strong>apps/helm/auth.values-dev.yaml（应用级）：</strong></p>
        <div class="code-block">
          <pre><code>image:
  repository: registry.example.com/auth
  tag: "0.0.1"

replicaCount: 1
service:
  type: ClusterIP
  port: 8080</code></pre>
        </div>

        <p><strong>apps/helm/auth.values-test.yaml：</strong></p>
        <div class="code-block">
          <pre><code>image:
  repository: registry.example.com/auth
  tag: "0.0.1"

replicaCount: 2</code></pre>
        </div>

        <p><strong>apps/helm/auth.values-prod.yaml：</strong></p>
        <div class="code-block">
          <pre><code>image:
  repository: registry.example.com/auth
  tag: "0.0.1"

replicaCount: 3
service:
  type: LoadBalancer</code></pre>
        </div>

        <h3>7.3 创建分支并推送</h3>
        <div class="code-block">
          <pre><code>git add .
git commit -m "init: helm chart and values for auth"

# 创建各环境分支（命名规范：{app}-{env}）
git checkout -b auth-dev
git push origin auth-dev

git checkout -b auth-test
git push origin auth-test

git checkout -b auth-prod
git push origin auth-prod</code></pre>
        </div>

        <h3>7.4 在 ArgoCD 中创建 Application</h3>
        <p>以 dev 环境为例，在 ArgoCD UI 中创建 Application：</p>
        <table class="tutorial-table">
          <thead><tr><th>参数</th><th>值</th></tr></thead>
          <tbody>
            <tr><td>Repository URL</td><td>你的 GitOps 仓库地址</td></tr>
            <tr><td>Revision</td><td><code>auth-dev</code></td></tr>
            <tr><td>Path</td><td><code>apps/helm</code></td></tr>
            <tr><td>Destination Namespace</td><td><code>auth-dev</code></td></tr>
          </tbody>
        </table>

        <h3>7.5 在 GOS 中完成配置</h3>
        <ol>
          <li>在 <strong>GitOps管理</strong> 中创建实例，指向 <code>/data/gitops/prod</code>。</li>
          <li>在 <strong>ArgoCD管理</strong> 中创建实例，关联上述 GitOps 实例。</li>
          <li>进入 <strong>ArgoCD应用</strong>，同步 Application 列表。</li>
          <li>在 <strong>环境绑定</strong> 中将 dev/test/prod 分别绑定到 ArgoCD 实例。</li>
          <li>进入 <strong>发布模板</strong>，CD 选 ArgoCD + Helm，点击「同步 Values」加载字段候选。</li>
          <li>新增规则：选择 <code>image.tag</code>，绑定到 <code>image_version</code> 标准字段。</li>
          <li>保存模板，创建发布单开始使用。</li>
        </ol>
      </section>

      <section id="troubleshooting">
        <h2>8. 常见问题排查</h2>

        <h3>Q1：GitOps管理页面显示「路径不存在」</h3>
        <p>
          服务器上还没有创建工作目录。确保 <code>local_root</code> 路径所在磁盘有足够空间，
          手动创建目录或等待首次发布执行时自动 clone。
        </p>

        <h3>Q2：远端不可达</h3>
        <p>检查以下几点：</p>
        <ul>
          <li>Git 凭据（用户名/密码/Token）是否正确</li>
          <li>服务器能否连通 Git 服务器（网络/防火墙/VPN）</li>
          <li>如果是自签名证书的 Git 服务器，确认 HTTPS 证书有效或切换为 HTTP</li>
        </ul>

        <h3>Q3：发布模板提示「GitOps 读取目录不存在」</h3>
        <p>检查以下几点：</p>
        <ul>
          <li>GitOps 仓库 master 分支中是否存在配置的扫描目录（默认 <code>apps/helm</code>）</li>
          <li>系统设置中的 GitOps 读取目录路径是否正确（进入 <strong>设置</strong> 页面查看）</li>
          <li>文件命名是否包含 "values" 字样</li>
        </ul>

        <h3>Q4：ArgoCD 连接检测失败</h3>
        <p>检查以下几点：</p>
        <ul>
          <li>Base URL 是否正确（不要漏了 https://）</li>
          <li>Token 是否有效且未过期</li>
          <li>如果 Base URL 是自签名 HTTPS，记得勾选「跳过 TLS 验证」</li>
        </ul>

        <h3>Q5：发布执行时找不到分支</h3>
        <p>检查以下几点：</p>
        <ul>
          <li>分支是否已推送到远端（平台只从远端 fetch，不会创建新分支）</li>
          <li>分支名是否符合 <code>{appKey}-{envCode}</code> 格式（如 <code>auth-dev</code>），或者在应用配置中做了显式映射</li>
          <li>在 <strong>GitOps管理</strong> 中查看仓库状态，确认当前分支信息</li>
        </ul>

        <h3>Q6：提交信息模板中的占位符没有正确替换</h3>
        <p>
          确保占位符 <code>{key}</code> 中的 key 已在 <strong>标准字库</strong> 中注册并启用。
          未识别的 key 会原样保留在 commit message 中。
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
// GitOps 配置教程 - 纯展示页面，无需交互逻辑
</script>

<style scoped>
.tutorial-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 8px 0 48px;
}

.tutorial-article {
  color: #1e293b;
  line-height: 1.82;
  font-size: 15px;
}

/* 标题区 */
.tutorial-header {
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e2e8f0;
}

.tutorial-title {
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.tutorial-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* 目录导航 */
.tutorial-toc {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 24px 28px;
  margin-bottom: 40px;
}

.tutorial-toc h2 {
  font-size: 14px;
  font-weight: 700;
  color: #475569;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tutorial-toc ol {
  list-style: none;
  counter-reset: toc-counter;
  padding: 0;
  margin: 0;
}

.tutorial-toc li {
  counter-increment: toc-counter;
  padding: 4px 0;
}

.tutorial-toc li::before {
  content: counter(toc-counter) ".";
  color: #3b82f6;
  font-weight: 600;
  margin-right: 8px;
  min-width: 20px;
  display: inline-block;
}

.tutorial-toc a {
  color: #334155;
  text-decoration: none;
  transition: color 0.18s ease;
}

.tutorial-toc a:hover {
  color: #3b82f6;
}

/* 内容区域 */
.tutorial-article section {
  margin-bottom: 48px;
}

.tutorial-article h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #3b82f6;
}

.tutorial-article h3 {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin: 24px 0 12px;
}

.tutorial-article p {
  margin: 0 0 14px;
  color: #334155;
}

.tutorial-article ul,
.tutorial-article ol {
  margin: 0 0 16px 8px;
  padding-left: 20px;
}

.tutorial-article li {
  margin-bottom: 6px;
  color: #334155;
}

.tutorial-article code {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 1px 6px;
  font-size: 13px;
  color: #1e293b;
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
}

/* 代码块 */
.code-block {
  background: #0f172a;
  border-radius: 0;
  margin: 16px 0;
  overflow: hidden;
}

.code-block pre {
  margin: 0;
  padding: 20px 24px;
  overflow-x: auto;
}

.code-block code {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  font-size: 13.5px;
  color: #e2e8f0;
  line-height: 1.7;
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
}

/* 信息提示框 */
.info-box {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 16px 20px;
  margin: 20px 0;
  font-size: 14px;
}

.info-box strong {
  color: #1e40af;
}

.info-box ul {
  margin: 8px 0 0;
}

/* 流程图 */
.flow-diagram {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 20px;
  margin: 16px 0;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0;
}

.flow-step {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #1e40af;
  border-radius: 0;
  white-space: nowrap;
}

.flow-arrow {
  color: #94a3b8;
  font-weight: 700;
  font-size: 16px;
}

/* 表格 */
.tutorial-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

.tutorial-table th {
  background: #0f172a;
  color: #e2e8f0;
  padding: 10px 14px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  border-radius: 0;
}

.tutorial-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  vertical-align: top;
}

.tutorial-table tr:nth-child(even) td {
  background: #f8fafc;
}

.tutorial-table code {
  font-size: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .tutorial-page {
    padding: 0 0 32px;
  }

  .tutorial-title {
    font-size: 24px;
  }

  .code-block pre {
    padding: 14px 16px;
  }

  .code-block code {
    font-size: 12.5px;
  }

  .flow-diagram {
    flex-direction: column;
    align-items: flex-start;
  }

  .flow-arrow {
    display: none;
  }

  .flow-step {
    width: 100%;
  }
}
</style>
