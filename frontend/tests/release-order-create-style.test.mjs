import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const viewURL = new URL('../src/views/release/ReleaseOrderCreateView.vue', import.meta.url)
const source = readFileSync(viewURL, 'utf8')

function extractStyleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  assert.ok(match, `expected to find style rule for ${selector}`)
  return match[1]
}

test('release order create page uses standardized header actions instead of bottom actions', () => {
  assert.match(
    source,
    /<div class="page-header create-page-header">/,
    'create page should use the standardized transparent create header',
  )
  assert.match(
    source,
    /<div class="page-header-actions">[\s\S]*class="application-toolbar-action-btn"[\s\S]*\{\{ primaryActionText \}\}[\s\S]*release-fast-toolbar-btn[\s\S]*返回发布单/,
    'create actions should live in the page header and use application toolbar button styles',
  )
  assert.doesNotMatch(
    source,
    /<div class="action-area">/,
    'create page should not keep the old bottom action area',
  )
  assert.doesNotMatch(
    source,
    /page-header-card page-header/,
    'create page should not use the old page header card shell',
  )

  const buttonRule = extractStyleRule(':deep(.application-toolbar-action-btn.ant-btn)')
  assert.match(buttonRule, /height:\s*42px/, 'toolbar buttons should keep the shared 42px height')
  assert.match(buttonRule, /border-radius:\s*16px/, 'toolbar buttons should keep shared rounded corners')
  assert.match(buttonRule, /color:\s*#0f172a !important/, 'toolbar button text should use the shared dark color')
})

test('release order create page provides ci-only build submit action', () => {
  assert.match(
    source,
    /createReleaseOrder,\s*buildReleaseOrder/,
    'create page should import the build API next to createReleaseOrder',
  )
  assert.match(
    source,
    /const hasStagedBuildBindings = computed\(\(\) => Boolean\(bindingMapByScope\.value\.ci && bindingMapByScope\.value\.cd\)\)/,
    'only-build submit should require both CI and CD bindings because backend staged build needs a later deploy unit',
  )
  assert.match(
    source,
    /const canBuildOnlySubmitRelease = computed\(\(\) => canSubmitRelease\.value && hasStagedBuildBindings\.value && !buildOnlyDisabledReason\.value\)/,
    'only-build submit should have its own availability gate',
  )
  assert.match(
    source,
    /async function submitRelease\(options\?: \{ fast\?: boolean; buildOnly\?: boolean \}\)/,
    'submitRelease should accept a buildOnly mode',
  )
  assert.match(
    source,
    /if \(buildOnly\) \{[\s\S]*await buildReleaseOrder\(response\.data\.id\)[\s\S]*message\.success\('发布单创建成功，已提交仅构建任务'\)[\s\S]*void router\.push\(`\/releases\/\$\{response\.data\.id\}`\)[\s\S]*return[\s\S]*\}/,
    'buildOnly mode should create the order, dispatch CI build, then enter detail',
  )
  assert.match(
    source,
    /async function handleBuildOnlySubmit\(\) \{[\s\S]*await submitRelease\(\{ buildOnly: true \}\)[\s\S]*\}/,
    'create page should expose a dedicated only-build click handler',
  )
  assert.match(
    source,
    /v-if="!isEditMode"[\s\S]*:loading="buildOnlySubmitting"[\s\S]*:aria-disabled="!canBuildOnlySubmitRelease"[\s\S]*@click="handleBuildOnlySubmit"[\s\S]*仅构建/,
    'header should render the only-build button for new release orders',
  )
})

test('release order create page uses plain form sections and required hints', () => {
  assert.match(
    source,
    /class="release-create-form application-form-plain"[\s\S]*:required-mark="false"/,
    'release form should use plain surface and disable default required stars',
  )
  assert.match(source, /<div class="create-layout">/, 'release create page should use a two-column create layout')
  assert.match(source, /<section class="form-section release-form-section">/, 'base fields should be in a plain form section')
  assert.match(source, /<h3 class="form-section-heading-title">发布基础<\/h3>/, 'base section title should be explicit')
  assert.match(source, /应用 <span class="field-required-hint">必填<\/span>/, 'application field should use required hint tag')
  assert.match(source, /发布模板 <span class="field-required-hint">必填<\/span>/, 'template field should use required hint tag')
  assert.match(source, /环境 <span class="field-required-hint">必填<\/span>/, 'environment field should use required hint tag')
  assert.doesNotMatch(source, /<a-card class="form-card"/, 'create form should not use the old heavy card shell')

  const layoutRule = extractStyleRule('.create-layout')
  assert.match(
    layoutRule,
    /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*minmax\(260px,\s*320px\)/,
    'create layout should match the standardized form/sidebar grid',
  )
})

test('release order create page adds standardized sidebar guidance cards', () => {
  assert.match(
    source,
    /<aside class="create-sidebar">[\s\S]*发布创建流程[\s\S]*发布前检查/,
    'release create page should include the standardized right sidebar guidance cards',
  )
  assert.match(
    source,
    /选择应用与模板[\s\S]*确认环境与分支[\s\S]*填写执行参数[\s\S]*创建发布单/,
    'release create process should describe the main release creation steps',
  )
  assert.match(
    source,
    /应用和环境会决定当前账号是否有创建权限[\s\S]*模板启用审批人后只能创建发布单，不能极速发布[\s\S]*模板使用分支基础字段时，发布分支需要填写/,
    'release preflight tips should explain permission, approval and branch constraints',
  )

  const sideCardRule = extractStyleRule('.create-side-card')
  assert.match(sideCardRule, /border-radius:\s*24px/, 'sidebar cards should use the standardized 24px radius')
  assert.match(sideCardRule, /rgba\(191,\s*219,\s*254,\s*0\.72\)/, 'sidebar cards should use the standardized light blue border')
})

test('release order create page consolidates ci cd fields under advanced params', () => {
  assert.match(
    source,
    /<h3 class="form-section-heading-title">高级参数<\/h3>/,
    'CI/CD parameter sections should be consolidated under a single advanced params title',
  )
  assert.doesNotMatch(
    source,
    /CI 参数|CD 参数|CI 构建参数|CD 发布参数/,
    'CI/CD labels should not remain as primary parameter section titles',
  )
  assert.match(
    source,
    /function visibleAdvancedScopeParams\(scope: ReleasePipelineScope\)/,
    'create page should expose only advanced params that require applicant input',
  )
  assert.match(
    source,
    /function isTemplateParamMappedFromBaseField\(scope: ReleasePipelineScope, item: ExecutorParamDef\)/,
    'create page should explicitly identify params mapped from base fields',
  )
  assert.match(
    source,
    /function isTemplateParamInheritedFromCiParam\(scope: ReleasePipelineScope, item: ExecutorParamDef\)/,
    'create page should explicitly identify CD params inherited from CI params',
  )
  assert.match(
    source,
    /resolveTemplateParamValueSource\(meta\) === 'builtin'/,
    'base-field mapped params should be detected from builtin value source',
  )
  assert.match(
    source,
    /scope === 'cd' && resolveTemplateParamValueSource\(meta\) === 'ci_param'/,
    'CD params that inherit CI params should be hidden from advanced params',
  )
  assert.match(
    source,
    /visibleAdvancedScopeParams\(item\.scope\)/,
    'primary param rows should render only visible advanced params',
  )
  assert.doesNotMatch(
    source,
    /release-auto-param-inline|release-auto-param-detail/,
    'hidden mapped params should not be summarized or exposed in release order page details',
  )
  assert.match(
    source,
    /class="advanced-param-scope-group"/,
    'CI/CD groups should still exist inside advanced params',
  )
  assert.match(
    source,
    /ExclamationCircleOutlined/,
    'advanced params hint should use the standardized exclamation icon',
  )
  assert.match(
    source,
    /class="advanced-param-heading-hint"/,
    'advanced params should show a single heading hint icon',
  )
  assert.match(
    source,
    /<a-tooltip[\s\S]*trigger="click"[\s\S]*:title="advancedParamSummaryHint"[\s\S]*<button[\s\S]*class="advanced-param-heading-hint"[\s\S]*type="button"[\s\S]*:aria-label="advancedParamSummaryHint"/,
    'advanced params hint icon should show the explanation on click and remain accessible',
  )
  assert.match(
    source,
    /高级参数包含 CI\/CD 字段，已映射或沿用的参数不重复展示。/,
    'advanced params hint should explain CI/CD fields concisely',
  )
  assert.doesNotMatch(source, /当前模板已启用 \$\{scopeText\} 执行字段/, 'advanced params hint should avoid verbose runtime scope wording')
  assert.doesNotMatch(
    source,
    /advanced-param-scope-name|advanced-param-scope-hint|release-tip-trigger|release-tip-content/,
    'advanced params should not show CI/CD icon pills, inline hint text, or right-side info popovers',
  )
  assert.doesNotMatch(
    source,
    /visibleAdvancedParamCount|需填写\s*\{\{[^}]+\}\}\s*个|需要填写\s*\$\{[^}]+\.value\}\s*个高级参数/,
    'advanced params should not show a count of fields to fill',
  )
  assert.match(
    source,
    /\.advanced-param-scope-group \+ \.advanced-param-scope-group/,
    'CI/CD groups inside advanced params should be separated by a dashed divider',
  )
  assert.doesNotMatch(
    source,
    /<template v-else>\s*<a-input[\s\S]*resolveTemplateParamDisplayValue/,
    'hidden params should not stay in the primary form as disabled input fields',
  )
})
