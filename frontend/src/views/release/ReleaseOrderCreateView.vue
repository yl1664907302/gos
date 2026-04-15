<script setup lang="ts">
import { ArrowLeftOutlined, ThunderboltFilled } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApplicationByID, listApplications } from '../../api/application'
import { getExecutorParamDefByID, listApplicationExecutorParamDefs } from '../../api/pipeline'
import { createReleaseOrder, getReleaseOrderByID, getReleaseTemplateByID, listAllReleaseTemplates, listReleaseOrderParams, updateReleaseOrder } from '../../api/release'
import { getReleaseSettings } from '../../api/system'
import { useAuthStore } from '../../stores/auth'
import type { Application } from '../../types/application'
import type { ExecutorParamDef } from '../../types/pipeline'
import type {
  CreateReleaseOrderParamPayload,
  ReleaseOrder,
  ReleaseOrderParam,
  ReleasePipelineScope,
  ReleaseTemplate,
  ReleaseTemplateBinding,
  ReleaseTemplateParam,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface SelectOption {
  label: string
  value: string
}

interface ChoiceMeta {
  options: SelectOption[]
  multiple: boolean
  delimiter: string
}

interface CreateFormState {
  application_id: string
  template_id: string
  env_code: string
  git_ref: string
  remark: string
}

interface ScopeRuntimeState {
  loading: boolean
  error: string
  param_defs: ExecutorParamDef[]
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loadingApplications = ref(false)
const loadingEnvOptions = ref(false)
const loadingTemplates = ref(false)
const loadingTemplateDetail = ref(false)
const loadingEditOrder = ref(false)
const submitting = ref(false)
const submittingMode = ref<'standard' | 'fast' | ''>('')
const templateWarning = ref('')

const allApplicationOptions = ref<SelectOption[]>([])
const applicationRecords = ref<Application[]>([])
const envOptions = ref<SelectOption[]>([])
const templateOptions = ref<SelectOption[]>([])
const templateList = ref<ReleaseTemplate[]>([])
const selectedTemplate = ref<ReleaseTemplate | null>(null)
const templateBindings = ref<ReleaseTemplateBinding[]>([])
const templateParams = ref<ReleaseTemplateParam[]>([])
const editingOrder = ref<ReleaseOrder | null>(null)
const editingParamSnapshot = ref<ReleaseOrderParam[]>([])
const pendingEditSnapshotRestore = ref(false)
const paramValues = reactive<Record<string, string>>({})

const scopeStates = reactive<Record<ReleasePipelineScope, ScopeRuntimeState>>({
  ci: {
    loading: false,
    error: '',
    param_defs: [],
  },
  cd: {
    loading: false,
    error: '',
    param_defs: [],
  },
})

const preferredTemplateID = ref('')
const preferredBindingID = ref('')
const currentUserID = computed(() => String(authStore.profile?.id || '').trim())
const editingOrderID = computed(() => String(route.params.id || '').trim())
const isEditMode = computed(() => Boolean(editingOrderID.value))

const formState = reactive<CreateFormState>({
  application_id: '',
  template_id: '',
  env_code: '',
  git_ref: '',
  remark: '',
})

const rules: Record<string, Rule[]> = {
  application_id: [{ required: true, message: '请选择应用', trigger: 'change' }],
  template_id: [{ required: true, message: '请选择发布模板', trigger: 'change' }],
  env_code: [{ required: true, message: '请选择环境', trigger: 'change' }],
}

const scopeTitles: Record<ReleasePipelineScope, string> = {
  ci: 'CI 参数',
  cd: 'CD 参数',
}

const allowedApplicationIDs = computed(() => {
  if (authStore.isAdmin) {
    return null
  }
  return new Set(
    allApplicationOptions.value
      .filter((item) => authStore.hasApplicationPermission('release.create', item.value))
      .map((item) => item.value),
  )
})

const applicationOptions = computed<SelectOption[]>(() => {
  const allowed = allowedApplicationIDs.value
  const editingApplicationID = String(editingOrder.value?.application_id || '').trim()
  if (!allowed) {
    return allApplicationOptions.value
  }
  return allApplicationOptions.value.filter((item) => allowed.has(item.value) || (isEditMode.value && item.value === editingApplicationID))
})

const authorizedEnvOptions = computed<SelectOption[]>(() => {
  if (authStore.isAdmin || !formState.application_id.trim()) {
    return envOptions.value
  }
  const allowedEnvCodes = new Set(
    authStore.listApplicationPermissionEnvCodes(
      'release.create',
      formState.application_id.trim(),
      envOptions.value.map((item) => item.value),
    ),
  )
  return envOptions.value.filter((item) => allowedEnvCodes.has(item.value))
})

const currentUserDisplayName = computed(() => {
  const profile = authStore.profile
  if (!profile) {
    return '-'
  }
  return String(profile.display_name || '').trim() || String(profile.username || '').trim() || '-'
})

const formCreatorDisplayName = computed(() => {
  if (isEditMode.value && editingOrder.value) {
    return String(editingOrder.value.triggered_by || '').trim() || currentUserDisplayName.value
  }
  return currentUserDisplayName.value
})

const selectedApplicationRecord = computed(() =>
  applicationRecords.value.find((item) => item.id === formState.application_id.trim()) || null,
)

const releaseBranchOptions = computed<SelectOption[]>(() =>
  (selectedApplicationRecord.value?.release_branches || []).map((item) => ({
    label: item.name ? `${item.name} · ${item.branch}` : item.branch,
    value: item.branch,
  })),
)

const bindingMapByScope = computed<Record<ReleasePipelineScope, ReleaseTemplateBinding | null>>(() => ({
  ci: templateBindings.value.find((item) => item.pipeline_scope === 'ci' && item.enabled) || null,
  cd: templateBindings.value.find((item) => item.pipeline_scope === 'cd' && item.enabled) || null,
}))

const templateParamMetaByScope = computed<Record<ReleasePipelineScope, Record<string, ReleaseTemplateParam>>>(() => {
  const map: Record<ReleasePipelineScope, Record<string, ReleaseTemplateParam>> = {
    ci: {},
    cd: {},
  }
  templateParams.value.forEach((item) => {
    map[item.pipeline_scope][item.executor_param_def_id] = item
  })
  return map
})

const visibleScopes = computed(() => {
  return (['ci', 'cd'] as ReleasePipelineScope[]).filter((scope) => bindingMapByScope.value[scope])
})

const scopeCardList = computed(() =>
  visibleScopes.value.map((scope) => ({
    scope,
    title: scopeTitles[scope],
    binding: bindingMapByScope.value[scope],
    params: scopeTemplateParamDefs(scope),
    loading: scopeStates[scope].loading,
    error: scopeStates[scope].error,
  })),
)

const hasScopeErrors = computed(() => visibleScopes.value.some((scope) => Boolean(scopeStates[scope].error)))
const isParamLoading = computed(() => loadingTemplateDetail.value || visibleScopes.value.some((scope) => scopeStates[scope].loading))
const canSubmitRelease = computed(() => Boolean(formState.application_id && formState.template_id && selectedTemplate.value) && !hasScopeErrors.value && !isParamLoading.value && !loadingEditOrder.value)
const fastReleaseDisabledReason = computed(() => {
  if (isEditMode.value) {
    return '编辑模式下不支持极速发布'
  }
  if (!selectedTemplate.value) {
    return ''
  }
  if (
    Boolean(selectedTemplate.value.approval_enabled) &&
    (selectedTemplate.value.approval_approver_ids || []).length > 0
  ) {
    return '当前模板已配置审批人，极速发布不可用'
  }
  return ''
})
const canFastSubmitRelease = computed(() => canSubmitRelease.value && !fastReleaseDisabledReason.value)
const standardSubmitting = computed(() => submitting.value && submittingMode.value !== 'fast')
const fastSubmitting = computed(() => submitting.value && submittingMode.value === 'fast')
const pageTitle = computed(() => (isEditMode.value ? '编辑发布单' : '新建发布单'))
const pageSubtitle = computed(() =>
  isEditMode.value
    ? '仅待执行的普通发布单支持编辑；保存后会按最新模板和参数重新生成待执行快照'
    : '先选择发布模板，再按模板拆分填写 CI / CD 参数；平台会自动按模板结构执行发布',
)
const primaryActionText = computed(() => (isEditMode.value ? '保存修改' : '创建发布单'))

function resetParamValues() {
  Object.keys(paramValues).forEach((key) => {
    delete paramValues[key]
  })
}

function resetTemplateState() {
  formState.template_id = ''
  formState.git_ref = ''
  templateWarning.value = ''
  selectedTemplate.value = null
  templateBindings.value = []
  templateParams.value = []
  templateOptions.value = []
  templateList.value = []
  scopeStates.ci.error = ''
  scopeStates.ci.param_defs = []
  scopeStates.ci.loading = false
  scopeStates.cd.error = ''
  scopeStates.cd.param_defs = []
  scopeStates.cd.loading = false
  resetParamValues()
}

function formatTemplateOptionLabel(item: ReleaseTemplate) {
  const summary = [item.binding_name, item.binding_type].filter(Boolean).join(' / ')
  if (!summary) {
    return item.name
  }
  return `${item.name} · ${summary}`
}

function applyRouteQuery() {
  if (isEditMode.value) {
    preferredTemplateID.value = ''
    preferredBindingID.value = ''
    return
  }
  const applicationID = String(route.query.application_id || '').trim()
  const templateID = String(route.query.template_id || '').trim()
  const bindingID = String(route.query.binding_id || '').trim()
  if (applicationID) {
    formState.application_id = applicationID
  }
  preferredTemplateID.value = templateID
  preferredBindingID.value = bindingID
}

async function loadApplicationOptions() {
  loadingApplications.value = true
  try {
    const response = await listApplications({ page: 1, page_size: 200 })
    applicationRecords.value = response.data
    allApplicationOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))

    if (!authStore.isAdmin && applicationOptions.value.length === 0) {
      message.warning('当前账号未配置应用发布权限，请联系管理员授权')
    }
    if (!formState.git_ref && selectedApplicationRecord.value?.release_branches?.length === 1) {
      formState.git_ref = String(selectedApplicationRecord.value.release_branches[0]?.branch || '').trim()
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用下拉加载失败'))
  } finally {
    loadingApplications.value = false
  }
}

function isEditableReleaseOrder(orderItem: ReleaseOrder) {
  if (!orderItem) {
    return false
  }
  const isPending = String(orderItem.status || '').trim() === 'pending'
  const isOriginalDeploy =
    String(orderItem.operation_type || '').trim() === 'deploy' &&
    !String(orderItem.source_order_id || '').trim()
  const canOperate =
    authStore.isAdmin ||
    (currentUserID.value !== '' && String(orderItem.creator_user_id || '').trim() === currentUserID.value)
  return isPending && isOriginalDeploy && canOperate
}

async function ensureEditingApplicationOption() {
  const applicationID = String(editingOrder.value?.application_id || '').trim()
  if (!applicationID) {
    return
  }
  if (applicationRecords.value.some((item) => item.id === applicationID)) {
    return
  }
  try {
    const response = await getApplicationByID(applicationID)
    const record = response.data
    applicationRecords.value = [...applicationRecords.value, record]
    allApplicationOptions.value = [
      ...allApplicationOptions.value,
      {
        label: `${record.name} (${record.key})`,
        value: record.id,
      },
    ]
  } catch {
    // Ignore application detail lookup failures here and let the form surface later issues.
  }
}

async function loadEditingOrderSnapshot() {
  if (!isEditMode.value) {
    return
  }
  loadingEditOrder.value = true
  try {
    const [orderResp, paramsResp] = await Promise.all([
      getReleaseOrderByID(editingOrderID.value),
      listReleaseOrderParams(editingOrderID.value),
    ])
    if (!isEditableReleaseOrder(orderResp.data)) {
      message.warning('当前发布单不是可编辑的待执行普通发布单')
      void router.replace(`/releases/${editingOrderID.value}`)
      return
    }
    editingOrder.value = orderResp.data
    editingParamSnapshot.value = paramsResp.data
    formState.application_id = String(orderResp.data.application_id || '').trim()
    formState.template_id = ''
    formState.env_code = String(orderResp.data.env_code || '').trim()
    formState.git_ref = String(orderResp.data.git_ref || '').trim()
    formState.remark = String(orderResp.data.remark || '').trim()
    preferredTemplateID.value = String(orderResp.data.template_id || '').trim()
    preferredBindingID.value = ''
    pendingEditSnapshotRestore.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '待编辑发布单加载失败'))
    void router.replace('/releases')
  } finally {
    loadingEditOrder.value = false
  }
}

