<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { listApplications } from '../../api/application'
import { listGitOpsFieldCandidates } from '../../api/gitops'
import { listPlatformParamDicts } from '../../api/platform-param'
import { listPipelineBindings, listApplicationExecutorParamDefs } from '../../api/pipeline'
import {
  createReleaseTemplate,
  deleteReleaseTemplate,
  getReleaseTemplateByID,
  listReleaseTemplates,
  updateReleaseTemplate,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { PipelineBinding, ExecutorParamDef } from '../../types/pipeline'
import type { GitOpsFieldCandidate } from '../../types/gitops'
import type { PlatformParamDict } from '../../types/platform-param'
import type {
  ReleasePipelineScope,
  ReleaseTemplate,
  ReleaseTemplateBinding,
  ReleaseTemplateGitOpsRule,
  ReleaseTemplateGitOpsRulePayload,
  ReleaseTemplatePayload,
  ReleaseTemplateStatus,
  UpdateReleaseTemplatePayload,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

type FormMode = 'create' | 'edit'

type ScopeState = {
  enabled: boolean
  binding_id: string
  selected_param_def_ids: string[]
  selectable_params: ExecutorParamDef[]
  loading_params: boolean
}

interface TemplateFormState {
  id: string
  name: string
  application_id: string
  status: ReleaseTemplateStatus
  remark: string
}

interface SelectOption {
  label: string
  value: string
}

interface BindingOption {
  label: string
  value: string
  binding_type: PipelineBinding['binding_type']
  provider: PipelineBinding['provider']
}

interface GitOpsRuleFormItem {
  local_id: string
  source_param_key: string
  source_from: 'ci' | 'builtin'
  file_path_template: string
  document_kind: string
  document_name: string
  target_path: string
  value_template: string
}

interface GitOpsFieldDocumentGroup {
  key: string
  file_path_template: string
  file_name: string
  document_kind: string
  document_name: string
  display_name: string
  fields: GitOpsFieldCandidate[]
}

const loading = ref(false)
const submitting = ref(false)
const deletingID = ref('')
const dataSource = ref<ReleaseTemplate[]>([])
const total = ref(0)

const modalVisible = ref(false)
const modalMode = ref<FormMode>('create')
const modalLoading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<TemplateFormState>({
  id: '',
  name: '',
  application_id: '',
  status: 'active',
  remark: '',
})

const scopeStates = reactive<Record<ReleasePipelineScope, ScopeState>>({
  ci: {
    enabled: true,
    binding_id: '',
    selected_param_def_ids: [],
    selectable_params: [],
    loading_params: false,
  },
  cd: {
    enabled: false,
    binding_id: '',
    selected_param_def_ids: [],
    selectable_params: [],
    loading_params: false,
  },
})

const filters = reactive({
  application_id: '',
  status: '' as '' | ReleaseTemplateStatus,
  page: 1,
  pageSize: 20,
})

const applicationOptions = ref<SelectOption[]>([])
const bindingOptions = ref<BindingOption[]>([])
const loadingBindings = ref(false)
const platformParamNameMap = ref<Record<string, string>>({})
const platformParamDicts = ref<PlatformParamDict[]>([])
const gitOpsFieldCandidates = ref<GitOpsFieldCandidate[]>([])
const loadingGitOpsFieldCandidates = ref(false)
const gitopsRules = ref<GitOpsRuleFormItem[]>([])
const yamlSelectorVisible = ref(false)
const yamlSelectorRuleID = ref('')
const yamlFieldExpandedKeys = ref<string[]>([])

const scopeTitles: Record<ReleasePipelineScope, string> = {
  ci: 'CI 配置',
  cd: 'CD 配置',
}

const scopeDescriptions: Record<ReleasePipelineScope, string> = {
  ci: 'CI 固定使用 Jenkins；参数仅允许来自 CI 绑定管线，并且必须已完成平台标准 Key 映射。',
  cd: 'CD 默认走 ArgoCD；如果额外选择了 CD 绑定管线，则当前模板会改为走 Jenkins。',
}

const initialColumns: TableColumnsType<ReleaseTemplate> = [
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '应用', dataIndex: 'application_name', key: 'application_name', width: 180 },
  { title: '执行单元', dataIndex: 'binding_name', key: 'binding_name', width: 180 },
  { title: '类型', dataIndex: 'binding_type', key: 'binding_type', width: 120 },
  { title: '参数数', dataIndex: 'param_count', key: 'param_count', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 180 },
  { title: '操作', key: 'actions', width: 200, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 560, hitArea: 10 })

const selectableParamColumns: TableColumnsType<ExecutorParamDef> = [
  { title: '平台字段', key: 'param_name', width: 180 },
  { title: '平台 Key', dataIndex: 'param_key', key: 'param_key', width: 160 },
  { title: '执行器参数', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 220 },
  { title: '类型', dataIndex: 'param_type', key: 'param_type', width: 120 },
  { title: '必填', dataIndex: 'required', key: 'required', width: 90 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
]

const statusOptions = [
  { label: 'active', value: 'active' },
  { label: 'inactive', value: 'inactive' },
] as const

const modalTitle = computed(() => (modalMode.value === 'create' ? '新增发布模板' : '编辑发布模板'))

const bindingOptionsByScope = computed<Record<ReleasePipelineScope, BindingOption[]>>(() => ({
  ci: bindingOptions.value.filter((item) => item.binding_type === 'ci' && item.provider === 'jenkins'),
  cd: bindingOptions.value.filter((item) => item.binding_type === 'cd' && item.provider === 'jenkins'),
}))

const gitOpsSourceOptions = computed<SelectOption[]>(() => {
  const options: SelectOption[] = []
  const seen = new Set<string>()
  const selectedCIParamIDs = new Set(scopeStates.ci.selected_param_def_ids)

  scopeStates.ci.selectable_params.forEach((item) => {
    if (!selectedCIParamIDs.has(item.id)) {
      return
    }
    const key = String(item.param_key || '').trim().toLowerCase()
    if (!key || seen.has(key)) {
      return
    }
    seen.add(key)
    options.push({
      label: `${resolvePlatformParamName(key)} (${key}) · 来自 CI`,
      value: key,
    })
  })

  platformParamDicts.value.forEach((item) => {
    const key = String(item.param_key || '').trim().toLowerCase()
    if (!item.builtin || item.status !== 1 || !key || seen.has(key)) {
      return
    }
    seen.add(key)
    options.push({
      label: `${item.name} (${key}) · 系统内置`,
      value: key,
    })
  })

  return options
})

const gitOpsFieldDocumentGroups = computed<GitOpsFieldDocumentGroup[]>(() => {
  const groups = new Map<string, GitOpsFieldDocumentGroup>()
  gitOpsFieldCandidates.value.forEach((item) => {
    const key = [
      item.file_path_template,
      item.document_kind,
      item.document_name || '-',
    ].join('::')
    const existing = groups.get(key)
    if (existing) {
      existing.fields.push(item)
      return
    }
    groups.set(key, {
      key,
      file_path_template: item.file_path_template,
      file_name: item.file_path_template.split('/').filter(Boolean).pop() || item.file_path_template,
      document_kind: item.document_kind,
      document_name: item.document_name,
      display_name: item.document_name
        ? `${item.document_kind} / ${item.document_name}`
        : item.document_kind || 'YAML 文档',
      fields: [item],
    })
  })

  return Array.from(groups.values()).map((group) => ({
    ...group,
    fields: [...group.fields].sort((left, right) => left.target_path.localeCompare(right.target_path)),
  }))
})

function selectedBinding(scope: ReleasePipelineScope) {
  return bindingOptionsByScope.value[scope].find((item) => item.value === scopeStates[scope].binding_id)
}

function isCDUsingArgoCD() {
  return scopeStates.cd.enabled && !selectedBinding('cd')
}

function statusColor(status: ReleaseTemplateStatus) {
  return status === 'active' ? 'green' : 'default'
}

function formatTime(value: string) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function resolvePlatformParamName(paramKey: string) {
  const key = String(paramKey || '').trim().toLowerCase()
  return platformParamNameMap.value[key] || key || '-'
}

function createGitOpsRuleFormItem(partial?: Partial<GitOpsRuleFormItem>): GitOpsRuleFormItem {
  const sourceKey = String(partial?.source_param_key || '').trim().toLowerCase()
  return {
    local_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source_param_key: sourceKey,
    source_from: partial?.source_from || resolveGitOpsRuleSourceFrom(sourceKey),
    file_path_template: String(partial?.file_path_template || '').trim(),
    document_kind: String(partial?.document_kind || '').trim(),
    document_name: String(partial?.document_name || '').trim(),
    target_path: String(partial?.target_path || '').trim(),
    value_template: String(partial?.value_template || (sourceKey ? `{${sourceKey}}` : '')).trim(),
  }
}

function resolveGitOpsRuleSourceFrom(paramKey: string): 'ci' | 'builtin' {
  const normalized = String(paramKey || '').trim().toLowerCase()
  if (!normalized) {
    return 'ci'
  }
  const selectedCIParamIDs = new Set(scopeStates.ci.selected_param_def_ids)
  const fromCI = scopeStates.ci.selectable_params.some(
    (item) => selectedCIParamIDs.has(item.id) && String(item.param_key || '').trim().toLowerCase() === normalized,
  )
  return fromCI ? 'ci' : 'builtin'
}

function buildGitOpsFieldCandidateValue(item: GitOpsFieldCandidate) {
  return JSON.stringify({
    file_path_template: item.file_path_template,
    document_kind: item.document_kind,
    document_name: item.document_name,
    target_path: item.target_path,
  })
}

function parseYamlFieldSegments(targetPath: string) {
  return String(targetPath || '')
    .split('/')
    .map((item) => item.trim())
    .filter((item) => item)
    .map((item) => (/^\d+$/.test(item) ? `[${item}]` : item))
}

function yamlFieldLeafLabel(targetPath: string) {
  const segments = parseYamlFieldSegments(targetPath)
  return segments[segments.length - 1] || targetPath
}

function yamlFieldParentPath(targetPath: string) {
  const segments = parseYamlFieldSegments(targetPath)
  return segments.slice(0, -1).join(' / ')
}

function yamlFieldPreview(group: GitOpsFieldDocumentGroup) {
  return group.fields
    .slice(0, 3)
    .map((item) => yamlFieldLeafLabel(item.target_path))
    .join('、')
}

function yamlFieldIndentStyle(targetPath: string) {
  const depth = Math.max(parseYamlFieldSegments(targetPath).length - 1, 0)
  return {
    paddingLeft: `${Math.min(depth * 18, 96)}px`,
  }
}

function currentYamlFieldCandidateValue() {
  const rule = currentYamlSelectorRule()
  if (!rule || !rule.file_path_template || !rule.target_path) {
    return ''
  }
  return buildGitOpsFieldCandidateValue({
    file_path_template: rule.file_path_template,
    document_kind: rule.document_kind,
    document_name: rule.document_name,
    target_path: rule.target_path,
    value_type: '',
    sample_value: '',
    display_name: '',
  })
}

function isYamlFieldCandidateSelected(candidate: GitOpsFieldCandidate) {
  return currentYamlFieldCandidateValue() === buildGitOpsFieldCandidateValue(candidate)
}

function syncYamlFieldExpandedKeys() {
  const groups = gitOpsFieldDocumentGroups.value
  if (!groups.length) {
    yamlFieldExpandedKeys.value = []
    return
  }
  const currentValue = currentYamlFieldCandidateValue()
  const matchedGroup = currentValue
    ? groups.find((group) => group.fields.some((field) => buildGitOpsFieldCandidateValue(field) === currentValue))
    : null
  const defaults = groups.slice(0, Math.min(groups.length, 4)).map((item) => item.key)
  if (matchedGroup && !defaults.includes(matchedGroup.key)) {
    defaults.unshift(matchedGroup.key)
  }
  yamlFieldExpandedKeys.value = Array.from(new Set(defaults))
}

function resolveGitOpsSourceLabel(paramKey: string) {
  const normalized = String(paramKey || '').trim().toLowerCase()
  if (!normalized) {
    return '未选择标准字段'
  }
  return gitOpsSourceOptions.value.find((item) => item.value === normalized)?.label || `${resolvePlatformParamName(normalized)} (${normalized})`
}

function findGitOpsFieldCandidate(rule: GitOpsRuleFormItem) {
  return gitOpsFieldCandidates.value.find(
    (item) =>
      item.file_path_template === rule.file_path_template &&
      item.document_kind === rule.document_kind &&
      String(item.document_name || '') === String(rule.document_name || '') &&
      item.target_path === rule.target_path,
  )
}

function formatGitOpsRuleTargetSummary(rule: GitOpsRuleFormItem) {
  const candidate = findGitOpsFieldCandidate(rule)
  if (candidate) {
    return {
      title: candidate.display_name || `${candidate.document_kind} / ${candidate.document_name || '-'}`,
      file: candidate.file_path_template,
      path: candidate.target_path,
      sample: candidate.sample_value || '-',
      stale: false,
    }
  }
  return {
    title: rule.document_name ? `${rule.document_kind} / ${rule.document_name}` : rule.document_kind || 'YAML 字段',
    file: rule.file_path_template || '-',
    path: rule.target_path || '-',
    sample: '-',
    stale: Boolean(rule.file_path_template || rule.target_path),
  }
}

function resetScopeState(scope: ReleasePipelineScope) {
  scopeStates[scope].binding_id = ''
  scopeStates[scope].selected_param_def_ids = []
  scopeStates[scope].selectable_params = []
  scopeStates[scope].loading_params = false
}

function resetFormState() {
  formState.id = ''
  formState.name = ''
  formState.application_id = ''
  formState.status = 'active'
  formState.remark = ''
  scopeStates.ci.enabled = true
  scopeStates.cd.enabled = false
  resetScopeState('ci')
  resetScopeState('cd')
  bindingOptions.value = []
  gitOpsFieldCandidates.value = []
  gitopsRules.value = []
}

function buildPayload(): ReleaseTemplatePayload | UpdateReleaseTemplatePayload {
  return {
    name: formState.name.trim(),
    ...(modalMode.value === 'create' ? { application_id: formState.application_id.trim() } : {}),
    ci_binding_id: scopeStates.ci.enabled ? scopeStates.ci.binding_id.trim() || undefined : undefined,
    cd_binding_id: scopeStates.cd.enabled ? scopeStates.cd.binding_id.trim() || undefined : undefined,
    cd_provider: scopeStates.cd.enabled ? (selectedBinding('cd')?.provider || 'argocd') : undefined,
    status: formState.status,
    remark: formState.remark.trim() || undefined,
    ci_param_def_ids: scopeStates.ci.enabled ? [...scopeStates.ci.selected_param_def_ids] : [],
    cd_param_def_ids: scopeStates.cd.enabled ? [...scopeStates.cd.selected_param_def_ids] : [],
    gitops_rules:
      scopeStates.cd.enabled && !selectedBinding('cd')
        ? gitopsRules.value.map<ReleaseTemplateGitOpsRulePayload>((item) => ({
            source_param_key: item.source_param_key,
            source_from: item.source_from,
            file_path_template: item.file_path_template,
            document_kind: item.document_kind,
            document_name: item.document_name || undefined,
            target_path: item.target_path,
            value_template: item.value_template || undefined,
          }))
        : [],
  }
}

async function loadPlatformParamMap() {
  try {
    const response = await listPlatformParamDicts({ page: 1, page_size: 200 })
    const next: Record<string, string> = {}
    response.data.forEach((item) => {
      next[item.param_key] = item.name
    })
    platformParamNameMap.value = next
    platformParamDicts.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字库加载失败'))
  }
}

async function loadGitOpsFieldCandidates(applicationID: string, silent = false) {
  const appID = String(applicationID || '').trim()
  if (!appID) {
    gitOpsFieldCandidates.value = []
    return
  }
  loadingGitOpsFieldCandidates.value = true
  try {
    const response = await listGitOpsFieldCandidates(appID)
    gitOpsFieldCandidates.value = response.data
    if (yamlSelectorVisible.value) {
      await nextTick()
      syncYamlFieldExpandedKeys()
    }
  } catch (error) {
    gitOpsFieldCandidates.value = []
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, 'GitOps YAML 字段加载失败'))
    }
  } finally {
    loadingGitOpsFieldCandidates.value = false
  }
}

