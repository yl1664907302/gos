<script setup lang="ts">
import { CopyOutlined, ExclamationCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { listApplications } from '../../api/application'
import { listAllAgentTasks } from '../../api/agent'
import { listGitOpsFieldCandidates, listGitOpsValuesCandidates } from '../../api/gitops'
import { listNotificationHooks } from '../../api/notification'
import { listPlatformParamDicts } from '../../api/platform-param'
import { getPipelineBindingByID, listPipelineBindings, listApplicationExecutorParamDefs } from '../../api/pipeline'
import { listUserOptions } from '../../api/user'
import {
  createReleaseTemplate,
  deleteReleaseTemplate,
  getReleaseTemplateByID,
  listReleaseTemplates,
  updateReleaseTemplate,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { Application } from '../../types/application'
import type { AgentTask } from '../../types/agent'
import type { NotificationHook } from '../../types/notification'
import type { PipelineBinding, ExecutorParamDef } from '../../types/pipeline'
import type { GitOpsFieldCandidate, GitOpsValuesCandidate } from '../../types/gitops'
import type { PlatformParamDict } from '../../types/platform-param'
import type { UserOption } from '../../types/user'
import type {
  ReleasePipelineScope,
  ReleaseTemplate,
  ReleaseTemplateBinding,
  ReleaseTemplateHook,
  ReleaseTemplateHookPayload,
  ReleaseTemplateApprovalMode,
  ReleaseTemplateParamConfigPayload,
  ReleaseTemplateParamValueSource,
  ReleaseTemplateGitOpsRule,
  ReleaseTemplateGitOpsRulePayload,
  ReleaseTemplateGitOpsType,
  ReleaseTemplatePayload,
  ReleaseTemplateStatus,
  UpdateReleaseTemplatePayload,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

type FormMode = 'create' | 'edit'
type CDMode = 'pipeline' | 'argocd'

type ScopeState = {
  enabled: boolean
  binding_id: string
  selected_param_def_ids: string[]
  selectable_params: ExecutorParamDef[]
  loading_params: boolean
}

type TemplateParamConfigState = {
  value_source: ReleaseTemplateParamValueSource
  source_param_key: string
  fixed_value: string
}

interface TemplateFormState {
  id: string
  name: string
  application_id: string
  status: ReleaseTemplateStatus
  approval_enabled: boolean
  approval_mode: ReleaseTemplateApprovalMode
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
  source_from: 'ci' | 'builtin' | 'cd_input'
  file_path_template: string
  document_kind: string
  document_name: string
  target_path: string
  value_template: string
}

type ReleaseTemplateHookTypePreview = 'agent_task' | 'notification_hook' | 'webhook_notification'
type ReleaseTemplateHookTriggerConditionPreview = 'on_success' | 'on_failed' | 'always'
type ReleaseTemplateHookFailurePolicyPreview = 'block_release' | 'warn_only'

interface HookFormItem {
  local_id: string
  name: string
  hook_type: ReleaseTemplateHookTypePreview
  trigger_condition: ReleaseTemplateHookTriggerConditionPreview
  failure_policy: ReleaseTemplateHookFailurePolicyPreview
  target_id: string
  target_name: string
  webhook_method: 'POST' | 'PUT' | 'PATCH'
  webhook_url: string
  webhook_body_template: string
  note: string
}

const builtinTemplateSourceKeys = new Set([
  'app_key',
  'app_name',
  'env',
  'env_code',
  'branch',
  'git_ref',
  'image_version',
  'image_tag',
])

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
  approval_enabled: false,
  approval_mode: 'any',
  remark: '',
})
const approvalApproverIDs = ref<string[]>([])
const userOptions = ref<UserOption[]>([])

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

const scopeParamConfigs = reactive<Record<ReleasePipelineScope, Record<string, TemplateParamConfigState>>>({
  ci: {},
  cd: {},
})

const filters = reactive({
  application_id: '',
  status: '' as '' | ReleaseTemplateStatus,
  page: 1,
  pageSize: 20,
})

const applicationRecords = ref<Application[]>([])
const applicationOptions = ref<SelectOption[]>([])
const bindingOptions = ref<BindingOption[]>([])
const loadedTemplateBindings = ref<ReleaseTemplateBinding[]>([])
const scopeBindingWarnings = reactive<Record<ReleasePipelineScope, string>>({
  ci: '',
  cd: '',
})
const templateBindingWarnings = ref<Record<string, string>>({})
const templateBindingWarningCache = ref<Record<string, string>>({})
const loadingBindings = ref(false)
const platformParamNameMap = ref<Record<string, string>>({})
const platformParamDicts = ref<PlatformParamDict[]>([])
const gitOpsFieldCandidates = ref<GitOpsFieldCandidate[]>([])
const gitOpsValuesCandidates = ref<GitOpsValuesCandidate[]>([])
const loadingGitOpsFieldCandidates = ref(false)
const gitopsRules = ref<GitOpsRuleFormItem[]>([])
const gitOpsType = ref<ReleaseTemplateGitOpsType>('kustomize')
const cdMode = ref<CDMode>('argocd')
const argocdInfoActiveKeys = ref<string[]>([])
const releasePageGuideActiveKeys = ref<string[]>([])
const gitopsRuleActiveKeys = ref<string[]>([])
const templateHooks = ref<HookFormItem[]>([])
const hookTypePickerVisible = ref(false)
const pendingHookType = ref<ReleaseTemplateHookTypePreview>('agent_task')
const agentTaskTemplates = ref<AgentTask[]>([])
const loadingAgentTaskTemplates = ref(false)
const notificationHooks = ref<NotificationHook[]>([])
const loadingNotificationHooks = ref(false)
const bindingOptionsCache = ref<Record<string, BindingOption[]>>({})
const selectableParamsCache = ref<Record<string, ExecutorParamDef[]>>({})
const gitOpsFieldCandidateCache = ref<Record<string, GitOpsFieldCandidate[]>>({})
const gitOpsValuesCandidateCache = ref<Record<string, GitOpsValuesCandidate[]>>({})
const bindingLookupCache = ref<Record<string, boolean>>({})

const scopeTitles: Record<ReleasePipelineScope, string> = {
  ci: 'CI 配置',
  cd: 'CD 配置',
}

const scopeDescriptions: Record<ReleasePipelineScope, string> = {
  ci: 'CI 固定使用 Jenkins；参数仅允许来自 CI 绑定管线，并且必须已完成平台标准 Key 映射。',
  cd: '先明确当前模板的 CD 方式：选择管线时可配置发布时填写、固定值、沿用 CI 字段或内置字段；选择 ArgoCD 时只配置 GitOps / ArgoCD 相关内容。',
}

const hookVariableSourceTags = ['固定值', '标准字段', '内置字段']

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

const approvalModeOptions = [
  { label: '任一人通过', value: 'any' },
  { label: '全部通过', value: 'all' },
] as const

const userOptionChoices = computed(() =>
  userOptions.value.map((item) => ({
    label: `${item.display_name || item.username} (${item.username})`,
    value: item.id,
  })),
)

function hookTypeLabel(type: ReleaseTemplateHookTypePreview) {
  switch (type) {
    case 'agent_task':
      return 'Agent 任务'
    case 'notification_hook':
      return '通知 Hook'
    default:
      return 'Webhook 通知'
  }
}

function createHookFormItem(type: ReleaseTemplateHookTypePreview): HookFormItem {
  return {
    local_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name:
      type === 'agent_task'
        ? '发布后 Agent 任务'
        : type === 'notification_hook'
          ? '发布后通知 Hook'
          : '发布后 Webhook 通知',
    hook_type: type,
    trigger_condition: 'on_success',
    failure_policy: type === 'webhook_notification' ? 'warn_only' : 'block_release',
    target_id: '',
    target_name: '',
    webhook_method: 'POST',
    webhook_url: '',
    webhook_body_template: `{
  "order_no": "{order_no}",
  "env": "{env}"
}`,
    note: '',
  }
}

function createHookFormItemFromResponse(item: ReleaseTemplateHook): HookFormItem {
  return {
    local_id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: item.name,
    hook_type: item.hook_type,
    trigger_condition: item.trigger_condition,
    failure_policy: item.failure_policy,
    target_id: item.target_id || '',
    target_name: item.target_name || '',
    webhook_method: ((item.webhook_method || 'POST').toUpperCase() as 'POST' | 'PUT' | 'PATCH'),
    webhook_url: item.webhook_url || '',
    webhook_body_template: item.webhook_body || '',
    note: item.note || '',
  }
}

const hookSummaryItems = computed(() => [
  { label: 'Hook 阶段', value: 'post_release' },
  { label: '执行方式', value: templateHooks.value.length ? '串行执行' : '待配置' },
  { label: 'Hook 数量', value: `${templateHooks.value.length} 个` },
  { label: '变量', value: '标准平台 Key / 内置字段' },
])

function agentTaskTypeLabel(taskType: string) {
  switch (taskType) {
    case 'script_file_task':
      return '脚本文件任务'
    case 'file_distribution_task':
      return '文件下发任务'
    default:
      return 'Shell 脚本'
  }
}

const agentTaskTemplateOptions = computed<SelectOption[]>(() =>
  agentTaskTemplates.value
    .filter((item) => !String(item.agent_id || '').trim())
    .map((item) => ({
      label: `${item.name} · ${item.task_mode === 'resident' ? '常驻任务' : '临时任务'} / ${agentTaskTypeLabel(item.task_type)}`,
      value: item.id,
    })),
)

const notificationHookOptions = computed<SelectOption[]>(() =>
  notificationHooks.value
    .filter((item) => item.enabled)
    .map((item) => ({
      label: `${item.name} · ${item.source_name} / ${item.markdown_template_name}`,
      value: item.id,
    })),
)

function findAgentTaskTemplate(taskID: string) {
  const normalized = String(taskID || '').trim()
  if (!normalized) {
    return null
  }
  return agentTaskTemplates.value.find((item) => item.id === normalized) || null
}

function syncHookTargetName(item: HookFormItem) {
  if (item.hook_type === 'agent_task') {
    const selected = findAgentTaskTemplate(item.target_id)
    item.target_name = selected?.name || ''
    return
  }
  if (item.hook_type === 'notification_hook') {
    const selected = notificationHooks.value.find((candidate) => candidate.id === item.target_id)
    item.target_name = selected?.name || ''
    return
  }
  if (item.hook_type !== 'webhook_notification') {
    item.target_name = ''
    return
  }
  item.target_name = item.webhook_url.trim()
}

function openHookTypePicker() {
  pendingHookType.value = 'agent_task'
  hookTypePickerVisible.value = true
}

function confirmAddHook() {
  templateHooks.value.push(createHookFormItem(pendingHookType.value))
  hookTypePickerVisible.value = false
}

function removeHook(localID: string) {
  templateHooks.value = templateHooks.value.filter((item) => item.local_id !== localID)
}

function hookTriggerLabel(type: ReleaseTemplateHookTriggerConditionPreview) {
  switch (type) {
    case 'on_success':
      return '主流程成功后'
    case 'on_failed':
      return '主流程失败后'
    default:
      return '始终触发'
  }
}

function hookFailureLabel(type: ReleaseTemplateHookFailurePolicyPreview) {
  return type === 'block_release' ? '失败阻断发布单' : '失败仅告警'
}

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

  platformParamDicts.value.forEach((item) => {
    const key = String(item.param_key || '').trim().toLowerCase()
    if (!item.cd_self_fill || item.status !== 1 || !key || seen.has(key)) {
      return
    }
    seen.add(key)
    options.push({
      label: `${item.name} (${key}) · CD 自填字段`,
      value: key,
    })
  })

  return options
})

