<script setup lang="ts">
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  ReloadOutlined,
  StopFilled,
  SyncOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  buildReleaseOrderLogStreamURL,
  cancelReleaseOrder,
  executeReleaseOrder,
  getReleaseOrderByID,
  getReleaseOrderPipelineStageLog,
  listReleaseOrderExecutions,
  listReleaseOrderParams,
  listReleaseOrderValueProgress,
  listReleaseOrderPipelineStages,
  listReleaseOrderSteps,
  replayReleaseOrderByID,
  rollbackReleaseOrderByID,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import { useAuthStore } from '../../stores/auth'
import type {
  ReleaseOperationType,
  ReleaseOrder,
  ReleaseOrderExecution,
  ReleaseOrderLogStreamEvent,
  ReleaseOrderParam,
  ReleaseOrderValueProgress,
  ReleaseOrderValueProgressStatus,
  ReleaseOrderPipelineStage,
  ReleaseOrderStatus,
  ReleaseOrderStep,
  ReleasePipelineScope,
  ReleasePipelineStageStatus,
  ReleaseTriggerType,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const AUTO_REFRESH_INTERVAL_MS = 5000
// Keep pipeline stages in sync with the main release polling cadence so progress feels responsive.
const PIPELINE_STAGE_REFRESH_INTERVAL_MS = 5000

type ScopeLogState = {
  text: string
  offset: number
  connected: boolean
  connecting: boolean
  ended: boolean
  error: string
  statusText: string
  panelRef: HTMLElement | null
  stream: EventSource | null
  reconnectTimer: number | null
  closeIntentional: boolean
  autoFollow: boolean
}

function createScopeLogState(): ScopeLogState {
  return {
    text: '',
    offset: 0,
    connected: false,
    connecting: false,
    ended: false,
    error: '',
    statusText: '未连接',
    panelRef: null,
    stream: null,
    reconnectTimer: null,
    closeIntentional: false,
    autoFollow: true,
  }
}

const loading = ref(false)
const querying = ref(false)
const cancelling = ref(false)
const executing = ref(false)
const recovering = ref(false)
const autoRefreshTimer = ref<number | null>(null)
const executeLocked = ref(false)

const order = ref<ReleaseOrder | null>(null)
const params = ref<ReleaseOrderParam[]>([])
const valueProgress = ref<ReleaseOrderValueProgress[]>([])
const steps = ref<ReleaseOrderStep[]>([])
const executions = ref<ReleaseOrderExecution[]>([])
const pipelineStages = ref<ReleaseOrderPipelineStage[]>([])
const pipelineStageModuleVisible = ref(false)
const pipelineStageExecutorType = ref('')
const pipelineStageMessage = ref('')
const pipelineStageLoading = ref(false)
const lastPipelineStageRefreshAt = ref(0)

const stageLogDrawerVisible = ref(false)
const stageLogLoading = ref(false)
const stageLogContent = ref('')
const stageLogHasMore = ref(false)
const stageLogFetchedAt = ref('')
const selectedPipelineStage = ref<ReleaseOrderPipelineStage | null>(null)

const scopeLogStates = reactive<Record<ReleasePipelineScope, ScopeLogState>>({
  ci: createScopeLogState(),
  cd: createScopeLogState(),
})

const orderID = computed(() => String(route.params.id || '').trim())
const canViewParamSnapshot = computed(() => authStore.hasPermission('release.param_snapshot.view'))
const canCancel = computed(() => order.value?.status === 'pending' || order.value?.status === 'running')
const canExecute = computed(() => order.value?.status === 'pending' && !executeLocked.value)
const canRollback = computed(
  () => order.value?.status === 'success' && String(order.value?.cd_provider || '').trim().toLowerCase() === 'argocd',
)
const canReplay = computed(
  () =>
    order.value?.status === 'success' &&
    String(order.value?.cd_provider || '').trim().toLowerCase() !== 'argocd',
)
const shouldAutoRefresh = computed(() => {
  if (!order.value) {
    return true
  }
  return order.value.status === 'pending' || order.value.status === 'running'
})
const shouldKeepLogStreaming = computed(() => {
  if (!order.value) {
    return true
  }
  return order.value.status === 'pending' || order.value.status === 'running'
})

const executionMapByScope = computed<Record<ReleasePipelineScope, ReleaseOrderExecution | null>>(() => ({
  ci: executions.value.find((item) => item.pipeline_scope === 'ci') || null,
  cd: executions.value.find((item) => item.pipeline_scope === 'cd') || null,
}))

const visibleScopes = computed(() => {
  return (['ci', 'cd'] as ReleasePipelineScope[]).filter((scope) => Boolean(executionMapByScope.value[scope]))
})

const detailItems = computed(() => {
  if (!order.value) {
    return []
  }
  const items = [
    { key: 'order_no', label: '发布单号', value: order.value.order_no },
    { key: 'created_at', label: '创建时间', value: formatTime(order.value.created_at) },
    { key: 'operation_type', label: '操作类型', value: operationTypeText(order.value.operation_type) },
    { label: '应用名称', value: order.value.application_name || '-' },
    { label: '模板名称', value: order.value.template_name || '-' },
    { label: '模板 ID', value: order.value.template_id || '-' },
    { label: '触发方式', value: triggerTypeText(order.value.trigger_type) },
    { label: '创建者', value: order.value.triggered_by || '-' },
    { label: 'Git 版本', value: order.value.git_ref || '-' },
    { label: '镜像版本', value: order.value.image_tag || '-' },
    { label: '备注', value: order.value.remark || '-' },
    { label: '开始时间', value: formatTime(order.value.started_at) },
    { label: '结束时间', value: formatTime(order.value.finished_at) },
    { label: '更新时间', value: formatTime(order.value.updated_at) },
  ]
  if (order.value.operation_type !== 'deploy' && order.value.source_order_no) {
    items.splice(3, 0, { key: 'source_order_no', label: '来源发布单号', value: order.value.source_order_no })
  }
  return items
})

const heroFacts = computed(() => {
  if (!order.value) {
    return []
  }
  return [
    { label: '应用', value: order.value.application_name || '-' },
    { label: '环境', value: order.value.env_code || '-' },
    { label: 'Git 版本', value: order.value.git_ref || '-' },
  ]
})

const contextFacts = computed(() => {
  if (!order.value) {
    return []
  }
  return [
    { label: '模板', value: order.value.template_name || '-' },
    { label: '模板 ID', value: order.value.template_id || '-' },
    { label: '触发方式', value: triggerTypeText(order.value.trigger_type) },
    { label: '创建者', value: order.value.triggered_by || '-' },
    { label: '创建时间', value: formatTime(order.value.created_at) },
    { label: '开始时间', value: formatTime(order.value.started_at) },
    { label: '结束时间', value: formatTime(order.value.finished_at) },
    { label: '更新时间', value: formatTime(order.value.updated_at) },
  ]
})

const spotlightStep = computed(() => {
  const failedSteps = [...steps.value].filter((item) => item.status === 'failed').sort(sortSteps)
  if (failedSteps.length > 0) {
    return failedSteps[failedSteps.length - 1]
  }
  const runningSteps = [...steps.value].filter((item) => item.status === 'running').sort(sortSteps)
  if (runningSteps.length > 0) {
    return runningSteps[runningSteps.length - 1]
  }
  const successSteps = [...steps.value].filter((item) => item.status === 'success').sort(sortSteps)
  if (successSteps.length > 0) {
    return successSteps[successSteps.length - 1]
  }
  return null
})

const spotlightTone = computed<'error' | 'processing' | 'success' | 'warning'>(() => {
  if (!order.value) {
    return 'warning'
  }
  switch (order.value.status) {
    case 'failed':
      return 'error'
    case 'running':
      return 'processing'
    case 'success':
      return 'success'
    default:
      return 'warning'
  }
})

const spotlightStatusKey = computed<'failed' | 'running' | 'success' | 'cancelled' | 'pending'>(() => {
  if (!order.value) {
    return 'pending'
  }
  switch (order.value.status) {
    case 'failed':
      return 'failed'
    case 'running':
      return 'running'
    case 'success':
      return 'success'
    case 'cancelled':
      return 'cancelled'
    default:
      return 'pending'
  }
})

const spotlightMeta = computed(() => {
  const step = spotlightStep.value
  if (step) {
    return `${step.step_name} · ${statusText(step.status)}`
  }
  if (!order.value) {
    return '等待获取发布详情'
  }
  return `发布单状态 · ${statusText(order.value.status)}`
})

const spotlightTitle = computed(() => {
  if (!order.value) {
    return '等待加载发布状态'
  }
  if (order.value.status === 'failed') {
    return '发布失败，需要人工介入'
  }
  if (order.value.status === 'running') {
    return '发布执行中'
  }
  if (order.value.status === 'success') {
    return '发布已完成'
  }
  if (order.value.status === 'cancelled') {
    return '发布已取消'
  }
  return '发布待执行'
})

const spotlightDescription = computed(() => {
  const step = spotlightStep.value
  if (step) {
    const messageText = String(step.message || '').trim()
    if (messageText) {
      return `${step.step_name}：${messageText}`
    }
    return `${step.step_name}：${statusText(step.status)}`
  }
  if (!order.value) {
    return '正在加载发布详情'
  }
  return `当前状态：${statusText(order.value.status)}`
})

const executionSections = computed(() =>
  visibleScopes.value.map((scope) => ({
    scope,
    title: `${scopeLabel(scope)} 执行单元`,
    execution: executionMapByScope.value[scope] as ReleaseOrderExecution,
  })),
)

const paramGroups = computed(() => {
  const map: Record<ReleasePipelineScope, ReleaseOrderParam[]> = { ci: [], cd: [] }
  params.value.forEach((item) => {
    const scope = normalizeScope(item.pipeline_scope)
    if (!scope) {
      return
    }
    map[scope].push(item)
  })
  return visibleScopes.value
    .map((scope) => ({
      scope,
      title: `${scopeLabel(scope)} 参数快照`,
      items: map[scope],
    }))
})

const valueProgressGroups = computed(() => {
  const map: Record<ReleasePipelineScope, ReleaseOrderValueProgress[]> = { ci: [], cd: [] }
  valueProgress.value.forEach((item) => {
    const scope = normalizeScope(item.pipeline_scope)
    if (!scope) {
      return
    }
    map[scope].push(item)
  })
  return visibleScopes.value
    .map((scope) => ({
      scope,
      title: `${scopeLabel(scope)} 取值进度`,
      items: map[scope].sort((a, b) => a.sort_no - b.sort_no),
    }))
    .filter((group) => group.items.length > 0)
})

const stepGroups = computed(() => {
  const groups: Array<{ key: string; title: string; items: ReleaseOrderStep[] }> = []
  const globalSteps = steps.value.filter((item) => String(item.step_scope || '').trim().toLowerCase() === 'global').sort(sortSteps)
  if (globalSteps.length > 0) {
    groups.push({ key: 'global', title: '全局步骤', items: globalSteps })
  }
  visibleScopes.value.forEach((scope) => {
    const items = steps.value
      .filter((item) => String(item.step_scope || '').trim().toLowerCase() === scope)
      .sort(sortSteps)
    if (items.length > 0) {
      groups.push({ key: scope, title: `${scopeLabel(scope)} 步骤`, items })
    }
  })
  return groups
})

const stageGroupsByScope = computed<Record<ReleasePipelineScope, ReleaseOrderPipelineStage[]>>(() => {
  const map: Record<ReleasePipelineScope, ReleaseOrderPipelineStage[]> = { ci: [], cd: [] }
  pipelineStages.value.forEach((item) => {
    const scope = normalizeScope(item.pipeline_scope)
    if (!scope) {
      return
    }
    map[scope].push(item)
  })
  map.ci.sort((a, b) => a.sort_no - b.sort_no)
  map.cd.sort((a, b) => a.sort_no - b.sort_no)
  return map
})

const stageSections = computed(() =>
  visibleScopes.value.map((scope) => {
    const execution = executionMapByScope.value[scope]
    return {
      scope,
      title: `${scopeLabel(scope)} 管线进度`,
      execution,
      stages: stageGroupsByScope.value[scope],
      isJenkins: execution?.provider === 'jenkins',
      isArgoCD: execution?.provider === 'argocd',
    }
  }),
)

const logSections = computed(() =>
  visibleScopes.value.map((scope) => {
    const execution = executionMapByScope.value[scope]
    return {
      scope,
      title: `${scopeLabel(scope)} 日志`,
      execution,
      isJenkins: execution?.provider === 'jenkins',
      state: scopeLogStates[scope],
    }
  }),
)

const paramInitialColumns: TableColumnsType<ReleaseOrderParam> = [
  { title: '平台标准 Key', dataIndex: 'param_key', key: 'param_key', width: 180 },
  { title: '执行器参数名', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 220 },
  { title: '参数值', dataIndex: 'param_value', key: 'param_value', width: 300, ellipsis: true },
  { title: '来源', dataIndex: 'value_source', key: 'value_source', width: 150 },
  { title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 190 },
]
const { columns: paramColumns } = useResizableColumns(paramInitialColumns, {
  minWidth: 100,
  maxWidth: 620,
  hitArea: 10,
})

const pipelineStageInitialColumns: TableColumnsType<ReleaseOrderPipelineStage> = [
  { title: '顺序', dataIndex: 'sort_no', key: 'sort_no', width: 90 },
  { title: '阶段名称', dataIndex: 'stage_name', key: 'stage_name', width: 240 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '耗时', dataIndex: 'duration_millis', key: 'duration_millis', width: 140 },
  { title: '开始时间', dataIndex: 'started_at', key: 'started_at', width: 190 },
  { title: '结束时间', dataIndex: 'finished_at', key: 'finished_at', width: 190 },
  { title: '操作', key: 'actions', width: 120, fixed: 'right' },
]
const { columns: pipelineStageColumns } = useResizableColumns(pipelineStageInitialColumns, {
  minWidth: 100,
  maxWidth: 420,
  hitArea: 10,
})

const valueProgressInitialColumns: TableColumnsType<ReleaseOrderValueProgress> = [
  { title: '平台标准 Key', dataIndex: 'param_key', key: 'param_key', width: 180 },
  { title: '字段名称', dataIndex: 'param_name', key: 'param_name', width: 180 },
  { title: '执行器参数名', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 220 },
  { title: '当前值', dataIndex: 'value', key: 'value', width: 260, ellipsis: true },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '来源', dataIndex: 'value_source', key: 'value_source', width: 180 },
  { title: '说明', dataIndex: 'message', key: 'message', width: 320, ellipsis: true },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
]
const { columns: valueProgressColumns } = useResizableColumns(valueProgressInitialColumns, {
  minWidth: 100,
  maxWidth: 520,
  hitArea: 10,
})

