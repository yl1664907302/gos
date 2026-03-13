<script setup lang="ts">
import { ArrowLeftOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listApplications } from '../../api/application'
import { listPipelineBindings, listApplicationPipelineParamDefs } from '../../api/pipeline'
import { createReleaseOrder } from '../../api/release'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { PipelineParamDef, PipelineBinding } from '../../types/pipeline'
import type { ReleaseTriggerType } from '../../types/release'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface SelectOption {
  label: string
  value: string
}

interface ChoiceMeta {
  options: SelectOption[]
  multiple: boolean
  delimiter: string
}

interface BindingOption {
  label: string
  value: string
  binding_type: PipelineBinding['binding_type']
  provider: PipelineBinding['provider']
}

interface CreateFormState {
  application_id: string
  binding_id: string
  env_code: string
  son_service: string
  git_ref: string
  image_tag: string
  trigger_type: ReleaseTriggerType
  triggered_by: string
  remark: string
}

const route = useRoute()
const router = useRouter()

const formRef = ref<FormInstance>()
const loadingApplications = ref(false)
const loadingBindings = ref(false)
const loadingParamDefs = ref(false)
const submitting = ref(false)

const applicationOptions = ref<SelectOption[]>([])
const bindingOptions = ref<BindingOption[]>([])
const paramDefs = ref<PipelineParamDef[]>([])
const paramValues = reactive<Record<string, string>>({})

const formState = reactive<CreateFormState>({
  application_id: '',
  binding_id: '',
  env_code: 'dev',
  son_service: '',
  git_ref: '',
  image_tag: '',
  trigger_type: 'manual',
  triggered_by: '',
  remark: '',
})

const envOptions = [
  { label: 'dev', value: 'dev' },
  { label: 'test', value: 'test' },
  { label: 'staging', value: 'staging' },
  { label: 'prod', value: 'prod' },
]

const triggerTypeOptions = [
  { label: 'manual', value: 'manual' },
  { label: 'webhook', value: 'webhook' },
  { label: 'schedule', value: 'schedule' },
]

const defaultChoiceMeta: ChoiceMeta = {
  options: [],
  multiple: false,
  delimiter: ',',
}

const selectedBinding = computed(() => {
  return bindingOptions.value.find((item) => item.value === formState.binding_id)
})

const canLoadPipelineParams = computed(() => {
  if (!selectedBinding.value) {
    return false
  }
  return selectedBinding.value.provider === 'jenkins'
})

const paramHintText = computed(() => {
  if (!formState.application_id || !formState.binding_id) {
    return '请选择应用和管线绑定后加载参数。'
  }
  if (!selectedBinding.value) {
    return '当前绑定不存在，请重新选择。'
  }
  if (!canLoadPipelineParams.value) {
    return '当前绑定不是 Jenkins 类型，发布参数区不展示真实参数。'
  }
  return '参数来自该应用已绑定 Jenkins 管线的真实参数定义。'
})

const branchParamDefs = computed(() =>
  paramDefs.value.filter((item) => String(item.param_key || '').trim().toLowerCase() === 'branch'),
)

const projectNameParamDefs = computed(() =>
  paramDefs.value.filter((item) => {
    const paramKey = String(item.param_key || '').trim().toLowerCase()
    const executorName = String(item.executor_param_name || '').trim().toLowerCase()
    return paramKey === 'project_name' || executorName === 'project_name'
  }),
)

const gitRefOptions = computed<SelectOption[]>(() => {
  const result: SelectOption[] = []
  const seen = new Set<string>()

  const appendValue = (value: string) => {
    const next = String(value || '').trim()
    if (!next || seen.has(next)) {
      return
    }
    seen.add(next)
    result.push({ label: next, value: next })
  }

  for (const item of branchParamDefs.value) {
    const meta = getChoiceMeta(item)
    meta.options.forEach((option) => appendValue(option.value))
    appendValue(item.default_value)
    appendValue(paramValues[item.id] || '')
  }
  appendValue(formState.git_ref)
  return result
})

