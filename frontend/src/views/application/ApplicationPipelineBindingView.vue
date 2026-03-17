<script setup lang="ts">
import { ArrowLeftOutlined, ExclamationCircleOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApplicationByID } from '../../api/application'
import {
  createPipelineBinding,
  deletePipelineBinding,
  getPipelineBindingByID,
  listPipelineBindings,
  listPipelines,
  updatePipelineBinding,
} from '../../api/pipeline'
import { listAllReleaseTemplates } from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import { useAuthStore } from '../../stores/auth'
import type { Application } from '../../types/application'
import type {
  BindingType,
  Pipeline,
  PipelineBinding,
  PipelineProvider,
  PipelineStatus,
  TriggerMode,
} from '../../types/pipeline'
import { extractHTTPErrorMessage, isHTTPStatus } from '../../utils/http-error'

type FormMode = 'create' | 'edit'

interface BindingFormState {
  id: string
  binding_type: BindingType
  provider: PipelineProvider
  pipeline_id: string
  trigger_mode: TriggerMode
  status: PipelineStatus
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const application = ref<Application | null>(null)
const loading = ref(false)
const dataSource = ref<PipelineBinding[]>([])
const total = ref(0)
const deletingID = ref('')
const loadingTemplateAvailability = ref(false)
const activeTemplateBindingIDs = ref<Set<string>>(new Set())

const detailVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref<PipelineBinding | null>(null)

const formVisible = ref(false)
const formMode = ref<FormMode>('create')
const formSubmitting = ref(false)
const formRef = ref<FormInstance>()

const jenkinsPipelineOptions = ref<Array<{ label: string; value: string }>>([])
const loadingJenkinsPipelines = ref(false)
const jenkinsPipelineKeyword = ref('')

const filters = reactive({
  binding_type: '' as BindingType | '',
  provider: '' as PipelineProvider | '',
  status: '' as PipelineStatus | '',
  page: 1,
  pageSize: 20,
})

const formState = reactive<BindingFormState>({
  id: '',
  binding_type: 'ci',
  provider: 'jenkins',
  pipeline_id: '',
  trigger_mode: 'manual',
  status: 'active',
})

const applicationID = computed(() => String(route.params.id || ''))
const pageTitle = computed(() => (application.value ? `${application.value.name} · 管线绑定` : '管线绑定'))
const canManageBinding = computed(() => authStore.hasPermission('pipeline.manage'))
const canViewPipelineParams = computed(() => authStore.hasPermission('pipeline_param.manage'))
const canCreateRelease = computed(() => authStore.hasApplicationPermission('release.create', applicationID.value))
const existingBindingTypes = computed(() => new Set(dataSource.value.map((item) => item.binding_type)))
const isUsingJenkins = computed(() => true)
const bindingTypeOptions = computed(() => [
  { label: 'ci', value: 'ci', disabled: formMode.value === 'create' && existingBindingTypes.value.has('ci') },
  { label: 'cd', value: 'cd', disabled: formMode.value === 'create' && existingBindingTypes.value.has('cd') },
])

const initialColumns: TableColumnsType<PipelineBinding> = [
  { title: '管线名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '应用名称', dataIndex: 'application_name', key: 'application_name', width: 160 },
  { title: '类型', dataIndex: 'binding_type', key: 'binding_type', width: 100 },
  { title: '提供方', dataIndex: 'provider', key: 'provider', width: 120 },
  { title: 'pipeline_id', dataIndex: 'pipeline_id', key: 'pipeline_id', width: 220 },
  { title: '触发方式', dataIndex: 'trigger_mode', key: 'trigger_mode', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 320, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 560, hitArea: 10 })

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

function goBack() {
  void router.push('/applications')
}

function toExecutorParams(record: PipelineBinding) {
  if (record.provider !== 'jenkins') {
    message.info('仅 Jenkins 类型绑定支持查看执行器参数')
    return
  }

  const query: Record<string, string> = {
    application_id: record.application_id,
    binding_type: record.binding_type,
    provider: record.provider,
  }
  if (record.id) {
    query.pipeline_binding_id = record.id
  }
  if (record.pipeline_id) {
    query.pipeline_id = record.pipeline_id
  }
  if (record.name) {
    query.pipeline_name = record.name
  }

  void router.push({
    path: '/components/executor-params',
    query,
  })
}

function toCreateRelease(record: PipelineBinding) {
  if (!canCreateReleaseForBinding(record.id)) {
    return
  }
  void router.push({
    path: '/releases/new',
    query: {
      application_id: record.application_id,
      binding_id: record.id,
    },
  })
}

function canCreateReleaseForBinding(bindingID: string) {
  return (
    canCreateRelease.value &&
    activeTemplateBindingIDs.value.has(String(bindingID || '').trim()) &&
    !loadingTemplateAvailability.value
  )
}

async function loadApplication() {
  if (!applicationID.value) {
    message.error('缺少应用 ID')
    goBack()
    return
  }
  try {
    const response = await getApplicationByID(applicationID.value)
    application.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用信息加载失败'))
    goBack()
  }
}

async function loadBindings() {
  if (!applicationID.value) {
    return
  }
  loading.value = true
  try {
    const response = await listPipelineBindings(applicationID.value, {
      binding_type: filters.binding_type || undefined,
      provider: filters.provider || undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '绑定列表加载失败'))
  } finally {
    loading.value = false
  }
}

async function loadTemplateAvailability() {
  if (!applicationID.value) {
    activeTemplateBindingIDs.value = new Set()
    return
  }
  loadingTemplateAvailability.value = true
  try {
    const items = await listAllReleaseTemplates({
      application_id: applicationID.value,
      status: 'active',
    })
    activeTemplateBindingIDs.value = new Set(
      items.map((item) => String(item.binding_id || '').trim()).filter(Boolean),
    )
  } catch (error) {
    activeTemplateBindingIDs.value = new Set()
    if (!isHTTPStatus(error, 403)) {
      message.error(extractHTTPErrorMessage(error, '发布模板状态加载失败'))
    }
  } finally {
    loadingTemplateAvailability.value = false
  }
}

function formatJenkinsPipelineLabel(pipeline: Pipeline) {
  const jobFullName = String(pipeline.job_full_name || '').trim()
  const jobName = String(pipeline.job_name || '').trim() || jobFullName
  if (!jobFullName || jobName === jobFullName) {
    return jobName
  }
  return `${jobName} / ${jobFullName}`
}

async function ensureJenkinsPipelines(force = false, keyword = '') {
  const normalizedKeyword = String(keyword || '').trim()
  if (!force && !normalizedKeyword && jenkinsPipelineOptions.value.length > 0) {
    return
  }
  loadingJenkinsPipelines.value = true
  try {
    const pageSize = 100
    let page = 1
    let total = 0
    const allItems: Pipeline[] = []

    do {
      const response = await listPipelines({
        provider: 'jenkins',
        status: 'active',
        name: normalizedKeyword || undefined,
        page,
        page_size: pageSize,
      })
      total = Number(response.total || 0)
      allItems.push(...response.data)
      page += 1
    } while (allItems.length < total)

    const optionMap = new Map<string, { label: string; value: string }>()
    for (const pipeline of allItems) {
      const value = String(pipeline.id || '').trim()
      if (!value) {
        continue
      }
      optionMap.set(value, {
        value,
        label: formatJenkinsPipelineLabel(pipeline),
      })
    }

    jenkinsPipelineOptions.value = Array.from(optionMap.values())
      .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Jenkins管线加载失败'))
  } finally {
    loadingJenkinsPipelines.value = false
  }
}

function handleJenkinsPipelineSearch(value: string) {
  jenkinsPipelineKeyword.value = String(value || '').trim()
  void ensureJenkinsPipelines(true, jenkinsPipelineKeyword.value)
}

function normalizeFormByRule() {
  if (formState.binding_type === 'ci') {
    formState.provider = 'jenkins'
    return
  }
  formState.provider = 'jenkins'
}

watch(
  () => formState.binding_type,
  () => {
    normalizeFormByRule()
    if (isUsingJenkins.value) {
      void ensureJenkinsPipelines(false, jenkinsPipelineKeyword.value)
    }
  },
)

watch(
  () => formState.provider,
  () => {
    normalizeFormByRule()
    if (isUsingJenkins.value) {
      void ensureJenkinsPipelines(false, jenkinsPipelineKeyword.value)
    }
  },
)

function resetFormState() {
  formState.id = ''
  formState.binding_type = 'ci'
  formState.provider = 'jenkins'
  formState.pipeline_id = ''
  formState.trigger_mode = 'manual'
  formState.status = 'active'
  jenkinsPipelineKeyword.value = ''
}

function openCreateModal() {
  const hasCI = existingBindingTypes.value.has('ci')
  const hasCD = existingBindingTypes.value.has('cd')
  if (hasCI && hasCD) {
    message.warning('当前应用已存在 CI 与 CD 绑定，无需重复创建')
    return
  }

  formMode.value = 'create'
  resetFormState()
  if (hasCI && !hasCD) {
    formState.binding_type = 'cd'
    formState.provider = 'jenkins'
  }
  formVisible.value = true
  void ensureJenkinsPipelines(true, jenkinsPipelineKeyword.value)
}

async function openEditModal(record: PipelineBinding) {
  if (record.provider === 'argocd') {
    message.warning('ArgoCD 已迁移到发布模板中配置，请删除该绑定后在发布模板里启用 ArgoCD。')
    return
  }
  formMode.value = 'edit'
  formSubmitting.value = false
  try {
    const response = await getPipelineBindingByID(record.id)
    const item = response.data
    formState.id = item.id
    formState.binding_type = item.binding_type
    formState.provider = item.provider
    formState.pipeline_id = item.pipeline_id || ''
    formState.trigger_mode = item.trigger_mode
    formState.status = item.status
    normalizeFormByRule()
    formVisible.value = true
    if (isUsingJenkins.value) {
      await ensureJenkinsPipelines(true, jenkinsPipelineKeyword.value)
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '绑定详情加载失败'))
  }
}

function closeFormModal() {
  formVisible.value = false
  resetFormState()
}

async function submitForm() {
  await formRef.value?.validate()
  normalizeFormByRule()

  const payloadBase = {
    provider: formState.binding_type === 'ci' ? 'jenkins' : formState.provider,
    pipeline_id: isUsingJenkins.value ? formState.pipeline_id.trim() || undefined : undefined,
    trigger_mode: formState.trigger_mode,
    status: formState.status,
  } as const

  formSubmitting.value = true
  try {
    if (formMode.value === 'create') {
      await createPipelineBinding(applicationID.value, {
        binding_type: formState.binding_type,
        ...payloadBase,
      })
      message.success('绑定创建成功')
    } else {
      await updatePipelineBinding(formState.id, payloadBase)
      message.success('绑定更新成功')
    }
    formVisible.value = false
    await loadBindings()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, formMode.value === 'create' ? '绑定创建失败' : '绑定更新失败'))
  } finally {
    formSubmitting.value = false
  }
}

