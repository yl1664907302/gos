<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteApplication, listApplications } from '../../api/application'
import { listAllReleaseTemplates } from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import { useApplicationListStore } from '../../stores/application-list'
import { useAuthStore } from '../../stores/auth'
import type { Application } from '../../types/application'
import { extractHTTPErrorMessage, isHTTPStatus } from '../../utils/http-error'

const router = useRouter()
const listStore = useApplicationListStore()
const authStore = useAuthStore()

const loading = ref(false)
const deletingId = ref('')
const dataSource = ref<Application[]>([])
const total = ref(0)
const loadingTemplateAvailability = ref(false)
const templateApplicationIDs = ref<Set<string>>(new Set())

const initialColumns: TableColumnsType<Application> = [
  { title: '应用名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: 'Key', dataIndex: 'key', key: 'key', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '制品类型', dataIndex: 'artifact_type', key: 'artifact_type', width: 140 },
  { title: '语言', dataIndex: 'language', key: 'language', width: 120 },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 120 },
  { title: '仓库地址', dataIndex: 'repo_url', key: 'repo_url', ellipsis: true },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 360, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 520, hitArea: 10 })

const canManageApplication = computed(() => authStore.hasPermission('application.manage'))
const canViewPipeline = computed(() => authStore.hasPermission('pipeline.view'))
function canReleaseApplication(applicationID: string) {
  return (
    authStore.hasApplicationPermission('release.create', applicationID) &&
    templateApplicationIDs.value.has(String(applicationID || '').trim()) &&
    !loadingTemplateAvailability.value
  )
}

async function loadApplications() {
  loading.value = true
  try {
    const response = await listApplications({
      key: listStore.key.trim() || undefined,
      name: listStore.name.trim() || undefined,
      status: listStore.status || undefined,
      page: listStore.page,
      page_size: listStore.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    listStore.setPage(response.page, response.page_size)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用列表加载失败'))
  } finally {
    loading.value = false
  }
}

async function loadTemplateAvailability() {
  loadingTemplateAvailability.value = true
  try {
    const items = await listAllReleaseTemplates({ status: 'active' })
    templateApplicationIDs.value = new Set(
      items.map((item) => String(item.application_id || '').trim()).filter(Boolean),
    )
  } catch (error) {
    templateApplicationIDs.value = new Set()
    if (!isHTTPStatus(error, 403)) {
      message.error(extractHTTPErrorMessage(error, '发布模板状态加载失败'))
    }
  } finally {
    loadingTemplateAvailability.value = false
  }
}

function handleSearch() {
  listStore.setPage(1, listStore.pageSize)
  void loadApplications()
}

function handleReset() {
  listStore.resetFilters()
  void loadApplications()
}

function handlePageChange(page: number, pageSize: number) {
  listStore.setPage(page, pageSize)
  void loadApplications()
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

async function handleDelete(id: string) {
  deletingId.value = id
  try {
    await deleteApplication(id)
    message.success('应用删除成功')
    if (dataSource.value.length === 1 && listStore.page > 1) {
      listStore.setPage(listStore.page - 1, listStore.pageSize)
    }
    await loadApplications()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用删除失败'))
  } finally {
    deletingId.value = ''
  }
}

function statusColor(status: Application['status']) {
  if (status === 'active') {
    return 'green'
  }
  return 'default'
}

function formatTime(value: string) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  void Promise.all([loadApplications(), loadTemplateAvailability()])
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">我的应用</h2>
        <p class="page-subtitle">管理应用基础信息，支持筛选、分页、编辑与删除。</p>
      </div>
      <a-button v-if="canManageApplication" type="primary" @click="toCreate">
        <template #icon>
          <PlusOutlined />
        </template>
        新增应用
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="Key">
          <a-input v-model:value="listStore.key" allow-clear placeholder="按 Key 查询" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model:value="listStore.name" allow-clear placeholder="按名称查询" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="listStore.status"
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
        :scroll="{ x: 1380 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
          </template>

          <template v-else-if="column.key === 'repo_url'">
            <a
              v-if="record.repo_url"
              :href="record.repo_url"
              target="_blank"
              rel="noopener noreferrer"
              class="repo-link"
            >
              {{ record.repo_url }}
            </a>
            <span v-else>-</span>
          </template>

          <template v-else-if="column.key === 'updated_at'">
            {{ formatTime(record.updated_at) }}
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="toDetail(record.id)">查看</a-button>
              <a-button v-if="canManageApplication" type="link" size="small" @click="toEdit(record.id)">编辑</a-button>
              <a-button v-if="canViewPipeline" type="link" size="small" @click="toBindings(record.id)">管线绑定</a-button>
              <a-button
                type="link"
                size="small"
                :disabled="!canReleaseApplication(record.id)"
                @click="toRelease(record.id)"
              >
                发布
              </a-button>
              <a-popconfirm
                v-if="canManageApplication"
                title="确认删除当前应用吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button type="link" size="small" danger :loading="deletingId === record.id">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <div class="pagination-area">
        <a-pagination
          :current="listStore.page"
          :page-size="listStore.pageSize"
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

.repo-link {
  color: #1677ff;
}

.danger-icon {
  color: #ff4d4f;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-form {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .filter-form {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }

  .filter-status-select {
    width: 100%;
  }

  .pagination-area {
    justify-content: center;
  }
}
</style>
