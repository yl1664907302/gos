import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const argocdURL = new URL('../src/views/component/ArgoCDManagementView.vue', import.meta.url)
const argocdApplicationsURL = new URL('../src/views/component/ArgoCDApplicationManagementView.vue', import.meta.url)
const gitopsURL = new URL('../src/views/component/GitOpsManagementView.vue', import.meta.url)
const routerURL = new URL('../src/router/index.ts', import.meta.url)
const layoutURL = new URL('../src/layouts/AppLayout.vue', import.meta.url)
const argocdSource = readFileSync(argocdURL, 'utf8')
const argocdApplicationsSource = readFileSync(argocdApplicationsURL, 'utf8')
const gitopsSource = readFileSync(gitopsURL, 'utf8')
const routerSource = readFileSync(routerURL, 'utf8')
const layoutSource = readFileSync(layoutURL, 'utf8')

function extractStyleRule(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  assert.ok(match, `expected style rule for ${selector}`)
  return match[1]
}

test('gitops management follows custom list, action and modal standards', () => {
  assert.match(gitopsSource, /<div class="page-header">[\s\S]*<div class="page-header-actions">/, 'GitOps page should use the standard page header')
  assert.match(gitopsSource, /class="application-toolbar-icon-btn"[\s\S]*SearchOutlined/, 'GitOps search entry should be the standard icon button')
  assert.match(gitopsSource, /component-search-overlay[\s\S]*placeholder="实例编码 \/ 名称 \/ 工作目录"/, 'GitOps should use a floating keyword search overlay')
  assert.match(gitopsSource, /class="component-toolbar-select"[\s\S]*状态 · 全部[\s\S]*class="component-toolbar-query-btn"/, 'GitOps secondary filters should live in the header action strip')
  assert.match(gitopsSource, /class="gitops-unified-layout"/, 'GitOps page should use the unified module layout')
  assert.match(gitopsSource, /class="gitops-resource-list gitops-instance-list"/, 'GitOps instances should use the custom resource list')
  assert.match(gitopsSource, /class="gitops-detail-panel"/, 'GitOps detail should use custom detail panels')
  assert.match(gitopsSource, /class="gitops-status-instance-picker"[\s\S]*placeholder="选择 GitOps 实例"[\s\S]*@change="handleStatusInstanceChange"/, 'GitOps status detail should be driven by an explicit instance picker')
  assert.match(gitopsSource, /const matched = response\.data\.find\(\(item\) => item\.id === current\)[\s\S]*selectedInstance\.value = matched \|\| null[\s\S]*selectedInstanceID\.value = matched\?\.id \|\| ''/, 'GitOps should not auto-select the first instance before the user chooses one')
  assert.match(gitopsSource, /description="请选择 GitOps 实例后查看仓库状态"/, 'GitOps status area should stay empty until an instance is selected')
  assert.match(gitopsSource, /class="gitops-health-panel"[\s\S]*class="gitops-health-strip"[\s\S]*路径状态[\s\S]*仓库状态[\s\S]*工作区状态[\s\S]*class="gitops-repo-grid"[\s\S]*远端仓库[\s\S]*当前分支[\s\S]*最新提交[\s\S]*提交说明/, 'GitOps status and repo details should use one compact health panel')
  assert.match(gitopsSource, /class="gitops-state-token"[\s\S]*class="gitops-state-token"[\s\S]*class="gitops-state-token"/, 'GitOps health states should use compact tokens instead of full-width status tags')
  assert.match(gitopsSource, /v-if="instanceTotal > instanceFilters\.pageSize"[\s\S]*class="gitops-compact-pager"/, 'GitOps pagination should only show when there is another page')
  assert.match(gitopsSource, /wrap-class-name="component-instance-modal-wrap gitops-instance-modal-wrap"/, 'GitOps instance modal should use the shared modal shell')
  assert.match(gitopsSource, /class="application-toolbar-action-btn component-instance-modal-save-btn"[\s\S]*保存/, 'GitOps modal save action should live in the titlebar')
  assert.doesNotMatch(gitopsSource, /fallback = matched \|\| response\.data\[0\]|gitops-health-pill[\s\S]*<a-tag|gitops-health-heading[\s\S]*<a-tag|gitops-status-row|gitops-status-grid|gitops-status-card--summary|gitops-repo-card|gitops-resource-card--selected|gitops-resource-card:hover|transition:\s*border-color|transform:\s*translateY|toolbar-card|<a-table|a-table-column|<a-pagination|show-size-changer|page-size-options|component-management-table|gitops-table|component-instance-form-note::before|type="primary"|ok-text="保存"|cancel-text="取消"|@ok="handleSaveInstance"|confirm-loading/, 'GitOps should not auto-select, keep long health tags, split status/repo cards, selected card effects, old toolbar cards, Ant tables, full pagination, vertical rules, primary buttons or default modal actions')

  const cardShellRule = extractStyleRule(gitopsSource, '.table-card')
  assert.doesNotMatch(cardShellRule, /overflow:\s*hidden/, 'GitOps list shell should not clip rounded card edges')

  const modalRule = extractStyleRule(gitopsSource, '.component-instance-modal-wrap :deep(.ant-modal-content)')
  assert.match(modalRule, /border-radius:\s*24px/, 'GitOps modal should use the standard rounded shell')
  assert.match(modalRule, /backdrop-filter:\s*blur\(18px\) saturate\(180%\)/, 'GitOps modal should use glass treatment')
})