async function loadApplications() {
  try {
    const response = await listApplications({ page: 1, page_size: 200 })
    applicationOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用下拉加载失败'))
  }
}

async function loadTemplates() {
  loading.value = true
  try {
    const response = await listReleaseTemplates({
      application_id: filters.application_id || undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布模板加载失败'))
  } finally {
    loading.value = false
  }
}

async function loadBindings(applicationID: string) {
  const appID = String(applicationID || '').trim()
  if (!appID) {
    bindingOptions.value = []
    resetScopeState('ci')
    resetScopeState('cd')
    return
  }
  loadingBindings.value = true
  try {
    const response = await listPipelineBindings(appID, {
      status: 'active',
      page: 1,
      page_size: 200,
    })
    bindingOptions.value = response.data.map((item) => ({
      label: `${item.name || item.binding_type} [${item.binding_type}/${item.provider}]`,
      value: item.id,
      binding_type: item.binding_type,
      provider: item.provider,
    }))
  } catch (error) {
    bindingOptions.value = []
    message.error(extractHTTPErrorMessage(error, '绑定下拉加载失败'))
  } finally {
    loadingBindings.value = false
  }
}

async function loadSelectableParams(scope: ReleasePipelineScope, preserveSelection = false) {
  const state = scopeStates[scope]
  const appID = formState.application_id.trim()
  const binding = selectedBinding(scope)

  if (!state.enabled || !appID || !binding) {
    state.selectable_params = []
    if (!preserveSelection) {
      state.selected_param_def_ids = []
    }
    return
  }

  if (binding.provider !== 'jenkins') {
    state.selectable_params = []
    state.selected_param_def_ids = []
    return
  }

  state.loading_params = true
  try {
    const response = await listApplicationExecutorParamDefs(appID, {
      binding_type: scope,
      status: 'active',
      page: 1,
      page_size: 200,
    })
    state.selectable_params = response.data.filter((item) => String(item.param_key || '').trim().toLowerCase() !== '')
    const allowed = new Set(state.selectable_params.map((item) => item.id))
    state.selected_param_def_ids = state.selected_param_def_ids.filter((item) => allowed.has(item))
  } catch (error) {
    state.selectable_params = []
    state.selected_param_def_ids = []
    message.error(extractHTTPErrorMessage(error, `${scope.toUpperCase()} 模板参数加载失败`))
  } finally {
    state.loading_params = false
  }
}

async function handleApplicationChange(value: string | undefined) {
  formState.application_id = String(value || '')
  resetScopeState('ci')
  resetScopeState('cd')
  gitopsRules.value = []
  await loadBindings(formState.application_id)
  await loadGitOpsFieldCandidates(formState.application_id)
}

async function handleScopeBindingChange(scope: ReleasePipelineScope, value: string | undefined) {
  scopeStates[scope].binding_id = String(value || '')
  scopeStates[scope].selected_param_def_ids = []
  await loadSelectableParams(scope)
}

async function handleScopeEnabledChange(scope: ReleasePipelineScope, checked: boolean) {
  scopeStates[scope].enabled = checked
  if (!checked) {
    resetScopeState(scope)
    if (scope === 'cd') {
      gitopsRules.value = []
    }
    return
  }
  await loadSelectableParams(scope)
}

function getRowSelection(scope: ReleasePipelineScope) {
  return {
    selectedRowKeys: scopeStates[scope].selected_param_def_ids,
    onChange: (keys: Array<string | number>) => {
      scopeStates[scope].selected_param_def_ids = keys.map((item) => String(item))
    },
  }
}

function addGitOpsRule() {
  gitopsRules.value.push(createGitOpsRuleFormItem())
}

function removeGitOpsRule(localID: string) {
  gitopsRules.value = gitopsRules.value.filter((item) => item.local_id !== localID)
}

function handleGitOpsRuleSourceChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  const nextKey = String(value || '').trim().toLowerCase()
  const previousTemplate = `{${rule.source_param_key}}`
  rule.source_param_key = nextKey
  rule.source_from = resolveGitOpsRuleSourceFrom(nextKey)
  if (!rule.value_template || rule.value_template === previousTemplate) {
    rule.value_template = nextKey ? `{${nextKey}}` : ''
  }
}

function handleGitOpsRuleTargetChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  if (!value) {
    rule.file_path_template = ''
    rule.document_kind = ''
    rule.document_name = ''
    rule.target_path = ''
    return
  }
  try {
    const parsed = JSON.parse(String(value))
    rule.file_path_template = String(parsed.file_path_template || '').trim()
    rule.document_kind = String(parsed.document_kind || '').trim()
    rule.document_name = String(parsed.document_name || '').trim()
    rule.target_path = String(parsed.target_path || '').trim()
  } catch {
    message.error('YAML 字段选择解析失败，请重新选择')
  }
}

