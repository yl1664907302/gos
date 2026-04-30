import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewURL = new URL('../src/views/release/ReleaseOrderListView.vue', import.meta.url)
const source = readFileSync(viewURL, 'utf8')

function extractStyleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  assert.ok(match, `expected to find style rule for ${selector}`)
  return match[1]
}

test('release overview current focus copy avoids duplicated refresh and splits headline from hint', () => {
  assert.doesNotMatch(
    source,
    /return `最近刷新：\$\{lastLoadedAt\.value\}`/,
    'refreshText should only return the timestamp because the template owns the label',
  )
  assert.match(
    source,
    /const spotlightHeadline = computed/,
    'current focus should expose a short headline instead of one long repeated sentence',
  )
  assert.match(
    source,
    /const spotlightHint = computed/,
    'current focus should expose a secondary hint for non-repeated guidance',
  )
  assert.match(
    source,
    /return "最新发布";/,
    'default current focus headline should focus on latest releases',
  )
  assert.match(
    source,
    /return "展示当前筛选条件下最近创建的发布单";/,
    'default current focus hint should explain latest release focus',
  )
  assert.match(
    source,
    /<div class="overview-spotlight-text">\{\{ spotlightHeadline \}\}<\/div>/,
    'spotlight headline should render as the primary current focus text',
  )
  assert.match(
    source,
    /<div class="overview-spotlight-hint">\{\{ spotlightHint \}\}<\/div>/,
    'spotlight hint should render separately from the primary text',
  )
  assert.match(
    source,
    /<span>最近刷新<\/span>\s*<strong>\{\{ refreshText \}\}<\/strong>/,
    'refresh meta should render label and value separately',
  )
  assert.doesNotMatch(
    source,
    /最近刷新：\{\{ refreshText \}\}/,
    'template should not concatenate a second refresh label',
  )
})