const ciTemplateSourceOptions = computed<SelectOption[]>(() => {
  const options: SelectOption[] = []
  const selectedCIParamIDs = new Set(scopeStates.ci.selected_param_def_ids)
  scopeStates.ci.selectable_params.forEach((item) => {
    if (!selectedCIParamIDs.has(item.id)) {
      return
    }
    const key = String(item.param_key || '').trim().toLowerCase()
    if (!key) {
      return
    }
    options.push({
      label: `${resolvePlatformParamName(key)} (${key})`,
      value: key,
    })
  })
  return options
})

const builtinTemplateSourceOptions = computed<SelectOption[]>(() =>
  platformParamDicts.value
    .filter((item) => {
      const key = String(item.param_key || '').trim().toLowerCase()
      return item.status === 1 && (item.builtin || builtinTemplateSourceKeys.has(key))
    })
    .map((item) => ({
      label: `${item.name} (${item.param_key})`,
      value: String(item.param_key || '').trim().toLowerCase(),
    })),
)

const selectedApplicationRecord = computed(() =>
  applicationRecords.value.find((item) => item.id === formState.application_id.trim()) || null,
)

const argocdInstallCommand = computed(() => {
  const appKey = selectedApplicationRecord.value?.key?.trim() || 'java-nantong-test'
  const serviceName = 'gateway'
  const env = 'dev'
  const repoURL = 'http://192.168.1.195/sre/deploy-manifests.git'
  const namespace = 'nantong-20'
  return [
    `argocd app create ${appKey}-${env}-${serviceName} \\`,
    `  --repo ${repoURL} \\`,
    `  --path apps/helm \\`,
    `  --dest-server https://kubernetes.default.svc \\`,
    `  --dest-namespace ${namespace} \\`,
    `  --project default \\`,
    `  --helm-set-string fullnameOverride=${serviceName} \\`,
    `  --values values-${env}.yaml \\`,
    `  --values ${serviceName}.values-${env}.yaml \\`,
    `  --values platform.values-${env}.yaml`,
  ].join('\n')
})

function selectedBinding(scope: ReleasePipelineScope) {
  return bindingOptionsByScope.value[scope].find((item) => item.value === scopeStates[scope].binding_id)
}

function isCDUsingArgoCD() {
  return scopeStates.cd.enabled && cdMode.value === 'argocd'
}

function isCDUsingPipeline() {
  return scopeStates.cd.enabled && cdMode.value === 'pipeline'
}

function defaultTemplateParamValueSource(scope: ReleasePipelineScope): ReleaseTemplateParamValueSource {
  return 'release_input'
}

function createTemplateParamConfigState(
  scope: ReleasePipelineScope,
  partial?: Partial<TemplateParamConfigState>,
): TemplateParamConfigState {
  return {
    value_source: partial?.value_source || defaultTemplateParamValueSource(scope),
    source_param_key: String(partial?.source_param_key || '').trim().toLowerCase(),
    fixed_value: String(partial?.fixed_value || ''),
  }
}

function selectedScopeParamDefs(scope: ReleasePipelineScope) {
  const selected = new Set(scopeStates[scope].selected_param_def_ids)
  return scopeStates[scope].selectable_params.filter((item) => selected.has(item.id))
}

function syncScopeParamConfigs(scope: ReleasePipelineScope) {
  const state = scopeStates[scope]
  const nextConfigs: Record<string, TemplateParamConfigState> = {}
  state.selected_param_def_ids.forEach((id) => {
    nextConfigs[id] = createTemplateParamConfigState(scope, scopeParamConfigs[scope][id])
  })
  scopeParamConfigs[scope] = nextConfigs
}

function getTemplateParamConfig(scope: ReleasePipelineScope, paramDefID: string) {
  if (!scopeParamConfigs[scope][paramDefID]) {
    scopeParamConfigs[scope][paramDefID] = createTemplateParamConfigState(scope)
  }
  return scopeParamConfigs[scope][paramDefID]
}

function handleTemplateParamValueSourceChange(
  scope: ReleasePipelineScope,
  paramDefID: string,
  value: ReleaseTemplateParamValueSource,
) {
  const config = getTemplateParamConfig(scope, paramDefID)
  config.value_source = value
  if (value !== 'fixed') {
    config.fixed_value = ''
  }
  if (value !== 'ci_param' && value !== 'builtin') {
    config.source_param_key = ''
  }
}

function resolveTemplateParamSourceOptions(scope: ReleasePipelineScope, config: TemplateParamConfigState) {
  if (scope === 'cd' && config.value_source === 'ci_param') {
    return ciTemplateSourceOptions.value
  }
  if (scope === 'cd' && config.value_source === 'builtin') {
    return builtinTemplateSourceOptions.value
  }
  return []
}

function resolveTemplateParamSourceLabel(scope: ReleasePipelineScope, config: TemplateParamConfigState) {
  if (scope === 'ci') {
    return config.value_source === 'fixed' ? '固定值' : '发布时填写'
  }
  switch (config.value_source) {
    case 'fixed':
      return '固定值'
    case 'ci_param':
      return '沿用 CI 标准字段'
    case 'builtin':
      return '内置字段'
    default:
      return '发布时填写'
  }
}

function buildTemplateParamConfigs(scope: ReleasePipelineScope): ReleaseTemplateParamConfigPayload[] {
  return scopeStates[scope].selected_param_def_ids.map((id) => {
    const config = getTemplateParamConfig(scope, id)
    return {
      executor_param_def_id: id,
      value_source: config.value_source,
      source_param_key: config.source_param_key || undefined,
      fixed_value: config.fixed_value || undefined,
    }
  })
}

function normalizedGitOpsType(type?: string): ReleaseTemplateGitOpsType {
  const value = String(type || '').trim().toLowerCase()
  return value === 'helm' ? 'helm' : 'kustomize'
}

function isHelmGitOps() {
  return isCDUsingArgoCD() && normalizedGitOpsType(gitOpsType.value) === 'helm'
}

function isUnsupportedKustomizeGitOps() {
  return isCDUsingArgoCD() && normalizedGitOpsType(gitOpsType.value) === 'kustomize'
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
    file_path_template: normalizeHelmValuesFilePathTemplate(String(partial?.file_path_template || '').trim()),
    document_kind: String(partial?.document_kind || '').trim(),
    document_name: String(partial?.document_name || '').trim(),
    target_path: String(partial?.target_path || '').trim(),
    value_template: String(
      partial?.value_template ||
        (sourceKey && partial?.source_from !== 'cd_input' && resolveGitOpsRuleSourceFrom(sourceKey) !== 'cd_input'
          ? `{${sourceKey}}`
          : ''),
    ).trim(),
  }
}

function resolveGitOpsRuleSourceFrom(paramKey: string): 'ci' | 'builtin' | 'cd_input' {
  const normalized = String(paramKey || '').trim().toLowerCase()
  if (!normalized) {
    return 'ci'
  }
  const manualItem = platformParamDicts.value.find(
    (item) => String(item.param_key || '').trim().toLowerCase() === normalized && item.cd_self_fill && item.status === 1,
  )
  if (manualItem) {
    return 'cd_input'
  }
  const selectedCIParamIDs = new Set(scopeStates.ci.selected_param_def_ids)
  const fromCI = scopeStates.ci.selectable_params.some(
    (item) => selectedCIParamIDs.has(item.id) && String(item.param_key || '').trim().toLowerCase() === normalized,
  )
  return fromCI ? 'ci' : 'builtin'
}

function normalizeHelmValuesFilePathTemplate(value: string) {
  const normalized = String(value || '').trim().replace(/\\/g, '/')
  if (!normalized.startsWith('apps/')) {
    return normalized
  }
  const rest = normalized.slice('apps/'.length)
  const parts = rest.split('/')
  if (parts.length < 3) {
    return normalized
  }
  if (parts[0] === 'helm') {
    return normalized
  }
  if (parts[1] === 'helm') {
    return ['apps', 'helm', ...parts.slice(2)].join('/')
  }
  return normalized
}

function yamlCandidatesForRule(rule: GitOpsRuleFormItem) {
  return gitOpsFieldCandidates.value
}

function pathBaseName(value: string) {
  const normalized = String(value || '').trim()
  if (!normalized) {
    return ''
  }
  const segments = normalized.split('/')
  return segments[segments.length - 1] || normalized
}

function isPlatformValuesFileTemplate(filePathTemplate: string) {
  const baseName = pathBaseName(filePathTemplate)
  return /^platform\.values(?:-[^.]+)?\.ya?ml$/i.test(baseName)
}

function platformValuesCandidates() {
  return gitOpsValuesCandidates.value.filter((item) => isPlatformValuesFileTemplate(item.file_path_template))
}

