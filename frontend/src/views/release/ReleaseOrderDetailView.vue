<script setup lang="ts">
import { ArrowLeftOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  cancelReleaseOrder,
  getReleaseOrderByID,
  listReleaseOrderParams,
  listReleaseOrderSteps,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { ReleaseOrder, ReleaseOrderStatus, ReleaseOrderParam, ReleaseOrderStep } from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const cancelling = ref(false)

const order = ref<ReleaseOrder | null>(null)
const params = ref<ReleaseOrderParam[]>([])
const steps = ref<ReleaseOrderStep[]>([])

const orderID = computed(() => String(route.params.id || '').trim())
const canCancel = computed(() => {
  return order.value?.status === 'pending' || order.value?.status === 'running'
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

async function loadDetail() {
  if (!orderID.value) {
    message.error('缺少发布单 ID')
    void router.push('/releases')
    return
  }

  loading.value = true
  try {
    const [orderResp, paramsResp, stepsResp] = await Promise.all([
      getReleaseOrderByID(orderID.value),
      listReleaseOrderParams(orderID.value),
      listReleaseOrderSteps(orderID.value),
    ])
    order.value = orderResp.data
    params.value = paramsResp.data
    steps.value = stepsResp.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布单详情加载失败'))
    void router.push('/releases')
  } finally {
    loading.value = false
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
    await loadDetail()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布单取消失败'))
  } finally {
    cancelling.value = false
  }
}

function goBack() {
  void router.push('/releases')
}

onMounted(() => {
  void loadDetail()
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
        <a-tag v-if="order" :color="statusColor(order.status)">
          {{ statusText(order.status) }}
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
            <a-tag :color="statusColor(record.status)">{{ statusText(record.status) }}</a-tag>
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
