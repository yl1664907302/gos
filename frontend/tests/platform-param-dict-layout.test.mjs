import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewURL = new URL('../src/views/application/PlatformParamDictView.vue', import.meta.url)
const source = readFileSync(viewURL, 'utf8')

function extractStyleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  return match?.[1] || ''
}

test('platform param dict page moves filters into the header toolbar', () => {
  assert.match(source, /class="page-header-card page-header platform-param-page-header"/, 'platform param header should expose a dedicated transparent header class')
  assert.match(source, /class="page-header-actions platform-param-header-actions"/, 'platform param filters should live in the header actions area')
  assert.equal((source.match(/class="platform-param-toolbar-search"/g) || []).length, 2, 'platform param page should expose key and name toolbar search fields')
  assert.match(source, /class="platform-param-toolbar-select"/, 'platform param status filter should use toolbar select styling')
  assert.match(source, /class="platform-param-toolbar-query-btn"[\s\S]*>\s*查询\s*<\/a-button>/, 'platform param page should keep the query action in the header toolbar')
  assert.match(source, /class="application-toolbar-action-btn platform-param-create-btn"/, 'platform param create action should reuse the shared header button shell')
  assert.doesNotMatch(source, /type="primary"[\s\S]*新增标准字段/, 'platform param create action should not use the old primary button style')
  assert.doesNotMatch(source, /<a-card class="filter-card"/, 'platform param page should not keep the old filter card')
  assert.doesNotMatch(source, />\s*重置\s*<\/a-button>/, 'platform param page should not keep the old reset button')

  const headerRule = extractStyleRule('.platform-param-page-header')
  assert.match(headerRule, /background:\s*transparent\s*!important/, 'platform param header should remove the old card background')
  assert.match(headerRule, /box-shadow:\s*none\s*!important/, 'platform param header should remove the old card shadow')
  assert.match(headerRule, /border:\s*none\s*!important/, 'platform param header should remove the old card border')
})

