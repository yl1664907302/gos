<script setup lang="ts">
import applicationWorkbenchImage from '../../assets/marketing/application-workbench.png'
import agentTaskCenterImage from '../../assets/marketing/agent-task-center.png'
import releaseOrdersOverviewImage from '../../assets/marketing/release-orders-overview.png'


function goToSection(hash: string) {
  const target = document.querySelector(hash)
  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="official-page">
    <header class="official-nav">
      <div class="official-brand">
        <div class="official-brand-mark">G</div>
        <div class="official-brand-copy">
          <div class="official-brand-title">GOS Release</div>
        </div>
      </div>
      <nav class="official-nav-links">
        <button type="button" @click="goToSection('#product')">产品</button>
        <button type="button" @click="goToSection('#workflow')">流程</button>
        <button type="button" @click="goToSection('#trust')">治理</button>
        <a
          class="official-nav-link"
          href="https://github.com/yl1664907302/gos"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </nav>
      <a-button class="official-nav-cta" type="primary" @click="goToSection('#product')">
        查看产品
      </a-button>
    </header>

    <main class="official-main">
      <section class="hero-shell">
        <div class="hero-copy">
          <div class="hero-eyebrow">GOS Release</div>
          <h1 class="hero-title">把发布变成一套可治理的系统</h1>
          <p class="hero-summary">
            GOS Release 面向真实企业交付场景而设计我们把发布单、环境锁、参数字库、Hook 扩展、Agent 主动执行与回滚轨迹统一到一套产品里，
            让研发、运维与交付团队在同一条链路里协作，而不是在 Jenkins、服务器、GitOps 和临时脚本之间反复跳转
          </p>
          <div class="hero-actions">
            <a-button size="large" type="primary" @click="goToSection('#product')">查看产品</a-button>
            <a-button size="large" @click="goToSection('#workflow')">查看流程</a-button>
            <a-button
              size="large"
              href="https://github.com/yl1664907302/gos"
              target="_blank"
              rel="noreferrer"
            >
              GitHub 仓库
            </a-button>
          </div>
          <div class="hero-pills">
            <span>发布单驱动</span>
            <span>并发锁与队列</span>
            <span>Hook 编排</span>
            <span>Agent 主动执行</span>
          </div>
        </div>

        <div class="hero-panel hero-showcase">
          <div class="hero-showcase-main system-shot-card">
            <div class="system-shot-bar">
              <span class="system-shot-dot is-red"></span>
              <span class="system-shot-dot is-yellow"></span>
              <span class="system-shot-dot is-green"></span>
              <span class="system-shot-title">发布单中心</span>
            </div>
            <div class="system-shot-body">
              <img :src="releaseOrdersOverviewImage" alt="GOS Release 发布单中心截图" />
            </div>
          </div>
          <div class="hero-showcase-footer">
            <div class="release-info-card is-inline">
              <div class="release-info-head">
                <div>
                  <div class="release-info-kicker">发布单信息</div>
                  <div class="release-info-title">RO-20260402-AGENT-HOOK</div>
                </div>
                <span class="release-info-status">发布中</span>
              </div>
              <div class="release-info-meta">
                <span>南通后端-测试</span>
                <span>prod</span>
                <span>顺序队列</span>
              </div>
              <div class="release-info-flow compact inline">
                <div class="release-info-flow-item is-complete">
                  <span></span>
                  <div>
                    <strong>CI / CD 已完成</strong>
                    <p>主发布链路已完成</p>
                  </div>
                </div>
                <div class="release-info-flow-item is-running">
                  <span></span>
                  <div>
                    <strong>Hook 执行中</strong>
                    <p>Agent 任务正在执行发布后动作</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="signal-grid">
        <article>
          <span>统一入口</span>
          <strong>发布、回滚、重放一条线</strong>
          <p>所有交付动作都围绕发布单建模，平台自己知道这次交付在做什么、做到哪一步、为何失败</p>
        </article>
        <article>
          <span>环境治理</span>
          <strong>同应用同环境自动控并发</strong>
          <p>发布前预检、环境锁与并发队列联动，帮助团队把冲突发版和人工协调降到最低</p>
        </article>
        <article>
          <span>扩展执行</span>
          <strong>Hook 与 Agent 延伸主流程</strong>
          <p>主发布成功后继续触发 Hook 与 Agent 任务，把特殊环境、特殊动作都纳入同一平台治理</p>
        </article>
        <article>
          <span>全链路追踪</span>
          <strong>模板、步骤、日志、变量全部可查</strong>
          <p>从模板到 Hook，从执行单元到回显日志，每个动作都能在一个详情页里被解释清楚</p>
        </article>
      </section>

      <section id="product" class="section-shell product-shell">
        <div class="section-head">
          <div>
            <div class="section-kicker">Product</div>
            <h2>不是抽象概念，而是真正可落地的企业发布工作台</h2>
          </div>
          <p>
            官网不应该只讲能力名词，所以我们把产品里的真实界面直接展示出来：从应用工作台，到发布单列表，再到 Agent 任务中心，
            平台如何组织日常交付动作，一眼就能看清
          </p>
        </div>

        <div class="product-feature-grid">
          <article class="product-feature-copy">
            <div class="product-feature-kicker">应用工作台</div>
            <h3>围绕应用看状态、看历史、看动作，而不是在配置页里找入口</h3>
            <p>
              应用视图聚合最近发布、环境状态和可执行动作，让团队成员先看“哪里可发、哪里异常、哪里正在跑”，再决定下一步操作
            </p>
            <ul>
              <li>按应用组织发布而不是按脚本组织</li>
              <li>默认聚合环境状态、最近发布、模板关系</li>
              <li>面向日常操作，而不是面向后台配置</li>
            </ul>
          </article>
          <div class="product-feature-shot">
            <img :src="applicationWorkbenchImage" alt="GOS Release 应用工作台截图" />
          </div>
        </div>

      </section>

      <section id="capabilities" class="section-shell">
        <div class="section-head">
          <div>
            <div class="section-kicker">Capabilities</div>
            <h2>不是堆功能，而是把交付里的关键动作收成一套秩序</h2>
          </div>
          <p>
            GOS Release 面向真实的企业交付场景：Jenkins、GitOps、ArgoCD、Agent、Webhook、Hook、标准参数字库、审批与并发控制，
            都围绕“发布单”这一张业务主线串起来
          </p>
        </div>

        <div class="capability-grid">
          <article>
            <h3>模板驱动发布</h3>
            <p>把 CI、CD、参数来源、固定值、内置字段、标准字段映射到模板中，建单时只暴露真正需要用户确认的部分</p>
          </article>
          <article>
            <h3>并发与排队控制</h3>
            <p>同应用同环境、同 GitOps 分支、同批并发批次都能被平台治理，不再靠人记住“谁先发”</p>
          </article>
          <article>
            <h3>发布后 Hook</h3>
            <p>主发布完成后继续执行 Hook，可接 Agent 任务或 Webhook 通知，把发布后的检查、重启、通知都统一化</p>
          </article>
          <article>
            <h3>Agent 主动执行</h3>
            <p>面对不能被平台直接访问的网络区域，Agent 主动轮询、领取并执行任务，平台只下发任务，不反向打洞</p>
          </article>
          <article>
            <h3>回滚与重放</h3>
            <p>支持标准回滚与标准重放，结合部署快照、标准字段和历史参数，把恢复动作做成一等公民</p>
          </article>
          <article>
            <h3>全链路详情</h3>
            <p>发布单详情页展示 CI、CD、Hook、Agent 回显与执行进度，真正让排障和审计落到一个页面里</p>
          </article>
        </div>
      </section>

      <section id="workflow" class="section-shell is-dark">
        <div class="section-head is-dark">
          <div>
            <div class="section-kicker">Workflow</div>
            <h2>从模板到执行结果，交付流程被拆成可理解、可追踪、可恢复的阶段</h2>
          </div>
          <p>
            我们不把“发布”当成一个黑盒按钮，而是把预审、预检、执行单元、Hook、Agent 任务和回滚入口拆成平台内的可观察对象
          </p>
        </div>

        <div class="workflow-rail">
          <article>
            <span>1</span>
            <h3>创建发布单</h3>
            <p>从模板继承参数规则、固定值、标准字段与 Hook 策略，形成一张待确认的发布申请</p>
          </article>
          <article>
            <span>2</span>
            <h3>预审与预检</h3>
            <p>用户确认本次参数，系统检查模板、环境锁、并发策略、GitOps/执行器是否可达</p>
          </article>
          <article>
            <span>3</span>
            <h3>CI / CD 执行</h3>
            <p>触发 Jenkins、推送 GitOps、调用 ArgoCD，执行单元逐步落库，详情页实时展示进度</p>
          </article>
          <article>
            <span>4</span>
            <h3>Hook 后处理</h3>
            <p>按模板里的触发策略决定是否执行 Agent 任务或 Webhook，把发布后的检查和收尾继续纳入流程</p>
          </article>
          <article>
            <span>5</span>
            <h3>回滚与审计</h3>
            <p>若失败或需恢复，基于历史快照回滚；同时保留完整步骤、日志、变量与操作轨迹</p>
          </article>
        </div>
      </section>

      <section id="trust" class="section-shell">
        <div class="section-head">
          <div>
            <div class="section-kicker">Governance</div>
            <h2>把复杂交付收进一套稳定、克制的治理结构</h2>
          </div>
          <p>
            企业发布平台真正的价值不在于“能点按钮”，而在于把环境风险、并发冲突、特殊网络、回滚恢复和扩展动作，都纳入一套统一秩序
          </p>
        </div>

        <div class="trust-grid">
          <article>
            <h3>标准字库</h3>
            <p>统一平台参数命名，减少模板间口径漂移，让 CI、CD、Hook、Agent 之间共享一套字段语言</p>
          </article>
          <article>
            <h3>执行器解耦</h3>
            <p>Jenkins、GitOps、ArgoCD、Agent 任务各司其职，又都以发布单为中心，方便未来继续扩展审批和通知</p>
          </article>
          <article>
            <h3>特殊环境适配</h3>
            <p>通过 Agent 主动拉任务的方式，把生产网络隔离、脚本执行、文件下发等特殊约束纳入平台模型</p>
          </article>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.official-page {
  min-height: 100vh;
  color: #0f172a;
  font-family: 'TraeInter', Inter, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 22%),
    radial-gradient(circle at 85% 14%, rgba(56, 189, 248, 0.14), transparent 18%),
    linear-gradient(180deg, #eef3fa 0%, #f4f7fb 28%, #f7f9fc 100%);
}

.official-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 34px;
  backdrop-filter: blur(18px);
  background: rgba(244, 247, 251, 0.78);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.official-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

@font-face {
  font-family: 'TraeInter';
  src: url('https://lf16-web-neutral.traecdn.ai/obj/trae-ai-static/trae_website/static/font/Inter_18pt-Regular.e37e3d86.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'TraeInter';
  src: url('https://lf16-web-neutral.traecdn.ai/obj/trae-ai-static/trae_website/static/font/Inter_18pt-Medium.681e246f.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'TraeInter';
  src: url('https://lf16-web-neutral.traecdn.ai/obj/trae-ai-static/trae_website/static/font/Inter_18pt-SemiBold.319254ab.ttf') format('truetype');
  font-weight: 600 800;
  font-style: normal;
}

.official-brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(150deg, #0f172a 0%, #1d4ed8 100%);
  color: #eff6ff;
  font-size: 21px;
  font-weight: 700;
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.16);
}

.official-brand-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
}


.official-nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.official-nav-links button,
.official-nav-link {
  border: none;
  background: transparent;
  color: #475569;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.official-nav-links button:hover,
.official-nav-link:hover {
  color: #0f172a;
  background: rgba(255, 255, 255, 0.84);
}

.official-nav-cta {
  border-radius: 999px;
}

.official-main {
  max-width: 1260px;
  margin: 0 auto;
  padding: 42px 34px 80px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero-shell,
.section-shell,
.cta-shell,
.signal-grid article {
  border: 1px solid rgba(148, 163, 184, 0.14);
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.06);
}

.hero-shell,
.section-shell,
.cta-shell {
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.84);
}

.hero-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  gap: 30px;
  padding: 34px;
  align-items: start;
}

