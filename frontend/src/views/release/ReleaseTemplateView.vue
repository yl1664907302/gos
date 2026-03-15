<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { listApplications } from '../../api/application'
import { listPlatformParamDicts } from '../../api/platform-param'
import { listPipelineBindings, listApplicationPipelineParamDefs } from '../../api/pipeline'
import {
  createReleaseTemplate,
  deleteReleaseTemplate,
  getReleaseTemplateByID,
  listReleaseTemplates,
  updateReleaseTemplate,
} from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { PipelineBinding, PipelineParamDef } from '../../types/pipeline'
import type {
  ReleasePipelineScope,
  ReleaseTemplate,
  ReleaseTemplateBinding,
  ReleaseTemplatePayload,
  ReleaseTemplateStatus,
  UpdateReleaseTemplatePayload,
} from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

type FormMode = 'create' | 'edit'

type ScopeState = {
  enabled: boolean
  binding_id: string
  selected_param_def_ids: string[]
  selectable_params: PipelineParamDef[]
  loading_params: boolean
}

interface TemplateFormState {
  id: string
  name: string
  application_id: string
  status: ReleaseTemplateStatus
  remark: string
}

interface SelectOption {
  label: string
  value: string
}

interface BindingOption {
  label: string
  value: string
  binding_type: PipelineBinding['binding_type']
  provider: PipelineBinding['provider']
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
  status: 'active',
  remark: '',
})

const scopeStates = reactive<Record<ReleasePipelineScope, ScopeState>>({
  ci: {
    enabled: true,
    binding_id: '',
    selected_param_def_ids: [],
    selectable_params: [],
    loading_params: false,
  },
  cd: {
    enabled: false,
    binding_id: '',
    selected_param_def_ids: [],
    selectable_params: [],
    loading_params: false,
  },
})

const filters = reactive({
  application_id: '',
  status: '' as '' | ReleaseTemplateStatus,
  page: 1,
  pageSize: 20,
})

const applicationOptions = ref<SelectOption[]>([])
const bindingOptions = ref<BindingOption[]>([])
const loadingBindings = ref(false)
const platformParamNameMap = ref<Record<string, string>>({})

const scopeTitles: Record<ReleasePipelineScope, string> = {
  ci: 'CI 配置',
  cd: 'CD 配置',
}

const scopeDescriptions: Record<ReleasePipelineScope, string> = {
  ci: 'CI 固定使用 Jenkins；参数仅允许来自 CI 绑定管线，并且必须已完成平台标准 Key 映射。',
  cd: 'CD 支持 Jenkins 或 ArgoCD；当前只有 Jenkins 类型支持模板参数选择。',
}

const initialColumns: TableColumnsType<ReleaseTemplate> = [
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '应用', dataIndex: 'application_name', key: 'application_name', width: 180 },
  { title: '执行单元', dataIndex: 'binding_name', key: 'binding_name', width: 180 },
  { title: '类型', dataIndex: 'binding_type', key: 'binding_type', width: 120 },
  { title: '参数数', dataIndex: 'param_count', key: 'param_count', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 180 },
  { title: '操作', key: 'actions', width: 200, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 560, hitArea: 10 })