function openYamlFieldSelector(rule: GitOpsRuleFormItem) {
  yamlSelectorRuleID.value = rule.local_id
  yamlSelectorVisible.value = true
  void nextTick(() => {
    syncYamlFieldExpandedKeys()
  })
  void loadGitOpsFieldCandidates(formState.application_id, true)
}

function closeYamlFieldSelector() {
  yamlSelectorVisible.value = false
  yamlSelectorRuleID.value = ''
  yamlFieldExpandedKeys.value = []
}

function currentYamlSelectorRule() {
  return gitopsRules.value.find((item) => item.local_id === yamlSelectorRuleID.value)
}

function handleYamlFieldCandidateSelect(candidate: GitOpsFieldCandidate) {
  const rule = currentYamlSelectorRule()
  if (!rule) {
    return
  }
  handleGitOpsRuleTargetChange(rule, buildGitOpsFieldCandidateValue(candidate))
  closeYamlFieldSelector()
}

function handleSearch() {
  filters.page = 1
  void loadTemplates()
}

function handleReset() {
  filters.application_id = ''
  filters.status = ''
  filters.page = 1
  filters.pageSize = 20
  void loadTemplates()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadTemplates()
}

function openCreateModal() {
  modalMode.value = 'create'
  resetFormState()
  modalVisible.value = true
}