async function loadEnvOptions() {
  loadingEnvOptions.value = true
  try {
    const response = await getReleaseSettings()
    envOptions.value = (response.data.env_options || []).map((item) => ({
      label: item,
      value: item,
    }))
    syncSelectedEnvCode()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '环境选项加载失败'))
  } finally {
    loadingEnvOptions.value = false
  }
}

function syncSelectedEnvCode() {
  const availableEnvCodes = authorizedEnvOptions.value.map((item) => item.value)
  if (formState.env_code && !availableEnvCodes.includes(formState.env_code)) {
    formState.env_code = ''
  }
  if (!formState.env_code && availableEnvCodes.length === 1) {
    formState.env_code = availableEnvCodes[0] || ''
  }
}

function resetSelectionIfUnauthorized() {
  if (isEditMode.value) {
    syncSelectedEnvCode()
    return
  }
  const hasCurrentApplication = applicationOptions.value.some((item) => item.value === formState.application_id)
  if (hasCurrentApplication) {
    syncSelectedEnvCode()
    return
  }
  formState.application_id = ''
  formState.env_code = ''
  resetTemplateState()
}

async function findTemplateByBinding(templates: ReleaseTemplate[], bindingID: string) {
  const target = String(bindingID || '').trim()
  if (!target) {
    return ''
  }
  for (const item of templates) {
    try {
      const response = await getReleaseTemplateByID(item.id)
      const matched = response.data.bindings.some((binding) => binding.binding_id === target && binding.enabled)
      if (matched) {
        return item.id
      }
    } catch {
      // ignore single item lookup failures and continue searching
    }
  }
  return ''
}