const sonServiceOptions = computed<SelectOption[]>(() => {
  const result: SelectOption[] = []
  const seen = new Set<string>()

  const appendValue = (value: string) => {
    const next = String(value || '').trim()
    if (!next || seen.has(next)) {
      return
    }
    seen.add(next)
    result.push({ label: next, value: next })
  }

  for (const item of projectNameParamDefs.value) {
    const meta = getChoiceMeta(item)
    meta.options.forEach((option) => appendValue(option.value))
    appendValue(item.default_value)
    appendValue(paramValues[item.id] || '')
  }
  appendValue(formState.son_service)
  return result
})

const choiceMetaMap = computed<Record<string, ChoiceMeta>>(() => {
  const map: Record<string, ChoiceMeta> = {}
  for (const item of paramDefs.value) {
    map[item.id] = resolveChoiceMeta(item)
  }
  return map
})

const initialColumns: TableColumnsType<PipelineParamDef> = [
  { title: '真实参数名', dataIndex: 'executor_param_name', key: 'executor_param_name', width: 220 },
  { title: '平台标准 Key', dataIndex: 'param_key', key: 'param_key', width: 180 },
  { title: '必填', dataIndex: 'required', key: 'required', width: 90 },
  { title: '默认值', dataIndex: 'default_value', key: 'default_value', width: 180, ellipsis: true },
  { title: '参数描述', dataIndex: 'description', key: 'description', width: 260, ellipsis: true },
  { title: '发布值', key: 'param_value', width: 320, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 560, hitArea: 10 })

const rules: Record<string, Rule[]> = {
  application_id: [{ required: true, message: '请选择应用', trigger: 'change' }],
  binding_id: [{ required: true, message: '请选择管线绑定', trigger: 'change' }],
  env_code: [{ required: true, message: '请选择环境', trigger: 'change' }],
  trigger_type: [{ required: true, message: '请选择触发方式', trigger: 'change' }],
}

function resetParamValues() {
  Object.keys(paramValues).forEach((key) => {
    delete paramValues[key]
  })
}

function fillParamValues(items: PipelineParamDef[]) {
  resetParamValues()
  items.forEach((item) => {
    paramValues[item.id] = item.default_value || ''
  })
}

function syncGitRefFromBranchParams() {
  for (const item of branchParamDefs.value) {
    const value = String(paramValues[item.id] || '').trim()
    if (value) {
      formState.git_ref = value
      return
    }
  }
}

function syncBranchParamValuesFromGitRef(value: string) {
  const next = String(value || '').trim()
  for (const item of branchParamDefs.value) {
    paramValues[item.id] = next
  }
}

function syncSonServiceFromProjectNameParams() {
  for (const item of projectNameParamDefs.value) {
    const value = String(paramValues[item.id] || '').trim()
    if (value) {
      formState.son_service = value
      return
    }
  }
}

function syncProjectNameParamValuesFromSonService(value: string) {
  const next = String(value || '').trim()
  for (const item of projectNameParamDefs.value) {
    paramValues[item.id] = next
  }
}

function isBranchParam(item: PipelineParamDef) {
  return String(item.param_key || '').trim().toLowerCase() === 'branch'
}

function isProjectNameParam(item: PipelineParamDef) {
  const paramKey = String(item.param_key || '').trim().toLowerCase()
  const executorName = String(item.executor_param_name || '').trim().toLowerCase()
  return paramKey === 'project_name' || executorName === 'project_name'
}

