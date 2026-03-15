<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { listApplications } from '../../api/application'
import { listPipelineBindings, listApplicationPipelineParamDefs } from '../../api/pipeline'
import {
  createReleaseTemplate,
  deleteReleaseTemplate,
  getReleaseTemplateByID,
  listReleaseTemplates,
  updateReleaseTemplate,
} from '../../api/release'
import { listPlatformParamDicts } from '../../api/platform-param'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { PipelineParamDef } from '../../types/pipeline'
import type {
  ReleaseTemplate,
  ReleaseTemplateParam,
  ReleaseTemplatePayload,
  ReleaseTemplateStatus,
  UpdateReleaseTemplatePayload,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

type FormMode = 'create' | 'edit'

interface TemplateFormState {
  id: string
  name: string
  application_id: string
  binding_id: string
  status: ReleaseTemplateStatus
  remark: string
}

const loading = ref(false)
const submitting = ref(false)
const deletingID = ref('')
const dataSource = ref<ReleaseTemplate[]>([])
const total = ref(0)

const modalVisible = ref(false)
const modalMode = ref<FormMode>('create')
const formRef = ref<FormInstance>()
const formState = reactive<TemplateFormState>({
  id: '',
  name: '',
  application_id: '',
  binding_id: '',
  status: 'active',
  remark: '',
})

const filters = reactive({
  application_id: '',
  status: '' as '' | ReleaseTemplateStatus,
  page: 1,
  pageSize: 20,
})

const applicationOptions = ref<Array<{ label: string; value: string }>>([])
const bindingOptions = ref<Array<{ label: string; value: string; binding_type: string }>>([])
const selectableParams = ref<PipelineParamDef[]>([])
const selectedParamDefIDs = ref<string[]>([])
const loadingBindings = ref(false)
const loadingParams = ref(false)
const platformParamNameMap = ref<Record<string, string>>({})

const initialColumns: TableColumnsType<ReleaseTemplate> = [
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '应用', dataIndex: 'application_name', key: 'application_name', width: 180 },
  { title: '绑定', dataIndex: 'binding_name', key: 'binding_name', width: 180 },
  { title: '类型', dataIndex: 'binding_type', key: 'binding_type', width: 100 },
  { title: '参数数', dataIndex: 'param_count', key: 'param_count', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 180 },
  { title: '操作', key: 'actions', width: 200, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 560, hitArea: 10 })

const selectableParamColumns: TableColumnsType<PipelineParamDef> = [
  { title: '平台字段', key: 'param_name', width: 180 },
  { title: '平台 Key', dataIndex: 'param_key', key: 'param_key', width: 160 },
  { title: '执行器参数', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 200 },
  { title: '必填', dataIndex: 'required', key: 'required', width: 90 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
]

const statusOptions = [
  { label: 'active', value: 'active' },
  { label: 'inactive', value: 'inactive' },
] as const

const modalTitle = computed(() => (modalMode.value === 'create' ? '新增发布模板' : '编辑发布模板'))
const selectedBinding = computed(() => bindingOptions.value.find((item) => item.value === formState.binding_id))

const rowSelection = computed(() => ({
  selectedRowKeys: selectedParamDefIDs.value,
  onChange: (keys: Array<string | number>) => {
    selectedParamDefIDs.value = keys.map((item) => String(item))
  },
}))

async function validateSelectedParamDefs() {
  if (selectedParamDefIDs.value.length > 0) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('请至少选择一个额外参数'))
}

function statusColor(status: ReleaseTemplateStatus) {
  return status === 'active' ? 'green' : 'default'
}

function formatTime(value: string) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function resolvePlatformParamName(paramKey: string) {
  const key = String(paramKey || '').trim().toLowerCase()
  return platformParamNameMap.value[key] || key || '-'
}

function resetFormState() {
  formState.id = ''
  formState.name = ''
  formState.application_id = ''
  formState.binding_id = ''
  formState.status = 'active'
  formState.remark = ''
  bindingOptions.value = []
  selectableParams.value = []
  selectedParamDefIDs.value = []
}

function toCreatePayload(): ReleaseTemplatePayload {
  return {
    name: formState.name.trim(),
    application_id: formState.application_id.trim(),
    binding_id: formState.binding_id.trim(),
    status: formState.status,
    remark: formState.remark.trim() || undefined,
    param_def_ids: selectedParamDefIDs.value,
  }
}

