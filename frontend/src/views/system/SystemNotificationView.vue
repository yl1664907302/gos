<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { computed, h, onMounted, reactive, ref } from 'vue'
import {
  createNotificationHook,
  createNotificationMarkdownTemplate,
  createNotificationSource,
  deleteNotificationHook,
  deleteNotificationMarkdownTemplate,
  deleteNotificationSource,
  listNotificationHooks,
  listNotificationMarkdownTemplates,
  listNotificationSources,
  updateNotificationHook,
  updateNotificationMarkdownTemplate,
  updateNotificationSource,
} from '../../api/notification'
import { listPlatformParamDicts } from '../../api/platform-param'
import type {
  NotificationConditionOperator,
  NotificationHook,
  NotificationHookPayload,
  NotificationMarkdownTemplate,
  NotificationMarkdownTemplateConditionPayload,
  NotificationMarkdownTemplatePayload,
  NotificationSource,
  NotificationSourcePayload,
  NotificationSourceType,
} from '../../types/notification'
import type { PlatformParamDict } from '../../types/platform-param'
import { extractHTTPErrorMessage } from '../../utils/http-error'

type TabKey = 'sources' | 'templates' | 'hooks'

interface ConditionFormItem {
  local_id: string
  param_key: string
  operator: NotificationConditionOperator
  expected_value: string
  markdown_text: string
}

interface SourceFormState {
  name: string
  source_type: NotificationSourceType
  webhook_url: string
  verification_param: string
  enabled: boolean
  remark: string
}

interface TemplateFormState {
  name: string
  title_template: string
  body_template: string
  conditions: ConditionFormItem[]
  enabled: boolean
  remark: string
}

interface HookFormState {
  name: string
  source_id: string
  markdown_template_id: string
  enabled: boolean
  remark: string
}

const activeTab = ref<TabKey>('sources')
const platformParams = ref<PlatformParamDict[]>([])

const builtinVariableOptions = [
  { label: 'app_key', value: 'app_key', type: '内置字段' },
  { label: 'app_name', value: 'app_name', type: '内置字段' },
  { label: 'project_name', value: 'project_name', type: '内置字段' },
  { label: 'env', value: 'env', type: '内置字段' },
  { label: 'env_code', value: 'env_code', type: '内置字段' },
  { label: 'branch', value: 'branch', type: '内置字段' },
  { label: 'git_ref', value: 'git_ref', type: '内置字段' },
  { label: 'image_version', value: 'image_version', type: '内置字段' },
  { label: 'image_tag', value: 'image_tag', type: '内置字段' },
  { label: 'order_no', value: 'order_no', type: '内置字段' },
  { label: 'operation_type', value: 'operation_type', type: '内置字段' },
  { label: 'source_order_no', value: 'source_order_no', type: '内置字段' },
  { label: 'release_status', value: 'release_status', type: '内置字段' },
] as const

const markdownVariableOptions = computed(() => {
  const platformOptions = platformParams.value.map((item) => ({
    label: `${item.name} (${item.param_key})`,
    value: item.param_key,
    type: '标准平台 Key',
  }))
  return [...builtinVariableOptions, ...platformOptions]
})

const conditionOperatorOptions = [
  { label: '等于', value: 'equals' },
  { label: '不等于', value: 'not_equals' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'not_contains' },
  { label: '为空', value: 'is_empty' },
  { label: '不为空', value: 'not_empty' },
] as const

function conditionOperatorLabel(operator: string) {
  return conditionOperatorOptions.find((item) => item.value === operator)?.label || operator
}

const sourceLoading = ref(false)
const sourceRows = ref<NotificationSource[]>([])
const sourceCatalog = ref<NotificationSource[]>([])
const sourceTotal = ref(0)
const sourceFilters = reactive({
  keyword: '',
  source_type: '' as NotificationSourceType | '',
  enabled: '' as '' | 'true' | 'false',
  page: 1,
  pageSize: 10,
})

const templateLoading = ref(false)
const templateRows = ref<NotificationMarkdownTemplate[]>([])
const templateCatalog = ref<NotificationMarkdownTemplate[]>([])
const templateTotal = ref(0)
const templateFilters = reactive({
  keyword: '',
  enabled: '' as '' | 'true' | 'false',
  page: 1,
  pageSize: 10,
})

const hookLoading = ref(false)
const hookRows = ref<NotificationHook[]>([])
const hookTotal = ref(0)
const hookFilters = reactive({
  keyword: '',
  enabled: '' as '' | 'true' | 'false',
  page: 1,
  pageSize: 10,
})

