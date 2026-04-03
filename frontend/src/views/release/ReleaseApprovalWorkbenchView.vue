<script setup lang="ts">
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  approveReleaseOrder,
  listReleaseApprovalRecordSummaries,
  listReleaseOrders,
  rejectReleaseOrder,
} from '../../api/release'
import { useAuthStore } from '../../stores/auth'
import type {
  ReleaseOperationType,
  ReleaseOrder,
  ReleaseOrderApprovalRecordSummary,
  ReleaseOrderBusinessStatus,
  ReleaseOrderStatus,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const router = useRouter()
const authStore = useAuthStore()

type TabKey = 'pending' | 'mine' | 'records'

const activeTab = ref<TabKey>('pending')
const currentUserID = computed(() => String(authStore.profile?.id || '').trim())

const pendingLoading = ref(false)
const pendingOrders = ref<ReleaseOrder[]>([])
const pendingTotal = ref(0)
const pendingPagination = reactive({ page: 1, pageSize: 10 })

const mineLoading = ref(false)
const mineRecords = ref<ReleaseOrderApprovalRecordSummary[]>([])
const mineTotal = ref(0)
const minePagination = reactive({ page: 1, pageSize: 10 })

const recordLoading = ref(false)
const recordItems = ref<ReleaseOrderApprovalRecordSummary[]>([])
const recordTotal = ref(0)
const recordPagination = reactive({ page: 1, pageSize: 10 })

const approvalActionModalVisible = ref(false)
const approvalActionMode = ref<'approve' | 'reject'>('approve')
const approvalActionComment = ref('')
const approvalActionRecord = ref<ReleaseOrder | null>(null)
const approvalActing = ref(false)

const summaryCards = computed(() => [
  { key: 'pending', label: '待我审批', value: pendingTotal.value, hint: '当前需要我处理的发布单' },
  { key: 'mine', label: '我已处理', value: mineTotal.value, hint: '我已经提交过审批动作的记录' },
  { key: 'records', label: '全部记录', value: recordTotal.value, hint: '当前可见应用范围内的审批记录' },
])

function fallbackBusinessStatus(status: ReleaseOrderStatus): ReleaseOrderBusinessStatus {
  switch (status) {
    case 'draft':
      return 'draft'
    case 'pending_approval':
      return 'pending_approval'
    case 'approving':
      return 'approving'
    case 'approved':
      return 'approved'
    case 'rejected':
      return 'rejected'
    case 'queued':
      return 'queued'
    case 'deploying':
    case 'running':
      return 'deploying'
    case 'deploy_success':
    case 'success':
      return 'deploy_success'
    case 'deploy_failed':
    case 'failed':
      return 'deploy_failed'
    case 'cancelled':
      return 'cancelled'
    default:
      return 'pending_execution'
  }
}

function orderBusinessStatus(record: Pick<ReleaseOrder, 'business_status' | 'status'>) {
  return record.business_status || fallbackBusinessStatus(record.status)
}

function statusText(status: ReleaseOrderBusinessStatus | ReleaseOrderStatus) {
  switch (status) {
    case 'pending_execution':
    case 'pending':
      return '待执行'
    case 'pending_approval':
      return '待审批'
    case 'approving':
      return '审批中'
    case 'approved':
      return '已批准'
    case 'rejected':
      return '审批拒绝'
    case 'queued':
      return '排队中'
    case 'deploying':
    case 'running':
      return '发布中'
    case 'deploy_success':
    case 'success':
      return '发布成功'
    case 'deploy_failed':
    case 'failed':
      return '发布失败'
    case 'cancelled':
      return '已取消'
    default:
      return status
  }
}

function statusToneClass(status: ReleaseOrderBusinessStatus | ReleaseOrderStatus) {
  switch (status) {
    case 'deploy_success':
    case 'success':
    case 'approved':
      return 'status-pill-success'
    case 'rejected':
    case 'deploy_failed':
    case 'failed':
      return 'status-pill-failed'
    case 'approving':
    case 'deploying':
    case 'running':
      return 'status-pill-running'
    case 'pending_approval':
    case 'queued':
      return 'status-pill-warning'
    case 'cancelled':
      return 'status-pill-neutral'
    default:
      return 'status-pill-pending'
  }
}

function pendingApprovalHint(record: ReleaseOrder) {
  const businessStatus = orderBusinessStatus(record)
  if (businessStatus === 'pending_approval') {
    return '待审批，可直接处理'
  }
  if (businessStatus === 'approving') {
    return '审批进行中，可继续处理'
  }
  return '等待审批动作'
}

function operationTypeText(type: ReleaseOperationType) {
  switch (type) {
    case 'rollback':
      return '标准回滚'
    case 'replay':
      return '重放回滚'
    default:
      return '普通发布'
  }
}

function approvalActionText(action: ReleaseOrderApprovalRecordSummary['action']) {
  switch (action) {
    case 'submit':
      return '提交审批'
    case 'approve':
      return '审批通过'
    case 'reject':
      return '审批拒绝'
    default:
      return action
  }
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return '-'
  }
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

function isApprovalActor(record: ReleaseOrder) {
  if (authStore.isAdmin) {
    return true
  }
  return Boolean(currentUserID.value) && (record.approval_approver_ids || []).includes(currentUserID.value)
}

function canApprove(record: ReleaseOrder) {
  return isApprovalActor(record) && ['pending_approval', 'approving'].includes(orderBusinessStatus(record))
}

function canReject(record: ReleaseOrder) {
  return isApprovalActor(record) && ['pending_approval', 'approving'].includes(orderBusinessStatus(record))
}

async function loadPendingOrders() {
  if (!currentUserID.value) {
    pendingOrders.value = []
    pendingTotal.value = 0
    return
  }
  pendingLoading.value = true
  try {
    const [pendingApprovalResp, approvingResp] = await Promise.all([
      listReleaseOrders({
        status: 'pending_approval',
        approval_approver_user_id: currentUserID.value,
        page: 1,
        page_size: 100,
      }),
      listReleaseOrders({
        status: 'approving',
        approval_approver_user_id: currentUserID.value,
        page: 1,
        page_size: 100,
      }),
    ])
    const merged = [...pendingApprovalResp.data, ...approvingResp.data].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    pendingTotal.value = merged.length
    const start = (pendingPagination.page - 1) * pendingPagination.pageSize
    const end = start + pendingPagination.pageSize
    pendingOrders.value = merged.slice(start, end)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '待我审批加载失败'))
  } finally {
    pendingLoading.value = false
  }
}

