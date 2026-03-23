<script setup lang="ts">
import {
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleOutlined,
  CloseCircleFilled,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listApplications } from '../../api/application'
import { listPipelineBindings } from '../../api/pipeline'
import {
  cancelReleaseOrder,
  executeReleaseOrder,
  getReleaseOrderByID,
  listReleaseOrderParams,
  listReleaseOrders,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import { useAuthStore } from '../../stores/auth'
import type { PipelineBinding } from '../../types/pipeline'
import type { ReleaseOrder, ReleaseOrderParam, ReleaseOrderStatus, ReleaseTriggerType } from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface SelectOption {
  label: string
  value: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const AUTO_REFRESH_INTERVAL_MS = 5000

const statusOptions: Array<{ label: string; value: ReleaseOrderStatus | '' }> = [
  { label: '全部状态', value: '' },
  { label: '待执行', value: 'pending' },
  { label: '执行中', value: 'running' },
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
  { label: '已取消', value: 'cancelled' },
]

const triggerTypeOptions: Array<{ label: string; value: ReleaseTriggerType | '' }> = [
  { label: '全部方式', value: '' },
  { label: '手动', value: 'manual' },
  { label: 'Webhook', value: 'webhook' },
  { label: '定时', value: 'schedule' },
]

const loading = ref(false)
const querying = ref(false)
const cancellingID = ref('')
const executingID = ref('')
const dataSource = ref<ReleaseOrder[]>([])
const total = ref(0)
const autoRefreshTimer = ref<number | null>(null)
const lastLoadedAt = ref('')

const applicationsLoading = ref(false)
const bindingOptionsLoading = ref(false)
const applicationOptions = ref<SelectOption[]>([])
const bindingOptions = ref<SelectOption[]>([])

const executePreviewVisible = ref(false)
const executePreviewLoading = ref(false)
const executeSubmitting = ref(false)
const executePreviewOrder = ref<ReleaseOrder | null>(null)
const executePreviewParams = ref<ReleaseOrderParam[]>([])
const advancedSearchExpanded = ref(false)

const filters = reactive({
  application_id: '',
  binding_id: '',
  env_code: '',
  status: '' as ReleaseOrderStatus | '',
  trigger_type: '' as ReleaseTriggerType | '',
  page: 1,
  pageSize: 20,
})

const activeQuery = reactive({
  application_id: '',
  binding_id: '',
  env_code: '',
  status: '' as ReleaseOrderStatus | '',
  trigger_type: '' as ReleaseTriggerType | '',
})

const initialColumns: TableColumnsType<ReleaseOrder> = [
  { title: '发布单号', dataIndex: 'order_no', key: 'order_no', width: 220 },
  { title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 190 },
  { title: '上次发布单号', dataIndex: 'previous_order_no', key: 'previous_order_no', width: 220 },
  { title: '应用名称', dataIndex: 'application_name', key: 'application_name', width: 180 },
  { title: '环境', dataIndex: 'env_code', key: 'env_code', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '触发方式', dataIndex: 'trigger_type', key: 'trigger_type', width: 130 },
  { title: '创建者', dataIndex: 'triggered_by', key: 'triggered_by', width: 140 },
  { title: '开始时间', dataIndex: 'started_at', key: 'started_at', width: 190 },
  { title: '结束时间', dataIndex: 'finished_at', key: 'finished_at', width: 190 },
  { title: '操作', key: 'actions', width: 280, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 560, hitArea: 10 })

const hasFilter = computed(() => {
  return Boolean(
    activeQuery.application_id ||
      activeQuery.binding_id ||
      activeQuery.env_code ||
      activeQuery.status ||
      activeQuery.trigger_type,
  )
})

const canCreateRelease = computed(() => authStore.hasPermission('release.create'))
const canExecuteRelease = computed(() => authStore.hasPermission('release.execute'))
const canCancelRelease = computed(() => authStore.hasPermission('release.cancel'))
const canLoadApplications = computed(
  () => authStore.hasPermission('application.view') || authStore.hasPermission('application.manage'),
)

const currentPageStatusStats = computed(() => {
  const stats: Record<ReleaseOrderStatus, number> = {
    pending: 0,
    running: 0,
    success: 0,
    failed: 0,
    cancelled: 0,
  }
  dataSource.value.forEach((item) => {
    stats[item.status] += 1
  })
  return stats
})

const overviewMetrics = computed(() => [
  { key: 'total', label: '筛选结果', value: total.value, tone: 'neutral' },
  { key: 'page', label: '当前页', value: dataSource.value.length, tone: 'neutral' },
  { key: 'running', label: '执行中', value: currentPageStatusStats.value.running, tone: 'processing' },
  { key: 'failed', label: '失败', value: currentPageStatusStats.value.failed, tone: 'danger' },
  { key: 'success', label: '成功', value: currentPageStatusStats.value.success, tone: 'success' },
])

const refreshText = computed(() => {
  if (!lastLoadedAt.value) {
    return '尚未加载'
  }
  return `${lastLoadedAt.value} · 自动轮询 ${AUTO_REFRESH_INTERVAL_MS / 1000}s`
})

const spotlightText = computed(() => {
  if (activeQuery.status) {
    return `当前聚焦“${statusText(activeQuery.status)}”状态发布单。`
  }
  if (currentPageStatusStats.value.running > 0) {
    return `当前页有 ${currentPageStatusStats.value.running} 条发布单正在执行。`
  }
  if (currentPageStatusStats.value.failed > 0) {
    return `当前页有 ${currentPageStatusStats.value.failed} 条失败记录，建议优先排障。`
  }
  return '默认按创建时间倒序展示，可通过状态、应用和环境快速缩小范围。'
})

const spotlightStateKey = computed<'running' | 'failed' | 'success' | 'pending'>(() => {
  if (activeQuery.status) {
    switch (activeQuery.status) {
      case 'running':
        return 'running'
      case 'failed':
        return 'failed'
      case 'success':
        return 'success'
      default:
        return 'pending'
    }
  }
  if (currentPageStatusStats.value.running > 0) {
    return 'running'
  }
  if (currentPageStatusStats.value.failed > 0) {
    return 'failed'
  }
  if (currentPageStatusStats.value.success > 0) {
    return 'success'
  }
  return 'pending'
})

const activeFilterTags = computed(() => {
  const tags: Array<{ key: string; label: string; value: string }> = []
  if (activeQuery.application_id) {
    tags.push({
      key: 'application_id',
      label: '应用',
      value: optionLabel(applicationOptions.value, activeQuery.application_id),
    })
  }
  if (activeQuery.binding_id) {
    tags.push({
      key: 'binding_id',
      label: '绑定',
      value: optionLabel(bindingOptions.value, activeQuery.binding_id),
    })
  }
  if (activeQuery.env_code) {
    tags.push({ key: 'env_code', label: '环境', value: activeQuery.env_code })
  }
  if (activeQuery.status) {
    tags.push({ key: 'status', label: '状态', value: statusText(activeQuery.status) })
  }
  if (activeQuery.trigger_type) {
    tags.push({ key: 'trigger_type', label: '触发方式', value: triggerTypeText(activeQuery.trigger_type) })
  }
  return tags
})

const hasAdvancedFilter = computed(() => Boolean(filters.application_id || filters.binding_id || filters.env_code || filters.trigger_type))
const showAdvancedSearch = computed(
  () =>
    advancedSearchExpanded.value ||
    Boolean(activeQuery.application_id || activeQuery.binding_id || activeQuery.env_code || activeQuery.trigger_type) ||
    hasAdvancedFilter.value,
)

function optionLabel(options: SelectOption[], value: string) {
  return options.find((item) => item.value === value)?.label || value
}

function applyActiveQueryFromFilters() {
  activeQuery.application_id = filters.application_id
  activeQuery.binding_id = filters.binding_id
  activeQuery.env_code = filters.env_code.trim()
  activeQuery.status = filters.status
  activeQuery.trigger_type = filters.trigger_type
}

function formatTime(value: string | null) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function statusColor(status: ReleaseOrderStatus) {
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

function statusText(status: ReleaseOrderStatus) {
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

function isRunningStatus(status: ReleaseOrderStatus) {
  return status === 'running'
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

function canCancel(record: ReleaseOrder) {
  return canCancelRelease.value && (record.status === 'pending' || record.status === 'running')
}

function canExecute(record: ReleaseOrder) {
  return canExecuteRelease.value && record.status === 'pending'
}

async function loadApplicationOptions() {
  if (!canLoadApplications.value) {
    applicationOptions.value = []
    return
  }
  applicationsLoading.value = true
  try {
    const response = await listApplications({ page: 1, page_size: 100 })
    applicationOptions.value = response.data
      .map((item) => ({
        label: `${item.name} (${item.key})`,
        value: item.id,
      }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布应用下拉加载失败'))
  } finally {
    applicationsLoading.value = false
  }
}

async function loadBindingOptions() {
  if (!filters.application_id) {
    bindingOptions.value = []
    return
  }
  bindingOptionsLoading.value = true
  try {
    const response = await listPipelineBindings(filters.application_id, {
      page: 1,
      page_size: 100,
    })
    bindingOptions.value = response.data.map((item: PipelineBinding) => ({
      label: `${item.name || item.id} [${item.binding_type}/${item.provider}]`,
      value: item.id,
    }))
  } catch (error) {
    bindingOptions.value = []
    message.error(extractHTTPErrorMessage(error, '管线绑定下拉加载失败'))
  } finally {
    bindingOptionsLoading.value = false
  }
}

async function loadReleaseOrders(options?: { silent?: boolean }) {
  if (querying.value) {
    return
  }
  const silent = Boolean(options?.silent)
  querying.value = true
  if (!silent) {
    loading.value = true
  }
  try {
    const response = await listReleaseOrders({
      application_id: activeQuery.application_id || undefined,
      binding_id: activeQuery.binding_id || undefined,
      env_code: activeQuery.env_code || undefined,
      status: activeQuery.status || undefined,
      trigger_type: activeQuery.trigger_type || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
    lastLoadedAt.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  } catch (error) {
    if (!silent) {
      message.error(extractHTTPErrorMessage(error, '发布单列表加载失败'))
    }
  } finally {
    querying.value = false
    if (!silent) {
      loading.value = false
    }
  }
}

function handleQuickStatusChange(status: ReleaseOrderStatus | '') {
  filters.status = status
  handleSearch()
}

function clearFilterTag(key: string) {
  if (key === 'application_id') {
    filters.application_id = ''
    filters.binding_id = ''
    bindingOptions.value = []
  } else if (key === 'binding_id') {
    filters.binding_id = ''
  } else if (key === 'env_code') {
    filters.env_code = ''
  } else if (key === 'status') {
    filters.status = ''
  } else if (key === 'trigger_type') {
    filters.trigger_type = ''
  }
  handleSearch()
}

function applyRouteQuery() {
  const applicationID = String(route.query.application_id || '').trim()
  if (applicationID) {
    filters.application_id = applicationID
  }
}

function toCreate() {
  const query: Record<string, string> = {}
  if (filters.application_id) {
    query.application_id = filters.application_id
  }
  if (filters.binding_id) {
    query.binding_id = filters.binding_id
  }
  void router.push({ path: '/releases/new', query })
}

function toDetail(id: string) {
  void router.push(`/releases/${id}`)
}

function handleSearch() {
  filters.page = 1
  applyActiveQueryFromFilters()
  void loadReleaseOrders()
}

function handleReset() {
  filters.application_id = ''
  filters.binding_id = ''
  filters.env_code = ''
  filters.status = ''
  filters.trigger_type = ''
  filters.page = 1
  filters.pageSize = 20
  bindingOptions.value = []
  advancedSearchExpanded.value = false
  applyActiveQueryFromFilters()
  void loadReleaseOrders()
}

function toggleAdvancedSearch() {
  advancedSearchExpanded.value = !advancedSearchExpanded.value
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadReleaseOrders()
}

async function handleApplicationChange(value: string | undefined) {
  filters.application_id = String(value || '')
  filters.binding_id = ''
  await loadBindingOptions()
}


async function handleCancel(record: ReleaseOrder) {
  cancellingID.value = record.id
  try {
    await cancelReleaseOrder(record.id)
    message.success('发布单取消成功')
    await loadReleaseOrders()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布单取消失败'))
  } finally {
    cancellingID.value = ''
  }
}

function closeExecutePreviewModal() {
  executePreviewVisible.value = false
  executePreviewOrder.value = null
  executePreviewParams.value = []
}

async function openExecutePreviewModal(record: ReleaseOrder) {
  if (!canExecute(record)) {
    message.warning('当前发布单已执行完成、已取消或不处于待执行状态，无法再次触发发布')
    return
  }
  executePreviewVisible.value = true
  executePreviewLoading.value = true
  executePreviewOrder.value = null
  executePreviewParams.value = []
  executingID.value = record.id
  try {
    const [orderResp, paramsResp] = await Promise.all([
      getReleaseOrderByID(record.id),
      listReleaseOrderParams(record.id),
    ])
    if (!canExecute(orderResp.data)) {
      message.warning('当前发布单已执行完成、已取消或状态已变化，无法再次触发发布')
      closeExecutePreviewModal()
      return
    }
    executePreviewOrder.value = orderResp.data
    executePreviewParams.value = paramsResp.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布预审信息加载失败'))
    closeExecutePreviewModal()
  } finally {
    executePreviewLoading.value = false
    executingID.value = ''
  }
}

async function confirmExecuteRelease() {
  if (!executePreviewOrder.value) {
    return
  }
  if (!canExecute(executePreviewOrder.value)) {
    message.warning('当前发布单已执行完成、已取消或状态已变化，无法再次触发发布')
    closeExecutePreviewModal()
    return
  }
  executeSubmitting.value = true
  try {
    await executeReleaseOrder(executePreviewOrder.value.id)
    message.success('发布已触发，后端开始执行')
    closeExecutePreviewModal()
    await loadReleaseOrders()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布执行失败'))
  } finally {
    executeSubmitting.value = false
  }
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
    if (document.hidden || executePreviewVisible.value || executePreviewLoading.value || executeSubmitting.value) {
      return
    }
    void loadReleaseOrders({ silent: true })
  }, AUTO_REFRESH_INTERVAL_MS)
}

onMounted(async () => {
  applyRouteQuery()
  advancedSearchExpanded.value = hasAdvancedFilter.value
  await loadApplicationOptions()
  await loadBindingOptions()
  applyActiveQueryFromFilters()
  await loadReleaseOrders()
  startAutoRefresh()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-copy">
        <h2 class="page-title">发布单</h2>
        <p class="page-subtitle">管理发布任务，追踪执行状态与结果。</p>
      </div>
      <a-space>
        <a-button @click="loadReleaseOrders">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新
        </a-button>
        <a-button v-if="canCreateRelease" type="primary" @click="toCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          新建发布单
        </a-button>
      </a-space>
    </div>

    <a-card class="release-overview-card" :bordered="true">
      <div class="overview-bar">
        <div class="overview-metrics">
          <div
            v-for="item in overviewMetrics"
            :key="item.key"
            class="overview-metric"
            :class="`overview-metric-${item.tone}`"
          >
            <div class="overview-metric-label">{{ item.label }}</div>
            <div class="overview-metric-value">{{ item.value }}</div>
          </div>
        </div>
        <div class="overview-spotlight">
          <div class="overview-spotlight-icon-wrap">
            <div class="overview-spotlight-icon-orb" :class="`overview-spotlight-icon-orb-${spotlightStateKey}`">
              <SyncOutlined v-if="spotlightStateKey === 'running'" spin class="overview-spotlight-icon" />
              <CloseCircleFilled v-else-if="spotlightStateKey === 'failed'" class="overview-spotlight-icon" />
              <CheckCircleFilled v-else-if="spotlightStateKey === 'success'" class="overview-spotlight-icon" />
              <ClockCircleFilled v-else class="overview-spotlight-icon" />
            </div>
          </div>
          <div class="overview-spotlight-label">当前关注</div>
          <div class="overview-spotlight-text">{{ spotlightText }}</div>
          <div class="overview-spotlight-meta">最近刷新：{{ refreshText }}</div>
        </div>
      </div>
    </a-card>

    <a-card class="filter-card" :bordered="true">
      <div class="filter-entry-row">
        <div class="quick-status-row">
          <a-button
            v-for="item in statusOptions"
            :key="String(item.value)"
            class="quick-status-button"
            :type="filters.status === item.value ? 'primary' : 'default'"
            @click="handleQuickStatusChange(item.value)"
          >
            {{ item.label }}
          </a-button>
        </div>
        <a-button class="advanced-toggle-button" @click="toggleAdvancedSearch">
          {{ showAdvancedSearch ? '收起检索' : '高级检索' }}
        </a-button>
      </div>

      <div v-if="showAdvancedSearch" class="filter-advanced-panel">
        <a-form layout="vertical" class="filter-grid">
          <a-form-item label="应用" class="filter-grid-item filter-grid-item-wide">
            <a-select
              v-model:value="filters.application_id"
              class="application-select"
              show-search
              allow-clear
              option-filter-prop="label"
              placeholder="全部"
              :loading="applicationsLoading"
              :options="applicationOptions"
              @change="handleApplicationChange"
            />
          </a-form-item>
          <a-form-item label="绑定" class="filter-grid-item filter-grid-item-wide">
            <a-select
              v-model:value="filters.binding_id"
              class="filter-select"
              allow-clear
              show-search
              option-filter-prop="label"
              placeholder="全部"
              :loading="bindingOptionsLoading"
              :options="bindingOptions"
            />
          </a-form-item>
          <a-form-item label="环境" class="filter-grid-item">
            <a-input v-model:value="filters.env_code" allow-clear placeholder="如 dev / test / prod" />
          </a-form-item>
          <a-form-item label="触发方式" class="filter-grid-item">
            <a-select
              v-model:value="filters.trigger_type"
              class="filter-select"
              allow-clear
              placeholder="全部"
              :options="triggerTypeOptions"
            />
          </a-form-item>
          <a-form-item class="filter-grid-item filter-grid-actions">
            <div class="filter-actions-panel">
              <div class="filter-actions-meta">高级条件会在点击“查询”后统一生效，状态快捷筛选会立即应用。</div>
              <a-space>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-space>
            </div>
          </a-form-item>
        </a-form>
      </div>

      <div v-if="hasFilter || hasAdvancedFilter" class="active-filter-bar">
        <span class="active-filter-label">当前筛选</span>
        <a-space wrap :size="[8, 8]">
          <a-tag
            v-for="item in activeFilterTags"
            :key="item.key"
            closable
            class="active-filter-tag"
            @close.prevent="clearFilterTag(item.key)"
          >
            {{ item.label }}：{{ item.value }}
          </a-tag>
        </a-space>
      </div>
    </a-card>

    <a-card class="table-card" :bordered="true">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1650 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)" class="status-tag">
              <LoadingOutlined v-if="isRunningStatus(record.status)" spin />
              <span>{{ statusText(record.status) }}</span>
            </a-tag>
          </template>
          <template v-else-if="column.key === 'started_at'">
            {{ formatTime(record.started_at) }}
          </template>
          <template v-else-if="column.key === 'order_no'">
            <a-space :size="6">
              <span>{{ record.order_no }}</span>
              <a-tag v-if="record.previous_order_no" class="dashboard-chip dashboard-chip-danger">回滚</a-tag>
            </a-space>
          </template>
          <template v-else-if="column.key === 'previous_order_no'">
            {{ record.previous_order_no || '-' }}
          </template>
          <template v-else-if="column.key === 'finished_at'">
            {{ formatTime(record.finished_at) }}
          </template>
          <template v-else-if="column.key === 'created_at'">
            {{ formatTime(record.created_at) }}
          </template>
          <template v-else-if="column.key === 'trigger_type'">
            {{ triggerTypeText(record.trigger_type) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="toDetail(record.id)">详情</a-button>
              <a-button
                type="link"
                size="small"
                :disabled="!canExecute(record)"
                :loading="executingID === record.id"
                @click="openExecutePreviewModal(record)"
              >
                发布
              </a-button>
              <a-popconfirm
                v-if="canCancel(record)"
                title="确认取消当前发布单吗？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleCancel(record)"
              >
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button type="link" size="small" danger :loading="cancellingID === record.id">取消</a-button>
              </a-popconfirm>
              <a-button v-else type="link" size="small" disabled>取消</a-button>
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
      :open="executePreviewVisible"
      title="发布预审"
      :width="620"
      ok-text="确认发布"
      cancel-text="取消"
      :ok-button-props="{ disabled: !executePreviewOrder || !canExecute(executePreviewOrder) }"
      :confirm-loading="executeSubmitting"
      @ok="confirmExecuteRelease"
      @cancel="closeExecutePreviewModal"
    >
      <a-skeleton v-if="executePreviewLoading" active :paragraph="{ rows: 6 }" />
      <template v-else-if="executePreviewOrder">
        <a-descriptions :column="1" layout="vertical" bordered size="small">
          <a-descriptions-item label="发布单号">{{ executePreviewOrder.order_no }}</a-descriptions-item>
          <a-descriptions-item label="应用名称">{{ executePreviewOrder.application_name || '-' }}</a-descriptions-item>
          <a-descriptions-item label="环境">{{ executePreviewOrder.env_code || '-' }}</a-descriptions-item>
          <a-descriptions-item label="触发方式">{{ triggerTypeText(executePreviewOrder.trigger_type) }}</a-descriptions-item>
          <a-descriptions-item label="Git 版本">{{ executePreviewOrder.git_ref || '-' }}</a-descriptions-item>
          <a-descriptions-item label="镜像版本">{{ executePreviewOrder.image_tag || '-' }}</a-descriptions-item>
          <a-descriptions-item label="创建者">{{ executePreviewOrder.triggered_by || '-' }}</a-descriptions-item>
          <a-descriptions-item label="备注">{{ executePreviewOrder.remark || '-' }}</a-descriptions-item>
        </a-descriptions>

        <div class="preview-param-header">发布参数</div>
        <a-empty v-if="executePreviewParams.length === 0" description="本次发布无参数快照" />
        <a-table
          v-else
          row-key="id"
          size="small"
          :pagination="false"
          :data-source="executePreviewParams"
          :columns="[
            { title: '平台 Key', dataIndex: 'param_key', key: 'param_key', width: 130 },
            { title: '执行器参数', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 150 },
            { title: '参数值', dataIndex: 'param_value', key: 'param_value', ellipsis: true },
            { title: '来源', dataIndex: 'value_source', key: 'value_source', width: 100 },
          ]"
          :scroll="{ x: 560 }"
        />
      </template>
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

.release-overview-card,
.filter-card,
.table-card {
  border-radius: var(--radius-xl);
}

.filter-card {
  background: transparent;
  border: none;
  box-shadow: none;
}

.filter-card :deep(.ant-card-body) {
  padding: 0;
  background: transparent;
}

.overview-bar {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(280px, 0.9fr);
  gap: 16px;
}

.overview-metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.overview-metric {
  padding: 16px 18px;
  border-radius: 16px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-muted);
}

.overview-metric-label {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.overview-metric-value {
  margin-top: 8px;
  color: var(--color-text-main);
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.overview-metric-processing {
  background: var(--color-primary-50);
}

.overview-metric-danger {
  background: var(--color-danger-bg);
}

.overview-metric-success {
  background: var(--color-success-bg);
}

.overview-spotlight {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18px 20px;
  border-radius: 22px;
  border: 1px solid var(--color-dashboard-border);
  background:
    radial-gradient(circle at top right, var(--color-primary-glow-strong), transparent 38%),
    linear-gradient(145deg, var(--color-dashboard-900) 0%, var(--color-primary-600) 100%);
  color: var(--color-dashboard-text);
  position: relative;
  overflow: hidden;
}

.overview-spotlight-icon-wrap {
  position: absolute;
  top: 18px;
  right: 18px;
}

.overview-spotlight-icon-orb {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 10px 24px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(8px);
}

.overview-spotlight-icon {
  font-size: 20px;
  color: #eff6ff;
}

.overview-spotlight-icon-orb-running {
  color: #bfdbfe;
}

.overview-spotlight-icon-orb-failed {
  color: #fecdd3;
}

.overview-spotlight-icon-orb-success {
  color: #bbf7d0;
}

.overview-spotlight-icon-orb-pending {
  color: #fde68a;
}

.overview-spotlight-label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-dashboard-label);
}

.overview-spotlight-text {
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.8;
  font-weight: 600;
}

.overview-spotlight-meta {
  margin-top: 16px;
  font-size: 12px;
  color: var(--color-dashboard-text-soft);
}

.quick-status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.quick-status-button {
  border-radius: 999px;
}

.filter-entry-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.advanced-toggle-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  flex: 0 0 auto;
}

.filter-advanced-panel {
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--color-border-soft);
  background: var(--color-bg-card);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.filter-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1.4fr) minmax(220px, 1.4fr) minmax(150px, 0.9fr) minmax(150px, 0.9fr) minmax(240px, 1.1fr);
  gap: 14px 16px;
}

.filter-grid :deep(.ant-form-item) {
  margin-bottom: 0;
}

.filter-grid-item :deep(.ant-form-item-label) {
  padding-bottom: 6px;
}

.filter-grid-item :deep(.ant-form-item-label > label) {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.filter-grid-item-wide {
  min-width: 0;
}

.application-select,
.filter-select {
  width: 100%;
}

.filter-grid-actions {
  display: flex;
  align-items: flex-end;
}

.filter-actions-panel {
  width: 100%;
  min-height: 76px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: linear-gradient(180deg, var(--color-bg-subtle) 0%, var(--color-bg-card) 100%);
  border: 1px solid var(--color-border-muted);
}

.filter-actions-meta {
  color: var(--color-text-muted);
  font-size: 12px;
  text-align: right;
  line-height: 1.6;
}

.active-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed var(--color-border);
}

.active-filter-label {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.active-filter-tag {
  border-radius: 999px;
  padding-inline: 10px;
}

.danger-icon {
  color: var(--color-danger);
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.preview-param-header {
  margin: 16px 0 8px;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .page-header {
    flex-wrap: wrap;
  }

  .overview-bar {
    grid-template-columns: 1fr;
  }

  .overview-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-grid-actions {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-entry-row {
    flex-direction: column;
    align-items: stretch;
  }

  .advanced-toggle-button {
    align-self: flex-start;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions-panel {
    align-items: flex-start;
  }

  .filter-actions-meta {
    text-align: left;
  }
}
</style>
