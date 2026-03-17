<script setup lang="ts">
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  ReloadOutlined,
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
  listReleaseOrderPipelineStages,
  listReleaseOrderSteps,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import { useAuthStore } from '../../stores/auth'
import type {
  ReleaseOrder,
  ReleaseOrderExecution,
  ReleaseOrderLogStreamEvent,
  ReleaseOrderParam,
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
const autoRefreshTimer = ref<number | null>(null)
const executeLocked = ref(false)

const order = ref<ReleaseOrder | null>(null)
const params = ref<ReleaseOrderParam[]>([])
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
  return [
    { label: '发布单号', value: order.value.order_no },
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
    { label: '创建时间', value: formatTime(order.value.created_at) },
    { label: '更新时间', value: formatTime(order.value.updated_at) },
  ]
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

function statusColor(status: ReleaseOrderStatus | ReleaseOrderStep['status'] | ReleasePipelineStageStatus | ReleaseOrderExecution['status']) {
  switch (status) {
    case 'success':
      return 'green'
    case 'failed':
      return 'red'
    case 'running':
      return 'blue'
    case 'cancelled':
      return 'default'
    case 'skipped':
      return 'default'
    default:
      return 'gold'
  }
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
  if (state.ended) {
    return '已结束'
  }
  return ''
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
    const [orderResp, executionsResp, paramsResp, stepsResp] = await Promise.all([
      getReleaseOrderByID(orderID.value),
      listReleaseOrderExecutions(orderID.value),
      canViewParamSnapshot.value ? listReleaseOrderParams(orderID.value) : Promise.resolve({ data: [] }),
      listReleaseOrderSteps(orderID.value),
    ])
    order.value = orderResp.data
    executions.value = [...executionsResp.data].sort((a, b) => scopeSort(a.pipeline_scope) - scopeSort(b.pipeline_scope))
    params.value = paramsResp.data
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
  executeLocked.value = true
  executing.value = true
  try {
    const response = await executeReleaseOrder(order.value.id)
    order.value = response.data
    message.success('发布已触发，后端开始执行')
    await loadDetail({ silent: true })
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布执行失败'))
  } finally {
    executing.value = false
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
        <div>
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

    <a-card class="detail-card" title="基础信息" :loading="loading" :bordered="true">
      <template #extra>
        <a-tag v-if="order" :color="statusColor(order.status)" class="status-tag">
          <LoadingOutlined v-if="isRunningStatus(order.status)" spin />
          <span>{{ statusText(order.status) }}</span>
        </a-tag>
      </template>
      <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
        <a-descriptions-item v-for="item in detailItems" :key="item.label" :label="item.label">
          {{ item.value }}
        </a-descriptions-item>
      </a-descriptions>

      <a-divider class="execution-divider">执行单元</a-divider>
      <a-row :gutter="16">
        <a-col v-for="item in executionSections" :key="item.scope" :xs="24" :md="12">
          <div class="execution-summary-card">
            <div class="execution-summary-head">
              <div>
                <div class="execution-summary-title">{{ item.title }}</div>
                <div class="execution-summary-subtitle">{{ item.execution.binding_name || '-' }}</div>
              </div>
              <a-tag :color="statusColor(item.execution.status)" class="status-tag">
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
        </a-col>
      </a-row>
    </a-card>

    <template v-if="canViewParamSnapshot">
      <a-card v-for="group in paramGroups" :key="group.scope" class="detail-card" :title="group.title" :loading="loading" :bordered="true">
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

    <a-card class="detail-card" title="执行步骤" :loading="loading" :bordered="true">
      <a-empty v-if="stepGroups.length === 0" description="暂无步骤数据" />
      <div v-else class="step-groups">
        <div v-for="group in stepGroups" :key="group.key" class="scope-section">
          <div class="scope-section-header">
            <a-tag>{{ group.title }}</a-tag>
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

    <a-card class="detail-card" title="管线进度" :loading="pipelineStageLoading" :bordered="true">
      <template #extra>
        <a-space>
          <a-tag v-if="pipelineStageExecutorType" color="processing">{{ pipelineStageExecutorType }}</a-tag>
          <a-button size="small" @click="loadPipelineStageView">刷新阶段</a-button>
        </a-space>
      </template>

      <a-alert v-if="pipelineStageMessage" class="pipeline-stage-alert" type="info" show-icon :message="pipelineStageMessage" />

      <div v-if="stageSections.length > 0" class="stage-sections">
        <div v-for="section in stageSections" :key="section.scope" class="scope-section">
          <div class="scope-section-header">
            <a-tag>{{ section.title }}</a-tag>
          </div>

          <a-alert
            v-if="section.isArgoCD"
            class="pipeline-stage-alert"
            type="info"
            show-icon
            message="当前阶段来自 ArgoCD 执行链路，展示的是 GitOps 写回 / Sync / 健康检查的聚合进度。"
          />
          <a-alert
            v-else-if="!section.isJenkins"
            class="pipeline-stage-alert"
            type="info"
            show-icon
            :message="`${scopeLabel(section.scope)} 当前使用 ${section.execution?.provider || '未知执行器'}，部署进度视图待接入。`"
          />
          <a-empty v-if="section.stages.length === 0" description="暂无阶段数据" />
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
                <a-tag :color="statusColor(record.status)" class="status-tag">
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
    </a-card>

    <a-card v-for="section in logSections" :key="section.scope" class="detail-card" :title="section.title" :bordered="true">
      <template #extra>
        <a-space v-if="section.isJenkins">
          <a-tag v-if="logStreamHintText(section.scope)" :color="logStreamTagColor(section.scope)">{{ logStreamHintText(section.scope) }}</a-tag>
          <a-switch
            size="small"
            :checked="section.state.autoFollow"
            checked-children="跟随日志"
            un-checked-children="暂停跟随"
            @change="handleLogFollowChange(section.scope, $event)"
          />
          <a-button size="small" @click="jumpLogToBottom(section.scope)">回到底部</a-button>
          <a-button size="small" @click="reconnectLogStream(section.scope)" :loading="section.state.connecting">重连日志</a-button>
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
        <a-alert v-if="section.state.error" class="log-alert" type="warning" show-icon :message="section.state.error" />
        <pre :ref="(el) => setLogPanelRef(section.scope, el as Element | null)" class="log-panel" @scroll="syncLogFollowState(section.scope)">{{ section.state.text || '暂无日志输出' }}</pre>
      </template>
    </a-card>

    <a-drawer
      :open="stageLogDrawerVisible"
      :width="760"
      :title="selectedPipelineStage ? `${selectedPipelineStage.pipeline_scope?.toUpperCase() || ''} 阶段日志 · ${selectedPipelineStage.stage_name}` : '阶段日志'"
      @close="closeStageLogDrawer"
    >
      <template #extra>
        <a-space>
          <a-tag v-if="selectedPipelineStage" :color="statusColor(selectedPipelineStage.status)">
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

.execution-divider {
  margin-top: 20px;
}

.execution-summary-card {
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.04) 0%, rgba(248, 250, 252, 1) 100%);
  border: 1px solid rgba(148, 163, 184, 0.16);
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
  color: #111827;
}

.execution-summary-subtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.execution-summary-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 14px;
  color: #475569;
  font-size: 13px;
}

.scope-section + .scope-section {
  margin-top: 20px;
}

.scope-section-header {
  margin-bottom: 12px;
}

.step-description {
  color: #475569;
  line-height: 1.7;
}

.danger-icon {
  color: #ff4d4f;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.log-alert,
.pipeline-stage-alert {
  margin-bottom: 12px;
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
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