async function loadTemplateOptions() {
  const applicationID = formState.application_id.trim()
  const preservedGitRef = pendingEditSnapshotRestore.value ? formState.git_ref.trim() : ''
  resetTemplateState()
  if (preservedGitRef) {
    formState.git_ref = preservedGitRef
  }
  if (!applicationID) {
    return
  }

  loadingTemplates.value = true
  try {
    const templates = await listAllReleaseTemplates({
      application_id: applicationID,
      status: 'active',
    })
    templateList.value = templates
    templateOptions.value = templates.map((item) => ({
      label: formatTemplateOptionLabel(item),
      value: item.id,
    }))

    let nextTemplateID = ''
    if (preferredTemplateID.value && templateOptions.value.some((item) => item.value === preferredTemplateID.value)) {
      nextTemplateID = preferredTemplateID.value
      preferredTemplateID.value = ''
    } else if (preferredBindingID.value) {
      nextTemplateID = await findTemplateByBinding(templates, preferredBindingID.value)
      preferredBindingID.value = ''
    } else if (templates.length === 1 && templates[0]) {
      nextTemplateID = templates[0].id
    }

    if (nextTemplateID) {
      formState.template_id = nextTemplateID
      await loadSelectedTemplateDetail()
    } else if (templates.length === 0) {
      templateWarning.value = '当前应用下还没有启用中的发布模板，请先到“发布模板”页面完成配置。'
    } else {
      templateWarning.value = '请选择一个发布模板后继续填写参数。'
    }
  } catch (error) {
    templateWarning.value = ''
    message.error(extractHTTPErrorMessage(error, '发布模板加载失败'))
  } finally {
    loadingTemplates.value = false
  }
}

async function loadScopeParamDefs(scope: ReleasePipelineScope) {
  const binding = bindingMapByScope.value[scope]
  scopeStates[scope].error = ''
  scopeStates[scope].param_defs = []

  if (!binding) {
    return
  }

  if (binding.provider !== 'jenkins') {
    return
  }

  scopeStates[scope].loading = true
  try {
    const response = await listApplicationExecutorParamDefs(formState.application_id, {
      binding_type: scope,
      binding_id: binding.binding_id,
      status: 'active',
      page: 1,
      page_size: 200,
    })
    const scopedTemplateParams = templateParams.value.filter((item) => item.pipeline_scope === scope)
    const allowedIDs = new Set(scopedTemplateParams.map((item) => item.executor_param_def_id))
    let resolvedParamDefs = response.data.filter((item) => allowedIDs.has(item.id))

    // 某些模板在应用级参数列表里会拿不到绑定对应的定义，逐条回退查询避免页面一直空白。
    if (resolvedParamDefs.length === 0 && scopedTemplateParams.length > 0) {
      const fallbackDefs = await Promise.all(
        scopedTemplateParams.map(async (item) => {
          try {
            const detail = await getExecutorParamDefByID(item.executor_param_def_id)
            return detail.data
          } catch {
            return null
          }
        }),
      )
      resolvedParamDefs = fallbackDefs.filter((item): item is ExecutorParamDef => Boolean(item))
    }

    scopeStates[scope].param_defs = resolvedParamDefs

    const valueMap = templateParamMetaByScope.value[scope]
    scopeStates[scope].param_defs.forEach((item) => {
      if (paramValues[item.id] !== undefined) {
        return
      }
      const meta = valueMap[item.id]
      if (meta?.required && item.default_value) {
        paramValues[item.id] = item.default_value
        return
      }
      paramValues[item.id] = item.default_value || ''
    })
  } catch (error) {
    scopeStates[scope].error = extractHTTPErrorMessage(error, `${scope.toUpperCase()} 参数加载失败`)
    scopeStates[scope].param_defs = []
  } finally {
    scopeStates[scope].loading = false
  }
}