function yamlFileOptions(rule: GitOpsRuleFormItem): SelectOption[] {
  const seen = new Set<string>()
  return yamlCandidatesForRule(rule)
    .filter((item) => {
      const key = String(item.file_path_template || '').trim()
      if (!key || seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
    .map((item) => ({
      label: `${pathBaseName(item.file_path_template)} · ${item.file_path_template}`,
      value: item.file_path_template,
    }))
}

function yamlDocumentOptions(rule: GitOpsRuleFormItem): SelectOption[] {
  if (!rule.file_path_template) {
    return []
  }
  const seen = new Set<string>()
  return yamlCandidatesForRule(rule)
    .filter((item) => String(item.file_path_template || '').trim() === String(rule.file_path_template || '').trim())
    .filter((item) => {
      const key = `${item.document_kind}::${item.document_name || ''}`
      if (!item.document_kind || seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
    .map((item) => ({
      label: item.document_name ? `${item.document_kind} / ${item.document_name}` : item.document_kind,
      value: JSON.stringify({
        document_kind: item.document_kind,
        document_name: item.document_name || '',
      }),
    }))
}

function yamlFieldOptions(rule: GitOpsRuleFormItem): SelectOption[] {
  if (!rule.file_path_template || !rule.document_kind) {
    return []
  }
  return yamlCandidatesForRule(rule)
    .filter((item) =>
      String(item.file_path_template || '').trim() === String(rule.file_path_template || '').trim() &&
      String(item.document_kind || '').trim() === String(rule.document_kind || '').trim() &&
      String(item.document_name || '').trim() === String(rule.document_name || '').trim(),
    )
    .map((item) => ({
      label: `${item.target_path}${item.sample_value ? ` · 示例: ${item.sample_value}` : ''}`,
      value: item.target_path,
    }))
}

function valuesFileOptions(): SelectOption[] {
  const seen = new Set<string>()
  return platformValuesCandidates()
    .filter((item) => {
      const key = String(item.file_path_template || '').trim()
      if (!key || seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
    .map((item) => ({
      label: `${pathBaseName(item.file_path_template)} · ${item.file_path_template}`,
      value: item.file_path_template,
    }))
}

function valuesPathOptions(rule: GitOpsRuleFormItem): SelectOption[] {
  const selectedFileRaw = String(rule.file_path_template || '').trim()
  const selectedFile = isPlatformValuesFileTemplate(selectedFileRaw) ? selectedFileRaw : ''
  return platformValuesCandidates()
    .filter((item) => {
      if (!selectedFile) {
        return true
      }
      return String(item.file_path_template || '').trim() === selectedFile
    })
    .map((item) => ({
      label: selectedFile
        ? `${item.target_path}${item.sample_value ? ` · 示例: ${item.sample_value}` : ''}`
        : `${pathBaseName(item.file_path_template)} · ${item.target_path}${item.sample_value ? ` · 示例: ${item.sample_value}` : ''}`,
      value: JSON.stringify({
        file_path_template: item.file_path_template,
        target_path: item.target_path,
      }),
    }))
}

function selectedYamlDocumentValue(rule: GitOpsRuleFormItem) {
  if (!rule.document_kind) {
    return undefined
  }
  return JSON.stringify({
    document_kind: rule.document_kind,
    document_name: rule.document_name || '',
  })
}

async function reloadCurrentGitOpsCandidates() {
  const appID = String(formState.application_id || '').trim()
  if (!appID) {
    return
  }
  if (isHelmGitOps()) {
    await loadGitOpsValuesCandidates(appID, false, true)
    return
  }
  await loadGitOpsFieldCandidates(appID, false, true)
}

function resolveGitOpsSourceLabel(paramKey: string) {
  const normalized = String(paramKey || '').trim().toLowerCase()
  if (!normalized) {
    return '未选择标准字段'
  }
  return gitOpsSourceOptions.value.find((item) => item.value === normalized)?.label || `${resolvePlatformParamName(normalized)} (${normalized})`
}

function gitOpsRuleUsesCDInput(rule: GitOpsRuleFormItem) {
  return rule.source_from === 'cd_input'
}

function resolveGitOpsValueTemplatePlaceholder(rule: GitOpsRuleFormItem) {
  if (gitOpsRuleUsesCDInput(rule)) {
    return '请填写 CD 固定值，例如 registry.example.com/app:stable'
  }
  return isHelmGitOps() ? '默认会使用 {标准Key}，例如 {image_version}' : '默认会使用 {标准Key}，例如 {param_key}-config'
}

function resolveArgoCDModeDescription() {
  return isHelmGitOps()
    ? '当前 GitOps 类型为 Helm。平台会在发布时根据基础环境 env 自动命中已配置的 ArgoCD 实例，并按规则修改 Helm values 文件后触发同步，不会直接修改 Helm 渲染后的 Kubernetes YAML。image_version 在 Jenkins CI 下默认取本次构建号 BUILD_NUMBER。'
    : '当前 GitOps 类型为 Kustomize。该模式当前在模板页暂不支持配置，请先切换到 Helm。'
}

async function copyArgoCDInstallCommand() {
  try {
    await navigator.clipboard.writeText(argocdInstallCommand.value)
    message.success('ArgoCD 创建命令已复制')
  } catch {
    message.error('复制失败，请手工复制命令')
  }
}

function matchesGitOpsRuleCandidate(rule: GitOpsRuleFormItem, candidate: GitOpsFieldCandidate) {
  return (
    candidate.file_path_template === rule.file_path_template &&
    candidate.document_kind === rule.document_kind &&
    String(candidate.document_name || '') === String(rule.document_name || '') &&
    candidate.target_path === rule.target_path
  )
}

function findGitOpsFieldCandidate(rule: GitOpsRuleFormItem) {
  return gitOpsFieldCandidates.value.find((item) => matchesGitOpsRuleCandidate(rule, item))
}

function formatGitOpsRuleTargetSummary(rule: GitOpsRuleFormItem) {
  if (normalizedGitOpsType(gitOpsType.value) === 'helm') {
    const candidate = platformValuesCandidates().find(
      (item) =>
        String(item.file_path_template || '').trim() === String(rule.file_path_template || '').trim() &&
        String(item.target_path || '').trim() === String(rule.target_path || '').trim(),
    )
    if (candidate) {
      return {
        title: 'Values 路径',
        file: candidate.file_path_template,
        path: candidate.target_path,
        sample: candidate.sample_value || '-',
        stale: false,
      }
    }
    return {
      title: 'Values 路径',
      file: rule.file_path_template || '-',
      path: rule.target_path || '-',
      sample: '-',
      stale: Boolean(rule.file_path_template || rule.target_path),
    }
  }
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

function formatGitOpsRulePanelTitle(rule: GitOpsRuleFormItem) {
  const source = resolveGitOpsSourceLabel(rule.source_param_key)
  const target = formatGitOpsRuleTargetSummary(rule)
  return `${source} -> ${target.path}`
}

function formatGitOpsRulePanelDescription(rule: GitOpsRuleFormItem) {
  const target = formatGitOpsRuleTargetSummary(rule)
  return isHelmGitOps()
    ? `${pathBaseName(target.file)} · ${target.sample}`
    : `${target.title} · ${pathBaseName(target.file)}`
}

function resetScopeState(scope: ReleasePipelineScope) {
  scopeStates[scope].binding_id = ''
  scopeStates[scope].selected_param_def_ids = []
  scopeStates[scope].selectable_params = []
  scopeStates[scope].loading_params = false
  scopeParamConfigs[scope] = {}
}

function resetFormState() {
  formState.id = ''
  formState.name = ''
  formState.application_id = ''
  formState.status = 'active'
  formState.approval_enabled = false
  formState.approval_mode = 'any'
  formState.remark = ''
  approvalApproverIDs.value = []
  scopeStates.ci.enabled = true
  scopeStates.cd.enabled = false
  resetScopeState('ci')
  resetScopeState('cd')
  bindingOptions.value = []
  loadedTemplateBindings.value = []
  scopeBindingWarnings.ci = ''
  scopeBindingWarnings.cd = ''
  gitOpsFieldCandidates.value = []
  gitOpsValuesCandidates.value = []
  gitopsRules.value = []
  gitOpsType.value = 'kustomize'
  cdMode.value = 'argocd'
  argocdInfoActiveKeys.value = []
  gitopsRuleActiveKeys.value = []
  templateHooks.value = []
  hookTypePickerVisible.value = false
  pendingHookType.value = 'agent_task'
}

async function refreshScopeBindingWarning(scope: ReleasePipelineScope) {
  scopeBindingWarnings[scope] = ''
  if (!scopeStates[scope].enabled) {
    return
  }
  const bindingID = scopeStates[scope].binding_id.trim()
  if (!bindingID) {
    return
  }
  const existsInOptions = bindingOptionsByScope.value[scope].some((item) => item.value === bindingID)
  if (existsInOptions) {
    bindingLookupCache.value[bindingID] = true
    return
  }
  if (bindingLookupCache.value[bindingID] === false) {
    const templateBinding = loadedTemplateBindings.value.find(
      (item) => item.pipeline_scope === scope && item.enabled && item.binding_id === bindingID,
    )
    const pipelineID = templateBinding?.pipeline_id?.trim()
    scopeBindingWarnings[scope] = pipelineID
      ? `当前模板引用的 ${scope.toUpperCase()} 绑定已失效，将在执行时回退到快照管线 ${pipelineID}；建议尽快重新选择有效绑定。`
      : `当前模板引用的 ${scope.toUpperCase()} 绑定已失效，且未保存可回退的管线 ID；发布预检会拦截执行，请尽快重新选择有效绑定。`
    return
  }
  try {
    await getPipelineBindingByID(bindingID)
    bindingLookupCache.value[bindingID] = true
    return
  } catch {
    bindingLookupCache.value[bindingID] = false
    const templateBinding = loadedTemplateBindings.value.find(
      (item) => item.pipeline_scope === scope && item.enabled && item.binding_id === bindingID,
    )
    const pipelineID = templateBinding?.pipeline_id?.trim()
    if (pipelineID) {
      scopeBindingWarnings[scope] = `当前模板引用的 ${scope.toUpperCase()} 绑定已失效，将在执行时回退到快照管线 ${pipelineID}；建议尽快重新选择有效绑定。`
      return
    }
    scopeBindingWarnings[scope] = `当前模板引用的 ${scope.toUpperCase()} 绑定已失效，且未保存可回退的管线 ID；发布预检会拦截执行，请尽快重新选择有效绑定。`
  }
}

async function refreshBindingWarnings() {
  await Promise.all((['ci', 'cd'] as ReleasePipelineScope[]).map((scope) => refreshScopeBindingWarning(scope)))
}

function normalizeGitOpsRulePayload(item: GitOpsRuleFormItem): ReleaseTemplateGitOpsRulePayload {
  let filePathTemplate = normalizeHelmValuesFilePathTemplate(String(item.file_path_template || '').trim())
  let targetPath = String(item.target_path || '').trim()
  let documentKind = String(item.document_kind || '').trim()
  let documentName = String(item.document_name || '').trim()

  // 兼容历史或异常态：如果 Values 路径下拉把组合值直接落进了 target_path，
  // 提交前在前端再兜底解析一次，避免保存时因为候选键不匹配而失败。
  if (normalizedGitOpsType(gitOpsType.value) === 'helm' && targetPath.startsWith('{')) {
    try {
      const parsed = JSON.parse(targetPath)
      filePathTemplate = normalizeHelmValuesFilePathTemplate(String(parsed.file_path_template || filePathTemplate).trim())
      targetPath = String(parsed.target_path || '').trim()
      documentKind = 'values'
      documentName = ''
    } catch {
      // noop: 保留原值，由后端继续兜底校验。
    }
  }

  return {
    source_param_key: item.source_param_key,
    source_from: item.source_from,
    file_path_template: filePathTemplate,
    document_kind: documentKind,
    document_name: documentName || undefined,
    target_path: targetPath,
    value_template: item.value_template || undefined,
  }
}

function buildPayload(): ReleaseTemplatePayload | UpdateReleaseTemplatePayload {
  const approverIDs = approvalApproverIDs.value.map((item) => String(item || '').trim()).filter(Boolean)
  const approverNames = approverIDs.map((item) => {
    const matched = userOptions.value.find((candidate) => candidate.id === item)
    return matched?.display_name || matched?.username || item
  })
  return {
    name: formState.name.trim(),
    ...(modalMode.value === 'create' ? { application_id: formState.application_id.trim() } : {}),
    ci_binding_id: scopeStates.ci.enabled ? scopeStates.ci.binding_id.trim() || undefined : undefined,
    cd_binding_id: scopeStates.cd.enabled && isCDUsingPipeline() ? scopeStates.cd.binding_id.trim() || undefined : undefined,
    cd_provider: scopeStates.cd.enabled ? (isCDUsingPipeline() ? (selectedBinding('cd')?.provider || 'jenkins') : 'argocd') : undefined,
    gitops_type: scopeStates.cd.enabled && isCDUsingArgoCD() ? normalizedGitOpsType(gitOpsType.value) : undefined,
    status: formState.status,
    approval_enabled: formState.approval_enabled,
    approval_mode: formState.approval_enabled ? formState.approval_mode : undefined,
    approval_approver_ids: formState.approval_enabled ? approverIDs : [],
    approval_approver_names: formState.approval_enabled ? approverNames : [],
    remark: formState.remark.trim() || undefined,
    ci_param_def_ids: scopeStates.ci.enabled ? [...scopeStates.ci.selected_param_def_ids] : [],
    cd_param_def_ids: scopeStates.cd.enabled && isCDUsingPipeline() ? [...scopeStates.cd.selected_param_def_ids] : [],
    ci_param_configs: scopeStates.ci.enabled ? buildTemplateParamConfigs('ci') : [],
    cd_param_configs: scopeStates.cd.enabled && isCDUsingPipeline() ? buildTemplateParamConfigs('cd') : [],
    gitops_rules:
      scopeStates.cd.enabled && isCDUsingArgoCD()
        ? gitopsRules.value.map<ReleaseTemplateGitOpsRulePayload>((item) => normalizeGitOpsRulePayload(item))
        : [],
    hooks: templateHooks.value.map<ReleaseTemplateHookPayload>((item) => ({
      hook_type: item.hook_type,
      name: item.name.trim(),
      trigger_condition: item.trigger_condition,
      failure_policy: item.failure_policy,
      target_id:
        item.hook_type === 'agent_task' || item.hook_type === 'notification_hook'
          ? item.target_id.trim() || undefined
          : undefined,
      webhook_method: item.hook_type === 'webhook_notification' ? item.webhook_method : undefined,
      webhook_url: item.hook_type === 'webhook_notification' ? item.webhook_url.trim() || undefined : undefined,
      webhook_body: item.hook_type === 'webhook_notification' ? item.webhook_body_template : undefined,
      note: item.note.trim() || undefined,
    })),
  }
}

async function loadPlatformParamMap() {
  if (platformParamDicts.value.length > 0) {
    return
  }
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

async function loadApprovalUserOptions() {
  if (userOptions.value.length > 0) {
    return
  }
  try {
    const response = await listUserOptions()
    userOptions.value = response.data || []
  } catch (error) {
    userOptions.value = []
    message.error(extractHTTPErrorMessage(error, '审批人选项加载失败'))
  }
}

async function loadAgentTaskTemplates() {
  if (agentTaskTemplates.value.length > 0) {
    return
  }
  loadingAgentTaskTemplates.value = true
  try {
    const response = await listAllAgentTasks({ page: 1, page_size: 200 })
    agentTaskTemplates.value = response.data
  } catch (error) {
    agentTaskTemplates.value = []
    message.error(extractHTTPErrorMessage(error, 'Agent 任务模板加载失败'))
  } finally {
    loadingAgentTaskTemplates.value = false
  }
}

async function loadNotificationHooks() {
  if (notificationHooks.value.length > 0) {
    return
  }
  loadingNotificationHooks.value = true
  try {
    const response = await listNotificationHooks({ page: 1, page_size: 200, enabled: true })
    notificationHooks.value = response.data
  } catch (error) {
    notificationHooks.value = []
    message.error(extractHTTPErrorMessage(error, '通知 Hook 加载失败'))
  } finally {
    loadingNotificationHooks.value = false
  }
}

async function loadGitOpsFieldCandidates(applicationID: string, silent = false, force = false) {
  const appID = String(applicationID || '').trim()
  if (!appID) {
    gitOpsFieldCandidates.value = []
    return
  }
  if (!force && gitOpsFieldCandidateCache.value[appID]) {
    gitOpsFieldCandidates.value = [...gitOpsFieldCandidateCache.value[appID]]
    return
  }
  loadingGitOpsFieldCandidates.value = true
  try {
    const response = await listGitOpsFieldCandidates(appID)
    gitOpsFieldCandidateCache.value[appID] = response.data
    gitOpsFieldCandidates.value = [...response.data]
  } catch (error) {
    gitOpsFieldCandidates.value = []
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, 'GitOps YAML 字段加载失败'))
    }
  } finally {
    loadingGitOpsFieldCandidates.value = false
  }
}

async function loadGitOpsValuesCandidates(applicationID: string, silent = false, force = false) {
  const appID = String(applicationID || '').trim()
  if (!appID) {
    gitOpsValuesCandidates.value = []
    return
  }
  if (!force && gitOpsValuesCandidateCache.value[appID]) {
    gitOpsValuesCandidates.value = [...gitOpsValuesCandidateCache.value[appID]]
    return
  }
  loadingGitOpsFieldCandidates.value = true
  try {
    const response = await listGitOpsValuesCandidates(appID)
    gitOpsValuesCandidateCache.value[appID] = response.data
    gitOpsValuesCandidates.value = [...response.data]
  } catch (error) {
    gitOpsValuesCandidates.value = []
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, 'GitOps Values 路径加载失败'))
    }
  } finally {
    loadingGitOpsFieldCandidates.value = false
  }
}

async function loadApplications() {
  try {
    const response = await listApplications({ page: 1, page_size: 200 })
    applicationRecords.value = response.data
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
    templateBindingWarnings.value = Object.fromEntries(
      response.data
        .map((item) => [item.id, templateBindingWarningCache.value[item.id] || ''] as const)
        .filter(([, warning]) => Boolean(warning)),
    )
    void loadTemplateBindingWarnings(response.data)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布模板加载失败'))
  } finally {
    loading.value = false
  }
}

async function inspectTemplateBindingWarning(templateID: string): Promise<string> {
  try {
    const response = await getReleaseTemplateByID(templateID)
    const bindings = response.data.bindings || []
    for (const binding of bindings) {
      const bindingID = String(binding.binding_id || '').trim()
      if (!bindingID) {
        continue
      }
      if (bindingLookupCache.value[bindingID] === true) {
        continue
      }
      if (bindingLookupCache.value[bindingID] === false) {
        const pipelineID = String(binding.pipeline_id || '').trim()
        if (pipelineID) {
          return `${binding.pipeline_scope.toUpperCase()} 绑定已失效，将回退到快照管线 ${pipelineID}`
        }
        return `${binding.pipeline_scope.toUpperCase()} 绑定已失效，请重新选择有效绑定`
      }
      try {
        await getPipelineBindingByID(bindingID)
        bindingLookupCache.value[bindingID] = true
      } catch {
        bindingLookupCache.value[bindingID] = false
        const pipelineID = String(binding.pipeline_id || '').trim()
        if (pipelineID) {
          return `${binding.pipeline_scope.toUpperCase()} 绑定已失效，将回退到快照管线 ${pipelineID}`
        }
        return `${binding.pipeline_scope.toUpperCase()} 绑定已失效，请重新选择有效绑定`
      }
    }
    return ''
  } catch {
    return ''
  }
}

async function loadTemplateBindingWarnings(items: ReleaseTemplate[]) {
  const missingItems = items.filter((item) => typeof templateBindingWarningCache.value[item.id] === 'undefined')
  if (missingItems.length === 0) {
    templateBindingWarnings.value = Object.fromEntries(
      items
        .map((item) => [item.id, templateBindingWarningCache.value[item.id] || ''] as const)
        .filter(([, warning]) => Boolean(warning)),
    )
    return
  }

  const nextWarnings = { ...templateBindingWarnings.value }
  const concurrency = 4
  for (let index = 0; index < missingItems.length; index += concurrency) {
    const chunk = missingItems.slice(index, index + concurrency)
    const warnings = await Promise.all(
      chunk.map(async (item) => ({
        id: item.id,
        warning: await inspectTemplateBindingWarning(item.id),
      })),
    )
    warnings.forEach(({ id, warning }) => {
      templateBindingWarningCache.value[id] = warning
      if (warning) {
        nextWarnings[id] = warning
      } else {
        delete nextWarnings[id]
      }
    })
    templateBindingWarnings.value = { ...nextWarnings }
  }
}

async function loadBindings(applicationID: string, options?: { force?: boolean; silent?: boolean }) {
  const appID = String(applicationID || '').trim()
  if (!appID) {
    bindingOptions.value = []
    resetScopeState('ci')
    resetScopeState('cd')
    return
  }
  if (!options?.force && bindingOptionsCache.value[appID]) {
    bindingOptions.value = [...bindingOptionsCache.value[appID]]
    return
  }
  loadingBindings.value = true
  try {
    const response = await listPipelineBindings(appID, {
      status: 'active',
      page: 1,
      page_size: 200,
    })
    const nextOptions = response.data.map((item) => ({
      label: `${item.name || item.binding_type} [${item.binding_type}/${item.provider}]`,
      value: item.id,
      binding_type: item.binding_type,
      provider: item.provider,
    }))
    bindingOptionsCache.value[appID] = nextOptions
    bindingOptions.value = [...nextOptions]
  } catch (error) {
    bindingOptions.value = []
    if (!options?.silent) {
      message.error(extractHTTPErrorMessage(error, '绑定下拉加载失败'))
    }
  } finally {
    loadingBindings.value = false
  }
}

async function loadSelectableParams(scope: ReleasePipelineScope, preserveSelection = false) {
  const state = scopeStates[scope]
  const appID = formState.application_id.trim()
  const binding = selectedBinding(scope)

  if (scope === 'cd' && !isCDUsingPipeline()) {
    state.selectable_params = []
    if (!preserveSelection) {
      state.selected_param_def_ids = []
    }
    scopeParamConfigs.cd = {}
    return
  }

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
    const cacheKey = `${appID}:${scope}`
    let cached = selectableParamsCache.value[cacheKey]
    if (!cached) {
      const response = await listApplicationExecutorParamDefs(appID, {
        binding_type: scope,
        status: 'active',
        page: 1,
        page_size: 200,
      })
      cached = response.data.filter((item) => String(item.param_key || '').trim().toLowerCase() !== '')
      selectableParamsCache.value[cacheKey] = cached
    }
    state.selectable_params = [...cached]
    const allowed = new Set(state.selectable_params.map((item) => item.id))
    state.selected_param_def_ids = state.selected_param_def_ids.filter((item) => allowed.has(item))
    syncScopeParamConfigs(scope)
  } catch (error) {
    state.selectable_params = []
    state.selected_param_def_ids = []
    scopeParamConfigs[scope] = {}
    message.error(extractHTTPErrorMessage(error, `${scope.toUpperCase()} 模板参数加载失败`))
  } finally {
    state.loading_params = false
  }
}

async function handleApplicationChange(value: string | undefined) {
  formState.application_id = String(value || '')
  resetScopeState('ci')
  resetScopeState('cd')
  loadedTemplateBindings.value = []
  scopeBindingWarnings.ci = ''
  scopeBindingWarnings.cd = ''
  gitopsRules.value = []
  gitOpsType.value = 'kustomize'
  const tasks: Array<Promise<unknown>> = [loadBindings(formState.application_id)]
  if (isCDUsingArgoCD()) {
    tasks.push(loadGitOpsFieldCandidates(formState.application_id, true))
  }
  await Promise.all(tasks)
}

async function handleScopeBindingChange(scope: ReleasePipelineScope, value: string | undefined) {
  scopeStates[scope].binding_id = String(value || '')
  scopeStates[scope].selected_param_def_ids = []
  scopeParamConfigs[scope] = {}
  await loadSelectableParams(scope)
  await refreshScopeBindingWarning(scope)
}

function handleCDModeChange(value: string | number) {
  const nextMode = String(value || '').trim() === 'pipeline' ? 'pipeline' : 'argocd'
  if (cdMode.value === nextMode) {
    return
  }
  cdMode.value = nextMode
  if (nextMode === 'argocd') {
    scopeStates.cd.binding_id = ''
    scopeStates.cd.selected_param_def_ids = []
    scopeStates.cd.selectable_params = []
    scopeStates.cd.loading_params = false
    scopeParamConfigs.cd = {}
    void reloadCurrentGitOpsCandidates()
    return
  }
  scopeStates.cd.selected_param_def_ids = []
  scopeParamConfigs.cd = {}
  void loadSelectableParams('cd')
}

async function handleScopeEnabledChange(scope: ReleasePipelineScope, checked: boolean) {
  scopeStates[scope].enabled = checked
  if (!checked) {
    resetScopeState(scope)
    scopeBindingWarnings[scope] = ''
    if (scope === 'cd') {
      gitopsRules.value = []
      gitOpsType.value = 'kustomize'
      cdMode.value = 'argocd'
    }
    return
  }
  if (scope === 'cd' && isCDUsingArgoCD()) {
    void reloadCurrentGitOpsCandidates()
    await refreshScopeBindingWarning(scope)
    return
  }
  await loadSelectableParams(scope)
  await refreshScopeBindingWarning(scope)
}

function handleGitOpsTypeChange(value: ReleaseTemplateGitOpsType) {
  const nextType = normalizedGitOpsType(value)
  if (nextType === gitOpsType.value) {
    return
  }
  gitOpsType.value = nextType
  gitopsRules.value = gitopsRules.value.map((item) =>
    createGitOpsRuleFormItem({
      ...item,
      document_kind: nextType === 'helm' ? 'values' : '',
      document_name: nextType === 'helm' ? '' : item.document_name,
      target_path: '',
    }),
  )
  void reloadCurrentGitOpsCandidates()
}

function getRowSelection(scope: ReleasePipelineScope) {
  return {
    selectedRowKeys: scopeStates[scope].selected_param_def_ids,
    onChange: (keys: Array<string | number>) => {
      scopeStates[scope].selected_param_def_ids = keys.map((item) => String(item))
      syncScopeParamConfigs(scope)
    },
  }
}

function addGitOpsRule() {
  const item = createGitOpsRuleFormItem()
  gitopsRules.value.push(item)
  gitopsRuleActiveKeys.value = []
}

function removeGitOpsRule(localID: string) {
  gitopsRules.value = gitopsRules.value.filter((item) => item.local_id !== localID)
  gitopsRuleActiveKeys.value = gitopsRuleActiveKeys.value.filter((item) => item !== localID)
}

function handleGitOpsRuleSourceChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  const nextKey = String(value || '').trim().toLowerCase()
  const previousTemplate = `{${rule.source_param_key}}`
  rule.source_param_key = nextKey
  rule.source_from = resolveGitOpsRuleSourceFrom(nextKey)
  if (rule.source_from === 'cd_input') {
    if (!rule.value_template || rule.value_template === previousTemplate) {
      rule.value_template = ''
    }
    return
  }
  if (!rule.value_template || rule.value_template === previousTemplate) {
    rule.value_template = nextKey ? `{${nextKey}}` : ''
  }
}

function clearGitOpsRuleTarget(rule: GitOpsRuleFormItem) {
  rule.file_path_template = ''
  rule.document_kind = ''
  rule.document_name = ''
  rule.target_path = ''
}

function handleYamlFileTemplateChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  rule.file_path_template = String(value || '').trim()
  rule.document_kind = ''
  rule.document_name = ''
  rule.target_path = ''
}

function handleYamlDocumentChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  if (!value) {
    rule.document_kind = ''
    rule.document_name = ''
    rule.target_path = ''
    return
  }
  try {
    const parsed = JSON.parse(String(value))
    rule.document_kind = String(parsed.document_kind || '').trim()
    rule.document_name = String(parsed.document_name || '').trim()
    rule.target_path = ''
  } catch {
    message.error('YAML 资源选择解析失败，请重新选择')
  }
}

function handleYamlTargetPathChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  rule.target_path = String(value || '').trim()
}

function handleValuesFileTemplateChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  rule.file_path_template = String(value || '').trim()
  rule.document_kind = 'values'
  rule.document_name = ''
  rule.target_path = ''
}

function handleValuesTargetPathChange(rule: GitOpsRuleFormItem, value: string | undefined) {
  rule.document_kind = 'values'
  rule.document_name = ''
  if (!value) {
    rule.target_path = ''
    return
  }
  try {
    const parsed = JSON.parse(String(value))
    rule.file_path_template = String(parsed.file_path_template || rule.file_path_template || '').trim()
    rule.target_path = String(parsed.target_path || '').trim()
  } catch {
    rule.target_path = String(value || '').trim()
  }
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
  void Promise.all([
    loadPlatformParamMap(),
    loadApprovalUserOptions(),
    loadAgentTaskTemplates(),
    loadNotificationHooks(),
  ])
  modalVisible.value = true
}

function applyBindingsToForm(bindings: ReleaseTemplateBinding[]) {
  const ciBinding = bindings.find((item) => item.pipeline_scope === 'ci' && item.enabled)
  const cdBinding = bindings.find((item) => item.pipeline_scope === 'cd' && item.enabled)

  scopeStates.ci.enabled = Boolean(ciBinding)
  scopeStates.ci.binding_id = ciBinding?.binding_id || ''
  scopeStates.cd.enabled = Boolean(cdBinding)
  cdMode.value = cdBinding && cdBinding.provider === 'jenkins' ? 'pipeline' : 'argocd'
  scopeStates.cd.binding_id = cdMode.value === 'pipeline' ? (cdBinding?.binding_id || '') : ''
  scopeStates.cd.selected_param_def_ids = []
  scopeStates.cd.selectable_params = []
  scopeStates.cd.loading_params = false
}

