import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const editViewURL = new URL('../src/views/application/ApplicationEditView.vue', import.meta.url)
const bindingViewURL = new URL('../src/views/application/ApplicationPipelineBindingView.vue', import.meta.url)
const editSource = readFileSync(editViewURL, 'utf8')
const bindingSource = readFileSync(bindingViewURL, 'utf8')

function extractStyleRule(source, selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'))
  assert.ok(match, `expected to find style rule for ${selector}`)
  return match[1]
}

test('application edit page reuses the pipeline binding surface background', () => {
  const bindingCardRule = extractStyleRule(bindingSource, '.binding-module-card')
  const editPageRule = extractStyleRule(editSource, '.application-edit-page')
  const sharedSurfaceRule = extractStyleRule(editSource, '.create-main-card,\n.create-side-card')

  assert.match(
    editSource,
    /class="page-wrapper application-edit-page"/,
    'application edit page should define its own scope when reusing the pipeline binding surface shell',
  )
  assert.match(
    editSource,
    /class="create-main-card"/,
    'application edit page should wrap the form in a reusable surface card',
  )
  assert.match(
    editPageRule,
    /rgba\(34,\s*197,\s*94,\s*0\.08\)/,
    'application edit page should reuse the pipeline binding green glow',
  )
  assert.match(
    editPageRule,
    /rgba\(59,\s*130,\s*246,\s*0\.08\)/,
    'application edit page should reuse the pipeline binding blue glow',
  )
  assert.match(
    editPageRule,
    /rgba\(255,\s*255,\s*255,\s*0\.98\)/,
    'application edit page should reuse the same light base background as the pipeline binding cards',
  )
  assert.match(
    editPageRule,
    /rgba\(148,\s*163,\s*184,\s*0\.16\)/,
    'application edit page should reuse the pipeline binding card border tone',
  )
  assert.match(
    editPageRule,
    /0 14px 32px rgba\(15,\s*23,\s*42,\s*0\.04\)/,
    'application edit page should reuse the pipeline binding card shadow depth',
  )
  assert.match(
    sharedSurfaceRule,
    /background:\s*var\(--pipeline-binding-surface-background\)\s*;/,
    'application edit page surfaces should pull their background from the shared pipeline binding surface variable',
  )
  assert.match(
    sharedSurfaceRule,
    /border:\s*1px solid var\(--pipeline-binding-surface-border\)\s*;/,
    'application edit page surfaces should pull their border from the shared pipeline binding surface variable',
  )
  assert.match(
    sharedSurfaceRule,
    /box-shadow:\s*var\(--pipeline-binding-surface-shadow\)\s*;/,
    'application edit page surfaces should pull their shadow from the shared pipeline binding surface variable',
  )
  assert.match(
    bindingCardRule,
    /rgba\(34,\s*197,\s*94,\s*0\.08\)/,
    'pipeline binding cards should keep the green glow that the edit page is reusing',
  )
  assert.match(
    bindingCardRule,
    /rgba\(59,\s*130,\s*246,\s*0\.08\)/,
    'pipeline binding cards should keep the blue glow that the edit page is reusing',
  )
  assert.match(
    bindingCardRule,
    /rgba\(255,\s*255,\s*255,\s*0\.98\)/,
    'pipeline binding cards should keep the same light base background the edit page is reusing',
  )
})

test('application edit page returns to the list after detail page removal', () => {
  assert.match(
    editSource,
    /message\.success\('应用更新成功'\)[\s\S]*router\.push\('\/applications'\)/,
    'application edit save should return to the application list because detail page is removed',
  )
  assert.doesNotMatch(
    editSource,
    /router\.push\(`\/applications\/\$\{applicationId\.value\}`\)/,
    'application edit page should not navigate to the removed detail page',
  )
})