function restoreEditingParamValues() {
  if (!pendingEditSnapshotRestore.value) {
    return
  }
  const snapshot = editingParamSnapshot.value
  if (snapshot.length === 0) {
    pendingEditSnapshotRestore.value = false
    return
  }
  for (const scope of visibleScopes.value) {
    const items = scopeTemplateParamDefs(scope)
    for (const item of items) {
      if (!isTemplateParamEditable(scope, item)) {
        continue
      }
      const matched = snapshot.find((param) => {
        if (param.pipeline_scope !== scope) {
          return false
        }
        const executorParamName = String(param.executor_param_name || '').trim().toLowerCase()
        const currentExecutorParamName = String(item.executor_param_name || '').trim().toLowerCase()
        if (executorParamName && currentExecutorParamName) {
          return executorParamName === currentExecutorParamName
        }
        return String(param.param_key || '').trim().toLowerCase() === String(item.param_key || '').trim().toLowerCase()
      })
      if (matched) {
        paramValues[item.id] = String(matched.param_value || '')
      }
    }
  }
  pendingEditSnapshotRestore.value = false
}

async function loadSelectedTemplateDetail() {
  const templateID = formState.template_id.trim()
  if (!templateID) {
    selectedTemplate.value = null
    templateBindings.value = []
    templateParams.value = []
    scopeStates.ci.param_defs = []
    scopeStates.cd.param_defs = []
    resetParamValues()
    templateWarning.value = '请选择一个发布模板后继续填写参数。'
    return
  }

  loadingTemplateDetail.value = true
  try {
    const response = await getReleaseTemplateByID(templateID)
    selectedTemplate.value = response.data.template
    templateBindings.value = response.data.bindings
    templateParams.value = response.data.params
    resetParamValues()
    await Promise.all([
      loadScopeParamDefs('ci'),
      loadScopeParamDefs('cd'),
    ])
    restoreEditingParamValues()
    templateWarning.value = ''
  } catch (error) {
    selectedTemplate.value = null
    templateBindings.value = []
    templateParams.value = []
    formState.template_id = ''
    resetParamValues()
    message.error(extractHTTPErrorMessage(error, '发布模板详情加载失败'))
  } finally {
    loadingTemplateDetail.value = false
  }
}

async function handleApplicationChange(value: string | undefined) {
  formState.application_id = String(value || '')
  preferredTemplateID.value = ''
  preferredBindingID.value = ''
  syncSelectedEnvCode()
  formState.git_ref = ''
  if (releaseBranchOptions.value.length === 1 && releaseBranchOptions.value[0]) {
    formState.git_ref = releaseBranchOptions.value[0].value
  }
  await loadTemplateOptions()
}

async function handleTemplateChange(value: string | undefined) {
  formState.template_id = String(value || '')
  await loadSelectedTemplateDetail()
}

function goBack() {
  if (isEditMode.value && editingOrderID.value) {
    void router.push(`/releases/${editingOrderID.value}`)
    return
  }
  void router.push('/releases')
}

function resolveTemplateParamLabel(scope: ReleasePipelineScope, item: ExecutorParamDef) {
  const meta = templateParamMetaByScope.value[scope][item.id]
  return meta?.param_name || item.param_key || item.executor_param_name || item.id
}

function scopeTemplateParamDefs(scope: ReleasePipelineScope) {
  return scopeStates[scope].param_defs
}

function resolveTemplateParamValueSource(meta?: ReleaseTemplateParam | null) {
  const value = String(meta?.value_source || '').trim().toLowerCase()
  if (value === 'fixed' || value === 'ci_param' || value === 'builtin' || value === 'release_input') {
    return value
  }
  return 'release_input'
}

function isTemplateParamEditable(scope: ReleasePipelineScope, item: ExecutorParamDef) {
  const meta = templateParamMetaByScope.value[scope][item.id]
  return resolveTemplateParamValueSource(meta) === 'release_input'
}

function resolveTemplateParamBuiltinPreview(paramKey: string, visited = new Set<string>()) {
  const normalizedKey = String(paramKey || '').trim().toLowerCase()
  if (!normalizedKey) {
    return ''
  }
  if (visited.has(`builtin:${normalizedKey}`)) {
    return ''
  }
  const nextVisited = new Set(visited)
  nextVisited.add(`builtin:${normalizedKey}`)

  switch (normalizedKey) {
    case 'env':
    case 'env_code':
      return formState.env_code.trim()
    case 'project_name':
      return resolveTemplateParamPreviewByParamKey('ci', 'project_name', nextVisited)
    case 'branch':
    case 'git_ref':
      return formState.git_ref.trim()
    case 'image_version':
    case 'image_tag':
      return resolveTemplateParamPreviewByParamKey('ci', 'image_version', nextVisited) || resolveTemplateParamPreviewByParamKey('ci', 'image_tag', nextVisited)
    case 'app_key':
      return String(selectedApplicationRecord.value?.key || '').trim()
    case 'app_name':
      return String(selectedApplicationRecord.value?.name || '').trim()
    default:
      return resolveTemplateParamPreviewByParamKey('ci', normalizedKey, nextVisited) || resolveTemplateParamPreviewByParamKey('cd', normalizedKey, nextVisited)
  }
}