async function openEditModal(record: ReleaseTemplate) {
  modalMode.value = 'edit'
  resetFormState()
  modalVisible.value = true
  modalLoading.value = true
  try {
    const detailPromise = getReleaseTemplateByID(record.id)
    const preloadTasks: Array<Promise<unknown>> = []
    if (!platformParamDicts.value.length) {
      preloadTasks.push(loadPlatformParamMap())
    }
    if (!userOptions.value.length) {
      preloadTasks.push(loadApprovalUserOptions())
    }
    if (!agentTaskTemplates.value.length) {
      preloadTasks.push(loadAgentTaskTemplates())
    }
    if (!notificationHooks.value.length) {
      preloadTasks.push(loadNotificationHooks())
    }
    const [response] = await Promise.all([detailPromise, ...preloadTasks])
    const { template, bindings, params, gitops_rules, hooks } = response.data
    formState.id = template.id
    formState.name = template.name
    formState.application_id = template.application_id
    formState.status = template.status
    formState.approval_enabled = Boolean(template.approval_enabled)
    formState.approval_mode = (template.approval_mode || 'any') as ReleaseTemplateApprovalMode
    approvalApproverIDs.value = [...(template.approval_approver_ids || [])]
    formState.remark = template.remark
    gitOpsType.value = normalizedGitOpsType(template.gitops_type)

    loadedTemplateBindings.value = bindings
    const loadTasks: Array<Promise<unknown>> = [loadBindings(formState.application_id, { silent: true })]
    if (bindings.some((item) => item.pipeline_scope === 'cd' && item.enabled && item.provider === 'argocd')) {
      if (gitOpsType.value === 'helm') {
        loadTasks.push(loadGitOpsValuesCandidates(formState.application_id, true))
      } else {
        loadTasks.push(loadGitOpsFieldCandidates(formState.application_id, true))
      }
    }
    await Promise.all(loadTasks)
    applyBindingsToForm(bindings)
    void refreshBindingWarnings()

    scopeStates.ci.selected_param_def_ids = params
      .filter((item) => item.pipeline_scope === 'ci')
      .map((item) => item.executor_param_def_id)
    scopeStates.cd.selected_param_def_ids = params
      .filter((item) => item.pipeline_scope === 'cd')
      .map((item) => item.executor_param_def_id)
    scopeParamConfigs.ci = {}
    params
      .filter((item) => item.pipeline_scope === 'ci')
      .forEach((item) => {
        scopeParamConfigs.ci[item.executor_param_def_id] = createTemplateParamConfigState('ci', {
          value_source: item.value_source,
          source_param_key: item.source_param_key,
          fixed_value: item.fixed_value,
        })
      })
    scopeParamConfigs.cd = {}
    params
      .filter((item) => item.pipeline_scope === 'cd')
      .forEach((item) => {
        scopeParamConfigs.cd[item.executor_param_def_id] = createTemplateParamConfigState('cd', {
          value_source: item.value_source,
          source_param_key: item.source_param_key,
          fixed_value: item.fixed_value,
        })
      })

    const paramLoadTasks: Array<Promise<unknown>> = []
    if (scopeStates.ci.enabled) {
      paramLoadTasks.push(loadSelectableParams('ci', true))
    }
    if (scopeStates.cd.enabled && isCDUsingPipeline()) {
      paramLoadTasks.push(loadSelectableParams('cd', true))
    }
    await Promise.all(paramLoadTasks)

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
    templateHooks.value = (hooks || []).map((item: ReleaseTemplateHook) => createHookFormItemFromResponse(item))
    templateHooks.value.forEach((item) => syncHookTargetName(item))
    gitopsRuleActiveKeys.value = []
    if (gitopsRules.value.some((item) => formatGitOpsRuleTargetSummary(item).stale)) {
      message.warning(
        isHelmGitOps()
          ? '检测到部分 GitOps 规则引用的 Values 路径已变化，请在保存前重新确认。'
          : '检测到部分 GitOps 规则引用的 YAML 字段已变化，请在保存前重新确认。',
      )
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
    if (scope === 'cd') {
      if (isCDUsingArgoCD()) {
        continue
      }
      if (!scopeStates[scope].binding_id.trim()) {
        throw new Error('请选择 CD 绑定管线')
      }
      validateTemplateParamConfigs('cd')
      continue
    }
    if (!scopeStates[scope].binding_id.trim()) {
      throw new Error(`请选择 ${scope.toUpperCase()} 绑定管线`)
    }
    validateTemplateParamConfigs(scope)
  }
  if (isCDUsingArgoCD()) {
    if (isUnsupportedKustomizeGitOps()) {
      throw new Error('Kustomize 模式暂不支持，请先切换到 Helm')
    }
    for (const item of gitopsRules.value) {
      if (!item.source_param_key.trim()) {
        throw new Error('请为 GitOps 替换规则选择标准字段')
      }
      if (gitOpsRuleUsesCDInput(item) && !item.value_template.trim()) {
        throw new Error(`请为 CD 自填字段 ${resolvePlatformParamName(item.source_param_key)} 填写固定值`)
      }
      if (isHelmGitOps()) {
        if (!item.file_path_template.trim() || !item.target_path.trim()) {
          throw new Error('请为 GitOps 替换规则选择 Values 路径')
        }
      } else if (!item.file_path_template.trim() || !item.document_kind.trim() || !item.target_path.trim()) {
        throw new Error('请为 GitOps 替换规则选择 YAML 字段')
      }
    }
  }
  if (formState.approval_enabled && approvalApproverIDs.value.length === 0) {
    throw new Error('请至少选择一位审批人')
  }
}

function validateTemplateParamConfigs(scope: ReleasePipelineScope) {
  for (const item of selectedScopeParamDefs(scope)) {
    const config = getTemplateParamConfig(scope, item.id)
    const label = `${resolvePlatformParamName(String(item.param_key || '').trim().toLowerCase())} / ${item.executor_param_name}`
    if (scope === 'ci') {
      if (config.value_source === 'fixed' && !String(config.fixed_value || '').trim()) {
        throw new Error(`请为 ${label} 填写模板固定值`)
      }
      continue
    }
    if (config.value_source === 'fixed' && !String(config.fixed_value || '').trim()) {
      throw new Error(`请为 ${label} 填写模板固定值`)
    }
    if ((config.value_source === 'ci_param' || config.value_source === 'builtin') && !String(config.source_param_key || '').trim()) {
      throw new Error(`请为 ${label} 选择来源字段`)
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
  await loadApplications()
  await loadTemplates()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-copy">
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

    <a-collapse v-model:activeKey="releasePageGuideActiveKeys" class="release-page-guide-collapse" ghost>
      <a-collapse-panel key="install-guide">
        <template #header>
          <div class="collapse-header-block">
            <div class="collapse-header-title">异地集群创建 ArgoCD Application 示例</div>
            <div class="collapse-header-subtitle">
              网络不通的目标集群，可先在目标侧 ArgoCD 创建 Application，再由平台改 GitOps 并触发 Sync。
            </div>
          </div>
        </template>
        <div class="argocd-install-panel">
          <div class="argocd-install-header">
            <div class="argocd-install-subtitle">
              如果目标 K8s 集群与发布平台网络不通，需要先在目标集群侧可访问的 ArgoCD 环境里执行一次 `argocd app create`，
              让该集群先拥有对应的 Application。平台后续发布时只负责改 GitOps 配置并触发 Sync。
            </div>
            <a-button size="small" @click.stop="copyArgoCDInstallCommand">
              <template #icon><CopyOutlined /></template>
              复制命令
            </a-button>
          </div>
          <pre class="argocd-install-code"><code>{{ argocdInstallCommand }}</code></pre>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <a-card class="filter-card" :bordered="true">
      <div class="advanced-search-panel">
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
          <a-form-item class="filter-form-actions">
            <a-space>
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
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
          <template v-if="column.key === 'name'">
            <div class="template-name-cell">
              <span class="template-name-text">{{ record.name }}</span>
              <a-tag
                v-if="templateBindingWarnings[record.id]"
                class="dashboard-chip dashboard-chip-warning"
              >
                绑定异常
              </a-tag>
            </div>
            <div v-if="templateBindingWarnings[record.id]" class="template-binding-warning-text">
              {{ templateBindingWarnings[record.id] }}
            </div>
          </template>
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
      wrap-class-name="template-editor-modal-wrap"
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

        <a-card class="scope-card scope-card-base" :bordered="false">
          <div class="template-param-config-header">
            <div class="template-param-config-title">审批配置</div>
            <div class="template-param-config-subtitle">按模板决定当前发布是否必须先走审批流。审批通过后，发布单才允许进入执行阶段。</div>
          </div>
          <a-row :gutter="16">
            <a-col :xs="24" :md="8">
              <a-form-item label="启用审批">
                <a-switch v-model:checked="formState.approval_enabled" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="审批方式">
                <a-select
                  v-model:value="formState.approval_mode"
                  :disabled="!formState.approval_enabled"
                  :options="approvalModeOptions"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-form-item label="审批人">
                <a-select
                  v-model:value="approvalApproverIDs"
                  mode="multiple"
                  allow-clear
                  show-search
                  option-filter-prop="label"
                  :disabled="!formState.approval_enabled"
                  placeholder="请选择审批人"
                  :options="userOptionChoices"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-alert
            v-if="formState.approval_enabled"
            class="scope-alert"
            type="info"
            show-icon
            :message="formState.approval_mode === 'all' ? '当前模板启用会签：所有审批人都通过后，发布单才会进入已批准状态。' : '当前模板启用或签：任一审批人通过后，发布单即可进入已批准状态。'"
          />
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
              <a-alert
                v-if="scopeBindingWarnings.ci"
                class="scope-binding-alert"
                type="warning"
                show-icon
                :message="scopeBindingWarnings.ci"
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
                      <a-tag :class="record.required ? 'dashboard-chip dashboard-chip-warning' : 'dashboard-chip dashboard-chip-neutral'">
                        {{ record.required ? '必填' : '可选' }}
                      </a-tag>
                    </template>
                  </template>
                </a-table>
              </div>

              <div v-if="selectedScopeParamDefs('ci').length" class="template-param-config-panel">
                <div class="template-param-config-header">
                  <div class="template-param-config-title">CI 参数取值规则</div>
                  <div class="template-param-config-subtitle">已选择的平台标准字段可在发布时填写，或由模板直接写死。</div>
                </div>
                <div
                  v-for="item in selectedScopeParamDefs('ci')"
                  :key="`ci-config-${item.id}`"
                  class="template-param-config-item"
                >
                  <div class="template-param-config-item-header">
                    <div>
                      <div class="template-param-config-item-title">{{ resolvePlatformParamName(String(item.param_key || '').trim().toLowerCase()) }}</div>
                      <div class="template-param-config-item-meta">{{ item.executor_param_name }}</div>
                    </div>
                    <a-tag class="dashboard-chip dashboard-chip-neutral">
                      {{ resolveTemplateParamSourceLabel('ci', getTemplateParamConfig('ci', item.id)) }}
                    </a-tag>
                  </div>
                  <a-row :gutter="12">
                    <a-col :span="10">
                      <a-form-item label="取值方式" class="template-param-inline-item">
                        <a-segmented
                          :value="getTemplateParamConfig('ci', item.id).value_source"
                          :options="[
                            { label: '发布时填写', value: 'release_input' },
                            { label: '固定值', value: 'fixed' },
                          ]"
                          @change="(value: string | number) => handleTemplateParamValueSourceChange('ci', item.id, String(value) as ReleaseTemplateParamValueSource)"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col v-if="getTemplateParamConfig('ci', item.id).value_source === 'fixed'" :span="14">
                      <a-form-item label="固定值" class="template-param-inline-item">
                        <a-input
                          :value="getTemplateParamConfig('ci', item.id).fixed_value"
                          placeholder="请输入模板固定值"
                          @update:value="(value: string) => (getTemplateParamConfig('ci', item.id).fixed_value = value)"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
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

              <a-form-item label="CD 类型">
                <a-segmented
                  :value="cdMode"
                  :disabled="!scopeStates.cd.enabled"
                  :options="[
                    { label: '管线', value: 'pipeline' },
                    { label: 'ArgoCD', value: 'argocd' },
                  ]"
                  @change="handleCDModeChange"
                />
              </a-form-item>

              <a-form-item v-if="isCDUsingPipeline()" label="CD 绑定管线">
                <a-select
                  v-model:value="scopeStates.cd.binding_id"
                  :disabled="!scopeStates.cd.enabled"
                  show-search
                  allow-clear
                  option-filter-prop="label"
                  placeholder="请选择 CD 绑定管线"
                  :loading="loadingBindings"
                  :options="bindingOptionsByScope.cd"
                  @change="(value: string | undefined) => handleScopeBindingChange('cd', value)"
                />
              </a-form-item>
              <a-alert
                v-if="isCDUsingPipeline() && scopeBindingWarnings.cd"
                class="scope-binding-alert"
                type="warning"
                show-icon
                :message="scopeBindingWarnings.cd"
              />

              <a-collapse v-if="isCDUsingArgoCD()" v-model:activeKey="argocdInfoActiveKeys" class="argocd-info-collapse" ghost>
                <a-collapse-panel key="argocd-info">
                  <template #header>
                    <div class="collapse-header-block">
                      <div class="collapse-header-title">当前模板的 CD 方式为 ArgoCD</div>
                      <div class="collapse-header-subtitle">
                        {{ isHelmGitOps() ? 'GitOps 类型：Helm' : 'GitOps 类型：Kustomize' }}
                      </div>
                    </div>
                  </template>
                  <div class="argocd-info-panel">
                    {{ resolveArgoCDModeDescription() }}
                  </div>
                </a-collapse-panel>
              </a-collapse>
              <a-alert
                v-else-if="isCDUsingPipeline() && selectedBinding('cd')"
                class="scope-binding-alert"
                type="success"
                show-icon
                :message="`当前执行器：${selectedBinding('cd')?.provider}`"
              />

              <div v-if="isCDUsingPipeline() && selectedBinding('cd')" class="scope-table-wrapper">
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
                      <a-tag :class="record.required ? 'dashboard-chip dashboard-chip-warning' : 'dashboard-chip dashboard-chip-neutral'">
                        {{ record.required ? '必填' : '可选' }}
                      </a-tag>
                    </template>
                  </template>
                </a-table>
              </div>

              <div v-if="isCDUsingPipeline() && selectedScopeParamDefs('cd').length" class="template-param-config-panel">
                <div class="template-param-config-header">
                  <div class="template-param-config-title">CD 管线参数规则</div>
                  <div class="template-param-config-subtitle">
                    CD 为管线时，参数可配置固定值，或沿用 CI 标准字段、系统内置字段。CD 自填字段在这里作为普通标准字段使用。
                  </div>
                </div>
                <div
                  v-for="item in selectedScopeParamDefs('cd')"
                  :key="`cd-config-${item.id}`"
                  class="template-param-config-item"
                >
                  <div class="template-param-config-item-header">
                    <div>
                      <div class="template-param-config-item-title">{{ resolvePlatformParamName(String(item.param_key || '').trim().toLowerCase()) }}</div>
                      <div class="template-param-config-item-meta">{{ item.executor_param_name }}</div>
                    </div>
                    <a-tag class="dashboard-chip dashboard-chip-neutral">
                      {{ resolveTemplateParamSourceLabel('cd', getTemplateParamConfig('cd', item.id)) }}
                    </a-tag>
                  </div>
                  <a-row :gutter="12">
                    <a-col :span="10">
                      <a-form-item label="取值方式" class="template-param-inline-item">
                        <a-segmented
                          :value="getTemplateParamConfig('cd', item.id).value_source"
                          :options="[
                            { label: '发布时填写', value: 'release_input' },
                            { label: '固定值', value: 'fixed' },
                            { label: '沿用 CI 字段', value: 'ci_param' },
                            { label: '内置字段', value: 'builtin' },
                          ]"
                          @change="(value: string | number) => handleTemplateParamValueSourceChange('cd', item.id, String(value) as ReleaseTemplateParamValueSource)"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col v-if="getTemplateParamConfig('cd', item.id).value_source === 'fixed'" :span="14">
                      <a-form-item label="固定值" class="template-param-inline-item">
                        <a-input
                          :value="getTemplateParamConfig('cd', item.id).fixed_value"
                          placeholder="请输入模板固定值"
                          @update:value="(value: string) => (getTemplateParamConfig('cd', item.id).fixed_value = value)"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col
                      v-else-if="['ci_param', 'builtin'].includes(getTemplateParamConfig('cd', item.id).value_source)"
                      :span="14"
                    >
                      <a-form-item :label="getTemplateParamConfig('cd', item.id).value_source === 'ci_param' ? 'CI 来源字段' : '内置字段'" class="template-param-inline-item">
                        <a-select
                          :value="getTemplateParamConfig('cd', item.id).source_param_key || undefined"
                          allow-clear
                          show-search
                          option-filter-prop="label"
                          placeholder="请选择来源字段"
                          :options="resolveTemplateParamSourceOptions('cd', getTemplateParamConfig('cd', item.id))"
                          @change="(value: string | undefined) => (getTemplateParamConfig('cd', item.id).source_param_key = String(value || '').trim().toLowerCase())"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </div>

              <div v-if="isCDUsingArgoCD()" class="gitops-rule-panel">
                <a-form-item label="GitOps 类型" class="gitops-type-item">
                  <a-segmented
                    :value="gitOpsType"
                    :options="[
                      { label: 'Kustomize', value: 'kustomize' },
                      { label: 'Helm', value: 'helm' },
                    ]"
                    @change="(value: string | number) => handleGitOpsTypeChange(String(value) as ReleaseTemplateGitOpsType)"
                  />
                </a-form-item>

                <a-result
                  v-if="isUnsupportedKustomizeGitOps()"
                  class="gitops-unsupported-result"
                  status="warning"
                  title="Kustomize 暂不支持"
                  sub-title="当前模板页暂不支持 Kustomize 规则配置，请先切换到 Helm。"
                />

                <template v-else>
                <div class="gitops-rule-header">
                  <div>
                    <div class="gitops-rule-title">GitOps 替换规则</div>
                    <div class="gitops-rule-subtitle">
                      {{
                        isHelmGitOps()
                          ? '先选可引用的标准字段，再直接下拉选择平台专用 values 文件中的路径；支持 CI 已勾选字段、系统内置字段，以及只在 CD 阶段填写固定值的 CD 自填字段。'
                          : '先选可引用的标准字段，再直接下拉选择目标文件、资源和字段；支持 CI 已勾选字段、系统内置字段，以及只在 CD 阶段填写固定值的 CD 自填字段。'
                      }}
                    </div>
                  </div>
                  <a-tag class="dashboard-chip dashboard-chip-running">{{ gitopsRules.length }} 条规则</a-tag>
                </div>

                <div class="gitops-rule-toolbar">
                  <a-space>
                    <a-button size="small" :loading="loadingGitOpsFieldCandidates" @click="reloadCurrentGitOpsCandidates">
                      <template #icon><ReloadOutlined /></template>
                      {{ isHelmGitOps() ? '同步 Values' : '同步字段' }}
                    </a-button>
                    <a-button type="dashed" size="small" @click="addGitOpsRule">新增规则</a-button>
                  </a-space>
                </div>

                <a-empty
                  v-if="!loadingGitOpsFieldCandidates && ((isHelmGitOps() && platformValuesCandidates().length === 0) || (!isHelmGitOps() && gitOpsFieldCandidates.length === 0))"
                  :description="isHelmGitOps()
                    ? '当前应用还没有扫描到平台专用的 Helm values 路径，请先确认 GitOps 目录下已准备好 apps/helm/platform.values-{env}.yaml。'
                    : '当前应用还没有扫描到可替换的 YAML 字段，请先确认 GitOps 目录与 YAML 文件是否已准备好。'"
                />

                <a-collapse v-model:activeKey="gitopsRuleActiveKeys" class="gitops-rule-collapse" accordion>
                  <a-collapse-panel v-for="rule in gitopsRules" :key="rule.local_id">
                    <template #header>
                      <div class="collapse-header-block">
                        <div class="collapse-header-title">
                          规则 {{ gitopsRules.findIndex((item) => item.local_id === rule.local_id) + 1 }}：{{ formatGitOpsRulePanelTitle(rule) }}
                        </div>
                        <div class="collapse-header-subtitle">
                          {{ formatGitOpsRulePanelDescription(rule) }}
                        </div>
                      </div>
                    </template>
                    <template #extra>
                      <a-button danger type="link" @click.stop="removeGitOpsRule(rule.local_id)">删除</a-button>
                    </template>

                    <div class="gitops-rule-item">
                      <a-row :gutter="12">
                        <a-col :span="24">
                          <a-form-item label="标准字段">
                            <a-select
                              :value="rule.source_param_key || undefined"
                              show-search
                              allow-clear
                              option-filter-prop="label"
                              placeholder="请选择 CI 已勾选字段、系统内置字段或 CD 自填字段"
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
                          <div class="gitops-target-preview-title">{{ isHelmGitOps() ? 'Values 目标路径' : 'YAML 目标字段' }}</div>
                          <a-tag :color="formatGitOpsRuleTargetSummary(rule).stale ? 'error' : 'processing'">
                            {{ formatGitOpsRuleTargetSummary(rule).stale ? '字段已变化' : '字段有效' }}
                          </a-tag>
                        </div>
                        <a-row v-if="isHelmGitOps()" :gutter="12" class="gitops-target-select-row">
                          <a-col :span="24">
                            <a-form-item label="目标文件模板" class="gitops-inline-item">
                              <a-input :value="rule.file_path_template || valuesFileOptions()[0]?.value || 'apps/helm/platform.values-{env}.yaml'" readonly />
                            </a-form-item>
                          </a-col>
                          <a-col :span="24">
                            <a-form-item label="Values 路径" class="gitops-inline-item">
                              <a-select
                                :value="rule.target_path ? JSON.stringify({ file_path_template: rule.file_path_template, target_path: rule.target_path }) : undefined"
                                allow-clear
                                show-search
                                option-filter-prop="label"
                                placeholder="请选择 Values 路径"
                                :options="valuesPathOptions(rule)"
                                @change="(value: string | undefined) => handleValuesTargetPathChange(rule, value)"
                              />
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <a-row v-else :gutter="12" class="gitops-target-select-row">
                          <a-col :span="8">
                            <a-form-item label="目标文件" class="gitops-inline-item">
                              <a-select
                                :value="rule.file_path_template || undefined"
                                allow-clear
                                show-search
                                option-filter-prop="label"
                                placeholder="请选择 YAML 文件"
                                :options="yamlFileOptions(rule)"
                                @change="(value: string | undefined) => handleYamlFileTemplateChange(rule, value)"
                              />
                            </a-form-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-item label="目标资源" class="gitops-inline-item">
                              <a-select
                                :value="selectedYamlDocumentValue(rule)"
                                allow-clear
                                show-search
                                option-filter-prop="label"
                                placeholder="请选择资源"
                                :options="yamlDocumentOptions(rule)"
                                :disabled="!rule.file_path_template"
                                @change="(value: string | undefined) => handleYamlDocumentChange(rule, value)"
                              />
                            </a-form-item>
                          </a-col>
                          <a-col :span="8">
                            <a-form-item label="目标字段" class="gitops-inline-item">
                              <a-select
                                :value="rule.target_path || undefined"
                                allow-clear
                                show-search
                                option-filter-prop="label"
                                placeholder="请选择字段路径"
                                :options="yamlFieldOptions(rule)"
                                :disabled="!rule.file_path_template || !rule.document_kind"
                                @change="(value: string | undefined) => handleYamlTargetPathChange(rule, value)"
                              />
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <a-descriptions :column="1" size="small" bordered>
                          <a-descriptions-item :label="isHelmGitOps() ? '类型' : '资源'">
                            {{ formatGitOpsRuleTargetSummary(rule).title }}
                          </a-descriptions-item>
                          <a-descriptions-item :label="isHelmGitOps() ? 'Values 文件模板' : '文件'">
                            <span class="gitops-code-text">{{ formatGitOpsRuleTargetSummary(rule).file }}</span>
                          </a-descriptions-item>
                          <a-descriptions-item :label="isHelmGitOps() ? 'Values 路径' : '字段路径'">
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
                          :placeholder="resolveGitOpsValueTemplatePlaceholder(rule)"
                        />
                      </a-form-item>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
                </template>
              </div>

            </a-card>
          </a-col>
        </a-row>

        <a-card class="scope-card hook-config-card" :bordered="true">
          <template #title>发布后 Hook</template>
          <template #extra>
            <a-space>
              <a-tag class="dashboard-chip dashboard-chip-running">发布后执行</a-tag>
              <a-button type="dashed" size="small" @click="openHookTypePicker">
                <template #icon><PlusOutlined /></template>
                新增 Hook
              </a-button>
            </a-space>
          </template>

          <a-alert
            class="scope-alert"
            type="info"
            show-icon
            message="发布模板中的 Hook 会在主发布流程结束后串行执行。通知 Hook 会自动使用发布过程中的标准平台 Key 和内置字段渲染消息。"
          />

          <div class="hook-template-summary-grid">
            <div v-for="item in hookSummaryItems" :key="item.label" class="hook-template-summary-item">
              <div class="hook-template-summary-label">{{ item.label }}</div>
              <div class="hook-template-summary-value">{{ item.value }}</div>
            </div>
          </div>

          <div class="hook-template-capability-header">
            <div>
              <div class="hook-template-capability-title">Hook 配置适配预览</div>
              <div class="hook-template-capability-subtitle">
                点击新增 Hook，先选择类型，再补充表单字段。当前支持 Agent 任务、通知 Hook 和兼容型 Webhook 通知。
              </div>
            </div>
            <a-tag class="dashboard-chip dashboard-chip-neutral">详情页直接看进度</a-tag>
          </div>

          <a-empty v-if="!templateHooks.length" description="暂未配置发布后 Hook，可点击右上角新增 Hook" />

          <div v-else class="hook-template-capability-grid">
            <div v-for="(item, index) in templateHooks" :key="item.local_id" class="hook-template-capability-card">
              <div class="hook-template-capability-card-head">
                <div>
                  <div class="hook-template-capability-card-title">
                    Hook {{ index + 1 }}：{{ item.name || '未命名 Hook' }}
                  </div>
                  <div class="hook-template-capability-card-meta">
                    {{ hookTypeLabel(item.hook_type) }} ·
                    {{ item.hook_type === 'agent_task' ? '发布后 Agent 任务' : item.hook_type === 'notification_hook' ? '发布后通知 Hook' : '发布后 Webhook 通知' }}
                  </div>
                </div>
                <a-space>
                  <a-tag class="dashboard-chip dashboard-chip-neutral">{{ hookTypeLabel(item.hook_type) }}</a-tag>
                  <a-button type="link" danger size="small" @click="removeHook(item.local_id)">删除</a-button>
                </a-space>
              </div>

              <div class="hook-template-form-stack">
                <a-form-item label="Hook 名称" class="template-param-inline-item">
                  <a-input
                    v-model:value="item.name"
                    allow-clear
                    :placeholder="item.hook_type === 'agent_task'
                      ? '例如：发布后 Agent 任务'
                      : item.hook_type === 'notification_hook'
                        ? '例如：发布后通知 Hook'
                        : '例如：发布后 Webhook 通知'"
                  />
                </a-form-item>

                <a-form-item label="触发条件" class="template-param-inline-item">
                  <a-segmented
                    v-model:value="item.trigger_condition"
                    :options="[
                      { label: '仅成功后', value: 'on_success' },
                      { label: '仅失败后', value: 'on_failed' },
                      { label: '始终触发', value: 'always' },
                    ]"
                  />
                </a-form-item>

                <a-form-item label="失败策略" class="template-param-inline-item">
                  <a-segmented
                    v-model:value="item.failure_policy"
                    :options="[
                      { label: '阻断发布单', value: 'block_release' },
                      { label: '仅告警', value: 'warn_only' },
                    ]"
                  />
                </a-form-item>

                <a-form-item :label="item.hook_type === 'agent_task' ? '目标 Agent 任务' : item.hook_type === 'notification_hook' ? '目标通知 Hook' : 'Webhook URL'" class="template-param-inline-item">
                  <a-select
                    v-if="item.hook_type === 'agent_task'"
                    v-model:value="item.target_id"
                    allow-clear
                    show-search
                    option-filter-prop="label"
                    :loading="loadingAgentTaskTemplates"
                    :options="agentTaskTemplateOptions"
                    placeholder="请选择真实 Agent 任务模板"
                    @change="syncHookTargetName(item)"
                  />
                  <a-select
                    v-else-if="item.hook_type === 'notification_hook'"
                    v-model:value="item.target_id"
                    allow-clear
                    show-search
                    option-filter-prop="label"
                    :loading="loadingNotificationHooks"
                    :options="notificationHookOptions"
                    placeholder="请选择通知 Hook"
                    @change="syncHookTargetName(item)"
                  />
                  <a-input
                    v-else
                    v-model:value="item.webhook_url"
                    allow-clear
                    placeholder="例如：https://notify.example.com/release/hook"
                  />
                </a-form-item>

                <div v-if="item.hook_type === 'agent_task' && !agentTaskTemplateOptions.length" class="hook-template-capability-note">
                  当前还没有可引用的未分配 Agent 任务模板，请先到 Agent 任务管理中创建任务模板。
                </div>
                <div v-if="item.hook_type === 'notification_hook' && !notificationHookOptions.length" class="hook-template-capability-note">
                  当前还没有可引用的通知 Hook，请先到系统管理 / 通知模块中创建通知源、Markdown 模板和通知 Hook。
                </div>

                <a-descriptions v-if="item.hook_type === 'agent_task' && findAgentTaskTemplate(item.target_id)" :column="1" size="small" bordered class="hook-template-description">
                  <a-descriptions-item label="已选任务">
                    {{ findAgentTaskTemplate(item.target_id)?.name }}
                  </a-descriptions-item>
                  <a-descriptions-item label="任务模式">
                    {{ findAgentTaskTemplate(item.target_id)?.task_mode === 'resident' ? '常驻任务' : '临时任务' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="任务类型">
                    {{ agentTaskTypeLabel(String(findAgentTaskTemplate(item.target_id)?.task_type || '')) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="脚本">
                    {{ findAgentTaskTemplate(item.target_id)?.script_name || findAgentTaskTemplate(item.target_id)?.script_path || '未绑定脚本' }}
                  </a-descriptions-item>
                </a-descriptions>

                <a-descriptions v-if="item.hook_type === 'notification_hook' && notificationHooks.find((candidate) => candidate.id === item.target_id)" :column="1" size="small" bordered class="hook-template-description">
                  <a-descriptions-item label="已选通知 Hook">
                    {{ notificationHooks.find((candidate) => candidate.id === item.target_id)?.name }}
                  </a-descriptions-item>
                  <a-descriptions-item label="通知源">
                    {{ notificationHooks.find((candidate) => candidate.id === item.target_id)?.source_name }}
                  </a-descriptions-item>
                  <a-descriptions-item label="Markdown 模板">
                    {{ notificationHooks.find((candidate) => candidate.id === item.target_id)?.markdown_template_name }}
                  </a-descriptions-item>
                  <a-descriptions-item label="变量来源">
                    使用发布过程中的标准平台 Key 与内置字段渲染通知内容
                  </a-descriptions-item>
                </a-descriptions>

                <a-form-item v-if="item.hook_type === 'webhook_notification'" label="请求方法" class="template-param-inline-item">
                  <a-select
                    v-model:value="item.webhook_method"
                    :options="[
                      { label: 'POST', value: 'POST' },
                      { label: 'PUT', value: 'PUT' },
                      { label: 'PATCH', value: 'PATCH' },
                    ]"
                  />
                </a-form-item>

                <a-form-item v-if="item.hook_type === 'webhook_notification'" label="Body 模板" class="template-param-inline-item">
                  <a-textarea
                    v-model:value="item.webhook_body_template"
                    :auto-size="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入 Webhook body 模板，支持 {env}、{order_no} 等变量"
                  />
                </a-form-item>

                <a-form-item label="补充说明" class="template-param-inline-item">
                  <a-textarea
                    v-model:value="item.note"
                    :auto-size="{ minRows: 2, maxRows: 4 }"
                    placeholder="例如：用于发版成功通知、回滚告警或特殊环境后置动作"
                  />
                </a-form-item>

                <div class="hook-template-variable-row">
                  <div class="hook-template-variable-title">变量来源</div>
                  <div class="hook-template-variable-tags">
                    <a-tag v-for="source in hookVariableSourceTags" :key="`${item.local_id}-${source}`" class="dashboard-chip dashboard-chip-neutral">
                      {{ source }}
                    </a-tag>
                  </div>
                </div>

                <a-descriptions :column="1" size="small" bordered class="hook-template-description">
                  <a-descriptions-item label="当前摘要">
                    {{ hookTriggerLabel(item.trigger_condition) }} · {{ hookFailureLabel(item.failure_policy) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="详情展示">
                    发布单详情直接展示 Hook 执行进度、变量和日志
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
          </div>
        </a-card>
        <a-modal
          :open="hookTypePickerVisible"
          title="新增 Hook"
          :width="420"
          wrap-class-name="hook-type-picker-modal-wrap"
          ok-text="添加"
          cancel-text="取消"
          @ok="confirmAddHook"
          @cancel="hookTypePickerVisible = false"
        >
          <a-form layout="vertical" class="hook-type-picker-form">
            <a-form-item label="Hook 类型">
              <a-segmented
                v-model:value="pendingHookType"
                :options="[
                  { label: 'Agent 任务', value: 'agent_task' },
                  { label: '通知 Hook', value: 'notification_hook' },
                  { label: 'Webhook 通知', value: 'webhook_notification' },
                ]"
              />
            </a-form-item>
            <a-alert
              type="info"
              show-icon
              :message="pendingHookType === 'agent_task'
                ? '新增后会补充 Agent 任务名称、触发条件、失败策略等字段。'
                : pendingHookType === 'notification_hook'
                  ? '新增后会选择通知 Hook，通知 Hook 由通知源和 Markdown 模板组成。'
                  : '新增后会补充 Webhook URL、请求方法、Body 模板等字段。'"
            />
          </a-form>
        </a-modal>
        </a-form>
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

.template-editor-modal-wrap :deep(.ant-modal-content) {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.template-editor-modal-wrap :deep(.ant-modal-header) {
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.92);
  background: transparent;
}

.template-editor-modal-wrap :deep(.ant-modal-title) {
  color: var(--color-text-main);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.template-editor-modal-wrap :deep(.ant-modal-body) {
  padding-top: 8px;
}

.template-editor-modal-wrap :deep(.ant-modal-footer) {
  border-top: 1px solid rgba(226, 232, 240, 0.92);
  background: transparent;
}

.hook-type-picker-modal-wrap :deep(.ant-modal) {
  width: min(420px, calc(100vw - 32px)) !important;
}

.hook-type-picker-modal-wrap :deep(.ant-modal-content) {
  border-radius: 18px;
}

.hook-type-picker-modal-wrap :deep(.ant-modal-body) {
  padding-top: 14px;
}

.hook-type-picker-form {
  width: min(100%, 360px);
  margin-right: auto;
}

.scope-card-base {
  margin-bottom: 16px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 250, 252, 0.97) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    0 12px 28px rgba(15, 23, 42, 0.04);
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

.release-page-guide-collapse {
  margin-bottom: 16px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 250, 252, 0.97) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    0 10px 26px rgba(15, 23, 42, 0.03);
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.danger-icon {
  color: var(--color-danger);
}

.scope-alert,
.scope-binding-alert {
  margin-bottom: 12px;
}

.scope-card {
  border: 1px solid rgba(148, 163, 184, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 250, 252, 0.97) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 10px 26px rgba(15, 23, 42, 0.03);
}

.scope-card :deep(.ant-card-head) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.scope-card :deep(.ant-card-head-title) {
  color: var(--color-text-main);
  font-weight: 700;
}

.scope-alert:deep(.ant-alert) {
  border-radius: 14px;
}

.scope-alert:deep(.ant-alert-info) {
  border: 1px solid rgba(2, 132, 199, 0.14);
  background: linear-gradient(180deg, rgba(240, 249, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
}

.scope-alert:deep(.ant-alert-info .ant-alert-message),
.scope-alert:deep(.ant-alert-info .anticon) {
  color: #0369a1;
}

.scope-alert:deep(.ant-alert-info .ant-alert-description) {
  color: #475569;
}

.scope-binding-alert:deep(.ant-alert-success) {
  border: 1px solid rgba(22, 163, 74, 0.14);
  background: linear-gradient(180deg, rgba(240, 253, 244, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
}

.scope-binding-alert:deep(.ant-alert-success .ant-alert-message),
.scope-binding-alert:deep(.ant-alert-success .anticon) {
  color: #15803d;
}

.scope-binding-alert:deep(.ant-alert-success .ant-alert-description) {
  color: #475569;
}

.collapse-header-block {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.collapse-header-title {
  font-weight: 600;
  color: var(--color-text-main);
}

.collapse-header-subtitle {
  color: var(--color-text-soft);
  font-size: 12px;
  line-height: 1.5;
}

.argocd-info-collapse,
.gitops-rule-collapse {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
}

.argocd-info-collapse {
  margin-bottom: 12px;
}

.argocd-info-panel,
.argocd-install-panel {
  padding: 4px 0 0;
}

.release-page-guide-collapse :deep(.ant-collapse-header),
.argocd-info-collapse :deep(.ant-collapse-header),
.gitops-rule-collapse :deep(.ant-collapse-header) {
  align-items: flex-start !important;
  background: transparent !important;
}

.release-page-guide-collapse :deep(.ant-collapse-content-box),
.argocd-info-collapse :deep(.ant-collapse-content-box),
.gitops-rule-collapse :deep(.ant-collapse-content-box) {
  padding-top: 0 !important;
}

.argocd-info-panel {
  padding: 12px 14px;
  border: 1px solid rgba(2, 132, 199, 0.12);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(240, 249, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
  font-size: 13px;
  line-height: 1.8;
  color: var(--color-text-soft);
}

.argocd-install-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.argocd-install-title {
  margin-bottom: 4px;
  font-weight: 600;
  color: var(--color-dashboard-800);
}

.argocd-install-subtitle {
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text-soft);
}

.argocd-install-code {
  margin: 0;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.96) 100%);
  color: #0f172a;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.7;
}

.argocd-install-panel {
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.99) 0%, rgba(255, 255, 255, 0.97) 100%);
}

.scope-table-wrapper {
  margin-top: 12px;
  min-height: 320px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.97) 100%);
}

.scope-table-wrapper :deep(.ant-table) {
  background: transparent;
}

.scope-table-wrapper :deep(.ant-table-container) {
  border-inline-start: none !important;
}

.scope-table-wrapper :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(219, 234, 254, 0.78) 100%);
  color: #334155;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  font-weight: 700;
}

.scope-table-wrapper :deep(.ant-table-thead > tr > th::before) {
  display: none;
}

.scope-table-wrapper :deep(.ant-table-tbody > tr > td) {
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(226, 232, 240, 0.86);
  color: var(--color-text-main);
}

.scope-table-wrapper :deep(.ant-table-tbody > tr:hover > td) {
  background: rgba(239, 246, 255, 0.72) !important;
}

.scope-table-wrapper :deep(.ant-table-row-selected > td) {
  background: rgba(219, 234, 254, 0.58) !important;
}

.scope-table-wrapper :deep(.ant-checkbox-wrapper),
.scope-table-wrapper :deep(.ant-checkbox + span) {
  color: var(--color-text-main);
}

.template-param-config-panel {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.template-param-config-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-param-config-title {
  font-weight: 700;
  color: var(--color-text-main);
}

.template-param-config-subtitle {
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-soft);
}

.template-param-config-item {
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.97) 100%);
}

