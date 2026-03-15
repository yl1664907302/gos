<script setup lang="ts">
import { DeleteOutlined, EditOutlined, ExportOutlined, FileTextOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  createJenkinsRawPipeline,
  deleteJenkinsRawPipeline,
  getPipelineOriginalLink,
  getPipelineRawScript,
  listPipelines,
  previewJenkinsRawPipelineConfigXML,
  updateJenkinsRawPipeline,
} from '../../api/pipeline'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { Pipeline, PipelineRawScriptData, PipelineStatus } from '../../types/pipeline'
import { useAuthStore } from '../../stores/auth'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()

const loading = ref(false)
const dataSource = ref<Pipeline[]>([])
const total = ref(0)
const scriptVisible = ref(false)
const scriptLoading = ref(false)
const scriptData = ref<PipelineRawScriptData | null>(null)
const scriptPipelineName = ref('')
const editorVisible = ref(false)
const editorLoading = ref(false)
const submitting = ref(false)
const deletingID = ref('')
const configVisible = ref(false)
const configLoading = ref(false)
const configTitle = ref('')
const configXML = ref('')
const previewingConfig = ref(false)
const openingOriginalID = ref('')
const editorMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()

const filters = reactive({
  name: '',
  status: '' as PipelineStatus | '',
  page: 1,
  pageSize: 20,
})

const editorForm = reactive({
  id: '',
  full_name: '',
  description: '',
  script: '',
  sandbox: true,
})

const canManagePipeline = computed(() => authStore.hasPermission('pipeline.manage'))

const formRules: Record<string, Array<{ required: boolean; message: string; trigger: string }>> = {
  full_name: [{ required: true, message: '请输入 Jenkins 路径', trigger: 'blur' }],
  script: [{ required: true, message: '请输入原始管线脚本', trigger: 'blur' }],
}

const initialColumns: TableColumnsType<Pipeline> = [
  { title: '管线名称', dataIndex: 'job_name', key: 'job_name', width: 220 },
  { title: 'Jenkins路径', dataIndex: 'job_full_name', key: 'job_full_name', width: 280 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '最近同步时间', dataIndex: 'last_synced_at', key: 'last_synced_at', width: 190 },
  { title: '最近校验时间', dataIndex: 'last_verified_at', key: 'last_verified_at', width: 190 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 200, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 120, maxWidth: 560, hitArea: 10 })

const displayScript = computed(() => {
  if (!scriptData.value) {
    return ''
  }
  const text = String(scriptData.value.script || '').trim()
  if (text) {
    return text
  }
  if (scriptData.value.from_scm) {
    const scriptPath = String(scriptData.value.script_path || 'Jenkinsfile').trim()
    return `该 Jenkins 管线使用 SCM 脚本模式，脚本路径：${scriptPath}\n请到对应代码仓库查看脚本内容。`
  }
  return '未解析到脚本内容。'
})

function formatTime(value: string | null) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function statusColor(status: PipelineStatus) {
  if (status === 'active') {
    return 'green'
  }
  return 'default'
}

function closeScriptModal() {
  scriptVisible.value = false
  scriptLoading.value = false
  scriptData.value = null
  scriptPipelineName.value = ''
}

function closeConfigModal() {
  configVisible.value = false
  configLoading.value = false
  configTitle.value = ''
  configXML.value = ''
}

function resetEditorForm() {
  editorForm.id = ''
  editorForm.full_name = ''
  editorForm.description = ''
  editorForm.script = ''
  editorForm.sandbox = true
}

function closeEditorModal() {
  editorVisible.value = false
  editorLoading.value = false
  submitting.value = false
  resetEditorForm()
}

function openCreateModal() {
  editorMode.value = 'create'
  resetEditorForm()
  editorVisible.value = true
}

async function openOriginalLink(record: Pipeline) {
  openingOriginalID.value = record.id
  try {
    const response = await getPipelineOriginalLink(record.id)
    const target = String(response.data.original_link || '').trim()
    if (!target) {
      message.warning('当前管线缺少 Jenkins 原始链接')
      return
    }
    window.open(target, '_blank', 'noopener,noreferrer')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '打开 Jenkins 原始链接失败'))
  } finally {
    openingOriginalID.value = ''
  }
}

