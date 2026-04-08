<script setup lang="ts">
import {
  AppstoreOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RocketOutlined,
  SyncOutlined,
  UpOutlined,
  WarningOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteApplication, listApplications } from '../../api/application'
import { listProjects } from '../../api/project'
import { listReleaseOrders, listAllReleaseTemplates } from '../../api/release'
import { useApplicationListStore } from '../../stores/application-list'
import { useAuthStore } from '../../stores/auth'
import type { Application } from '../../types/application'
import type { Project } from '../../types/project'
import type { ReleaseOperationType, ReleaseOrder, ReleaseOrderBusinessStatus } from '../../types/release'
import { extractHTTPErrorMessage, isHTTPStatus } from '../../utils/http-error'

type MetricTone = 'default' | 'success' | 'running' | 'danger' | 'warning'

function releaseBusinessStatus(order: Pick<ReleaseOrder, 'status' | 'business_status'>): ReleaseOrderBusinessStatus {
  if (order.business_status) {
    return order.business_status
  }
  switch (order.status) {
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
      return 'deploying'
    case 'deploy_success':
    case 'success':
      return 'deploy_success'
    case 'deploy_failed':
    case 'failed':
      return 'deploy_failed'
    case 'running':
      return 'deploying'
    case 'cancelled':
      return 'cancelled'
    default:
      return 'pending_execution'
  }
}

interface WorkbenchEnvSnapshot {
  envCode: string
  order: ReleaseOrder
}

interface WorkbenchCard {
  application: Application
  latestOrder: ReleaseOrder | null
  envSnapshots: WorkbenchEnvSnapshot[]
  templateNames: string[]
  releaseReady: boolean
  runningCount: number
}

const router = useRouter()
const listStore = useApplicationListStore()
const authStore = useAuthStore()

const loading = ref(false)
const loadingProjects = ref(false)
const deletingId = ref('')
const dataSource = ref<Application[]>([])
const total = ref(0)
const loadingTemplateAvailability = ref(false)
const loadingRecentReleases = ref(false)
const templateApplicationIDs = ref<Set<string>>(new Set())
const templateNamesByApplication = ref<Map<string, string[]>>(new Map())
const recentReleaseOrders = ref<ReleaseOrder[]>([])
const projectOptions = ref<{ label: string; value: string }[]>([])
const introVisible = ref(false)
const collapsedApplicationMap = ref<Record<string, boolean>>({})
const collapseSeeded = ref(false)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1440)
let autoRefreshTimer: ReturnType<typeof window.setInterval> | null = null

const canManageApplication = computed(() => authStore.hasPermission('application.manage'))
const canViewPipeline = computed(() => authStore.hasPermission('pipeline.view'))
const visibleApplicationIDs = computed(() => new Set(dataSource.value.map((item) => String(item.id || '').trim()).filter(Boolean)))
const workbenchLoading = computed(() => loading.value || loadingTemplateAvailability.value || loadingRecentReleases.value)
const initialWorkbenchLoading = computed(() => workbenchLoading.value && dataSource.value.length === 0)

const filters = computed(() => ({
  key: listStore.key.trim() || undefined,
  name: listStore.name.trim() || undefined,
  project_id: listStore.project_id.trim() || undefined,
  status: listStore.status || undefined,
  page: listStore.page,
  page_size: listStore.pageSize,
}))

const recentOrdersByApplication = computed(() => {
  const grouped = new Map<string, ReleaseOrder[]>()
  recentReleaseOrders.value.forEach((item) => {
    const appID = String(item.application_id || '').trim()
    if (!appID) {
      return
    }
    const list = grouped.get(appID) || []
    list.push(item)
    grouped.set(appID, list)
  })
  return grouped
})

const workbenchCards = computed<WorkbenchCard[]>(() =>
  dataSource.value.map((application) => {
    const appID = String(application.id || '').trim()
    const orders = recentOrdersByApplication.value.get(appID) || []
    const envMap = new Map<string, ReleaseOrder>()
    orders.forEach((item) => {
      const envCode = String(item.env_code || '').trim()
      if (!envCode || envMap.has(envCode)) {
        return
      }
      envMap.set(envCode, item)
    })
    const envSnapshots = orderedEnvCodes(Array.from(envMap.keys())).map((envCode) => ({
      envCode,
      order: envMap.get(envCode)!,
    }))
    const templateNames = templateNamesByApplication.value.get(appID) || []
    return {
      application,
      latestOrder: orders[0] || null,
      envSnapshots,
      templateNames,
      releaseReady: canReleaseApplication(appID),
      runningCount: orders.filter((item) => releaseBusinessStatus(item) === 'deploying').length,
    }
  }),
)

const workbenchColumnCount = computed(() => {
  if (viewportWidth.value <= 768) {
    return 1
  }
  return 3
})

const workbenchColumns = computed<WorkbenchCard[][]>(() => {
  const columnCount = Math.max(1, workbenchColumnCount.value)
  const columns: WorkbenchCard[][] = Array.from({ length: columnCount }, () => [])
  workbenchCards.value.forEach((card, index) => {
    columns[index % columnCount].push(card)
  })
  return columns
})