async function loadMineRecords() {
  if (!currentUserID.value) {
    mineRecords.value = []
    mineTotal.value = 0
    return
  }
  mineLoading.value = true
  try {
    const response = await listReleaseApprovalRecordSummaries({
      operator_user_id: currentUserID.value,
      page: minePagination.page,
      page_size: minePagination.pageSize,
    })
    mineRecords.value = response.data
    mineTotal.value = response.total
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '我的审批记录加载失败'))
  } finally {
    mineLoading.value = false
  }
}

async function loadAllRecords() {
  recordLoading.value = true
  try {
    const response = await listReleaseApprovalRecordSummaries({
      page: recordPagination.page,
      page_size: recordPagination.pageSize,
    })
    recordItems.value = response.data
    recordTotal.value = response.total
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '审批记录加载失败'))
  } finally {
    recordLoading.value = false
  }
}

async function reloadAll() {
  await Promise.all([loadPendingOrders(), loadMineRecords(), loadAllRecords()])
}

function goToDetail(id: string) {
  void router.push(`/releases/${id}`)
}

function openApprovalAction(mode: 'approve' | 'reject', record: ReleaseOrder) {
  approvalActionMode.value = mode
  approvalActionComment.value = ''
  approvalActionRecord.value = record
  approvalActionModalVisible.value = true
}

function closeApprovalAction() {
  approvalActionModalVisible.value = false
  approvalActionComment.value = ''
  approvalActionRecord.value = null
}

