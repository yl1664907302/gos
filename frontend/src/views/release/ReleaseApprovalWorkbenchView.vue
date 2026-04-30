<script setup lang="ts">
import { CheckOutlined, CloseOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
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

interface SummaryCard {
  key: TabKey
  label: string
  hint: string
  panelHint: string
  emptyText: string
  value: number
}

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

const refreshing = ref(false)

const approvalActionModalVisible = ref(false)
const approvalActionMode = ref<'approve' | 'reject'>('approve')
const approvalActionComment = ref('')
const approvalActionRecord = ref<ReleaseOrder | null>(null)
const approvalActing = ref(false)
const approvalActionViewportInset = ref(0)

const summaryCards = computed<SummaryCard[]>(() => [
  {
    key: 'pending',
    label: '待我审批',
    value: pendingTotal.value,
    hint: '当前需要我处理的发布单',
    panelHint: '聚合待审批与审批中的发布单，直接在这一页完成处理',
    emptyText: '当前没有待处理审批',
  },
  {
    key: 'mine',
    label: '我已处理',
    value: mineTotal.value,
    hint: '我已经提交过审批动作的记录',
    panelHint: '回看自己已经处理过的审批动作与对应发布结果',
    emptyText: '当前还没有你处理过的审批记录',
  },
  {
    key: 'records',
    label: '全部记录',
    value: recordTotal.value,
    hint: '当前可见应用范围内的审批记录',
    panelHint: '汇总当前可见范围内的全部审批动作，方便追踪审批链路',
    emptyText: '当前还没有审批记录',
  },
])

const activeSummaryCard = computed(
  () => summaryCards.value.find((item) => item.key === activeTab.value) || summaryCards.value[0],
)

const approvalActionModalTitle = computed(() => (approvalActionMode.value === 'approve' ? '审批通过' : '审批拒绝'))
const approvalActionSubmitText = computed(() => (approvalActionMode.value === 'approve' ? '通过' : '拒绝'))
const approvalActionFieldLabel = computed(() => (approvalActionMode.value === 'approve' ? '审批备注' : '拒绝原因'))
const approvalActionPlaceholder = computed(() =>
  approvalActionMode.value === 'approve' ? '可选填写审批备注' : '请填写拒绝原因',
)
const approvalActionMaskStyle = computed(() => ({
  left: `${approvalActionViewportInset.value}px`,
  width: `calc(100% - ${approvalActionViewportInset.value}px)`,
  background: 'rgba(15, 23, 42, 0.08)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  pointerEvents: approvalActionModalVisible.value ? 'auto' : 'none',
}))
const approvalActionWrapProps = computed(() => ({
  style: {
    left: `${approvalActionViewportInset.value}px`,
    width: `calc(100% - ${approvalActionViewportInset.value}px)`,
    pointerEvents: approvalActionModalVisible.value ? 'auto' : 'none',
  },
}))
let approvalActionViewportObserver: ResizeObserver | null = null

function readApprovalActionViewportInset() {
  if (typeof document === 'undefined') {
    return 0
  }

  const appLayout = document.querySelector('.app-layout')
  if (appLayout) {
    const rawWidth = window.getComputedStyle(appLayout).getPropertyValue('--layout-sider-width').trim()
    const parsedWidth = Number.parseFloat(rawWidth)
    if (Number.isFinite(parsedWidth) && parsedWidth >= 0) {
      return parsedWidth
    }
  }

  const sider = document.querySelector('.app-sider')
  if (!sider) {
    return 0
  }

  return Math.max(sider.getBoundingClientRect().width, 0)
}

function syncApprovalActionViewportInset() {
  approvalActionViewportInset.value = readApprovalActionViewportInset()
}

function observeApprovalActionViewportInset() {
  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
    return
  }

  const appLayout = document.querySelector('.app-layout')
  const sider = document.querySelector('.app-sider')
  if (!appLayout && !sider) {
    return
  }

  approvalActionViewportObserver?.disconnect()
  approvalActionViewportObserver = new ResizeObserver(() => {
    syncApprovalActionViewportInset()
  })

  if (appLayout) {
    approvalActionViewportObserver.observe(appLayout)
  }
  if (sider) {
    approvalActionViewportObserver.observe(sider)
  }
}

