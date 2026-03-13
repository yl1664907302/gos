<script setup lang="ts">
import { LinkOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApplicationByID, listApplications } from '../../api/application'
import {
  getPipelineParamDefByID,
  listApplicationPipelineParamDefs,
  listPipelineBindings,
  updatePipelineParamDef,
} from '../../api/pipeline'
import { listPlatformParamDicts } from '../../api/platform-param'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { Application } from '../../types/application'
import type { BindingType, PipelineBinding, PipelineParamDef } from '../../types/pipeline'
import type { PlatformParamDict } from '../../types/platform-param'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface MappingFormState {
  id: string
  executor_param_name: string
  param_key?: string
}

interface ApplicationOption {
  label: string
  value: string
}

interface PlatformParamOption {
  label: string
  value: string
}

interface RouteBindingHint {
  id: string
  pipeline_id: string
  pipeline_name: string
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const applicationsLoading = ref(false)
const mappingOptionsLoading = ref(false)
const mappingSubmitting = ref(false)

const dataSource = ref<PipelineParamDef[]>([])
const total = ref(0)
const applicationOptions = ref<ApplicationOption[]>([])
const selectedApplication = ref<Application | null>(null)
const selectedBinding = ref<PipelineBinding | null>(null)
const routeBindingHint = ref<RouteBindingHint | null>(null)

const detailVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref<PipelineParamDef | null>(null)

const mappingVisible = ref(false)
const mappingFormRef = ref<FormInstance>()
const mappingOptions = ref<PlatformParamOption[]>([])

const filters = reactive({
  application_id: '',
  binding_type: 'ci' as BindingType,
  param_key: '',
  visible: '' as '' | 'true' | 'false',
  editable: '' as '' | 'true' | 'false',
  page: 1,
  pageSize: 20,
})

const mappingForm = reactive<MappingFormState>({
  id: '',
  executor_param_name: '',
  param_key: undefined,
})

const initialColumns: TableColumnsType<PipelineParamDef> = [
  { title: '所属管线', dataIndex: 'pipeline_name', key: 'pipeline_name', width: 220 },
  { title: '真实参数名', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 220 },
  { title: '平台标准 Key', dataIndex: 'param_key', key: 'param_key', width: 180 },
  { title: '参数类型', dataIndex: 'param_type', key: 'param_type', width: 120 },
  { title: '必填', dataIndex: 'required', key: 'required', width: 90 },
  { title: '默认值', dataIndex: 'default_value', key: 'default_value', width: 180, ellipsis: true },
  { title: '参数描述', dataIndex: 'description', key: 'description', width: 240, ellipsis: true },
  { title: '展示', dataIndex: 'visible', key: 'visible', width: 90 },
  { title: '可编辑', dataIndex: 'editable', key: 'editable', width: 90 },
  { title: '来源', dataIndex: 'source_from', key: 'source_from', width: 140 },
  { title: '排序', dataIndex: 'sort_no', key: 'sort_no', width: 90 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 90, maxWidth: 520, hitArea: 10 })

const pageSubtitle = computed(() => {
  if (!selectedApplication.value) {
    return '请选择应用后查看其已绑定 Jenkins 管线的真实参数。'
  }
  if (selectedPipelineLabel.value !== '-') {
    return `当前应用：${selectedApplication.value.name}（${selectedApplication.value.key}） · 所属管线：${selectedPipelineLabel.value}`
  }
  return `当前应用：${selectedApplication.value.name}（${selectedApplication.value.key}）`
})

const selectedPipelineLabel = computed(() => {
  return (
    selectedBinding.value?.name?.trim() ||
    routeBindingHint.value?.pipeline_name?.trim() ||
    selectedBinding.value?.pipeline_id?.trim() ||
    routeBindingHint.value?.pipeline_id?.trim() ||
    '-'
  )
})

const emptyDescription = computed(() => {
  if (!filters.application_id) {
    return '请先选择应用'
  }
  return '当前应用暂无可展示的 Jenkins 管线参数'
})

function formatTime(value: string) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function boolText(value: boolean) {
  return value ? '是' : '否'
}

function parseBooleanFilter(value: '' | 'true' | 'false') {
  if (value === '') {
    return undefined
  }
  return value === 'true'
}

function syncRouteQuery() {
  const nextQuery: Record<string, string> = {}
  if (filters.application_id) {
    nextQuery.application_id = filters.application_id
  }
  if (filters.binding_type) {
    nextQuery.binding_type = filters.binding_type
  }
  routeBindingHint.value = null
  void router.replace({ path: '/components/pipeline-params', query: nextQuery })
}

function applyRouteQuery() {
  const applicationID = String(route.query.application_id || '').trim()
  const bindingType = String(route.query.binding_type || '').trim()
  if (applicationID) {
    filters.application_id = applicationID
  }
  if (bindingType === 'ci' || bindingType === 'cd') {
    filters.binding_type = bindingType
  }
  const pipelineBindingID = String(route.query.pipeline_binding_id || '').trim()
  const pipelineID = String(route.query.pipeline_id || '').trim()
  const pipelineName = String(route.query.pipeline_name || '').trim()
  routeBindingHint.value =
    pipelineBindingID || pipelineID || pipelineName
      ? {
          id: pipelineBindingID,
          pipeline_id: pipelineID,
          pipeline_name: pipelineName,
        }
      : null
}

async function loadApplicationsForSelect() {
  applicationsLoading.value = true
  try {
    const response = await listApplications({ page: 1, page_size: 100 })
    applicationOptions.value = response.data.map((item) => ({
      value: item.id,
      label: `${item.name} (${item.key})`,
    }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用下拉加载失败'))
  } finally {
    applicationsLoading.value = false
  }
}

async function ensureSelectedApplication() {
  if (!filters.application_id) {
    selectedApplication.value = null
    return
  }

  if (selectedApplication.value?.id === filters.application_id) {
    return
  }

  try {
    const response = await getApplicationByID(filters.application_id)
    selectedApplication.value = response.data
    const exists = applicationOptions.value.some((item) => item.value === response.data.id)
    if (!exists) {
      applicationOptions.value.unshift({
        value: response.data.id,
        label: `${response.data.name} (${response.data.key})`,
      })
    }
  } catch (error) {
    selectedApplication.value = null
    message.error(extractHTTPErrorMessage(error, '应用信息加载失败'))
  }
}

async function loadPlatformParamOptions(currentParamKey = '') {
  mappingOptionsLoading.value = true
  try {
    const response = await listPlatformParamDicts({
      status: 1,
      page: 1,
      page_size: 100,
    })
    const options = response.data.map((item: PlatformParamDict) => ({
      value: item.param_key,
      label: `${item.name} (${item.param_key})`,
    }))
    if (currentParamKey && !options.some((item) => item.value === currentParamKey)) {
      options.unshift({
        value: currentParamKey,
        label: `${currentParamKey} (当前值)`,
      })
    }
    mappingOptions.value = options
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字库下拉加载失败'))
  } finally {
    mappingOptionsLoading.value = false
  }
}

async function loadSelectedBinding() {
  if (!filters.application_id) {
    selectedBinding.value = null
    return
  }

  try {
    const response = await listPipelineBindings(filters.application_id, {
      binding_type: filters.binding_type,
      provider: 'jenkins',
      page: 1,
      page_size: 1,
    })
    selectedBinding.value = response.data[0] ?? null
  } catch (error) {
    selectedBinding.value = null
    message.error(extractHTTPErrorMessage(error, '所属管线信息加载失败'))
  }
}

async function loadPipelineParams() {
  if (!filters.application_id) {
    dataSource.value = []
    total.value = 0
    selectedBinding.value = null
    return
  }

  await ensureSelectedApplication()
  await loadSelectedBinding()
  loading.value = true
  try {
    const response = await listApplicationPipelineParamDefs(filters.application_id, {
      binding_type: filters.binding_type,
      param_key: filters.param_key.trim() || undefined,
      visible: parseBooleanFilter(filters.visible),
      editable: parseBooleanFilter(filters.editable),
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    dataSource.value = []
    total.value = 0
    message.error(extractHTTPErrorMessage(error, '管线参数加载失败'))
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  syncRouteQuery()
  void loadPipelineParams()
}

function handleReset() {
  filters.binding_type = 'ci'
  filters.param_key = ''
  filters.visible = ''
  filters.editable = ''
  filters.page = 1
  filters.pageSize = 20
  syncRouteQuery()
  if (!filters.application_id) {
    dataSource.value = []
    total.value = 0
    return
  }
  void loadPipelineParams()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadPipelineParams()
}

function handleApplicationChange(value: string) {
  filters.application_id = value
  filters.page = 1
  selectedApplication.value = null
  selectedBinding.value = null
  syncRouteQuery()
  void loadPipelineParams()
}

function handleBindingTypeChange(value: BindingType) {
  filters.binding_type = value
  filters.page = 1
  selectedBinding.value = null
  syncRouteQuery()
  if (!filters.application_id) {
    return
  }
  void loadPipelineParams()
}

async function openDetailDrawer(record: PipelineParamDef) {
  detailVisible.value = true
  detailLoading.value = true
  detailData.value = null
  try {
    const response = await getPipelineParamDefByID(record.id)
    detailData.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '参数详情加载失败'))
    detailVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

function closeDetailDrawer() {
  detailVisible.value = false
  detailData.value = null
}

async function openMappingModal(record: PipelineParamDef) {
  mappingSubmitting.value = false
  try {
    const response = await getPipelineParamDefByID(record.id)
    const item = response.data
    mappingForm.id = item.id
    mappingForm.executor_param_name = item.executor_param_name
    mappingForm.param_key = item.param_key || undefined
    await loadPlatformParamOptions(item.param_key)
    mappingVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '参数详情加载失败'))
  }
}

function closeMappingModal() {
  mappingVisible.value = false
  mappingForm.id = ''
  mappingForm.executor_param_name = ''
  mappingForm.param_key = undefined
}

async function submitMapping() {
  await mappingFormRef.value?.validate()
  mappingSubmitting.value = true
  try {
    await updatePipelineParamDef(mappingForm.id, {
      param_key: String(mappingForm.param_key || '').trim(),
    })
    message.success('平台标准参数映射更新成功')
    closeMappingModal()
    await loadPipelineParams()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '平台标准参数映射更新失败'))
  } finally {
    mappingSubmitting.value = false
  }
}

onMounted(async () => {
  applyRouteQuery()
  await loadApplicationsForSelect()
  if (filters.application_id) {
    await ensureSelectedApplication()
    await loadPipelineParams()
  }
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">管线参数</h2>
        <p class="page-subtitle">{{ pageSubtitle }}</p>
      </div>
      <a-button
        v-if="filters.application_id"
        @click="router.push(`/applications/${filters.application_id}/pipeline-bindings`)"
      >
        <template #icon>
          <LinkOutlined />
        </template>
        查看管线绑定
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="应用">
          <a-select
            v-model:value="filters.application_id"
            class="application-select"
            show-search
            allow-clear
            option-filter-prop="label"
            placeholder="请选择应用"
            :loading="applicationsLoading"
            :options="applicationOptions"
            @change="handleApplicationChange"
          />
        </a-form-item>
        <a-form-item label="绑定类型">
          <a-select
            v-model:value="filters.binding_type"
            class="filter-select"
            :options="[
              { label: 'ci', value: 'ci' },
              { label: 'cd', value: 'cd' },
            ]"
            @change="handleBindingTypeChange"
          />
        </a-form-item>
        <a-form-item label="平台标准 Key">
          <a-input v-model:value="filters.param_key" allow-clear placeholder="按平台标准 Key 查询" />
        </a-form-item>
        <a-form-item label="展示">
          <a-select
            v-model:value="filters.visible"
            class="filter-select"
            allow-clear
            placeholder="全部"
            :options="[
              { label: '是', value: 'true' },
              { label: '否', value: 'false' },
            ]"
          />
        </a-form-item>
        <a-form-item label="可编辑">
          <a-select
            v-model:value="filters.editable"
            class="filter-select"
            allow-clear
            placeholder="全部"
            :options="[
              { label: '是', value: 'true' },
              { label: '否', value: 'false' },
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
      <a-empty v-if="!filters.application_id" :description="emptyDescription" />
      <template v-else>
        <a-table
          row-key="id"
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="false"
          :scroll="{ x: 1760 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'required'">
              {{ boolText(record.required) }}
            </template>
            <template v-else-if="column.key === 'pipeline_name'">
              {{ selectedPipelineLabel }}
            </template>
            <template v-else-if="column.key === 'visible'">
              {{ boolText(record.visible) }}
            </template>
            <template v-else-if="column.key === 'editable'">
              {{ boolText(record.editable) }}
            </template>
            <template v-else-if="column.key === 'param_key'">
              {{ record.param_key || '-' }}
            </template>
            <template v-else-if="column.key === 'default_value'">
              {{ record.default_value || '-' }}
            </template>
            <template v-else-if="column.key === 'description'">
              {{ record.description || '-' }}
            </template>
            <template v-else-if="column.key === 'updated_at'">
              {{ formatTime(record.updated_at) }}
            </template>
            <template v-else-if="column.key === 'actions'">
              <a-space>
                <a-button type="link" size="small" @click="openDetailDrawer(record)">查看</a-button>
                <a-button type="link" size="small" @click="openMappingModal(record)">编辑映射</a-button>
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
      </template>
    </a-card>

    <a-modal
      :open="mappingVisible"
      :confirm-loading="mappingSubmitting"
      title="编辑平台标准参数映射"
      width="640"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitMapping"
      @cancel="closeMappingModal"
    >
      <a-form ref="mappingFormRef" :model="mappingForm" layout="vertical">
        <a-form-item label="真实参数名">
          <a-input :value="mappingForm.executor_param_name" disabled />
        </a-form-item>
        <a-form-item label="平台标准参数 Key" name="param_key">
          <a-select
            v-model:value="mappingForm.param_key"
            allow-clear
            show-search
            option-filter-prop="label"
            placeholder="请选择平台标准字段，也可清空取消映射"
            :loading="mappingOptionsLoading"
            :options="mappingOptions"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-drawer :open="detailVisible" title="管线参数详情" width="720" @close="closeDetailDrawer">
      <a-skeleton v-if="detailLoading" active :paragraph="{ rows: 10 }" />
      <a-descriptions v-else-if="detailData" :column="1" bordered>
        <a-descriptions-item label="参数 ID">{{ detailData.id }}</a-descriptions-item>
        <a-descriptions-item label="所属管线">
          {{ selectedPipelineLabel !== '-' ? selectedPipelineLabel : detailData.pipeline_id }}
        </a-descriptions-item>
        <a-descriptions-item label="管线 ID">{{ detailData.pipeline_id }}</a-descriptions-item>
        <a-descriptions-item label="执行器类型">{{ detailData.executor_type }}</a-descriptions-item>
        <a-descriptions-item label="真实参数名">{{ detailData.executor_param_name }}</a-descriptions-item>
        <a-descriptions-item label="平台标准 Key">{{ detailData.param_key || '-' }}</a-descriptions-item>
        <a-descriptions-item label="参数类型">{{ detailData.param_type }}</a-descriptions-item>
        <a-descriptions-item label="必填">{{ boolText(detailData.required) }}</a-descriptions-item>
        <a-descriptions-item label="默认值">{{ detailData.default_value || '-' }}</a-descriptions-item>
        <a-descriptions-item label="参数描述">{{ detailData.description || '-' }}</a-descriptions-item>
        <a-descriptions-item label="展示">{{ boolText(detailData.visible) }}</a-descriptions-item>
        <a-descriptions-item label="可编辑">{{ boolText(detailData.editable) }}</a-descriptions-item>
        <a-descriptions-item label="来源">{{ detailData.source_from }}</a-descriptions-item>
        <a-descriptions-item label="排序">{{ detailData.sort_no }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ formatTime(detailData.created_at) }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{ formatTime(detailData.updated_at) }}</a-descriptions-item>
        <a-descriptions-item label="原始结构">
          <pre class="raw-meta-block">{{ detailData.raw_meta || '{}' }}</pre>
        </a-descriptions-item>
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

.filter-card,
.table-card {
  border-radius: var(--radius-xl);
}

.filter-form {
  display: flex;
  gap: 8px;
}

.application-select {
  width: 260px;
}

.filter-select {
  width: 140px;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.raw-meta-block {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'SFMono-Regular', 'Menlo', monospace;
}

@media (max-width: 1024px) {
  .page-header {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .application-select {
    width: 100%;
  }
}
</style>
