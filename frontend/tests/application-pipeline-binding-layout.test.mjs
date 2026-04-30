import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewURL = new URL('../src/views/application/ApplicationPipelineBindingView.vue', import.meta.url)
const source = readFileSync(viewURL, 'utf8')

function extractStyleRule(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'))
  assert.ok(match, `expected to find style rule for ${selector}`)
  return match[1]
}

test('pipeline binding page root keeps a stacked flow layout', () => {
  const rule = extractStyleRule('.pipeline-binding-page')

  assert.match(rule, /display:\s*flex\s*;/, 'pipeline binding page should use flex layout to avoid stretched grid rows')
  assert.match(rule, /flex-direction:\s*column\s*;/, 'pipeline binding page should stack hero and module cards vertically')
  assert.match(
    rule,
    /gap:\s*var\(--space-6\)\s*;/,
    'pipeline binding page should use the same title-to-content spacing as the application card pages',
  )
  assert.doesNotMatch(rule, /display:\s*grid\s*;/, 'pipeline binding page should not use grid at the root level')
})

test('pipeline binding page reuses shared application-page primitives', () => {
  assert.match(source, /class="page-title"/, 'pipeline binding page should reuse the shared page title class')
  assert.match(source, /<a-empty class="binding-module-empty">/, 'pipeline binding empty state should use ant empty per style spec')
})

test('pipeline binding cards keep metadata concise', () => {
  assert.match(source, /class="binding-module-meta"/, 'pipeline binding cards should collapse provider, trigger, and status into one concise line')
  assert.match(source, /class="binding-module-updated-tag"/, 'pipeline binding cards should surface updated time beside the binding status bubble')
  assert.doesNotMatch(source, /binding-module-summary-text/, 'pipeline binding cards should not include the old long explanatory paragraph')
  assert.doesNotMatch(source, /<dt>绑定类型<\/dt>/, 'pipeline binding cards should not repeat the binding type inside the detail facts')
  assert.doesNotMatch(source, /<dt>更新时间<\/dt>/, 'pipeline binding cards should not keep updated time as a separate detail fact row')
})

test('pipeline binding action buttons reuse the toolbar button visual shell', () => {
  assert.match(source, /class="binding-module-toolbar-btn"/, 'pipeline binding card actions should use the shared glass button shell')
  assert.doesNotMatch(source, /binding-module-empty-btn/, 'pipeline binding empty cards should not render an inline add-binding CTA')
})