async function handleApprovalAction() {
  if (!approvalActionRecord.value) {
    return
  }
  const comment = approvalActionComment.value.trim()
  if (approvalActionMode.value === 'reject' && !comment) {
    message.warning('请先填写拒绝原因')
    return
  }
  approvalActing.value = true
  try {
    if (approvalActionMode.value === 'approve') {
      await approveReleaseOrder(approvalActionRecord.value.id, { comment })
      message.success('审批已通过')
    } else {
      await rejectReleaseOrder(approvalActionRecord.value.id, { comment })
      message.success('审批已拒绝')
    }
    closeApprovalAction()
    await reloadAll()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '审批操作失败'))
  } finally {
    approvalActing.value = false
  }
}

onMounted(async () => {
  await reloadAll()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">审批工作台</h2>
        <p class="page-subtitle">把待我处理、我已处理和当前可见的审批记录收在一个地方，方便我们快速推进发布审批。</p>
      </div>
      <a-button @click="reloadAll">
        <template #icon><ReloadOutlined /></template>
        刷新
      </a-button>
    </div>

    <div class="summary-grid">
      <a-card v-for="item in summaryCards" :key="item.key" class="summary-card" :bordered="true">
        <div class="summary-label">{{ item.label }}</div>
        <div class="summary-value">{{ item.value }}</div>
        <div class="summary-hint">{{ item.hint }}</div>
      </a-card>
    </div>

    <a-card class="detail-card" :bordered="true">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="pending" tab="待我审批">
          <a-table
            row-key="id"
            :data-source="pendingOrders"
            :loading="pendingLoading"
            :pagination="{
              current: pendingPagination.page,
              pageSize: pendingPagination.pageSize,
              total: pendingTotal,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onChange: (page:number, pageSize:number) => { pendingPagination.page = page; pendingPagination.pageSize = pageSize; void loadPendingOrders() },
            }"
          >
            <a-table-column title="发布单号" data-index="order_no" key="order_no" />
            <a-table-column title="应用" data-index="application_name" key="application_name" />
            <a-table-column title="环境" data-index="env_code" key="env_code" width="100" />
            <a-table-column title="操作类型" key="operation_type" width="120">
              <template #default="{ record }">{{ operationTypeText(record.operation_type) }}</template>
            </a-table-column>
            <a-table-column title="审批方式" key="approval_mode" width="100">
              <template #default="{ record }">{{ record.approval_mode === 'all' ? '会签' : '或签' }}</template>
            </a-table-column>
            <a-table-column title="发起人" data-index="triggered_by" key="triggered_by" width="120" />
            <a-table-column title="状态" key="status" width="120">
              <template #default="{ record }">
                <a-tag :class="['status-tag', statusToneClass(orderBusinessStatus(record))]">{{ statusText(orderBusinessStatus(record)) }}</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="审批进度" key="approval_hint" width="160">
              <template #default="{ record }">{{ pendingApprovalHint(record) }}</template>
            </a-table-column>
            <a-table-column title="创建时间" key="created_at" width="180">
              <template #default="{ record }">{{ formatTime(record.created_at) }}</template>
            </a-table-column>
            <a-table-column title="操作" key="actions" width="220" fixed="right">
              <template #default="{ record }">
                <a-space>
                  <a-button type="link" size="small" @click="goToDetail(record.id)">查看详情</a-button>
                  <a-button v-if="canApprove(record)" type="link" size="small" @click="openApprovalAction('approve', record)">
                    <template #icon><CheckOutlined /></template>
                    通过
                  </a-button>
                  <a-button v-if="canReject(record)" type="link" danger size="small" @click="openApprovalAction('reject', record)">
                    <template #icon><CloseOutlined /></template>
                    拒绝
                  </a-button>
                </a-space>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="mine" tab="我已处理">
          <a-table
            row-key="id"
            :data-source="mineRecords"
            :loading="mineLoading"
            :pagination="{
              current: minePagination.page,
              pageSize: minePagination.pageSize,
              total: mineTotal,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onChange: (page:number, pageSize:number) => { minePagination.page = page; minePagination.pageSize = pageSize; void loadMineRecords() },
            }"
          >
            <a-table-column title="发布单号" data-index="order_no" key="order_no" />
            <a-table-column title="应用" data-index="application_name" key="application_name" />
            <a-table-column title="环境" data-index="env_code" key="env_code" width="100" />
            <a-table-column title="审批动作" key="action" width="120">
              <template #default="{ record }">{{ approvalActionText(record.action) }}</template>
            </a-table-column>
            <a-table-column title="发布状态" key="business_status" width="120">
              <template #default="{ record }">
                <a-tag :class="['status-tag', statusToneClass(record.business_status)]">{{ statusText(record.business_status) }}</a-tag>
              </template>
            </a-table-column>
            <a-table-column title="审批意见" data-index="comment" key="comment" ellipsis />
            <a-table-column title="操作时间" key="created_at" width="180">
              <template #default="{ record }">{{ formatTime(record.created_at) }}</template>
            </a-table-column>
            <a-table-column title="操作" key="actions" width="100">
              <template #default="{ record }">
                <a-button type="link" size="small" @click="goToDetail(record.release_order_id)">查看详情</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="records" tab="审批记录">
          <a-table
            row-key="id"
            :data-source="recordItems"
            :loading="recordLoading"
            :pagination="{
              current: recordPagination.page,
              pageSize: recordPagination.pageSize,
              total: recordTotal,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              onChange: (page:number, pageSize:number) => { recordPagination.page = page; recordPagination.pageSize = pageSize; void loadAllRecords() },
            }"
          >
            <a-table-column title="发布单号" data-index="order_no" key="order_no" />
            <a-table-column title="应用" data-index="application_name" key="application_name" />
            <a-table-column title="环境" data-index="env_code" key="env_code" width="100" />
            <a-table-column title="审批动作" key="action" width="120">
              <template #default="{ record }">{{ approvalActionText(record.action) }}</template>
            </a-table-column>
            <a-table-column title="审批人" data-index="operator_name" key="operator_name" width="120" />
            <a-table-column title="审批意见" data-index="comment" key="comment" ellipsis />
            <a-table-column title="操作时间" key="created_at" width="180">
              <template #default="{ record }">{{ formatTime(record.created_at) }}</template>
            </a-table-column>
            <a-table-column title="操作" key="actions" width="100">
              <template #default="{ record }">
                <a-button type="link" size="small" @click="goToDetail(record.release_order_id)">查看详情</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-modal
      :open="approvalActionModalVisible"
      :title="approvalActionMode === 'approve' ? '审批通过' : '审批拒绝'"
      :confirm-loading="approvalActing"
      :ok-text="approvalActionMode === 'approve' ? '通过' : '拒绝'"
      cancel-text="取消"
      @ok="handleApprovalAction"
      @cancel="closeApprovalAction"
    >
      <a-form layout="vertical">
        <a-form-item :label="approvalActionMode === 'approve' ? '审批备注' : '拒绝原因'" :required="approvalActionMode === 'reject'">
          <a-textarea
            v-model:value="approvalActionComment"
            :rows="4"
            :maxlength="400"
            :placeholder="approvalActionMode === 'approve' ? '可选填写审批备注。' : '请填写拒绝原因。'"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.summary-card {
  border-radius: var(--radius-xl);
}

.summary-label {
  color: var(--color-text-soft);
  font-size: 13px;
}

.summary-value {
  margin-top: 10px;
  color: var(--color-dashboard-900);
  font-size: 28px;
  font-weight: 800;
}

.summary-hint {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.7;
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

.status-pill-success {
  color: #15803d;
  background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #86efac;
}

.status-pill-running {
  color: #1d4ed8;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #93c5fd;
}

.status-pill-failed {
  color: #b91c1c;
  background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
  border-color: #fda4af;
}

.status-pill-warning {
  color: #c2410c;
  background: linear-gradient(180deg, #fff7ed 0%, #fed7aa 100%);
  border-color: #fdba74;
}

.status-pill-pending {
  color: #b45309;
  background: linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%);
  border-color: #fdba74;
}

.status-pill-neutral {
  color: #475569;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-color: #cbd5e1;
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
