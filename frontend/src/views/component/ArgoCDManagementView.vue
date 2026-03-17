<script setup lang="ts">
import { ExportOutlined, LoadingOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getArgoCDApplicationByID,
  getArgoCDApplicationOriginalLink,
  listArgoCDApplications,
  syncArgoCDApplications,
} from '../../api/argocd'
import { useResizableColumns } from '../../composables/useResizableColumns'
import { useAuthStore } from '../../stores/auth'
import type { ArgoCDApplication, ArgoCDRecordStatus } from '../../types/argocd'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()

const loading = ref(false)
const syncing = ref(false)
const detailLoading = ref(false)
const detailVisible = ref(false)
const openingOriginalID = ref('')
const total = ref(0)
const dataSource = ref<ArgoCDApplication[]>([])
const detail = ref<ArgoCDApplication | null>(null)

const filters = reactive({
  app_name: '',
  project: '',
  sync_status: '',
  health_status: '',
  status: '' as ArgoCDRecordStatus | '',
  page: 1,
  pageSize: 20,
})

const canViewArgoCD = computed(
  () => authStore.hasPermission('component.argocd.view') || authStore.hasPermission('component.argocd.manage'),
)
const canManageArgoCD = computed(() => authStore.hasPermission('component.argocd.manage'))

const initialColumns: TableColumnsType<ArgoCDApplication> = [
  { title: '应用名称', dataIndex: 'app_name', key: 'app_name', width: 220 },
  { title: 'Project', dataIndex: 'project', key: 'project', width: 140 },
  { title: 'Repo地址', dataIndex: 'repo_url', key: 'repo_url', width: 280 },
  { title: 'Source Path', dataIndex: 'source_path', key: 'source_path', width: 220 },
  { title: 'Target Revision', dataIndex: 'target_revision', key: 'target_revision', width: 180 },
  { title: '目标Namespace', dataIndex: 'dest_namespace', key: 'dest_namespace', width: 180 },
  { title: '同步状态', dataIndex: 'sync_status', key: 'sync_status', width: 130 },
  { title: '健康状态', dataIndex: 'health_status', key: 'health_status', width: 130 },
  { title: '操作阶段', dataIndex: 'operation_phase', key: 'operation_phase', width: 150 },
  { title: '记录状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '最后同步时间', dataIndex: 'last_synced_at', key: 'last_synced_at', width: 190 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 120, maxWidth: 560, hitArea: 10 })

function formatTime(value: string | null) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function syncStatusColor(value: string) {
  switch (String(value || '').trim().toLowerCase()) {
    case 'synced':
      return 'green'
    case 'outofsync':
      return 'orange'
    default:
      return 'default'
  }
}

function healthStatusColor(value: string) {
  switch (String(value || '').trim().toLowerCase()) {
    case 'healthy':
      return 'green'
    case 'progressing':
      return 'blue'
    case 'degraded':
      return 'red'
    case 'missing':
      return 'orange'
    default:
      return 'default'
  }
}

function statusColor(value: string) {
  return String(value || '').trim().toLowerCase() === 'active' ? 'green' : 'default'
}

function operationPhaseColor(value: string) {
  switch (String(value || '').trim().toLowerCase()) {
    case 'succeeded':
      return 'green'
    case 'failed':
      return 'red'
    case 'running':
      return 'processing'
    case 'terminating':
      return 'orange'
    default:
      return 'default'
  }
}

const detailRawMeta = computed(() => {
  const text = String(detail.value?.raw_meta || '').trim()
  if (!text) {
    return '-'
  }
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return text
  }
})

async function loadApplications() {
  loading.value = true
  try {
    const response = await listArgoCDApplications({
      app_name: filters.app_name.trim() || undefined,
      project: filters.project.trim() || undefined,
      sync_status: filters.sync_status || undefined,
      health_status: filters.health_status || undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'ArgoCD 应用列表加载失败'))
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  void loadApplications()
}

function handleReset() {
  filters.app_name = ''
  filters.project = ''
  filters.sync_status = ''
  filters.health_status = ''
  filters.status = ''
  filters.page = 1
  filters.pageSize = 20
  void loadApplications()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadApplications()
}

async function handleManualSync() {
  syncing.value = true
  try {
    const response = await syncArgoCDApplications()
    message.success(
      `手动同步完成：共 ${response.data.total} 条（新增 ${response.data.created} / 更新 ${response.data.updated} / 失效 ${response.data.inactivated}）`,
    )
    await loadApplications()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'ArgoCD 手动同步失败'))
  } finally {
    syncing.value = false
  }
}

async function openDetail(record: ArgoCDApplication) {
  detailVisible.value = true
  detailLoading.value = true
  detail.value = record
  try {
    const response = await getArgoCDApplicationByID(record.id)
    detail.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '加载 ArgoCD 应用详情失败'))
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detailVisible.value = false
  detailLoading.value = false
  detail.value = null
}

async function openOriginalLink(record: ArgoCDApplication) {
  openingOriginalID.value = record.id
  try {
    const response = await getArgoCDApplicationOriginalLink(record.id)
    const target = String(response.data.original_link || '').trim()
    if (!target) {
      message.warning('当前应用缺少 ArgoCD 原始链接')
      return
    }
    window.open(target, '_blank', 'noopener,noreferrer')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '打开 ArgoCD 原始链接失败'))
  } finally {
    openingOriginalID.value = ''
  }
}

