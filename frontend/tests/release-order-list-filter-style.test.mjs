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

test('release order quick status and env filters use dedicated toolbar filter button classes', () => {
  assert.match(
    source,
    /class="release-toolbar-action-btn release-toolbar-action-btn--primary release-quick-filter-trigger-btn"[\s\S]*release-quick-filter-trigger-btn--active': statusExpanded \|\| Boolean\(filters\.status\)/,
    'status filter trigger should reuse the same primary toolbar button shell as the top-right header action',
  )
  assert.match(
    source,
    /class="release-toolbar-action-btn release-quick-filter-chip-btn"[\s\S]*release-quick-filter-chip-btn--active': filters\.status === item\.value/,
    'status filter options should use the dedicated toolbar filter chip class',
  )
  assert.match(
    source,
    /class="release-toolbar-action-btn release-toolbar-action-btn--primary release-quick-filter-trigger-btn"[\s\S]*release-quick-filter-trigger-btn--active': envExpanded \|\| Boolean\(currentEnvFilter\)/,
    'env filter trigger should reuse the same primary toolbar button shell as the top-right header action',
  )
  assert.match(
    source,
    /class="release-toolbar-action-btn release-quick-filter-chip-btn"[\s\S]*release-quick-filter-chip-btn--active': currentEnvFilter === item\.value/,
    'env filter options should use the dedicated toolbar filter chip class',
  )
})

test('release order quick filter triggers match the top-right primary button while chips stay lightweight', () => {
  const triggerRule = extractStyleRule('.release-quick-filter-trigger-btn')
  assert.match(triggerRule, /min-width:\s*126px/, 'quick filter triggers should keep enough width to match the header action button silhouette')
  assert.match(triggerRule, /padding-inline:\s*16px/, 'quick filter triggers should keep the same horizontal padding rhythm as the header action button')

  const triggerActiveRule = extractStyleRule('.release-quick-filter-trigger-btn--active')
  assert.match(triggerActiveRule, /0 12px 26px rgba\(59,\s*130,\s*246,\s*0\.12\)\s*!important/, 'quick filter triggers should use the same raised emphasis as the correct header action button')

  const chipRule = extractStyleRule('.release-quick-filter-chip-btn')
  assert.match(chipRule, /border:\s*1px solid rgba\(148,\s*163,\s*184,\s*0\.22\)\s*!important/, 'quick filter chips should keep the visible neutral glass border from the spec')
  assert.match(chipRule, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.62\)\s*!important/, 'quick filter chips should keep the lighter glass background')
  assert.match(chipRule, /color:\s*#0f172a\s*!important/, 'quick filter chips should use the shared dark text color instead of blue text')
  assert.match(chipRule, /font-weight:\s*700/, 'quick filter chips should use the documented 700 weight')

  const chipActiveRule = extractStyleRule('.release-quick-filter-chip-btn--active')
  assert.match(chipActiveRule, /background:\s*rgba\(239,\s*246,\s*255,\s*0\.78\)\s*!important/, 'quick filter active chip state should only lightly tint the glass background')
  assert.match(chipActiveRule, /color:\s*#0f172a\s*!important/, 'quick filter active chip state should not switch to blue text')
})
