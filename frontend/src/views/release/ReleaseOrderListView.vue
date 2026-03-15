<script setup lang="ts">
import { ExclamationCircleOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
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

const loading = ref(false)
const querying = ref(false)
const cancellingID = ref('')
const executingID = ref('')
const dataSource = ref<ReleaseOrder[]>([])
const total = ref(0)
const autoRefreshTimer = ref<number | null>(null)

const applicationsLoading = ref(false)
const bindingOptionsLoading = ref(false)
const applicationOptions = ref<SelectOption[]>([])
const bindingOptions = ref<SelectOption[]>([])

const executePreviewVisible = ref(false)
const executePreviewLoading = ref(false)
const executeSubmitting = ref(false)
const executePreviewOrder = ref<ReleaseOrder | null>(null)
const executePreviewParams = ref<ReleaseOrderParam[]>([])

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
  { title: '应用名称', dataIndex: 'application_name', key: 'application_name', width: 180 },
  { title: '环境', dataIndex: 'env_code', key: 'env_code', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '触发方式', dataIndex: 'trigger_type', key: 'trigger_type', width: 130 },
  { title: '创建者', dataIndex: 'triggered_by', key: 'triggered_by', width: 140 },
  { title: '开始时间', dataIndex: 'started_at', key: 'started_at', width: 190 },
  { title: '结束时间', dataIndex: 'finished_at', key: 'finished_at', width: 190 },
  { title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 190 },
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

function canViewReleaseOrderForApplication(applicationID: string) {
  const appID = String(applicationID || '').trim()
  if (!appID) {
    return false
  }
  if (authStore.isAdmin) {
    return true
  }
  return (
    authStore.hasApplicationPermission('release.view', appID) ||
    authStore.hasApplicationPermission('release.create', appID) ||
    authStore.hasApplicationPermission('release.execute', appID) ||
    authStore.hasApplicationPermission('release.cancel', appID)
  )
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
      .filter((item) => canViewReleaseOrderForApplication(item.id))
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
  applyActiveQueryFromFilters()
  void loadReleaseOrders()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadReleaseOrders()
}

async function handleApplicationChange(value: string | undefined) {
  filters.application_id = String(value || '')
  filters.binding_id = ''
  filters.page = 1
  await loadBindingOptions()
  applyActiveQueryFromFilters()
  await loadReleaseOrders()
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
      <div>
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

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="应用">
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
        <a-form-item label="绑定">
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
        <a-form-item label="环境">
          <a-input v-model:value="filters.env_code" allow-clear placeholder="如 dev / test / prod" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="filters.status"
            class="filter-select"
            allow-clear
            placeholder="全部"
            :options="[
              { label: 'pending', value: 'pending' },
              { label: 'running', value: 'running' },
              { label: 'success', value: 'success' },
              { label: 'failed', value: 'failed' },
              { label: 'cancelled', value: 'cancelled' },
            ]"
          />
        </a-form-item>
        <a-form-item label="触发方式">
          <a-select
            v-model:value="filters.trigger_type"
            class="filter-select"
            allow-clear
            placeholder="全部"
            :options="[
              { label: '手动', value: 'manual' },
              { label: 'Webhook', value: 'webhook' },
              { label: '定时', value: 'schedule' },
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <div v-if="hasFilter" class="filter-hint">已启用筛选条件</div>
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

.filter-card,
.table-card {
  border-radius: var(--radius-xl);
}

.filter-form {
  display: flex;
  gap: 8px;
}

.application-select {
  width: 260px;
}

.filter-select {
  width: 160px;
}

.filter-hint {
  margin-top: 12px;
  color: #8c8c8c;
  font-size: 12px;
}

.danger-icon {
  color: #ff4d4f;
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
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .application-select,
  .filter-select {
    width: 100%;
  }
}
</style>
