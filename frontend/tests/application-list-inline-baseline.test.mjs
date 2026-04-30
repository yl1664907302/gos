import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const listViewURL = new URL('../src/views/application/ApplicationListView.vue', import.meta.url)
const createViewURL = new URL('../src/views/application/ApplicationCreateView.vue', import.meta.url)
const bindingViewURL = new URL('../src/views/application/ApplicationPipelineBindingView.vue', import.meta.url)
const routerURL = new URL('../src/router/index.ts', import.meta.url)
const source = readFileSync(listViewURL, 'utf8')
const createSource = readFileSync(createViewURL, 'utf8')
const bindingSource = readFileSync(bindingViewURL, 'utf8')
const routerSource = readFileSync(routerURL, 'utf8')

test('application detail page route is removed', () => {
  assert.doesNotMatch(routerSource, /ApplicationDetailView/, 'router should not lazy-load the removed detail page')
  assert.doesNotMatch(routerSource, /name:\s*'application-detail'/, 'router should not expose application detail route')
  assert.doesNotMatch(routerSource, /path:\s*'\/applications\/:id'/, 'bare application id route should be removed')
})

test('application flows do not navigate to the removed detail page', () => {
  assert.match(
    createSource,
    /message\.success\('应用创建成功'\)[\s\S]*router\.push\('\/applications'\)/,
    'application create success should return to the application list because detail page is removed',
  )
  assert.doesNotMatch(
    createSource,
    /router\.push\(\{[\s\S]*path:\s*`\/applications\/\$\{response\.data\.id\}`/,
    'application create success should not navigate to the removed bare detail route',
  )
  assert.match(
    bindingSource,
    /function goBack\(\)[\s\S]*router\.push\('\/applications'\)/,
    'pipeline binding back action should return to the application list because detail page is removed',
  )
  assert.doesNotMatch(
    bindingSource,
    /router\.push\(`\/applications\/\$\{applicationID\.value\}`\)/,
    'pipeline binding back action should not navigate to the removed bare detail route',
  )
})

test('application cards open baseline information from the title into a right drawer', () => {
  assert.doesNotMatch(source, /function toDetail/, 'application list should not navigate to the deleted detail page')
  assert.doesNotMatch(source, /router\.push\(`\/applications\/\$\{id\}`\)/, 'application name should not push to detail route')
  assert.match(
    source,
    /class="workbench-app-title"[\s\S]*@click="openApplicationInfoDrawer\(card\.application\)"/,
    'application name should open the right-side information drawer',
  )
  assert.doesNotMatch(source, /class="workbench-app-inline-expand"/, 'application card should not add a separate info button')
  assert.doesNotMatch(source, /DownOutlined/, 'application card should not render the removed info trigger icon')
  assert.doesNotMatch(source, /toggleCardCollapsed/, 'application card should not keep inline expansion state')
  assert.match(source, /baselineInfoRows\(selectedApplication\)/, 'drawer should render application baseline rows')
  assert.match(source, /sortedGitOpsMappings\(selectedApplication\)/, 'drawer should render sorted GitOps mapping information')
  assert.match(source, /selectedApplication\.release_branches/, 'drawer should render release branch information')
})

test('application manage menu links release templates with the current application filter', () => {
  assert.match(source, /function toTemplates\(id: string\)/, 'application list should keep a dedicated template navigation action')
  assert.match(source, /path: '\/release-templates'[\s\S]*query: \{ application_id: id \}/, 'template navigation should include the current application id as a query filter')
  assert.match(source, /@click="toTemplates\(card\.application\.id\)"[\s\S]*查看模版/, 'manage menu should call the filtered template navigation from each card')
})

test('application baseline drawer follows the pipeline binding detail drawer style', () => {
  assert.match(
    source,
    /<a-drawer :open="applicationInfoDrawerVisible" title="应用信息" width="640" @close="closeApplicationInfoDrawer">/,
    'application info should use a plain right drawer',
  )
  assert.match(
    source,
    /<a-descriptions v-if="selectedApplication" :column="1" bordered>/,
    'application info drawer should use bordered single-column descriptions',
  )
  assert.doesNotMatch(source, /class="workbench-card-inline-baseline"/, 'application card should not render inline baseline info')
  assert.doesNotMatch(source, /class="workbench-baseline-table"/, 'baseline information should not use the old compact inline table')
  assert.doesNotMatch(source, /class="workbench-baseline-modules"/, 'GitOps and release branches should not render as inline card modules')
  assert.doesNotMatch(source, /class="workbench-card-inline-env"/, 'template should not use the old env-only expanded card view')
  assert.doesNotMatch(source, /class="workbench-card-inline-env"/, 'expanded baseline view should not restore the old env switch layout')
})

test('application cards keep release detail as an inline card action next to release', () => {
  assert.match(
    source,
    /<a-button class="workbench-primary-action" type="primary" :disabled="!card\.releaseReady" @click="toRelease\(card\.application\.id\)">发布<\/a-button>[\s\S]*<a-button\s+class="workbench-primary-action workbench-release-detail-trigger"\s+type="primary"[\s\S]*@click="handleReleaseDetailAction\(card\)"[\s\S]*>\s*<template #icon>[\s\S]*<AimOutlined \/>[\s\S]*<\/template>[\s\S]*{{ releaseDetailActionText\(card\) }}[\s\S]*<\/a-button>/,
    'release detail button should stay next to the publish action and use the same primary color',
  )
  assert.match(
    source,
    /<transition name="workbench-card-detail-switch" mode="out-in">[\s\S]*v-if="!isReleaseDetailCard\(card\.application\.id\)"[\s\S]*class="workbench-card-view workbench-card-summary-view"[\s\S]*class="workbench-card-collapsed-summary workbench-card-release-summary"[\s\S]*v-else[\s\S]*class="workbench-card-view workbench-card-release-detail"/,
    'release detail should replace the full summary view inside the current card with an out-in animation',
  )
  assert.doesNotMatch(source, /<transition name="workbench-release-detail">/, 'release detail should not be appended below the summary')
  assert.match(source, /releaseDetailEnvText\(card\)/, 'release detail should show the active environment as the compact header')
  assert.match(
    source,
    /const selectedReleaseEnvByApplication = ref<Record<string, string>>\(\{\}\)/,
    'release detail should keep selected environment state per application',
  )
  assert.match(
    source,
    /function selectedReleaseSection\(card: WorkbenchCard\)/,
    'release detail should resolve content from the selected environment',
  )
  assert.match(
    source,
    /function canSwitchReleaseEnv\(card: WorkbenchCard\)/,
    'release detail should only expose the switch action when multiple environments are available',
  )
  assert.match(
    source,
    /v-if="canSwitchReleaseEnv\(card\)"[\s\S]*@click="switchReleaseEnv\(card\)"[\s\S]*>\s*切换\s*<\/a-button>/,
    'release detail should render a compact switch action before release records for multi-environment cards',
  )
  assert.match(source, /生效：{{ releaseDetailCurrentOrderNo\(card\) }}/, 'release detail should show the current effective release order chip')
  assert.match(source, /最近：{{ releaseDetailLatestOrderNo\(card\) }}/, 'release detail should show the latest release order chip')
  assert.match(source, /releaseDetailCurrentOrderID\(card\)/, 'release detail should link current live release order ids')
  assert.match(source, /releaseDetailLatestOrderID\(card\)/, 'release detail should link latest release order ids')
  assert.match(source, />发布单<\/a-button>/, 'release detail should keep the compact production release-record action')
  assert.match(source, />返回<\/a-button>/, 'release detail should keep the compact production return action')
  assert.doesNotMatch(source, /当前生效发布单/, 'release detail should not use the newer multi-section panel copy')
  assert.doesNotMatch(source, /全部发布单/, 'release detail should not use the newer expanded-panel action copy')
  assert.match(source, /toReleaseRecords\(card\.application\.id\)/, 'release detail should keep access to all release records')
  assert.doesNotMatch(source, /详情[\s\S]{0,120}openApplicationInfoDrawer/, 'release detail should not open the application info drawer')
})

test('application baseline drawer renders branch collections as compact tables', () => {
  assert.match(source, /const gitOpsEnvOrder = \['dev', 'test', 'prod'\]/, 'GitOps mappings should define the preferred environment order')
  assert.match(source, /function sortedGitOpsMappings\(application: Application\)/, 'GitOps mappings should be sorted before rendering')
  assert.match(source, /class="application-info-mini-table application-info-mini-table-gitops"/, 'GitOps mappings should render as a compact table')
  assert.match(source, /class="application-info-mini-table application-info-mini-table-release"/, 'release branches should render as a compact table')
  assert.match(source, /class="application-info-mini-table-scroll"/, 'multi-value tables should constrain height when values grow')
  assert.match(source, />环境</, 'GitOps table should label the environment column')
  assert.match(source, />名称</, 'release branch table should label the name column')
  assert.match(source, />分支</, 'branch tables should label the branch column')
  assert.doesNotMatch(source, /class="application-info-list"/, 'branch collections should not render as a plain text list')
})
