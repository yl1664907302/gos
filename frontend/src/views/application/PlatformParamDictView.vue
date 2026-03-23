<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  createPlatformParamDict,
  deletePlatformParamDict,
  getPlatformParamDictByID,
  listPlatformParamDicts,
  updatePlatformParamDict,
} from '../../api/platform-param'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type {
  PlatformParamDict,
  PlatformParamDictPayload,
  PlatformParamStatus,
} from '../../types/platform-param'
import { extractHTTPErrorMessage } from '../../utils/http-error'

type FormMode = 'create' | 'edit'

interface FormState extends PlatformParamDictPayload {
  id: string
}

const loading = ref(false)
const submitting = ref(false)
const deletingID = ref('')
const dataSource = ref<PlatformParamDict[]>([])
const total = ref(0)

const detailVisible = ref(false)
const detailLoading = ref(false)
const detailData = ref<PlatformParamDict | null>(null)

const modalVisible = ref(false)
const modalMode = ref<FormMode>('create')
const formRef = ref<FormInstance>()

const filters = reactive({
  param_key: '',
  name: '',
  status: '' as '' | PlatformParamStatus,
  page: 1,
  pageSize: 20,
})

const formState = reactive<FormState>({
  id: '',
  param_key: '',
  name: '',
  description: '',
  param_type: 'string',
  required: false,
  gitops_locator: false,
  cd_self_fill: false,
  status: 1,
})