const selectableParamColumns: TableColumnsType<PipelineParamDef> = [
  { title: '平台字段', key: 'param_name', width: 180 },
  { title: '平台 Key', dataIndex: 'param_key', key: 'param_key', width: 160 },
  { title: '执行器参数', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 220 },
  { title: '类型', dataIndex: 'param_type', key: 'param_type', width: 120 },
  { title: '必填', dataIndex: 'required', key: 'required', width: 90 },
  { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
]

const statusOptions = [
  { label: 'active', value: 'active' },
  { label: 'inactive', value: 'inactive' },
] as const

const modalTitle = computed(() => (modalMode.value === 'create' ? '新增发布模板' : '编辑发布模板'))

const bindingOptionsByScope = computed<Record<ReleasePipelineScope, BindingOption[]>>(() => ({
  ci: bindingOptions.value.filter((item) => item.binding_type === 'ci' && item.provider === 'jenkins'),
  cd: bindingOptions.value.filter((item) => item.binding_type === 'cd'),
}))

function selectedBinding(scope: ReleasePipelineScope) {
  return bindingOptionsByScope.value[scope].find((item) => item.value === scopeStates[scope].binding_id)
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

function resetScopeState(scope: ReleasePipelineScope) {
  scopeStates[scope].binding_id = ''
  scopeStates[scope].selected_param_def_ids = []
  scopeStates[scope].selectable_params = []
  scopeStates[scope].loading_params = false
}

function resetFormState() {
  formState.id = ''
  formState.name = ''
  formState.application_id = ''
  formState.status = 'active'
  formState.remark = ''
  scopeStates.ci.enabled = true
  scopeStates.cd.enabled = false
  resetScopeState('ci')
  resetScopeState('cd')
  bindingOptions.value = []
}

function buildPayload(): ReleaseTemplatePayload | UpdateReleaseTemplatePayload {
  return {
    name: formState.name.trim(),
    ...(modalMode.value === 'create' ? { application_id: formState.application_id.trim() } : {}),
    ci_binding_id: scopeStates.ci.enabled ? scopeStates.ci.binding_id.trim() || undefined : undefined,
    cd_binding_id: scopeStates.cd.enabled ? scopeStates.cd.binding_id.trim() || undefined : undefined,
    status: formState.status,
    remark: formState.remark.trim() || undefined,
    ci_param_def_ids: scopeStates.ci.enabled ? [...scopeStates.ci.selected_param_def_ids] : [],
    cd_param_def_ids: scopeStates.cd.enabled ? [...scopeStates.cd.selected_param_def_ids] : [],
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
    resetScopeState('ci')
    resetScopeState('cd')
    return
  }
  loadingBindings.value = true
  try {
    const response = await listPipelineBindings(appID, {
      status: 'active',
      page: 1,
      page_size: 200,
    })
    bindingOptions.value = response.data.map((item) => ({
      label: `${item.name || item.binding_type} [${item.binding_type}/${item.provider}]`,
      value: item.id,
      binding_type: item.binding_type,
      provider: item.provider,
    }))
  } catch (error) {
    bindingOptions.value = []
    message.error(extractHTTPErrorMessage(error, '绑定下拉加载失败'))
  } finally {
    loadingBindings.value = false
  }
}

async function loadSelectableParams(scope: ReleasePipelineScope, preserveSelection = false) {
  const state = scopeStates[scope]
  const appID = formState.application_id.trim()
  const binding = selectedBinding(scope)

  if (!state.enabled || !appID || !binding) {
    state.selectable_params = []
    if (!preserveSelection) {
      state.selected_param_def_ids = []
    }
    return
  }

  if (binding.provider !== 'jenkins') {
    state.selectable_params = []
    state.selected_param_def_ids = []
    return
  }

  state.loading_params = true
  try {
    const response = await listApplicationPipelineParamDefs(appID, {
      binding_type: scope,
      status: 'active',
      page: 1,
      page_size: 200,
    })
    state.selectable_params = response.data.filter((item) => String(item.param_key || '').trim().toLowerCase() !== '')
    const allowed = new Set(state.selectable_params.map((item) => item.id))
    state.selected_param_def_ids = state.selected_param_def_ids.filter((item) => allowed.has(item))
  } catch (error) {
    state.selectable_params = []
    state.selected_param_def_ids = []
    message.error(extractHTTPErrorMessage(error, `${scope.toUpperCase()} 模板参数加载失败`))
  } finally {
    state.loading_params = false
  }
}

async function handleApplicationChange(value: string | undefined) {
  formState.application_id = String(value || '')
  resetScopeState('ci')
  resetScopeState('cd')
  await loadBindings(formState.application_id)
}

async function handleScopeBindingChange(scope: ReleasePipelineScope, value: string | undefined) {
  scopeStates[scope].binding_id = String(value || '')
  scopeStates[scope].selected_param_def_ids = []
  await loadSelectableParams(scope)
}

async function handleScopeEnabledChange(scope: ReleasePipelineScope, checked: boolean) {
  scopeStates[scope].enabled = checked
  if (!checked) {
    resetScopeState(scope)
    return
  }
  await loadSelectableParams(scope)
}

function getRowSelection(scope: ReleasePipelineScope) {
  return {
    selectedRowKeys: scopeStates[scope].selected_param_def_ids,
    onChange: (keys: Array<string | number>) => {
      scopeStates[scope].selected_param_def_ids = keys.map((item) => String(item))
    },
  }
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

function applyBindingsToForm(bindings: ReleaseTemplateBinding[]) {
  const ciBinding = bindings.find((item) => item.pipeline_scope === 'ci' && item.enabled)
  const cdBinding = bindings.find((item) => item.pipeline_scope === 'cd' && item.enabled)

  scopeStates.ci.enabled = Boolean(ciBinding)
  scopeStates.ci.binding_id = ciBinding?.binding_id || ''
  scopeStates.cd.enabled = Boolean(cdBinding)
  scopeStates.cd.binding_id = cdBinding?.binding_id || ''
}

async function openEditModal(record: ReleaseTemplate) {
  modalMode.value = 'edit'
  resetFormState()
  try {
    const response = await getReleaseTemplateByID(record.id)
    const { template, bindings, params } = response.data
    formState.id = template.id
    formState.name = template.name
    formState.application_id = template.application_id
    formState.status = template.status
    formState.remark = template.remark

    await loadBindings(formState.application_id)
    applyBindingsToForm(bindings)

    scopeStates.ci.selected_param_def_ids = params
      .filter((item) => item.pipeline_scope === 'ci')
      .map((item) => item.pipeline_param_def_id)
    scopeStates.cd.selected_param_def_ids = params
      .filter((item) => item.pipeline_scope === 'cd')
      .map((item) => item.pipeline_param_def_id)

    await Promise.all([
      loadSelectableParams('ci', true),
      loadSelectableParams('cd', true),
    ])

    modalVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布模板详情加载失败'))
  }
}

function closeModal() {
  modalVisible.value = false
  resetFormState()
}

function validateScopeState() {
  const enabledScopes = (['ci', 'cd'] as ReleasePipelineScope[]).filter((scope) => scopeStates[scope].enabled)
  if (enabledScopes.length === 0) {
    throw new Error('请至少启用一个执行单元')
  }
  for (const scope of enabledScopes) {
    if (!scopeStates[scope].binding_id.trim()) {
      throw new Error(`请选择 ${scope.toUpperCase()} 绑定管线`)
    }
  }
}

async function submitForm() {
  await formRef.value?.validate()
  try {
    validateScopeState()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '模板配置校验失败')
    return
  }

  submitting.value = true
  try {
    if (modalMode.value === 'create') {
      await createReleaseTemplate(buildPayload() as ReleaseTemplatePayload)
      message.success('发布模板创建成功')
    } else {
      await updateReleaseTemplate(formState.id, buildPayload() as UpdateReleaseTemplatePayload)
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
        <p class="page-subtitle">按应用维护可复用的 CI/CD 发布结构，模板会决定本次发布启用哪些执行单元以及暴露哪些参数。</p>
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
          <template v-else-if="column.key === 'binding_type'">
            {{ record.binding_type || '-' }}
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
      :width="980"
      ok-text="保存"
      cancel-text="取消"
      @ok="submitForm"
      @cancel="closeModal"
    >
      <a-form ref="formRef" :model="formState" layout="vertical">
        <a-card class="scope-card scope-card-base" :bordered="false">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="模板名称" name="name" :rules="[{ required: true, message: '请输入模板名称' }]">
                <a-input v-model:value="formState.name" allow-clear placeholder="例如：标准 CI + CD 发布模板" />
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
              <a-form-item label="备注" name="remark">
                <a-input v-model:value="formState.remark" allow-clear placeholder="可选，补充模板用途说明" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-row :gutter="16">
          <a-col :xs="24" :lg="12">
            <a-card class="scope-card" :bordered="true">
              <template #title>{{ scopeTitles.ci }}</template>
              <template #extra>
                <a-switch :checked="scopeStates.ci.enabled" @change="(checked: boolean) => handleScopeEnabledChange('ci', checked)" />
              </template>

              <a-alert class="scope-alert" type="info" show-icon :message="scopeDescriptions.ci" />

              <a-form-item label="CI 绑定管线" required>
                <a-select
                  v-model:value="scopeStates.ci.binding_id"
                  :disabled="!scopeStates.ci.enabled"
                  show-search
                  allow-clear
                  option-filter-prop="label"
                  placeholder="请选择 CI 绑定管线"
                  :loading="loadingBindings"
                  :options="bindingOptionsByScope.ci"
                  @change="(value: string | undefined) => handleScopeBindingChange('ci', value)"
                />
              </a-form-item>

              <a-alert
                v-if="scopeStates.ci.enabled && selectedBinding('ci')"
                class="scope-binding-alert"
                type="success"
                show-icon
                :message="`当前执行器：${selectedBinding('ci')?.provider}`"
              />

              <div class="scope-table-wrapper">
                <a-table
                  row-key="id"
                  size="small"
                  :columns="selectableParamColumns"
                  :data-source="scopeStates.ci.selectable_params"
                  :loading="scopeStates.ci.loading_params"
                  :pagination="false"
                  :row-selection="getRowSelection('ci')"
                  :scroll="{ x: 860, y: 300 }"
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
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :lg="12">
            <a-card class="scope-card" :bordered="true">
              <template #title>{{ scopeTitles.cd }}</template>
              <template #extra>
                <a-switch :checked="scopeStates.cd.enabled" @change="(checked: boolean) => handleScopeEnabledChange('cd', checked)" />
              </template>

              <a-alert class="scope-alert" type="info" show-icon :message="scopeDescriptions.cd" />

              <a-form-item label="CD 绑定管线">
                <a-select
                  v-model:value="scopeStates.cd.binding_id"
                  :disabled="!scopeStates.cd.enabled"
                  show-search
                  allow-clear
                  option-filter-prop="label"
                  placeholder="请选择 CD 绑定管线"
                  :loading="loadingBindings"
                  :options="bindingOptionsByScope.cd"
                  @change="(value: string | undefined) => handleScopeBindingChange('cd', value)"
                />
              </a-form-item>

              <a-alert
                v-if="scopeStates.cd.enabled && selectedBinding('cd')?.provider !== 'jenkins'"
                class="scope-binding-alert"
                type="warning"
                show-icon
                message="当前 CD 绑定为 ArgoCD，模板参数选择暂不开放；后续发布详情会展示独立的 CD 执行视图。"
              />
              <a-alert
                v-else-if="scopeStates.cd.enabled && selectedBinding('cd')"
                class="scope-binding-alert"
                type="success"
                show-icon
                :message="`当前执行器：${selectedBinding('cd')?.provider}`"
              />

              <div class="scope-table-wrapper">
                <a-table
                  row-key="id"
                  size="small"
                  :columns="selectableParamColumns"
                  :data-source="scopeStates.cd.selectable_params"
                  :loading="scopeStates.cd.loading_params"
                  :pagination="false"
                  :row-selection="getRowSelection('cd')"
                  :scroll="{ x: 860, y: 300 }"
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
              </div>
            </a-card>
          </a-col>
        </a-row>
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
.table-card,
.scope-card {
  border-radius: var(--radius-xl);
}

.scope-card-base {
  margin-bottom: 16px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, rgba(255, 255, 255, 1) 100%);
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

.scope-alert,
.scope-binding-alert {
  margin-bottom: 12px;
}

.scope-table-wrapper {
  min-height: 320px;
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

@media (max-width: 992px) {
  .scope-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