function applyBindingsToForm(bindings: ReleaseTemplateBinding[]) {
  const ciBinding = bindings.find((item) => item.pipeline_scope === 'ci' && item.enabled)
  const cdBinding = bindings.find((item) => item.pipeline_scope === 'cd' && item.enabled)

  scopeStates.ci.enabled = Boolean(ciBinding)
  scopeStates.ci.binding_id = ciBinding?.binding_id || ''
  scopeStates.cd.enabled = Boolean(cdBinding)
  scopeStates.cd.binding_id = cdBinding?.binding_id || ''
}

async function openEditModal(record: ReleaseTemplate) {
  modalMode.value = 'edit'
  resetFormState()
  modalVisible.value = true
  modalLoading.value = true
  try {
    const response = await getReleaseTemplateByID(record.id)
    const { template, bindings, params, gitops_rules } = response.data
    formState.id = template.id
    formState.name = template.name
    formState.application_id = template.application_id
    formState.status = template.status
    formState.remark = template.remark

    await Promise.all([
      loadBindings(formState.application_id),
      loadGitOpsFieldCandidates(formState.application_id),
    ])
    applyBindingsToForm(bindings)

    scopeStates.ci.selected_param_def_ids = params
      .filter((item) => item.pipeline_scope === 'ci')
      .map((item) => item.executor_param_def_id)
    scopeStates.cd.selected_param_def_ids = params
      .filter((item) => item.pipeline_scope === 'cd')
      .map((item) => item.executor_param_def_id)

    await Promise.all([
      loadSelectableParams('ci', true),
      loadSelectableParams('cd', true),
    ])

    gitopsRules.value = (gitops_rules || []).map((item: ReleaseTemplateGitOpsRule) =>
      createGitOpsRuleFormItem({
        source_param_key: item.source_param_key,
        source_from: item.source_from,
        file_path_template: item.file_path_template,
        document_kind: item.document_kind,
        document_name: item.document_name,
        target_path: item.target_path,
        value_template: item.value_template,
      }),
    )
    if (gitopsRules.value.some((item) => formatGitOpsRuleTargetSummary(item).stale)) {
      message.warning('检测到部分 GitOps 规则引用的 YAML 字段已变化，请在保存前重新确认。')
    }
  } catch (error) {
    modalVisible.value = false
    message.error(extractHTTPErrorMessage(error, '发布模板详情加载失败'))
  } finally {
    modalLoading.value = false
  }
}

