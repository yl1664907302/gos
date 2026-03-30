<script setup lang="ts">
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import type { TableColumnsType, UploadProps } from 'ant-design-vue'
import { computed, reactive, ref } from 'vue'
import { createAgentScript, deleteAgentScript, listAgentScripts, updateAgentScript } from '../../api/agent'
import { useAuthStore } from '../../stores/auth'
import type { AgentScript, AgentScriptListParams, AgentScriptTaskType, UpsertAgentScriptPayload } from '../../types/agent'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const modalVisible = ref(false)
const editingID = ref('')
const dataSource = ref<AgentScript[]>([])
const total = ref(0)

const filters = reactive<Required<AgentScriptListParams>>({
  keyword: '',
  task_type: '',
  page: 1,
  page_size: 10,
})

const form = reactive<UpsertAgentScriptPayload>({
  name: '',
  description: '',
  task_type: 'shell_task',
  shell_type: 'sh',
  script_path: '',
  script_text: '',
})

const canManage = computed(() => authStore.hasPermission('component.agent.manage'))
const canView = computed(() => canManage.value || authStore.hasPermission('component.agent.view'))

const columns: TableColumnsType<AgentScript> = [
  { title: '脚本名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '类型', dataIndex: 'task_type', key: 'task_type', width: 140 },
  { title: 'Shell', dataIndex: 'shell_type', key: 'shell_type', width: 90 },
  { title: '脚本文件', dataIndex: 'script_path', key: 'script_path', width: 180 },
  { title: '说明', dataIndex: 'description', key: 'description', width: 260, ellipsis: true },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 180 },
  { title: '操作', key: 'actions', width: 170, fixed: 'right' },
]

function resetForm() {
  editingID.value = ''
  form.name = ''
  form.description = ''
  form.task_type = 'shell_task'
  form.shell_type = 'sh'
  form.script_path = ''
  form.script_text = ''
}

function taskTypeText(taskType: AgentScriptTaskType) {
  return taskType === 'script_file_task' ? '脚本文件' : 'Shell 脚本'
}

function formatTime(value?: string) {
  if (!value) return '-'
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

async function loadScripts() {
  if (!canView.value) return
  loading.value = true
  try {
    const response = await listAgentScripts({
      keyword: filters.keyword.trim() || undefined,
      task_type: (filters.task_type || undefined) as AgentScriptTaskType | undefined,
      page: filters.page,
      page_size: filters.page_size,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.page_size = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '脚本列表加载失败'))
  } finally {
    loading.value = false
  }
}

function openCreate() {
  resetForm()
  modalVisible.value = true
}

function openEdit(record: AgentScript) {
  editingID.value = record.id
  form.name = record.name
  form.description = record.description || ''
  form.task_type = record.task_type
  form.shell_type = record.shell_type || 'sh'
  form.script_path = record.script_path || ''
  form.script_text = record.script_text || ''
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  resetForm()
}

const uploadProps: UploadProps = {
  beforeUpload: async (file) => {
    const lowerName = String(file.name || '').toLowerCase()
    if (!(lowerName.endsWith('.sh') || lowerName.endsWith('.bash'))) {
      message.error('脚本管理仅支持上传 .sh 或 .bash 文件')
      return false
    }
    form.script_path = file.name
    form.script_text = await file.text()
    return false
  },
  showUploadList: false,
  accept: '.sh,.bash',
}

async function handleSave() {
  saving.value = true
  try {
    const payload: UpsertAgentScriptPayload = {
      name: form.name,
      description: form.description,
      task_type: form.task_type,
      shell_type: form.shell_type,
      script_path: form.task_type === 'script_file_task' ? form.script_path : '',
      script_text: form.script_text,
    }
    if (editingID.value) {
      await updateAgentScript(editingID.value, payload)
      message.success('脚本已更新')
    } else {
      await createAgentScript(payload)
      message.success('脚本已创建')
    }
    closeModal()
    await loadScripts()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, editingID.value ? '脚本更新失败' : '脚本创建失败'))
  } finally {
    saving.value = false
  }
}

function handleDelete(record: AgentScript) {
  Modal.confirm({
    title: '删除脚本',
    content: `确认删除脚本“${record.name}”吗？`,
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await deleteAgentScript(record.id)
        message.success('脚本已删除')
        await loadScripts()
      } catch (error) {
        message.error(extractHTTPErrorMessage(error, '脚本删除失败'))
      }
    },
  })
}

