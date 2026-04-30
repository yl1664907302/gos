import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewURL = new URL('../src/views/system/SystemPermissionView.vue', import.meta.url)
const source = readFileSync(viewURL, 'utf8')

function extractStyleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  return match?.[1] || ''
}

test('permission page uses standardized toolbar user select', () => {
  assert.match(
    source,
    /<div class="page-header-actions">[\s\S]*<a-select[\s\S]*class="permission-toolbar-user-select"[\s\S]*show-search[\s\S]*option-filter-prop="label"[\s\S]*placeholder="选择授权用户"/,
    'permission user selector should live in the header actions and expose the standardized toolbar select class',
  )
  assert.doesNotMatch(
    source,
    /class="user-select"/,
    'permission page should not keep the old bare user select hook',
  )

  const selectorRule = extractStyleRule(':deep(.permission-toolbar-user-select.ant-select .ant-select-selector)')
  assert.match(selectorRule, /height:\s*42px/, 'permission user select should match toolbar button height')
  assert.match(selectorRule, /border-radius:\s*16px\s*!important/, 'permission user select should use toolbar radius')
  assert.match(selectorRule, /align-items:\s*center/, 'permission user select content should be vertically centered')
  assert.match(
    selectorRule,
    /background:\s*rgba\(255,\s*255,\s*255,\s*0\.62\)\s*!important/,
    'permission user select should use the shared glass background',
  )

  const placeholderRule = extractStyleRule(':deep(.permission-toolbar-user-select.ant-select .ant-select-selection-placeholder)')
  assert.match(placeholderRule, /display:\s*flex/, 'permission user select placeholder should use flex alignment')
  assert.match(placeholderRule, /align-items:\s*center/, 'permission user select placeholder should be vertically centered')
  assert.match(placeholderRule, /height:\s*100%/, 'permission user select placeholder should fill the selector height')
  assert.match(placeholderRule, /line-height:\s*1\s*!important/, 'permission user select placeholder should avoid baseline drift')

  const inputRule = extractStyleRule(':deep(.permission-toolbar-user-select.ant-select .ant-select-selection-search-input)')
  assert.match(inputRule, /height:\s*100%\s*!important/, 'permission user select search input should fill selector height')
  assert.match(inputRule, /line-height:\s*42px\s*!important/, 'permission user select search input should align with toolbar height')
})

test('permission content uses a structural wrapper instead of an outer card', () => {
  assert.match(
    source,
    /class="permission-content-panel"[\s\S]*class="permission-section permission-section--global"[\s\S]*class="permission-matrix"/,
    'global permissions should live in one permission matrix area',
  )
  assert.match(
    source,
    /class="permission-module-row"[\s\S]*class="permission-check-pill"/,
    'permission modules should render as rows with compact permission pills',
  )
  assert.match(
    source,
    /class="permission-section permission-section--applications"[\s\S]*class="permission-app-permission-list"[\s\S]*class="permission-app-row"/,
    'application release permissions should be part of the same unified panel',
  )
  assert.doesNotMatch(source, /class="group-card"/, 'permission modules should not render as separate card shells')
  assert.doesNotMatch(source, /class="app-release-permission-card"/, 'application permissions should not keep a separate card shell')
  assert.doesNotMatch(source, /<a-table/, 'application release permissions should not use a mismatched table inside the panel')

  const panelRule = extractStyleRule('.permission-content-panel')
  assert.match(panelRule, /border:\s*none/, 'permission content wrapper should not draw an outer border')
  assert.match(panelRule, /background:\s*transparent/, 'permission content wrapper should not draw an outer background')
  assert.match(panelRule, /box-shadow:\s*none/, 'permission content wrapper should not draw an outer shadow')
  assert.match(panelRule, /padding:\s*0/, 'permission content wrapper should not add card padding')
  assert.match(panelRule, /overflow:\s*visible/, 'permission content wrapper should not clip its child rows like a card')
  assert.doesNotMatch(panelRule, /border-radius:\s*24px/, 'permission content wrapper should not keep a rounded card shell')
  assert.doesNotMatch(panelRule, /linear-gradient/, 'permission content wrapper should not keep the old gradient card shell')

  const moduleRowRule = extractStyleRule('.permission-module-row')
  assert.match(moduleRowRule, /grid-template-columns:\s*180px minmax\(0,\s*1fr\)/, 'permission module rows should align label and permissions on one grid')

  const pillRule = extractStyleRule(':deep(.permission-check-pill.ant-checkbox-wrapper)')
  assert.match(pillRule, /border-radius:\s*14px/, 'permission pills should use compact rounded controls')
  assert.match(pillRule, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.62\)/, 'permission pills should share the same light glass surface')
})

test('permission content removes Chinese subtitle copy', () => {
  assert.doesNotMatch(source, /class="permission-section-title"/, 'permission section should not render Chinese subtitle headings')
  assert.doesNotMatch(source, /模块权限|应用发布权限/, 'permission section subtitle copy should be removed')
  assert.doesNotMatch(source, /class="permission-module-count"/, 'module rows should not render Chinese count subtitles')
  assert.doesNotMatch(source, /class="permission-app-desc"/, 'application rows should not render Chinese helper subtitles')
  assert.doesNotMatch(source, /class="permission-app-count"/, 'application rows should not render Chinese selected-count subtitles')
  assert.doesNotMatch(source, /class="save-tip"/, 'permission panel should not render the Chinese helper tip')
  assert.doesNotMatch(source, /项权限|选择该应用允许发布的环境|已选 \{\{|可选环境始终跟随/, 'Chinese subtitle strings should not remain in the template')
})