const overviewMetrics = computed(() => {
  const visibleOrders = recentReleaseOrders.value.filter((item) => visibleApplicationIDs.value.has(String(item.application_id || '').trim()))
  const today = dayjs()
  const runningCount = new Set(visibleOrders.filter((item) => releaseBusinessStatus(item) === 'deploying').map((item) => item.id)).size
  const failedToday = visibleOrders.filter((item) => releaseBusinessStatus(item) === 'deploy_failed' && dayjs(item.updated_at).isSame(today, 'day')).length
  return [
    { key: 'applications', label: '应用总数', value: String(total.value), tone: 'default' as MetricTone, icon: AppstoreOutlined },
    {
      key: 'ready',
      label: '可直接发布',
      value: String(workbenchCards.value.filter((item) => item.releaseReady).length),
      tone: 'success' as MetricTone,
      icon: RocketOutlined,
    },
    {
      key: 'running',
      label: '运行中发布',
      value: String(runningCount),
      tone: 'running' as MetricTone,
      icon: SyncOutlined,
    },
    {
      key: 'failed_today',
      label: '今日失败',
      value: String(failedToday),
      tone: 'danger' as MetricTone,
      icon: WarningOutlined,
    },
  ]
})

const spotlightCard = computed(() => {
  const visibleOrders = recentReleaseOrders.value.filter((item) => visibleApplicationIDs.value.has(String(item.application_id || '').trim()))
  const pendingApprovalOrders = visibleOrders.filter((item) => releaseBusinessStatus(item) === 'pending_approval')
  const approvingOrders = visibleOrders.filter((item) => releaseBusinessStatus(item) === 'approving')
  const approvedToday = visibleOrders.filter(
    (item) => releaseBusinessStatus(item) === 'approved' && dayjs(item.updated_at).isSame(dayjs(), 'day'),
  )

  if (pendingApprovalOrders.length > 0 || approvingOrders.length > 0) {
    const priorityOrder = approvingOrders[0] || pendingApprovalOrders[0]
    const pendingCount = pendingApprovalOrders.length
    const approvingCount = approvingOrders.length
    return {
      tone: approvingCount > 0 ? 'warning' as MetricTone : 'running' as MetricTone,
      label: '当前关注',
      title: pendingCount + approvingCount > 1 ? `有 ${pendingCount + approvingCount} 张单子等待审批` : '有 1 张单子等待审批',
      text: `${priorityOrder.application_name} · ${priorityOrder.env_code || '未标注环境'} · ${priorityOrder.order_no}`,
      meta: `待审批 ${pendingCount} · 审批中 ${approvingCount} · 点击进入审批工作台`,
      status: releaseBusinessStatus(priorityOrder),
      needsAttention: true,
      attentionLabel: '待处理',
    }
  }

  if (approvedToday.length > 0) {
    const latestApproved = approvedToday[0]
    return {
      tone: 'success' as MetricTone,
      label: '当前关注',
      title: `今日已有 ${approvedToday.length} 张单子完成审批`,
      text: `${latestApproved.application_name} · ${latestApproved.env_code || '未标注环境'} · ${latestApproved.order_no}`,
      meta: '点击进入审批工作台，继续处理后续审批单',
      status: 'approved' as ReleaseOrderBusinessStatus,
      needsAttention: false,
      attentionLabel: '',
    }
  }

  return {
    tone: 'default' as MetricTone,
    label: '当前关注',
    title: '当前没有待处理审批',
    text: '审批工作台当前没有待审批或审批中的发布单',
    meta: '点击进入审批工作台查看全部审批记录',
    status: 'pending_execution' as ReleaseOrderBusinessStatus,
    needsAttention: false,
    attentionLabel: '',
  }
})

function canReleaseApplication(applicationID: string) {
  return (
    authStore.hasApplicationPermission('release.create', applicationID) &&
    templateApplicationIDs.value.has(String(applicationID || '').trim()) &&
    !loadingTemplateAvailability.value
  )
}

function orderedEnvCodes(items: string[]) {
  const preferred = ['dev', 'test', 'prod']
  return [...items]
    .filter(Boolean)
    .sort((left, right) => {
      const leftIndex = preferred.indexOf(left)
      const rightIndex = preferred.indexOf(right)
      if (leftIndex >= 0 || rightIndex >= 0) {
        if (leftIndex < 0) {
          return 1
        }
        if (rightIndex < 0) {
          return -1
        }
        if (leftIndex !== rightIndex) {
          return leftIndex - rightIndex
        }
      }
      return left.localeCompare(right)
    })
}

function syncCollapsedApplications(applications: Application[], preserve = false, previousIDs: Set<string> = new Set()) {
  const ids = applications.map((item) => String(item.id || '').trim()).filter(Boolean)
  if (!preserve || !collapseSeeded.value) {
    collapsedApplicationMap.value = Object.fromEntries(ids.map((id) => [id, true]))
    collapseSeeded.value = true
    return
  }
  const next: Record<string, boolean> = {}
  ids.forEach((id) => {
    if (Object.prototype.hasOwnProperty.call(collapsedApplicationMap.value, id)) {
      next[id] = collapsedApplicationMap.value[id]
      return
    }
    if (!previousIDs.has(id)) {
      next[id] = true
    }
  })
  collapsedApplicationMap.value = next
}

async function loadApplications(options: { silent?: boolean; preserveCollapse?: boolean } = {}) {
  if (!options.silent) {
    loading.value = true
  }
  try {
    const previousIDs = new Set(dataSource.value.map((item) => String(item.id || '').trim()).filter(Boolean))
    const response = await listApplications(filters.value)
    dataSource.value = response.data
    total.value = response.total
    listStore.setPage(response.page, response.page_size)
    syncCollapsedApplications(response.data, options.preserveCollapse, previousIDs)
  } catch (error) {
    if (!options.silent) {
      message.error(extractHTTPErrorMessage(error, '应用列表加载失败'))
    }
  } finally {
    if (!options.silent) {
      loading.value = false
    }
  }
}