const sourceModalVisible = ref(false)
const sourceSubmitting = ref(false)
const editingSourceID = ref('')
const sourceFormRef = ref<FormInstance>()
const sourceForm = reactive<SourceFormState>({
  name: '',
  source_type: 'dingtalk',
  webhook_url: '',
  verification_param: '',
  enabled: true,
  remark: '',
})

const templateModalVisible = ref(false)
const templateSubmitting = ref(false)
const editingTemplateID = ref('')
const templateFormRef = ref<FormInstance>()
const templateForm = reactive<TemplateFormState>({
  name: '',
  title_template: '',
  body_template: '',
  conditions: [],
  enabled: true,
  remark: '',
})

const hookModalVisible = ref(false)
const hookSubmitting = ref(false)
const editingHookID = ref('')
const hookFormRef = ref<FormInstance>()
const hookForm = reactive<HookFormState>({
  name: '',
  source_id: '',
  markdown_template_id: '',
  enabled: true,
  remark: '',
})

const sourceRules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入通知源名称', trigger: 'blur' }],
  source_type: [{ required: true, message: '请选择通知源类型', trigger: 'change' }],
  webhook_url: [{ required: true, message: '请输入 Webhook 地址', trigger: 'blur' }],
}

const templateRules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入 Markdown 模板名称', trigger: 'blur' }],
}

const hookRules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入通知 Hook 名称', trigger: 'blur' }],
  source_id: [{ required: true, message: '请选择通知源', trigger: 'change' }],
  markdown_template_id: [{ required: true, message: '请选择 Markdown 模板', trigger: 'change' }],
}

const sourceTypeOptions = [
  { label: '钉钉', value: 'dingtalk' },
  { label: '企业微信', value: 'wecom' },
] as const

const enabledOptions = [
  { label: '启用', value: 'true' },
  { label: '停用', value: 'false' },
] as const

const sourceOptions = computed(() =>
  sourceCatalog.value.map((item) => ({ label: `${item.name} · ${item.source_type === 'dingtalk' ? '钉钉' : '企业微信'}`, value: item.id })),
)

const markdownTemplateOptions = computed(() =>
  templateCatalog.value.map((item) => ({ label: item.name, value: item.id })),
)

