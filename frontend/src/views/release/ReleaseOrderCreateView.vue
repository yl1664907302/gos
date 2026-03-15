<script setup lang="ts">
import { ArrowLeftOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listApplications } from '../../api/application'
import { listPipelineBindings, listApplicationPipelineParamDefs } from '../../api/pipeline'
import { createReleaseOrder, getReleaseTemplateByID, listReleaseTemplates } from '../../api/release'
import { useAuthStore } from '../../stores/auth'
import type { PipelineBinding, PipelineParamDef } from '../../types/pipeline'
import type { ReleaseTemplate, ReleaseTemplateParam, ReleaseTriggerType } from '../../types/release'
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
  template_id: string
  trigger_type: ReleaseTriggerType
  remark: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loadingApplications = ref(false)
const loadingBindings = ref(false)
const loadingTemplates = ref(false)
const loadingTemplateDetail = ref(false)
const loadingParamDefs = ref(false)
const submitting = ref(false)

const allApplicationOptions = ref<SelectOption[]>([])
const bindingOptions = ref<BindingOption[]>([])
const paramDefs = ref<PipelineParamDef[]>([])
const selectedTemplate = ref<ReleaseTemplate | null>(null)
const selectedTemplateParams = ref<ReleaseTemplateParam[]>([])
const templateWarning = ref('')
const paramLoadError = ref('')
const paramValues = reactive<Record<string, string>>({})

const formState = reactive<CreateFormState>({
  application_id: '',
  binding_id: '',
  template_id: '',
  trigger_type: 'manual',
  remark: '',
})

const defaultChoiceMeta: ChoiceMeta = {
  options: [],
  multiple: false,
  delimiter: ',',
}

const selectedBinding = computed(() => bindingOptions.value.find((item) => item.value === formState.binding_id))

const canManagePipelineParams = computed(() => authStore.hasPermission('pipeline_param.manage'))

const currentUserDisplayName = computed(() => {
  const profile = authStore.profile
  if (!profile) {
    return '-'
  }
  return String(profile.display_name || '').trim() || String(profile.username || '').trim() || '-'
})

const canLoadPipelineParams = computed(() => {
  if (!selectedBinding.value) {
    return false
  }
  return selectedBinding.value.provider === 'jenkins'
})

const allowedApplicationIDs = computed(() => {
  if (authStore.isAdmin) {
    return null
  }
  return new Set(
    authStore.permissions
      .filter(
        (item) =>
          item.enabled &&
          String(item.permission_code || '').trim().toLowerCase() === 'release.create' &&
          String(item.scope_type || '').trim().toLowerCase() === 'application' &&
          String(item.scope_value || '').trim() !== '',
      )
      .map((item) => String(item.scope_value || '').trim()),
  )
})

const applicationOptions = computed<SelectOption[]>(() => {
  const allowed = allowedApplicationIDs.value
  if (!allowed) {
    return allApplicationOptions.value
  }
  return allApplicationOptions.value.filter((item) => allowed.has(item.value))
})

const templateParamDefIDSet = computed(() => new Set(selectedTemplateParams.value.map((item) => item.pipeline_param_def_id)))

const templateParamMetaMap = computed<Record<string, ReleaseTemplateParam>>(() => {
  const map: Record<string, ReleaseTemplateParam> = {}
  selectedTemplateParams.value.forEach((item) => {
    map[item.pipeline_param_def_id] = item
  })
  return map
})

const templateParamDefs = computed(() =>
  paramDefs.value.filter((item) => templateParamDefIDSet.value.has(item.id)),
)

const hasTemplateParamDefs = computed(() => templateParamDefs.value.length > 0)
const extraParamsLoading = computed(() => loadingTemplates.value || loadingTemplateDetail.value || loadingParamDefs.value)
const hasResolvedTemplate = computed(() => Boolean(formState.template_id && selectedTemplate.value))
const templateParamMismatchWarning = computed(() => {
  if (!selectedTemplate.value || extraParamsLoading.value) {
    return ''
  }
  if (selectedTemplateParams.value.length === 0) {
    return ''
  }
  if (templateParamDefs.value.length === selectedTemplateParams.value.length) {
    return ''
  }
  return '当前发布模板包含已失效的管线参数，请先在“发布模板”中重新配置。'
})
const canSubmitRelease = computed(
  () =>
    Boolean(formState.application_id && formState.binding_id) &&
    hasResolvedTemplate.value &&
    !templateWarning.value &&
    !templateParamMismatchWarning.value &&
    !paramLoadError.value &&
    !extraParamsLoading.value,
)
const showExtraParamArea = computed(() => extraParamsLoading.value || hasTemplateParamDefs.value)