function resolveTemplateParamPreviewByParamKey(scope: ReleasePipelineScope, paramKey: string, visited = new Set<string>()) {
  const normalizedKey = String(paramKey || '').trim().toLowerCase()
  if (!normalizedKey) {
    return ''
  }
  const visitKey = `${scope}:${normalizedKey}`
  if (visited.has(visitKey)) {
    return ''
  }
  const nextVisited = new Set(visited)
  nextVisited.add(visitKey)

  const target = scopeTemplateParamDefs(scope).find(
    (item) => String(item.param_key || '').trim().toLowerCase() === normalizedKey,
  )
  if (!target) {
    return ''
  }
  const meta = templateParamMetaByScope.value[scope][target.id]
  if (!meta) {
    return String(paramValues[target.id] || '').trim()
  }
  const valueSource = resolveTemplateParamValueSource(meta)
  if (valueSource === 'fixed') {
    return String(meta.fixed_value || '').trim()
  }
  if (valueSource === 'ci_param') {
    return resolveTemplateParamPreviewByParamKey('ci', meta.source_param_key, nextVisited)
  }
  if (valueSource === 'builtin') {
    return resolveTemplateParamBuiltinPreview(meta.source_param_key, nextVisited)
  }
  return String(paramValues[target.id] || '').trim()
}

function resolveTemplateParamDisplayValue(scope: ReleasePipelineScope, item: ExecutorParamDef) {
  const meta = templateParamMetaByScope.value[scope][item.id]
  if (!meta) {
    return String(paramValues[item.id] || '').trim()
  }
  switch (resolveTemplateParamValueSource(meta)) {
    case 'fixed':
      return String(meta.fixed_value || '').trim()
    case 'ci_param':
      return resolveTemplateParamPreviewByParamKey('ci', meta.source_param_key)
    case 'builtin':
      return resolveTemplateParamBuiltinPreview(meta.source_param_key)
    default:
      return String(paramValues[item.id] || '').trim()
  }
}

function resolveTemplateParamDisplayPlaceholder(scope: ReleasePipelineScope, item: ExecutorParamDef) {
  const meta = templateParamMetaByScope.value[scope][item.id]
  if (!meta) {
    return '必填，请输入发布值'
  }
  switch (resolveTemplateParamValueSource(meta)) {
    case 'fixed':
      return '模板已固定此参数'
    case 'ci_param':
      return `沿用 CI 标准字段：${meta.source_param_name || meta.source_param_key || '-'}`
    case 'builtin':
      return `发布基础字段：${meta.source_param_name || meta.source_param_key || '-'}`
    default:
      return '必填，请输入发布值'
  }
}

const defaultChoiceMeta: ChoiceMeta = {
  options: [],
  multiple: false,
  delimiter: ',',
}

function readChoiceDelimiter(meta: Record<string, unknown>) {
  const raw = [meta.multiSelectDelimiter, meta.multi_select_delimiter, meta.valueDelimiter, meta.delimiter, meta.separator]
  for (const item of raw) {
    const value = String(item || '').trim()
    if (value) {
      return value
    }
  }
  return ','
}

function splitChoiceText(value: string): string[] {
  const text = value.trim()
  if (!text) {
    return []
  }
  if (text.includes('\n') || text.includes('\r')) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (text.includes(',')) {
    return text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return [text]
}

function dedupe(values: string[]) {
  const result: string[] = []
  const seen = new Set<string>()
  values.forEach((item) => {
    if (!item || seen.has(item)) {
      return
    }
    seen.add(item)
    result.push(item)
  })
  return result
}

function normalizeChoiceValues(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return dedupe(raw.map((item) => String(item || '').trim()).filter(Boolean))
  }
  if (typeof raw === 'string') {
    return dedupe(splitChoiceText(raw))
  }
  if (raw && typeof raw === 'object') {
    const objectRaw = raw as Record<string, unknown>
    for (const key of ['values', 'choices', 'items', 'list', 'value']) {
      const values = normalizeChoiceValues(objectRaw[key])
      if (values.length > 0) {
        return values
      }
    }
  }
  return []
}

function resolveChoiceMeta(item: ExecutorParamDef): ChoiceMeta {
  if (item.param_type !== 'choice') {
    return defaultChoiceMeta
  }
  const raw = String(item.raw_meta || '').trim()
  if (!raw) {
    return defaultChoiceMeta
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const options = normalizeChoiceValues(
      parsed.choices ?? parsed.choiceList ?? parsed.values ?? parsed.value ?? parsed.items ?? null,
    ).map((value) => ({ label: value, value }))
    if (options.length === 0) {
      return defaultChoiceMeta
    }

    const className = String(parsed._class || '').toLowerCase()
    const typeName = String(parsed.type || parsed.choiceType || parsed.ptype || '').toLowerCase()
    const delimiter = readChoiceDelimiter(parsed)
    const inferredMulti =
      Boolean(parsed.multiSelect) ||
      Boolean(parsed.multi_select) ||
      Boolean(parsed.isMulti) ||
      typeName.includes('multi') ||
      typeName.includes('checkbox') ||
      className.includes('multi') ||
      Boolean(delimiter && String(item.default_value || '').includes(delimiter) && options.length > 1)
    const multiple = item.single_select ? false : inferredMulti || options.length > 1

    return {
      options,
      multiple,
      delimiter,
    }
  } catch {
    return defaultChoiceMeta
  }
}

const choiceMetaMap = computed<Record<string, ChoiceMeta>>(() => {
  const map: Record<string, ChoiceMeta> = {}
  ;(['ci', 'cd'] as ReleasePipelineScope[]).forEach((scope) => {
    scopeStates[scope].param_defs.forEach((item) => {
      map[item.id] = resolveChoiceMeta(item)
    })
  })
  return map
})