.template-param-config-item-header {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.template-param-config-item-title {
  font-weight: 700;
  color: var(--color-text-main);
}

.template-param-config-item-meta {
  margin-top: 2px;
  font-size: 12px;
  color: var(--color-text-soft);
}

.template-param-inline-item {
  margin-bottom: 0;
}

.hook-config-card {
  margin-top: 16px;
}

.hook-template-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.hook-template-summary-item {
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.97) 100%);
}

.hook-template-summary-label {
  font-size: 12px;
  color: var(--color-text-soft);
}

.hook-template-summary-value {
  margin-top: 4px;
  font-weight: 700;
  color: var(--color-text-main);
}

.hook-template-capability-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.hook-template-capability-title {
  font-weight: 700;
  color: var(--color-text-main);
}

.hook-template-capability-subtitle {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-soft);
}

.hook-template-capability-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.hook-template-capability-card {
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.97) 100%);
}

.hook-template-form-stack {
  width: min(100%, 640px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hook-template-capability-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.hook-template-capability-card-title {
  font-weight: 700;
  color: var(--color-text-main);
}

.hook-template-capability-card-meta {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--color-text-soft);
}

.hook-template-variable-row {
  margin: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.hook-template-variable-title {
  min-width: 64px;
  font-size: 12px;
  color: var(--color-text-soft);
}

.hook-template-variable-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
}

.hook-template-capability-note {
  margin-bottom: 12px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--color-text-soft);
}