const sourceColumns: TableColumnsType<NotificationSource> = [
  { title: '通知源名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '类型', dataIndex: 'source_type', key: 'source_type', width: 120 },
  { title: 'Webhook 地址', dataIndex: 'webhook_url', key: 'webhook_url', ellipsis: true },
  { title: '状态', dataIndex: 'enabled', key: 'enabled', width: 100 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 180 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' },
]

const templateColumns: TableColumnsType<NotificationMarkdownTemplate> = [
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 220 },
  { title: '条件分支', key: 'conditions', width: 110 },
  { title: '状态', dataIndex: 'enabled', key: 'enabled', width: 100 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 180 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' },
]

const hookColumns: TableColumnsType<NotificationHook> = [
  { title: '通知 Hook', dataIndex: 'name', key: 'name', width: 220 },
  { title: '通知源', dataIndex: 'source_name', key: 'source_name', width: 180 },
  { title: 'Markdown 模板', dataIndex: 'markdown_template_name', key: 'markdown_template_name', width: 220 },
  { title: '状态', dataIndex: 'enabled', key: 'enabled', width: 100 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 180 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' },
]

function normalizeEnabledFilter(value: '' | 'true' | 'false') {
  if (value === '') return undefined
  return value === 'true'
}

function buildConditionItem(payload?: NotificationMarkdownTemplateConditionPayload): ConditionFormItem {
  return {
    local_id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    param_key: payload?.param_key || '',
    operator: payload?.operator || 'equals',
    expected_value: payload?.expected_value || '',
    markdown_text: payload?.markdown_text || '',
  }
}

function resetSourceForm() {
  editingSourceID.value = ''
  sourceForm.name = ''
  sourceForm.source_type = 'dingtalk'
  sourceForm.webhook_url = ''
  sourceForm.verification_param = ''
  sourceForm.enabled = true
  sourceForm.remark = ''
}

function resetTemplateForm() {
  editingTemplateID.value = ''
  templateForm.name = ''
  templateForm.title_template = ''
  templateForm.body_template = ''
  templateForm.conditions = []
  templateForm.enabled = true
  templateForm.remark = ''
}

function resetHookForm() {
  editingHookID.value = ''
  hookForm.name = ''
  hookForm.source_id = ''
  hookForm.markdown_template_id = ''
  hookForm.enabled = true
  hookForm.remark = ''
}

async function loadPlatformParams() {
  try {
    const response = await listPlatformParamDicts({ page: 1, page_size: 500 })
    platformParams.value = response.data
  } catch (error) {
    platformParams.value = []
    message.error(extractHTTPErrorMessage(error, '标准平台 Key 加载失败'))
  }
}

async function loadSources() {
  sourceLoading.value = true
  try {
    const response = await listNotificationSources({
      keyword: sourceFilters.keyword.trim() || undefined,
      source_type: sourceFilters.source_type || undefined,
      enabled: normalizeEnabledFilter(sourceFilters.enabled),
      page: sourceFilters.page,
      page_size: sourceFilters.pageSize,
    })
    sourceRows.value = response.data
    sourceTotal.value = response.total
    sourceFilters.page = response.page
    sourceFilters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '通知源加载失败'))
  } finally {
    sourceLoading.value = false
  }
}

async function loadSourceCatalog() {
  try {
    const response = await listNotificationSources({ page: 1, page_size: 200 })
    sourceCatalog.value = response.data
  } catch {
    sourceCatalog.value = []
  }
}

async function loadMarkdownTemplates() {
  templateLoading.value = true
  try {
    const response = await listNotificationMarkdownTemplates({
      keyword: templateFilters.keyword.trim() || undefined,
      enabled: normalizeEnabledFilter(templateFilters.enabled),
      page: templateFilters.page,
      page_size: templateFilters.pageSize,
    })
    templateRows.value = response.data
    templateTotal.value = response.total
    templateFilters.page = response.page
    templateFilters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Markdown 模板加载失败'))
  } finally {
    templateLoading.value = false
  }
}

async function loadMarkdownTemplateCatalog() {
  try {
    const response = await listNotificationMarkdownTemplates({ page: 1, page_size: 200 })
    templateCatalog.value = response.data
  } catch {
    templateCatalog.value = []
  }
}

async function loadHooks() {
  hookLoading.value = true
  try {
    const response = await listNotificationHooks({
      keyword: hookFilters.keyword.trim() || undefined,
      enabled: normalizeEnabledFilter(hookFilters.enabled),
      page: hookFilters.page,
      page_size: hookFilters.pageSize,
    })
    hookRows.value = response.data
    hookTotal.value = response.total
    hookFilters.page = response.page
    hookFilters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '通知 Hook 加载失败'))
  } finally {
    hookLoading.value = false
  }
}

function addCondition() {
  templateForm.conditions.push(buildConditionItem())
}

function removeCondition(localID: string) {
  templateForm.conditions = templateForm.conditions.filter((item) => item.local_id !== localID)
}

function openCreateSourceModal() {
  resetSourceForm()
  sourceModalVisible.value = true
}

function openEditSourceModal(item: NotificationSource) {
  editingSourceID.value = item.id
  sourceForm.name = item.name
  sourceForm.source_type = item.source_type
  sourceForm.webhook_url = item.webhook_url
  sourceForm.verification_param = item.verification_param || ''
  sourceForm.enabled = item.enabled
  sourceForm.remark = item.remark || ''
  sourceModalVisible.value = true
}

function closeSourceModal() {
  sourceModalVisible.value = false
  resetSourceForm()
  void sourceFormRef.value?.clearValidate()
}

async function submitSource() {
  try {
    await sourceFormRef.value?.validate()
  } catch {
    return
  }
  sourceSubmitting.value = true
  try {
    const payload: NotificationSourcePayload = {
      name: sourceForm.name.trim(),
      source_type: sourceForm.source_type,
      webhook_url: sourceForm.webhook_url.trim(),
      verification_param: sourceForm.source_type === 'dingtalk' ? sourceForm.verification_param.trim() || undefined : undefined,
      enabled: sourceForm.enabled,
      remark: sourceForm.remark.trim() || undefined,
    }
    if (editingSourceID.value) {
      await updateNotificationSource(editingSourceID.value, payload)
      message.success('通知源更新成功')
    } else {
      await createNotificationSource(payload)
      message.success('通知源创建成功')
    }
    closeSourceModal()
    await Promise.all([loadSources(), loadSourceCatalog()])
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '通知源保存失败'))
  } finally {
    sourceSubmitting.value = false
  }
}

