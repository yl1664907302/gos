<script setup lang="ts">
import { ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { onMounted, reactive, ref } from 'vue'
import { listPipelines } from '../../api/pipeline'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { Pipeline, PipelineStatus } from '../../types/pipeline'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const loading = ref(false)
const dataSource = ref<Pipeline[]>([])
const total = ref(0)

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
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 120, maxWidth: 560, hitArea: 10 })

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
        :scroll="{ x: 1200 }"
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