function toUpdatePayload(): UpdateReleaseTemplatePayload {
  return {
    name: formState.name.trim(),
    status: formState.status,
    remark: formState.remark.trim() || undefined,
    param_def_ids: selectedParamDefIDs.value,
  }
}

async function loadPlatformParamMap() {
  try {
    const response = await listPlatformParamDicts({ page: 1, page_size: 200 })
    const next: Record<string, string> = {}
    response.data.forEach((item) => {
      next[item.param_key] = item.name
    })
    platformParamNameMap.value = next
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字库加载失败'))
  }
}

async function loadApplications() {
  try {
    const response = await listApplications({ page: 1, page_size: 200 })
    applicationOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用下拉加载失败'))
  }
}

async function loadTemplates() {
  loading.value = true
  try {
    const response = await listReleaseTemplates({
      application_id: filters.application_id || undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布模板加载失败'))
  } finally {
    loading.value = false
  }
}

async function loadBindings(applicationID: string) {
  const appID = String(applicationID || '').trim()
  if (!appID) {
    bindingOptions.value = []
    selectableParams.value = []
    selectedParamDefIDs.value = []
    return
  }
  loadingBindings.value = true
  try {
    const response = await listPipelineBindings(appID, {
      status: 'active',
      page: 1,
      page_size: 100,
    })
    bindingOptions.value = response.data.map((item) => ({
      label: `${item.name || item.binding_type} [${item.binding_type}/${item.provider}]`,
      value: item.id,
      binding_type: item.binding_type,
    }))
  } catch (error) {
    bindingOptions.value = []
    message.error(extractHTTPErrorMessage(error, '绑定下拉加载失败'))
  } finally {
    loadingBindings.value = false
  }
}

async function loadSelectableParams() {
  if (!formState.application_id || !selectedBinding.value) {
    selectableParams.value = []
    selectedParamDefIDs.value = []
    return
  }
  loadingParams.value = true
  try {
    const response = await listApplicationPipelineParamDefs(formState.application_id, {
      binding_type: selectedBinding.value.binding_type as 'ci' | 'cd',
      status: 'active',
      page: 1,
      page_size: 200,
    })
    selectableParams.value = response.data.filter((item) => String(item.param_key || '').trim().toLowerCase() !== '')
  } catch (error) {
    selectableParams.value = []
    message.error(extractHTTPErrorMessage(error, '模板可选参数加载失败'))
  } finally {
    loadingParams.value = false
  }
}

async function handleApplicationChange(value: string | undefined) {
  formState.application_id = String(value || '')
  formState.binding_id = ''
  selectedParamDefIDs.value = []
  await loadBindings(formState.application_id)
}

async function handleBindingChange(value: string | undefined) {
  formState.binding_id = String(value || '')
  selectedParamDefIDs.value = []
  await loadSelectableParams()
}

function handleSearch() {
  filters.page = 1
  void loadTemplates()
}

function handleReset() {
  filters.application_id = ''
  filters.status = ''
  filters.page = 1
  filters.pageSize = 20
  void loadTemplates()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadTemplates()
}

function openCreateModal() {
  modalMode.value = 'create'
  resetFormState()
  modalVisible.value = true
}

async function openEditModal(record: ReleaseTemplate) {
  modalMode.value = 'edit'
  resetFormState()
  try {
    const response = await getReleaseTemplateByID(record.id)
    const { template, params } = response.data
    formState.id = template.id
    formState.name = template.name
    formState.application_id = template.application_id
    formState.binding_id = template.binding_id
    formState.status = template.status
    formState.remark = template.remark
    await loadBindings(formState.application_id)
    await loadSelectableParams()
    selectedParamDefIDs.value = params.map((item: ReleaseTemplateParam) => item.pipeline_param_def_id)
    modalVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布模板详情加载失败'))
  }
}

function closeModal() {
  modalVisible.value = false
  resetFormState()
}

async function submitForm() {
  await formRef.value?.validate()
  submitting.value = true
  try {
    if (modalMode.value === 'create') {
      await createReleaseTemplate(toCreatePayload())
      message.success('发布模板创建成功')
    } else {
      await updateReleaseTemplate(formState.id, toUpdatePayload())
      message.success('发布模板更新成功')
    }
    closeModal()
    await loadTemplates()
  } catch (error) {
    message.error(
      extractHTTPErrorMessage(error, modalMode.value === 'create' ? '发布模板创建失败' : '发布模板更新失败'),
    )
  } finally {
    submitting.value = false
  }
}

async function handleDelete(record: ReleaseTemplate) {
  deletingID.value = record.id
  try {
    await deleteReleaseTemplate(record.id)
    message.success('发布模板删除成功')
    if (dataSource.value.length === 1 && filters.page > 1) {
      filters.page -= 1
    }
    await loadTemplates()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布模板删除失败'))
  } finally {
    deletingID.value = ''
  }
}

onMounted(async () => {
  await Promise.all([loadPlatformParamMap(), loadApplications()])
  await loadTemplates()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">发布模板</h2>
        <p class="page-subtitle">为应用绑定管线挑选发布参数，创建统一可复用的发布模板；同一管线选择仅允许一个启用模板。</p>
      </div>
      <a-button type="primary" @click="openCreateModal">
        <template #icon>
          <PlusOutlined />
        </template>
        新增发布模板
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="应用">
          <a-select
            v-model:value="filters.application_id"
            class="filter-select-wide"
            allow-clear
            show-search
            option-filter-prop="label"
            placeholder="全部应用"
            :options="applicationOptions"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="filters.status" class="filter-select" allow-clear placeholder="全部" :options="statusOptions" />
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
          <template v-else-if="column.key === 'updated_at'">
            {{ formatTime(record.updated_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
              <a-popconfirm
                title="确认删除当前发布模板吗？"
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
      :open="modalVisible"
      :confirm-loading="submitting"
      :title="modalTitle"
      :width="900"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm"
      @cancel="closeModal"
    >
      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="模板名称" name="name" :rules="[{ required: true, message: '请输入模板名称' }]">
              <a-input v-model:value="formState.name" allow-clear placeholder="例如：默认 CD 发布模板" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
              <a-select v-model:value="formState.status" :options="statusOptions" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="应用" name="application_id" :rules="[{ required: true, message: '请选择应用' }]">
              <a-select
                v-model:value="formState.application_id"
                :disabled="modalMode === 'edit'"
                show-search
                option-filter-prop="label"
                placeholder="请选择应用"
                :options="applicationOptions"
                @change="handleApplicationChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="管线绑定" name="binding_id" :rules="[{ required: true, message: '请选择管线绑定' }]">
              <a-select
                v-model:value="formState.binding_id"
                :disabled="modalMode === 'edit'"
                show-search
                option-filter-prop="label"
                placeholder="请选择管线绑定"
                :loading="loadingBindings"
                :options="bindingOptions"
                @change="handleBindingChange"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formState.remark" :rows="2" allow-clear placeholder="可选，补充模板用途说明" />
        </a-form-item>

        <a-form-item
          label="模板参数"
          name="param_def_ids"
          :rules="[{ validator: validateSelectedParamDefs }]"
        >
          <a-alert
            type="info"
            show-icon
            class="param-alert"
            message="仅支持已映射平台标准 Key 的管线参数，创建发布单时会根据应用与管线选择自动带出。"
          />
          <a-table
            row-key="id"
            size="small"
            :columns="selectableParamColumns"
            :data-source="selectableParams"
            :loading="loadingParams"
            :pagination="false"
            :row-selection="rowSelection"
            :scroll="{ x: 840, y: 320 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'param_name'">
                <div class="param-name-cell">
                  <span class="param-name">{{ resolvePlatformParamName(record.param_key) }}</span>
                  <span class="param-executor">{{ record.executor_param_name }}</span>
                </div>
              </template>
              <template v-else-if="column.key === 'required'">
                <a-tag :color="record.required ? 'orange' : 'default'">{{ record.required ? '是' : '否' }}</a-tag>
              </template>
            </template>
          </a-table>
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

.filter-select {
  width: 140px;
}

.filter-select-wide {
  width: 260px;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.danger-icon {
  color: #ff4d4f;
}

.param-alert {
  margin-bottom: 12px;
}

.param-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.param-name {
  font-weight: 600;
  color: #1f2937;
}

.param-executor {
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