const templateParamRows = computed(() => {
  const rows: PipelineParamDef[][] = []
  for (let index = 0; index < templateParamDefs.value.length; index += 2) {
    rows.push(templateParamDefs.value.slice(index, index + 2))
  }
  return rows
})

const choiceMetaMap = computed<Record<string, ChoiceMeta>>(() => {
  const map: Record<string, ChoiceMeta> = {}
  for (const item of paramDefs.value) {
    map[item.id] = resolveChoiceMeta(item)
  }
  return map
})

const paramHintText = computed(() => {
  if (!formState.application_id || !formState.binding_id) {
    return '请选择应用和管线选择后加载发布模板。'
  }
  if (extraParamsLoading.value) {
    return '正在加载额外参数，请稍候。'
  }
  if (paramLoadError.value) {
    return paramLoadError.value
  }
  if (templateParamMismatchWarning.value) {
    return templateParamMismatchWarning.value
  }
  if (!selectedBinding.value) {
    return '当前管线选择不存在，请重新选择。'
  }
  if (!canLoadPipelineParams.value) {
    return '当前管线选择不是 Jenkins 类型，暂无可填写的模板参数。'
  }
  if (templateWarning.value) {
    return templateWarning.value
  }
  if (!selectedTemplate.value) {
    return '当前应用与管线选择尚未配置启用中的发布模板，将只创建基础发布单。'
  }
  return '额外参数已根据当前应用与管线选择自动带出，并以平台标准字段名称展示。'
})

const rules: Record<string, Rule[]> = {
  application_id: [{ required: true, message: '请选择应用', trigger: 'change' }],
  binding_id: [{ required: true, message: '请选择管线选择', trigger: 'change' }],
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
  paramValues[item.id] = String(value || '').trim()
}

function handleChoiceMultiChange(item: PipelineParamDef, values: unknown) {
  const list = Array.isArray(values)
    ? values
        .map((value) => String(value || '').trim())
        .filter(Boolean)
    : []
  const delimiter = getChoiceMeta(item).delimiter || ','
  paramValues[item.id] = list.join(delimiter)
}

function handleParamValueInput(item: PipelineParamDef, value: string) {
  paramValues[item.id] = String(value || '')
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
    allApplicationOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))

    if (!authStore.isAdmin && applicationOptions.value.length === 0) {
      message.warning('当前账号未配置应用发布权限，请联系管理员授权')
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用下拉加载失败'))
  } finally {
    loadingApplications.value = false
  }
}

function resetSelectionIfUnauthorized() {
  const hasCurrentApplication = applicationOptions.value.some((item) => item.value === formState.application_id)
  if (hasCurrentApplication) {
    return
  }
  formState.application_id = ''
  resetBindingAndTemplateState()
}

function resetBindingAndTemplateState() {
  formState.binding_id = ''
  formState.template_id = ''
  bindingOptions.value = []
  selectedTemplate.value = null
  selectedTemplateParams.value = []
  templateWarning.value = ''
  paramLoadError.value = ''
  paramDefs.value = []
  resetParamValues()
}

async function loadBindingOptions(preferredBindingID = '') {
  const applicationID = formState.application_id.trim()
  if (!applicationID) {
    bindingOptions.value = []
    formState.binding_id = ''
    selectedTemplate.value = null
    selectedTemplateParams.value = []
    formState.template_id = ''
    templateWarning.value = ''
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
    message.error(extractHTTPErrorMessage(error, '管线选择下拉加载失败'))
  } finally {
    loadingBindings.value = false
  }
}