async function openScriptModal(record: Pipeline) {
  scriptVisible.value = true
  scriptLoading.value = true
  scriptData.value = null
  scriptPipelineName.value = record.job_name || record.job_full_name || record.id
  try {
    const response = await getPipelineRawScript(record.id)
    scriptData.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '加载管线原始脚本失败'))
    closeScriptModal()
    return
  } finally {
    scriptLoading.value = false
  }
}

async function openEditModal(record: Pipeline) {
  if (record.status !== 'active') {
    message.info('失效管线暂不支持编辑，请先在 Jenkins 中恢复或重新创建')
    return
  }
  editorMode.value = 'edit'
  editorLoading.value = true
  resetEditorForm()
  try {
    const response = await getPipelineRawScript(record.id)
    if (response.data.from_scm) {
      message.warning('当前管线为 SCM 模式，暂不支持在平台内直接编辑原始脚本')
      return
    }
    editorForm.id = record.id
    editorForm.full_name = response.data.pipeline.job_full_name
    editorForm.description = response.data.description || ''
    editorForm.script = response.data.script || ''
    editorForm.sandbox = response.data.sandbox
    editorVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '加载可编辑管线失败'))
  } finally {
    editorLoading.value = false
  }
}

async function loadPipelines() {
  loading.value = true
  try {
    const response = await listPipelines({
      provider: 'jenkins',
      name: filters.name.trim() || undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Jenkins管线加载失败'))
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  void loadPipelines()
}

function handleReset() {
  filters.name = ''
  filters.status = ''
  filters.page = 1
  filters.pageSize = 20
  void loadPipelines()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadPipelines()
}

async function submitEditor() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    if (editorMode.value === 'create') {
      await createJenkinsRawPipeline({
        full_name: editorForm.full_name.trim(),
        description: editorForm.description.trim() || undefined,
        script: editorForm.script,
        sandbox: editorForm.sandbox,
      })
      message.success('原始管线创建成功')
    } else {
      await updateJenkinsRawPipeline(editorForm.id, {
        description: editorForm.description.trim() || undefined,
        script: editorForm.script,
        sandbox: editorForm.sandbox,
      })
      message.success('原始管线更新成功')
    }
    closeEditorModal()
    filters.page = 1
    await loadPipelines()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, editorMode.value === 'create' ? '原始管线创建失败' : '原始管线更新失败'))
  } finally {
    submitting.value = false
  }
}

async function previewConfigFromForm() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  previewingConfig.value = true
  try {
    const response = await previewJenkinsRawPipelineConfigXML({
      full_name: editorForm.full_name.trim(),
      description: editorForm.description.trim() || undefined,
      script: editorForm.script,
      sandbox: editorForm.sandbox,
    })
    configTitle.value = editorMode.value === 'create' ? `预览配置XML - ${editorForm.full_name.trim()}` : `预览配置XML - ${editorForm.full_name}`
    configXML.value = response.data.config_xml || ''
    configVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '预览配置XML失败'))
  } finally {
    previewingConfig.value = false
  }
}

async function handleDelete(record: Pipeline) {
  deletingID.value = record.id
  try {
    await deleteJenkinsRawPipeline(record.id)
    message.success('原始管线删除成功')
    await loadPipelines()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '删除原始管线失败'))
  } finally {
    deletingID.value = ''
  }
}