test('pipeline binding modal separates edit context from editable fields', () => {
  const modalBlockMatch = source.match(/<a-modal[\s\S]*?@cancel="closeFormModal"[\s\S]*?<\/a-modal>/)
  assert.ok(modalBlockMatch, 'expected to find the pipeline binding form modal block')
  const modalBlock = modalBlockMatch[0]
  const modalContentRule = extractStyleRule('.binding-form-modal-wrap :deep(.ant-modal-content)')
  const modalContentBeforeRule = extractStyleRule('.binding-form-modal-wrap :deep(.ant-modal-content)::before')
  const titlebarRule = extractStyleRule('.binding-form-modal-titlebar')
  const modalTitleRule = extractStyleRule('.binding-form-modal-wrap :deep(.ant-modal-title)')
  const modalTitleTextRule = extractStyleRule('.binding-form-modal-title')
  const saveButtonRule = extractStyleRule('.binding-form-modal-save-btn.ant-btn')
  const buttonShellRule = extractStyleRule(
    ':deep(.application-toolbar-action-btn.ant-btn),\n.binding-module-toolbar :deep(.binding-module-toolbar-btn.ant-btn)',
  )
  const buttonHoverRule = extractStyleRule(
    ':deep(.application-toolbar-action-btn.ant-btn:hover),\n:deep(.application-toolbar-action-btn.ant-btn:focus),\n:deep(.application-toolbar-action-btn.ant-btn:focus-visible),\n:deep(.application-toolbar-action-btn.ant-btn:active),\n.binding-module-toolbar :deep(.binding-module-toolbar-btn.ant-btn:hover),\n.binding-module-toolbar :deep(.binding-module-toolbar-btn.ant-btn:focus),\n.binding-module-toolbar :deep(.binding-module-toolbar-btn.ant-btn:focus-visible),\n.binding-module-toolbar :deep(.binding-module-toolbar-btn.ant-btn:active)',
  )
  const noteRule = extractStyleRule('.binding-form-note')
  const noteAccentRule = extractStyleRule('.binding-form-note::before')
  const panelRule = extractStyleRule('.binding-form-panel')
  const panelTitleAfterRule = extractStyleRule('.binding-form-panel-title::after')
  const requiredTagRule = extractStyleRule('.binding-form-required-tag')
  const controlRule = extractStyleRule('.binding-form :deep(.ant-input),\n.binding-form :deep(.ant-select-selector)')
  const contextItemRule = extractStyleRule('.binding-form-context-item')

  assert.match(
    source,
    /绑定类型和提供方在编辑态下保持只读，如需切换请删除当前绑定后重新创建。/,
    'pipeline binding edit modal should explain immutable context before editable fields',
  )
  assert.match(
    source,
    /class="binding-form-note"/,
    'pipeline binding edit modal should keep the lightweight note block',
  )
  assert.match(
    modalBlock,
    /:closable="false"/,
    'pipeline binding modal should remove the default close icon from the top right corner',
  )
  assert.match(
    modalBlock,
    /:footer="null"/,
    'pipeline binding modal should remove the default footer so the bottom cancel button is not rendered',
  )
  assert.match(
    source,
    /:mask-style="bindingFormMaskStyle"/,
    'pipeline binding modal should soften and blur the page mask so the glass effect is visible',
  )
  assert.match(
    source,
    /:wrap-props="bindingFormWrapProps"/,
    'pipeline binding modal should constrain the dialog wrap to the content area so the menu is not covered',
  )
  assert.match(
    source,
    /left:\s*`\$\{bindingFormViewportInset\.value\}px`/,
    'pipeline binding modal mask should offset itself by the live sider width',
  )
  assert.match(
    source,
    /width:\s*`calc\(100% - \$\{bindingFormViewportInset\.value\}px\)`/,
    'pipeline binding modal mask and wrap should only cover the main content area',
  )
  assert.match(
    source,
    /background:\s*'rgba\(15,\s*23,\s*42,\s*0\.08\)'/,
    'pipeline binding modal mask should stay light enough for the glass dialog to remain visible',
  )
  assert.match(
    source,
    /backdropFilter:\s*'blur\(10px\)'/,
    'pipeline binding modal mask should keep only a light blur so the page stays readable underneath',
  )
  assert.match(
    source,
    /bindingFormViewportObserver/,
    'pipeline binding modal should observe layout size changes so the content-area offset stays in sync with the sider',
  )
  assert.match(
    source,
    /wrap-class-name="binding-form-modal-wrap"/,
    'pipeline binding modal should use a dedicated shell class for the polished dialog effect',
  )
  assert.match(
    modalBlock,
    /class="binding-form-modal-titlebar"/,
    'pipeline binding modal should render a custom title bar layout',
  )
  assert.match(
    modalBlock,
    /class="application-toolbar-action-btn binding-form-modal-save-btn"/,
    'pipeline binding modal should move the save action into the title bar and reuse the shared header action button shell',
  )
  assert.match(
    modalBlock,
    /:destroy-on-close="true"/,
    'pipeline binding modal should destroy itself after close so stale overlay wrappers do not block the page',
  )
  assert.match(
    modalBlock,
    /:after-close="handleFormAfterClose"/,
    'pipeline binding modal should clean up form state only after the close transition finishes',
  )
  assert.doesNotMatch(modalBlock, /ok-text="保存"/, 'pipeline binding modal should not keep the default footer save action')
  assert.doesNotMatch(modalBlock, /cancel-text="取消"/, 'pipeline binding modal should not keep the default footer cancel action')
  assert.match(
    source,
    /class="binding-form-panel"/,
    'pipeline binding modal should keep readonly and editable content grouped by section',
  )
  assert.match(
    source,
    /:required-mark="false"/,
    'pipeline binding modal should disable the default asterisk required mark',
  )
  assert.match(
    source,
    /class="binding-form-required-tag"/,
    'pipeline binding modal should use a required tag instead of the default asterisk',
  )
  assert.match(
    source,
    /pointerEvents:\s*formVisible\.value\s*\?\s*'auto'\s*:\s*'none'/,
    'pipeline binding modal mask and wrap should release pointer events as soon as the dialog closes',
  )
  assert.match(
    titlebarRule,
    /justify-content:\s*space-between\s*;/,
    'pipeline binding modal title bar should place the save button at the far right',
  )
  assert.match(
    saveButtonRule,
    /flex:\s*none\s*;/,
    'pipeline binding modal save action should only add layout constraints on top of the shared header button shell',
  )
  assert.match(
    source,
    /:deep\(\.application-toolbar-action-btn\.ant-btn\),\s*\n\.binding-module-toolbar :deep\(\.binding-module-toolbar-btn\.ant-btn\)/,
    'pipeline binding modal save action should reuse the same visual button primitive as the page header actions',
  )
  assert.doesNotMatch(
    modalTitleRule,
    /font-size:\s*22px\s*;/,
    'pipeline binding modal should not apply the oversized title typography to the whole title container because it also contains the save button',
  )
  assert.match(
    modalTitleTextRule,
    /font-size:\s*22px\s*;/,
    'pipeline binding modal should keep the large title typography on the title text itself',
  )
  assert.match(
    modalTitleTextRule,
    /font-weight:\s*800\s*;/,
    'pipeline binding modal should keep the bold title weight on the title text itself',
  )
  assert.match(
    saveButtonRule,
    /font-size:\s*14px\s*;/,
    'pipeline binding modal save action should reset inherited title typography so it matches the page header action buttons',
  )
  assert.match(
    saveButtonRule,
    /font-weight:\s*700\s*;/,
    'pipeline binding modal save action should keep the documented 700 weight instead of downgrading the shared button shell',
  )
  assert.match(
    buttonShellRule,
    /border:\s*1px solid rgba\(148,\s*163,\s*184,\s*0\.22\)\s*!important\s*;/,
    'pipeline binding shared action buttons should keep a visible neutral border instead of an almost invisible white edge',
  )
  assert.match(
    buttonShellRule,
    /background:\s*rgba\(255,\s*255,\s*255,\s*0\.62\)\s*!important\s*;/,
    'pipeline binding shared action buttons should use the documented glass background behind the visible border',
  )
  assert.match(
    buttonShellRule,
    /font-weight:\s*700\s*;/,
    'pipeline binding shared action buttons should use the documented 700 weight',
  )
  assert.match(
    buttonHoverRule,
    /border-color:\s*rgba\(59,\s*130,\s*246,\s*0\.32\)\s*!important\s*;/,
    'pipeline binding shared action buttons should keep the same bordered hover state as the documented glass shell',
  )
  assert.match(
    buttonShellRule,
    /color:\s*#0f172a\s*!important\s*;/,
    'pipeline binding shared action buttons should use the documented dark text color',
  )
  assert.match(
    buttonHoverRule,
    /color:\s*#0f172a\s*!important\s*;/,
    'pipeline binding shared action buttons should keep the same dark text color on hover and focus',
  )
  assert.match(
    source,
    /class="binding-form-context"/,
    'pipeline binding edit modal should render a readonly context block for immutable fields',
  )
  assert.match(
    source,
    /v-if="formMode === 'create'"[\s\S]*?<template #label>[\s\S]*?绑定类型[\s\S]*?class="binding-form-required-tag"/,
    'pipeline binding create modal should keep binding type editable only in create mode and render the required tag in its custom label',
  )
  assert.match(
    modalContentRule,
    /rgba\(34,\s*197,\s*94,\s*0\.08\)/,
    'pipeline binding modal should reuse the pipeline binding card green glow in the dialog shell background',
  )
  assert.match(
    modalContentRule,
    /rgba\(59,\s*130,\s*246,\s*0\.08\)/,
    'pipeline binding modal should reuse the pipeline binding card blue glow in the dialog shell background',
  )
  assert.match(
    modalContentRule,
    /rgba\(255,\s*255,\s*255,\s*0\.98\)/,
    'pipeline binding modal should reuse the pipeline binding card light base background in the dialog shell',
  )
  assert.match(
    modalContentRule,
    /0 32px 90px rgba\(15,\s*23,\s*42,\s*0\.18\)/,
    'pipeline binding modal shell should add the elevated outer shadow effect',
  )
  assert.match(
    modalContentRule,
    /backdrop-filter:\s*blur\(18px\)\s*saturate\(180%\)\s*;/,
    'pipeline binding modal shell should match the application search bar blur value on the edit dialog',
  )
  assert.match(
    modalContentBeforeRule,
    /linear-gradient\(135deg,\s*rgba\(255,\s*255,\s*255,\s*0\.62\),\s*rgba\(255,\s*255,\s*255,\s*0\.16\)/,
    'pipeline binding modal shell should keep a neutral glass highlight overlay on top of the shared card background',
  )
  assert.match(
    noteRule,
    /padding:\s*0 0 0 14px\s*;/,
    'pipeline binding modal note should use inline spacing instead of the old card shell container',
  )
  assert.match(
    panelRule,
    /padding:\s*0\s*;/,
    'pipeline binding modal panels should remove the old card shell container',
  )
  assert.doesNotMatch(
    noteRule,
    /background:|border:|box-shadow:|border-radius:/,
    'pipeline binding modal note should not render a card background shell',
  )
  assert.doesNotMatch(
    panelRule,
    /background:|border:|box-shadow:|border-radius:/,
    'pipeline binding modal panels should not render a card background shell',
  )
  assert.match(
    noteAccentRule,
    /linear-gradient\(180deg,\s*rgba\(245,\s*158,\s*11,\s*0\.42\),\s*rgba\(251,\s*191,\s*36,\s*0\.16\)\)/,
    'pipeline binding modal note should switch to the same warm accent family without restoring a background card',
  )
  assert.match(
    panelTitleAfterRule,
    /height:\s*1px\s*;/,
    'pipeline binding modal section titles should add a trailing divider line for rhythm',
  )
  assert.match(
    panelTitleAfterRule,
    /linear-gradient\(90deg,\s*rgba\(203,\s*213,\s*225,\s*0\.78\),\s*rgba\(226,\s*232,\s*240,\s*0\)\)/,
    'pipeline binding modal section titles should fade the divider line into the background',
  )
  assert.match(
    requiredTagRule,
    /rgba\(239,\s*246,\s*255,\s*0\.96\)/,
    'pipeline binding modal required tags should use the light tag background',
  )
  assert.match(
    controlRule,
    /background:\s*transparent\s*!important\s*;/,
    'pipeline binding modal fields should remove the filled background and use a transparent control surface',
  )
  assert.match(
    controlRule,
    /border-color:\s*rgba\(203,\s*213,\s*225,\s*0\.88\)\s*!important\s*;/,
    'pipeline binding modal fields should use the light neutral border from the general-card form style',
  )
  assert.match(
    contextItemRule,
    /padding:\s*0 0 10px\s*;/,
    'pipeline binding readonly context items should keep a lightweight text-only spacing rhythm',
  )
  assert.match(
    contextItemRule,
    /border-bottom:\s*1px dashed rgba\(226,\s*232,\s*240,\s*0\.92\)\s*;/,
    'pipeline binding readonly context items should use a subtle dashed separator instead of nested mini-cards',
  )
  assert.doesNotMatch(
    contextItemRule,
    /background:|border-radius:/,
    'pipeline binding readonly context items should not render nested mini-card shells',
  )
  assert.match(source, /label: '手动触发'/, 'pipeline binding trigger mode options should use readable Chinese labels')
  assert.match(source, /label: 'Webhook 触发'/, 'pipeline binding trigger mode should keep webhook in readable form')
  assert.match(source, /label: '启用'/, 'pipeline binding status options should use readable Chinese labels')
  assert.match(source, /label: '停用'/, 'pipeline binding status options should include the inactive label')
})

test('pipeline binding empty states render text-only guidance', () => {
  const emptyRule = extractStyleRule('.binding-module-empty :deep(.ant-empty-image)')

  assert.doesNotMatch(source, /binding-module-empty-visual/, 'pipeline binding empty states should not render decorative icons')
  assert.match(source, /class="binding-module-empty-description"/, 'pipeline binding empty states should keep the text guidance block')
  assert.match(emptyRule, /display:\s*none\s*;/, 'pipeline binding empty states should hide the default ant-empty illustration')
})

test('pipeline binding module icons use the shared light shell style', () => {
  const iconRule = extractStyleRule('.binding-module-icon')
  const ciIconRule = extractStyleRule('.binding-module-icon--ci')
  const cdIconRule = extractStyleRule('.binding-module-icon--cd')

  assert.match(
    iconRule,
    /background:\s*linear-gradient\(180deg,\s*rgba\(255,\s*255,\s*255,\s*0\.96\),\s*rgba\(248,\s*250,\s*252,\s*0\.9\)\)\s*;/,
    'pipeline binding module icons should reuse the light shell background',
  )
  assert.match(
    iconRule,
    /border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.82\)\s*;/,
    'pipeline binding module icons should use the same light shell border language',
  )
  assert.doesNotMatch(
    ciIconRule,
    /background:/,
    'pipeline binding CI icon should rely on the shared shell instead of a standalone green fill',
  )
  assert.doesNotMatch(
    cdIconRule,
    /background:/,
    'pipeline binding CD icon should rely on the shared shell instead of a standalone blue fill',
  )
})