async function loadProjectOptions() {
  loadingProjects.value = true
  try {
    const response = await listProjects({ page: 1, page_size: 200, status: 'active' })
    const projects = response.data || []
    projectOptions.value = projects.map((item: Project) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))
    const current = String(listStore.project_id || '').trim()
    const hasCurrent = current && projectOptions.value.some((item) => item.value === current)
    if (!hasCurrent) {
      listStore.project_id = projectOptions.value[0]?.value || ''
      listStore.setPage(1, listStore.pageSize)
    }
  } catch (error) {
    projectOptions.value = []
    message.error(extractHTTPErrorMessage(error, '项目列表加载失败'))
  } finally {
    loadingProjects.value = false
  }
}

async function loadTemplateAvailability(options: { silent?: boolean } = {}) {
  if (!options.silent) {
    loadingTemplateAvailability.value = true
  }
  try {
    const items = await listAllReleaseTemplates({ status: 'active' })
    const grouped = new Map<string, string[]>()
    items.forEach((item) => {
      const appID = String(item.application_id || '').trim()
      if (!appID) {
        return
      }
      const list = grouped.get(appID) || []
      const templateName = String(item.name || '').trim()
      if (templateName && !list.includes(templateName)) {
        list.push(templateName)
      }
      grouped.set(appID, list)
    })
    templateNamesByApplication.value = grouped
    templateApplicationIDs.value = new Set([...grouped.keys()])
  } catch (error) {
    templateNamesByApplication.value = new Map()
    templateApplicationIDs.value = new Set()
    if (!options.silent && !isHTTPStatus(error, 403)) {
      message.error(extractHTTPErrorMessage(error, '发布模板状态加载失败'))
    }
  } finally {
    if (!options.silent) {
      loadingTemplateAvailability.value = false
    }
  }
}

async function loadRecentReleases(options: { silent?: boolean } = {}) {
  if (!options.silent) {
    loadingRecentReleases.value = true
  }
  try {
    const applicationIDs = dataSource.value.map((item) => String(item.id || '').trim()).filter(Boolean)
    if (applicationIDs.length === 0) {
      recentReleaseOrders.value = []
      return
    }

    const results = await Promise.allSettled(
      applicationIDs.map((applicationID) =>
        listReleaseOrders(
          {
            application_id: applicationID,
            page: 1,
            page_size: 12,
          },
          {
            timeout: 30_000,
          },
        ),
      ),
    )

    const merged: ReleaseOrder[] = []
    let successCount = 0
    results.forEach((result) => {
      if (result.status !== 'fulfilled') {
        return
      }
      successCount += 1
      merged.push(...result.value.data)
    })

    if (successCount === 0) {
      throw new Error('recent release requests all failed')
    }

    recentReleaseOrders.value = merged.sort((left, right) =>
      dayjs(right.created_at).valueOf() - dayjs(left.created_at).valueOf(),
    )
  } catch (error) {
    if (!options.silent && !isHTTPStatus(error, 403) && recentReleaseOrders.value.length === 0) {
      message.error(extractHTTPErrorMessage(error, '最近发布动态加载失败'))
    }
  } finally {
    if (!options.silent) {
      loadingRecentReleases.value = false
    }
  }
}

function handleSearch() {
  listStore.setPage(1, listStore.pageSize)
  void (async () => {
    await loadApplications()
    await loadRecentReleases()
  })()
}

function handleReset() {
  listStore.resetFilters()
  listStore.project_id = projectOptions.value[0]?.value || ''
  void (async () => {
    await loadApplications()
    await loadRecentReleases()
  })()
}

function handlePageChange(page: number, pageSize: number) {
  listStore.setPage(page, pageSize)
  void (async () => {
    await loadApplications({ preserveCollapse: true })
    await loadRecentReleases()
  })()
}

function openIntroDrawer() {
  introVisible.value = true
}

function closeIntroDrawer() {
  introVisible.value = false
}

function toCreate() {
  void router.push('/applications/new')
}

function toDetail(id: string) {
  void router.push(`/applications/${id}`)
}

function toEdit(id: string) {
  void router.push(`/applications/${id}/edit`)
}

function toBindings(id: string) {
  void router.push(`/applications/${id}/pipeline-bindings`)
}

function toRelease(id: string) {
  if (!canReleaseApplication(id)) {
    return
  }
  void router.push({
    path: '/releases/new',
    query: { application_id: id },
  })
}

function toReleaseRecords(id: string) {
  void router.push({
    path: '/releases',
    query: { application_id: id },
  })
}

function toTemplates(id: string) {
  void router.push({
    path: '/release-templates',
    query: { application_id: id },
  })
}

function toReleaseOrderDetail(id: string) {
  void router.push(`/releases/${id}`)
}

function toApprovalWorkbench() {
  void router.push('/release-approvals')
}

async function refreshWorkbench() {
  await loadApplications({ preserveCollapse: true })
  await Promise.all([loadTemplateAvailability(), loadRecentReleases()])
}

async function refreshWorkbenchSilently() {
  await loadApplications({ silent: true, preserveCollapse: true })
  await Promise.all([loadTemplateAvailability({ silent: true }), loadRecentReleases({ silent: true })])
}

function toggleCardCollapsed(applicationID: string) {
  const id = String(applicationID || '').trim()
  collapsedApplicationMap.value = {
    ...collapsedApplicationMap.value,
    [id]: !collapsedApplicationMap.value[id],
  }
}

function isCardCollapsed(applicationID: string) {
  const id = String(applicationID || '').trim()
  return collapsedApplicationMap.value[id] !== false
}

