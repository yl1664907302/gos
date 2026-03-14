<script setup lang="ts">
import { ArrowLeftOutlined, ExclamationCircleOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  buildReleaseOrderLogStreamURL,
  cancelReleaseOrder,
  executeReleaseOrder,
  getReleaseOrderByID,
  listReleaseOrderParams,
  listReleaseOrderSteps,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import { useAuthStore } from '../../stores/auth'
import type {
  ReleaseOrder,
  ReleaseOrderLogStreamEvent,
  ReleaseOrderParam,
  ReleaseOrderStatus,
  ReleaseOrderStep,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const AUTO_REFRESH_INTERVAL_MS = 5000

const loading = ref(false)
const querying = ref(false)
const cancelling = ref(false)
const executing = ref(false)
const autoRefreshTimer = ref<number | null>(null)

const order = ref<ReleaseOrder | null>(null)
const params = ref<ReleaseOrderParam[]>([])
const steps = ref<ReleaseOrderStep[]>([])

const logText = ref('')
const logOffset = ref(0)
const logStreamConnected = ref(false)
const logStreamConnecting = ref(false)
const logStreamEnded = ref(false)
const logStreamError = ref('')
const logStreamStatusText = ref('未连接')
const logPanelRef = ref<HTMLElement | null>(null)
const logStreamRef = ref<EventSource | null>(null)
const reconnectTimer = ref<number | null>(null)
const closeLogStreamIntentional = ref(false)

const orderID = computed(() => String(route.params.id || '').trim())
const executeLocked = ref(false)
const canCancel = computed(() => {
  return order.value?.status === 'pending' || order.value?.status === 'running'
})
const canExecute = computed(() => {
  return order.value?.status === 'pending' && !executeLocked.value
})
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
const logStreamTagColor = computed(() => {
  if (logStreamConnected.value) {
    return 'processing'
  }
  if (logStreamEnded.value) {
    return 'success'
  }
  if (logStreamError.value) {
    return 'warning'
  }
  return 'default'
})

const detailItems = computed(() => {
  if (!order.value) {
    return []
  }
  return [
    { label: '发布单号', value: order.value.order_no },
    { label: '应用名称', value: order.value.application_name || '-' },
    { label: '应用 ID', value: order.value.application_id || '-' },
    { label: '绑定 ID', value: order.value.binding_id || '-' },
    { label: '管线 ID', value: order.value.pipeline_id || '-' },
    { label: '环境', value: order.value.env_code || '-' },
    { label: '项目名称', value: order.value.project_name || order.value.son_service || '-' },
    { label: '触发方式', value: order.value.trigger_type || '-' },
    { label: '触发人', value: order.value.triggered_by || '-' },
    { label: 'Git 版本', value: order.value.git_ref || '-' },
    { label: '镜像版本', value: order.value.image_tag || '-' },
    { label: '备注', value: order.value.remark || '-' },
    { label: '开始时间', value: formatTime(order.value.started_at) },
    { label: '结束时间', value: formatTime(order.value.finished_at) },
    { label: '创建时间', value: formatTime(order.value.created_at) },
    { label: '更新时间', value: formatTime(order.value.updated_at) },
  ]
})

const sortedSteps = computed(() => {
  return [...steps.value].sort((a, b) => a.sort_no - b.sort_no)
})

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

const stepInitialColumns: TableColumnsType<ReleaseOrderStep> = [
  { title: '顺序', dataIndex: 'sort_no', key: 'sort_no', width: 90 },
  { title: '步骤编码', dataIndex: 'step_code', key: 'step_code', width: 180 },
  { title: '步骤名称', dataIndex: 'step_name', key: 'step_name', width: 220 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '执行信息', dataIndex: 'message', key: 'message', width: 360, ellipsis: true },
  { title: '开始时间', dataIndex: 'started_at', key: 'started_at', width: 190 },
  { title: '结束时间', dataIndex: 'finished_at', key: 'finished_at', width: 190 },
]
const { columns: stepColumns } = useResizableColumns(stepInitialColumns, {
  minWidth: 100,
  maxWidth: 640,
  hitArea: 10,
})

function formatTime(value: string | null) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function statusColor(status: ReleaseOrderStatus | ReleaseOrderStep['status']) {
  switch (status) {
    case 'success':
      return 'green'
    case 'failed':
      return 'red'
    case 'running':
      return 'blue'
    case 'cancelled':
      return 'default'
    default:
      return 'gold'
  }
}

function statusText(status: ReleaseOrderStatus | ReleaseOrderStep['status']) {
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
    default:
      return status
  }
}

function isRunningStatus(status: ReleaseOrderStatus | ReleaseOrderStep['status']) {
  return status === 'running'
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

function appendLogContent(content: string) {
  const chunk = String(content || '')
  if (!chunk) {
    return
  }
  if (!logText.value) {
    logText.value = chunk
  } else {
    logText.value += chunk
  }
  void nextTick(() => {
    if (!logPanelRef.value) {
      return
    }
    logPanelRef.value.scrollTop = logPanelRef.value.scrollHeight
  })
}

function appendStatusLine(messageText: string) {
  const text = String(messageText || '').trim()
  if (!text) {
    return
  }
  const line = `[${dayjs().format('HH:mm:ss')}] ${text}\n`
  appendLogContent(line)
}

function clearReconnectTimer() {
  if (reconnectTimer.value !== null) {
    window.clearTimeout(reconnectTimer.value)
    reconnectTimer.value = null
  }
}

function closeLogStream() {
  clearReconnectTimer()
  if (logStreamRef.value) {
    closeLogStreamIntentional.value = true
    logStreamRef.value.close()
    logStreamRef.value = null
  }
  logStreamConnected.value = false
  logStreamConnecting.value = false
}

function scheduleReconnect() {
  if (closeLogStreamIntentional.value || logStreamEnded.value) {
    return
  }
  if (!shouldKeepLogStreaming.value) {
    return
  }
  clearReconnectTimer()
  reconnectTimer.value = window.setTimeout(() => {
    void startLogStream(false)
  }, 2000)
}

async function startLogStream(reset: boolean) {
  if (!orderID.value) {
    return
  }
  closeLogStream()
  closeLogStreamIntentional.value = false
  if (reset) {
    logText.value = ''
    logOffset.value = 0
    logStreamError.value = ''
    logStreamEnded.value = false
    logStreamStatusText.value = '准备连接'
  }

  const streamURL = buildReleaseOrderLogStreamURL(
    orderID.value,
    logOffset.value,
    authStore.accessToken,
  )
  const source = new EventSource(streamURL)
  logStreamRef.value = source
  logStreamConnecting.value = true
  logStreamStatusText.value = '连接中...'

  source.onopen = () => {
    logStreamConnecting.value = false
    logStreamConnected.value = true
    logStreamError.value = ''
    if (!logStreamEnded.value) {
      logStreamStatusText.value = '流式同步中'
    }
  }

  const handleEventData = (eventType: string, payload: MessageEvent<string>) => {
    const parsed = parseStreamEvent(payload.data)
    if (!parsed) {
      return
    }
    const eventOffset = Number(parsed.offset ?? NaN)
    if (Number.isFinite(eventOffset) && eventOffset >= 0) {
      logOffset.value = Math.max(logOffset.value, Math.floor(eventOffset))
    }

    switch (eventType) {
      case 'log':
        appendLogContent(String(parsed.content || ''))
        if (parsed.message) {
          appendStatusLine(parsed.message)
        }
        return
      case 'done':
        if (parsed.message) {
          appendStatusLine(parsed.message)
        }
        logStreamEnded.value = true
        logStreamStatusText.value = '已结束'
        closeLogStreamIntentional.value = true
        source.close()
        logStreamRef.value = null
        logStreamConnected.value = false
        logStreamConnecting.value = false
        return
      case 'error':
        if (parsed.message) {
          appendStatusLine(parsed.message)
          logStreamError.value = parsed.message
        } else {
          logStreamError.value = '日志流发生异常'
        }
        return
      default:
        if (parsed.message) {
          appendStatusLine(parsed.message)
          logStreamStatusText.value = parsed.message
        }
        return
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
    logStreamConnecting.value = false
    logStreamConnected.value = false
    if (closeLogStreamIntentional.value || logStreamEnded.value) {
      return
    }
    logStreamError.value = '日志连接中断，准备自动重连'
    logStreamStatusText.value = '连接中断'
    source.close()
    logStreamRef.value = null
    scheduleReconnect()
  }
}

function reconnectLogStream() {
  logStreamError.value = ''
  logStreamEnded.value = false
  logStreamStatusText.value = '准备重连'
  void startLogStream(false)
}

function clearLogOutput() {
  logText.value = ''
  logOffset.value = 0
  logStreamError.value = ''
  logStreamEnded.value = false
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
    const [orderResp, paramsResp, stepsResp] = await Promise.all([
      getReleaseOrderByID(orderID.value),
      listReleaseOrderParams(orderID.value),
      listReleaseOrderSteps(orderID.value),
    ])
    order.value = orderResp.data
    params.value = paramsResp.data
    steps.value = stepsResp.data

    if (shouldKeepLogStreaming.value) {
      if (!logStreamRef.value && !logStreamConnecting.value) {
        void startLogStream(false)
      }
    } else {
      if (logStreamRef.value) {
        closeLogStream()
      }
      if (!logStreamEnded.value && logOffset.value > 0) {
        logStreamEnded.value = true
        logStreamStatusText.value = '已结束'
      }
    }
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

onMounted(() => {
  void startLogStream(true)
  void loadDetail()
  startAutoRefresh()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
  closeLogStream()
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
          <p class="page-subtitle">查看发布基础信息、参数快照与步骤执行轨迹。</p>
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
    </a-card>

    <a-card class="detail-card" title="参数快照" :loading="loading" :bordered="true">
      <a-empty v-if="params.length === 0" description="暂无参数快照" />
      <a-table
        v-else
        row-key="id"
        :columns="paramColumns"
        :data-source="params"
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

    <a-card class="detail-card" title="执行步骤" :loading="loading" :bordered="true">
      <a-empty v-if="sortedSteps.length === 0" description="暂无步骤数据" />
      <a-table
        v-else
        row-key="id"
        :columns="stepColumns"
        :data-source="sortedSteps"
        :pagination="false"
        :scroll="{ x: 1500 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)" class="status-tag">
              <LoadingOutlined v-if="isRunningStatus(record.status)" spin />
              <span>{{ statusText(record.status) }}</span>
            </a-tag>
          </template>
          <template v-else-if="column.key === 'message'">
            {{ record.message || '-' }}
          </template>
          <template v-else-if="column.key === 'started_at'">
            {{ formatTime(record.started_at) }}
          </template>
          <template v-else-if="column.key === 'finished_at'">
            {{ formatTime(record.finished_at) }}
          </template>
        </template>
      </a-table>
    </a-card>

    <a-card class="detail-card" title="构建日志" :bordered="true">
      <template #extra>
        <a-space>
          <a-tag :color="logStreamTagColor">{{ logStreamStatusText }}</a-tag>
          <a-button size="small" @click="reconnectLogStream" :loading="logStreamConnecting">重连日志</a-button>
          <a-button size="small" @click="clearLogOutput">清空</a-button>
        </a-space>
      </template>

      <a-alert v-if="logStreamError" class="log-alert" type="warning" show-icon :message="logStreamError" />
      <pre ref="logPanelRef" class="log-panel">{{ logText || '暂无日志输出' }}</pre>
    </a-card>
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

.danger-icon {
  color: #ff4d4f;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.log-alert {
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