function stopObservingApprovalActionViewportInset() {
  approvalActionViewportObserver?.disconnect()
  approvalActionViewportObserver = null
}

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
      return '标准重放'
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

async function handleRefresh() {
  refreshing.value = true
  try {
    await reloadAll()
  } finally {
    refreshing.value = false
  }
}

function setActiveTab(key: TabKey) {
  activeTab.value = key
}

function handlePendingPageChange(page: number, pageSize: number) {
  pendingPagination.page = page
  pendingPagination.pageSize = pageSize
  void loadPendingOrders()
}

function handleMinePageChange(page: number, pageSize: number) {
  minePagination.page = page
  minePagination.pageSize = pageSize
  void loadMineRecords()
}

function handleRecordPageChange(page: number, pageSize: number) {
  recordPagination.page = page
  recordPagination.pageSize = pageSize
  void loadAllRecords()
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
}

function handleApprovalActionAfterClose() {
  approvalActionComment.value = ''
  approvalActionRecord.value = null
  approvalActing.value = false
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

onMounted(() => {
  syncApprovalActionViewportInset()
  observeApprovalActionViewportInset()
  void reloadAll()
})

onBeforeUnmount(() => {
  stopObservingApprovalActionViewportInset()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header release-approval-page-header">
      <div class="page-header-copy">
        <h2 class="page-title">审批</h2>
      </div>
      <div class="page-header-actions release-approval-page-header-actions">
        <a-button class="application-toolbar-action-btn approval-refresh-btn" :loading="refreshing" @click="handleRefresh">
          <template #icon>
            <SyncOutlined />
          </template>
          刷新
        </a-button>
      </div>
    </div>

    <div class="approval-summary-grid">
      <button
        v-for="item in summaryCards"
        :key="item.key"
        type="button"
        class="approval-summary-card"
        :class="[`approval-summary-card-${item.key}`, { 'is-active': activeTab === item.key }]"
        @click="setActiveTab(item.key)"
      >
        <div class="approval-summary-card-label">{{ item.label }}</div>
        <div class="approval-summary-card-value">{{ item.value }}</div>
        <div class="approval-summary-card-hint">{{ item.hint }}</div>
        <div class="approval-summary-card-meta">{{ activeTab === item.key ? '当前视图' : '查看列表' }}</div>
      </button>
    </div>

    <div class="approval-workbench-panel">
      <template v-if="activeTab === 'pending'">
        <a-table
          class="approval-workbench-table"
          row-key="id"
          :data-source="pendingOrders"
          :loading="pendingLoading"
          :pagination="false"
          :scroll="{ x: 1360 }"
          :locale="{ emptyText: activeSummaryCard.emptyText }"
        >
          <a-table-column title="发布单号" data-index="order_no" key="order_no" width="220" />
          <a-table-column title="应用" data-index="application_name" key="application_name" width="180" />
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
              <a-tag :class="['status-tag', statusToneClass(orderBusinessStatus(record))]">
                {{ statusText(orderBusinessStatus(record)) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="审批进度" key="approval_hint" width="180">
            <template #default="{ record }">{{ pendingApprovalHint(record) }}</template>
          </a-table-column>
          <a-table-column title="创建时间" key="created_at" width="180">
            <template #default="{ record }">{{ formatTime(record.created_at) }}</template>
          </a-table-column>
          <a-table-column title="操作" key="actions" width="220" fixed="right">
            <template #default="{ record }">
              <a-space wrap :size="[6, 6]">
                <a-button type="link" size="small" class="table-action-button" @click="goToDetail(record.id)">查看详情</a-button>
                <a-button
                  v-if="canApprove(record)"
                  type="link"
                  size="small"
                  class="table-action-button"
                  @click="openApprovalAction('approve', record)"
                >
                  <template #icon><CheckOutlined /></template>
                  通过
                </a-button>
                <a-button
                  v-if="canReject(record)"
                  type="link"
                  size="small"
                  danger
                  class="table-action-button table-action-button-danger"
                  @click="openApprovalAction('reject', record)"
                >
                  <template #icon><CloseOutlined /></template>
                  拒绝
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </a-table>

        <div class="pagination-area">
          <a-pagination
            :current="pendingPagination.page"
            :page-size="pendingPagination.pageSize"
            :total="pendingTotal"
            :page-size-options="['10', '20', '50']"
            show-size-changer
            show-quick-jumper
            :show-total="(count: number) => `共 ${count} 条`"
            @change="handlePendingPageChange"
          />
        </div>
      </template>

      <template v-else-if="activeTab === 'mine'">
        <a-table
          class="approval-workbench-table"
          row-key="id"
          :data-source="mineRecords"
          :loading="mineLoading"
          :pagination="false"
          :scroll="{ x: 1180 }"
          :locale="{ emptyText: activeSummaryCard.emptyText }"
        >
          <a-table-column title="发布单号" data-index="order_no" key="order_no" width="220" />
          <a-table-column title="应用" data-index="application_name" key="application_name" width="180" />
          <a-table-column title="环境" data-index="env_code" key="env_code" width="100" />
          <a-table-column title="审批动作" key="action" width="120">
            <template #default="{ record }">{{ approvalActionText(record.action) }}</template>
          </a-table-column>
          <a-table-column title="发布状态" key="business_status" width="120">
            <template #default="{ record }">
              <a-tag :class="['status-tag', statusToneClass(record.business_status)]">
                {{ statusText(record.business_status) }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="审批意见" data-index="comment" key="comment" ellipsis />
          <a-table-column title="操作时间" key="created_at" width="180">
            <template #default="{ record }">{{ formatTime(record.created_at) }}</template>
          </a-table-column>
          <a-table-column title="操作" key="actions" width="120">
            <template #default="{ record }">
              <a-button type="link" size="small" class="table-action-button" @click="goToDetail(record.release_order_id)">
                查看详情
              </a-button>
            </template>
          </a-table-column>
        </a-table>

        <div class="pagination-area">
          <a-pagination
            :current="minePagination.page"
            :page-size="minePagination.pageSize"
            :total="mineTotal"
            :page-size-options="['10', '20', '50']"
            show-size-changer
            show-quick-jumper
            :show-total="(count: number) => `共 ${count} 条`"
            @change="handleMinePageChange"
          />
        </div>
      </template>

      <template v-else>
        <a-table
          class="approval-workbench-table"
          row-key="id"
          :data-source="recordItems"
          :loading="recordLoading"
          :pagination="false"
          :scroll="{ x: 1220 }"
          :locale="{ emptyText: activeSummaryCard.emptyText }"
        >
          <a-table-column title="发布单号" data-index="order_no" key="order_no" width="220" />
          <a-table-column title="应用" data-index="application_name" key="application_name" width="180" />
          <a-table-column title="环境" data-index="env_code" key="env_code" width="100" />
          <a-table-column title="审批动作" key="action" width="120">
            <template #default="{ record }">{{ approvalActionText(record.action) }}</template>
          </a-table-column>
          <a-table-column title="审批人" data-index="operator_name" key="operator_name" width="120" />
          <a-table-column title="审批意见" data-index="comment" key="comment" ellipsis />
          <a-table-column title="操作时间" key="created_at" width="180">
            <template #default="{ record }">{{ formatTime(record.created_at) }}</template>
          </a-table-column>
          <a-table-column title="操作" key="actions" width="120">
            <template #default="{ record }">
              <a-button type="link" size="small" class="table-action-button" @click="goToDetail(record.release_order_id)">
                查看详情
              </a-button>
            </template>
          </a-table-column>
        </a-table>

        <div class="pagination-area">
          <a-pagination
            :current="recordPagination.page"
            :page-size="recordPagination.pageSize"
            :total="recordTotal"
            :page-size-options="['10', '20', '50']"
            show-size-changer
            show-quick-jumper
            :show-total="(count: number) => `共 ${count} 条`"
            @change="handleRecordPageChange"
          />
        </div>
      </template>
    </div>

    <a-modal
      :open="approvalActionModalVisible"
      :width="760"
      :closable="false"
      :footer="null"
      :destroy-on-close="true"
      :after-close="handleApprovalActionAfterClose"
      :mask-style="approvalActionMaskStyle"
      :wrap-props="approvalActionWrapProps"
      wrap-class-name="approval-action-modal-wrap"
      @cancel="closeApprovalAction"
    >
      <template #title>
        <div class="approval-action-modal-titlebar">
          <span class="approval-action-modal-title">{{ approvalActionModalTitle }}</span>
          <a-button
            class="application-toolbar-action-btn approval-action-modal-submit-btn"
            :loading="approvalActing"
            @click="handleApprovalAction"
          >
            {{ approvalActionSubmitText }}
          </a-button>
        </div>
      </template>

      <a-form layout="vertical" :required-mark="false" class="approval-action-form">
        <div v-if="approvalActionMode === 'reject'" class="approval-action-note">拒绝操作需要填写原因</div>

        <a-form-item :label="approvalActionFieldLabel" :required="approvalActionMode === 'reject'">
          <a-textarea
            v-model:value="approvalActionComment"
            :rows="4"
            :maxlength="400"
            :placeholder="approvalActionPlaceholder"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.release-approval-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

.release-approval-page-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: none;
}

:deep(.application-toolbar-action-btn.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  height: 42px;
  border-radius: 16px;
  border-color: rgba(148, 163, 184, 0.22) !important;
  background: rgba(255, 255, 255, 0.62) !important;
  color: #0f172a !important;
  font-size: 14px;
  font-weight: 700;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    0 12px 24px rgba(15, 23, 42, 0.04) !important;
  backdrop-filter: blur(14px) saturate(135%);
}

:deep(.application-toolbar-action-btn.ant-btn:hover),
:deep(.application-toolbar-action-btn.ant-btn:focus),
:deep(.application-toolbar-action-btn.ant-btn:focus-visible) {
  border-color: rgba(59, 130, 246, 0.32) !important;
  background: rgba(239, 246, 255, 0.78) !important;
  color: #0f172a !important;
}

.approval-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.approval-summary-card {
  appearance: none;
  display: flex;
  min-height: 148px;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  padding: 20px 22px;
  border-radius: 20px;
  border: 1px solid rgba(71, 85, 105, 0.38);
  background:
    radial-gradient(circle at top right, rgba(148, 163, 184, 0.12), transparent 32%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.94));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 18px 38px rgba(15, 23, 42, 0.14);
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.approval-summary-card:hover {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.36);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 22px 44px rgba(15, 23, 42, 0.18);
}

.approval-summary-card.is-active {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 48px rgba(15, 23, 42, 0.22);
}

.approval-summary-card-pending {
  border-color: rgba(96, 165, 250, 0.24);
  background:
    radial-gradient(circle at top right, rgba(96, 165, 250, 0.2), transparent 34%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(29, 78, 216, 0.9));
}

.approval-summary-card-pending.is-active {
  border-color: rgba(125, 211, 252, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 48px rgba(37, 99, 235, 0.24);
}

.approval-summary-card-mine {
  border-color: rgba(74, 222, 128, 0.24);
  background:
    radial-gradient(circle at top right, rgba(74, 222, 128, 0.2), transparent 34%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(22, 101, 52, 0.92));
}

.approval-summary-card-mine.is-active {
  border-color: rgba(134, 239, 172, 0.38);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 48px rgba(21, 128, 61, 0.24);
}

.approval-summary-card-records {
  border-color: rgba(129, 140, 248, 0.24);
  background:
    radial-gradient(circle at top right, rgba(129, 140, 248, 0.2), transparent 34%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(49, 46, 129, 0.92));
}

.approval-summary-card-records.is-active {
  border-color: rgba(165, 180, 252, 0.38);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 24px 48px rgba(67, 56, 202, 0.24);
}

.approval-summary-card-label {
  color: rgba(226, 232, 240, 0.74);
  font-size: 13px;
  font-weight: 700;
}

.approval-summary-card-value {
  margin-top: 2px;
  color: #f8fafc;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
}

.approval-summary-card-hint {
  color: rgba(226, 232, 240, 0.58);
  font-size: 12px;
  line-height: 1.6;
}

.approval-summary-card-meta {
  margin-top: auto;
  color: rgba(191, 219, 254, 0.92);
  font-size: 12px;
  font-weight: 700;
}

.approval-workbench-panel {
  background: transparent;
  border: none;
  box-shadow: none;
}

.approval-workbench-table {
  margin-top: 0;
}

.approval-workbench-table :deep(.ant-table) {
  background: transparent;
}

.approval-workbench-table :deep(.ant-table-container) {
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.34);
}

.approval-workbench-table :deep(.ant-table-thead > tr > th) {
  border-bottom: 1px solid rgba(15, 23, 42, 0.18);
  background: linear-gradient(180deg, #243247, #1f2a3d) !important;
  color: #dbeafe;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.approval-workbench-table :deep(.ant-table-thead > tr > th::before) {
  display: none;
}

.approval-workbench-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.72);
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-text-main);
}

.approval-workbench-table :deep(.ant-table-tbody > tr:hover > td) {
  background: rgba(248, 250, 252, 0.94) !important;
}

.approval-workbench-table :deep(.ant-table-cell-fix-right) {
  background: rgba(255, 255, 255, 0.96) !important;
  box-shadow: -12px 0 24px rgba(15, 23, 42, 0.04);
}

.approval-workbench-table :deep(.ant-table-thead .ant-table-cell-fix-right) {
  background: linear-gradient(180deg, #243247, #1f2a3d) !important;
  box-shadow: none;
}

.approval-workbench-table :deep(.ant-empty) {
  margin: 40px 0;
}

.table-action-button {
  padding: 0 6px;
  color: var(--color-dashboard-800);
  font-weight: 600;
}

.table-action-button:hover,
.table-action-button:focus {
  color: var(--color-dashboard-900);
}

.table-action-button-danger,
.table-action-button-danger:hover,
.table-action-button-danger:focus {
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

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.approval-action-modal-wrap :deep(.ant-modal-content) {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.08), transparent 30%),
    radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.08), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96));
  box-shadow:
    0 32px 90px rgba(15, 23, 42, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    inset 0 -1px 0 rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
}

.approval-action-modal-wrap :deep(.ant-modal-content)::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.62), rgba(255, 255, 255, 0.16) 34%, rgba(255, 255, 255, 0.02) 58%),
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.34), transparent 32%);
  pointer-events: none;
  z-index: 0;
}

.approval-action-modal-wrap :deep(.ant-modal-header) {
  position: relative;
  z-index: 1;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.92);
  background: transparent;
}

.approval-action-modal-wrap :deep(.ant-modal-title) {
  color: #0f172a;
}

.approval-action-modal-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.approval-action-modal-title {
  min-width: 0;
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.approval-action-modal-submit-btn.ant-btn {
  flex: none;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: normal;
}

.approval-action-modal-wrap :deep(.ant-modal-body) {
  position: relative;
  z-index: 1;
  padding-top: 10px;
}

.approval-action-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.approval-action-note {
  position: relative;
  padding: 0 0 0 14px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.approval-action-note::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  bottom: 3px;
  width: 4px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.42), rgba(251, 191, 36, 0.16));
}

@media (max-width: 1120px) {
  .release-approval-page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .release-approval-page-header-actions {
    justify-content: flex-start;
  }

  .approval-summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pagination-area {
    margin-top: 20px;
  }
}
</style>
