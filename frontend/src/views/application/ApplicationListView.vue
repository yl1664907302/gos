<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
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
const introVisible = ref(false)

const initialColumns: TableColumnsType<Application> = [
  { title: '应用名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: 'Key', dataIndex: 'key', key: 'key', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '制品类型', dataIndex: 'artifact_type', key: 'artifact_type', width: 140 },
  { title: '语言', dataIndex: 'language', key: 'language', width: 120 },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 120 },
  { title: '仓库地址', dataIndex: 'repo_url', key: 'repo_url', ellipsis: true },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 430, fixed: 'right' },
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

function openIntroDrawer() {
  introVisible.value = true
}

function closeIntroDrawer() {
  introVisible.value = false
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
      <div class="page-header-copy">
        <h2 class="page-title">我的应用</h2>
        <p class="page-subtitle">管理应用基础信息，支持筛选、分页、编辑与删除。</p>
      </div>
      <a-space>
        <a-button @click="openIntroDrawer">
          <template #icon>
            <QuestionCircleOutlined />
          </template>
          发布流程介绍
        </a-button>
        <a-button v-if="canManageApplication" type="primary" @click="toCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          新增应用
        </a-button>
      </a-space>
    </div>

    <a-card class="filter-card" :bordered="true">
      <div class="advanced-search-panel">
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
          <a-form-item class="filter-form-actions">
            <a-space>
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-card>

    <a-card class="table-card" :bordered="true">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1500 }"
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
  color: var(--color-dashboard-800);
}

.danger-icon {
  color: var(--color-danger);
}

.pagination-area {
  margin-top: var(--space-6);
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

@media (min-width: 640px) {
  .flow-branch-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