function confirmDeleteSource(item: NotificationSource) {
  Modal.confirm({
    title: `删除通知源“${item.name}”`,
    icon: h(ExclamationCircleOutlined),
    content: '删除后将无法继续被通知 Hook 引用，请确认是否继续。',
    async onOk() {
      try {
        await deleteNotificationSource(item.id)
        message.success('通知源删除成功')
        await Promise.all([loadSources(), loadSourceCatalog(), loadHooks()])
      } catch (error) {
        message.error(extractHTTPErrorMessage(error, '通知源删除失败'))
      }
    },
  })
}

function openCreateTemplateModal() {
  resetTemplateForm()
  templateModalVisible.value = true
}

function openEditTemplateModal(item: NotificationMarkdownTemplate) {
  editingTemplateID.value = item.id
  templateForm.name = item.name
  templateForm.title_template = item.title_template || ''
  templateForm.body_template = item.body_template || ''
  templateForm.conditions = (item.conditions || []).map((cond) => buildConditionItem(cond))
  templateForm.enabled = item.enabled
  templateForm.remark = item.remark || ''
  templateModalVisible.value = true
}

function closeTemplateModal() {
  templateModalVisible.value = false
  resetTemplateForm()
  void templateFormRef.value?.clearValidate()
}

async function submitTemplate() {
  try {
    await templateFormRef.value?.validate()
  } catch {
    return
  }
  if (!templateForm.title_template.trim() && !templateForm.body_template.trim()) {
    message.warning('标题模板和正文模板至少填写一项')
    return
  }
  if (templateForm.conditions.some((item) => !item.param_key.trim() || !item.markdown_text.trim())) {
    message.warning('请完整填写条件分支的标准平台 Key 与 Markdown 语句')
    return
  }
  templateSubmitting.value = true
  try {
    const payload: NotificationMarkdownTemplatePayload = {
      name: templateForm.name.trim(),
      title_template: templateForm.title_template.trim() || undefined,
      body_template: templateForm.body_template.trim() || undefined,
      conditions: templateForm.conditions.map((item) => ({
        param_key: item.param_key.trim(),
        operator: item.operator,
        expected_value: item.expected_value.trim() || undefined,
        markdown_text: item.markdown_text.trim(),
      })),
      enabled: templateForm.enabled,
      remark: templateForm.remark.trim() || undefined,
    }
    if (editingTemplateID.value) {
      await updateNotificationMarkdownTemplate(editingTemplateID.value, payload)
      message.success('Markdown 模板更新成功')
    } else {
      await createNotificationMarkdownTemplate(payload)
      message.success('Markdown 模板创建成功')
    }
    closeTemplateModal()
    await Promise.all([loadMarkdownTemplates(), loadMarkdownTemplateCatalog()])
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Markdown 模板保存失败'))
  } finally {
    templateSubmitting.value = false
  }
}

function confirmDeleteTemplate(item: NotificationMarkdownTemplate) {
  Modal.confirm({
    title: `删除 Markdown 模板“${item.name}”`,
    icon: h(ExclamationCircleOutlined),
    content: '删除后引用该模板的通知 Hook 将无法继续发送，请确认是否继续。',
    async onOk() {
      try {
        await deleteNotificationMarkdownTemplate(item.id)
        message.success('Markdown 模板删除成功')
        await Promise.all([loadMarkdownTemplates(), loadMarkdownTemplateCatalog(), loadHooks()])
      } catch (error) {
        message.error(extractHTTPErrorMessage(error, 'Markdown 模板删除失败'))
      }
    },
  })
}

function openCreateHookModal() {
  resetHookForm()
  hookModalVisible.value = true
}

function openEditHookModal(item: NotificationHook) {
  editingHookID.value = item.id
  hookForm.name = item.name
  hookForm.source_id = item.source_id
  hookForm.markdown_template_id = item.markdown_template_id
  hookForm.enabled = item.enabled
  hookForm.remark = item.remark || ''
  hookModalVisible.value = true
}

function closeHookModal() {
  hookModalVisible.value = false
  resetHookForm()
  void hookFormRef.value?.clearValidate()
}

async function submitHook() {
  try {
    await hookFormRef.value?.validate()
  } catch {
    return
  }
  hookSubmitting.value = true
  try {
    const payload: NotificationHookPayload = {
      name: hookForm.name.trim(),
      source_id: hookForm.source_id,
      markdown_template_id: hookForm.markdown_template_id,
      enabled: hookForm.enabled,
      remark: hookForm.remark.trim() || undefined,
    }
    if (editingHookID.value) {
      await updateNotificationHook(editingHookID.value, payload)
      message.success('通知 Hook 更新成功')
    } else {
      await createNotificationHook(payload)
      message.success('通知 Hook 创建成功')
    }
    closeHookModal()
    await loadHooks()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '通知 Hook 保存失败'))
  } finally {
    hookSubmitting.value = false
  }
}