function closeModal() {
  modalVisible.value = false
  modalLoading.value = false
  resetFormState()
}

function validateScopeState() {
  const enabledScopes = (['ci', 'cd'] as ReleasePipelineScope[]).filter((scope) => scopeStates[scope].enabled)
  if (enabledScopes.length === 0) {
    throw new Error('请至少启用一个执行单元')
  }
  for (const scope of enabledScopes) {
    if (scope === 'cd' && !scopeStates[scope].binding_id.trim()) {
      continue
    }
    if (!scopeStates[scope].binding_id.trim()) {
      throw new Error(`请选择 ${scope.toUpperCase()} 绑定管线`)
    }
  }
  if (isCDUsingArgoCD()) {
    for (const item of gitopsRules.value) {
      if (!item.source_param_key.trim()) {
        throw new Error('请为 GitOps 替换规则选择标准字段')
      }
      if (!item.file_path_template.trim() || !item.document_kind.trim() || !item.target_path.trim()) {
        throw new Error('请为 GitOps 替换规则选择 YAML 字段')
      }
    }
  }
}

async function submitForm() {
  await formRef.value?.validate()
  try {
    validateScopeState()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '模板配置校验失败')
    return
  }

  submitting.value = true
  try {
    if (modalMode.value === 'create') {
      await createReleaseTemplate(buildPayload() as ReleaseTemplatePayload)
      message.success('发布模板创建成功')
    } else {
      await updateReleaseTemplate(formState.id, buildPayload() as UpdateReleaseTemplatePayload)
      message.success('发布模板更新成功')
    }
    closeModal()
    await loadTemplates()
  } catch (error) {
    message.error(
      extractHTTPErrorMessage(error, modalMode.value === 'create' ? '发布模板创建失败' : '发布模板更新失败'),
    )
  } finally {
    submitting.value = false
  }
}

async function handleDelete(record: ReleaseTemplate) {
  deletingID.value = record.id
  try {
    await deleteReleaseTemplate(record.id)
    message.success('发布模板删除成功')
    if (dataSource.value.length === 1 && filters.page > 1) {
      filters.page -= 1
    }
    await loadTemplates()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布模板删除失败'))
  } finally {
    deletingID.value = ''
  }
}