.hook-template-description {
  background: rgba(255, 255, 255, 0.66);
}

.gitops-rule-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gitops-unsupported-result {
  margin-top: 8px;
  border: 1px dashed rgba(217, 119, 6, 0.35);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 247, 237, 0.98) 0%, rgba(255, 251, 235, 0.96) 100%);
}

.gitops-unsupported-result:deep(.ant-result-title) {
  color: #9a3412;
}

.gitops-unsupported-result:deep(.ant-result-subtitle) {
  color: #7c5e10;
}

.gitops-rule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.gitops-rule-toolbar {
  display: flex;
  justify-content: flex-end;
}

.gitops-rule-title {
  font-weight: 600;
  color: var(--color-text-main);
}

.gitops-rule-subtitle {
  font-size: 12px;
  color: var(--color-text-soft);
}

.gitops-rule-item {
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
}

.gitops-rule-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.gitops-rule-item-title {
  font-weight: 600;
  color: var(--color-text-main);
}

.gitops-rule-source-tip {
  margin: -4px 0 12px;
  color: var(--color-text-soft);
  font-size: 12px;
}

.gitops-target-preview {
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.96) 100%);
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
  color: var(--color-text-main);
}

.gitops-target-select-row {
  margin-bottom: 12px;
}

.gitops-inline-item {
  margin-bottom: 0;
}

.gitops-code-text {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  word-break: break-all;
}

.param-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.param-name {
  font-weight: 600;
  color: var(--color-text-main);
}

.param-executor {
  font-size: 12px;
  color: var(--color-text-soft);
}

.template-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-name-text {
  font-weight: 600;
  color: var(--color-text-main);
}

.template-binding-warning-text {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-warning-strong, #b45309);
  line-height: 1.5;
}

@media (max-width: 992px) {
  .scope-card {
    margin-bottom: 16px;
  }

  .hook-template-summary-grid,
  .hook-template-capability-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hook-template-capability-header,
  .hook-template-capability-card-head,
  .hook-template-variable-row {
    flex-direction: column;
  }

  .hook-template-variable-tags {
    justify-content: flex-start;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