function confirmDeleteHook(item: NotificationHook) {
  Modal.confirm({
    title: `删除通知 Hook“${item.name}”`,
    icon: h(ExclamationCircleOutlined),
    content: '删除后发布模板将无法继续引用该通知 Hook，请确认是否继续。',
    async onOk() {
      try {
        await deleteNotificationHook(item.id)
        message.success('通知 Hook 删除成功')
        await loadHooks()
      } catch (error) {
        message.error(extractHTTPErrorMessage(error, '通知 Hook 删除失败'))
      }
    },
  })
}

function handleSourceSearch() {
  sourceFilters.page = 1
  void loadSources()
}

function handleTemplateSearch() {
  templateFilters.page = 1
  void loadMarkdownTemplates()
}

function handleHookSearch() {
  hookFilters.page = 1
  void loadHooks()
}

function handleSourcePageChange(page: number, pageSize: number) {
  sourceFilters.page = page
  sourceFilters.pageSize = pageSize
  void loadSources()
}

function handleTemplatePageChange(page: number, pageSize: number) {
  templateFilters.page = page
  templateFilters.pageSize = pageSize
  void loadMarkdownTemplates()
}

function handleHookPageChange(page: number, pageSize: number) {
  hookFilters.page = page
  hookFilters.pageSize = pageSize
  void loadHooks()
}

const selectedSource = computed(() => sourceCatalog.value.find((item) => item.id === hookForm.source_id) || null)
const selectedMarkdownTemplate = computed(() => templateCatalog.value.find((item) => item.id === hookForm.markdown_template_id) || null)