test('platform param toolbar controls use the current glass style', () => {
  const actionsRule = extractStyleRule('.platform-param-header-actions')
  assert.match(actionsRule, /flex-wrap:\s*nowrap/, 'platform param header actions should stay on one row at desktop widths')

  const inputWrapperRule = extractStyleRule(':deep(.platform-param-toolbar-search.ant-input-affix-wrapper)')
  assert.match(inputWrapperRule, /width:\s*176px/, 'platform param search wrappers should use a fixed desktop width instead of stretching full row')
  assert.match(inputWrapperRule, /flex:\s*none/, 'platform param search wrappers should behave like compact toolbar items')

  const inputRule = extractStyleRule(':deep(.platform-param-toolbar-search.ant-input)')
  assert.match(inputRule, /height:\s*42px/, 'platform param search inputs should match the toolbar height')
  assert.match(inputRule, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.62\)\s*!important/, 'platform param search inputs should use the glass background')
  assert.match(inputRule, /color:\s*#1e3a8a/, 'platform param search inputs should use the shared toolbar text tone')

  const placeholderRule = extractStyleRule(':deep(.platform-param-toolbar-search.ant-input::placeholder)')
  assert.match(placeholderRule, /color:\s*rgba\(30,\s*58,\s*138,\s*0\.38\)/, 'platform param search placeholders should use the muted toolbar tone')

  const selectRule = extractStyleRule(':deep(.platform-param-toolbar-select .ant-select-selector)')
  assert.match(selectRule, /height:\s*42px/, 'platform param select shell should match the toolbar height')
  assert.match(selectRule, /align-items:\s*center/, 'platform param select shell should vertically center its content')

  const buttonRule = extractStyleRule(':deep(.application-toolbar-action-btn.ant-btn),\n:deep(.platform-param-toolbar-query-btn.ant-btn)')
  assert.match(buttonRule, /color:\s*#0f172a\s*!important/, 'platform param toolbar buttons should use the documented dark text color')

  const buttonHoverRule = extractStyleRule(':deep(.application-toolbar-action-btn.ant-btn:hover),\n:deep(.application-toolbar-action-btn.ant-btn:focus),\n:deep(.application-toolbar-action-btn.ant-btn:focus-visible),\n:deep(.platform-param-toolbar-query-btn.ant-btn:hover),\n:deep(.platform-param-toolbar-query-btn.ant-btn:focus),\n:deep(.platform-param-toolbar-query-btn.ant-btn:focus-visible)')
  assert.match(buttonHoverRule, /color:\s*#0f172a\s*!important/, 'platform param toolbar buttons should keep the same dark text color on hover/focus')
})

test('platform param table uses the current management table theme without an outer white card', () => {
  assert.doesNotMatch(source, /<a-card class="table-card"/, 'platform param table should not be wrapped in a white card')
  assert.match(source, /class="platform-param-table-section"/, 'platform param table should use a structural section wrapper')
  assert.match(source, /class="platform-param-table"/, 'platform param table should expose a dedicated styling hook')
  assert.doesNotMatch(source, /dataIndex: 'updated_at'/, 'low-frequency update time should move out of the primary platform param list')

  const tableHeadRule = extractStyleRule('.platform-param-table :deep(.ant-table-thead > tr > th)')
  assert.match(tableHeadRule, /linear-gradient\(180deg,\s*#243247,\s*#1f2a3d\)/, 'platform param table header should use the dark management-table gradient')

  const actionColumnRule = extractStyleRule('.platform-param-table :deep(.ant-table-cell-fix-right)')
  assert.match(actionColumnRule, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.96\)/, 'platform param fixed operation column should keep an opaque background')
})

test('platform param editor uses the button dialog shell instead of the default modal footer', () => {
  assert.match(source, /const platformParamFormViewportInset = ref\(0\)/, 'platform param modal should track the live content inset')
  assert.match(source, /const platformParamFormMaskStyle = computed\(\(\) => \(\{[\s\S]*background: 'rgba\(15,\s*23,\s*42,\s*0\.08\)'[\s\S]*backdropFilter: 'blur\(10px\)'/, 'platform param modal should use the light blurred content-area mask')
  assert.match(source, /const platformParamFormWrapProps = computed\(\(\) => \(\{[\s\S]*left: `\$\{platformParamFormViewportInset\.value\}px`[\s\S]*width: `calc\(100% - \$\{platformParamFormViewportInset\.value\}px\)`/, 'platform param modal wrap should stay inside the main content area')
  assert.match(source, /platformParamFormViewportObserver/, 'platform param modal should keep its offset in sync with the sider width')
  assert.match(source, /:closable="false"/, 'platform param modal should remove the default close icon')
  assert.match(source, /:footer="null"/, 'platform param modal should remove the default footer actions')
  assert.match(source, /:destroy-on-close="true"/, 'platform param modal should destroy itself after close')
  assert.match(source, /:after-close="handleFormAfterClose"/, 'platform param modal should clean up state after the close transition')
  assert.match(source, /:mask-style="platformParamFormMaskStyle"/, 'platform param modal should apply the constrained content-area mask')
  assert.match(source, /:wrap-props="platformParamFormWrapProps"/, 'platform param modal should constrain its wrap to the content area')
  assert.match(source, /wrap-class-name="platform-param-form-modal-wrap"/, 'platform param modal should expose a dedicated shell class')
  assert.match(source, /<template #title>[\s\S]*class="platform-param-form-modal-titlebar"[\s\S]*class="application-toolbar-action-btn platform-param-form-modal-save-btn"[\s\S]*>\s*保存\s*<\/a-button>/, 'platform param modal should move the save action into the title bar')
  assert.doesNotMatch(source, /@ok="submitForm"/, 'platform param modal should not rely on the default ok handler')
  assert.doesNotMatch(source, /confirm-loading="submitting"/, 'platform param modal should not keep the default footer loading state')
  assert.match(source, /<a-form[\s\S]*:required-mark="false"[\s\S]*class="platform-param-form"/, 'platform param modal should disable default required stars')
  assert.match(source, /v-if="modalMode === 'create'"[\s\S]*class="platform-param-form-note"/, 'platform param create modal should render a lightweight note block')
  assert.match(source, /平台手动新增的标准字段默认都是非内置字段/, 'platform param create modal should keep the create note copy')
  assert.doesNotMatch(source, /class="modal-alert"/, 'platform param modal should not keep the old alert card shell')

  const modalContentRule = extractStyleRule('.platform-param-form-modal-wrap :deep(.ant-modal-content)')
  assert.match(modalContentRule, /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.68\)/, 'platform param modal shell should use the glass border')
  assert.match(modalContentRule, /backdrop-filter:\s*blur\(18px\) saturate\(180%\)/, 'platform param modal shell should use the documented glass blur')

  const titlebarRule = extractStyleRule('.platform-param-form-modal-titlebar')
  assert.match(titlebarRule, /justify-content:\s*space-between/, 'platform param modal title bar should place the save button on the right')

  const saveButtonRule = extractStyleRule('.platform-param-form-modal-save-btn.ant-btn')
  assert.match(saveButtonRule, /flex:\s*none/, 'platform param modal save action should only add layout constraints on top of the shared button shell')
  assert.match(saveButtonRule, /font-size:\s*14px/, 'platform param modal save action should reset inherited title typography')
  assert.match(saveButtonRule, /font-weight:\s*700/, 'platform param modal save action should keep the documented 700 weight')
})

test('platform param detail hero card groups identity, summary, and facts into clearer sections', () => {
  assert.match(source, /class="detail-hero-topline"/, 'platform param detail hero should expose a dedicated top line for identity and status')
  assert.match(source, /class="detail-hero-facts"/, 'platform param detail hero should group summary facts into a grid')
  assert.match(source, /class="detail-hero-fact detail-hero-fact--key"/, 'platform param detail hero should give the standard key its own fact card')
  assert.match(source, /class="detail-hero-fact-value detail-hero-fact-value--code"/, 'platform param detail hero should present the standard key with code emphasis')
  assert.match(source, /class="ability-tags detail-hero-ability-tags"/, 'platform param detail hero should keep ability tags inside a dedicated fact block')
  assert.doesNotMatch(source, /class="detail-hero-key"/, 'platform param detail hero should not keep the old loose key row')
  assert.match(source, /v-if="detailData\.description"/, 'platform param detail hero should only render the description block when there is real content')
  assert.doesNotMatch(source, /暂无字段说明/, 'platform param detail hero should not inject a fallback sentence when description is intentionally empty')

  const factsRule = extractStyleRule('.detail-hero-facts')
  assert.match(factsRule, /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/, 'platform param detail hero facts should use a three-column summary grid on desktop')

  const factRule = extractStyleRule('.detail-hero-fact')
  assert.match(factRule, /padding:\s*14px 16px/, 'platform param detail hero facts should use compact inner cards for scanning')

  const toplineRule = extractStyleRule('.detail-hero-topline')
  assert.match(toplineRule, /justify-content:\s*space-between/, 'platform param detail hero topline should separate identity and status')
})
