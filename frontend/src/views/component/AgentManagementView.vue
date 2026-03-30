<script setup lang="ts">
import { CopyOutlined, EyeOutlined, KeyOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  createAgentTask,
  createAgent,
  deleteAgentTask,
  disableAgent,
  enableAgent,
  getAgent,
  getAgentConfig,
  listAllAgentTasks,
  listAgentTasks,
  listAgents,
  maintenanceAgent,
  resumeAgentTask,
  resetAgentToken,
  stopAgentTask,
  updateAgent,
} from '../../api/agent'
import { useAuthStore } from '../../stores/auth'
import type { AgentInstallConfig, AgentInstance, AgentListParams, AgentRuntimeState, AgentStatus, AgentTask, AgentTaskMode, AgentTaskType, UpsertAgentPayload } from '../../types/agent'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()
const router = useRouter()
const AUTO_REFRESH_INTERVAL = 15000

const loading = ref(false)
const saving = ref(false)
const detailLoading = ref(false)
const configLoading = ref(false)
const resettingToken = ref(false)
const modalVisible = ref(false)
const detailVisible = ref(false)
const dispatchVisible = ref(false)
const dispatchLoading = ref(false)
const editingAgentID = ref('')
const dataSource = ref<AgentInstance[]>([])
const total = ref(0)
const detail = ref<AgentInstance | null>(null)
const installConfig = ref<AgentInstallConfig | null>(null)
const taskLoading = ref(false)
const taskList = ref<AgentTask[]>([])
const selectedAgentIDs = ref<string[]>([])
const taskTemplateList = ref<AgentTask[]>([])
const selectedDispatchTaskID = ref('')
let autoRefreshTimer: number | null = null

const filters = reactive<Required<AgentListParams>>({
  keyword: '',
  status: '',
  runtime_state: '',
  page: 1,
  page_size: 20,
})

const form = reactive<UpsertAgentPayload>({
  agent_code: '',
  name: '',
  environment_code: '',
  work_dir: '',
  tags: [],
  status: 'active',
  remark: '',
})
const tagsText = ref('')

const canManageAgent = computed(() => authStore.hasPermission('component.agent.manage'))
const canViewAgent = computed(() => canManageAgent.value || authStore.hasPermission('component.agent.view'))
const residentTasks = computed(() => taskList.value.filter((item) => item.task_mode === 'resident'))
const temporaryTasks = computed(() => taskList.value.filter((item) => item.task_mode !== 'resident'))
const selectedDispatchAgents = computed(() =>
  selectedAgentIDs.value
    .map((id) => dataSource.value.find((item) => item.id === id))
    .filter((item): item is AgentInstance => Boolean(item)),
)
const selectedDispatchTask = computed(() => taskTemplateList.value.find((item) => item.id === selectedDispatchTaskID.value) || null)
const dispatchTaskOptions = computed(() =>
  taskTemplateList.value.map((item) => ({
    value: item.id,
    label: `${item.name} · ${taskModeText(item.task_mode)} · ${item.agent_code || '未分配'}`,
  })),
)
const rowSelection = computed(() =>
  canManageAgent.value
    ? {
        selectedRowKeys: selectedAgentIDs.value,
        onChange: (keys: (string | number)[]) => {
          selectedAgentIDs.value = keys.map(String)
        },
      }
    : undefined,
)