function resolveChoiceMeta(item: PipelineParamDef): ChoiceMeta {
  if (item.param_type !== 'choice') {
    return defaultChoiceMeta
  }

  const raw = String(item.raw_meta || '').trim()
  if (!raw) {
    return defaultChoiceMeta
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const options = normalizeChoiceValues(
      parsed.choices ?? parsed.choiceList ?? parsed.values ?? parsed.value ?? parsed.items ?? null,
    ).map((value) => ({ label: value, value }))
    if (options.length === 0) {
      return defaultChoiceMeta
    }

    const className = String(parsed._class || '').toLowerCase()
    const typeName = String(parsed.type || parsed.choiceType || parsed.ptype || '').toLowerCase()
    const delimiter = readChoiceDelimiter(parsed)
    const inferredMulti =
      Boolean(parsed.multiSelect) ||
      Boolean(parsed.multi_select) ||
      Boolean(parsed.isMulti) ||
      typeName.includes('multi') ||
      typeName.includes('checkbox') ||
      className.includes('multi') ||
      Boolean(delimiter && String(item.default_value || '').includes(delimiter) && options.length > 1)
    const multiple = item.single_select ? false : inferredMulti || options.length > 1

    return {
      options,
      multiple,
      delimiter,
    }
  } catch {
    return defaultChoiceMeta
  }
}

function readChoiceDelimiter(meta: Record<string, unknown>) {
  const raw = [
    meta.multiSelectDelimiter,
    meta.multi_select_delimiter,
    meta.valueDelimiter,
    meta.delimiter,
    meta.separator,
  ]
  for (const item of raw) {
    const value = String(item || '').trim()
    if (value) {
      return value
    }
  }
  return ','
}

function normalizeChoiceValues(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    const values = raw.map((item) => String(item || '').trim()).filter(Boolean)
    return dedupe(values)
  }

  if (typeof raw === 'string') {
    return dedupe(splitChoiceText(raw))
  }

  if (raw && typeof raw === 'object') {
    const objectRaw = raw as Record<string, unknown>
    for (const key of ['values', 'choices', 'items', 'list', 'value']) {
      const values = normalizeChoiceValues(objectRaw[key])
      if (values.length > 0) {
        return values
      }
    }
  }

  return []
}