function getChoiceMeta(item: ExecutorParamDef) {
  return choiceMetaMap.value[item.id] || defaultChoiceMeta
}

function useSelectForChoice(item: ExecutorParamDef) {
  return item.param_type === 'choice' && getChoiceMeta(item).options.length > 0
}

function isMultipleChoice(_scope: ReleasePipelineScope, item: ExecutorParamDef) {
  return useSelectForChoice(item) && getChoiceMeta(item).multiple
}

function splitByDelimiter(value: string, delimiter: string) {
  const text = String(value || '').trim()
  if (!text) {
    return []
  }
  if (delimiter && text.includes(delimiter)) {
    return text
      .split(delimiter)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return splitChoiceText(text)
}

function getChoiceSingleValue(scope: ReleasePipelineScope, item: ExecutorParamDef): string | undefined {
  const value = String(paramValues[item.id] || '').trim()
  if (!value) {
    return undefined
  }
  if (!isMultipleChoice(scope, item)) {
    return value
  }
  const first = splitByDelimiter(value, getChoiceMeta(item).delimiter)[0]
  return first || undefined
}

function getChoiceMultiValues(item: ExecutorParamDef): string[] {
  const value = String(paramValues[item.id] || '').trim()
  if (!value) {
    return []
  }
  return splitByDelimiter(value, getChoiceMeta(item).delimiter)
}

function handleChoiceSingleChange(item: ExecutorParamDef, value: unknown) {
  paramValues[item.id] = String(value || '').trim()
}

function handleChoiceMultiChange(item: ExecutorParamDef, values: unknown) {
  const list = Array.isArray(values)
    ? values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    : []
  paramValues[item.id] = list.join(getChoiceMeta(item).delimiter || ',')
}

function handleParamValueInput(item: ExecutorParamDef, value: string) {
  paramValues[item.id] = String(value || '')
}

function buildParamsPayload(): CreateReleaseOrderParamPayload[] {
  const payload: CreateReleaseOrderParamPayload[] = []

  for (const scope of visibleScopes.value) {
    const items = scopeTemplateParamDefs(scope)
    for (const item of items) {
      if (!isTemplateParamEditable(scope, item)) {
        continue
      }
      const value = String(paramValues[item.id] || '').trim()
      const label = resolveTemplateParamLabel(scope, item)
      if (!value) {
        throw new Error(`参数 ${label} 为必填，请填写发布值`)
      }
      payload.push({
        pipeline_scope: scope,
        param_key: String(item.param_key || '').trim(),
        executor_param_name: item.executor_param_name,
        param_value: value,
        value_source: 'release_input',
      })
    }
  }

  return payload
}

async function submitRelease(options?: { fast?: boolean }) {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  if (!canSubmitRelease.value || !selectedTemplate.value) {
    message.warning('请先选择可用发布模板，并等待参数加载完成')
    return
  }

  const requiresBuiltinBranch = templateParams.value.some((item) => {
    const source = String(item.value_source || '').trim().toLowerCase()
    const key = String(item.source_param_key || '').trim().toLowerCase()
    return source === 'builtin' && (key === 'branch' || key === 'git_ref')
  })
  if (requiresBuiltinBranch && !formState.git_ref.trim()) {
    message.error('当前模板已使用发布基础字段中的分支，请先选择发布分支')
    return
  }

  let paramsPayload: CreateReleaseOrderParamPayload[]
  try {
    paramsPayload = buildParamsPayload()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '发布参数校验失败')
    return
  }

  const fast = Boolean(options?.fast)
  submitting.value = true
  submittingMode.value = fast ? 'fast' : 'standard'
  try {
    const payload = {
      application_id: formState.application_id.trim(),
      template_id: formState.template_id.trim(),
      env_code: formState.env_code.trim(),
      git_ref: formState.git_ref.trim() || undefined,
      trigger_type: 'manual',
      triggered_by: currentUserDisplayName.value !== '-' ? currentUserDisplayName.value : undefined,
      remark: formState.remark.trim() || undefined,
      params: paramsPayload.length > 0 ? paramsPayload : undefined,
    }
    const response = isEditMode.value
      ? await updateReleaseOrder(editingOrderID.value, payload)
      : await createReleaseOrder(payload)
    if (fast) {
      message.success('极速发布单创建成功，正在进入详情并自动开始发布')
      void router.push({
        path: `/releases/${response.data.id}`,
        query: {
          fast_execute: '1',
        },
      })
      return
    }
    message.success(isEditMode.value ? '发布单修改成功' : '发布单创建成功')
    void router.push(`/releases/${response.data.id}`)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, isEditMode.value ? '发布单修改失败' : '发布单创建失败'))
  } finally {
    submitting.value = false
    submittingMode.value = ''
  }
}

async function handleSubmit() {
  await submitRelease()
}

async function handleFastSubmit() {
  if (!canFastSubmitRelease.value) {
    if (fastReleaseDisabledReason.value) {
      message.warning(fastReleaseDisabledReason.value)
    }
    return
  }
  await submitRelease({ fast: true })
}

function scopeHint(scope: ReleasePipelineScope) {
  const binding = bindingMapByScope.value[scope]
  if (!binding) {
    return ''
  }
  if (binding.provider === 'argocd') {
    return `${scope.toUpperCase()} 当前使用 ArgoCD。发布执行时，平台会优先沿用 CI 中已映射的发布基础字段更新 GitOps 配置并触发同步；其中 image_version 在 Jenkins CI 下默认取本次构建号 BUILD_NUMBER。环境统一来自基础参数“环境”。`
  }
  if (binding.provider !== 'jenkins') {
    return `${scope.toUpperCase()} 当前使用 ${binding.provider}，当前版本暂不开放额外参数表单。`
  }
  return `${scope.toUpperCase()} 将基于模板配置的 Jenkins 参数生成发布表单。`
}

