<script setup lang="ts">
import { FileTextOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { getPipelineRawScript, listPipelines } from '../../api/pipeline'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { Pipeline, PipelineRawScriptData, PipelineStatus } from '../../types/pipeline'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const loading = ref(false)
const dataSource = ref<Pipeline[]>([])
const total = ref(0)
const scriptVisible = ref(false)
const scriptLoading = ref(false)
const scriptData = ref<PipelineRawScriptData | null>(null)
const scriptPipelineName = ref('')

const filters = reactive({
  name: '',
  status: '' as PipelineStatus | '',
  page: 1,
  pageSize: 20,
})

const initialColumns: TableColumnsType<Pipeline> = [
  { title: '管线名称', dataIndex: 'job_name', key: 'job_name', width: 220 },
  { title: 'Jenkins路径', dataIndex: 'job_full_name', key: 'job_full_name', width: 280 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '最近同步时间', dataIndex: 'last_synced_at', key: 'last_synced_at', width: 190 },
  { title: '最近校验时间', dataIndex: 'last_verified_at', key: 'last_verified_at', width: 190 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 140, fixed: 'right' },
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

onMounted(() => {
  void loadPipelines()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">Jenkins管理</h2>
        <p class="page-subtitle">展示后端定时同步到系统的 Jenkins 管线信息。</p>
      </div>
      <a-button @click="loadPipelines">
        <template #icon>
          <ReloadOutlined />
        </template>
        刷新
      </a-button>
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
            <a-button type="link" size="small" @click="openScriptModal(record)">
              <template #icon>
                <FileTextOutlined />
              </template>
              原始脚本
            </a-button>
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
          <a-descriptions-item label="脚本路径">{{ scriptData.script_path || '-' }}</a-descriptions-item>
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