function splitChoiceText(value: string): string[] {
  const text = value.trim()
  if (!text) {
    return []
  }

  if (text.includes('\n') || text.includes('\r')) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (text.includes(',')) {
    return text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return [text]
}

function dedupe(values: string[]) {
  const result: string[] = []
  const seen = new Set<string>()
  values.forEach((item) => {
    if (!item || seen.has(item)) {
      return
    }
    seen.add(item)
    result.push(item)
  })
  return result
}

function getChoiceMeta(item: PipelineParamDef) {
  return choiceMetaMap.value[item.id] || defaultChoiceMeta
}

function useSelectForChoice(item: PipelineParamDef) {
  if (item.param_type !== 'choice') {
    return false
  }
  return getChoiceMeta(item).options.length > 0
}

function isMultipleChoice(item: PipelineParamDef) {
  return useSelectForChoice(item) && getChoiceMeta(item).multiple
}

function splitByDelimiter(value: string, delimiter: string) {
  const text = String(value || '').trim()
  if (!text) {
    return []
  }

  if (delimiter && text.includes(delimiter)) {
    return text
      .split(delimiter)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return splitChoiceText(text)
}

function getChoiceSingleValue(item: PipelineParamDef): string | undefined {
  const value = String(paramValues[item.id] || '').trim()
  if (!value) {
    return undefined
  }
  if (!isMultipleChoice(item)) {
    return value
  }
  const delimiter = getChoiceMeta(item).delimiter
  const first = splitByDelimiter(value, delimiter)[0]
  return first || undefined
}

function getChoiceMultiValues(item: PipelineParamDef): string[] {
  const value = String(paramValues[item.id] || '').trim()
  if (!value) {
    return []
  }
  const delimiter = getChoiceMeta(item).delimiter
  return splitByDelimiter(value, delimiter)
}

function handleChoiceSingleChange(item: PipelineParamDef, value: unknown) {
  const nextValue = String(value || '').trim()
  paramValues[item.id] = nextValue
  if (isBranchParam(item)) {
    formState.git_ref = nextValue
  }
  if (isProjectNameParam(item)) {
    formState.son_service = nextValue
  }
}

function handleChoiceMultiChange(item: PipelineParamDef, values: unknown) {
  const list = Array.isArray(values)
    ? values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    : []
  const delimiter = getChoiceMeta(item).delimiter || ','
  paramValues[item.id] = list.join(delimiter)
  if (isBranchParam(item)) {
    formState.git_ref = String(paramValues[item.id] || '').trim()
  }
  if (isProjectNameParam(item)) {
    formState.son_service = String(paramValues[item.id] || '').trim()
  }
}

function handleParamValueInput(item: PipelineParamDef, value: string) {
  const nextValue = String(value || '')
  paramValues[item.id] = nextValue
  if (isBranchParam(item)) {
    formState.git_ref = nextValue.trim()
  }
  if (isProjectNameParam(item)) {
    formState.son_service = nextValue.trim()
  }
}

function handleGitRefChange(value: string | undefined) {
  formState.git_ref = String(value || '').trim()
  syncBranchParamValuesFromGitRef(formState.git_ref)
}

function handleSonServiceChange(value: string | undefined) {
  formState.son_service = String(value || '').trim()
  syncProjectNameParamValuesFromSonService(formState.son_service)
}

function applyRouteQuery() {
  const applicationID = String(route.query.application_id || '').trim()
  const bindingID = String(route.query.binding_id || '').trim()
  if (applicationID) {
    formState.application_id = applicationID
  }
  if (bindingID) {
    formState.binding_id = bindingID
  }
}

async function loadApplicationOptions() {
  loadingApplications.value = true
  try {
    const response = await listApplications({ page: 1, page_size: 100 })
    applicationOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用下拉加载失败'))
  } finally {
    loadingApplications.value = false
  }
}

async function loadBindingOptions(preferredBindingID = '') {
  const applicationID = formState.application_id.trim()
  if (!applicationID) {
    bindingOptions.value = []
    formState.binding_id = ''
    paramDefs.value = []
    resetParamValues()
    return
  }

  loadingBindings.value = true
  try {
    const response = await listPipelineBindings(applicationID, {
      page: 1,
      page_size: 100,
      status: 'active',
    })
    bindingOptions.value = response.data.map((item) => ({
      label: `${item.name || item.id} [${item.binding_type}/${item.provider}]`,
      value: item.id,
      binding_type: item.binding_type,
      provider: item.provider,
    }))

    const targetBindingID = preferredBindingID || formState.binding_id
    if (targetBindingID && bindingOptions.value.some((item) => item.value === targetBindingID)) {
      formState.binding_id = targetBindingID
    } else {
      formState.binding_id = ''
    }
  } catch (error) {
    bindingOptions.value = []
    formState.binding_id = ''
    message.error(extractHTTPErrorMessage(error, '管线绑定下拉加载失败'))
  } finally {
    loadingBindings.value = false
  }
}

async function loadPipelineParamDefs() {
  if (!formState.application_id || !formState.binding_id || !selectedBinding.value) {
    paramDefs.value = []
    resetParamValues()
    return
  }

  if (!canLoadPipelineParams.value) {
    paramDefs.value = []
    resetParamValues()
    return
  }

  loadingParamDefs.value = true
  try {
    const response = await listApplicationPipelineParamDefs(formState.application_id, {
      binding_type: selectedBinding.value.binding_type,
      page: 1,
      page_size: 100,
    })
    paramDefs.value = response.data
    fillParamValues(response.data)
    syncGitRefFromBranchParams()
    syncSonServiceFromProjectNameParams()
  } catch (error) {
    paramDefs.value = []
    resetParamValues()
    message.error(extractHTTPErrorMessage(error, '管线参数加载失败'))
  } finally {
    loadingParamDefs.value = false
  }
}

async function handleApplicationChange(value: string | undefined) {
  formState.application_id = String(value || '')
  formState.binding_id = ''
  paramDefs.value = []
  resetParamValues()
  await loadBindingOptions()
}

async function handleBindingChange(value: string | undefined) {
  formState.binding_id = String(value || '')
  await loadPipelineParamDefs()
}

function toPipelineParams() {
  if (!formState.application_id || !selectedBinding.value) {
    message.info('请先选择应用与绑定')
    return
  }
  const query: Record<string, string> = {
    application_id: formState.application_id,
    binding_type: selectedBinding.value.binding_type,
    pipeline_binding_id: selectedBinding.value.value,
  }
  void router.push({ path: '/components/pipeline-params', query })
}

function toList() {
  void router.push('/releases')
}

function buildParamsPayload() {
  const payload: Array<{
    param_key: string
    executor_param_name: string
    param_value: string
    value_source: 'release_input'
  }> = []

  for (const item of paramDefs.value) {
    let value = String(paramValues[item.id] || '').trim()
    if (isProjectNameParam(item) && String(formState.son_service || '').trim()) {
      value = String(formState.son_service || '').trim()
      paramValues[item.id] = value
    }
    const paramKey = String(item.param_key || '').trim()
    const displayName = item.executor_param_name || item.id

    if (item.required && !value) {
      throw new Error(`参数 ${displayName} 为必填，请填写发布值`)
    }
    if (!value) {
      continue
    }
    if (!paramKey) {
      if (item.required) {
        throw new Error(`参数 ${displayName} 尚未映射平台标准 Key，请先在“管线参数”页配置`)
      }
      // 非必填且未映射的平台参数自动跳过，不阻塞发布提交。
      continue
    }

    payload.push({
      param_key: paramKey,
      executor_param_name: item.executor_param_name,
      param_value: value,
      value_source: 'release_input',
    })
  }

  return payload
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  let paramsPayload:
    | Array<{
        param_key: string
        executor_param_name: string
        param_value: string
        value_source: 'release_input'
      }>
    | undefined
  try {
    paramsPayload = buildParamsPayload()
  } catch (error) {
    message.error(error instanceof Error ? error.message : '发布参数校验失败')
    return
  }

  submitting.value = true
  try {
    const response = await createReleaseOrder({
      application_id: formState.application_id.trim(),
      binding_id: formState.binding_id.trim(),
      env_code: formState.env_code.trim(),
      son_service: formState.son_service.trim() || undefined,
      git_ref: formState.git_ref.trim() || undefined,
      image_tag: formState.image_tag.trim() || undefined,
      trigger_type: formState.trigger_type,
      triggered_by: formState.triggered_by.trim() || undefined,
      remark: formState.remark.trim() || undefined,
      params: paramsPayload.length > 0 ? paramsPayload : undefined,
    })
    message.success('发布单创建成功')
    void router.push(`/releases/${response.data.id}`)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布单创建失败'))
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  applyRouteQuery()
  await loadApplicationOptions()
  await loadBindingOptions(formState.binding_id)
  await loadPipelineParamDefs()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="header-left">
        <a-button @click="toList">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回发布单
        </a-button>
        <div>
          <h2 class="page-title">新建发布单</h2>
          <p class="page-subtitle">选择应用和绑定，填写发布参数后创建发布任务。</p>
        </div>
      </div>
      <a-button @click="toPipelineParams">
        <template #icon>
          <LinkOutlined />
        </template>
        管线参数映射
      </a-button>
    </div>

    <a-form
      ref="formRef"
      class="create-form"
      layout="vertical"
      :model="formState"
      :rules="rules"
      autocomplete="off"
    >
      <a-card class="form-card" :bordered="true">
        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="应用" name="application_id">
              <a-select
                v-model:value="formState.application_id"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="请选择应用"
                :loading="loadingApplications"
                :options="applicationOptions"
                @change="handleApplicationChange"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="管线绑定" name="binding_id">
              <a-select
                v-model:value="formState.binding_id"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="请选择管线绑定"
                :loading="loadingBindings"
                :options="bindingOptions"
                @change="handleBindingChange"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="环境" name="env_code">
              <a-select v-model:value="formState.env_code" :options="envOptions" placeholder="请选择环境" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="触发方式" name="trigger_type">
              <a-select
                v-model:value="formState.trigger_type"
                :options="triggerTypeOptions"
                placeholder="请选择触发方式"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="子服务（son_service）" name="son_service">
              <a-select
                v-model:value="formState.son_service"
                show-search
                allow-clear
                option-filter-prop="label"
                :options="sonServiceOptions"
                :disabled="sonServiceOptions.length === 0"
                placeholder="从 project_name 参数候选值中选择（选填）"
                @change="handleSonServiceChange"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="Git 版本" name="git_ref">
              <a-select
                v-if="gitRefOptions.length > 0"
                v-model:value="formState.git_ref"
                show-search
                allow-clear
                option-filter-prop="label"
                :options="gitRefOptions"
                placeholder="请选择分支版本（来源于 branch 参数）"
                @change="handleGitRefChange"
              />
              <a-input
                v-else
                :value="formState.git_ref"
                placeholder="暂无 branch 选项，可手动输入"
                @update:value="handleGitRefChange(String($event || ''))"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="镜像版本" name="image_tag">
              <a-input v-model:value="formState.image_tag" placeholder="例如 20260313-01" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="触发人" name="triggered_by">
              <a-input v-model:value="formState.triggered_by" placeholder="例如 lingyun" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="备注" name="remark">
              <a-input v-model:value="formState.remark" placeholder="本次发布说明" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card class="param-card" :bordered="true" title="发布参数">
        <template #extra>
          <a-tag v-if="selectedBinding" color="blue">
            {{ selectedBinding.binding_type }}/{{ selectedBinding.provider }}
          </a-tag>
        </template>

        <p class="param-hint">{{ paramHintText }}</p>

        <a-empty v-if="!canLoadPipelineParams || paramDefs.length === 0" description="暂无可填写参数" />
        <a-table
          v-else
          row-key="id"
          :columns="columns"
          :data-source="paramDefs"
          :loading="loadingParamDefs"
          :pagination="false"
          :scroll="{ x: 1450 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'required'">
              <a-tag :color="record.required ? 'red' : 'default'">{{ record.required ? '是' : '否' }}</a-tag>
            </template>
            <template v-else-if="column.key === 'param_key'">
              <span v-if="record.param_key">{{ record.param_key }}</span>
              <span v-else class="missing-key">未映射</span>
            </template>
            <template v-else-if="column.key === 'default_value'">
              {{ record.default_value || '-' }}
            </template>
            <template v-else-if="column.key === 'description'">
              {{ record.description || '-' }}
            </template>
            <template v-else-if="column.key === 'param_value'">
              <a-select
                v-if="useSelectForChoice(record) && isMultipleChoice(record)"
                mode="multiple"
                class="param-value-control"
                :value="getChoiceMultiValues(record)"
                :options="getChoiceMeta(record).options"
                :placeholder="record.required ? '必填，请选择发布值' : '选填，可多选'"
                allow-clear
                @change="handleChoiceMultiChange(record, $event)"
              />
              <a-select
                v-else-if="useSelectForChoice(record)"
                class="param-value-control"
                :value="getChoiceSingleValue(record)"
                :options="getChoiceMeta(record).options"
                :placeholder="record.required ? '必填，请选择发布值' : '选填，留空将不下发'"
                allow-clear
                @change="handleChoiceSingleChange(record, $event)"
              />
              <a-input
                v-else
                :value="paramValues[record.id]"
                class="param-value-control"
                :placeholder="record.required ? '必填，请输入发布值' : '选填，留空将不下发'"
                allow-clear
                @update:value="handleParamValueInput(record, String($event || ''))"
              />
            </template>
          </template>
        </a-table>
      </a-card>

      <div class="action-area">
        <a-space>
          <a-button @click="toList">取消</a-button>
          <a-button type="primary" :loading="submitting" @click="handleSubmit">创建发布单</a-button>
        </a-space>
      </div>
    </a-form>
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
  gap: 12px;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-card,
.param-card {
  border-radius: var(--radius-xl);
}

.param-hint {
  margin: 0 0 12px;
  color: #595959;
}

.missing-key {
  color: #ff4d4f;
}

.param-value-control {
  width: 100%;
  min-width: 220px;
}

.action-area {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