onMounted(async () => {
  await authStore.loadMe(true)
  applyRouteQuery()
  await loadEditingOrderSnapshot()
  await Promise.all([loadApplicationOptions(), loadEnvOptions()])
  await ensureEditingApplicationOption()
  resetSelectionIfUnauthorized()
  if (formState.application_id) {
    await loadTemplateOptions()
  }
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="header-left">
        <a-button @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          {{ isEditMode ? '返回详情' : '返回发布单' }}
        </a-button>
        <div class="page-header-copy">
          <h2 class="page-title">{{ pageTitle }}</h2>
          <p class="page-subtitle">{{ pageSubtitle }}</p>
        </div>
      </div>
    </div>

    <a-form
      ref="formRef"
      class="create-form"
      layout="vertical"
      :model="formState"
      :rules="rules"
      autocomplete="off"
    >
      <a-card class="form-card" :bordered="true">
        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="应用" name="application_id">
              <a-select
                v-model:value="formState.application_id"
                show-search
                :allow-clear="!isEditMode"
                :disabled="isEditMode"
                option-filter-prop="label"
                :placeholder="isEditMode ? '编辑模式下应用已锁定' : '请选择应用'"
                :loading="loadingApplications"
                :options="applicationOptions"
                @change="handleApplicationChange"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="发布模板" name="template_id">
              <a-select
                v-model:value="formState.template_id"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="请选择发布模板"
                :loading="loadingTemplates || loadingTemplateDetail"
                :options="templateOptions"
                @change="handleTemplateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="创建者">
              <a-input :value="formCreatorDisplayName" disabled />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="环境" name="env_code">
              <a-select
                v-model:value="formState.env_code"
                :options="authorizedEnvOptions"
                :loading="loadingEnvOptions"
                placeholder="请选择环境"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="备注" name="remark">
              <a-input v-model:value="formState.remark" placeholder="本次发布说明" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="发布分支">
              <a-select
                v-if="releaseBranchOptions.length"
                v-model:value="formState.git_ref"
                :options="releaseBranchOptions"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="请选择发布分支"
              />
              <a-input
                v-else
                v-model:value="formState.git_ref"
                placeholder="请输入发布分支（可选）"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-alert
          v-if="selectedTemplate"
          class="template-alert template-alert-success"
          type="success"
          show-icon
          :message="`当前模板：${selectedTemplate.name}`"
          :description="`${selectedTemplate.approval_enabled && selectedTemplate.approval_approver_ids.length > 0 ? '当前模板已启用审批，暂不支持极速发布；' : ''}已启用 ${visibleScopes.map((scope) => scope.toUpperCase()).join(' + ')} 执行单元${templateParams.length > 0 ? `，共 ${templateParams.length} 个额外参数` : ''}`"
        />
        <a-alert
          v-else-if="templateWarning"
          class="template-alert template-alert-warning"
          type="warning"
          show-icon
          :message="templateWarning"
        />
      </a-card>

      <template v-for="item in scopeCardList" :key="`${formState.template_id}-${item.scope}-${item.binding?.binding_id || item.binding?.provider || 'none'}`">
        <a-card class="form-card scope-card" :bordered="true">
          <template #title>{{ item.title }}</template>
          <template #extra>
            <a-space>
              <a-tag class="dashboard-chip dashboard-chip-running">{{ item.binding?.provider || '-' }}</a-tag>
              <a-tag class="dashboard-chip dashboard-chip-neutral">{{ item.binding?.binding_name || '-' }}</a-tag>
            </a-space>
          </template>

          <div class="scope-card-body">
            <a-alert class="scope-alert scope-alert-info" type="info" show-icon :message="scopeHint(item.scope)" />
            <a-alert v-if="item.error" class="scope-alert scope-alert-error" type="error" show-icon :message="item.error" />

            <a-spin :spinning="item.loading && item.params.length === 0" tip="正在加载额外参数...">
              <a-empty
                v-if="!item.loading && item.params.length === 0"
                  :description="item.binding?.provider === 'jenkins'
                  ? '当前执行单元未配置额外参数'
                  : item.binding?.provider === 'argocd'
                    ? '当前执行单元会沿用 CI 中映射并勾选的发布基础字段自动完成 GitOps 配置更新；其中 image_version 在 Jenkins CI 下默认取 BUILD_NUMBER'
                    : '当前执行单元暂无可填写的参数表单'"
              />
              <div v-else class="scope-param-form">
                <a-row v-for="rowIndex in Math.ceil(item.params.length / 2)" :key="`${item.scope}-row-${rowIndex}`" :gutter="16">
                  <a-col
                    v-for="param in item.params.slice((rowIndex - 1) * 2, (rowIndex - 1) * 2 + 2)"
                    :key="param.id"
                    :xs="24"
                    :md="12"
                  >
                  <a-form-item :label="resolveTemplateParamLabel(item.scope, param)" :required="isTemplateParamEditable(item.scope, param) || param.required">
                    <template v-if="isTemplateParamEditable(item.scope, param)">
                      <a-select
                        v-if="useSelectForChoice(param) && isMultipleChoice(item.scope, param)"
                        mode="multiple"
                        class="param-value-control"
                        :value="getChoiceMultiValues(param)"
                        :options="getChoiceMeta(param).options"
                        placeholder="必填，请选择发布值"
                        allow-clear
                        @change="handleChoiceMultiChange(param, $event)"
                      />
                      <a-select
                        v-else-if="useSelectForChoice(param)"
                        class="param-value-control"
                        :value="getChoiceSingleValue(item.scope, param)"
                        :options="getChoiceMeta(param).options"
                        placeholder="必填，请选择发布值"
                        allow-clear
                        @change="handleChoiceSingleChange(param, $event)"
                      />
                        <a-input
                          v-else
                          :value="paramValues[param.id]"
                          class="param-value-control"
                          :placeholder="resolveTemplateParamDisplayPlaceholder(item.scope, param)"
                          allow-clear
                          @update:value="handleParamValueInput(param, String($event || ''))"
                        />
                      </template>
                      <template v-else>
                        <a-input
                          :value="resolveTemplateParamDisplayValue(item.scope, param)"
                          class="param-value-control"
                          :placeholder="resolveTemplateParamDisplayPlaceholder(item.scope, param)"
                          disabled
                        />
                      </template>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </a-spin>
          </div>
        </a-card>
      </template>

      <div class="action-area">
        <a-space>
          <a-button @click="goBack">取消</a-button>
          <a-button
            v-if="!isEditMode"
            class="fast-submit-button"
            :class="{ 'fast-submit-button-disabled': !canFastSubmitRelease }"
            :loading="fastSubmitting"
            :aria-disabled="!canFastSubmitRelease"
            @click="handleFastSubmit"
          >
            <template #icon>
              <ThunderboltFilled />
            </template>
            极速发布
          </a-button>
          <a-button type="primary" :loading="standardSubmitting" :disabled="!canSubmitRelease" @click="handleSubmit">{{ primaryActionText }}</a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-card {
  border-radius: var(--radius-xl);
  border: 1px solid rgba(148, 163, 184, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 14px 30px rgba(15, 23, 42, 0.05);
}

.form-card :deep(.ant-card-head) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  min-height: 60px;
}

.form-card :deep(.ant-card-head-title) {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-dashboard-900);
}

.form-card :deep(.ant-form-item-label > label) {
  color: var(--color-text-soft);
  font-weight: 700;
}

.scope-card {
  margin-top: 0;
}

.scope-card-body {
  margin-top: 6px;
}

.scope-toggle-btn {
  color: var(--color-dashboard-900);
  font-weight: 700;
}

.scope-toggle-btn:hover {
  color: var(--color-primary-600);
  background: rgba(37, 99, 235, 0.06);
}

.template-alert,
.scope-alert {
  margin-top: 8px;
  margin-bottom: 16px;
  border-radius: 16px;
  border-width: 1px;
  border-style: solid;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    0 10px 24px rgba(15, 23, 42, 0.04);
}

.template-alert :deep(.ant-alert-message),
.scope-alert :deep(.ant-alert-message) {
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
}

.template-alert :deep(.ant-alert-description),
.scope-alert :deep(.ant-alert-description) {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.template-alert-success {
  background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%);
  border-color: #86efac;
}

.template-alert-success :deep(.ant-alert-message),
.template-alert-success :deep(.ant-alert-icon) {
  color: #15803d;
}

.template-alert-warning {
  background: linear-gradient(180deg, #fff7ed 0%, #fffbeb 100%);
  border-color: #fdba74;
}

.template-alert-warning :deep(.ant-alert-message),
.template-alert-warning :deep(.ant-alert-icon) {
  color: #b45309;
}

.scope-alert-info {
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border-color: #93c5fd;
}

.scope-alert-info :deep(.ant-alert-message),
.scope-alert-info :deep(.ant-alert-icon) {
  color: #1d4ed8;
}

.scope-alert-error {
  background: linear-gradient(180deg, #fff1f2 0%, #fff5f5 100%);
  border-color: #fda4af;
}

.scope-alert-error :deep(.ant-alert-message),
.scope-alert-error :deep(.ant-alert-icon) {
  color: #b91c1c;
}

.scope-param-form {
  min-height: 40px;
}

.param-value-control {
  width: 100%;
}

.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button) {
  color: #7f1d1d !important;
  font-weight: 600;
  border-color: #c08497;
  background: #f3e7eb;
  box-shadow: 0 10px 22px rgba(190, 24, 93, 0.12);
}

.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button > span),
.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button .anticon) {
  color: inherit !important;
}