const columns: TableColumnsType<AgentInstance> = [
  { title: 'Agent', dataIndex: 'name', key: 'name', width: 200 },
  { title: '编码', dataIndex: 'agent_code', key: 'agent_code', width: 150 },
  { title: '环境', dataIndex: 'environment_code', key: 'environment_code', width: 100 },
  { title: '主机', dataIndex: 'hostname', key: 'hostname', width: 180 },
  { title: 'IP', dataIndex: 'host_ip', key: 'host_ip', width: 140 },
  { title: '运行态', dataIndex: 'runtime_state', key: 'runtime_state', width: 120 },
  { title: '接单态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '最后心跳', dataIndex: 'last_heartbeat_at', key: 'last_heartbeat_at', width: 190 },
  { title: '当前任务', dataIndex: 'current_task_name', key: 'current_task_name', width: 220 },
  { title: '当前常驻任务', dataIndex: 'current_resident_task_name', key: 'current_resident_task_name', width: 240 },
  { title: '最近结果', dataIndex: 'last_task_status', key: 'last_task_status', width: 120 },
  { title: '操作', key: 'actions', width: 220, fixed: 'right' },
]

function resetForm() {
  editingAgentID.value = ''
  form.agent_code = ''
  form.name = ''
  form.environment_code = ''
  form.work_dir = ''
  form.tags = []
  form.status = 'active'
  form.remark = ''
  tagsText.value = ''
}

function normalizeTagsText(raw: string) {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

async function loadAgents(options: { silent?: boolean } = {}) {
  if (!canViewAgent.value) {
    return
  }
  if (!options.silent) {
    loading.value = true
  }
  try {
    const response = await listAgents({
      keyword: filters.keyword.trim() || undefined,
      status: (filters.status || undefined) as AgentStatus | undefined,
      runtime_state: (filters.runtime_state || undefined) as AgentRuntimeState | undefined,
      page: filters.page,
      page_size: filters.page_size,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.page_size = response.page_size
  } catch (error) {
    if (!options.silent) {
      message.error(extractHTTPErrorMessage(error, 'Agent 列表加载失败'))
    }
  } finally {
    if (!options.silent) {
      loading.value = false
    }
  }
}

async function loadTasks(agentID: string, options: { silent?: boolean } = {}) {
  if (!agentID) {
    taskList.value = []
    return
  }
  if (!options.silent) {
    taskLoading.value = true
  }
  try {
    const response = await listAgentTasks(agentID, { page: 1, page_size: 20 })
    taskList.value = response.data
  } catch (error) {
    if (!options.silent) {
      message.error(extractHTTPErrorMessage(error, 'Agent 任务加载失败'))
    }
  } finally {
    if (!options.silent) {
      taskLoading.value = false
    }
  }
}

async function openDetail(record: AgentInstance) {
  detailVisible.value = true
  await loadDetail(record.id, { includeConfig: true })
  await loadTasks(record.id)
}

async function loadDetail(id: string, options: { silent?: boolean; includeConfig?: boolean } = {}) {
  if (!id) {
    return
  }
  if (!options.silent) {
    detailLoading.value = true
  }
  if (options.includeConfig) {
    configLoading.value = true
    installConfig.value = null
  }
  try {
    const requests: Promise<any>[] = [getAgent(id)]
    if (options.includeConfig) {
      requests.push(getAgentConfig(id))
    }
    const [detailResponse, configResponse] = await Promise.all(requests)
    detail.value = detailResponse.data
    if (options.includeConfig && configResponse) {
      installConfig.value = configResponse.data
    }
  } catch (error) {
    if (!options.silent) {
      message.error(extractHTTPErrorMessage(error, 'Agent 详情加载失败'))
    }
  } finally {
    if (!options.silent) {
      detailLoading.value = false
    }
    if (options.includeConfig) {
      configLoading.value = false
    }
  }
}

async function runAutoRefresh() {
  if (document.hidden || !canViewAgent.value) {
    return
  }
  await loadAgents({ silent: true })
  if (detailVisible.value && detail.value?.id) {
    await loadDetail(detail.value.id, { silent: true })
    await loadTasks(detail.value.id, { silent: true })
  }
}

function startAutoRefresh() {
  if (autoRefreshTimer !== null) {
    window.clearInterval(autoRefreshTimer)
  }
  autoRefreshTimer = window.setInterval(() => {
    void runAutoRefresh()
  }, AUTO_REFRESH_INTERVAL)
}

function stopAutoRefresh() {
  if (autoRefreshTimer !== null) {
    window.clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

function openCreate() {
  resetForm()
  modalVisible.value = true
}

function openEdit(record: AgentInstance) {
  editingAgentID.value = record.id
  form.agent_code = record.agent_code
  form.name = record.name
  form.environment_code = record.environment_code || ''
  form.work_dir = record.work_dir
  form.tags = [...(record.tags || [])]
  form.status = record.status
  form.remark = record.remark || ''
  tagsText.value = (record.tags || []).join(', ')
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  resetForm()
}

function closeDetail() {
  detailVisible.value = false
  detail.value = null
  installConfig.value = null
  taskList.value = []
}

function goToTaskManagement() {
  void router.push('/components/agent-tasks')
}

async function openDispatchModal() {
  if (!selectedAgentIDs.value.length) {
    message.info('请先勾选要下发的 Agent')
    return
  }
  dispatchVisible.value = true
  dispatchLoading.value = true
  try {
    const response = await listAllAgentTasks({ page: 1, page_size: 300 })
    taskTemplateList.value = response.data.filter((item) => !item.agent_id)
    if (selectedDispatchTaskID.value && !taskTemplateList.value.some((item) => item.id === selectedDispatchTaskID.value)) {
      selectedDispatchTaskID.value = ''
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '任务模板加载失败'))
  } finally {
    dispatchLoading.value = false
  }
}

function closeDispatchModal() {
  dispatchVisible.value = false
  selectedDispatchTaskID.value = ''
  taskTemplateList.value = []
}

async function handleDispatchTask() {
  if (!selectedAgentIDs.value.length) {
    message.warning('请先选择目标 Agent')
    return
  }
  if (!selectedDispatchTask.value) {
    message.warning('请选择要下发的任务')
    return
  }
  dispatchLoading.value = true
  try {
    const source = selectedDispatchTask.value
    const payload = {
      name: source.name,
      task_mode: source.task_mode,
      task_type: source.task_type,
      shell_type: source.shell_type,
      work_dir: source.work_dir,
      script_id: source.script_id,
      script_path: source.script_path,
      script_text: source.script_text,
      variables: source.variables,
      timeout_sec: source.timeout_sec,
    }
    const results = await Promise.allSettled(selectedAgentIDs.value.map((agentID) => createAgentTask(agentID, payload)))
    const failed = results.filter((item) => item.status === 'rejected') as PromiseRejectedResult[]
    if (failed.length) {
      throw new Error(extractHTTPErrorMessage(failed[0].reason, '任务下发失败'))
    }
    message.success(`任务已下发到 ${selectedAgentIDs.value.length} 台 Agent`)
    closeDispatchModal()
    await loadAgents({ silent: true })
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, error instanceof Error ? error.message : '任务下发失败'))
  } finally {
    dispatchLoading.value = false
  }
}

async function handleSave() {
  saving.value = true
  const isEditing = Boolean(editingAgentID.value)
  try {
    const payload: UpsertAgentPayload = {
      agent_code: form.agent_code,
      name: form.name,
      environment_code: form.environment_code,
      work_dir: form.work_dir,
      tags: normalizeTagsText(tagsText.value),
      status: form.status,
      remark: form.remark,
    }
    const response = editingAgentID.value
      ? await updateAgent(editingAgentID.value, payload)
      : await createAgent(payload)
    closeModal()
    await loadAgents()
    detail.value = response.data
    message.success(isEditing ? 'Agent 已更新' : 'Agent 已创建')
    if (!isEditing) {
      message.info('系统已自动生成 Agent Token，请在详情中复制配置文件到目标主机。')
      await openDetail(response.data)
    } else if (detailVisible.value && detail.value?.id === response.data.id) {
      await openDetail(response.data)
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, isEditing ? 'Agent 更新失败' : 'Agent 创建失败'))
  } finally {
    saving.value = false
  }
}

async function handleChangeStatus(record: AgentInstance, target: AgentStatus) {
  try {
    if (target === 'active') {
      await enableAgent(record.id)
    } else if (target === 'disabled') {
      await disableAgent(record.id)
    } else {
      await maintenanceAgent(record.id)
    }
    message.success('Agent 状态已更新')
    await loadAgents()
    if (detailVisible.value && detail.value?.id === record.id) {
      await openDetail(record)
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Agent 状态更新失败'))
  }
}

function runtimeTagColor(state: AgentRuntimeState) {
  switch (state) {
    case 'online':
      return 'green'
    case 'busy':
      return 'blue'
    case 'maintenance':
      return 'gold'
    case 'disabled':
      return 'default'
    default:
      return 'red'
  }
}

function runtimeText(state: AgentRuntimeState) {
  switch (state) {
    case 'online':
      return '在线'
    case 'busy':
      return '执行中'
    case 'maintenance':
      return '维护中'
    case 'disabled':
      return '已禁用'
    default:
      return '离线'
  }
}

function statusTagColor(status: AgentStatus) {
  switch (status) {
    case 'active':
      return 'green'
    case 'maintenance':
      return 'gold'
    default:
      return 'default'
  }
}

function statusText(status: AgentStatus) {
  switch (status) {
    case 'active':
      return '可接单'
    case 'maintenance':
      return '维护中'
    default:
      return '已禁用'
  }
}

function taskTypeText(taskType: AgentTaskType) {
  switch (taskType) {
    case 'shell_task':
      return 'Shell 脚本'
    case 'script_file_task':
      return '脚本文件任务'
    case 'file_distribution_task':
      return '文件下发任务'
    default:
      return taskType
  }
}

function taskModeText(taskMode?: AgentTaskMode) {
  return taskMode === 'resident' ? '常驻任务' : '临时任务'
}

function residentRuntimeText(task: AgentTask) {
  if (task.status === 'running') {
    return '执行中'
  }
  if (task.status === 'queued') {
    return '排队中'
  }
  if (task.status === 'claimed') {
    return '准备执行'
  }
  if (task.status === 'cancelled') {
    if (task.started_at && (!task.finished_at || new Date(task.finished_at).getTime() < new Date(task.started_at).getTime())) {
      return '停止中'
    }
    return '已停止'
  }
  if ((task.run_count || 0) > 0) {
    return '待下一轮'
  }
  return '待首次执行'
}

function residentRuntimeColor(task: AgentTask) {
  if (task.status === 'running') {
    return 'blue'
  }
  if (task.status === 'queued') {
    return 'orange'
  }
  if (task.status === 'claimed') {
    return 'gold'
  }
  if (task.status === 'cancelled') {
    return 'default'
  }
  return 'green'
}

function residentSuccessPercent(task: AgentTask) {
  if (!task.run_count) {
    return 0
  }
  return Math.max(0, Math.min(100, Math.round((task.success_count / task.run_count) * 100)))
}

function taskStatusColor(status: AgentTask['status']) {
  switch (status) {
    case 'success':
      return 'green'
    case 'failed':
      return 'red'
    case 'running':
      return 'blue'
    case 'queued':
      return 'orange'
    case 'claimed':
      return 'gold'
    case 'cancelled':
      return 'default'
    default:
      return 'default'
  }
}

function taskStatusText(status: AgentTask['status']) {
  switch (status) {
    case 'pending':
      return '待领取'
    case 'queued':
      return '排队中'
    case 'claimed':
      return '已领取'
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

function lastRunStatusText(status: AgentTask['last_run_status']) {
  return status ? taskStatusText(status) : '尚未执行'
}

function lastTaskTagColor(status: AgentInstance['last_task_status']) {
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
      return 'default'
  }
}

function formatTime(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function copyText(value: string, successText: string) {
  if (!value) {
    message.warning('暂无可复制内容')
    return
  }
  try {
    await navigator.clipboard.writeText(value)
    message.success(successText)
  } catch {
    message.error('复制失败，请手动复制')
  }
}

function copyToken(token?: string) {
  void copyText(token || '', 'Token 已复制')
}

function copyConfigYAML(configYAML?: string) {
  void copyText(configYAML || '', '配置文件已复制')
}

async function handleResetToken() {
  if (!detail.value) {
    return
  }
  resettingToken.value = true
  try {
    const response = await resetAgentToken(detail.value.id)
    detail.value = response.data
    installConfig.value = null
    configLoading.value = true
    const configResponse = await getAgentConfig(detail.value.id)
    installConfig.value = configResponse.data
    message.success('Token 已重置，请重新分发配置文件到目标主机')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Token 重置失败'))
  } finally {
    resettingToken.value = false
    configLoading.value = false
  }
}

async function handleStopResidentTask(task: AgentTask) {
  if (!detail.value) {
    return
  }
  Modal.confirm({
    title: '停止常驻任务',
    content: '停止后该任务将不再被 Agent 循环领取；如果当前这一轮正在执行，会在本轮结束后彻底停止。',
    okText: '确认停止',
    cancelText: '取消',
    async onOk() {
      try {
        await stopAgentTask(detail.value!.id, task.id)
        await loadTasks(detail.value!.id)
        await loadDetail(detail.value!.id, { silent: true })
        await loadAgents({ silent: true })
        message.success('常驻任务已停止')
      } catch (error) {
        message.error(extractHTTPErrorMessage(error, '常驻任务停止失败'))
      }
    },
  })
}

async function handleResumeResidentTask(task: AgentTask) {
  if (!detail.value) {
    return
  }
  try {
    await resumeAgentTask(detail.value.id, task.id)
    await loadTasks(detail.value.id)
    await loadDetail(detail.value.id, { silent: true })
    await loadAgents({ silent: true })
    message.success('常驻任务已重新启用')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '常驻任务重新启用失败'))
  }
}

async function handleDeleteResidentTask(task: AgentTask) {
  if (!detail.value) {
    return
  }
  Modal.confirm({
    title: '删除常驻任务',
    content: '删除后该常驻任务会从当前 Agent 中移除，无法继续自动执行。此操作不可恢复，确认继续吗？',
    okText: '确认删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await deleteAgentTask(detail.value!.id, task.id)
        await loadTasks(detail.value!.id)
        await loadDetail(detail.value!.id, { silent: true })
        await loadAgents({ silent: true })
        message.success('常驻任务已删除')
      } catch (error) {
        message.error(extractHTTPErrorMessage(error, '常驻任务删除失败'))
      }
    },
  })
}

onMounted(() => {
  void loadAgents()
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
          <div class="page-title">Agent 管理</div>
          <div class="page-subtitle">管理生产侧 Agent 心跳、接单状态与最近执行信息；任务下发与常驻任务管理已统一迁移到任务管理。</div>
        </div>
        <a-space>
          <a-button @click="loadAgents" :loading="loading">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
          <a-button v-if="canManageAgent" @click="openDispatchModal">
            下发任务
          </a-button>
          <a-button v-if="canViewAgent" @click="goToTaskManagement">
            <template #icon><EyeOutlined /></template>
            任务管理
          </a-button>
          <a-button v-if="canManageAgent" type="primary" @click="openCreate">
            <template #icon><PlusOutlined /></template>
            新增 Agent
          </a-button>
        </a-space>
    </div>

    <a-card class="filter-card" :bordered="false">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="关键字">
          <a-input v-model:value="filters.keyword" allow-clear placeholder="编码 / 名称 / 主机 / IP" @pressEnter="loadAgents" />
        </a-form-item>
        <a-form-item label="接单态">
          <a-select v-model:value="filters.status" allow-clear style="width: 160px" placeholder="全部状态">
            <a-select-option value="active">可接单</a-select-option>
            <a-select-option value="maintenance">维护中</a-select-option>
            <a-select-option value="disabled">已禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="运行态">
          <a-select v-model:value="filters.runtime_state" allow-clear style="width: 160px" placeholder="全部运行态">
            <a-select-option value="online">在线</a-select-option>
            <a-select-option value="busy">执行中</a-select-option>
            <a-select-option value="offline">离线</a-select-option>
            <a-select-option value="maintenance">维护中</a-select-option>
            <a-select-option value="disabled">已禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="filter-form-actions">
          <a-space>
            <a-button type="primary" @click="filters.page = 1; loadAgents()">查询</a-button>
            <a-button @click="filters.keyword = ''; filters.status = ''; filters.runtime_state = ''; filters.page = 1; filters.page_size = 20; loadAgents()">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card" :bordered="false">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :row-selection="rowSelection"
        :pagination="{
          current: filters.page,
          pageSize: filters.page_size,
          total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page: number, pageSize: number) => {
            filters.page = page
            filters.page_size = pageSize
            loadAgents()
          },
          onShowSizeChange: (_current: number, size: number) => {
            filters.page = 1
            filters.page_size = size
            loadAgents()
          },
        }"
        :scroll="{ x: 1450 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="agent-primary">
              <div class="agent-name">{{ record.name }}</div>
              <div class="agent-meta">{{ record.work_dir }}</div>
            </div>
          </template>
          <template v-else-if="column.key === 'runtime_state'">
            <a-tag :color="runtimeTagColor(record.runtime_state)">{{ runtimeText(record.runtime_state) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="statusTagColor(record.status)">{{ statusText(record.status) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'last_heartbeat_at'">
            <div>{{ formatTime(record.last_heartbeat_at) }}</div>
            <div class="muted-text">{{ record.heartbeat_age_sec ? `${record.heartbeat_age_sec}s 前` : '尚未上报' }}</div>
          </template>
          <template v-else-if="column.key === 'current_task_name'">
            <span v-if="record.current_task_id">{{ record.current_task_name || record.current_task_id }}</span>
            <span v-else class="muted-text">当前空闲</span>
          </template>
          <template v-else-if="column.key === 'current_resident_task_name'">
            <a-space v-if="record.current_resident_task_id" size="small">
              <span>{{ record.current_resident_task_name || record.current_resident_task_id }}</span>
              <a-tag :color="taskStatusColor(record.current_resident_task_status || 'pending')">
                {{ taskStatusText(record.current_resident_task_status || 'pending') }}
              </a-tag>
            </a-space>
            <span v-else class="muted-text">未分配常驻任务</span>
          </template>
          <template v-else-if="column.key === 'last_task_status'">
            <a-tag :color="lastTaskTagColor(record.last_task_status)">{{ record.last_task_status || 'unknown' }}</a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" @click="openDetail(record)">
                <template #icon><EyeOutlined /></template>
                查看
              </a-button>
              <a-button v-if="canManageAgent" type="link" @click="openEdit(record)">编辑</a-button>
              <a-dropdown v-if="canManageAgent">
                <a class="ant-dropdown-link" @click.prevent>状态</a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleChangeStatus(record, 'active')">设为可接单</a-menu-item>
                    <a-menu-item @click="handleChangeStatus(record, 'maintenance')">设为维护中</a-menu-item>
                    <a-menu-item @click="handleChangeStatus(record, 'disabled')">设为已禁用</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-drawer v-model:open="detailVisible" width="720" title="Agent 详情" @close="closeDetail">
      <a-spin :spinning="detailLoading">
        <template v-if="detail">
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Agent</div>
              <div class="detail-value">{{ detail.name }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">编码</div>
              <div class="detail-value">{{ detail.agent_code }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">环境</div>
              <div class="detail-value">{{ detail.environment_code || '-' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">工作目录</div>
              <div class="detail-value">{{ detail.work_dir }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">主机名</div>
              <div class="detail-value">{{ detail.hostname || '-' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">主机 IP</div>
              <div class="detail-value">{{ detail.host_ip || '-' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">运行态</div>
              <div class="detail-value"><a-tag :color="runtimeTagColor(detail.runtime_state)">{{ runtimeText(detail.runtime_state) }}</a-tag></div>
            </div>
            <div class="detail-item">
              <div class="detail-label">接单态</div>
              <div class="detail-value"><a-tag :color="statusTagColor(detail.status)">{{ statusText(detail.status) }}</a-tag></div>
            </div>
            <div class="detail-item detail-item-full">
              <div class="detail-label">当前任务</div>
              <div class="detail-value">{{ detail.current_task_name || detail.current_task_id || '当前空闲' }}</div>
            </div>
            <div class="detail-item detail-item-full">
              <div class="detail-label">当前常驻任务</div>
              <div class="detail-value">
                <a-space v-if="detail.current_resident_task_id" size="small">
                  <span>{{ detail.current_resident_task_name || detail.current_resident_task_id }}</span>
                  <a-tag :color="taskStatusColor(detail.current_resident_task_status || 'pending')">
                    {{ taskStatusText(detail.current_resident_task_status || 'pending') }}
                  </a-tag>
                </a-space>
                <span v-else class="muted-text">未分配常驻任务</span>
              </div>
            </div>
            <div class="detail-item detail-item-full">
              <div class="detail-label">最近结果</div>
              <div class="detail-value">{{ detail.last_task_status }} {{ detail.last_task_summary ? `· ${detail.last_task_summary}` : '' }}</div>
            </div>
            <div class="detail-item detail-item-full">
              <div class="detail-label">标签</div>
              <div class="detail-value">
                <a-space wrap>
                  <a-tag v-for="item in detail.tags" :key="item">{{ item }}</a-tag>
                  <span v-if="!detail.tags.length" class="muted-text">暂无标签</span>
                </a-space>
              </div>
            </div>
            <div class="detail-item detail-item-full">
              <div class="detail-label">Token</div>
              <div class="detail-value token-row">
                <code>{{ detail.token || '创建后未返回 token' }}</code>
                <a-space>
                  <a-button size="small" @click="copyToken(detail.token)">
                    <template #icon><CopyOutlined /></template>
                    复制 Token
                  </a-button>
                  <a-button v-if="canManageAgent" size="small" :loading="resettingToken" @click="handleResetToken">
                    <template #icon><KeyOutlined /></template>
                    重置 Token
                  </a-button>
                </a-space>
              </div>
            </div>
            <div class="detail-item detail-item-full">
              <div class="detail-label">安装配置</div>
              <div class="config-card">
                <div class="config-meta">
                  <div>
                    <div class="config-label">建议路径</div>
                    <div class="config-value">{{ installConfig?.suggested_path || '-' }}</div>
                  </div>
                  <div>
                    <div class="config-label">启动命令</div>
                    <div class="config-value">{{ installConfig?.launch_command || '-' }}</div>
                  </div>
                </div>
                <a-spin :spinning="configLoading">
                  <pre class="config-preview">{{ installConfig?.config_yaml || '配置生成中…' }}</pre>
                </a-spin>
                <div class="config-actions">
                  <a-button size="small" @click="copyConfigYAML(installConfig?.config_yaml)">
                    <template #icon><CopyOutlined /></template>
                    复制配置文件
                  </a-button>
                </div>
              </div>
            </div>
            <div class="detail-item detail-item-full">
              <div class="detail-label tasks-header">
                <span>最近任务</span>
                <a-space>
                  <a-button size="small" @click="detail?.id && loadTasks(detail.id)">
                    <template #icon><ReloadOutlined /></template>
                    刷新任务
                  </a-button>
                  <a-button size="small" @click="goToTaskManagement">
                    前往任务管理
                  </a-button>
                </a-space>
              </div>
              <a-spin :spinning="taskLoading">
                <div class="task-sections" v-if="taskList.length">
                  <div class="task-section">
                    <div class="task-section-title">常驻任务</div>
                    <div class="task-list" v-if="residentTasks.length">
                      <div v-for="item in residentTasks" :key="item.id" class="task-item resident-task-item">
                        <div class="task-item-head">
                          <div>
                            <div class="task-name-row">
                              <div class="task-name">{{ item.name }}</div>
                              <a-tag color="purple">{{ taskModeText(item.task_mode) }}</a-tag>
                              <a-tag>{{ taskTypeText(item.task_type) }}</a-tag>
                            </div>
                            <div class="muted-text">{{ item.script_name || '未命名脚本' }} · {{ formatTime(item.created_at) }}</div>
                          </div>
                          <a-space>
                            <a-tag :color="residentRuntimeColor(item)">{{ residentRuntimeText(item) }}</a-tag>
                            <a-button
                              v-if="canManageAgent && item.status !== 'cancelled'"
                              size="small"
                              danger
                              @click="handleStopResidentTask(item)"
                            >
                              停止
                            </a-button>
                            <a-button
                              v-if="canManageAgent && item.status === 'cancelled'"
                              size="small"
                              type="primary"
                              @click="handleResumeResidentTask(item)"
                            >
                              重新启用
                            </a-button>
                            <a-button
                              v-if="canManageAgent && item.status !== 'running' && item.status !== 'claimed'"
                              size="small"
                              danger
                              @click="handleDeleteResidentTask(item)"
                            >
                              删除
                            </a-button>
                          </a-space>
                        </div>
                        <div class="task-meta">
                          <span>目录：{{ item.work_dir }}</span>
                          <span>脚本：{{ item.script_name || item.script_path || '-' }}</span>
                          <span>超时：{{ item.timeout_sec }}s</span>
                          <span>最近结果：{{ lastRunStatusText(item.last_run_status) }}</span>
                        </div>
                        <div class="resident-progress-card">
                          <div class="resident-progress-head">
                            <span>执行进度</span>
                            <span class="muted-text">{{ item.run_count ? `累计 ${item.run_count} 次` : '尚未执行' }}</span>
                          </div>
                          <a-progress :percent="residentSuccessPercent(item)" :show-info="false" size="small" />
                          <div class="resident-progress-stats">
                            <span>成功 {{ item.success_count }}</span>
                            <span>失败 {{ item.failure_count }}</span>
                            <span v-if="item.finished_at">最近结束 {{ formatTime(item.finished_at) }}</span>
                          </div>
                        </div>
                        <div class="task-meta task-meta-secondary">
                          <span v-if="item.claimed_at">领取：{{ formatTime(item.claimed_at) }}</span>
                          <span v-if="item.started_at">开始：{{ formatTime(item.started_at) }}</span>
                          <span v-if="item.finished_at">结束：{{ formatTime(item.finished_at) }}</span>
                        </div>
                        <div v-if="item.last_run_summary" class="task-summary">{{ item.last_run_summary }}</div>
                        <div v-if="item.failure_reason" class="task-error">{{ item.failure_reason }}</div>
                        <div v-if="item.stdout_text || item.stderr_text" class="task-output-grid">
                          <div v-if="item.stdout_text" class="task-output-card">
                            <div class="task-output-title">标准输出</div>
                            <pre class="task-log">{{ item.stdout_text }}</pre>
                          </div>
                          <div v-if="item.stderr_text" class="task-output-card task-output-card-error">
                            <div class="task-output-title">标准错误</div>
                            <pre class="task-log task-log-error">{{ item.stderr_text }}</pre>
                          </div>
                        </div>
                        <div v-else class="muted-text task-empty-output">暂无执行回显</div>
                      </div>
                    </div>
                    <a-empty v-else description="暂无常驻任务" />
                  </div>

                  <div class="task-section">
                    <div class="task-section-title">临时任务</div>
                    <div class="task-list" v-if="temporaryTasks.length">
                      <div v-for="item in temporaryTasks" :key="item.id" class="task-item">
                        <div class="task-item-head">
                          <div>
                            <div class="task-name-row">
                              <div class="task-name">{{ item.name }}</div>
                              <a-tag>{{ taskModeText(item.task_mode) }}</a-tag>
                              <a-tag>{{ taskTypeText(item.task_type) }}</a-tag>
                            </div>
                            <div class="muted-text">{{ item.script_name || item.script_path || '-' }} · {{ formatTime(item.created_at) }}</div>
                          </div>
                          <a-tag :color="taskStatusColor(item.status)">{{ taskStatusText(item.status) }}</a-tag>
                        </div>
                        <div class="task-meta">
                          <span>目录：{{ item.work_dir }}</span>
                          <span>超时：{{ item.timeout_sec }}s</span>
                          <span>退出码：{{ item.exit_code }}</span>
                        </div>
                        <div class="task-meta task-meta-secondary">
                          <span v-if="item.claimed_at">领取：{{ formatTime(item.claimed_at) }}</span>
                          <span v-if="item.started_at">开始：{{ formatTime(item.started_at) }}</span>
                          <span v-if="item.finished_at">结束：{{ formatTime(item.finished_at) }}</span>
                        </div>
                        <div v-if="item.failure_reason" class="task-error">{{ item.failure_reason }}</div>
                        <div v-if="item.stdout_text || item.stderr_text" class="task-output-grid">
                          <div v-if="item.stdout_text" class="task-output-card">
                            <div class="task-output-title">标准输出</div>
                            <pre class="task-log">{{ item.stdout_text }}</pre>
                          </div>
                          <div v-if="item.stderr_text" class="task-output-card task-output-card-error">
                            <div class="task-output-title">标准错误</div>
                            <pre class="task-log task-log-error">{{ item.stderr_text }}</pre>
                          </div>
                        </div>
                        <div v-else class="muted-text task-empty-output">暂无执行回显</div>
                      </div>
                    </div>
                    <a-empty v-else description="暂无临时任务" />
                  </div>
                </div>
                <a-empty v-else description="暂无任务记录" />
              </a-spin>
            </div>
          </div>
        </template>
      </a-spin>
    </a-drawer>

    <a-modal
      v-model:open="modalVisible"
      :title="editingAgentID ? '编辑 Agent' : '新增 Agent'"
      :confirm-loading="saving"
      width="720"
      @ok="handleSave"
      @cancel="closeModal"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Agent 编码" required>
              <a-input v-model:value="form.agent_code" :disabled="Boolean(editingAgentID)" placeholder="例如 prod-agent-01" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Agent 名称" required>
              <a-input v-model:value="form.name" placeholder="用于页面展示" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="环境标识">
              <a-input v-model:value="form.environment_code" placeholder="例如 prod / special-prod" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="接单状态">
              <a-select v-model:value="form.status">
                <a-select-option value="active">可接单</a-select-option>
                <a-select-option value="maintenance">维护中</a-select-option>
                <a-select-option value="disabled">已禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工作目录" required>
              <a-input v-model:value="form.work_dir" placeholder="例如 /opt/gos-agent/work" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="安装凭证">
              <a-alert
                type="info"
                show-icon
                message="Token 由平台自动生成"
                description="保存后请到详情页复制配置文件，并写入目标主机上的 Agent 配置。"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="标签">
              <a-input v-model:value="tagsText" placeholder="逗号分隔，例如 prod, java, ecs" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="备注">
              <a-textarea v-model:value="form.remark" :rows="3" placeholder="记录主机用途、职责范围或特殊限制" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <a-modal
      v-model:open="dispatchVisible"
      title="下发任务"
      :confirm-loading="dispatchLoading"
      ok-text="下发"
      cancel-text="取消"
      @ok="handleDispatchTask"
      @cancel="closeDispatchModal"
    >
      <div class="dispatch-copy">
        已选 Agent：{{ selectedDispatchAgents.length }} 台
      </div>
      <a-space wrap class="dispatch-agent-tags">
        <a-tag v-for="item in selectedDispatchAgents" :key="item.id">{{ item.name || item.agent_code }}</a-tag>
      </a-space>
      <a-form layout="vertical">
        <a-form-item label="选择任务" required>
          <a-select
            v-model:value="selectedDispatchTaskID"
            show-search
            allow-clear
            placeholder="请选择要下发的任务"
            :options="dispatchTaskOptions"
            :filter-option="(input: string, option: any) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())"
          />
        </a-form-item>
        <div v-if="selectedDispatchTask" class="selected-task-card">
          <div class="selected-task-head">
            <div>
              <div class="selected-task-title">{{ selectedDispatchTask.name }}</div>
              <div class="muted-text">
                {{ taskModeText(selectedDispatchTask.task_mode) }} · {{ taskTypeText(selectedDispatchTask.task_type) }} · 来源 {{ selectedDispatchTask.agent_code || '未分配任务' }}
              </div>
            </div>
            <a-tag :color="taskStatusColor(selectedDispatchTask.status)">{{ taskStatusText(selectedDispatchTask.status) }}</a-tag>
          </div>
          <div class="task-meta">
            <span>目录：{{ selectedDispatchTask.work_dir || '-' }}</span>
            <span>脚本：{{ selectedDispatchTask.script_name || selectedDispatchTask.script_path || '-' }}</span>
            <span>超时：{{ selectedDispatchTask.timeout_sec }}s</span>
          </div>
          <a-textarea :value="selectedDispatchTask.script_text" :rows="10" readonly />
        </div>
      </a-form>
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

.agent-primary {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agent-name {
  font-weight: 600;
}

.agent-meta,
.muted-text {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.detail-item {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.88);
}

.detail-item-full {
  grid-column: 1 / -1;
}

.detail-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  margin-bottom: 8px;
}

.detail-value {
  color: var(--color-text-main);
  font-weight: 600;
  word-break: break-all;
}

.token-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.config-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.config-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  margin-bottom: 6px;
}

.config-value {
  color: var(--color-text-main);
  font-size: 13px;
  font-weight: 600;
  word-break: break-all;
}

.config-preview {
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  line-height: 1.7;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.config-actions {
  display: flex;
  justify-content: flex-end;
}

.tasks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-main);
}

.task-item {
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 14px 16px;
  background: var(--color-bg-card);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.task-name {
  font-weight: 600;
  color: var(--color-text-main);
}

.task-name-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.task-meta-secondary {
  color: var(--color-text-muted);
}

.task-error {
  color: var(--color-danger);
  background: var(--color-danger-bg);
  border: 1px solid rgba(220, 38, 38, 0.16);
  border-radius: 12px;
  padding: 10px 12px;
}

.task-output-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.task-output-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
}

.task-output-card-error {
  border-color: rgba(220, 38, 38, 0.16);
  background: #fff7f7;
}

.task-output-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.task-log {
  margin: 0;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}

.task-log-error {
  color: #fecaca;
}

.task-empty-output,
.task-summary {
  font-size: 12px;
}

.resident-task-item {
  border-color: rgba(59, 130, 246, 0.16);
}

.resident-progress-card {
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resident-progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.resident-progress-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

@media (max-width: 900px) {
  .page-header,
  .task-item-head,
  .tasks-header,
  .token-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-grid,
  .config-meta {
    grid-template-columns: 1fr;
  }
}
</style>