test('release overview current focus shows latest two clickable order numbers', () => {
  assert.match(
    source,
    /const spotlightOrderItems = ref/,
    'current focus should store latest focused orders separately from the visible page list',
  )
  assert.match(
    source,
    /const spotlightOrders = computed\(\(\) =>\s*spotlightOrderItems\.value/,
    'current focus should derive order links from the dedicated latest focused orders',
  )
  assert.match(
    source,
    /sort\(\(left,\s*right\) => dayjs\(right\.created_at\)\.valueOf\(\) - dayjs\(left\.created_at\)\.valueOf\(\)\)/,
    'current focus order links should keep latest release orders first',
  )
  assert.match(
    source,
    /\.slice\(0,\s*2\)/,
    'current focus should only show the latest two order numbers',
  )
  assert.match(
    source,
    /<div v-if="spotlightOrders\.length" class="overview-spotlight-orders">/,
    'current focus should render an order number block when matching orders exist',
  )
  assert.match(
    source,
    /v-for="item in spotlightOrders"/,
    'current focus should render each latest order link from spotlightOrders',
  )
  assert.match(
    source,
    /class="overview-spotlight-order-link"[\s\S]*@click="toDetail\(item\.id\)"[\s\S]*\{\{ item\.orderNo \}\}/,
    'current focus order number should click through to the release order detail page',
  )
})

test('release overview current focus fetches default latest orders without status filter', () => {
  assert.match(
    source,
    /const spotlightOrderQueryStatus = computed<ReleaseOrderStatus \| "">/,
    'current focus should map the current focus state to a list query status',
  )
  assert.match(
    source,
    /const spotlightOrderQueryStatus = computed<ReleaseOrderStatus \| "">\(\(\) => \{\s*if \(activeQuery\.status\) \{\s*return activeQuery\.status;\s*\}\s*return "";\s*\}\);/,
    'default latest focus should not apply any status filter',
  )
  assert.match(
    source,
    /async function loadSpotlightOrders\(options\?: \{ silent\?: boolean \}\)/,
    'current focus should fetch latest focused orders separately',
  )
  assert.match(
    source,
    /status:\s*spotlightOrderQueryStatus\.value \|\| undefined/,
    'latest focused order query should use the mapped focus status',
  )
  assert.match(
    source,
    /page_size:\s*2/,
    'latest focused order query should request only two order numbers',
  )
  assert.match(
    source,
    /await loadSpotlightOrders\(\{ silent: options\?\.silent \}\)/,
    'overview refresh should refresh the latest focused order links after stats determine the default focus',
  )
})

test('release order list keeps staged build action labeled as only-build', () => {
  assert.match(
    source,
    /case "build":\s*return "仅构建";/,
    'build dispatch action text should stay explicit as only-build',
  )
  assert.match(
    source,
    /v-if="canBuild\(record\)"[\s\S]*@click="openExecutePreviewModal\(record, 'build'\)"[\s\S]*>\s*仅构建\s*<\/a-button>/,
    'single release order action should render the only-build button for staged orders',
  )
  assert.doesNotMatch(
    source,
    /v-if="canBuild\(record\)"[\s\S]*@click="openExecutePreviewModal\(record, 'build'\)"[\s\S]*>\s*构建\s*<\/a-button>/,
    'single release order action should not regress to the ambiguous build label',
  )
})

test('release order list uses publish label to continue cd after only-build', () => {
  assert.match(
    source,
    /case "deploy":\s*return "发布";/,
    'CD continuation should use publish wording because it releases the built artifact',
  )
  assert.match(
    source,
    /v-else-if="canDeploy\(record\)"[\s\S]*@click="openExecutePreviewModal\(record, 'deploy'\)"[\s\S]*>\s*发布\s*<\/a-button>/,
    'built-waiting-deploy orders should render a publish button that dispatches deploy/CD',
  )
  assert.doesNotMatch(
    source,
    /v-else-if="canDeploy\(record\)"[\s\S]*@click="openExecutePreviewModal\(record, 'deploy'\)"[\s\S]*>\s*部署\s*<\/a-button>/,
    'CD continuation should not show a separate deploy wording in the row action',
  )
  assert.match(
    source,
    /v-else-if="canExecute\(record\)"[\s\S]*@click="openExecutePreviewModal\(record\)"[\s\S]*>\s*发布\s*<\/a-button>/,
    'normal publish action should be mutually exclusive with only-build and CD continuation actions',
  )
})

test('release overview chart removes duplicated total bar and uses compact chart geometry', () => {
  const loadOverviewStatsSource = source.match(
    /async function loadOverviewStats[\s\S]*?\n}\n\nasync function loadSpotlightOrders/,
  )?.[0]
  const handleSearchSource = source.match(
    /function handleSearch\(\) \{[\s\S]*?\n}\n\nfunction handleReset/,
  )?.[0]
  const handleResetSource = source.match(
    /function handleReset\(\) \{[\s\S]*?\n}\n\nfunction toggleAdvancedSearch/,
  )?.[0]
  assert.ok(loadOverviewStatsSource, 'expected to find loadOverviewStats function block')
  assert.ok(handleSearchSource, 'expected to find handleSearch function block')
  assert.ok(handleResetSource, 'expected to find handleReset function block')
  assert.doesNotMatch(
    source,
    /function currentOverviewQueryKey/,
    'overview chart stats should use a fixed global cache key instead of active filters',
  )
  assert.match(
    source,
    /const nextKey = "global-release-overview";/,
    'overview chart stats should be cached as a global release overview',
  )
  assert.match(
    loadOverviewStatsSource,
    /const stats = await getReleaseOrderStats\(\{\s*page:\s*1,\s*page_size:\s*1,\s*\}\);/,
    'overview chart stats should fetch global totals without active query filters',
  )
  assert.doesNotMatch(
    loadOverviewStatsSource,
    /activeQuery\./,
    'overview chart stats request should not depend on activeQuery filters',
  )
  assert.doesNotMatch(
    handleSearchSource,
    /loadOverviewStats/,
    'condition search should not refresh global overview chart stats',
  )
  assert.doesNotMatch(
    handleResetSource,
    /loadOverviewStats/,
    'condition reset should not refresh global overview chart stats',
  )
  assert.match(
    handleSearchSource,
    /void loadSpotlightOrders\(\);/,
    'condition search should still refresh the current focus order links',
  )
  assert.match(
    handleResetSource,
    /void loadSpotlightOrders\(\);/,
    'condition reset should still refresh the current focus order links',
  )
  assert.match(
    source,
    /<div class="overview-chart-title">全部发布单状态分布<\/div>/,
    'overview chart title should state it is a global distribution',
  )
  assert.match(
    source,
    /<div class="overview-chart-footnote">统计口径：汇总全部发布单状态数量<\/div>/,
    'overview chart footnote should not mention current filter conditions',
  )
  assert.match(
    source,
    /const labels = \["待处理", "执行中", "失败", "成功"\]/,
    'chart should focus on status distribution without a total bar',
  )
  assert.doesNotMatch(
    source,
    /const labels = \[[^\]]*"总数"/,
    'chart should not duplicate the total value already shown in the card meta',
  )
  assert.match(
    source,
    /const values = \[stats\.pending, stats\.running, stats\.failed, stats\.success\]/,
    'chart values should align with the compact status-only labels',
  )
  assert.match(source, /top:\s*16/, 'compact chart should reduce top grid padding')
  assert.match(source, /bottom:\s*0/, 'compact chart should reduce bottom grid padding')
  assert.match(source, /barWidth:\s*"34%"/, 'compact chart should use narrower bars')
})