function startAutoRefresh() {
  stopAutoRefresh()
  autoRefreshTimer = window.setInterval(() => {
    void refreshWorkbenchSilently()
  }, 30000)
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    window.clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

function handleResize() {
  viewportWidth.value = window.innerWidth
}

async function handleDelete(id: string) {
  deletingId.value = id
  try {
    await deleteApplication(id)
    message.success('应用删除成功')
    if (dataSource.value.length === 1 && listStore.page > 1) {
      listStore.setPage(listStore.page - 1, listStore.pageSize)
    }
    await loadApplications({ preserveCollapse: true })
    await loadRecentReleases()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用删除失败'))
  } finally {
    deletingId.value = ''
  }
}

function applicationStatusText(status: Application['status']) {
  return status === 'active' ? '启用中' : '已停用'
}

function applicationStatusClass(status: Application['status']) {
  return status === 'active' ? 'app-state-chip-active' : 'app-state-chip-inactive'
}

function releaseStatusText(status: ReleaseOrderBusinessStatus) {
  switch (status) {
    case 'deploy_success':
      return '发布成功'
    case 'deploying':
      return '发布中'
    case 'deploy_failed':
      return '发布失败'
    case 'queued':
      return '排队中'
    case 'pending_execution':
      return '待执行'
    case 'approved':
      return '已批准'
    case 'pending_approval':
      return '待审批'
    case 'approving':
      return '审批中'
    case 'rejected':
      return '审批拒绝'
    case 'draft':
      return '草稿'
    case 'cancelled':
      return '已取消'
    default:
      return '待执行'
  }
}

function releaseStatusClass(status: ReleaseOrderBusinessStatus) {
  switch (status) {
    case 'deploy_success':
      return 'env-status-success'
    case 'deploying':
      return 'env-status-running'
    case 'deploy_failed':
      return 'env-status-failed'
    case 'pending_execution':
    case 'queued':
    case 'pending_approval':
    case 'approving':
      return 'env-status-pending'
    case 'cancelled':
      return 'env-status-neutral'
    default:
      return 'env-status-pending'
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

function operationTypeClass(operationType: ReleaseOperationType | '' | null | undefined) {
  switch (String(operationType || '').trim().toLowerCase()) {
    case 'rollback':
      return 'dashboard-chip dashboard-chip-danger'
    case 'replay':
      return 'dashboard-chip dashboard-chip-warning'
    default:
      return 'dashboard-chip dashboard-chip-neutral'
  }
}

function spotlightClass(tone: MetricTone) {
  switch (tone) {
    case 'success':
      return 'spotlight-card-success'
    case 'running':
      return 'spotlight-card-running'
    case 'warning':
      return 'spotlight-card-warning'
    case 'danger':
      return 'spotlight-card-danger'
    default:
      return 'spotlight-card-default'
  }
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function templateSummary(names: string[]) {
  if (names.length === 0) {
    return '未配置可用模板'
  }
  if (names.length === 1) {
    return names[0]
  }
  return `${names[0]} 等 ${names.length} 个模板`
}

onMounted(() => {
  void (async () => {
    await loadProjectOptions()
    await loadApplications()
    await Promise.all([loadTemplateAvailability(), loadRecentReleases()])
  })()
  window.addEventListener('resize', handleResize)
  startAutoRefresh()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAutoRefresh()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-copy">
        <h2 class="page-title">我的应用</h2>
        <p class="page-subtitle">围绕应用查看环境状态、最近发布与可用动作，把发布入口直接放到工作台第一屏。</p>
      </div>
      <a-space>
        <a-button @click="openIntroDrawer">
          <template #icon>
            <QuestionCircleOutlined />
          </template>
          发布流程介绍
        </a-button>
        <a-button @click="refreshWorkbench">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新
        </a-button>
        <a-button v-if="canManageApplication" type="primary" @click="toCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          新增应用
        </a-button>
      </a-space>
    </div>

    <a-card class="application-overview-card" :bordered="true">
      <div v-if="initialWorkbenchLoading" class="overview-loading-state">
        <div class="overview-loading-header">
          <SyncOutlined spin class="overview-loading-icon" />
          <div>
            <div class="overview-loading-title">正在汇总应用视图</div>
            <div class="overview-loading-text">正在加载应用、模板与最近发布记录，页面准备好后会自动展示工作台。</div>
          </div>
        </div>
        <div class="overview-loading-grid">
          <a-skeleton-button v-for="index in 4" :key="`metric-${index}`" active block class="overview-loading-metric" />
        </div>
      </div>
      <div v-else class="overview-layout">
        <div class="overview-metrics-grid">
          <div
            v-for="item in overviewMetrics"
            :key="item.key"
            class="overview-metric-card"
            :class="`overview-metric-card-${item.tone}`"
          >
            <component :is="item.icon" class="overview-metric-icon" />
            <div class="overview-metric-copy">
              <div class="overview-metric-label">{{ item.label }}</div>
              <div class="overview-metric-value">{{ item.value }}</div>
            </div>
          </div>
        </div>
        <button class="spotlight-card spotlight-card-button" :class="spotlightClass(spotlightCard.tone)" type="button" @click="toApprovalWorkbench">
          <div class="spotlight-head">
            <div class="spotlight-label">{{ spotlightCard.label }}</div>
            <div v-if="spotlightCard.needsAttention" class="spotlight-attention-badge">
              <span class="spotlight-attention-dot"></span>
              <span>{{ spotlightCard.attentionLabel }}</span>
            </div>
          </div>
          <div class="spotlight-title">{{ spotlightCard.title }}</div>
          <div class="spotlight-text">{{ spotlightCard.text }}</div>
          <div class="spotlight-meta">{{ spotlightCard.meta }}</div>
        </button>
      </div>
    </a-card>

    <a-card class="filter-card" :bordered="true">
      <div class="advanced-search-panel">
        <a-form layout="inline" class="filter-form">
          <a-form-item label="项目">
            <a-select
              v-model:value="listStore.project_id"
              class="filter-status-select"
              allow-clear
              show-search
              option-filter-prop="label"
              placeholder="请选择项目"
              :loading="loadingProjects"
              :options="projectOptions"
            />
          </a-form-item>
          <a-form-item label="Key">
            <a-input v-model:value="listStore.key" allow-clear placeholder="按 app_key 查询" />
          </a-form-item>
          <a-form-item label="名称">
            <a-input v-model:value="listStore.name" allow-clear placeholder="按应用名称查询" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="listStore.status"
              class="filter-status-select"
              allow-clear
              placeholder="全部"
              :options="[
                { label: '启用中', value: 'active' },
                { label: '已停用', value: 'inactive' },
              ]"
            />
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

    <div v-if="initialWorkbenchLoading" class="workbench-loading-state">
      <div class="workbench-loading-copy">
        <div class="workbench-loading-title">应用工作台加载中</div>
        <div class="workbench-loading-text">我们正在整理环境状态、最近发布和模板可用性，请稍等片刻。</div>
      </div>
      <div class="workbench-skeleton-grid">
        <a-skeleton v-for="index in 6" :key="index" active :paragraph="{ rows: 6 }" class="workbench-skeleton-card" />
      </div>
    </div>

    <div v-else-if="workbenchCards.length > 0" class="application-workbench-columns" :class="`application-workbench-columns-${workbenchColumnCount}`">
      <div v-for="(column, columnIndex) in workbenchColumns" :key="`column-${columnIndex}`" class="application-workbench-column">
        <a-card
          v-for="card in column"
          :key="card.application.id"
          class="application-workbench-card"
          :class="{ 'application-workbench-card-collapsed': isCardCollapsed(card.application.id) }"
          :bordered="true"
        >
          <div class="workbench-card-header">
            <div class="workbench-card-header-copy">
              <div class="workbench-card-title-row">
                <button class="workbench-app-title" type="button" @click="toDetail(card.application.id)">
                  {{ card.application.name }}
                </button>
                <span class="workbench-app-key">{{ card.application.key }}</span>
              </div>
              <div class="workbench-app-project">
                {{ card.application.project_name ? `归属项目：${card.application.project_name}` : '归属项目：未配置' }}
              </div>
              <p class="workbench-app-description">
                {{ card.application.description || '暂无应用描述' }}
              </p>
            </div>
            <div class="workbench-card-header-actions">
              <span class="workbench-app-state" :class="applicationStatusClass(card.application.status)">
                {{ applicationStatusText(card.application.status) }}
              </span>
              <a-button class="workbench-card-collapse" @click="toggleCardCollapsed(card.application.id)">
                <template #icon>
                  <component :is="isCardCollapsed(card.application.id) ? DownOutlined : UpOutlined" />
                </template>
                {{ isCardCollapsed(card.application.id) ? '展开' : '折叠' }}
              </a-button>
            </div>
          </div>

          <div v-show="isCardCollapsed(card.application.id)" class="workbench-card-collapsed-summary">
            <span class="workbench-collapsed-item workbench-collapsed-item-block">
              最近发布：{{ card.latestOrder?.order_no || '暂无最近发布' }}
            </span>
            <div class="workbench-collapsed-tail">
              <div class="workbench-collapsed-meta">
                <span class="workbench-collapsed-item">
                  {{ card.runningCount > 0 ? `执行中 ${card.runningCount} 次` : '当前无运行中发布' }}
                </span>
              </div>
              <div class="workbench-collapsed-action">
                <a-button type="primary" :disabled="!card.releaseReady" @click="toRelease(card.application.id)">发布</a-button>
              </div>
            </div>
          </div>

          <div v-show="!isCardCollapsed(card.application.id)" class="workbench-card-expanded">
            <div class="workbench-meta-row">
              <span class="workbench-meta-chip">
                项目：{{ card.application.project_name || '-' }}
              </span>
              <span class="workbench-meta-chip">负责人：{{ card.application.owner || '-' }}</span>
              <span class="workbench-meta-chip">语言：{{ card.application.language || '-' }}</span>
              <span class="workbench-meta-chip">制品：{{ card.application.artifact_type || '-' }}</span>
            </div>

            <div class="workbench-template-strip" :class="{ 'workbench-template-strip-muted': !card.releaseReady }">
              <div class="workbench-strip-label">当前模板</div>
              <div class="workbench-strip-value">{{ templateSummary(card.templateNames) }}</div>
              <span
                class="dashboard-chip"
                :class="card.releaseReady ? 'dashboard-chip-running' : 'dashboard-chip-neutral'"
              >
                {{ card.releaseReady ? '可直接发布' : '待配置模板' }}
              </span>
            </div>

            <div class="latest-release-panel">
              <div class="section-header-row">
                <div class="section-title">最近发布</div>
                <span v-if="loadingRecentReleases" class="section-loading-chip">
                  <SyncOutlined spin />
                  正在同步
                </span>
              </div>
              <template v-if="card.latestOrder">
                <div class="latest-release-main">
                  <button class="latest-release-order" type="button" @click="toReleaseOrderDetail(card.latestOrder.id)">
                    {{ card.latestOrder.order_no }}
                  </button>
                  <div class="latest-release-tags">
                    <span class="dashboard-chip" :class="operationTypeClass(card.latestOrder.operation_type)">
                      {{ operationTypeText(card.latestOrder.operation_type) }}
                    </span>
                    <span class="dashboard-chip release-status-chip" :class="releaseStatusClass(releaseBusinessStatus(card.latestOrder))">
                      <SyncOutlined v-if="releaseBusinessStatus(card.latestOrder) === 'deploying'" spin class="running-spin-icon" />
                      {{ releaseStatusText(releaseBusinessStatus(card.latestOrder)) }}
                    </span>
                  </div>
                </div>
                <div class="latest-release-meta">
                  <span>{{ card.latestOrder.env_code || '未标注环境' }}</span>
                  <span>{{ formatTime(card.latestOrder.updated_at || card.latestOrder.created_at) }}</span>
                  <span>{{ card.runningCount > 0 ? `运行中 ${card.runningCount} 次` : '当前无运行中发布' }}</span>
                </div>
              </template>
              <div v-else-if="loadingRecentReleases" class="inline-loading-state">
                <SyncOutlined spin class="inline-loading-icon" />
                <span>最近发布正在加载，请稍等片刻。</span>
              </div>
              <a-empty v-else description="暂无最近发布" :image="false" class="workbench-empty-state" />
            </div>

            <div class="workbench-actions">
              <a-space wrap>
                <a-button @click="toDetail(card.application.id)">详情</a-button>
                <a-button @click="toReleaseRecords(card.application.id)">发布记录</a-button>
                <a-button @click="toTemplates(card.application.id)">模板</a-button>
              </a-space>
            </div>

            <div class="workbench-footer-row">
              <div class="workbench-footer-actions">
                <a-button type="primary" :disabled="!card.releaseReady" @click="toRelease(card.application.id)">发布</a-button>
                <a-popover
                  v-if="canViewPipeline || canManageApplication"
                  trigger="click"
                  placement="topRight"
                  overlay-class-name="workbench-manage-popover"
                >
                  <template #content>
                    <div class="workbench-manage-actions">
                      <a-button v-if="canViewPipeline" block @click="toBindings(card.application.id)">管线绑定</a-button>
                      <a-button v-if="canManageApplication" block @click="toEdit(card.application.id)">编辑</a-button>
                      <a-popconfirm
                        v-if="canManageApplication"
                        title="确认删除当前应用吗？"
                        ok-text="删除"
                        cancel-text="取消"
                        @confirm="handleDelete(card.application.id)"
                      >
                        <template #icon>
                          <ExclamationCircleOutlined class="danger-icon" />
                        </template>
                        <a-button block danger :loading="deletingId === card.application.id">删除</a-button>
                      </a-popconfirm>
                    </div>
                  </template>
                  <a-button class="workbench-manage-trigger">
                    更多操作
                    <template #icon>
                      <MoreOutlined />
                    </template>
                  </a-button>
                </a-popover>
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </div>

    <a-card v-else class="table-card" :bordered="true">
      <a-empty description="当前没有符合条件的应用" />
    </a-card>

    <div class="pagination-area">
      <a-pagination
        :current="listStore.page"
        :page-size="listStore.pageSize"
        :total="total"
        :page-size-options="['6', '10', '20', '50']"
        show-size-changer
        show-quick-jumper
        :show-total="(count: number) => `共 ${count} 个应用`"
        @change="handlePageChange"
        @showSizeChange="handlePageChange"
      />
    </div>

    <a-drawer :open="introVisible" title="发布流程介绍" width="620" @close="closeIntroDrawer">
      <a-space direction="vertical" size="large" class="intro-drawer-content">
        <a-alert
          type="info"
          show-icon
          message="这张图用于帮助用户理解应用、CI、参数、ArgoCD 与 GitOps 之间的关系。"
          description="应用是发布对象；CI 管线负责构建与产出动态值；发布参数负责在 CI/CD 之间传递上下文；ArgoCD 与 GitOps 实例一起决定最终修改哪份 Git 声明并部署到哪个集群。"
        />

        <div class="flow-section">
          <div class="flow-node primary">
            <div class="flow-title">应用 App</div>
            <div class="flow-desc">应用是整条发布链路的中心对象，模板、绑定和发布单都围绕当前应用展开。</div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-node">
            <div class="flow-title">CI 管线</div>
            <div class="flow-desc">负责拉代码、构建、推镜像，并产出镜像版本等动态值。</div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-node">
            <div class="flow-title">发布参数</div>
            <div class="flow-desc">包含基础环境、标准字段映射值和 CI 运行期产出，是后续 CD 的输入上下文。</div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-branch">
            <div class="flow-branch-title">CD 方式</div>
            <div class="flow-branch-grid">
              <div class="flow-node">
                <div class="flow-title">CD 管线</div>
                <div class="flow-desc">直接走绑定的 CD 管线，适合已有 Jenkins/CD 流程。</div>
              </div>
              <div class="flow-node accent">
                <div class="flow-title">ArgoCD</div>
                <div class="flow-desc">平台先修改 GitOps 配置，再触发 ArgoCD，同步到目标集群。</div>
              </div>
            </div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-node accent">
            <div class="flow-title">ArgoCD 实例</div>
            <div class="flow-desc">发布时会根据基础环境 env 命中具体的 ArgoCD 实例，决定使用哪套集群入口与应用视图。</div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-node accent">
            <div class="flow-title">GitOps 实例</div>
            <div class="flow-desc">ArgoCD 实例会关联一个 GitOps 实例，GitOps 实例负责提供本地工作目录、Git 凭据和提交身份。</div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-node accent">
            <div class="flow-title">Git 仓库</div>
            <div class="flow-desc">具体仓库与路径由 ArgoCD Application 解析，平台在这里更新 values 或 YAML，再提交推送。</div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-node accent">
            <div class="flow-title">目标集群</div>
            <div class="flow-desc">Git 变更推送后，由 ArgoCD Sync 与健康检查完成最终部署落地。</div>
          </div>
        </div>
      </a-space>
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

.application-overview-card {
  border-radius: var(--radius-xl);
}

.overview-loading-state {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.overview-loading-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 2px;
}

.overview-loading-icon {
  color: var(--color-dashboard-800);
  font-size: 20px;
}

.overview-loading-title {
  color: var(--color-text-main);
  font-size: 18px;
  font-weight: 800;
}

.overview-loading-text {
  margin-top: 4px;
  color: var(--color-text-soft);
  font-size: 13px;
  line-height: 1.7;
}

.overview-loading-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.overview-loading-metric {
  height: 104px;
  border-radius: 18px;
}

.overview-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(280px, 1fr);
  gap: 18px;
}

.overview-metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.overview-metric-card {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 110px;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(96, 165, 250, 0.12);
  background:
    radial-gradient(circle at top right, rgba(96, 165, 250, 0.16), transparent 46%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.94));
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
}

.overview-metric-card-default {
  border-color: rgba(148, 163, 184, 0.18);
}

.overview-metric-card-success {
  border-color: rgba(74, 222, 128, 0.26);
  background:
    radial-gradient(circle at top right, rgba(74, 222, 128, 0.2), transparent 42%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(22, 101, 52, 0.9));
}

.overview-metric-card-running {
  border-color: rgba(96, 165, 250, 0.28);
  background:
    radial-gradient(circle at top right, rgba(96, 165, 250, 0.22), transparent 42%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(29, 78, 216, 0.88));
}

.overview-metric-card-danger {
  border-color: rgba(248, 113, 113, 0.28);
  background:
    radial-gradient(circle at top right, rgba(248, 113, 113, 0.24), transparent 42%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(127, 29, 29, 0.92));
}

.overview-metric-icon {
  font-size: 24px;
  color: rgba(239, 246, 255, 0.92);
}

.overview-metric-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.overview-metric-label {
  color: rgba(226, 232, 240, 0.72);
  font-size: 13px;
  font-weight: 600;
}

.overview-metric-value {
  color: #f8fafc;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
}

.spotlight-card {
  min-height: 236px;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(96, 165, 250, 0.12);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.22);
}

.spotlight-card-button {
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.spotlight-card-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
}

.spotlight-card-default {
  background:
    radial-gradient(circle at top right, rgba(148, 163, 184, 0.16), transparent 48%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
}

.spotlight-card-success {
  background:
    radial-gradient(circle at top right, rgba(74, 222, 128, 0.24), transparent 48%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(22, 101, 52, 0.92));
}

.spotlight-card-running {
  background:
    radial-gradient(circle at top right, rgba(96, 165, 250, 0.24), transparent 48%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(29, 78, 216, 0.9));
}

.spotlight-card-warning {
  background:
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.26), transparent 48%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(146, 64, 14, 0.94));
}

.spotlight-card-danger {
  background:
    radial-gradient(circle at top right, rgba(248, 113, 113, 0.24), transparent 48%),
    linear-gradient(160deg, rgba(15, 23, 42, 0.98), rgba(127, 29, 29, 0.94));
}

.spotlight-label {
  color: rgba(226, 232, 240, 0.72);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.spotlight-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.spotlight-attention-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.28);
  color: rgba(254, 242, 242, 0.96);
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.08), 0 10px 24px rgba(127, 29, 29, 0.18);
}