async function loadAutoTemplate() {
  selectedTemplate.value = null
  selectedTemplateParams.value = []
  formState.template_id = ''
  templateWarning.value = ''

  if (!formState.application_id || !formState.binding_id) {
    return
  }

  loadingTemplates.value = true
  try {
    const response = await listReleaseTemplates({
      application_id: formState.application_id,
      binding_id: formState.binding_id,
      status: 'active',
      page: 1,
      page_size: 10,
    })
    if (response.total === 0 || response.data.length === 0) {
      return
    }
    if (response.total > 1 || response.data.length > 1) {
      templateWarning.value = '当前管线选择存在多个启用中的发布模板，请先在“发布模板”中保留一个启用模板。'
      return
    }
    const matchedTemplate = response.data[0]
    if (!matchedTemplate) {
      return
    }
    formState.template_id = matchedTemplate.id
    await loadSelectedTemplateDetail()
  } catch (error) {
    templateWarning.value = ''
    message.error(extractHTTPErrorMessage(error, '发布模板自动加载失败'))
  } finally {
    loadingTemplates.value = false
  }
}

async function loadSelectedTemplateDetail() {
  if (!formState.template_id) {
    selectedTemplate.value = null
    selectedTemplateParams.value = []
    return
  }
  loadingTemplateDetail.value = true
  try {
    const response = await getReleaseTemplateByID(formState.template_id)
    selectedTemplate.value = response.data.template
    selectedTemplateParams.value = response.data.params
  } catch (error) {
    selectedTemplate.value = null
    selectedTemplateParams.value = []
    formState.template_id = ''
    message.error(extractHTTPErrorMessage(error, '发布模板详情加载失败'))
  } finally {
    loadingTemplateDetail.value = false
  }
}

async function loadPipelineParamDefs() {
  if (!formState.application_id || !formState.binding_id || !selectedBinding.value || !canLoadPipelineParams.value) {
    paramLoadError.value = ''
    paramDefs.value = []
    resetParamValues()
    return
  }

  loadingParamDefs.value = true
  try {
    const response = await listApplicationPipelineParamDefs(formState.application_id, {
      binding_type: selectedBinding.value.binding_type,
      status: 'active',
      page: 1,
      page_size: 200,
    })
    paramLoadError.value = ''
    paramDefs.value = response.data
    fillParamValues(response.data)
  } catch (error) {
    const text = extractHTTPErrorMessage(error, '管线参数加载失败')
    paramLoadError.value = text
    paramDefs.value = []
    resetParamValues()
    message.error(text)
  } finally {
    loadingParamDefs.value = false
  }
}

async function handleApplicationChange(value: string | undefined) {
  formState.application_id = String(value || '')
  resetBindingAndTemplateState()
  await loadBindingOptions()
}

async function handleBindingChange(value: string | undefined) {
  formState.binding_id = String(value || '')
  formState.template_id = ''
  selectedTemplate.value = null
  selectedTemplateParams.value = []
  templateWarning.value = ''
  await loadPipelineParamDefs()
  await loadAutoTemplate()
}