void loadScripts()
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
        <div class="page-header-copy">
          <div class="page-title">脚本管理</div>
          <div class="page-subtitle">维护可复用的 Shell 脚本与脚本文件模板，供 Agent 任务快速引用。</div>
        </div>
        <a-space>
          <a-button @click="loadScripts" :loading="loading">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
          <a-button v-if="canManage" type="primary" @click="openCreate">
            <template #icon><PlusOutlined /></template>
            新增脚本
          </a-button>
        </a-space>
    </div>

    <a-card :bordered="false" class="filter-card">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="关键字">
          <a-input v-model:value="filters.keyword" allow-clear placeholder="脚本名称 / 文件名 / 说明" @pressEnter="filters.page = 1; loadScripts()" />
        </a-form-item>
        <a-form-item label="类型">
          <a-select v-model:value="filters.task_type" allow-clear style="width: 160px" placeholder="全部类型">
            <a-select-option value="shell_task">Shell 脚本</a-select-option>
            <a-select-option value="script_file_task">脚本文件</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="filter-form-actions">
          <a-space>
            <a-button type="primary" @click="filters.page = 1; loadScripts()">查询</a-button>
            <a-button @click="filters.keyword = ''; filters.task_type = ''; filters.page = 1; filters.page_size = 10; loadScripts()">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false" class="table-card">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="{
          current: filters.page,
          pageSize: filters.page_size,
          total,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          onChange: (page: number, pageSize: number) => {
            filters.page = page
            filters.page_size = pageSize
            loadScripts()
          },
          onShowSizeChange: (_current: number, size: number) => {
            filters.page = 1
            filters.page_size = size
            loadScripts()
          },
        }"
        :scroll="{ x: 1120 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="script-name">{{ record.name }}</div>
            <div class="muted-text">{{ record.created_by || '系统维护' }}</div>
          </template>
          <template v-else-if="column.key === 'task_type'">
            <a-tag>{{ taskTypeText(record.task_type) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'shell_type'">
            <span>{{ record.shell_type || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'script_path'">
            <span>{{ record.script_path || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'updated_at'">
            <span>{{ formatTime(record.updated_at) }}</span>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button v-if="canManage" type="link" @click="openEdit(record)">
                <template #icon><EditOutlined /></template>
                编辑
              </a-button>
              <a-button v-if="canManage" type="link" danger @click="handleDelete(record)">
                <template #icon><DeleteOutlined /></template>
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="modalVisible"
      :title="editingID ? '编辑脚本' : '新增脚本'"
      width="720"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="closeModal"
    >
      <a-form layout="vertical">
        <a-form-item label="脚本名称" required>
          <a-input v-model:value="form.name" placeholder="例如：生产服务重启、校验目录结构" />
        </a-form-item>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="脚本类型" required>
              <a-select v-model:value="form.task_type">
                <a-select-option value="shell_task">Shell 脚本</a-select-option>
                <a-select-option value="script_file_task">脚本文件</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Shell 类型">
              <a-select v-model:value="form.shell_type">
                <a-select-option value="sh">sh</a-select-option>
                <a-select-option value="bash">bash</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item v-if="form.task_type === 'script_file_task'" label="上传脚本文件" required>
          <a-space direction="vertical" style="width: 100%">
            <a-upload v-bind="uploadProps">
              <a-button>
                <template #icon><UploadOutlined /></template>
                选择 .sh/.bash 文件
              </a-button>
            </a-upload>
            <div class="muted-text">脚本文件会保存在平台脚本库中，任务引用时会由 Agent 拉取并执行。</div>
            <div v-if="form.script_path" class="muted-text">已选择：{{ form.script_path }}</div>
          </a-space>
        </a-form-item>
        <a-form-item v-else label="脚本内容" required>
          <a-textarea v-model:value="form.script_text" :rows="14" placeholder='例如：echo "hello {env}"\npwd\nls -la' />
        </a-form-item>
        <a-form-item v-if="form.task_type === 'script_file_task' && form.script_text" label="脚本内容预览">
          <a-textarea :value="form.script_text" :rows="12" readonly />
        </a-form-item>
        <a-form-item label="说明">
          <a-textarea v-model:value="form.description" :rows="3" placeholder="记录脚本用途、适用环境和注意事项" />
        </a-form-item>
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

.script-name {
  color: var(--color-text-main);
  font-weight: 600;
}


@media (max-width: 900px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