.spotlight-attention-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #fb7185;
  box-shadow: 0 0 0 6px rgba(251, 113, 133, 0.14);
  animation: spotlightPulse 1.8s ease-in-out infinite;
}

.spotlight-title {
  margin-top: 16px;
  color: #f8fafc;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.24;
}

.spotlight-text {
  margin-top: 12px;
  color: rgba(241, 245, 249, 0.9);
  font-size: 15px;
  line-height: 1.7;
}

.spotlight-meta {
  margin-top: 22px;
  color: rgba(226, 232, 240, 0.72);
  font-size: 13px;
}

.spotlight-link-hint {
  margin-top: 18px;
  color: rgba(248, 250, 252, 0.94);
  font-size: 13px;
  font-weight: 700;
}

@keyframes spotlightPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.18);
    opacity: 0.82;
  }
}

.application-workbench-columns {
  display: grid;
  gap: 20px;
  align-items: start;
}

.application-workbench-columns-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.application-workbench-columns-1 {
  grid-template-columns: minmax(0, 1fr);
}

.application-workbench-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.workbench-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.workbench-loading-state {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.workbench-loading-copy {
  padding: 2px 2px 0;
}

.workbench-loading-title {
  color: var(--color-text-main);
  font-size: 18px;
  font-weight: 800;
}

.workbench-loading-text {
  margin-top: 6px;
  color: var(--color-text-soft);
  font-size: 13px;
  line-height: 1.7;
}

.workbench-skeleton-card {
  border-radius: 20px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.86);
}