onMounted(() => {
  void loadPipelines()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">管线列表</h2>
        <p class="page-subtitle">展示并维护 Jenkins 管线；支持查看原始脚本，以及创建/编辑 inline raw pipeline。</p>
      </div>
      <a-space>
        <a-button v-if="canManagePipeline" type="primary" @click="openCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增管线
        </a-button>
        <a-button @click="loadPipelines">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新
        </a-button>
      </a-space>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="名称">
          <a-input v-model:value="filters.name" allow-clear placeholder="按管线名称查询" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="filters.status"
            class="filter-status-select"
            allow-clear
            placeholder="全部"
            :options="[
              { label: 'active', value: 'active' },
              { label: 'inactive', value: 'inactive' },
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
    </a-card>

    <a-card class="table-card" :bordered="true">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1320 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'last_synced_at'">
            {{ formatTime(record.last_synced_at) }}
          </template>
          <template v-else-if="column.key === 'last_verified_at'">
            {{ formatTime(record.last_verified_at) }}
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatTime(record.updated_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openScriptModal(record)">
                <template #icon>
                  <FileTextOutlined />
                </template>
                原始脚本
              </a-button>
              <a-button
                type="link"
                size="small"
                :loading="openingOriginalID === record.id"
                @click="openOriginalLink(record)"
              >
                <template #icon>
                  <ExportOutlined />
                </template>
                原始链接
              </a-button>
              <a-button
                v-if="canManagePipeline"
                type="link"
                size="small"
                :disabled="record.status !== 'active' || editorLoading"
                @click="openEditModal(record)"
              >
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-popconfirm
                v-if="canManagePipeline"
                title="确认删除当前原始管线吗？删除后会同步回平台并置为失效状态。"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button
                  type="link"
                  size="small"
                  danger
                  :disabled="record.status !== 'active'"
                  :loading="deletingID === record.id"
                >
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  删除
                </a-button>
              </a-popconfirm>
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
      :open="scriptVisible"
      :title="`管线原始脚本 - ${scriptPipelineName || '-'}`"
      :footer="null"
      :width="860"
      @cancel="closeScriptModal"
    >
      <a-skeleton v-if="scriptLoading" active :paragraph="{ rows: 8 }" />
      <template v-else-if="scriptData">
        <a-descriptions :column="1" size="small" bordered class="script-meta">
          <a-descriptions-item label="定义类型">{{ scriptData.definition_class || '-' }}</a-descriptions-item>
          <a-descriptions-item label="描述">{{ scriptData.description || '-' }}</a-descriptions-item>
          <a-descriptions-item label="脚本路径">{{ scriptData.script_path || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Sandbox">{{ scriptData.sandbox ? '开启' : '关闭' }}</a-descriptions-item>
        </a-descriptions>
        <a-alert
          v-if="scriptData.from_scm"
          type="info"
          show-icon
          class="script-alert"
          message="该管线为 SCM 脚本模式，Jenkins 仅记录脚本路径，完整内容请查看代码仓库。"
        />
        <pre class="script-panel">{{ displayScript }}</pre>
      </template>
    </a-modal>

    <a-modal
      :open="configVisible"
      :title="configTitle ? `配置XML - ${configTitle}` : '配置XML'"
      :footer="null"
      :width="920"
      @cancel="closeConfigModal"
    >
      <a-skeleton v-if="configLoading" active :paragraph="{ rows: 10 }" />
      <template v-else>
        <pre class="script-panel">{{ configXML || '未获取到配置XML。' }}</pre>
      </template>
    </a-modal>

    <a-modal
      :open="editorVisible"
      :title="editorMode === 'create' ? '新增原始管线' : '编辑原始管线'"
      :width="900"
      @cancel="closeEditorModal"
    >
      <template #footer>
        <a-space>
          <a-button @click="closeEditorModal">取消</a-button>
          <a-button :loading="previewingConfig" @click="previewConfigFromForm">预览配置XML</a-button>
          <a-button type="primary" :loading="submitting" @click="submitEditor">保存</a-button>
        </a-space>
      </template>
      <a-alert
        type="info"
        show-icon
        class="editor-alert"
        message="仅支持 Jenkins inline raw pipeline；Jenkins 路径支持根目录或已有 folder/子路径，不会自动创建文件夹。"
      />
      <a-skeleton v-if="editorLoading" active :paragraph="{ rows: 8 }" />
      <a-form
        v-else
        ref="formRef"
        layout="vertical"
        :model="editorForm"
        :rules="formRules"
      >
        <a-form-item label="Jenkins 路径" name="full_name">
          <a-input
            v-model:value="editorForm.full_name"
            :disabled="editorMode === 'edit'"
            placeholder="例如 folder-a/demo-pipeline 或 demo-pipeline"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-input
            v-model:value="editorForm.description"
            allow-clear
            placeholder="可选，填写这条管线的用途说明"
          />
        </a-form-item>
        <a-form-item label="Sandbox">
          <a-switch v-model:checked="editorForm.sandbox" />
        </a-form-item>
        <a-form-item label="原始脚本" name="script">
          <a-textarea
            v-model:value="editorForm.script"
            :auto-size="{ minRows: 14, maxRows: 24 }"
            placeholder="请输入 Jenkins Pipeline Script"
          />
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

.filter-card,
.table-card {
  border-radius: var(--radius-xl);
}

.filter-form {
  display: flex;
  gap: 8px;
}

.filter-status-select {
  width: 140px;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.script-meta {
  margin-bottom: 12px;
}

.script-alert {
  margin-bottom: 12px;
}

.editor-alert {
  margin-bottom: 16px;
}

.script-panel {
  margin: 0;
  min-height: 280px;
  max-height: 560px;
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
}
</style>