.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button:hover) {
  color: #6b1111 !important;
  border-color: #be6b82;
  background: #edd8de;
}

.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button:focus) {
  color: #6b1111 !important;
  border-color: #be6b82;
  background: #edd8de;
  box-shadow:
    0 0 0 3px rgba(190, 24, 93, 0.14),
    0 10px 22px rgba(190, 24, 93, 0.14);
}

.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button.fast-submit-button-disabled) {
  color: #7f1d1d !important;
  border-color: #c08497 !important;
  background: #f3e7eb !important;
  box-shadow: none;
  opacity: 0.62 !important;
  cursor: not-allowed;
}

.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button.fast-submit-button-disabled:hover),
.page-wrapper :deep(.ant-btn.ant-btn-default.fast-submit-button.fast-submit-button-disabled:focus) {
  color: #7f1d1d !important;
  border-color: #c08497 !important;
  background: #f3e7eb !important;
  box-shadow: none !important;
}

.create-form :deep(.ant-input),
.create-form :deep(.ant-select-selector) {
  border-radius: 14px !important;
  border-color: rgba(148, 163, 184, 0.24) !important;
  background: rgba(255, 255, 255, 0.94) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.create-form :deep(.ant-input:hover),
.create-form :deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  border-color: rgba(51, 65, 85, 0.34) !important;
}

.create-form :deep(.ant-input:focus),
.create-form :deep(.ant-input-focused),
.create-form :deep(.ant-select-focused .ant-select-selector) {
  border-color: rgba(37, 99, 235, 0.44) !important;
  box-shadow:
    0 0 0 3px rgba(37, 99, 235, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.82) !important;
}

.create-form :deep(.ant-empty) {
  padding: 12px 0;
}

.create-form :deep(.ant-empty-description) {
  color: var(--color-text-soft);
}

.param-helper {
  color: var(--ant-color-text-description, #8c8c8c);
  font-size: 12px;
  line-height: 1.5;
  margin-top: 4px;
}

.action-area {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.action-area :deep(.ant-space) {
  gap: 10px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .create-form {
    gap: 14px;
  }
}
</style>