function normalizeScope(scope: string): ReleasePipelineScope | null {
  const value = String(scope || '').trim().toLowerCase()
  if (value === 'ci' || value === 'cd') {
    return value as ReleasePipelineScope
  }
  return null
}

function scopeLabel(scope: ReleasePipelineScope) {
  return scope === 'ci' ? 'CI' : 'CD'
}

function formatTime(value: string | null) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function formatTimeCompact(value: string | null) {
  if (!value) {
    return ''
  }
  return dayjs(value).format('MM-DD HH:mm:ss')
}

function statusText(status: ReleaseOrderStatus | ReleaseOrderStep['status'] | ReleasePipelineStageStatus | ReleaseOrderExecution['status']) {
  switch (status) {
    case 'pending':
      return '待执行'
    case 'running':
      return '执行中'
    case 'success':
      return '成功'
    case 'failed':
      return '失败'
    case 'cancelled':
      return '已取消'
    case 'skipped':
      return '已跳过'
    default:
      return status
  }
}

function statusToneClass(status: ReleaseOrderStatus | ReleaseOrderStep['status'] | ReleasePipelineStageStatus | ReleaseOrderExecution['status']) {
  switch (status) {
    case 'success':
      return 'status-pill-success'
    case 'failed':
      return 'status-pill-failed'
    case 'running':
      return 'status-pill-running'
    case 'cancelled':
      return 'status-pill-neutral'
    case 'skipped':
      return 'status-pill-neutral'
    default:
      return 'status-pill-pending'
  }
}