test('release overview layout uses compact chart and current focus sizing', () => {
  const overviewBarRule = extractStyleRule('.overview-bar')
  assert.match(
    overviewBarRule,
    /grid-template-columns:\s*minmax\(0,\s*1\.15fr\)\s*minmax\(240px,\s*0\.85fr\)/,
    'overview layout should make the current focus card narrower than the chart',
  )
  assert.match(overviewBarRule, /gap:\s*14px/, 'overview layout should use a tighter gap')

  const chartPanelRule = extractStyleRule('.overview-chart-panel')
  assert.match(chartPanelRule, /min-height:\s*236px/, 'chart panel should be shorter')
  assert.match(chartPanelRule, /border-radius:\s*20px/, 'chart panel should use compact rounded corners')
  assert.match(chartPanelRule, /padding:\s*18px/, 'chart panel should use compact padding')

  const chartCanvasRule = extractStyleRule('.overview-chart-canvas')
  assert.match(chartCanvasRule, /height:\s*142px/, 'chart canvas should be reduced in height')

  const spotlightRule = extractStyleRule('.overview-spotlight')
  assert.match(spotlightRule, /min-height:\s*236px/, 'current focus card should match compact chart height')
  assert.match(spotlightRule, /justify-content:\s*space-between/, 'current focus card should distribute short content cleanly')
  assert.match(spotlightRule, /padding:\s*18px/, 'current focus card should use compact padding')

  const spotlightIconOrbRule = extractStyleRule('.overview-spotlight-icon-orb')
  assert.match(spotlightIconOrbRule, /width:\s*64px/, 'current focus status orb should be large enough for the card proportion')
  assert.match(spotlightIconOrbRule, /height:\s*64px/, 'current focus status orb should keep a balanced square shape')
  assert.match(spotlightIconOrbRule, /border-radius:\s*20px/, 'current focus status orb should keep proportional rounded corners')

  const spotlightIconRule = extractStyleRule('.overview-spotlight-icon')
  assert.match(spotlightIconRule, /font-size:\s*28px/, 'current focus status icon should scale with the larger orb')

  const spotlightLabelRule = extractStyleRule('.overview-spotlight-label')
  assert.match(spotlightLabelRule, /padding-right:\s*92px/, 'current focus label should leave room for the larger status icon')

  const spotlightTextRule = extractStyleRule('.overview-spotlight-text')
  assert.match(spotlightTextRule, /padding-right:\s*92px/, 'current focus headline should leave room for the larger status icon')

  const spotlightHintRule = extractStyleRule('.overview-spotlight-hint')
  assert.match(spotlightHintRule, /font-size:\s*13px/, 'current focus hint should stay visually secondary')
  assert.match(spotlightHintRule, /padding-right:\s*88px/, 'current focus hint should leave room for the larger status icon')

  const spotlightOrdersRule = extractStyleRule('.overview-spotlight-orders')
  assert.match(spotlightOrdersRule, /margin-top:\s*12px/, 'current focus order block should stay close to the hint')

  const spotlightOrderLinksRule = extractStyleRule('.overview-spotlight-order-links')
  assert.match(spotlightOrderLinksRule, /flex-direction:\s*column/, 'current focus order numbers should render one per line')
  assert.match(spotlightOrderLinksRule, /align-items:\s*flex-start/, 'current focus order chips should not stretch across the card')

  const spotlightOrderLinkRule = extractStyleRule('.overview-spotlight-order-link')
  assert.match(spotlightOrderLinkRule, /border-radius:\s*999px/, 'current focus order links should render as compact chips')
  assert.match(spotlightOrderLinkRule, /cursor:\s*pointer/, 'current focus order chips should be visibly clickable')

  const spotlightMetaRule = extractStyleRule('.overview-spotlight-meta')
  assert.match(spotlightMetaRule, /display:\s*flex/, 'current focus meta should group refresh details as chips')
  assert.match(spotlightMetaRule, /gap:\s*8px/, 'current focus meta chips should keep compact spacing')
})
