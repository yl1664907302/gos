<script setup lang="ts">
import { EyeOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { createAgentTask, createUnassignedAgentTask, listAgents, listAgentScripts, listAllAgentTasks } from '../../api/agent'
import { listPlatformParamDicts } from '../../api/platform-param'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import type {
  AgentInstance,
  AgentScript,
  AgentTask,
  AgentTaskMode,
  AgentTaskType,
  CreateAgentTaskPayload,
} from '../../types/agent'
import type { PlatformParamDict } from '../../types/platform-param'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface TaskVariableFormItem {
  id: string
  key_mode: 'platform' | 'custom'
  platform_key: string
  custom_key: string
  value: string
}

interface AgentTaskViewItem extends AgentTask {
  agent_name: string
  agent_code_display: string
  agent_environment_code: string
  resident_assigned_count?: number
  resident_running_count?: number
  resident_queued_count?: number
  resident_claimed_count?: number
  resident_pending_count?: number
  resident_cancelled_count?: number
}

const authStore = useAuthStore()
const router = useRouter()
const AUTO_REFRESH_INTERVAL = 15000

const loadingAgents = ref(false)
const refreshingTasks = ref(false)
const savingTask = ref(false)
const createTaskVisible = ref(false)
const previewTaskVisible = ref(false)
const dataSource = ref<AgentInstance[]>([])
const scriptOptions = ref<AgentScript[]>([])
const platformParamOptions = ref<PlatformParamDict[]>([])
const taskVariables = ref<TaskVariableFormItem[]>([])
const selectedScriptID = ref('')
const residentTaskList = ref<AgentTaskViewItem[]>([])
const historyTaskList = ref<AgentTaskViewItem[]>([])
const previewTask = ref<AgentTaskViewItem | null>(null)
let autoRefreshTimer: number | null = null
const historyFilters = reactive({
  agent_id: '',
  agent_keyword: '',
  page: 1,
  page_size: 10,
})

const taskForm = reactive<CreateAgentTaskPayload>({
  name: '',
  task_mode: 'temporary',
  task_type: 'shell_task',
  shell_type: 'sh',
  work_dir: '',
  script_id: '',
  script_path: '',
  script_text: '',
  variables: {},
  timeout_sec: 300,
})
const taskTargetAgentIDs = ref<string[]>([])

const canManageAgent = computed(() => authStore.hasPermission('component.agent.manage'))
const canViewAgent = computed(() => canManageAgent.value || authStore.hasPermission('component.agent.view'))
const taskTargetOptions = computed(() =>
  dataSource.value.map((item) => ({
    value: item.id,
    label: `${item.name || item.agent_code} · ${item.environment_code || '未设置环境'} · ${item.work_dir}`,
  })),
)
const selectedTaskAgents = computed(() =>
  taskTargetAgentIDs.value
    .map((id) => dataSource.value.find((item) => item.id === id))
    .filter((item): item is AgentInstance => Boolean(item)),
)
const selectedAgentNames = computed(() => selectedTaskAgents.value.map((item) => item.name || item.agent_code))
const selectedAgentWorkDirs = computed(() => Array.from(new Set(selectedTaskAgents.value.map((item) => item.work_dir).filter(Boolean))))
const selectedScript = computed(() => scriptOptions.value.find((item) => item.id === selectedScriptID.value) || null)
const hasUnassignedHistoryTasks = computed(() => historyTaskList.value.some((item) => !item.agent_id))
const historyAgentOptions = computed(() => {
  const options = dataSource.value.map((item) => ({
    value: item.id,
    label: `${item.name || item.agent_code} · ${item.environment_code || '未设置环境'}`,
  }))
  if (hasUnassignedHistoryTasks.value) {
    options.unshift({ value: '__unassigned__', label: '未分配任务' })
  }
  return options
})
const filteredHistoryTaskList = computed(() => {
  const keyword = historyFilters.agent_keyword.trim().toLowerCase()
  return historyTaskList.value.filter((item) => {
    const agentMatched =
      !historyFilters.agent_id ||
      (historyFilters.agent_id === '__unassigned__' ? !item.agent_id : item.agent_id === historyFilters.agent_id)
    if (!agentMatched) {
      return false
    }
    if (!keyword) {
      return true
    }
    return String(item.agent_name || '').toLowerCase().includes(keyword) || String(item.agent_code_display || '').toLowerCase().includes(keyword)
  })
})
const pagedHistoryTaskList = computed(() => {
  const start = (historyFilters.page - 1) * historyFilters.page_size
  return filteredHistoryTaskList.value.slice(start, start + historyFilters.page_size)
})

function createTaskVariableItem(): TaskVariableFormItem {
  return {
    id: `var-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    key_mode: 'platform',
    platform_key: '',
    custom_key: '',
    value: '',
  }
}

function resetTaskForm() {
  taskForm.name = ''
  taskForm.task_mode = 'temporary'
  taskForm.task_type = 'shell_task'
  taskForm.shell_type = 'sh'
  taskForm.work_dir = ''
  taskForm.script_id = ''
  taskForm.script_path = ''
  taskForm.script_text = ''
  taskForm.variables = {}
  taskForm.timeout_sec = 300
  taskTargetAgentIDs.value = []
  selectedScriptID.value = ''
  taskVariables.value = [createTaskVariableItem()]
}

function openCreateTaskModal() {
  createTaskVisible.value = true
}

function closeCreateTaskModal() {
  createTaskVisible.value = false
}

function openTaskPreview(item: AgentTaskViewItem) {
  previewTask.value = item
  previewTaskVisible.value = true
}

function closeTaskPreview() {
  previewTaskVisible.value = false
}

function goToAgentManagement() {
  createTaskVisible.value = false
  void router.push('/components/agents')
}

function normalizeAgents(rows: AgentInstance[]) {
  rows.forEach((item) => {
    // 缓存项无需额外处理，这里预留做展示映射。
    void item
  })
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

function taskPreviewTitle(task: AgentTask | null) {
  if (!task) {
    return '任务内容预览'
  }
  return `${task.name} · 任务内容预览`
}

function taskContentLabel(task: AgentTask | null) {
  if (!task) {
    return '脚本内容'
  }
  return task.task_type === 'file_distribution_task' ? '文件内容' : '脚本内容'
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

function taskVariableSignature(variables?: Record<string, string>) {
  const entries = Object.entries(variables || {}).sort(([a], [b]) => a.localeCompare(b))
  return JSON.stringify(entries)
}

function residentTaskSignature(task: AgentTask) {
  return [
    task.name || '',
    task.task_type || '',
    task.shell_type || '',
    task.script_id || '',
    task.script_name || '',
    task.script_path || '',
    task.script_text || '',
    taskVariableSignature(task.variables),
  ].join('::')
}

function residentRuntimeText(task: AgentTask) {
  const runningCount = Number((task as AgentTaskViewItem).resident_running_count || 0)
  const queuedCount = Number((task as AgentTaskViewItem).resident_queued_count || 0)
  const claimedCount = Number((task as AgentTaskViewItem).resident_claimed_count || 0)
  const pendingCount = Number((task as AgentTaskViewItem).resident_pending_count || 0)
  const assignedCount = Number((task as AgentTaskViewItem).resident_assigned_count || 0)
  const cancelledCount = Number((task as AgentTaskViewItem).resident_cancelled_count || 0)
  if (runningCount > 0) {
    return '执行中'
  }
  if (claimedCount > 0) {
    return '准备执行'
  }
  if (queuedCount > 0) {
    return '排队中'
  }
  if (assignedCount === 0) {
    return '未分发'
  }
  if (cancelledCount === assignedCount) {
    return '已停止'
  }
  if (pendingCount > 0) {
    return '待下一轮'
  }
  if (task.status === 'running') {
    return '执行中'
  }
  if (task.status === 'claimed') {
    return '准备执行'
  }
  if (task.status === 'queued') {
    return '排队中'
  }
  if (task.status === 'cancelled') {
    return '已停止'
  }
  if ((task.run_count || 0) > 0) {
    return '待下一轮'
  }
  return '待首次执行'
}

function residentRuntimeColor(task: AgentTask) {
  const runningCount = Number((task as AgentTaskViewItem).resident_running_count || 0)
  const queuedCount = Number((task as AgentTaskViewItem).resident_queued_count || 0)
  const claimedCount = Number((task as AgentTaskViewItem).resident_claimed_count || 0)
  const assignedCount = Number((task as AgentTaskViewItem).resident_assigned_count || 0)
  const cancelledCount = Number((task as AgentTaskViewItem).resident_cancelled_count || 0)
  const pendingCount = Number((task as AgentTaskViewItem).resident_pending_count || 0)
  if (runningCount > 0) {
    return 'blue'
  }
  if (claimedCount > 0) {
    return 'gold'
  }
  if (queuedCount > 0) {
    return 'orange'
  }
  if (assignedCount === 0 || cancelledCount === assignedCount) {
    return 'default'
  }
  if (pendingCount > 0) {
    return 'green'
  }
  if (task.status === 'running') {
    return 'blue'
  }
  if (task.status === 'claimed') {
    return 'gold'
  }
  if (task.status === 'queued') {
    return 'orange'
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

function formatTime(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

function platformParamLabel(paramKey: string) {
  const matched = platformParamOptions.value.find((item) => item.param_key === paramKey)
  if (!matched) {
    return paramKey
  }
  return `${matched.name} (${matched.param_key})`
}

function resolvedVariableKey(item: TaskVariableFormItem) {
  return item.key_mode === 'platform' ? item.platform_key.trim() : item.custom_key.trim()
}

function addTaskVariable() {
  taskVariables.value.push(createTaskVariableItem())
}

function handleVariableModeChange(item: TaskVariableFormItem, mode: 'platform' | 'custom') {
  item.key_mode = mode
  if (mode === 'platform') {
    item.custom_key = ''
  } else {
    item.platform_key = ''
  }
}

function removeTaskVariable(id: string) {
  if (taskVariables.value.length <= 1) {
    taskVariables.value = [createTaskVariableItem()]
    return
  }
  taskVariables.value = taskVariables.value.filter((item) => item.id !== id)
}

function serializeTaskVariables(): Record<string, string> {
  const result: Record<string, string> = {}
  for (const item of taskVariables.value) {
    const key = resolvedVariableKey(item)
    const value = String(item.value || '').trim()
    if (!key && !value) {
      continue
    }
    if (!key) {
      throw new Error('请补全变量 Key')
    }
    if (!value) {
      throw new Error(`请填写变量 ${platformParamLabel(key)} 的值`)
    }
    if (result[key] !== undefined) {
      throw new Error(`变量 ${platformParamLabel(key)} 重复，请检查配置`)
    }
    result[key] = value
  }
  return result
}

function handleSelectManagedScript(scriptID: string) {
  selectedScriptID.value = scriptID
  const matched = scriptOptions.value.find((item) => item.id === scriptID)
  if (!matched) {
    return
  }
  taskForm.script_id = matched.id
  taskForm.task_type = matched.task_type
  taskForm.shell_type = matched.shell_type || 'sh'
  taskForm.script_path = matched.script_path || ''
  taskForm.script_text = matched.script_text || ''
  if (!String(taskForm.name || '').trim()) {
    taskForm.name = matched.name
  }
}

function clearManagedScript() {
  selectedScriptID.value = ''
  taskForm.script_id = ''
  taskForm.task_type = 'shell_task'
  taskForm.shell_type = 'sh'
  taskForm.script_path = ''
  taskForm.script_text = ''
}

async function loadAgents(options: { silent?: boolean } = {}) {
  if (!canViewAgent.value) {
    return
  }
  if (!options.silent) {
    loadingAgents.value = true
  }
  try {
    const response = await listAgents({ page: 1, page_size: 200 })
    dataSource.value = response.data
    normalizeAgents(response.data)
    if (!response.data.length) {
      historyFilters.agent_id = ''
    } else if (
      historyFilters.agent_id &&
      historyFilters.agent_id !== '__unassigned__' &&
      !response.data.some((item) => item.id === historyFilters.agent_id)
    ) {
      historyFilters.agent_id = ''
    }
    taskTargetAgentIDs.value = taskTargetAgentIDs.value.filter((id) => response.data.some((item) => item.id === id))
  } catch (error) {
    if (!options.silent) {
      message.error(extractHTTPErrorMessage(error, 'Agent 列表加载失败'))
    }
  } finally {
    if (!options.silent) {
      loadingAgents.value = false
    }
  }
}

async function loadPlatformParamOptions() {
  try {
    const response = await listPlatformParamDicts({ page: 1, page_size: 300, status: 1 })
    platformParamOptions.value = response.data
  } catch {
    platformParamOptions.value = []
  }
}

async function loadScriptOptions() {
  try {
    const response = await listAgentScripts({ page: 1, page_size: 200 })
    scriptOptions.value = response.data
  } catch {
    scriptOptions.value = []
  }
}

async function loadTaskViews(options: { silent?: boolean } = {}) {
  if (!canViewAgent.value) {
    return
  }
  if (!options.silent) {
    refreshingTasks.value = true
  }
  try {
    const response = await listAllAgentTasks({ page: 1, page_size: 300 })
    const allTasks = response.data
      .map<AgentTaskViewItem>((task) => {
        const matchedAgent = dataSource.value.find((item) => item.id === task.agent_id)
        return {
          ...task,
          agent_name: matchedAgent?.name || task.agent_code || '未分配',
          agent_code_display: matchedAgent?.agent_code || task.agent_code || '未分配',
          agent_environment_code: matchedAgent?.environment_code || '',
        }
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    const residentTemplates = allTasks.filter((item) => item.task_mode === 'resident' && !item.agent_id)
    const residentInstances = allTasks.filter((item) => item.task_mode === 'resident' && !!item.agent_id)
    residentTaskList.value = residentTemplates.map((item) => {
      const signature = residentTaskSignature(item)
      const matchedInstances = residentInstances.filter((task) => residentTaskSignature(task) === signature)
      const latestInstance = [...matchedInstances].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]
      return {
        ...item,
        resident_assigned_count: matchedInstances.length,
        resident_running_count: matchedInstances.filter((task) => task.status === 'running').length,
        resident_queued_count: matchedInstances.filter((task) => task.status === 'queued').length,
        resident_claimed_count: matchedInstances.filter((task) => task.status === 'claimed').length,
        resident_pending_count: matchedInstances.filter((task) => task.status === 'pending').length,
        resident_cancelled_count: matchedInstances.filter((task) => task.status === 'cancelled').length,
        run_count: matchedInstances.length ? matchedInstances.reduce((sum, task) => sum + Number(task.run_count || 0), 0) : item.run_count,
        success_count: matchedInstances.length ? matchedInstances.reduce((sum, task) => sum + Number(task.success_count || 0), 0) : item.success_count,
        failure_count: matchedInstances.length ? matchedInstances.reduce((sum, task) => sum + Number(task.failure_count || 0), 0) : item.failure_count,
        last_run_status: latestInstance?.last_run_status || latestInstance?.status || item.last_run_status,
        last_run_summary: latestInstance?.last_run_summary || latestInstance?.failure_reason || item.last_run_summary,
        failure_reason: latestInstance?.failure_reason || item.failure_reason,
        finished_at: latestInstance?.finished_at || item.finished_at,
        started_at: latestInstance?.started_at || item.started_at,
        claimed_at: latestInstance?.claimed_at || item.claimed_at,
      }
    })
    historyTaskList.value = allTasks.filter((item) => item.task_mode !== 'resident')
  } catch (error) {
    if (!options.silent) {
      message.error(extractHTTPErrorMessage(error, '任务视图加载失败'))
    }
  } finally {
    if (!options.silent) {
      refreshingTasks.value = false
    }
  }
}

async function handleCreateTask() {
  savingTask.value = true
  try {
    if (!selectedScriptID.value) {
      throw new Error('请选择脚本管理中的脚本')
    }
    if (!String(taskForm.script_text || '').trim()) {
      throw new Error('当前脚本内容为空，请重新选择脚本')
    }
    const payload: CreateAgentTaskPayload = {
      name: taskForm.name,
      task_mode: taskForm.task_mode || 'temporary',
      task_type: taskForm.task_type || 'shell_task',
      shell_type: taskForm.shell_type || 'sh',
      work_dir: taskForm.work_dir,
      script_id: selectedScriptID.value,
      script_path: taskForm.script_path,
      script_text: taskForm.script_text,
      variables: serializeTaskVariables(),
      timeout_sec: taskForm.timeout_sec,
    }
    if (!taskTargetAgentIDs.value.length) {
      await createUnassignedAgentTask(payload)
      historyFilters.agent_id = '__unassigned__'
      message.success('任务已创建；后续可在 Agent 管理页面进行分发')
    } else {
      const results = await Promise.allSettled(taskTargetAgentIDs.value.map((agentID) => createAgentTask(agentID, payload)))
      const failed = results.filter((item) => item.status === 'rejected') as PromiseRejectedResult[]
      if (failed.length) {
        const firstMessage = extractHTTPErrorMessage(failed[0].reason, '批量下发任务失败')
        throw new Error(taskTargetAgentIDs.value.length === failed.length ? firstMessage : `部分 Agent 下发失败：${firstMessage}`)
      }
      message.success(`任务已下发到 ${taskTargetAgentIDs.value.length} 台 Agent，等待 Agent 轮询领取`)
    }
    resetTaskForm()
    createTaskVisible.value = false
    await loadTaskViews({ silent: true })
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, error instanceof Error ? error.message : '创建任务失败'))
  } finally {
    savingTask.value = false
  }
}

function applyHistoryFilter() {
  historyFilters.page = 1
}

function resetHistoryFilter() {
  historyFilters.agent_id = ''
  historyFilters.agent_keyword = ''
  historyFilters.page = 1
}

function handleHistoryPageChange(page: number, pageSize: number) {
  historyFilters.page = page
  historyFilters.page_size = pageSize
}

watch(
  () => filteredHistoryTaskList.value.length,
  (total) => {
    const maxPage = Math.max(1, Math.ceil(total / historyFilters.page_size))
    if (historyFilters.page > maxPage) {
      historyFilters.page = maxPage
    }
  },
)

async function runAutoRefresh() {
  if (document.hidden || !canViewAgent.value) {
    return
  }
  await loadAgents({ silent: true })
  await loadTaskViews({ silent: true })
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

onMounted(async () => {
  resetTaskForm()
  await Promise.all([loadAgents(), loadPlatformParamOptions(), loadScriptOptions()])
  await loadTaskViews()
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
          <div class="page-title">Agent任务管理</div>
          <div class="page-subtitle">以任务为中心统一下发脚本，下面分别查看常驻任务和历史任务；已分配常驻任务的启停请回到 Agent 管理。</div>
        </div>
        <a-space>
          <a-button type="primary" @click="openCreateTaskModal">
            <template #icon><PlusOutlined /></template>
            新增任务
          </a-button>
          <a-button @click="loadAgents(); loadTaskViews()" :loading="loadingAgents || refreshingTasks">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
        </a-space>
    </div>

    <a-modal
      v-model:open="createTaskVisible"
      title="新增任务"
      :width="860"
      :confirm-loading="savingTask"
      ok-text="创建"
      cancel-text="取消"
      @ok="handleCreateTask"
      @cancel="closeCreateTaskModal"
    >
      <div class="task-panel-subtitle modal-subtitle">先配置任务；目标 Agent 可选。如果要面向多台 Agent 批量下发，建议前往 Agent 管理页面操作。</div>
      <a-form layout="vertical" class="task-create-form">
        <a-form-item label="目标 Agent">
          <div class="task-target-card">
            <a-select
              v-model:value="taskTargetAgentIDs"
              mode="multiple"
              allow-clear
              show-search
              placeholder="请选择要下发任务的 Agent"
              :options="taskTargetOptions"
              :filter-option="(input: string, option: any) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())"
            />
            <a-space wrap>
              <a-tag v-for="name in selectedAgentNames" :key="name">{{ name }}</a-tag>
            </a-space>
            <div v-if="selectedAgentWorkDirs.length > 1" class="task-variable-tip">
              已选择的 Agent 工作目录不一致，如需覆盖请手动填写下方工作目录；留空则各 Agent 使用自己的默认工作目录。
            </div>
            <div class="task-variable-tip">
              不选也可以先整理任务内容；若需要批量下发，推荐前往 Agent 管理页进行分发。
              <a-button type="link" size="small" class="task-tip-link" @click="goToAgentManagement">前往 Agent 管理</a-button>
            </div>
          </div>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="任务名称" required>
              <a-input v-model:value="taskForm.name" placeholder="例如：版本检查、下载产物" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="任务模式" required>
              <a-select v-model:value="taskForm.task_mode">
                <a-select-option value="temporary">临时任务</a-select-option>
                <a-select-option value="resident">常驻任务</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="选择脚本" required>
          <a-select
            :value="selectedScriptID || undefined"
            allow-clear
            show-search
            placeholder="请选择脚本管理中的脚本"
            :filter-option="(input: string, option: any) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())"
            :options="scriptOptions.map((item) => ({ value: item.id, label: `${item.name} · ${taskTypeText(item.task_type as AgentTaskType)}${item.script_path ? ` · ${item.script_path}` : ''}` }))"
            @update:value="(value) => value ? handleSelectManagedScript(String(value)) : clearManagedScript()"
          />
        </a-form-item>

        <div v-if="selectedScript" class="selected-script-card">
          <div class="selected-script-head">
            <div>
              <div class="selected-script-title">{{ selectedScript.name }}</div>
              <div class="muted-text">{{ selectedScript.description || '暂无脚本说明' }}</div>
            </div>
            <a-tag>{{ taskTypeText(selectedScript.task_type as AgentTaskType) }}</a-tag>
          </div>
          <div class="selected-script-meta">
            <span>Shell：{{ selectedScript.shell_type || '-' }}</span>
            <span v-if="selectedScript.script_path">脚本文件：{{ selectedScript.script_path }}</span>
          </div>
        </div>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="脚本类型">
              <a-input :value="selectedScript ? taskTypeText(selectedScript.task_type as AgentTaskType) : '-'" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Shell 类型">
              <a-input :value="selectedScript?.shell_type || '-'" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="超时时间（秒）">
              <a-input-number v-model:value="taskForm.timeout_sec" :min="10" :max="3600" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工作目录">
              <a-input v-model:value="taskForm.work_dir" placeholder="留空则使用 Agent 工作目录" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="脚本预览">
          <a-textarea :value="taskForm.script_text" :rows="10" readonly placeholder="请选择脚本后预览内容" />
        </a-form-item>

        <a-form-item label="执行变量">
          <div class="task-variable-panel">
            <div class="task-variable-tip">
              选择脚本后，同样支持标准平台 Key 变量；脚本里直接写 <code>{env}</code> 这样的占位符即可。
            </div>
            <div class="task-variable-list-editor">
              <div v-for="item in taskVariables" :key="item.id" class="task-variable-row">
                <a-select
                  :value="item.key_mode"
                  class="task-variable-mode"
                  @update:value="(value) => handleVariableModeChange(item, value as 'platform' | 'custom')"
                >
                  <a-select-option value="platform">标准平台 Key</a-select-option>
                  <a-select-option value="custom">自定义变量</a-select-option>
                </a-select>
                <a-select
                  v-if="item.key_mode === 'platform'"
                  v-model:value="item.platform_key"
                  class="task-variable-key"
                  show-search
                  allow-clear
                  placeholder="选择标准平台 Key"
                  :filter-option="(input: string, option: any) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())"
                  :options="platformParamOptions.map((option) => ({ value: option.param_key, label: platformParamLabel(option.param_key) }))"
                />
                <a-input v-else v-model:value="item.custom_key" class="task-variable-key" placeholder="例如 artifact_url" />
                <a-input v-model:value="item.value" class="task-variable-value" placeholder="请输入变量值" />
                <a-button type="text" danger class="task-variable-remove" @click="removeTaskVariable(item.id)">
                  移除
                </a-button>
                <div v-if="resolvedVariableKey(item)" class="task-variable-preview">
                  脚本占位符：<code>{{ '{' + resolvedVariableKey(item) + '}' }}</code>
                </div>
              </div>
            </div>
            <a-button type="dashed" block @click="addTaskVariable">
              <template #icon><PlusOutlined /></template>
              新增变量
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card class="filter-card" :bordered="false">
      <div class="task-view-toolbar">
        <div class="task-view-copy">
          <div class="task-panel-title">任务视图</div>
          <div class="task-panel-subtitle">这里展示任务管理中维护的常驻任务模板；已分配到 Agent 的运行实例请在 Agent 管理里查看。</div>
        </div>
        <a-space>
          <a-button @click="loadTaskViews" :loading="refreshingTasks">
            <template #icon><ReloadOutlined /></template>
            刷新任务
          </a-button>
        </a-space>
      </div>
    </a-card>

    <a-tabs class="task-view-tabs">
      <a-tab-pane key="resident" tab="常驻任务">
        <a-card class="table-card" :bordered="false">
          <a-spin :spinning="refreshingTasks">
            <div class="task-list" v-if="residentTaskList.length">
              <div v-for="item in residentTaskList" :key="item.id" class="task-item resident-task-item">
                <div class="task-item-head">
                  <div>
                    <div class="task-name-row">
                      <div class="task-name">{{ item.name }}</div>
                      <a-tag color="purple">{{ taskModeText(item.task_mode) }}</a-tag>
                      <a-tag>{{ taskTypeText(item.task_type) }}</a-tag>
                    </div>
                    <div class="muted-text">
                      已分发 {{ item.resident_assigned_count || 0 }} 台 Agent
                      <span v-if="item.resident_running_count"> · 执行中 {{ item.resident_running_count }}</span>
                      <span v-if="item.resident_queued_count"> · 排队中 {{ item.resident_queued_count }}</span>
                      <span v-if="item.resident_claimed_count"> · 待启动 {{ item.resident_claimed_count }}</span>
                      <span v-if="item.resident_pending_count"> · 待下一轮 {{ item.resident_pending_count }}</span>
                      <span v-if="item.resident_cancelled_count"> · 已停止 {{ item.resident_cancelled_count }}</span>
                    </div>
                  </div>
                  <a-space>
                    <a-button type="link" size="small" @click="openTaskPreview(item)">
                      <template #icon><EyeOutlined /></template>
                      预览任务
                    </a-button>
                    <a-tag :color="residentRuntimeColor(item)">{{ residentRuntimeText(item) }}</a-tag>
                  </a-space>
                </div>
                <div class="task-meta">
                  <span>目录：{{ item.work_dir }}</span>
                  <span>脚本：{{ item.script_name || item.script_path || '-' }}</span>
                  <span>超时：{{ item.timeout_sec }}s</span>
                  <span>最近结果：{{ taskStatusText(item.last_run_status || 'pending') }}</span>
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
                  <span v-if="!(item.resident_assigned_count || 0)">尚未下发到 Agent</span>
                  <span v-if="item.claimed_at">领取：{{ formatTime(item.claimed_at) }}</span>
                  <span v-if="item.started_at">开始：{{ formatTime(item.started_at) }}</span>
                  <span v-if="item.finished_at">结束：{{ formatTime(item.finished_at) }}</span>
                </div>
                <div v-if="item.last_run_summary" class="task-summary">{{ item.last_run_summary }}</div>
                <div v-if="item.failure_reason" class="task-error">{{ item.failure_reason }}</div>
                <div class="muted-text">常驻任务的停止、重新启用与删除，请在对应 Agent 的详情页里操作。</div>
              </div>
            </div>
            <a-empty v-else description="暂无常驻任务" />
          </a-spin>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="history" tab="历史任务">
        <a-card class="table-card" :bordered="false">
          <div class="history-toolbar">
            <a-space>
              <a-select
                v-model:value="historyFilters.agent_id"
                allow-clear
                style="width: 240px"
                placeholder="按 Agent 分类"
                show-search
                :options="historyAgentOptions"
                :filter-option="(input: string, option: any) => String(option?.label || '').toLowerCase().includes(input.toLowerCase())"
                @change="applyHistoryFilter"
              />
              <a-input
                v-model:value="historyFilters.agent_keyword"
                allow-clear
                placeholder="按 Agent 名称 / 编码查询"
                style="width: 260px"
                @pressEnter="applyHistoryFilter"
              />
              <a-button type="primary" @click="applyHistoryFilter">查询</a-button>
              <a-button @click="resetHistoryFilter">重置</a-button>
            </a-space>
          </div>
          <a-spin :spinning="refreshingTasks">
            <div class="task-list" v-if="pagedHistoryTaskList.length">
              <div v-for="item in pagedHistoryTaskList" :key="item.id" class="task-item">
                <div class="task-item-head">
                  <div>
                    <div class="task-name-row">
                      <div class="task-name">{{ item.name }}</div>
                      <a-tag>{{ taskModeText(item.task_mode) }}</a-tag>
                      <a-tag>{{ taskTypeText(item.task_type) }}</a-tag>
                    </div>
                    <div class="muted-text">{{ item.agent_name }} · {{ item.agent_code_display }} · {{ item.agent_environment_code || '-' }}</div>
                  </div>
                  <a-space>
                    <a-button type="link" size="small" @click="openTaskPreview(item)">
                      <template #icon><EyeOutlined /></template>
                      预览任务
                    </a-button>
                    <a-tag :color="taskStatusColor(item.status)">{{ taskStatusText(item.status) }}</a-tag>
                  </a-space>
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
            <a-empty v-else description="暂无历史任务" />
          </a-spin>
          <div v-if="filteredHistoryTaskList.length" class="history-pagination">
            <a-pagination
              :current="historyFilters.page"
              :page-size="historyFilters.page_size"
              :total="filteredHistoryTaskList.length"
              :show-size-changer="false"
              @change="handleHistoryPageChange"
            />
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      :open="previewTaskVisible"
      :title="taskPreviewTitle(previewTask)"
      :footer="null"
      :width="860"
      @cancel="closeTaskPreview"
    >
      <template v-if="previewTask">
        <div class="task-preview-meta">
          <a-tag>{{ taskModeText(previewTask.task_mode) }}</a-tag>
          <a-tag>{{ taskTypeText(previewTask.task_type) }}</a-tag>
          <span>Agent：{{ previewTask.agent_name }} · {{ previewTask.agent_code_display }}</span>
          <span>目录：{{ previewTask.work_dir || '-' }}</span>
          <span>脚本：{{ previewTask.script_name || previewTask.script_path || '-' }}</span>
        </div>

        <div v-if="Object.keys(previewTask.variables || {}).length" class="task-preview-section">
          <div class="task-output-title">变量配置</div>
          <div class="task-preview-vars">
            <a-tag v-for="(value, key) in previewTask.variables" :key="key">{{ key }} = {{ value }}</a-tag>
          </div>
        </div>

        <div class="task-preview-section">
          <div class="task-output-title">{{ taskContentLabel(previewTask) }}</div>
          <pre class="task-log">{{ previewTask.script_text || '暂无任务内容' }}</pre>
        </div>
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

.task-form-header,
.task-view-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.task-panel-title {
  color: var(--color-text-main);
  font-size: 16px;
  font-weight: 700;
}

.task-panel-subtitle {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.modal-subtitle {
  margin-bottom: 16px;
}

.task-target-card,
.selected-script-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  border: none;
  background: transparent;
}

.selected-script-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.selected-script-title {
  color: var(--color-text-main);
  font-weight: 600;
}

.selected-script-meta,
.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.task-variable-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-variable-tip {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
  padding: 0;
}

.task-tip-link {
  padding-inline: 6px;
}

.task-variable-list-editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-variable-row {
  display: grid;
  grid-template-columns: 132px minmax(0, 1.1fr) minmax(0, 1.3fr) 64px;
  gap: 10px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.task-variable-mode,
.task-variable-key,
.task-variable-value {
  width: 100%;
}

.task-variable-remove {
  justify-self: end;
  padding-inline: 0;
}

.task-variable-preview {
  grid-column: 1 / -1;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.task-view-tabs {
  margin-top: 16px;
}

.history-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.history-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.resident-task-item {
  border-color: rgba(59, 130, 246, 0.16);
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

.task-meta-secondary,
.muted-text {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.task-summary {
  color: var(--color-text-main);
  font-size: 12px;
}

.task-error {
  color: var(--color-danger);
  background: var(--color-danger-bg);
  border: 1px solid rgba(220, 38, 38, 0.16);
  border-radius: 12px;
  padding: 10px 12px;
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

.task-preview-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  margin-bottom: 16px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.task-preview-section + .task-preview-section {
  margin-top: 16px;
}

.task-preview-vars {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 900px) {
  .page-header,
  .task-form-header,
  .task-view-toolbar,
  .selected-script-head,
  .task-item-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-variable-row {
    grid-template-columns: 1fr;
  }

  .history-toolbar {
    justify-content: stretch;
  }
}
</style>