async function openDetailDrawer(record: PipelineBinding) {
  detailVisible.value = true
  detailLoading.value = true
  detailData.value = null
  try {
    const response = await getPipelineBindingByID(record.id)
    detailData.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '绑定详情加载失败'))
    detailVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

function closeDetailDrawer() {
  detailVisible.value = false
  detailData.value = null
}

async function handleDelete(record: PipelineBinding) {
  deletingID.value = record.id
  try {
    await deletePipelineBinding(record.id)
    message.success('绑定删除成功')
    if (dataSource.value.length === 1 && filters.page > 1) {
      filters.page -= 1
    }
    await loadBindings()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '绑定删除失败'))
  } finally {
    deletingID.value = ''
  }
}

function handleSearch() {
  filters.page = 1
  void loadBindings()
}

function handleReset() {
  filters.binding_type = ''
  filters.provider = ''
  filters.status = ''
  filters.page = 1
  filters.pageSize = 20
  void loadBindings()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadBindings()
}

const pipelineFieldRules = [
  {
    validator: async (_rule: unknown, value: string) => {
      if (isUsingJenkins.value && !String(value || '').trim()) {
        return Promise.reject(new Error('请选择 Jenkins 管线'))
      }
      return Promise.resolve()
    },
  },
]

onMounted(async () => {
  await Promise.all([loadApplication(), loadBindings(), loadTemplateAvailability()])
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="header-left">
        <a-button type="link" @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回应用列表
        </a-button>
        <div>
          <h2 class="page-title">{{ pageTitle }}</h2>
          <p class="page-subtitle">应用ID：{{ applicationID }}</p>
        </div>
      </div>
      <a-button v-if="canManageBinding" type="primary" @click="openCreateModal">
        <template #icon>
          <PlusOutlined />
        </template>
        新增绑定
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="类型">
          <a-select
            v-model:value="filters.binding_type"
            class="filter-select"
            allow-clear
            placeholder="全部"
            :options="[
              { label: 'ci', value: 'ci' },
              { label: 'cd', value: 'cd' },
            ]"
          />
        </a-form-item>
        <a-form-item label="提供方">
          <a-select
            v-model:value="filters.provider"
            class="filter-select"
            allow-clear
            placeholder="全部"
            :options="[{ label: 'jenkins', value: 'jenkins' }]"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="filters.status"
            class="filter-select"
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
        :scroll="{ x: 1700 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatTime(record.updated_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openDetailDrawer(record)">查看</a-button>
              <a-button v-if="canManageBinding" type="link" size="small" @click="openEditModal(record)">编辑</a-button>
              <a-button
                v-if="canViewPipelineParams"
                type="link"
                size="small"
                :disabled="record.provider !== 'jenkins'"
                @click="toExecutorParams(record)"
              >
                执行器参数
              </a-button>
              <a-button type="link" size="small" :disabled="!canCreateReleaseForBinding(record.id)" @click="toCreateRelease(record)">
                发布
              </a-button>
              <a-popconfirm
                v-if="canManageBinding"
                title="确认删除当前绑定吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button type="link" size="small" danger :loading="deletingID === record.id">删除</a-button>
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
      :open="formVisible"
      :width="760"
      :confirm-loading="formSubmitting"
      :title="formMode === 'create' ? '新增绑定' : '编辑绑定'"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm"
      @cancel="closeFormModal"
    >
      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-form-item
          label="绑定类型"
          name="binding_type"
          :rules="[{ required: true, message: '请选择绑定类型' }]"
        >
          <a-select v-model:value="formState.binding_type" :disabled="formMode === 'edit'" :options="bindingTypeOptions" />
        </a-form-item>

        <a-form-item label="提供方" name="provider" :rules="[{ required: true, message: '请选择提供方' }]">
          <a-select
            v-model:value="formState.provider"
            disabled
            :options="[{ label: 'jenkins', value: 'jenkins' }]"
          />
        </a-form-item>

        <a-form-item label="Jenkins 管线" name="pipeline_id" :rules="pipelineFieldRules">
          <a-select
            v-model:value="formState.pipeline_id"
            :disabled="!isUsingJenkins"
            allow-clear
            show-search
            :filter-option="false"
            :loading="loadingJenkinsPipelines"
            :options="jenkinsPipelineOptions"
            placeholder="请选择 Jenkins 管线"
            @search="handleJenkinsPipelineSearch"
          />
        </a-form-item>

        <a-form-item
          label="触发方式"
          name="trigger_mode"
          :rules="[{ required: true, message: '请选择触发方式' }]"
        >
          <a-select
            v-model:value="formState.trigger_mode"
            :options="[
              { label: 'manual', value: 'manual' },
              { label: 'webhook', value: 'webhook' },
            ]"
          />
        </a-form-item>

        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select
            v-model:value="formState.status"
            :options="[
              { label: 'active', value: 'active' },
              { label: 'inactive', value: 'inactive' },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-drawer :open="detailVisible" title="绑定详情" width="640" @close="closeDetailDrawer">
      <a-skeleton v-if="detailLoading" active :paragraph="{ rows: 8 }" />
      <a-descriptions v-else-if="detailData" :column="1" bordered>
        <a-descriptions-item label="绑定ID">{{ detailData.id }}</a-descriptions-item>
        <a-descriptions-item label="管线名称">{{ detailData.name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="应用名称">{{ detailData.application_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="应用ID">{{ detailData.application_id }}</a-descriptions-item>
        <a-descriptions-item label="类型">{{ detailData.binding_type }}</a-descriptions-item>
        <a-descriptions-item label="提供方">{{ detailData.provider }}</a-descriptions-item>
        <a-descriptions-item label="执行器参数">
          <a-button
            type="link"
            class="detail-link-button"
            :disabled="detailData.provider !== 'jenkins'"
            @click="toExecutorParams(detailData)"
          >
            <template #icon>
              <LinkOutlined />
            </template>
            查看执行器参数
          </a-button>
        </a-descriptions-item>
        <a-descriptions-item label="pipeline_id">{{ detailData.pipeline_id || '-' }}</a-descriptions-item>
        <a-descriptions-item label="触发方式">{{ detailData.trigger_mode }}</a-descriptions-item>
        <a-descriptions-item label="状态">{{ detailData.status }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ formatTime(detailData.created_at) }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{ formatTime(detailData.updated_at) }}</a-descriptions-item>
      </a-descriptions>
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

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-card,
.table-card {
  border-radius: var(--radius-xl);
}

.filter-form {
  display: flex;
  gap: 8px;
}

.filter-select {
  width: 140px;
}

.danger-icon {
  color: #ff4d4f;
}

.detail-link-button {
  padding-inline: 0;
}

.gitops-hint-alert {
  margin-bottom: 16px;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1024px) {
  .page-header {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .page-header,
  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