onMounted(async () => {
  await Promise.all([loadPlatformParamMap(), loadApplications()])
  await loadTemplates()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">发布模板</h2>
        <p class="page-subtitle">按应用维护可复用的 CI/CD 发布结构，模板会决定本次发布启用哪些执行单元以及暴露哪些参数。</p>
      </div>
      <a-button type="primary" @click="openCreateModal">
        <template #icon>
          <PlusOutlined />
        </template>
        新增发布模板
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="应用">
          <a-select
            v-model:value="filters.application_id"
            class="filter-select-wide"
            allow-clear
            show-search
            option-filter-prop="label"
            placeholder="全部应用"
            :options="applicationOptions"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="filters.status" class="filter-select" allow-clear placeholder="全部" :options="statusOptions" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card" :bordered="true">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1380 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'binding_type'">
            {{ record.binding_type || '-' }}
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatTime(record.updated_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
              <a-popconfirm
                title="确认删除当前发布模板吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button type="link" size="small" danger :loading="deletingID === record.id">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <div class="pagination-area">
        <a-pagination
          :current="filters.page"
          :page-size="filters.pageSize"
          :total="total"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          :show-total="(count: number) => `共 ${count} 条`"
          @change="handlePageChange"
        />
      </div>
    </a-card>

    <a-modal
      :open="modalVisible"
      :confirm-loading="submitting"
      :title="modalTitle"
      :width="980"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm"
      @cancel="closeModal"
    >
      <a-spin :spinning="modalLoading">
        <a-form ref="formRef" :model="formState" layout="vertical">
        <a-card class="scope-card scope-card-base" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="模板名称" name="name" :rules="[{ required: true, message: '请输入模板名称' }]">
                <a-input v-model:value="formState.name" allow-clear placeholder="例如：标准 CI + CD 发布模板" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
                <a-select v-model:value="formState.status" :options="statusOptions" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="应用" name="application_id" :rules="[{ required: true, message: '请选择应用' }]">
                <a-select
                  v-model:value="formState.application_id"
                  :disabled="modalMode === 'edit'"
                  show-search
                  option-filter-prop="label"
                  placeholder="请选择应用"
                  :options="applicationOptions"
                  @change="handleApplicationChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="备注" name="remark">
                <a-input v-model:value="formState.remark" allow-clear placeholder="可选，补充模板用途说明" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-row :gutter="16">
          <a-col :xs="24" :lg="12">
            <a-card class="scope-card" :bordered="true">
              <template #title>{{ scopeTitles.ci }}</template>
              <template #extra>
                <a-switch :checked="scopeStates.ci.enabled" @change="(checked: boolean) => handleScopeEnabledChange('ci', checked)" />
              </template>

              <a-alert class="scope-alert" type="info" show-icon :message="scopeDescriptions.ci" />

              <a-form-item label="CI 绑定管线" required>
                <a-select
                  v-model:value="scopeStates.ci.binding_id"
                  :disabled="!scopeStates.ci.enabled"
                  show-search
                  allow-clear
                  option-filter-prop="label"
                  placeholder="请选择 CI 绑定管线"
                  :loading="loadingBindings"
                  :options="bindingOptionsByScope.ci"
                  @change="(value: string | undefined) => handleScopeBindingChange('ci', value)"
                />
              </a-form-item>

              <a-alert
                v-if="scopeStates.ci.enabled && selectedBinding('ci')"
                class="scope-binding-alert"
                type="success"
                show-icon
                :message="`当前执行器：${selectedBinding('ci')?.provider}`"
              />

              <div class="scope-table-wrapper">
                <a-table
                  row-key="id"
                  size="small"
                  :columns="selectableParamColumns"
                  :data-source="scopeStates.ci.selectable_params"
                  :loading="scopeStates.ci.loading_params"
                  :pagination="false"
                  :row-selection="getRowSelection('ci')"
                  :scroll="{ x: 860, y: 300 }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'param_name'">
                      <div class="param-name-cell">
                        <span class="param-name">{{ resolvePlatformParamName(record.param_key) }}</span>
                        <span class="param-executor">{{ record.executor_param_name }}</span>
                      </div>
                    </template>
                    <template v-else-if="column.key === 'required'">
                      <a-tag :color="record.required ? 'orange' : 'default'">{{ record.required ? '是' : '否' }}</a-tag>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :lg="12">
            <a-card class="scope-card" :bordered="true">
              <template #title>{{ scopeTitles.cd }}</template>
              <template #extra>
                <a-switch :checked="scopeStates.cd.enabled" @change="(checked: boolean) => handleScopeEnabledChange('cd', checked)" />
              </template>

              <a-alert class="scope-alert" type="info" show-icon :message="scopeDescriptions.cd" />

              <a-form-item label="CD 绑定管线">
                <a-select
                  v-model:value="scopeStates.cd.binding_id"
                  :disabled="!scopeStates.cd.enabled"
                  show-search
                  allow-clear
                  option-filter-prop="label"
                  placeholder="留空则走 ArgoCD，可选 Jenkins 管线"
                  :loading="loadingBindings"
                  :options="bindingOptionsByScope.cd"
                  @change="(value: string | undefined) => handleScopeBindingChange('cd', value)"
                />
              </a-form-item>

              <a-alert
                v-if="isCDUsingArgoCD()"
                class="scope-binding-alert"
                type="warning"
                show-icon
                message="当前未选择 CD 绑定管线，将按 ArgoCD 执行。"
                description="先从左侧 CI 已勾选的标准字段中选择要引用的 Key，再为它绑定 GitOps YAML 字段；系统内置字段也可以直接引用。image_version 在 Jenkins CI 下默认取本次构建号 BUILD_NUMBER，当前版本如果使用 project_name，会按单值场景处理。"
              />
              <a-alert
                v-else-if="scopeStates.cd.enabled && selectedBinding('cd')"
                class="scope-binding-alert"
                type="success"
                show-icon
                :message="`当前执行器：${selectedBinding('cd')?.provider}`"
              />

              <div v-if="isCDUsingArgoCD()" class="gitops-rule-panel">
                <div class="gitops-rule-header">
                  <div>
                    <div class="gitops-rule-title">GitOps 替换规则</div>
                    <div class="gitops-rule-subtitle">先选可引用的标准字段，再把它绑定到 GitOps YAML 的具体位置；打开模板或字段选择器时会实时拉取最新 YAML 结构。</div>
                  </div>
                  <a-button type="dashed" size="small" @click="addGitOpsRule">新增规则</a-button>
                </div>

                <a-empty
                  v-if="!loadingGitOpsFieldCandidates && gitOpsFieldCandidates.length === 0"
                  description="当前应用还没有扫描到可替换的 YAML 字段，请先确认 GitOps 目录与 YAML 文件是否已准备好。"
                />

                <div v-for="rule in gitopsRules" :key="rule.local_id" class="gitops-rule-item">
                  <div class="gitops-rule-item-header">
                    <div class="gitops-rule-item-title">规则 {{ gitopsRules.findIndex((item) => item.local_id === rule.local_id) + 1 }}</div>
                    <a-button danger type="link" @click="removeGitOpsRule(rule.local_id)">删除</a-button>
                  </div>

                  <a-row :gutter="12">
                    <a-col :span="24">
                      <a-form-item label="标准字段">
                        <a-select
                          :value="rule.source_param_key || undefined"
                          show-search
                          allow-clear
                          option-filter-prop="label"
                          placeholder="请选择 CI 已勾选字段或系统内置字段"
                          :options="gitOpsSourceOptions"
                          @change="(value: string | undefined) => handleGitOpsRuleSourceChange(rule, value)"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <div class="gitops-rule-source-tip">
                    当前来源：{{ resolveGitOpsSourceLabel(rule.source_param_key) }}
                  </div>

                  <div class="gitops-target-preview">
                    <div class="gitops-target-preview-header">
                      <div class="gitops-target-preview-title">YAML 目标字段</div>
                      <a-space>
                        <a-tag :color="formatGitOpsRuleTargetSummary(rule).stale ? 'error' : 'processing'">
                          {{ formatGitOpsRuleTargetSummary(rule).stale ? '字段已变化' : '字段有效' }}
                        </a-tag>
                        <a-button class="yaml-selector-button" @click="openYamlFieldSelector(rule)">
                          {{ rule.target_path ? '重新选择 YAML 字段' : '选择 YAML 字段' }}
                        </a-button>
                      </a-space>
                    </div>
                    <a-descriptions :column="1" size="small" bordered>
                      <a-descriptions-item label="资源">
                        {{ formatGitOpsRuleTargetSummary(rule).title }}
                      </a-descriptions-item>
                      <a-descriptions-item label="文件">
                        <span class="gitops-code-text">{{ formatGitOpsRuleTargetSummary(rule).file }}</span>
                      </a-descriptions-item>
                      <a-descriptions-item label="字段路径">
                        <span class="gitops-code-text">{{ formatGitOpsRuleTargetSummary(rule).path }}</span>
                      </a-descriptions-item>
                      <a-descriptions-item label="当前示例值">
                        <span class="gitops-code-text">{{ formatGitOpsRuleTargetSummary(rule).sample }}</span>
                      </a-descriptions-item>
                    </a-descriptions>
                  </div>

                  <a-form-item label="取值模版">
                    <a-input
                      v-model:value="rule.value_template"
                      allow-clear
                      placeholder="默认会使用 {标准Key}，例如 {project_name}-config"
                    />
                  </a-form-item>
                </div>
              </div>

              <div v-else class="scope-table-wrapper">
                <a-table
                  row-key="id"
                  size="small"
                  :columns="selectableParamColumns"
                  :data-source="scopeStates.cd.selectable_params"
                  :loading="scopeStates.cd.loading_params"
                  :pagination="false"
                  :row-selection="getRowSelection('cd')"
                  :scroll="{ x: 860, y: 300 }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'param_name'">
                      <div class="param-name-cell">
                        <span class="param-name">{{ resolvePlatformParamName(record.param_key) }}</span>
                        <span class="param-executor">{{ record.executor_param_name }}</span>
                      </div>
                    </template>
                    <template v-else-if="column.key === 'required'">
                      <a-tag :color="record.required ? 'orange' : 'default'">{{ record.required ? '是' : '否' }}</a-tag>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-card>
          </a-col>
        </a-row>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal
      :open="yamlSelectorVisible"
      title="选择 YAML 字段"
      :width="900"
      :body-style="{ maxHeight: '72vh', overflow: 'auto' }"
      ok-text="关闭"
      :cancel-button-props="{ style: { display: 'none' } }"
      @ok="closeYamlFieldSelector"
      @cancel="closeYamlFieldSelector"
    >
      <a-alert
        class="scope-binding-alert"
        type="info"
        show-icon
        message="已按 文件 -> 资源 -> 字段 的顺序整理为可选视图"
        description="这里会实时读取当前 GitOps 仓库里的 YAML 叶子字段。点击字段行即可绑定到当前规则，若 YAML 刚调整过，可以先点“同步 YAML”。"
      />
      <div class="yaml-selector-toolbar">
        <a-button size="small" :loading="loadingGitOpsFieldCandidates" @click="loadGitOpsFieldCandidates(formState.application_id)">
          <template #icon><ReloadOutlined /></template>
          同步 YAML
        </a-button>
      </div>
      <a-spin :spinning="loadingGitOpsFieldCandidates">
        <a-empty
          v-if="!loadingGitOpsFieldCandidates && gitOpsFieldCandidates.length === 0"
          description="当前没有可选择的 YAML 字段"
        />
        <div v-else class="yaml-field-document-list">
          <a-collapse v-model:activeKey="yamlFieldExpandedKeys" ghost class="yaml-field-collapse">
            <a-collapse-panel
              v-for="group in gitOpsFieldDocumentGroups"
              :key="group.key"
              class="yaml-field-document-card"
            >
              <template #header>
                <div class="yaml-field-document-header">
                  <div>
                    <div class="yaml-field-document-title">{{ group.display_name }}</div>
                    <div class="yaml-field-document-file">{{ group.file_path_template }}</div>
                    <div class="yaml-field-document-preview">字段预览：{{ yamlFieldPreview(group) || '暂无可选字段' }}</div>
                  </div>
                  <a-tag color="blue">{{ group.fields.length }} 个字段</a-tag>
                </div>
              </template>

              <div class="yaml-field-lines">
                <div
                  v-for="field in group.fields"
                  :key="buildGitOpsFieldCandidateValue(field)"
                  class="yaml-field-line"
                  :class="{ 'yaml-field-line-selected': isYamlFieldCandidateSelected(field) }"
                >
                  <div class="yaml-field-line-main" :style="yamlFieldIndentStyle(field.target_path)">
                    <span class="yaml-field-line-key">{{ yamlFieldLeafLabel(field.target_path) }}</span>
                    <span class="yaml-field-line-value">: {{ field.sample_value || '-' }}</span>
                  </div>
                  <div class="yaml-field-line-actions">
                    <div v-if="yamlFieldParentPath(field.target_path)" class="yaml-field-line-path">
                      {{ yamlFieldParentPath(field.target_path) }}
                    </div>
                    <a-button
                      type="link"
                      size="small"
                      @click="handleYamlFieldCandidateSelect(field)"
                    >
                      {{ isYamlFieldCandidateSelected(field) ? '已选中' : '选择字段' }}
                    </a-button>
                  </div>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.filter-card,
.table-card,
.scope-card {
  border-radius: var(--radius-xl);
}

.scope-card-base {
  margin-bottom: 16px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, rgba(255, 255, 255, 1) 100%);
}

.filter-form {
  display: flex;
  gap: 8px;
}

.filter-select {
  width: 140px;
}

.filter-select-wide {
  width: 260px;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.danger-icon {
  color: #ff4d4f;
}

.scope-alert,
.scope-binding-alert {
  margin-bottom: 12px;
}

.scope-table-wrapper {
  min-height: 320px;
}

.gitops-rule-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gitops-rule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.gitops-rule-title {
  font-weight: 600;
  color: #111827;
}

.gitops-rule-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.gitops-rule-item {
  padding: 14px;
  border: 1px solid #dbe2ea;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.gitops-rule-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.gitops-rule-item-title {
  font-weight: 600;
  color: #111827;
}

.yaml-selector-button {
  min-height: 36px;
}

.gitops-rule-source-tip {
  margin: -4px 0 12px;
  color: #6b7280;
  font-size: 12px;
}

.gitops-target-preview {
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}

.gitops-target-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.gitops-target-preview-title {
  font-weight: 600;
  color: #111827;
}

.gitops-code-text {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  word-break: break-all;
}

.yaml-selector-toolbar {
  display: flex;
  justify-content: flex-end;
  margin: 12px 0;
}

.yaml-field-document-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 560px;
  overflow: auto;
}

.yaml-field-collapse {
  background: transparent;
}

.yaml-field-collapse :deep(.ant-collapse-item) {
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
}

.yaml-field-collapse :deep(.ant-collapse-header) {
  padding: 0 !important;
  align-items: stretch !important;
}

.yaml-field-collapse :deep(.ant-collapse-expand-icon) {
  padding-inline-start: 16px;
  align-self: center;
}

.yaml-field-collapse :deep(.ant-collapse-content-box) {
  padding: 0 !important;
}

.yaml-field-document-card {
  overflow: hidden;
}

.yaml-field-document-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #edf2f7;
}

.yaml-field-document-title {
  font-weight: 600;
  color: #111827;
}

.yaml-field-document-file {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  word-break: break-all;
}

.yaml-field-document-preview {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

.yaml-field-lines {
  display: flex;
  flex-direction: column;
}

.yaml-field-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #f1f5f9;
  padding: 10px 16px;
  background: transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.yaml-field-line:first-child {
  border-top: 0;
}

.yaml-field-line:hover {
  background: #f8fafc;
}

.yaml-field-line-selected {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.yaml-field-line-main {
  flex: 1;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  color: #111827;
  word-break: break-all;
}

.yaml-field-line-key {
  font-weight: 600;
}

.yaml-field-line-value {
  color: #2563eb;
  word-break: break-all;
}

.yaml-field-line-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 160px;
}

.yaml-field-line-path {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
  word-break: break-all;
}

.param-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.param-name {
  font-weight: 600;
  color: #1f2937;
}

.param-executor {
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 992px) {
  .scope-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .yaml-field-line {
    flex-direction: column;
  }

  .yaml-field-line-actions {
    width: 100%;
    min-width: 0;
    align-items: flex-start;
  }

  .yaml-field-line-path {
    text-align: left;
  }
}
</style>