function valueProgressStatusText(status: ReleaseOrderValueProgressStatus) {
  switch (status) {
    case 'resolved':
      return '已取值'
    case 'running':
      return '取值中'
    case 'failed':
      return '取值失败'
    case 'skipped':
      return '未取值'
    default:
      return '等待取值'
  }
}

function valueProgressToneClass(status: ReleaseOrderValueProgressStatus) {
  switch (status) {
    case 'resolved':
      return 'status-pill-success'
    case 'running':
      return 'status-pill-running'
    case 'failed':
      return 'status-pill-failed'
    case 'skipped':
      return 'status-pill-neutral'
    default:
      return 'status-pill-pending'
  }
}

function triggerTypeText(triggerType: ReleaseTriggerType | '' | null | undefined) {
  switch (String(triggerType || '').trim().toLowerCase()) {
    case 'manual':
      return '手动'
    case 'webhook':
      return 'Webhook'
    case 'schedule':
      return '定时'
    default:
      return triggerType || '-'
  }
}

function operationTypeText(operationType: ReleaseOperationType | '' | null | undefined) {
  switch (String(operationType || '').trim().toLowerCase()) {
    case 'rollback':
      return '标准回滚'
    case 'replay':
      return '重放回滚'
    default:
      return '普通发布'
  }
}

function isCiOnlyRecovery(record?: ReleaseOrder | null) {
  return String(record?.cd_provider || '').trim() === ''
}

function replayActionText(record?: ReleaseOrder | null) {
  return '回滚到此版本'
}

function replayConfirmTitle(record?: ReleaseOrder | null) {
  return isCiOnlyRecovery(record) ? '确认基于这张成功单创建 CI 重放回滚吗？' : '确认基于这张成功单创建重放回滚吗？'
}

function replaySuccessText(record: ReleaseOrder, orderNo: string) {
  return isCiOnlyRecovery(record) ? `已创建 CI 重放回滚单：${orderNo}` : `已创建重放回滚单：${orderNo}`
}

function replayFailureText(record?: ReleaseOrder | null) {
  return isCiOnlyRecovery(record) ? 'CI 重放回滚创建失败' : '重放回滚创建失败'
}

function isRunningStatus(status: ReleaseOrderStatus | ReleaseOrderStep['status'] | ReleasePipelineStageStatus | ReleaseOrderExecution['status']) {
  return status === 'running'
}