onMounted(async () => {
  await Promise.all([
    loadPlatformParams(),
    loadSources(),
    loadSourceCatalog(),
    loadMarkdownTemplates(),
    loadMarkdownTemplateCatalog(),
    loadHooks(),
  ])
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-copy">
        <h2 class="page-title">通知模块</h2>
        <p class="page-subtitle">统一管理通知源、Markdown 模板与通知 Hook，并在发布模板中以 Hook 方式复用发布过程数据。</p>
      </div>
    </div>

    <a-alert
      class="page-alert"
      type="info"
      show-icon
      message="通知 Hook = 通知源 + Markdown 模板"
      description="Markdown 模板支持标准平台 Key 和内置字段变量，也支持根据标准平台 Key 的值追加条件 Markdown 语句。"
    />

    <a-card :bordered="true">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="sources" tab="通知源">
          <div class="toolbar-row">
            <a-form layout="vertical" class="filter-form filter-form-vertical">
              <a-form-item label="关键字">
                <a-input v-model:value="sourceFilters.keyword" allow-clear placeholder="按名称搜索" @pressEnter="handleSourceSearch" />
              </a-form-item>
              <a-form-item label="类型">
                <a-select v-model:value="sourceFilters.source_type" allow-clear style="width: 140px" :options="sourceTypeOptions" />
              </a-form-item>
              <a-form-item label="状态">
                <a-select v-model:value="sourceFilters.enabled" allow-clear style="width: 120px" :options="enabledOptions" />
              </a-form-item>
            </a-form>
            <a-space class="toolbar-actions">
              <a-button @click="handleSourceSearch">查询</a-button>
              <a-button type="primary" @click="openCreateSourceModal">
                <template #icon><PlusOutlined /></template>
                新增通知源
              </a-button>
            </a-space>
          </div>

          <a-table
            row-key="id"
            :loading="sourceLoading"
            :columns="sourceColumns"
            :data-source="sourceRows"
            :pagination="{ current: sourceFilters.page, pageSize: sourceFilters.pageSize, total: sourceTotal, onChange: handleSourcePageChange, showSizeChanger: true }"
            :scroll="{ x: 980 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'source_type'">
                {{ record.source_type === 'dingtalk' ? '钉钉' : '企业微信' }}
              </template>
              <template v-else-if="column.key === 'enabled'">
                <a-tag :color="record.enabled ? 'green' : 'default'">{{ record.enabled ? '启用' : '停用' }}</a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="openEditSourceModal(record)">编辑</a-button>
                  <a-button type="link" danger size="small" @click="confirmDeleteSource(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="templates" tab="Markdown 模板">
          <div class="toolbar-row">
            <a-form layout="vertical" class="filter-form filter-form-vertical">
              <a-form-item label="关键字">
                <a-input v-model:value="templateFilters.keyword" allow-clear placeholder="按模板名搜索" @pressEnter="handleTemplateSearch" />
              </a-form-item>
              <a-form-item label="状态">
                <a-select v-model:value="templateFilters.enabled" allow-clear style="width: 120px" :options="enabledOptions" />
              </a-form-item>
            </a-form>
            <a-space class="toolbar-actions">
              <a-button @click="handleTemplateSearch">查询</a-button>
              <a-button type="primary" @click="openCreateTemplateModal">
                <template #icon><PlusOutlined /></template>
                新增 Markdown 模板
              </a-button>
            </a-space>
          </div>

          <a-alert
            class="section-alert"
            type="info"
            show-icon
            message="变量占位符格式：{app_key}"
            description="基础正文先渲染，条件分支会按顺序附加在正文后面；条件判断支持等于、不等于、包含和空值判断。"
          />

          <a-table
            row-key="id"
            :loading="templateLoading"
            :columns="templateColumns"
            :data-source="templateRows"
            :pagination="{ current: templateFilters.page, pageSize: templateFilters.pageSize, total: templateTotal, onChange: handleTemplatePageChange, showSizeChanger: true }"
            :scroll="{ x: 900 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'conditions'">
                {{ record.conditions.length }} 条
              </template>
              <template v-else-if="column.key === 'enabled'">
                <a-tag :color="record.enabled ? 'green' : 'default'">{{ record.enabled ? '启用' : '停用' }}</a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="openEditTemplateModal(record)">编辑</a-button>
                  <a-button type="link" danger size="small" @click="confirmDeleteTemplate(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="hooks" tab="通知 Hook">
          <div class="toolbar-row">
            <a-form layout="vertical" class="filter-form filter-form-vertical">
              <a-form-item label="关键字">
                <a-input v-model:value="hookFilters.keyword" allow-clear placeholder="按 Hook 名称搜索" @pressEnter="handleHookSearch" />
              </a-form-item>
              <a-form-item label="状态">
                <a-select v-model:value="hookFilters.enabled" allow-clear style="width: 120px" :options="enabledOptions" />
              </a-form-item>
            </a-form>
            <a-space class="toolbar-actions">
              <a-button @click="handleHookSearch">查询</a-button>
              <a-button type="primary" @click="openCreateHookModal">
                <template #icon><PlusOutlined /></template>
                新增通知 Hook
              </a-button>
            </a-space>
          </div>

          <a-table
            row-key="id"
            :loading="hookLoading"
            :columns="hookColumns"
            :data-source="hookRows"
            :pagination="{ current: hookFilters.page, pageSize: hookFilters.pageSize, total: hookTotal, onChange: handleHookPageChange, showSizeChanger: true }"
            :scroll="{ x: 980 }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'enabled'">
                <a-tag :color="record.enabled ? 'green' : 'default'">{{ record.enabled ? '启用' : '停用' }}</a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="openEditHookModal(record)">编辑</a-button>
                  <a-button type="link" danger size="small" @click="confirmDeleteHook(record)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <a-modal
      :open="sourceModalVisible"
      :title="editingSourceID ? '编辑通知源' : '新增通知源'"
      :width="560"
      wrap-class-name="notification-source-modal-wrap"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="sourceSubmitting"
      @ok="submitSource"
      @cancel="closeSourceModal"
    >
      <a-form ref="sourceFormRef" layout="vertical" :model="sourceForm" :rules="sourceRules" class="notification-modal-form">
        <a-form-item label="通知源名称" name="name">
          <a-input v-model:value="sourceForm.name" allow-clear placeholder="例如：生产发布钉钉群" />
        </a-form-item>
        <a-form-item label="通知源类型" name="source_type">
          <a-select v-model:value="sourceForm.source_type" :options="sourceTypeOptions" />
        </a-form-item>
        <a-form-item label="Webhook 地址" name="webhook_url">
          <a-input v-model:value="sourceForm.webhook_url" allow-clear placeholder="请输入钉钉或企业微信的机器人 Webhook 地址" />
        </a-form-item>
        <a-form-item v-if="sourceForm.source_type === 'dingtalk'" label="验证参数（Secret）">
          <a-input-password
            v-model:value="sourceForm.verification_param"
            allow-clear
            placeholder="选填，钉钉机器人的加签 Secret"
          />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="sourceForm.remark" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="例如：生产发版群、回滚通知群" />
        </a-form-item>
        <a-form-item label="启用状态">
          <a-switch v-model:checked="sourceForm.enabled" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :open="templateModalVisible"
      :title="editingTemplateID ? '编辑 Markdown 模板' : '新增 Markdown 模板'"
      :width="680"
      wrap-class-name="notification-template-modal-wrap"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="templateSubmitting"
      @ok="submitTemplate"
      @cancel="closeTemplateModal"
    >
      <a-form
        ref="templateFormRef"
        layout="vertical"
        :model="templateForm"
        :rules="templateRules"
        class="notification-modal-form notification-template-form"
      >
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="templateForm.name" allow-clear placeholder="例如：发布结果通知模板" />
        </a-form-item>
        <a-form-item label="标题模板">
          <a-input v-model:value="templateForm.title_template" allow-clear placeholder="例如：[{env}] {app_name} 发布结果" />
        </a-form-item>
        <a-form-item label="正文模板" name="body_template">
          <a-textarea
            v-model:value="templateForm.body_template"
            :auto-size="{ minRows: 6, maxRows: 12 }"
            placeholder="支持直接使用 {order_no}、{app_key}、{env}、{image_version} 等标准平台 Key 变量"
          />
        </a-form-item>

        <div class="variable-guide-card notification-compact-panel">
          <div class="section-title">可用变量</div>
          <div class="variable-chip-grid">
            <span v-for="item in markdownVariableOptions" :key="item.value" class="variable-chip">
              {{ item.value }}
              <small>{{ item.type }}</small>
            </span>
          </div>
        </div>

        <div class="condition-section-head notification-template-section-head">
          <div>
            <div class="section-title">条件 Markdown 语句</div>
            <div class="section-description">根据标准平台 Key 的值命中条件后，附加对应 Markdown 语句。</div>
          </div>
          <a-button type="dashed" @click="addCondition">
            <template #icon><PlusOutlined /></template>
            新增条件
          </a-button>
        </div>

        <a-empty v-if="!templateForm.conditions.length" description="暂未配置条件语句" />

        <div v-else class="condition-list">
          <div v-for="(condition, index) in templateForm.conditions" :key="condition.local_id" class="condition-card">
            <div class="condition-card-head">
              <div class="condition-card-title">条件 {{ index + 1 }}</div>
              <a-button type="link" danger size="small" @click="removeCondition(condition.local_id)">删除</a-button>
            </div>
            <div class="condition-form-stack">
              <a-form-item label="标准平台 Key" class="compact-item">
                <a-select
                  v-model:value="condition.param_key"
                  show-search
                  allow-clear
                  option-filter-prop="label"
                  :options="markdownVariableOptions"
                  placeholder="选择用于判断的标准平台 Key"
                />
              </a-form-item>
              <a-form-item label="条件运算符" class="compact-item">
                <a-select v-model:value="condition.operator" :options="conditionOperatorOptions" />
              </a-form-item>
              <a-form-item label="期望值" class="compact-item">
                <a-input
                  v-model:value="condition.expected_value"
                  allow-clear
                  :disabled="condition.operator === 'is_empty' || condition.operator === 'not_empty'"
                  placeholder="例如：prod / gateway"
                />
              </a-form-item>
              <a-form-item label="Markdown 语句" class="compact-item">
                <a-textarea
                  v-model:value="condition.markdown_text"
                  :auto-size="{ minRows: 3, maxRows: 8 }"
                  placeholder="命中条件后，将这段 Markdown 追加到正文后面"
                />
              </a-form-item>
            </div>
            <div class="condition-preview">
              规则预览：当 <code>{{ condition.param_key || '标准平台 Key' }}</code> {{ conditionOperatorLabel(condition.operator) }}
              <code>{{ condition.operator === 'is_empty' || condition.operator === 'not_empty' ? '空值规则' : condition.expected_value || '...' }}</code>
              时，追加这一段 Markdown。
            </div>
          </div>
        </div>

        <a-form-item label="备注">
          <a-textarea v-model:value="templateForm.remark" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="例如：生产成功通知、审批拒绝通知" />
        </a-form-item>
        <a-form-item label="启用状态">
          <a-switch v-model:checked="templateForm.enabled" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      :open="hookModalVisible"
      :title="editingHookID ? '编辑通知 Hook' : '新增通知 Hook'"
      :width="520"
      wrap-class-name="notification-hook-modal-wrap"
      ok-text="保存"
      cancel-text="取消"
      :confirm-loading="hookSubmitting"
      @ok="submitHook"
      @cancel="closeHookModal"
    >
      <a-form
        ref="hookFormRef"
        layout="vertical"
        :model="hookForm"
        :rules="hookRules"
        class="notification-modal-form notification-hook-form"
      >
        <a-form-item label="通知 Hook 名称" name="name">
          <a-input v-model:value="hookForm.name" allow-clear placeholder="例如：生产发布结果通知 Hook" />
        </a-form-item>
        <a-form-item label="通知源" name="source_id">
          <a-select v-model:value="hookForm.source_id" show-search option-filter-prop="label" :options="sourceOptions" placeholder="选择通知源" />
        </a-form-item>
        <a-form-item label="Markdown 模板" name="markdown_template_id">
          <a-select
            v-model:value="hookForm.markdown_template_id"
            show-search
            option-filter-prop="label"
            :options="markdownTemplateOptions"
            placeholder="选择 Markdown 模板"
          />
        </a-form-item>

        <a-alert
          class="section-alert notification-compact-panel"
          type="info"
          show-icon
          message="发布模板引用该通知 Hook 后，会自动使用发布过程中的标准平台 Key 数据渲染通知内容"
        />

        <a-form-item label="已选通知源">
          <a-input
            :value="selectedSource ? `${selectedSource.name} · ${selectedSource.source_type === 'dingtalk' ? '钉钉' : '企业微信'}` : '未选择'"
            readonly
          />
        </a-form-item>
        <a-form-item label="已选 Markdown 模板">
          <a-input :value="selectedMarkdownTemplate?.name || '未选择'" readonly />
        </a-form-item>

        <a-form-item label="备注" style="margin-top: 16px">
          <a-textarea v-model:value="hookForm.remark" :auto-size="{ minRows: 2, maxRows: 4 }" placeholder="例如：用于发布成功通知、回滚失败告警" />
        </a-form-item>
        <a-form-item label="启用状态">
          <a-switch v-model:checked="hookForm.enabled" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.page-alert {
  margin-bottom: 16px;
}

.toolbar-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
}

.filter-form-vertical {
  display: grid;
  grid-template-columns: minmax(0, 360px);
  gap: 0;
  align-items: start;
  width: min(100%, 360px);
  flex: 1 1 auto;
}

.filter-form-vertical :deep(.ant-form-item) {
  margin-bottom: 12px;
}

.toolbar-actions {
  margin-left: auto;
  align-self: flex-start;
}

.notification-modal-form {
  width: min(100%, 560px);
  margin-right: auto;
}

.notification-template-form {
  width: min(100%, 520px);
}

.notification-hook-form {
  width: min(100%, 420px);
}

.notification-compact-panel {
  width: 100%;
}

.section-alert {
  margin-bottom: 16px;
}

.variable-guide-card {
  margin-bottom: 16px;
  padding: 14px 16px;
  border: 1px solid #eef2ff;
  border-radius: 16px;
  background: linear-gradient(180deg, #fafcff 0%, #f6f9ff 100%);
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #102340;
}

.section-description {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7a90;
}

.variable-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.variable-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #d9e3f7;
  color: #17345f;
  font-size: 12px;
  font-weight: 600;
}

.variable-chip small {
  color: #7b8798;
  font-weight: 500;
}

.condition-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.notification-template-section-head {
  width: min(100%, 520px);
}

.condition-list {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
  width: min(100%, 520px);
}

.condition-card {
  padding: 16px;
  border: 1px solid #e8eefb;
  border-radius: 18px;
  background: #fbfcff;
}

.condition-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.condition-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #102340;
}

