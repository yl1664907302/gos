import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewURL = new URL('../src/views/application/ProjectManagementView.vue', import.meta.url)
const source = readFileSync(viewURL, 'utf8')

function extractStyleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  return match?.[1] || ''
}

test('project management page moves search into the header toolbar', () => {
  assert.match(source, /class="page-header-actions project-header-actions"/, 'project search should live in header actions')
  assert.match(source, /class="project-toolbar-search"/, 'project name search should use toolbar input styling')
  assert.match(source, /class="project-toolbar-query-btn"[\s\S]*>\s*查询\s*<\/a-button>/, 'query should be a header toolbar action')
  assert.match(source, /class="application-toolbar-action-btn project-create-btn"/, 'create action should reuse the toolbar button shell')
  assert.doesNotMatch(source, /type="primary"[\s\S]*新增项目/, 'create action should not use the blue primary button style')
  assert.doesNotMatch(source, /<a-card class="filter-card"/, 'project page should not keep the old filter card')
  assert.doesNotMatch(source, />\s*重置\s*<\/a-button>/, 'project toolbar should not keep the old reset button')

  const headerRule = extractStyleRule('.project-page-header')
  assert.match(headerRule, /background:\s*transparent\s*!important/, 'project header should remove the card background')
  assert.match(headerRule, /box-shadow:\s*none\s*!important/, 'project header should remove the card shadow')
  assert.match(headerRule, /border:\s*none\s*!important/, 'project header should remove the card border')
})