onMounted(() => {
  if (canViewArgoCD.value) {
    void loadApplications()
  }
})
</script>

<template>
  <div class="page-wrap">
    <a-card :bordered="false" class="query-card">
      <a-form layout="inline">
        <a-form-item label="应用名称">
          <a-input v-model:value="filters.app_name" allow-clear placeholder="请输入应用名称" @pressEnter="handleSearch" />
        </a-form-item>
        <a-form-item label="Project">
          <a-input v-model:value="filters.project" allow-clear placeholder="请输入 Project" @pressEnter="handleSearch" />
        </a-form-item>
        <a-form-item label="同步状态">
          <a-select v-model:value="filters.sync_status" allow-clear placeholder="全部" style="width: 150px">
            <a-select-option value="Synced">Synced</a-select-option>
            <a-select-option value="OutOfSync">OutOfSync</a-select-option>
            <a-select-option value="Unknown">Unknown</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="健康状态">
          <a-select v-model:value="filters.health_status" allow-clear placeholder="全部" style="width: 150px">
            <a-select-option value="Healthy">Healthy</a-select-option>
            <a-select-option value="Progressing">Progressing</a-select-option>
            <a-select-option value="Degraded">Degraded</a-select-option>
            <a-select-option value="Missing">Missing</a-select-option>
            <a-select-option value="Unknown">Unknown</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="记录状态">
          <a-select v-model:value="filters.status" allow-clear placeholder="全部" style="width: 130px">
            <a-select-option value="active">active</a-select-option>
            <a-select-option value="inactive">inactive</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card :bordered="false" class="table-card">
      <div class="table-toolbar">
        <div class="toolbar-title">ArgoCD 应用列表</div>
        <a-space>
          <a-button v-if="canManageArgoCD" type="primary" :loading="syncing" @click="handleManualSync">
            <template #icon>
              <ReloadOutlined />
            </template>
            手动同步
          </a-button>
          <a-button :loading="loading" @click="loadApplications">
            <template #icon>
              <ReloadOutlined />
            </template>
            刷新
          </a-button>
        </a-space>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1800 }"
        class="resizable-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'repo_url'">
            <span class="truncate-text" :title="record.repo_url || '-'">{{ record.repo_url || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'source_path'">
            <span class="truncate-text" :title="record.source_path || '-'">{{ record.source_path || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'target_revision'">
            <span>{{ record.target_revision || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'sync_status'">
            <a-tag :color="syncStatusColor(record.sync_status)">{{ record.sync_status || 'Unknown' }}</a-tag>
          </template>
          <template v-else-if="column.key === 'health_status'">
            <a-tag :color="healthStatusColor(record.health_status)">{{ record.health_status || 'Unknown' }}</a-tag>
          </template>
          <template v-else-if="column.key === 'operation_phase'">
            <a-tag :color="operationPhaseColor(record.operation_phase)">
              <template v-if="String(record.operation_phase || '').toLowerCase() === 'running'">
                <LoadingOutlined />
              </template>
              {{ record.operation_phase || '-' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'last_synced_at'">
            {{ formatTime(record.last_synced_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openDetail(record)">详情</a-button>
              <a-button type="link" size="small" :loading="openingOriginalID === record.id" @click="openOriginalLink(record)">
                <template #icon>
                  <ExportOutlined />
                </template>
                原始链接
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>

      <div class="table-pagination">
        <a-pagination
          :current="filters.page"
          :page-size="filters.pageSize"
          :total="total"
          :show-size-changer="true"
          :show-total="(value) => `共 ${value} 条`"
          @change="handlePageChange"
          @show-size-change="handlePageChange"
        />
      </div>
    </a-card>

    <a-drawer :open="detailVisible" width="720" title="ArgoCD 应用详情" @close="closeDetail">
      <a-spin :spinning="detailLoading">
        <a-descriptions v-if="detail" :column="2" size="small" bordered>
          <a-descriptions-item label="应用名称">{{ detail.app_name }}</a-descriptions-item>
          <a-descriptions-item label="Project">{{ detail.project || '-' }}</a-descriptions-item>
          <a-descriptions-item label="记录状态">
            <a-tag :color="statusColor(detail.status)">{{ detail.status }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="最后同步时间">{{ formatTime(detail.last_synced_at) }}</a-descriptions-item>
          <a-descriptions-item label="Repo URL" :span="2">{{ detail.repo_url || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Source Path" :span="2">{{ detail.source_path || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Target Revision">{{ detail.target_revision || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Destination Server">{{ detail.dest_server || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Destination Namespace">{{ detail.dest_namespace || '-' }}</a-descriptions-item>
          <a-descriptions-item label="同步状态">
            <a-tag :color="syncStatusColor(detail.sync_status)">{{ detail.sync_status || 'Unknown' }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="健康状态">
            <a-tag :color="healthStatusColor(detail.health_status)">{{ detail.health_status || 'Unknown' }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="操作阶段">
            <a-tag :color="operationPhaseColor(detail.operation_phase)">{{ detail.operation_phase || '-' }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="原始数据" :span="2">
            <pre class="raw-meta">{{ detailRawMeta }}</pre>
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </a-drawer>
  </div>
</template>

<style scoped>
.page-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.query-card,
.table-card {
  border-radius: 16px;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.truncate-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.raw-meta {
  margin: 0;
  padding: 12px;
  max-height: 320px;
  overflow: auto;
  border-radius: 12px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 1200px) {
  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