.hero-eyebrow,
.section-kicker,
.product-feature-kicker,
.product-gallery-kicker {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.hero-title,
.section-head h2,
.cta-shell h2 {
  margin: 12px 0 0;
  font-family: 'TraeInter', Inter, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.045em;
}

.hero-summary,
.section-head p,
.cta-shell p,
.product-feature-copy p,
.product-gallery-copy p {
  margin: 20px 0 0;
  color: #475569;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.82;
}

.hero-actions,
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
}

.hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.hero-pills span {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: #1e293b;
  font-size: 13px;
  font-weight: 700;
}

.hero-panel {
  min-height: 100%;
}

.hero-showcase {
  display: grid;
  grid-template-rows: auto auto;
  gap: 14px;
}

.system-shot-card {
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.12);
}

.hero-showcase-main {
  min-height: 0;
}

.hero-showcase-footer {
  display: flex;
}

.release-info-card {
  padding: 18px;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.14);
}

.release-info-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.release-info-kicker {
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.release-info-title {
  margin-top: 8px;
  color: #0f172a;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.release-info-status {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}


.release-info-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.release-info-meta span {
  padding: 7px 10px;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: #334155;
  font-size: 12px;
  font-weight: 600;
}

.release-info-flow {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.release-info-card.is-inline {
  width: 100%;
}

.release-info-flow.inline {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.release-info-flow-item {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 8px 2px;
}

.release-info-flow-item span {
  width: 12px;
  height: 12px;
  margin-top: 6px;
  border-radius: 999px;
  background: #cbd5e1;
}

.release-info-flow-item.is-complete span {
  background: #22c55e;
}

.release-info-flow-item.is-running span {
  background: #2563eb;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.12);
}

.release-info-flow-item strong {
  display: block;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
}

.release-info-flow-item p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.system-shot-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(241, 245, 249, 0.88));
}

.system-shot-bar.compact {
  padding: 10px 14px;
}

.system-shot-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.system-shot-dot.is-red { background: #fb7185; }
.system-shot-dot.is-yellow { background: #fbbf24; }
.system-shot-dot.is-green { background: #34d399; }

.system-shot-title {
  margin-left: 8px;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.system-shot-body {
  padding: 14px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(226, 232, 240, 0.88));
}

.system-shot-body.compact {
  padding: 10px;
}

.system-shot-body img {
  display: block;
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  object-position: top;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12);
}

.signal-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.signal-grid article {
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.84);
}

.signal-grid span {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.signal-grid strong {
  display: block;
  margin-top: 10px;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.22;
}

.signal-grid p,
.capability-grid p,
.workflow-rail p,
.trust-grid p {
  margin: 12px 0 0;
  color: #475569;
  line-height: 1.85;
}

.section-shell,
.cta-shell { padding: 34px; }

.section-shell.is-dark {
  background: linear-gradient(180deg, #0f172a 0%, #111d32 100%);
  color: #eff6ff;
}

.section-head {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 26px;
  align-items: end;
}

.section-head h2 {
  font-size: clamp(30px, 4vw, 48px);
}

.product-shell {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.product-feature-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 22px;
  align-items: stretch;
}

.product-feature-copy,
.product-gallery-card {
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(248, 250, 252, 0.86);
}

.product-feature-copy {
  padding: 28px;
}

.product-feature-copy h3,
.product-gallery-copy h3 {
  margin: 14px 0 0;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.18;
}

.product-feature-copy ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.product-feature-copy li {
  position: relative;
  padding-left: 18px;
  color: #334155;
  line-height: 1.8;
}

.product-feature-copy li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: linear-gradient(150deg, #1d4ed8, #38bdf8);
}

.product-feature-shot,
.product-gallery-media {
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: #dfe7f3;
}

.product-feature-shot img,
.product-gallery-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.product-gallery-card {
  overflow: hidden;
}

.product-gallery-copy {
  padding: 20px 22px 24px;
}

.section-head.is-dark p,
.section-shell.is-dark .workflow-rail p {
  color: rgba(226, 232, 240, 0.74);
}

.section-shell.is-dark .section-kicker,
.section-shell.is-dark .section-head h2 {
  color: #eff6ff;
}

.capability-grid,
.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.capability-grid article,
.trust-grid article {
  min-height: 220px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.14);
}

.capability-grid h3,
.workflow-rail h3,
.trust-grid h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.workflow-rail {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
  margin-top: 28px;
}

.workflow-rail article {
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.workflow-rail span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(56, 189, 248, 0.12);
  color: #7dd3fc;
  font-weight: 800;
}

.cta-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) auto;
  gap: 24px;
  align-items: end;
}

@media (max-width: 1180px) {
  .hero-shell,
  .section-head,
  .cta-shell,
  .signal-grid,
  .capability-grid,
  .trust-grid,
  .workflow-rail,
  .product-feature-grid,
  .product-gallery-grid {
    grid-template-columns: 1fr;
  }

  .hero-showcase {
    min-height: auto;
  }

  .hero-showcase-overlay {
    position: static;
    width: 100%;
  }
}


@media (max-width: 780px) {
  .official-nav {
    padding: 16px 18px;
    flex-wrap: wrap;
  }

  .official-nav-links {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }

  .official-main {
    padding: 24px 16px 56px;
  }

  .hero-shell,
  .section-shell,
  .cta-shell {
    padding: 22px;
    border-radius: 26px;
  }

  .hero-showcase-footer {
    display: block;
  }

  .release-info-flow.inline {
    grid-template-columns: 1fr;
  }

  .hero-title,
  .section-head h2,
  .cta-shell h2 {
    font-size: 34px;
  }

  .product-feature-copy h3,
  .product-gallery-copy h3 {
    font-size: 28px;
  }

  .signal-grid article,
  .capability-grid article,
  .trust-grid article,
  .workflow-rail article {
    min-height: auto;
  }
}
</style>