test('project management toolbar controls use the current glass style', () => {
  const inputRule = extractStyleRule(':deep(.project-toolbar-search.ant-input)')
  assert.match(inputRule, /height:\s*42px/, 'project search input should match toolbar height')
  assert.match(inputRule, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.62\)\s*!important/, 'project search input should use the glass background')
  assert.match(inputRule, /color:\s*#1e3a8a/, 'project search input text should use the toolbar blue')

  const placeholderRule = extractStyleRule(':deep(.project-toolbar-search.ant-input::placeholder)')
  assert.match(placeholderRule, /color:\s*rgba\(30,\s*58,\s*138,\s*0\.38\)/, 'project search placeholder should use muted text')

  assert.match(source, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.62\)\s*!important/, 'project toolbar actions should force the non-blue glass button background')

  const buttonRule = extractStyleRule(':deep(.application-toolbar-action-btn.ant-btn),\n:deep(.project-toolbar-query-btn.ant-btn)')
  assert.match(buttonRule, /color:\s*#0f172a\s*!important/, 'project toolbar actions should use the same dark text color as other pages')

  const buttonHoverRule = extractStyleRule(':deep(.application-toolbar-action-btn.ant-btn:hover),\n:deep(.application-toolbar-action-btn.ant-btn:focus),\n:deep(.application-toolbar-action-btn.ant-btn:focus-visible),\n:deep(.project-toolbar-query-btn.ant-btn:hover),\n:deep(.project-toolbar-query-btn.ant-btn:focus),\n:deep(.project-toolbar-query-btn.ant-btn:focus-visible)')
  assert.match(buttonHoverRule, /color:\s*#0f172a\s*!important/, 'project toolbar actions should keep the same dark text color on hover/focus')
})

test('project management table uses the current management table theme without an outer white card', () => {
  assert.doesNotMatch(source, /<a-card class="table-card"/, 'project table should not be wrapped in a white card')
  assert.match(source, /class="project-table-section"/, 'project table should use a structural section wrapper')
  assert.match(source, /class="project-table"/, 'project table should expose a dedicated styling hook')

  const tableHeadRule = extractStyleRule('.project-table :deep(.ant-table-thead > tr > th)')
  assert.match(tableHeadRule, /linear-gradient\(180deg,\s*#243247,\s*#1f2a3d\)/, 'project table header should use the dark management-table gradient')

  const actionColumnRule = extractStyleRule('.project-table :deep(.ant-table-tbody > tr > td:last-child)')
  assert.match(actionColumnRule, /background:\s*rgba\(255,\s*255,\s*255,\s*0\.96\)/, 'project operation column should keep an opaque background')
})

test('project create and edit modals use the button dialog shell and edit readonly context', () => {
  assert.match(source, /const projectFormViewportInset = ref\(0\)/, 'project modal should track the live content inset')
  assert.match(source, /const projectFormMaskStyle = computed\(\(\) => \(\{[\s\S]*background: 'rgba\(15,\s*23,\s*42,\s*0\.08\)'[\s\S]*backdropFilter: 'blur\(10px\)'/, 'project modal should use the light blurred content-area mask')
  assert.match(source, /const projectFormWrapProps = computed\(\(\) => \(\{[\s\S]*left: `\$\{projectFormViewportInset\.value\}px`[\s\S]*width: `calc\(100% - \$\{projectFormViewportInset\.value\}px\)`/, 'project modal wrap should stay inside the main content area')
  assert.match(source, /projectFormViewportObserver/, 'project modal should keep its offset in sync with the sider width')
  assert.match(source, /const isEditMode = computed\(\(\) => Boolean\(editingId\.value\)\)/, 'project modal should expose explicit edit-mode state')
  assert.match(source, /const projectReadonlyFields = computed/, 'project edit modal should prepare readonly context rows')
  assert.match(source, /当前项目名称[\s\S]*项目 Key/, 'project edit modal readonly context should include the current project name and key')
  assert.match(source, /:closable="false"/, 'project modal should remove the default close icon')
  assert.match(source, /:footer="null"/, 'project modal should remove the default footer actions')
  assert.match(source, /:destroy-on-close="true"/, 'project modal should destroy itself after close')
  assert.match(source, /:after-close="handleFormAfterClose"/, 'project modal should clean up state after the close transition')
  assert.match(source, /:mask-style="projectFormMaskStyle"/, 'project modal should apply the constrained content-area mask')
  assert.match(source, /:wrap-props="projectFormWrapProps"/, 'project modal should constrain its wrap to the content area')
  assert.match(source, /wrap-class-name="project-form-modal-wrap"/, 'project modal should expose a dedicated shell class')
  assert.match(source, /<template #title>[\s\S]*class="project-form-modal-titlebar"[\s\S]*class="application-toolbar-action-btn project-form-modal-save-btn"[\s\S]*>\s*保存\s*<\/a-button>/, 'project modal should move the save action into the title bar')
  assert.doesNotMatch(source, /@ok="submitForm"/, 'project modal should not rely on the default ok handler')
  assert.doesNotMatch(source, /confirm-loading="saving"/, 'project modal should not keep the default footer loading state')
  assert.match(source, /<a-form[\s\S]*:required-mark="false"[\s\S]*class="project-form"/, 'project modal should disable default required stars')
  assert.match(source, /v-if="isEditMode"[\s\S]*class="project-form-note"/, 'project edit modal should show a readonly note block')
  assert.match(source, /编辑态保留项目 Key 为只读标识，避免项目归属标识被误改/, 'project edit modal note should keep the readonly explanation text')
  assert.doesNotMatch(source, /编辑态保留项目 Key 为只读标识，避免项目归属标识被误改。/, 'project edit modal note should not end with a full stop')
  assert.match(source, /v-if="isEditMode"[\s\S]*class="project-form-panel project-form-panel--context"/, 'project edit modal should render a readonly context panel')
  assert.match(source, /class="project-form-context"/, 'project edit modal should render the readonly context grid')
  assert.match(source, /v-if="!isEditMode"[\s\S]*项目 Key/, 'project key should remain editable only in create mode')
  assert.doesNotMatch(source, /v-model:value="form\.key"[\s\S]*v-if="isEditMode"/, 'project key should not remain editable in edit mode')

  const modalContentRule = extractStyleRule('.project-form-modal-wrap :deep(.ant-modal-content)')
  assert.match(modalContentRule, /rgba\(34,\s*197,\s*94,\s*0\.08\)/, 'project modal shell should include the green glow')
  assert.match(modalContentRule, /rgba\(59,\s*130,\s*246,\s*0\.08\)/, 'project modal shell should include the blue glow')
  assert.match(modalContentRule, /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.68\)/, 'project modal shell should use the glass border')

  const titlebarRule = extractStyleRule('.project-form-modal-titlebar')
  assert.match(titlebarRule, /justify-content:\s*space-between/, 'project modal title bar should place the save button on the right')

  const saveButtonRule = extractStyleRule('.project-form-modal-save-btn.ant-btn')
  assert.match(saveButtonRule, /flex:\s*none/, 'project modal save action should only add layout constraints on top of the shared button shell')

  const contextRule = extractStyleRule('.project-form-context')
  assert.match(contextRule, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/, 'project edit modal context block should use a two-column grid')
})