test('pipeline binding cards use a content-first layout with a dedicated footer toolbar', () => {
  const cardRule = extractStyleRule('.binding-module-card')
  const footerRule = extractStyleRule('.binding-module-footer')
  const toolbarRule = extractStyleRule('.binding-module-toolbar')
  const toolbarButtonRule = extractStyleRule('.binding-module-toolbar :deep(.ant-btn)')

  assert.match(
    cardRule,
    /height:\s*auto\s*;/,
    'pipeline binding cards should grow with content instead of clipping into a fixed height',
  )
  assert.match(
    cardRule,
    /min-height:\s*320px\s*;/,
    'pipeline binding cards should keep a larger baseline height while still allowing more content',
  )
  assert.match(
    cardRule,
    /padding:\s*20px 20px 18px\s*;/,
    'pipeline binding cards should use roomier outer padding',
  )
  assert.match(
    cardRule,
    /rgba\(255,\s*255,\s*255,\s*0\.98\)/,
    'pipeline binding cards should keep a light card shell tone',
  )
  assert.doesNotMatch(
    cardRule,
    /rgba\(2,\s*6,\s*23,\s*0\.98\)/,
    'pipeline binding cards should not fall back to the old dark shell tone',
  )
  assert.doesNotMatch(
    source,
    /\.binding-module-card::before\s*\{/,
    'pipeline binding cards should not use the old top accent line shell',
  )
  assert.doesNotMatch(
    source,
    /\.binding-module-card--ci::before\s*\{/,
    'pipeline binding CI cards should not render a dedicated top accent line',
  )
  assert.doesNotMatch(
    source,
    /\.binding-module-card--cd::before\s*\{/,
    'pipeline binding CD cards should not render a dedicated top accent line',
  )
  assert.match(
    footerRule,
    /margin-top:\s*auto\s*;/,
    'pipeline binding cards should pin actions into a dedicated footer area',
  )
  assert.match(
    toolbarRule,
    /display:\s*grid\s*;/,
    'pipeline binding toolbar should use grid to keep wrapped trigger elements aligned',
  )
  assert.match(
    toolbarRule,
    /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)\s*;/,
    'pipeline binding toolbar should place the four desktop actions in one row',
  )
  assert.match(
    toolbarButtonRule,
    /height:\s*36px\s*;/,
    'pipeline binding toolbar buttons should use the smaller compact height',
  )
})

test('pipeline binding grid stretches cards wider on large screens', () => {
  const gridRule = extractStyleRule('.binding-module-grid')

  assert.match(
    gridRule,
    /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*;/,
    'pipeline binding grid should let both cards stretch instead of locking them to 420px',
  )
  assert.match(
    gridRule,
    /width:\s*min\(100%,\s*1120px\)\s*;/,
    'pipeline binding grid should use a wider desktop content width',
  )
  assert.match(
    gridRule,
    /align-items:\s*stretch\s*;/,
    'pipeline binding grid should stretch empty and bound cards to the same row height',
  )
  assert.doesNotMatch(
    gridRule,
    /420px/,
    'pipeline binding grid should not keep the old fixed 420px card width',
  )
})