.application-workbench-card {
  min-width: 0;
  align-self: start;
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(248, 250, 252, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 18px 38px rgba(15, 23, 42, 0.05);
}

:deep(.application-workbench-card .ant-card-body) {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 24px;
}

.application-workbench-card-collapsed {
  min-height: 250px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(250, 251, 253, 0.98));
}

.workbench-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.workbench-card-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.workbench-card-header-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.workbench-card-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.workbench-app-title {
  border: none;
  background: transparent;
  padding: 0;
  color: var(--color-text-main);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
  cursor: pointer;
  text-align: left;
}

.workbench-app-title:hover {
  color: var(--color-dashboard-800);
}

.workbench-app-key {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.06);
  color: var(--color-dashboard-800);
  font-size: 12px;
  font-weight: 700;
}

.workbench-app-project {
  color: var(--color-text-soft);
  font-size: 13px;
  line-height: 1.5;
}

.workbench-app-description {
  margin: 0;
  color: var(--color-text-soft);
  font-size: 14px;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(1.8em * 2);
}

.workbench-app-state {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.workbench-card-collapse {
  flex-shrink: 0;
}

.workbench-card-collapsed-summary {
  margin-top: auto;
  padding-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.workbench-card-expanded {
  margin-top: 18px;
}

.workbench-collapsed-item {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.92);
  color: var(--color-text-soft);
  font-size: 12px;
  font-weight: 600;
}

.workbench-collapsed-item-block {
  width: 100%;
}

.workbench-collapsed-tail {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.workbench-collapsed-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.workbench-collapsed-action {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.app-state-chip-active {
  color: #166534;
  background: rgba(220, 252, 231, 0.96);
  border: 1px solid rgba(134, 239, 172, 0.9);
}

.app-state-chip-inactive {
  color: #475569;
  background: rgba(241, 245, 249, 0.96);
  border: 1px solid rgba(203, 213, 225, 0.88);
}

.workbench-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.workbench-meta-chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.92);
  color: var(--color-text-soft);
  font-size: 12px;
  font-weight: 600;
}

.workbench-template-strip,
.latest-release-panel {
  margin-top: 18px;
  border-radius: 18px;
  padding: 16px 18px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(255, 255, 255, 0.9);
}

.workbench-template-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.workbench-template-strip-muted {
  background: rgba(248, 250, 252, 0.95);
}

.workbench-strip-label,
.section-title {
  color: var(--color-dashboard-800);
  font-size: 13px;
  font-weight: 700;
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.section-header-row.compact {
  justify-content: flex-start;
  flex-wrap: wrap;
}

.section-loading-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(239, 246, 255, 0.86);
  border: 1px solid rgba(96, 165, 250, 0.18);
  color: var(--color-dashboard-800);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.section-loading-chip.compact {
  padding: 4px 8px;
  font-size: 11px;
}

.workbench-strip-value {
  flex: 1;
  min-width: 180px;
  color: var(--color-text-main);
  font-size: 14px;
  font-weight: 600;
}

.env-status-success {
  border-color: rgba(34, 197, 94, 0.2);
  background: linear-gradient(180deg, rgba(240, 253, 244, 0.98), rgba(255, 255, 255, 0.96));
}

.env-status-running {
  border-color: rgba(96, 165, 250, 0.22);
  background: linear-gradient(180deg, rgba(239, 246, 255, 0.98), rgba(255, 255, 255, 0.96));
}

.env-status-failed {
  border-color: rgba(248, 113, 113, 0.22);
  background: linear-gradient(180deg, rgba(254, 242, 242, 0.98), rgba(255, 255, 255, 0.96));
}

.env-status-pending,
.env-status-neutral {
  border-color: rgba(148, 163, 184, 0.18);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(255, 255, 255, 0.96));
}

.latest-release-main {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.latest-release-order {
  border: none;
  background: transparent;
  padding: 0;
  color: var(--color-dashboard-800);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.latest-release-order:hover {
  color: var(--color-dashboard-900);
}

.latest-release-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.release-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.running-spin-icon {
  color: var(--color-dashboard-900);
  font-size: 13px;
}

.latest-release-meta {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--color-text-soft);
  font-size: 12px;
}

.workbench-actions {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.workbench-footer-row {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed rgba(148, 163, 184, 0.24);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
}

.workbench-footer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.env-status-running .running-spin-icon {
  color: #1d4ed8;
}

.inline-loading-state {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-soft);
  font-size: 13px;
  font-weight: 600;
}

.inline-loading-state.compact {
  margin-top: 0;
  font-size: 12px;
}

.inline-loading-icon {
  color: var(--color-dashboard-800);
}

.workbench-manage-trigger {
  flex-shrink: 0;
}

:deep(.workbench-manage-popover .ant-popover-inner) {
  border-radius: 18px;
  padding: 12px;
}

.workbench-manage-actions {
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.workbench-empty-state {
  margin-top: 12px;
  border-radius: 16px;
  border: 1px dashed rgba(148, 163, 184, 0.28);
  background: rgba(248, 250, 252, 0.86);
}

.danger-icon {
  color: var(--color-danger);
}

.pagination-area {
  display: flex;
  justify-content: flex-end;
}

.intro-drawer-content {
  width: 100%;
}

.flow-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flow-arrow {
  color: var(--color-dashboard-800);
  font-size: 20px;
  line-height: 1;
  text-align: center;
}

.flow-node {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
  padding: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.flow-node.primary {
  border-color: rgba(59, 130, 246, 0.22);
  background: linear-gradient(180deg, rgba(239, 246, 255, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.flow-node.accent {
  border-color: rgba(96, 165, 250, 0.2);
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.flow-title {
  color: var(--color-text-main);
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

.flow-desc {
  color: var(--color-text-soft);
  font-size: 13px;
  line-height: 1.7;
}

.flow-branch {
  border: 1px dashed rgba(148, 163, 184, 0.32);
  border-radius: 18px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.92), rgba(255, 255, 255, 0.96));
}

.flow-branch-title {
  color: var(--color-dashboard-800);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.flow-branch-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (max-width: 1200px) {
  .overview-loading-grid,
  .overview-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

}

@media (max-width: 768px) {
  .overview-metrics-grid,
  .application-workbench-columns,
  .workbench-skeleton-grid {
    grid-template-columns: 1fr;
  }

  .workbench-card-header,
  .workbench-template-strip {
    flex-direction: column;
    align-items: flex-start;
  }

  .workbench-card-header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .workbench-actions,
  .workbench-footer-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .pagination-area {
    justify-content: center;
  }
}

@media (min-width: 640px) {
  .flow-branch-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