function toPipelineParams() {
  if (!formState.application_id || !selectedBinding.value) {
    message.info('请先选择应用与管线选择')
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

function resolveTemplateParamLabel(item: PipelineParamDef) {
  const meta = templateParamMetaMap.value[item.id]
  if (meta?.param_name) {
    return meta.param_name
  }
  return item.param_key || item.executor_param_name || item.id
}

function buildParamsPayload() {
  const payload: Array<{
    param_key: string
    executor_param_name: string
    param_value: string
    value_source: 'release_input'
  }> = []

  for (const item of templateParamDefs.value) {
    const value = String(paramValues[item.id] || '').trim()
    const paramKey = String(item.param_key || '').trim()
    const displayName = resolveTemplateParamLabel(item)

    if (item.required && !value) {
      throw new Error(`参数 ${displayName} 为必填，请填写发布值`)
    }
    if (!value) {
      continue
    }
    if (!paramKey) {
      throw new Error(`参数 ${displayName} 尚未映射平台标准 Key，请先在“管线参数”页配置`)
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
  if (!canSubmitRelease.value) {
    message.warning('当前应用或管线选择尚未匹配可用发布模板，请先完成模板配置')
    return
  }

  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  if (templateWarning.value) {
    message.error(templateWarning.value)
    return
  }
  if (templateParamMismatchWarning.value) {
    message.error(templateParamMismatchWarning.value)
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
      template_id: formState.template_id.trim() || undefined,
      trigger_type: formState.trigger_type,
      triggered_by: currentUserDisplayName.value !== '-' ? currentUserDisplayName.value : undefined,
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

watch(
  applicationOptions,
  () => {
    resetSelectionIfUnauthorized()
  },
  { deep: true },
)

onMounted(async () => {
  await authStore.loadMe(true)
  applyRouteQuery()
  await loadApplicationOptions()
  await loadBindingOptions(formState.binding_id)
  await loadPipelineParamDefs()
  await loadAutoTemplate()
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
          <p class="page-subtitle">选择应用与管线选择后，系统会自动匹配发布模板并带出额外参数。</p>
        </div>
      </div>
      <a-button v-if="canManagePipelineParams" @click="toPipelineParams">
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
            <a-form-item label="管线选择" name="binding_id">
              <a-select
                v-model:value="formState.binding_id"
                show-search
                allow-clear
                option-filter-prop="label"
                placeholder="请选择管线选择"
                :loading="loadingBindings"
                :options="bindingOptions"
                @change="handleBindingChange"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="创建者">
              <a-input :value="currentUserDisplayName" disabled />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="触发方式">
              <a-input value="manual" disabled />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :xs="24" :md="24">
            <a-form-item label="备注" name="remark">
              <a-input v-model:value="formState.remark" placeholder="本次发布说明" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-alert
          v-if="selectedTemplate"
          type="info"
          show-icon
          class="selected-template-alert"
          :message="`当前模板：${selectedTemplate.name}，已自动带出 ${selectedTemplateParams.length} 个模板参数`"
        />
        <a-alert v-else-if="templateWarning" type="warning" show-icon class="selected-template-alert" :message="templateWarning" />
        <a-alert
          v-else
          type="info"
          show-icon
          class="selected-template-alert"
          message="当前应用与管线选择未命中启用中的发布模板，创建后将仅保留基础发布信息。"
        />

        <template v-if="showExtraParamArea">
          <a-divider class="extra-param-divider">额外参数</a-divider>
          <div class="extra-param-header">
            <p class="param-hint">{{ paramHintText }}</p>
            <a-tag v-if="selectedBinding" color="blue">
              {{ selectedBinding.binding_type }}/{{ selectedBinding.provider }}
            </a-tag>
          </div>

          <a-spin :spinning="extraParamsLoading" tip="正在加载额外参数...">
            <div class="extra-param-form">
              <template v-if="hasTemplateParamDefs">
                <a-row v-for="(row, rowIndex) in templateParamRows" :key="`row-${rowIndex}`" :gutter="16">
                  <a-col v-for="item in row" :key="item.id" :xs="24" :md="12">
                    <a-form-item
                      :label="resolveTemplateParamLabel(item)"
                      :required="item.required"
                    >
                      <a-select
                        v-if="useSelectForChoice(item) && isMultipleChoice(item)"
                        mode="multiple"
                        class="param-value-control"
                        :value="getChoiceMultiValues(item)"
                        :options="getChoiceMeta(item).options"
                        :placeholder="item.required ? '必填，请选择发布值' : '选填，可多选'"
                        allow-clear
                        @change="handleChoiceMultiChange(item, $event)"
                      />
                      <a-select
                        v-else-if="useSelectForChoice(item)"
                        class="param-value-control"
                        :value="getChoiceSingleValue(item)"
                        :options="getChoiceMeta(item).options"
                        :placeholder="item.required ? '必填，请选择发布值' : '选填，留空将不下发'"
                        allow-clear
                        @change="handleChoiceSingleChange(item, $event)"
                      />
                      <a-input
                        v-else
                        :value="paramValues[item.id]"
                        class="param-value-control"
                        :placeholder="item.required ? '必填，请输入发布值' : '选填，留空将不下发'"
                        allow-clear
                        @update:value="handleParamValueInput(item, String($event || ''))"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </template>
              <div v-else class="extra-param-loading-placeholder"></div>
            </div>
          </a-spin>
        </template>
      </a-card>

      <div class="action-area">
        <a-space>
          <a-button @click="toList">取消</a-button>
          <a-button type="primary" :loading="submitting" :disabled="!canSubmitRelease" @click="handleSubmit">创建发布单</a-button>
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

.form-card {
  border-radius: var(--radius-xl);
}

.param-hint {
  margin: 0;
  color: #595959;
}

.selected-template-alert {
  margin-top: 8px;
}

.extra-param-divider {
  margin: 20px 0 16px;
}

.extra-param-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.param-value-control {
  width: 100%;
}

.extra-param-form {
  min-height: 72px;
}

.extra-param-loading-placeholder {
  min-height: 72px;
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

  .extra-param-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