.compact-item {
  margin-bottom: 12px;
}

.condition-form-stack {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.condition-preview {
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff;
  color: #526175;
  font-size: 12px;
}

.condition-preview code {
  padding: 1px 6px;
  border-radius: 999px;
  background: #eef4ff;
  color: #204c8a;
}

.notification-source-modal-wrap :deep(.ant-modal) {
  width: min(560px, calc(100vw - 32px)) !important;
}

.notification-template-modal-wrap :deep(.ant-modal) {
  width: min(680px, calc(100vw - 32px)) !important;
}

.notification-hook-modal-wrap :deep(.ant-modal) {
  width: min(520px, calc(100vw - 32px)) !important;
}

.notification-source-modal-wrap :deep(.ant-modal-content),
.notification-template-modal-wrap :deep(.ant-modal-content),
.notification-hook-modal-wrap :deep(.ant-modal-content) {
  border-radius: 18px;
}

.notification-source-modal-wrap :deep(.ant-modal-body),
.notification-template-modal-wrap :deep(.ant-modal-body),
.notification-hook-modal-wrap :deep(.ant-modal-body) {
  padding-top: 18px;
}

@media (max-width: 900px) {
  .toolbar-row,
  .condition-section-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar-actions {
    margin-left: 0;
  }
}
</style>