function formatDuration(durationMillis: number) {
  const value = Number(durationMillis || 0)
  if (!Number.isFinite(value) || value <= 0) {
    return '-'
  }
  if (value < 1000) {
    return `${Math.floor(value)} ms`
  }
  const totalSeconds = Math.floor(value / 1000)
  if (totalSeconds < 60) {
    return `${totalSeconds} s`
  }
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds}s`
}

function sortSteps(a: ReleaseOrderStep, b: ReleaseOrderStep) {
  if (a.sort_no !== b.sort_no) {
    return a.sort_no - b.sort_no
  }
  return a.step_code.localeCompare(b.step_code)
}

function stepComponentStatus(status: ReleaseOrderStep['status']) {
  switch (status) {
    case 'success':
      return 'finish'
    case 'running':
      return 'process'
    case 'failed':
      return 'error'
    default:
      return 'wait'
  }
}

function describeStep(step: ReleaseOrderStep) {
  const parts: string[] = []
  if (String(step.message || '').trim()) {
    parts.push(step.message)
  } else if (step.status === 'pending') {
    parts.push('等待执行')
  }
  const timeParts = [formatTimeCompact(step.started_at), formatTimeCompact(step.finished_at)].filter(Boolean)
  if (timeParts.length > 0) {
    parts.push(timeParts.join(' -> '))
  }
  return parts.join(' ｜ ')
}

function latestScopeStepMessage(
  scope: ReleasePipelineScope,
  preferredStatus?: ReleaseOrderStep['status'],
) {
  const scopedSteps = steps.value
    .filter((item) => String(item.step_scope || '').trim().toLowerCase() === scope)
    .sort(sortSteps)

  const candidates = preferredStatus
    ? scopedSteps.filter((item) => item.status === preferredStatus)
    : scopedSteps

  for (let index = candidates.length - 1; index >= 0; index -= 1) {
    const messageText = String(candidates[index].message || '').trim()
    if (messageText) {
      return messageText
    }
  }
  return ''
}

function pipelineStageEmptyDescription(section: {
  scope: ReleasePipelineScope
  execution: ReleaseOrderExecution | null
  isArgoCD: boolean
  isJenkins: boolean
}) {
  if (!section.execution) {
    return '暂无阶段数据'
  }

  if (section.isArgoCD) {
    const failedMessage = latestScopeStepMessage(section.scope, 'failed')
    switch (section.execution.status) {
      case 'failed':
        return failedMessage || 'CD 在启动阶段失败，尚未生成 GitOps / ArgoCD 聚合进度'
      case 'pending':
        return 'CD 尚未启动，待前置步骤完成后会自动生成 GitOps / ArgoCD 进度'
      case 'running':
        return 'GitOps 写回 / ArgoCD Sync 进度正在回收中，请稍后自动刷新'
      case 'success':
        return 'CD 已完成，但当前没有额外的聚合阶段数据'
      case 'cancelled':
        return failedMessage || 'CD 已取消，未生成聚合阶段数据'
      case 'skipped':
        return 'CD 已跳过，未生成聚合阶段数据'
      default:
        return '暂无阶段数据'
    }
  }

  if (section.isJenkins) {
    return latestScopeStepMessage(section.scope, 'failed') || '暂无阶段数据'
  }

  return latestScopeStepMessage(section.scope, 'failed') || '暂无阶段数据'
}

function parseStreamEvent(data: string): ReleaseOrderLogStreamEvent | null {
  const text = String(data || '').trim()
  if (!text) {
    return null
  }
  try {
    return JSON.parse(text) as ReleaseOrderLogStreamEvent
  } catch {
    return { type: 'status', timestamp: new Date().toISOString(), message: text }
  }
}

function getLogState(scope: ReleasePipelineScope) {
  return scopeLogStates[scope]
}

function setLogPanelRef(scope: ReleasePipelineScope, element: Element | null) {
  getLogState(scope).panelRef = element instanceof HTMLElement ? element : null
}

function isLogNearBottom(scope: ReleasePipelineScope) {
  const panel = getLogState(scope).panelRef
  if (!panel) {
    return true
  }
  const remain = panel.scrollHeight - panel.scrollTop - panel.clientHeight
  return remain <= 48
}

function scrollLogToBottom(scope: ReleasePipelineScope, force = false) {
  const state = getLogState(scope)
  if (!state.panelRef) {
    return
  }
  if (!force && !state.autoFollow) {
    return
  }
  state.panelRef.scrollTop = state.panelRef.scrollHeight
}

function syncLogFollowState(scope: ReleasePipelineScope) {
  getLogState(scope).autoFollow = isLogNearBottom(scope)
}

function handleLogFollowChange(scope: ReleasePipelineScope, checked: boolean) {
  const state = getLogState(scope)
  state.autoFollow = checked
  if (checked) {
    void nextTick(() => {
      scrollLogToBottom(scope, true)
    })
  }
}

function jumpLogToBottom(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  state.autoFollow = true
  void nextTick(() => {
    scrollLogToBottom(scope, true)
  })
}

function appendLogContent(scope: ReleasePipelineScope, content: string) {
  const state = getLogState(scope)
  const chunk = String(content || '')
  if (!chunk) {
    return
  }
  state.text = state.text ? state.text + chunk : chunk
  void nextTick(() => {
    scrollLogToBottom(scope)
  })
}

function appendStatusLine(scope: ReleasePipelineScope, messageText: string) {
  const text = String(messageText || '').trim()
  if (!text) {
    return
  }
  appendLogContent(scope, `[${dayjs().format('HH:mm:ss')}] ${text}\n`)
}

function clearReconnectTimer(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  if (state.reconnectTimer !== null) {
    window.clearTimeout(state.reconnectTimer)
    state.reconnectTimer = null
  }
}

function closeLogStream(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  clearReconnectTimer(scope)
  if (state.stream) {
    state.closeIntentional = true
    state.stream.close()
    state.stream = null
  }
  state.connected = false
  state.connecting = false
}

function resetLogState(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  closeLogStream(scope)
  state.text = ''
  state.offset = 0
  state.connected = false
  state.connecting = false
  state.ended = false
  state.error = ''
  state.statusText = '未连接'
  state.closeIntentional = false
  state.autoFollow = true
}

function scheduleReconnect(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  if (state.closeIntentional || state.ended || !shouldKeepLogStreaming.value) {
    return
  }
  clearReconnectTimer(scope)
  state.reconnectTimer = window.setTimeout(() => {
    void startLogStream(scope, false)
  }, 2000)
}

async function startLogStream(scope: ReleasePipelineScope, reset: boolean) {
  const execution = executionMapByScope.value[scope]
  if (!orderID.value || !execution || execution.provider !== 'jenkins') {
    return
  }

  const state = getLogState(scope)
  closeLogStream(scope)
  state.closeIntentional = false
  if (reset) {
    state.text = ''
    state.offset = 0
    state.error = ''
    state.ended = false
    state.statusText = '准备连接'
    state.autoFollow = true
  }

  const streamURL = buildReleaseOrderLogStreamURL(orderID.value, state.offset, authStore.accessToken, scope)
  const source = new EventSource(streamURL)
  state.stream = source
  state.connecting = true
  state.statusText = '连接中...'

  source.onopen = () => {
    state.connecting = false
    state.connected = true
    state.error = ''
    if (!state.ended) {
      state.statusText = '流式同步中'
    }
  }

  const handleEventData = (eventType: string, payload: MessageEvent<string>) => {
    const parsed = parseStreamEvent(payload.data)
    if (!parsed) {
      return
    }
    const eventOffset = Number(parsed.offset ?? Number.NaN)
    if (Number.isFinite(eventOffset) && eventOffset >= 0) {
      state.offset = Math.max(state.offset, Math.floor(eventOffset))
    }

    switch (eventType) {
      case 'log':
        appendLogContent(scope, String(parsed.content || ''))
        if (parsed.message) {
          appendStatusLine(scope, parsed.message)
        }
        return
      case 'done':
        if (parsed.message) {
          appendStatusLine(scope, parsed.message)
        }
        state.ended = true
        state.statusText = '已结束'
        state.closeIntentional = true
        source.close()
        state.stream = null
        state.connected = false
        state.connecting = false
        return
      case 'error':
        if (parsed.message) {
          appendStatusLine(scope, parsed.message)
          state.error = parsed.message
        } else {
          state.error = '日志流发生异常'
        }
        return
      default:
        if (parsed.message) {
          appendStatusLine(scope, parsed.message)
          state.statusText = parsed.message
        }
    }
  }

  source.addEventListener('log', (event) => {
    handleEventData('log', event as MessageEvent<string>)
  })
  source.addEventListener('status', (event) => {
    handleEventData('status', event as MessageEvent<string>)
  })
  source.addEventListener('done', (event) => {
    handleEventData('done', event as MessageEvent<string>)
  })
  source.addEventListener('error', (event) => {
    handleEventData('error', event as MessageEvent<string>)
  })

  source.onerror = () => {
    state.connecting = false
    state.connected = false
    if (state.closeIntentional || state.ended) {
      return
    }
    state.error = ''
    source.close()
    state.stream = null
    scheduleReconnect(scope)
  }
}

function reconnectLogStream(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  state.error = ''
  state.statusText = '准备重连'
  const shouldReset = state.ended || !shouldKeepLogStreaming.value
  if (shouldReset) {
    state.ended = false
  }
  void startLogStream(scope, shouldReset)
}

function clearLogOutput(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  state.text = ''
  state.offset = 0
  state.error = ''
  state.ended = false
  state.autoFollow = true
}

function logStreamTagColor(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  if (state.ended) {
    return 'default'
  }
  if (state.error) {
    return 'warning'
  }
  return 'processing'
}

function logStreamHintText(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  if (state.error) {
    return '日志异常'
  }
  if (latestScopeStepMessage(scope, 'failed')) {
    return '执行失败'
  }
  if (state.ended) {
    return '已结束'
  }
  return ''
}

function logSectionWarningMessage(scope: ReleasePipelineScope) {
  const state = getLogState(scope)
  if (state.error) {
    return state.error
  }
  return latestScopeStepMessage(scope, 'failed')
}

function logSectionEmptyDescription(scope: ReleasePipelineScope) {
  return logSectionWarningMessage(scope) || '暂无日志输出'
}

function syncVisibleLogStreams() {
  ;(['ci', 'cd'] as ReleasePipelineScope[]).forEach((scope) => {
    const execution = executionMapByScope.value[scope]
    const state = getLogState(scope)
    if (!execution || execution.provider !== 'jenkins') {
      resetLogState(scope)
      return
    }

    if (!state.stream && !state.connecting && state.text === '') {
      void startLogStream(scope, true)
      return
    }

    if (shouldKeepLogStreaming.value && !state.stream && !state.connecting && !state.ended) {
      void startLogStream(scope, false)
    }
  })
}

async function loadDetail(options?: { silent?: boolean }) {
  const silent = Boolean(options?.silent)
  if (!orderID.value) {
    if (!silent) {
      message.error('缺少发布单 ID')
      void router.push('/releases')
    }
    return
  }
  if (querying.value) {
    return
  }

  querying.value = true
  if (!silent) {
    loading.value = true
  }
  try {
    const previousStatus = order.value?.status || ''
    const [orderResp, executionsResp, paramsResp, valueProgressResp, stepsResp] = await Promise.all([
      getReleaseOrderByID(orderID.value),
      listReleaseOrderExecutions(orderID.value),
      canViewParamSnapshot.value ? listReleaseOrderParams(orderID.value) : Promise.resolve({ data: [] }),
      canViewParamSnapshot.value ? listReleaseOrderValueProgress(orderID.value) : Promise.resolve({ data: [] }),
      listReleaseOrderSteps(orderID.value),
    ])
    order.value = orderResp.data
    executions.value = [...executionsResp.data].sort((a, b) => scopeSort(a.pipeline_scope) - scopeSort(b.pipeline_scope))
    params.value = paramsResp.data
    valueProgress.value = valueProgressResp.data
    steps.value = stepsResp.data

    const now = Date.now()
    const shouldRefreshPipelineStages =
      !stageLogDrawerVisible.value &&
      (!silent ||
        pipelineStages.value.length === 0 ||
        previousStatus !== orderResp.data.status ||
        now - lastPipelineStageRefreshAt.value >= PIPELINE_STAGE_REFRESH_INTERVAL_MS)
    if (shouldRefreshPipelineStages) {
      await loadPipelineStageView({ silent })
    }

    syncVisibleLogStreams()
  } catch (error) {
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, '发布单详情加载失败'))
      void router.push('/releases')
    }
  } finally {
    querying.value = false
    if (!silent) {
      loading.value = false
    }
  }
}

function scopeSort(scope: string) {
  const normalized = String(scope || '').trim().toLowerCase()
  if (normalized === 'ci') {
    return 1
  }
  if (normalized === 'cd') {
    return 2
  }
  return 99
}

async function loadPipelineStageView(options?: { silent?: boolean }) {
  if (!orderID.value) {
    return
  }
  const silent = Boolean(options?.silent)
  if (!silent) {
    pipelineStageLoading.value = true
  }
  try {
    const response = await listReleaseOrderPipelineStages(orderID.value)
    pipelineStageModuleVisible.value = Boolean(response.show_module)
    pipelineStageExecutorType.value = String(response.executor_type || '').trim()
    pipelineStageMessage.value = String(response.message || '').trim()
    pipelineStages.value = response.data || []
    lastPipelineStageRefreshAt.value = Date.now()
  } catch (error) {
    if (silent) {
      pipelineStageMessage.value = extractHTTPErrorMessage(error, '管线阶段暂时同步失败，请稍后手动刷新')
    } else {
      pipelineStageModuleVisible.value = false
      pipelineStageExecutorType.value = ''
      pipelineStageMessage.value = ''
      pipelineStages.value = []
      message.error(extractHTTPErrorMessage(error, '管线阶段加载失败'))
    }
  } finally {
    if (!silent) {
      pipelineStageLoading.value = false
    }
  }
}

async function openStageLogDrawer(stage: ReleaseOrderPipelineStage) {
  selectedPipelineStage.value = stage
  stageLogDrawerVisible.value = true
  await loadStageLog()
}

function closeStageLogDrawer() {
  stageLogDrawerVisible.value = false
  selectedPipelineStage.value = null
  stageLogContent.value = ''
  stageLogHasMore.value = false
  stageLogFetchedAt.value = ''
}

async function loadStageLog() {
  if (!orderID.value || !selectedPipelineStage.value) {
    return
  }
  stageLogLoading.value = true
  try {
    const response = await getReleaseOrderPipelineStageLog(orderID.value, selectedPipelineStage.value.id)
    selectedPipelineStage.value = response.data.stage
    stageLogContent.value = response.data.content || ''
    stageLogHasMore.value = Boolean(response.data.has_more)
    stageLogFetchedAt.value = formatTime(response.data.fetched_at)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '阶段日志加载失败'))
  } finally {
    stageLogLoading.value = false
  }
}

async function handleCancel() {
  if (!order.value) {
    return
  }
  cancelling.value = true
  try {
    const response = await cancelReleaseOrder(order.value.id)
    order.value = response.data
    message.success('发布单取消成功')
    await loadDetail({ silent: true })
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布单取消失败'))
  } finally {
    cancelling.value = false
  }
}

async function handleExecute() {
  if (!order.value || executeLocked.value) {
    return
  }
  if (!canExecute.value) {
    message.warning('当前发布单已执行完成、已取消或不处于待执行状态，无法再次触发发布')
    return
  }
  executeLocked.value = true
  executing.value = true
  try {
    const response = await executeReleaseOrder(order.value.id)
    order.value = response.data
    message.success('发布已提交，正在调度执行')
    await loadDetail({ silent: true })
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布执行失败'))
  } finally {
    executing.value = false
  }
}

async function handleRollback() {
  if (!order.value || !canRollback.value) {
    return
  }
  recovering.value = true
  try {
    const response = await rollbackReleaseOrderByID(order.value.id)
    message.success(`已创建标准回滚单：${response.data.order_no}`)
    void router.push(`/releases/${response.data.id}`)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准回滚创建失败'))
  } finally {
    recovering.value = false
  }
}

async function handleReplay() {
  if (!order.value || !canReplay.value) {
    return
  }
  recovering.value = true
  try {
    const response = await replayReleaseOrderByID(order.value.id)
    message.success(replaySuccessText(order.value, response.data.order_no))
    void router.push(`/releases/${response.data.id}`)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, replayFailureText(order.value)))
  } finally {
    recovering.value = false
  }
}

function goBack() {
  void router.push('/releases')
}

function stopAutoRefresh() {
  if (autoRefreshTimer.value !== null) {
    window.clearInterval(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

function startAutoRefresh() {
  stopAutoRefresh()
  autoRefreshTimer.value = window.setInterval(() => {
    if (document.hidden || cancelling.value || !shouldAutoRefresh.value) {
      return
    }
    void loadDetail({ silent: true })
  }, AUTO_REFRESH_INTERVAL_MS)
}

function closeAllLogStreams() {
  ;(['ci', 'cd'] as ReleasePipelineScope[]).forEach((scope) => {
    closeLogStream(scope)
  })
}

onMounted(async () => {
  await loadDetail()
  startAutoRefresh()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
  closeAllLogStreams()
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
          返回发布单
        </a-button>
        <div class="page-header-copy">
          <h2 class="page-title">发布单详情</h2>
          <p class="page-subtitle">按 CI / CD 双视图查看发布轨迹、执行状态、日志与阶段进度。</p>
        </div>
      </div>
      <a-space>
        <a-button @click="loadDetail">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新
        </a-button>
        <a-popconfirm
          v-if="canExecute"
          title="确认执行当前发布单吗？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleExecute"
        >
          <template #icon>
            <ExclamationCircleOutlined />
          </template>
          <a-button type="primary" :loading="executing" :disabled="executeLocked">发布</a-button>
        </a-popconfirm>
        <a-button v-else type="primary" disabled>发布</a-button>
        <a-popconfirm
          v-if="canRollback"
          title="确认基于这张成功单创建标准回滚吗？"
          ok-text="确认回滚"
          cancel-text="取消"
          @confirm="handleRollback"
        >
          <template #icon>
            <ExclamationCircleOutlined class="danger-icon" />
          </template>
          <a-button danger :loading="recovering">回滚到此版本</a-button>
        </a-popconfirm>
        <a-popconfirm
          v-else-if="canReplay"
          :title="replayConfirmTitle(order)"
          :ok-text="isCiOnlyRecovery(order) ? '确认恢复' : '确认重放'"
          cancel-text="取消"
          @confirm="handleReplay"
        >
          <template #icon>
            <ExclamationCircleOutlined />
          </template>
          <a-button :loading="recovering">{{ replayActionText(order) }}</a-button>
        </a-popconfirm>
        <a-popconfirm
          v-if="canCancel"
          title="确认取消当前发布单吗？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleCancel"
        >
          <template #icon>
            <ExclamationCircleOutlined class="danger-icon" />
          </template>
          <a-button danger :loading="cancelling">取消发布</a-button>
        </a-popconfirm>
      </a-space>
    </div>

    <a-card class="detail-card release-hero-card" :loading="loading" :bordered="true">
      <div class="release-hero">
        <div class="release-hero-main">
          <div class="release-hero-title-row">
            <div>
              <div class="release-hero-label">发布单号</div>
              <div class="release-hero-order">
                <span>{{ order?.order_no || '-' }}</span>
                <a-tag v-if="order?.operation_type === 'rollback'" class="status-chip status-chip-danger">
                  {{ operationTypeText(order?.operation_type) }}
                </a-tag>
                <a-tag v-else-if="order?.operation_type === 'replay'" class="status-chip status-chip-warning">
                  {{ operationTypeText(order?.operation_type) }}
                </a-tag>
              </div>
            </div>
          </div>

          <div class="release-hero-facts">
            <div v-for="item in heroFacts" :key="item.label" class="hero-fact">
              <span class="hero-fact-label">{{ item.label }}</span>
              <span class="hero-fact-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div class="release-spotlight" :class="`release-spotlight-${spotlightStatusKey}`">
          <div class="release-spotlight-content">
            <div class="release-spotlight-header">
              <div class="release-spotlight-label">整体进度</div>
            </div>
            <div class="release-spotlight-title">{{ spotlightTitle }}</div>
            <div class="release-spotlight-description">{{ spotlightDescription }}</div>
            <div class="release-spotlight-meta">{{ spotlightMeta }}</div>
          </div>
          <div class="release-spotlight-icon-wrap">
            <div class="release-spotlight-icon-orb" :class="`release-spotlight-icon-orb-${spotlightStatusKey}`">
              <SyncOutlined v-if="spotlightStatusKey === 'running'" spin class="release-spotlight-icon" />
              <CheckCircleFilled v-else-if="spotlightStatusKey === 'success'" class="release-spotlight-icon" />
              <CloseCircleFilled v-else-if="spotlightStatusKey === 'failed'" class="release-spotlight-icon" />
              <StopFilled v-else-if="spotlightStatusKey === 'cancelled'" class="release-spotlight-icon" />
              <ClockCircleFilled v-else class="release-spotlight-icon" />
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <div class="detail-dashboard">
      <div class="dashboard-main">
        <a-card class="detail-card" title="执行时间线" :loading="loading" :bordered="true">
          <a-empty v-if="stepGroups.length === 0" description="暂无步骤数据" />
          <div v-else class="step-groups">
              <div v-for="group in stepGroups" :key="group.key" class="scope-section">
                <div class="scope-section-header scope-section-header-inline">
                  <a-tag class="status-chip status-chip-section">{{ group.title }}</a-tag>
                  <span class="scope-section-subtitle">{{ group.items.length }} 个步骤</span>
                </div>
              <a-steps direction="vertical" size="small" class="step-progress">
                <a-step
                  v-for="step in group.items"
                  :key="step.id"
                  :title="step.step_name"
                  :status="stepComponentStatus(step.status)"
                >
                  <template #description>
                    <div class="step-description">{{ describeStep(step) }}</div>
                  </template>
                </a-step>
              </a-steps>
            </div>
          </div>
        </a-card>

        <a-card class="detail-card" title="阶段与日志" :loading="pipelineStageLoading" :bordered="true">
          <a-tabs>
            <a-tab-pane key="stages" tab="管线进度">
              <template #tab>
                <span>管线进度</span>
              </template>
              <div class="stage-toolbar">
                <a-space>
                  <a-tag v-if="pipelineStageExecutorType" class="status-chip status-chip-running">{{ pipelineStageExecutorType }}</a-tag>
                  <a-button size="small" @click="loadPipelineStageView">刷新阶段</a-button>
                </a-space>
              </div>

              <a-alert v-if="pipelineStageMessage" class="pipeline-stage-alert" type="info" show-icon :message="pipelineStageMessage" />

              <div v-if="stageSections.length > 0" class="stage-sections">
                <div v-for="section in stageSections" :key="section.scope" class="scope-section">
                  <div class="scope-section-header scope-section-header-inline">
                    <a-tag class="status-chip status-chip-section">{{ section.title }}</a-tag>
                    <span class="scope-section-subtitle">{{ section.execution?.binding_name || '-' }}</span>
                  </div>

                  <a-alert
                    v-if="section.isArgoCD"
                    class="pipeline-stage-alert"
                    type="info"
                    show-icon
                    message="当前阶段来自 ArgoCD 执行链路，展示的是 GitOps 写回、Sync 与健康检查进度。"
                  />
                  <a-alert
                    v-else-if="!section.isJenkins"
                    class="pipeline-stage-alert"
                    type="info"
                    show-icon
                    :message="`${scopeLabel(section.scope)} 当前使用 ${section.execution?.provider || '未知执行器'}，部署进度视图待接入。`"
                  />
                  <a-empty v-if="section.stages.length === 0" :description="pipelineStageEmptyDescription(section)" />
                  <a-table
                    v-else
                    row-key="id"
                    :columns="pipelineStageColumns"
                    :data-source="section.stages"
                    :pagination="false"
                    :scroll="{ x: 1200 }"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'status'">
                        <a-tag :class="['status-tag', statusToneClass(record.status)]">
                          <LoadingOutlined v-if="isRunningStatus(record.status)" spin />
                          <span>{{ statusText(record.status) }}</span>
                        </a-tag>
                      </template>
                      <template v-else-if="column.key === 'duration_millis'">
                        {{ formatDuration(record.duration_millis) }}
                      </template>
                      <template v-else-if="column.key === 'started_at'">
                        {{ formatTime(record.started_at) }}
                      </template>
                      <template v-else-if="column.key === 'finished_at'">
                        {{ formatTime(record.finished_at) }}
                      </template>
                      <template v-else-if="column.key === 'actions'">
                        <a-button
                          v-if="section.isJenkins"
                          type="link"
                          size="small"
                          @click="openStageLogDrawer(record)"
                        >
                          <template #icon>
                            <EyeOutlined />
                          </template>
                          查看日志
                        </a-button>
                        <span v-else>-</span>
                      </template>
                    </template>
                  </a-table>
                </div>
              </div>
              <a-empty v-else description="暂无管线进度数据" />
            </a-tab-pane>

            <a-tab-pane key="logs" tab="实时日志">
              <template #tab>
                <span>实时日志</span>
              </template>
              <div class="log-sections">
                <a-card v-for="section in logSections" :key="section.scope" class="nested-card" :title="section.title" :bordered="false">
                  <template #extra>
                    <a-space v-if="section.isJenkins">
                      <a-tag v-if="logStreamHintText(section.scope)" :color="logStreamTagColor(section.scope)">{{ logStreamHintText(section.scope) }}</a-tag>
                      <a-switch
                        size="small"
                        :checked="section.state.autoFollow"
                        checked-children="跟随"
                        un-checked-children="暂停"
                        @change="handleLogFollowChange(section.scope, $event)"
                      />
                      <a-button size="small" @click="jumpLogToBottom(section.scope)">底部</a-button>
                      <a-button size="small" @click="reconnectLogStream(section.scope)" :loading="section.state.connecting">重连</a-button>
                      <a-button size="small" @click="clearLogOutput(section.scope)">清空</a-button>
                    </a-space>
                  </template>

                  <a-alert
                    v-if="!section.isJenkins"
                    class="log-alert"
                    type="info"
                    show-icon
                    :message="section.execution?.provider === 'argocd'
                      ? `${scopeLabel(section.scope)} 当前使用 ArgoCD，当前版本先展示执行进度；事件流/日志视图将在后续版本补齐。`
                      : `${scopeLabel(section.scope)} 当前使用 ${section.execution?.provider || '未知执行器'}，独立日志视图待接入。`"
                  />
                  <template v-else>
                    <a-alert
                      v-if="logSectionWarningMessage(section.scope)"
                      class="log-alert"
                      type="warning"
                      show-icon
                      :message="logSectionWarningMessage(section.scope)"
                    />
                    <pre :ref="(el) => setLogPanelRef(section.scope, el as Element | null)" class="log-panel" @scroll="syncLogFollowState(section.scope)">{{ section.state.text || logSectionEmptyDescription(section.scope) }}</pre>
                  </template>
                </a-card>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>

        <a-collapse class="detail-collapse" ghost>
          <a-collapse-panel key="base-info" header="基础信息与参数快照">
            <a-card class="nested-card" title="基础信息" :loading="loading" :bordered="false">
                <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
                <a-descriptions-item v-for="item in detailItems" :key="item.key || item.label" :label="item.label">
                    <template v-if="item.key === 'order_no'">
                      <a-space :size="6">
                        <span>{{ item.value }}</span>
                        <a-tag v-if="order?.operation_type === 'rollback'" class="status-chip status-chip-danger">
                          {{ operationTypeText(order?.operation_type) }}
                        </a-tag>
                        <a-tag v-else-if="order?.operation_type === 'replay'" class="status-chip status-chip-warning">
                          {{ operationTypeText(order?.operation_type) }}
                        </a-tag>
                      </a-space>
                    </template>
                  <template v-else>
                    {{ item.value }}
                  </template>
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <template v-if="canViewParamSnapshot">
              <a-card
                v-for="group in paramGroups"
                :key="group.scope"
                class="nested-card"
                :title="group.title"
                :loading="loading"
                :bordered="false"
              >
                <a-empty v-if="group.items.length === 0" description="暂无参数快照" />
                <a-table
                  v-else
                  row-key="id"
                  :columns="paramColumns"
                  :data-source="group.items"
                  :pagination="false"
                  :scroll="{ x: 1200 }"
                >
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'created_at'">
                      {{ formatTime(record.created_at) }}
                    </template>
                    <template v-else-if="column.key === 'param_value'">
                      {{ record.param_value || '-' }}
                    </template>
                  </template>
                </a-table>
              </a-card>
            </template>
          </a-collapse-panel>
        </a-collapse>
      </div>

      <div class="dashboard-side">
        <a-card class="detail-card" title="执行单元" :loading="loading" :bordered="true">
          <div class="execution-stack">
            <div v-for="item in executionSections" :key="item.scope" class="execution-summary-card">
              <div class="execution-summary-head">
                <div>
                  <div class="execution-summary-title">{{ item.title }}</div>
                  <div class="execution-summary-subtitle">{{ item.execution.binding_name || '-' }}</div>
                </div>
                <a-tag :class="['status-tag', statusToneClass(item.execution.status)]">
                  <LoadingOutlined v-if="isRunningStatus(item.execution.status)" spin />
                  <span>{{ statusText(item.execution.status) }}</span>
                </a-tag>
              </div>
              <div class="execution-summary-meta">
                <span>执行器：{{ item.execution.provider || '-' }}</span>
                <span>开始：{{ formatTime(item.execution.started_at) }}</span>
                <span>结束：{{ formatTime(item.execution.finished_at) }}</span>
              </div>
            </div>
          </div>
        </a-card>

        <a-card class="detail-card" title="发布上下文" :loading="loading" :bordered="true">
          <div class="context-list">
            <div v-for="item in contextFacts" :key="item.label" class="context-item">
              <span class="context-label">{{ item.label }}</span>
              <span class="context-value">{{ item.value }}</span>
            </div>
          </div>
        </a-card>

        <template v-if="canViewParamSnapshot">
          <a-card
            v-for="group in valueProgressGroups"
            :key="`value-${group.scope}`"
            class="detail-card"
            :title="group.title"
            :loading="loading"
            :bordered="true"
          >
            <a-alert
              class="pipeline-stage-alert"
              type="info"
              show-icon
              message="这里展示模板中已映射标准 Key 的实时取值情况。"
            />
            <a-table
              row-key="rowKey"
              :columns="valueProgressColumns"
              :data-source="group.items.map((item) => ({ ...item, rowKey: `${item.pipeline_scope}-${item.param_key}-${item.executor_param_name}` }))"
              :pagination="false"
              size="small"
              :scroll="{ x: 1200 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <a-tag :class="['status-tag', valueProgressToneClass(record.status)]">
                    <LoadingOutlined v-if="record.status === 'running'" spin />
                    <span>{{ valueProgressStatusText(record.status) }}</span>
                  </a-tag>
                </template>
                <template v-else-if="column.key === 'value'">
                  {{ record.value || '-' }}
                </template>
                <template v-else-if="column.key === 'value_source'">
                  {{ record.value_source || '-' }}
                </template>
                <template v-else-if="column.key === 'updated_at'">
                  {{ formatTime(record.updated_at) }}
                </template>
                <template v-else-if="column.key === 'param_name'">
                  <span>{{ record.param_name || '-' }}</span>
                  <a-tag v-if="record.required" class="required-tag status-chip status-chip-danger">必需</a-tag>
                </template>
              </template>
            </a-table>
          </a-card>
        </template>
      </div>
    </div>

    <a-drawer
      :open="stageLogDrawerVisible"
      :width="760"
      :title="selectedPipelineStage ? `${selectedPipelineStage.pipeline_scope?.toUpperCase() || ''} 阶段日志 · ${selectedPipelineStage.stage_name}` : '阶段日志'"
      @close="closeStageLogDrawer"
    >
      <template #extra>
        <a-space>
          <a-tag v-if="selectedPipelineStage" :class="['status-tag', statusToneClass(selectedPipelineStage.status)]">
            {{ statusText(selectedPipelineStage.status) }}
          </a-tag>
          <a-button size="small" :loading="stageLogLoading" @click="loadStageLog">刷新日志</a-button>
        </a-space>
      </template>

      <a-alert
        v-if="stageLogFetchedAt"
        class="pipeline-stage-alert"
        type="info"
        show-icon
        :message="`最近同步时间：${stageLogFetchedAt}${stageLogHasMore ? '，当前阶段仍在持续输出日志' : ''}`"
      />
      <pre class="log-panel stage-log-panel">{{ stageLogContent || '暂无阶段日志输出' }}</pre>
    </a-drawer>
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

.detail-card {
  border-radius: var(--radius-xl);
}

.release-hero-card {
  overflow: hidden;
  background:
    radial-gradient(circle at top left, var(--color-primary-glow), transparent 34%),
    linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-subtle) 100%);
}

.release-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.9fr);
  gap: 20px;
  align-items: stretch;
}

.release-hero-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.release-hero-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.release-hero-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.release-hero-order {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 800;
  color: var(--color-dashboard-900);
  word-break: break-all;
}

.release-hero-status {
  align-self: flex-start;
  padding: 7px 14px;
  font-size: 13px;
  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.12);
}

.release-hero-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.hero-fact {
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid var(--color-panel-border-strong);
  background: rgba(255, 255, 255, 0.78);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-fact-label {
  font-size: 12px;
  color: var(--color-text-soft);
}

.hero-fact-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-dashboard-900);
  word-break: break-word;
}

.release-spotlight {
  border-radius: 22px;
  align-self: stretch;
  border: 1px solid rgba(96, 165, 250, 0.22);
  background:
    radial-gradient(circle at top right, rgba(96, 165, 250, 0.14), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
  padding: 24px 26px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 92px;
  gap: 22px;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.release-spotlight-success {
  border-color: rgba(74, 222, 128, 0.38);
  background:
    radial-gradient(circle at top right, rgba(74, 222, 128, 0.16), transparent 40%),
    linear-gradient(180deg, rgba(240, 253, 244, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
}

.release-spotlight-running {
  border-color: rgba(96, 165, 250, 0.38);
  background:
    radial-gradient(circle at top right, rgba(96, 165, 250, 0.16), transparent 40%),
    linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
}

.release-spotlight-failed {
  border-color: rgba(251, 113, 133, 0.34);
  background:
    radial-gradient(circle at top right, rgba(251, 113, 133, 0.14), transparent 40%),
    linear-gradient(180deg, rgba(255, 241, 242, 0.98) 0%, rgba(255, 250, 250, 0.94) 100%);
}

.release-spotlight-cancelled,
.release-spotlight-pending {
  border-color: rgba(251, 191, 36, 0.34);
  background:
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.14), transparent 40%),
    linear-gradient(180deg, rgba(255, 247, 237, 0.98) 0%, rgba(255, 251, 235, 0.94) 100%);
}

.release-spotlight-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.release-spotlight-icon-orb {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 10px 24px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(10px);
}

.release-spotlight-icon-orb-success {
  color: #15803d;
  background: linear-gradient(180deg, rgba(240, 253, 244, 0.9) 0%, rgba(255, 255, 255, 0.74) 100%);
  border-color: rgba(134, 239, 172, 0.4);
}

.release-spotlight-icon-orb-running {
  color: #1d4ed8;
  background: linear-gradient(180deg, rgba(239, 246, 255, 0.9) 0%, rgba(255, 255, 255, 0.74) 100%);
  border-color: rgba(147, 197, 253, 0.4);
}

.release-spotlight-icon-orb-failed {
  color: #b91c1c;
  background: linear-gradient(180deg, rgba(255, 241, 242, 0.9) 0%, rgba(255, 255, 255, 0.74) 100%);
  border-color: rgba(253, 164, 175, 0.42);
}

.release-spotlight-icon-orb-cancelled,
.release-spotlight-icon-orb-pending {
  color: #b45309;
  background: linear-gradient(180deg, rgba(255, 247, 237, 0.92) 0%, rgba(255, 255, 255, 0.74) 100%);
  border-color: rgba(253, 186, 116, 0.42);
}

.release-spotlight-icon {
  font-size: 24px;
}

.release-spotlight-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.release-spotlight-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.release-spotlight-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.release-spotlight-title {
  font-size: 24px;
  line-height: 1.2;
  font-weight: 800;
  color: var(--color-dashboard-900);
}

.release-spotlight-description {
  color: var(--color-text-secondary);
  line-height: 1.9;
  max-width: 520px;
}

.release-spotlight-meta {
  color: var(--color-text-soft);
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.detail-dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.9fr);
  gap: 18px;
  align-items: start;
}

.dashboard-main,
.dashboard-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.execution-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.execution-summary-card {
  padding: 16px;
  border-radius: 16px;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.96) 100%);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.06);
}

.execution-summary-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.execution-summary-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-main);
}

.execution-summary-subtitle {
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.execution-summary-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 14px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.scope-section + .scope-section {
  margin-top: 20px;
}

.scope-section-header {
  margin-bottom: 12px;
}

.scope-section-header-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.scope-section-subtitle {
  font-size: 12px;
  color: var(--color-text-soft);
}

.step-description {
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.danger-icon {
  color: var(--color-danger);
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 5px 10px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.status-tag :deep(.anticon),
.status-chip :deep(.anticon) {
  color: currentColor;
}

.status-pill-success {
  color: #15803d;
  background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.status-pill-running {
  color: #1d4ed8;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.status-pill-failed {
  color: #b91c1c;
  background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
  border-color: #fda4af;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.status-pill-pending {
  color: #b45309;
  background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
  border-color: #fdba74;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.status-pill-neutral {
  color: #475569;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #cbd5e1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.status-chip {
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid transparent;
}

.status-chip-section {
  color: #0f172a;
  background: linear-gradient(180deg, rgba(226, 232, 240, 0.92) 0%, rgba(203, 213, 225, 0.85) 100%);
  border-color: rgba(148, 163, 184, 0.46);
}

.status-chip-running {
  color: #1d4ed8;
  background: linear-gradient(180deg, rgba(239, 246, 255, 0.96) 0%, rgba(219, 234, 254, 0.9) 100%);
  border-color: rgba(96, 165, 250, 0.56);
}

.status-chip-danger {
  color: #b91c1c;
  background: linear-gradient(180deg, rgba(255, 241, 242, 0.98) 0%, rgba(255, 228, 230, 0.92) 100%);
  border-color: rgba(251, 113, 133, 0.48);
}

.required-tag {
  margin-left: 8px;
}

.context-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.context-item {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--color-panel-divider);
}

.context-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.context-label {
  color: var(--color-text-soft);
  font-size: 13px;
}

.context-value {
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
}

.log-alert,
.pipeline-stage-alert {
  margin-bottom: 12px;
  border-radius: 16px;
  border-width: 1px;
  border-style: solid;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.84),
    0 10px 24px rgba(15, 23, 42, 0.04);
}

.log-alert :deep(.ant-alert-icon),
.pipeline-stage-alert :deep(.ant-alert-icon) {
  color: var(--color-primary-500);
}

.log-alert :deep(.ant-alert-message),
.pipeline-stage-alert :deep(.ant-alert-message) {
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
}

.log-alert :deep(.ant-alert-description),
.pipeline-stage-alert :deep(.ant-alert-description) {
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.log-alert.ant-alert-info,
.pipeline-stage-alert.ant-alert-info {
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border-color: #93c5fd;
}

.log-alert.ant-alert-info :deep(.ant-alert-message),
.log-alert.ant-alert-info :deep(.ant-alert-icon),
.pipeline-stage-alert.ant-alert-info :deep(.ant-alert-message),
.pipeline-stage-alert.ant-alert-info :deep(.ant-alert-icon) {
  color: #1d4ed8;
}

.log-alert.ant-alert-warning,
.pipeline-stage-alert.ant-alert-warning {
  background: linear-gradient(180deg, #fff7ed 0%, #fffbeb 100%);
  border-color: #fdba74;
}

.log-alert.ant-alert-warning :deep(.ant-alert-message),
.log-alert.ant-alert-warning :deep(.ant-alert-icon),
.pipeline-stage-alert.ant-alert-warning :deep(.ant-alert-message),
.pipeline-stage-alert.ant-alert-warning :deep(.ant-alert-icon) {
  color: #b45309;
}

.log-alert.ant-alert-error,
.pipeline-stage-alert.ant-alert-error {
  background: linear-gradient(180deg, #fff1f2 0%, #fff5f5 100%);
  border-color: #fda4af;
}

.log-alert.ant-alert-error :deep(.ant-alert-message),
.log-alert.ant-alert-error :deep(.ant-alert-icon),
.pipeline-stage-alert.ant-alert-error :deep(.ant-alert-message),
.pipeline-stage-alert.ant-alert-error :deep(.ant-alert-icon) {
  color: #b91c1c;
}

.stage-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.stage-toolbar :deep(.ant-btn .anticon),
.page-header :deep(.ant-btn .anticon) {
  color: currentColor;
}

:deep(.step-progress .ant-steps-item-icon) {
  border-width: 1px;
  border-style: solid;
  border-color: #cbd5e1;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

:deep(.step-progress .ant-steps-item-icon > .ant-steps-icon) {
  color: #64748b;
  font-weight: 700;
}

:deep(.step-progress .ant-steps-item-process .ant-steps-item-icon) {
  border-color: #60a5fa;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.26);
}

:deep(.step-progress .ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon) {
  color: #eff6ff;
}

:deep(.step-progress .ant-steps-item-finish .ant-steps-item-icon) {
  border-color: #4ade80;
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 12px 24px rgba(22, 163, 74, 0.24);
}

:deep(.step-progress .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon) {
  color: #f0fdf4;
}

:deep(.step-progress .ant-steps-item-error .ant-steps-item-icon) {
  border-color: #fb7185;
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 12px 24px rgba(220, 38, 38, 0.2);
}

:deep(.step-progress .ant-steps-item-error .ant-steps-item-icon > .ant-steps-icon) {
  color: #fff1f2;
}

:deep(.step-progress .ant-steps-item-wait .ant-steps-item-icon) {
  border-color: #fbbf24;
  background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
  box-shadow: none;
}

:deep(.step-progress .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon) {
  color: #b45309;
}

.nested-card {
  border-radius: 16px;
}

.detail-collapse :deep(.ant-collapse-item) {
  border-radius: 16px !important;
  background: var(--color-bg-card);
  border: 1px solid var(--color-panel-border);
  overflow: hidden;
}

.detail-collapse :deep(.ant-collapse-header) {
  font-weight: 700;
}

.detail-collapse :deep(.ant-collapse-content-box) {
  padding-top: 8px;
}

.log-panel {
  margin: 0;
  min-height: 260px;
  max-height: 480px;
  overflow: auto;
  padding: 14px;
  border-radius: 10px;
  background: #141414;
  color: #f5f5f5;
  font-size: 12px;
  line-height: 1.6;
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.stage-log-panel {
  min-height: 220px;
}

@media (max-width: 768px) {
  .release-hero,
  .detail-dashboard {
    grid-template-columns: 1fr;
  }

  .release-spotlight {
    grid-template-columns: 1fr;
    padding: 20px 18px;
  }

  .release-spotlight-icon-wrap {
    justify-content: flex-start;
  }

  .release-spotlight-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .release-hero-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .release-hero-order {
    font-size: 20px;
  }

  .context-item {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>