test('argocd management follows custom list, action and modal standards', () => {
  assert.match(argocdSource, /<div class="page-header">[\s\S]*<div class="page-title">编排<\/div>/, 'ArgoCD page should use the standard page header')
  assert.match(argocdSource, /class="argocd-unified-layout"/, 'ArgoCD page should use the unified module layout')
  assert.match(argocdSource, /class="argocd-resource-list argocd-instance-list"/, 'ArgoCD instances should use the custom resource list')
  assert.match(argocdSource, /class="argocd-binding-list"/, 'ArgoCD bindings should use the custom binding list')
  assert.match(argocdSource, /v-if="instanceTotal > instanceFilters\.pageSize"[\s\S]*class="argocd-compact-pager"/, 'ArgoCD instance pagination should only show when there is another page')
  assert.match(argocdSource, /class="application-toolbar-action-btn"[\s\S]*新增实例/, 'ArgoCD create action should use the shared toolbar button')
  assert.match(argocdSource, /wrap-class-name="component-instance-modal-wrap argocd-instance-modal-wrap"/, 'ArgoCD instance modal should use the shared modal shell')
  assert.match(argocdSource, /class="application-toolbar-action-btn component-instance-modal-save-btn"[\s\S]*保存/, 'ArgoCD modal save action should live in the titlebar')
  assert.doesNotMatch(argocdSource, /argocd-module--applications|argocd-application-filter|ArgoCD 应用/, 'ArgoCD applications should live on a standalone page')
  assert.doesNotMatch(argocdSource, /toolbar-card|section-alert|<a-alert|<a-table|a-table-column|<a-pagination|show-size-changer|page-size-options|argocd-integrated-table|component-inline-note|component-toolbar-query-btn|argocd-resource-card::before|argocd-binding-row::before|component-instance-form-note::before|type="primary"|ok-text="保存"|cancel-text="取消"|@ok="handleSaveInstance"|confirm-loading/, 'ArgoCD should not keep old cards, block alerts, Ant tables, full pagination, query buttons, vertical rules, primary buttons or default modal actions')

  const cardShellRule = extractStyleRule(argocdSource, '.table-card')
  assert.doesNotMatch(cardShellRule, /overflow:\s*hidden/, 'ArgoCD list shell should not clip rounded card edges')

  const modalRule = extractStyleRule(argocdSource, '.component-instance-modal-wrap :deep(.ant-modal-content)')
  assert.match(modalRule, /border-radius:\s*24px/, 'ArgoCD modal should use the standard rounded shell')
  assert.match(modalRule, /backdrop-filter:\s*blur\(18px\) saturate\(180%\)/, 'ArgoCD modal should use glass treatment')
})

test('argocd applications live on a standalone page', () => {
  assert.match(routerSource, /const ArgoCDApplicationManagementView = \(\) => import\('\.\.\/views\/component\/ArgoCDApplicationManagementView\.vue'\)/, 'Router should lazy-load the standalone ArgoCD applications page')
  assert.match(routerSource, /path:\s*'\/components\/argocd\/applications'[\s\S]*name:\s*'argocd-application-management'[\s\S]*component:\s*ArgoCDApplicationManagementView/, 'Router should expose a standalone ArgoCD applications route')
  assert.match(layoutSource, /route\.path\.startsWith\('\/components\/argocd\/applications'\)[\s\S]*return \['argocd-application-management'\]/, 'Sidebar should activate the application menu item before the generic ArgoCD route')
  assert.match(layoutSource, /function goToArgoCDApplications\(\)[\s\S]*router\.push\('\/components\/argocd\/applications'\)/, 'Sidebar should navigate to the standalone ArgoCD applications route')
  assert.match(layoutSource, /key="argocd-application-management"[\s\S]*@click="goToArgoCDApplications"[\s\S]*ArgoCD应用/, 'Sidebar should include an ArgoCD application entry')

  assert.match(argocdApplicationsSource, /<div class="page-title">ArgoCD 应用<\/div>/, 'Applications page should have its own title')
  assert.match(argocdApplicationsSource, /class="argocd-resource-list argocd-application-list"/, 'Applications page should use the custom application list')
  assert.match(argocdApplicationsSource, /class="argocd-instance-picker"[\s\S]*placeholder="选择 ArgoCD 实例"[\s\S]*@change="handleApplicationInstanceChange"/, 'Applications page should ask for the instance first')
  assert.match(argocdApplicationsSource, /class="argocd-application-picker"[\s\S]*:disabled="!appFilters\.argocd_instance_id"[\s\S]*placeholder="先选择实例后选择应用"/, 'Application picker should be disabled until an instance is selected')
  assert.match(argocdApplicationsSource, /if \(!appFilters\.argocd_instance_id\) \{[\s\S]*appDataSource\.value = \[\][\s\S]*appTotal\.value = 0[\s\S]*return[\s\S]*\}/, 'Applications page should stay empty until an instance is selected')
  assert.match(argocdApplicationsSource, /Promise\.all\(\[loadInstances\(\), loadApplicationPickerOptions\(\)\]\)/, 'Applications page should preload selector data but not the list')
  assert.match(argocdApplicationsSource, /v-if="appTotal > appFilters\.pageSize"[\s\S]*class="argocd-compact-pager"/, 'Applications page pagination should only show when there is another page')
  assert.match(argocdApplicationsSource, /<a-drawer :open="detailVisible" width="720" title="ArgoCD 应用详情"/, 'Applications page should own the details drawer')
  assert.doesNotMatch(argocdApplicationsSource, /argocd-module-header|argocd-module-kicker|argocd-module-title|argocd-module-meta|01 · 应用列表|<a-table|a-table-column|<a-pagination|show-size-changer|page-size-options|argocd-integrated-table|component-toolbar-query-btn|argocd-resource-card::before/, 'Applications page should not reintroduce duplicate module headers, Ant tables, full pagination, query buttons or vertical rules')
})