const initialColumns: TableColumnsType<PlatformParamDict> = [
  { title: '标准 Key', dataIndex: 'param_key', key: 'param_key', width: 180 },
  { title: '字段名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '字段说明', dataIndex: 'description', key: 'description', width: 260, ellipsis: true },
  { title: '字段类型', dataIndex: 'param_type', key: 'param_type', width: 120 },
  { title: '默认必填', dataIndex: 'required', key: 'required', width: 110 },
  { title: 'GitOps定位', dataIndex: 'gitops_locator', key: 'gitops_locator', width: 120 },
  { title: 'CD自填字段', dataIndex: 'cd_self_fill', key: 'cd_self_fill', width: 130 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 220, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 520, hitArea: 10 })

const typeOptions = [
  { label: 'string', value: 'string' },
  { label: 'choice', value: 'choice' },
  { label: 'bool', value: 'bool' },
  { label: 'number', value: 'number' },
] as const

const statusOptions = [
  { label: '启用', value: 1 },
  { label: '停用', value: 0 },
] as const

const modalTitle = computed(() => (modalMode.value === 'create' ? '新增标准字段' : '编辑标准字段'))

function formatTime(value: string) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

function statusText(status: PlatformParamStatus) {
  return status === 1 ? '启用' : '停用'
}

function statusColor(status: PlatformParamStatus) {
  return status === 1 ? 'green' : 'default'
}

function boolText(value: boolean) {
  return value ? '是' : '否'
}

function normalizeParamKey(value: string) {
  return value.trim().toLowerCase()
}

function resetFormState() {
  formState.id = ''
  formState.param_key = ''
  formState.name = ''
  formState.description = ''
  formState.param_type = 'string'
  formState.required = false
  formState.gitops_locator = false
  formState.cd_self_fill = false
  formState.status = 1
}

function toPayload(): PlatformParamDictPayload {
  return {
    param_key: normalizeParamKey(formState.param_key),
    name: formState.name.trim(),
    description: formState.description.trim(),
    param_type: formState.param_type,
    required: formState.required,
    gitops_locator: formState.gitops_locator,
    cd_self_fill: formState.cd_self_fill,
    status: formState.status,
  }
}

async function loadPlatformParams() {
  loading.value = true
  try {
    const response = await listPlatformParamDicts({
      param_key: filters.param_key.trim() || undefined,
      name: filters.name.trim() || undefined,
      status: filters.status === '' ? undefined : filters.status,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字库加载失败'))
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  void loadPlatformParams()
}

function handleReset() {
  filters.param_key = ''
  filters.name = ''
  filters.status = ''
  filters.page = 1
  filters.pageSize = 20
  void loadPlatformParams()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadPlatformParams()
}

function openCreateModal() {
  modalMode.value = 'create'
  resetFormState()
  modalVisible.value = true
}

async function openEditModal(record: PlatformParamDict) {
  modalMode.value = 'edit'
  submitting.value = false
  try {
    const response = await getPlatformParamDictByID(record.id)
    const item = response.data
    formState.id = item.id
    formState.param_key = item.param_key
    formState.name = item.name
    formState.description = item.description
    formState.param_type = item.param_type
    formState.required = item.required
    formState.gitops_locator = item.gitops_locator
    formState.cd_self_fill = item.cd_self_fill
    formState.status = item.status
    modalVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字段详情加载失败'))
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
    const payload = toPayload()
    if (modalMode.value === 'create') {
      await createPlatformParamDict(payload)
      message.success('标准字段创建成功')
    } else {
      await updatePlatformParamDict(formState.id, payload)
      message.success('标准字段更新成功')
    }
    closeModal()
    await loadPlatformParams()
  } catch (error) {
    message.error(
      extractHTTPErrorMessage(error, modalMode.value === 'create' ? '标准字段创建失败' : '标准字段更新失败'),
    )
  } finally {
    submitting.value = false
  }
}

async function openDetailDrawer(record: PlatformParamDict) {
  detailVisible.value = true
  detailLoading.value = true
  detailData.value = null
  try {
    const response = await getPlatformParamDictByID(record.id)
    detailData.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字段详情加载失败'))
    detailVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

function closeDetailDrawer() {
  detailVisible.value = false
  detailData.value = null
}

async function handleDelete(record: PlatformParamDict) {
  deletingID.value = record.id
  try {
    await deletePlatformParamDict(record.id)
    message.success('标准字段删除成功')
    if (dataSource.value.length === 1 && filters.page > 1) {
      filters.page -= 1
    }
    await loadPlatformParams()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字段删除失败'))
  } finally {
    deletingID.value = ''
  }
}

function handleParamKeyInput(value: string) {
  formState.param_key = value.toLowerCase()
}

onMounted(() => {
  void loadPlatformParams()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">标准字库</h2>
        <p class="page-subtitle">统一维护平台标准字段，为执行器参数映射提供下拉数据源。</p>
      </div>
      <a-button type="primary" @click="openCreateModal">
        <template #icon>
          <PlusOutlined />
        </template>
        新增标准字段
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="标准 Key">
          <a-input v-model:value="filters.param_key" allow-clear placeholder="按 param_key 查询" />
        </a-form-item>
        <a-form-item label="字段名称">
          <a-input v-model:value="filters.name" allow-clear placeholder="按字段名称查询" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="filters.status"
            class="filter-select"
            allow-clear
            placeholder="全部"
            :options="statusOptions"
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
        :scroll="{ x: 1540 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'param_key'">
            <span class="param-key-cell">
              <span>{{ record.param_key }}</span>
              <a-tooltip v-if="record.builtin" title="系统内置字段">
                <SafetyCertificateOutlined class="builtin-icon" />
              </a-tooltip>
            </span>
          </template>
          <template v-else-if="column.key === 'required'">
            {{ boolText(record.required) }}
          </template>
          <template v-else-if="column.key === 'gitops_locator'">
            {{ boolText(record.gitops_locator) }}
          </template>
          <template v-else-if="column.key === 'cd_self_fill'">
            {{ boolText(record.cd_self_fill) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ statusText(record.status) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatTime(record.updated_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openDetailDrawer(record)">查看</a-button>
              <template v-if="!record.builtin">
                <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
                <a-popconfirm
                  title="确认删除当前标准字段吗？"
                  ok-text="删除"
                  cancel-text="取消"
                  @confirm="handleDelete(record)"
                >
                  <template #icon>
                    <ExclamationCircleOutlined class="danger-icon" />
                  </template>
                  <a-button type="link" size="small" danger :loading="deletingID === record.id">删除</a-button>
                </a-popconfirm>
              </template>
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
      :width="760"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm"
      @cancel="closeModal"
    >
      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-alert
          v-if="modalMode === 'create'"
          type="info"
          show-icon
          class="modal-alert"
          message="平台手动新增的标准字段默认都是非内置字段。"
        />

        <a-form-item
          label="标准 Key"
          name="param_key"
          :rules="[
            { required: true, message: '请输入标准 Key' },
            {
              pattern: /^[a-z][a-z0-9_]*$/,
              message: 'param_key 必须为小写字母、数字或下划线，且以字母开头',
            },
          ]"
        >
          <a-input
            :value="formState.param_key"
            allow-clear
            placeholder="例如：branch_name"
            @update:value="handleParamKeyInput"
          />
        </a-form-item>

        <a-form-item label="字段名称" name="name" :rules="[{ required: true, message: '请输入字段名称' }]">
          <a-input v-model:value="formState.name" allow-clear placeholder="请输入字段名称" />
        </a-form-item>

        <a-form-item label="字段说明" name="description">
          <a-textarea
            v-model:value="formState.description"
            :rows="3"
            allow-clear
            placeholder="请输入字段说明"
          />
        </a-form-item>

        <a-form-item
          label="字段类型"
          name="param_type"
          :rules="[{ required: true, message: '请选择字段类型' }]"
        >
          <a-select v-model:value="formState.param_type" :options="typeOptions" />
        </a-form-item>

        <a-form-item label="默认必填" name="required">
          <a-switch v-model:checked="formState.required" checked-children="是" un-checked-children="否" />
        </a-form-item>

        <a-form-item label="GitOps 定位字段" name="gitops_locator">
          <a-switch
            v-model:checked="formState.gitops_locator"
            checked-children="是"
            un-checked-children="否"
          />
        </a-form-item>

        <a-form-item label="CD 自填字段" name="cd_self_fill">
          <a-switch
            v-model:checked="formState.cd_self_fill"
            checked-children="是"
            un-checked-children="否"
          />
        </a-form-item>

        <a-form-item label="状态" name="status" :rules="[{ required: true, message: '请选择状态' }]">
          <a-select v-model:value="formState.status" :options="statusOptions" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-drawer :open="detailVisible" title="标准字段详情" width="640" @close="closeDetailDrawer">
      <a-skeleton v-if="detailLoading" active :paragraph="{ rows: 8 }" />
      <a-descriptions v-else-if="detailData" :column="1" bordered>
        <a-descriptions-item label="字段 ID">{{ detailData.id }}</a-descriptions-item>
        <a-descriptions-item label="标准 Key">
          <span class="param-key-cell">
            <span>{{ detailData.param_key }}</span>
            <a-tooltip v-if="detailData.builtin" title="系统内置字段">
              <SafetyCertificateOutlined class="builtin-icon" />
            </a-tooltip>
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="字段名称">{{ detailData.name }}</a-descriptions-item>
        <a-descriptions-item label="字段说明">{{ detailData.description || '-' }}</a-descriptions-item>
        <a-descriptions-item label="字段类型">{{ detailData.param_type }}</a-descriptions-item>
        <a-descriptions-item label="默认必填">{{ boolText(detailData.required) }}</a-descriptions-item>
        <a-descriptions-item label="GitOps 定位字段">{{ boolText(detailData.gitops_locator) }}</a-descriptions-item>
        <a-descriptions-item label="CD 自填字段">{{ boolText(detailData.cd_self_fill) }}</a-descriptions-item>
        <a-descriptions-item label="状态">{{ statusText(detailData.status) }}</a-descriptions-item>
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

.param-key-cell {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.builtin-icon {
  color: #1677ff;
}

.modal-alert {
  margin-bottom: var(--space-4);
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
