<script setup lang="ts">
import { DeleteOutlined, EditOutlined, FileTextOutlined, MoreOutlined, PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  createJenkinsRawPipeline,
  deleteJenkinsRawPipeline,
  getPipelineOriginalLink,
  getPipelineRawScript,
  listPipelines,
  previewJenkinsRawPipelineConfigXML,
  syncJenkinsPipelines,
  syncJenkinsExecutorParamDefs,
  updateJenkinsRawPipeline,
} from '../../api/pipeline'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { Pipeline, PipelineRawScriptData, PipelineStatus } from '../../types/pipeline'
import { useAuthStore } from '../../stores/auth'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()

const loading = ref(false)
const dataSource = ref<Pipeline[]>([])
const total = ref(0)
const scriptVisible = ref(false)
const scriptLoading = ref(false)
const scriptData = ref<PipelineRawScriptData | null>(null)
const scriptPipelineName = ref('')
const editorVisible = ref(false)
const editorLoading = ref(false)
const submitting = ref(false)
const deletingID = ref('')
const configVisible = ref(false)
const configLoading = ref(false)
const configTitle = ref('')
const configXML = ref('')
const previewingConfig = ref(false)
const syncing = ref(false)
const editorMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const searchDialogVisible = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchSuggestions = ref<SearchSuggestion[]>([])
const searchSuggestionsLoading = ref(false)
const editorModalViewportInset = ref(0)
let searchSuggestionTimer: ReturnType<typeof window.setTimeout> | null = null
let searchSuggestionRequestSeq = 0
let editorModalViewportObserver: ResizeObserver | null = null

interface SearchSuggestion {
  id: string
  title: string
  subtitle: string
  query: string
}

const filters = reactive({
  name: '',
  status: '' as PipelineStatus | '',
  page: 1,
  pageSize: 20,
})

const searchDraft = reactive({
  keyword: '',
})

const statusFilterValue = computed<PipelineStatus | ''>({
  get: () => filters.status,
  set: (value) => {
    filters.status = value === 'active' || value === 'inactive' ? value : ''
  },
})

const editorForm = reactive({
  id: '',
  full_name: '',
  description: '',
  script: '',
  sandbox: true,
})

const canManagePipeline = computed(() => authStore.hasPermission('pipeline.manage'))
const canSyncJenkins = computed(
  () => authStore.hasPermission('pipeline.manage') || authStore.hasPermission('pipeline_param.manage'),
)

const formRules: Record<string, Array<{ required: boolean; message: string; trigger: string }>> = {
  full_name: [{ required: true, message: '请输入 Jenkins 路径', trigger: 'blur' }],
  script: [{ required: true, message: '请输入原始管线脚本', trigger: 'blur' }],
}

const initialColumns: TableColumnsType<Pipeline> = [
  { title: '管线名称', dataIndex: 'job_name', key: 'job_name', width: 220 },
  { title: 'Jenkins路径', dataIndex: 'job_full_name', key: 'job_full_name', width: 280 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '最近同步时间', dataIndex: 'last_synced_at', key: 'last_synced_at', width: 190 },
  { title: '最近校验时间', dataIndex: 'last_verified_at', key: 'last_verified_at', width: 190 },
  { title: '更新时间', dataIndex: 'updated_at', key: 'updated_at', width: 190 },
  { title: '操作', key: 'actions', width: 268, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 120, maxWidth: 560, hitArea: 10 })

const tableLocale = computed(() => ({
  emptyText: filters.name.trim() ? '未找到匹配的 Jenkins 管线' : '暂无 Jenkins 管线',
}))
const editorModalMaskStyle = computed(() => ({
  left: `${editorModalViewportInset.value}px`,
  width: `calc(100% - ${editorModalViewportInset.value}px)`,
  background: 'rgba(15, 23, 42, 0.08)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  pointerEvents: editorVisible.value ? 'auto' : 'none',
}))
const editorModalWrapProps = computed(() => ({
  style: {
    left: `${editorModalViewportInset.value}px`,
    width: `calc(100% - ${editorModalViewportInset.value}px)`,
    pointerEvents: editorVisible.value ? 'auto' : 'none',
  },
}))

const displayScript = computed(() => {
  if (!scriptData.value) {
    return ''
  }
  const text = String(scriptData.value.script || '').trim()
  if (text) {
    return text
  }
  if (scriptData.value.from_scm) {
    const scriptPath = String(scriptData.value.script_path || 'Jenkinsfile').trim()
    return `该 Jenkins 管线使用 SCM 脚本模式，脚本路径：${scriptPath}\n请到对应代码仓库查看脚本内容`
  }
  return '未解析到脚本内容'
})

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

function getPipelineName(record: Pipeline) {
  return record.job_name || record.job_full_name || '-'
}

function readEditorModalViewportInset() {
  if (typeof document === 'undefined') {
    return 0
  }
  const appLayout = document.querySelector('.app-layout')
  if (appLayout) {
    const rawWidth = window.getComputedStyle(appLayout).getPropertyValue('--layout-sider-width').trim()
    const parsedWidth = Number.parseFloat(rawWidth)
    if (Number.isFinite(parsedWidth) && parsedWidth >= 0) {
      return parsedWidth
    }
  }
  const sider = document.querySelector('.app-sider')
  return sider ? Math.max(sider.getBoundingClientRect().width, 0) : 0
}

function syncEditorModalViewportInset() {
  editorModalViewportInset.value = readEditorModalViewportInset()
}

function observeEditorModalViewportInset() {
  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
    return
  }
  const appLayout = document.querySelector('.app-layout')
  const sider = document.querySelector('.app-sider')
  if (!appLayout && !sider) {
    return
  }
  editorModalViewportObserver?.disconnect()
  editorModalViewportObserver = new ResizeObserver(syncEditorModalViewportInset)
  if (appLayout) {
    editorModalViewportObserver.observe(appLayout)
  }
  if (sider) {
    editorModalViewportObserver.observe(sider)
  }
}

function stopObservingEditorModalViewportInset() {
  editorModalViewportObserver?.disconnect()
  editorModalViewportObserver = null
}

function closeScriptModal() {
  scriptVisible.value = false
  scriptLoading.value = false
  scriptData.value = null
  scriptPipelineName.value = ''
}

function closeConfigModal() {
  configVisible.value = false
  configLoading.value = false
  configTitle.value = ''
  configXML.value = ''
}

function resetEditorForm() {
  editorForm.id = ''
  editorForm.full_name = ''
  editorForm.description = ''
  editorForm.script = ''
  editorForm.sandbox = true
}

function closeEditorModal() {
  editorVisible.value = false
  editorLoading.value = false
  submitting.value = false
  resetEditorForm()
}

function openCreateModal() {
  editorMode.value = 'create'
  resetEditorForm()
  editorVisible.value = true
}

async function openOriginalLink(record: Pipeline) {
  const directTarget = String(record.job_url || '').trim()
  if (directTarget) {
    window.open(directTarget, '_blank', 'noopener,noreferrer')
    return
  }

  try {
    const response = await getPipelineOriginalLink(record.id)
    const target = String(response.data.original_link || '').trim()
    if (!target) {
      message.warning('当前管线缺少 Jenkins 原始链接')
      return
    }
    window.open(target, '_blank', 'noopener,noreferrer')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '打开 Jenkins 原始链接失败'))
  }
}

async function openScriptModal(record: Pipeline) {
  scriptVisible.value = true
  scriptLoading.value = true
  scriptData.value = null
  scriptPipelineName.value = record.job_name || record.job_full_name || record.id
  try {
    const response = await getPipelineRawScript(record.id)
    scriptData.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '加载管线原始脚本失败'))
    closeScriptModal()
    return
  } finally {
    scriptLoading.value = false
  }
}

async function openEditModal(record: Pipeline) {
  if (record.status !== 'active') {
    message.info('失效管线暂不支持编辑，请先在 Jenkins 中恢复或重新创建')
    return
  }
  editorMode.value = 'edit'
  editorLoading.value = true
  resetEditorForm()
  try {
    const response = await getPipelineRawScript(record.id)
    if (response.data.from_scm) {
      message.warning('当前管线为 SCM 模式，暂不支持在平台内直接编辑原始脚本')
      return
    }
    editorForm.id = record.id
    editorForm.full_name = response.data.pipeline.job_full_name
    editorForm.description = response.data.description || ''
    editorForm.script = response.data.script || ''
    editorForm.sandbox = response.data.sandbox
    editorVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '加载可编辑管线失败'))
  } finally {
    editorLoading.value = false
  }
}

async function loadPipelines() {
  loading.value = true
  try {
    const response = await listPipelines({
      provider: 'jenkins',
      name: filters.name.trim() || undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Jenkins管线加载失败'))
  } finally {
    loading.value = false
  }
}

async function handleManualSync() {
  syncing.value = true
  const summaries: string[] = []
  try {
    if (authStore.hasPermission('pipeline.manage')) {
      const pipelineResult = await syncJenkinsPipelines()
      await loadPipelines()
      summaries.push(
        `管线 ${pipelineResult.data.total} 条（新增 ${pipelineResult.data.created} / 更新 ${pipelineResult.data.updated} / 失效 ${pipelineResult.data.inactivated} / 跳过 ${pipelineResult.data.skipped}）`,
      )
    }
    if (authStore.hasPermission('pipeline.manage') || authStore.hasPermission('pipeline_param.manage')) {
      const paramResult = await syncJenkinsExecutorParamDefs()
      summaries.push(
        `参数 ${paramResult.data.total} 条（新增 ${paramResult.data.created} / 更新 ${paramResult.data.updated} / 失效 ${paramResult.data.inactivated} / 跳过 ${paramResult.data.skipped}）`,
      )
    }
    if (summaries.length === 0) {
      message.warning('当前账号没有 Jenkins 手动同步权限')
      return
    }
    message.success(`手动同步完成：${summaries.join('；')}`)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'Jenkins 手动同步失败'))
  } finally {
    syncing.value = false
  }
}

function handleSearch() {
  filters.page = 1
  void loadPipelines()
}

function clearSearchSuggestions() {
  if (searchSuggestionTimer) {
    window.clearTimeout(searchSuggestionTimer)
    searchSuggestionTimer = null
  }
  searchSuggestionRequestSeq += 1
  searchSuggestions.value = []
  searchSuggestionsLoading.value = false
}

function openSearchDialog() {
  searchDraft.keyword = filters.name.trim()
  searchDialogVisible.value = true
  void nextTick(() => {
    searchInputRef.value?.focus()
  })
}

function closeSearchDialog() {
  searchDialogVisible.value = false
  clearSearchSuggestions()
}

async function fetchSearchSuggestions(keyword: string) {
  const normalizedKeyword = keyword.trim()
  if (!normalizedKeyword) {
    clearSearchSuggestions()
    return
  }
  const requestSeq = ++searchSuggestionRequestSeq
  searchSuggestionsLoading.value = true
  try {
    const response = await listPipelines({
      provider: 'jenkins',
      name: normalizedKeyword,
      status: filters.status || undefined,
      page: 1,
      page_size: 6,
    })
    if (requestSeq !== searchSuggestionRequestSeq) {
      return
    }
    searchSuggestions.value = (response.data || []).map((item) => ({
      id: item.id,
      title: item.job_name || item.job_full_name || item.id,
      subtitle: `${item.job_full_name || '-'} · ${item.status}`,
      query: item.job_name || item.job_full_name || normalizedKeyword,
    }))
  } catch {
    if (requestSeq !== searchSuggestionRequestSeq) {
      return
    }
    searchSuggestions.value = []
  } finally {
    if (requestSeq === searchSuggestionRequestSeq) {
      searchSuggestionsLoading.value = false
    }
  }
}

function handleSearchSubmit() {
  filters.name = searchDraft.keyword.trim()
  filters.page = 1
  searchDialogVisible.value = false
  clearSearchSuggestions()
  void loadPipelines()
}

function handleSearchSuggestionSelect(item: SearchSuggestion) {
  searchDraft.keyword = item.query
  filters.name = item.query
  filters.page = 1
  searchDialogVisible.value = false
  clearSearchSuggestions()
  void loadPipelines()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadPipelines()
}

async function submitEditor() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    if (editorMode.value === 'create') {
      await createJenkinsRawPipeline({
        full_name: editorForm.full_name.trim(),
        description: editorForm.description.trim() || undefined,
        script: editorForm.script,
        sandbox: editorForm.sandbox,
      })
      message.success('原始管线创建成功')
    } else {
      await updateJenkinsRawPipeline(editorForm.id, {
        description: editorForm.description.trim() || undefined,
        script: editorForm.script,
        sandbox: editorForm.sandbox,
      })
      message.success('原始管线更新成功')
    }
    closeEditorModal()
    filters.page = 1
    await loadPipelines()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, editorMode.value === 'create' ? '原始管线创建失败' : '原始管线更新失败'))
  } finally {
    submitting.value = false
  }
}

async function previewConfigFromForm() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  previewingConfig.value = true
  try {
    const response = await previewJenkinsRawPipelineConfigXML({
      full_name: editorForm.full_name.trim(),
      description: editorForm.description.trim() || undefined,
      script: editorForm.script,
      sandbox: editorForm.sandbox,
    })
    configTitle.value = editorMode.value === 'create' ? `预览配置XML - ${editorForm.full_name.trim()}` : `预览配置XML - ${editorForm.full_name}`
    configXML.value = response.data.config_xml || ''
    configVisible.value = true
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '预览配置XML失败'))
  } finally {
    previewingConfig.value = false
  }
}

async function handleDelete(record: Pipeline) {
  deletingID.value = record.id
  try {
    await deleteJenkinsRawPipeline(record.id)
    message.success('原始管线删除成功')
    await loadPipelines()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '删除原始管线失败'))
  } finally {
    deletingID.value = ''
  }
}

onMounted(() => {
  syncEditorModalViewportInset()
  observeEditorModalViewportInset()
  void loadPipelines()
})

onUnmounted(() => {
  clearSearchSuggestions()
  stopObservingEditorModalViewportInset()
})

watch(
  () => searchDialogVisible.value,
  (visible) => {
    if (!visible) {
      clearSearchSuggestions()
      return
    }
    const keyword = searchDraft.keyword.trim()
    if (keyword) {
      void fetchSearchSuggestions(keyword)
    }
  },
)

watch(
  () => searchDraft.keyword.trim(),
  (keyword) => {
    if (!searchDialogVisible.value) {
      return
    }
    if (searchSuggestionTimer) {
      window.clearTimeout(searchSuggestionTimer)
      searchSuggestionTimer = null
    }
    searchSuggestionTimer = window.setTimeout(() => {
      void fetchSearchSuggestions(keyword)
    }, 220)
  },
)
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header">
      <div class="page-header-copy">
        <h2 class="page-title">管线</h2>
      </div>
      <div class="page-header-actions">
        <a-button class="application-toolbar-icon-btn" @click="openSearchDialog">
          <template #icon>
            <SearchOutlined />
          </template>
        </a-button>
        <a-select
          v-model:value="statusFilterValue"
          class="jenkins-toolbar-select"
          :options="[
            { label: '状态 · 全部', value: '' },
            { label: '状态 · active', value: 'active' },
            { label: '状态 · inactive', value: 'inactive' },
          ]"
        />
        <a-button class="jenkins-toolbar-query-btn" @click="handleSearch">查询</a-button>
        <a-button v-if="canManagePipeline" class="application-toolbar-action-btn" @click="openCreateModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增管线
        </a-button>
        <a-button v-if="canSyncJenkins" class="application-toolbar-action-btn" :loading="syncing" @click="handleManualSync">
          <template #icon>
            <ReloadOutlined />
          </template>
          手动同步
        </a-button>
      </div>
    </div>

    <transition name="jenkins-search-fade">
      <div v-if="searchDialogVisible" class="jenkins-search-overlay" @click.self="closeSearchDialog">
        <div class="jenkins-search-floating-panel">
          <div class="jenkins-search-floating-input">
            <SearchOutlined class="jenkins-search-floating-icon" />
            <input
              ref="searchInputRef"
              v-model="searchDraft.keyword"
              class="jenkins-search-floating-field"
              type="text"
              autocomplete="off"
              spellcheck="false"
              placeholder="管线名称 / Jenkins 路径"
              @keydown.enter="handleSearchSubmit"
              @keydown.esc="closeSearchDialog"
            />
          </div>
          <div v-if="searchSuggestionsLoading || searchSuggestions.length > 0" class="jenkins-search-suggestions">
            <div v-if="searchSuggestionsLoading" class="jenkins-search-suggestion-loading">正在查询</div>
            <template v-else>
              <button
                v-for="item in searchSuggestions"
                :key="item.id"
                type="button"
                class="jenkins-search-suggestion"
                @click="handleSearchSuggestionSelect(item)"
              >
                <span class="jenkins-search-suggestion-title">{{ item.title }}</span>
                <span class="jenkins-search-suggestion-subtitle">{{ item.subtitle }}</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </transition>

    <a-card class="table-card" :bordered="true">
      <a-table
        class="jenkins-table"
        row-key="id"
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="false"
        :locale="tableLocale"
        :scroll="{ x: 1320 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'job_name'">
            <button
              type="button"
              class="jenkins-pipeline-name-link"
              :title="`打开 Jenkins 原始链接：${record.job_full_name || getPipelineName(record)}`"
              @click="openOriginalLink(record)"
            >
              {{ getPipelineName(record) }}
            </button>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="statusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'last_synced_at'">
            {{ formatTime(record.last_synced_at) }}
          </template>
          <template v-else-if="column.key === 'last_verified_at'">
            {{ formatTime(record.last_verified_at) }}
          </template>
          <template v-else-if="column.key === 'updated_at'">
            {{ formatTime(record.updated_at) }}
          </template>
          <template v-else-if="column.key === 'actions'">
            <div class="jenkins-row-actions">
              <a-button class="jenkins-row-action-btn jenkins-row-action-btn-script" size="small" @click="openScriptModal(record)">
                <template #icon>
                  <FileTextOutlined />
                </template>
                原始脚本
              </a-button>
              <a-button
                v-if="canManagePipeline"
                class="jenkins-row-action-btn"
                size="small"
                :disabled="record.status !== 'active' || editorLoading"
                @click="openEditModal(record)"
              >
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-popover
                v-if="canManagePipeline"
                trigger="click"
                placement="bottomRight"
                overlay-class-name="jenkins-danger-popover"
              >
                <template #content>
                  <div class="jenkins-hidden-danger-panel">
                    <div class="jenkins-hidden-danger-title">危险操作</div>
                    <div class="jenkins-hidden-danger-copy">删除会同步回平台并置为失效状态，请确认当前管线不再使用</div>
                    <a-popconfirm
                      title="确认删除当前原始管线吗？删除后会同步回平台并置为失效状态"
                      ok-text="删除"
                      cancel-text="取消"
                      @confirm="handleDelete(record)"
                    >
                      <a-button
                        class="jenkins-hidden-delete-btn"
                        size="small"
                        danger
                        :disabled="record.status !== 'active'"
                        :loading="deletingID === record.id"
                      >
                        <template #icon>
                          <DeleteOutlined />
                        </template>
                        删除管线
                      </a-button>
                    </a-popconfirm>
                  </div>
                </template>
                <a-button class="jenkins-row-action-btn jenkins-row-more-btn" size="small">
                  <template #icon>
                    <MoreOutlined />
                  </template>
                  更多
                </a-button>
              </a-popover>
            </div>
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
      :open="scriptVisible"
      :title="`管线原始脚本 - ${scriptPipelineName || '-'}`"
      :footer="null"
      :width="860"
      @cancel="closeScriptModal"
    >
      <a-skeleton v-if="scriptLoading" active :paragraph="{ rows: 8 }" />
      <template v-else-if="scriptData">
        <a-descriptions :column="1" size="small" bordered class="script-meta">
          <a-descriptions-item label="定义类型">{{ scriptData.definition_class || '-' }}</a-descriptions-item>
          <a-descriptions-item label="描述">{{ scriptData.description || '-' }}</a-descriptions-item>
          <a-descriptions-item label="脚本路径">{{ scriptData.script_path || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Sandbox">{{ scriptData.sandbox ? '开启' : '关闭' }}</a-descriptions-item>
        </a-descriptions>
        <div
          v-if="scriptData.from_scm"
          class="jenkins-inline-note"
        >
          该管线为 SCM 脚本模式，Jenkins 仅记录脚本路径，完整内容请查看代码仓库
        </div>
        <pre class="script-panel">{{ displayScript }}</pre>
      </template>
    </a-modal>

    <a-modal
      :open="configVisible"
      :title="configTitle ? `配置XML - ${configTitle}` : '配置XML'"
      :footer="null"
      :width="920"
      @cancel="closeConfigModal"
    >
      <a-skeleton v-if="configLoading" active :paragraph="{ rows: 10 }" />
      <template v-else>
        <pre class="script-panel">{{ configXML || '未获取到配置XML' }}</pre>
      </template>
    </a-modal>

    <a-modal
      :open="editorVisible"
      :width="860"
      :closable="false"
      :footer="null"
      :destroy-on-close="true"
      :mask-style="editorModalMaskStyle"
      :wrap-props="editorModalWrapProps"
      wrap-class-name="jenkins-editor-modal-wrap"
      @cancel="closeEditorModal"
    >
      <template #title>
        <div class="jenkins-editor-modal-titlebar">
          <span class="jenkins-editor-modal-title">{{ editorMode === 'create' ? '新增原始管线' : '编辑原始管线' }}</span>
          <div class="jenkins-editor-modal-actions">
            <a-button class="application-toolbar-action-btn jenkins-editor-modal-action-btn" :loading="previewingConfig" @click="previewConfigFromForm">
              预览配置XML
            </a-button>
            <a-button class="application-toolbar-action-btn jenkins-editor-modal-save-btn" :loading="submitting" @click="submitEditor">
              保存
            </a-button>
          </div>
        </div>
      </template>
      <div class="jenkins-editor-note">
        仅支持 Jenkins inline raw pipeline；Jenkins 路径支持根目录或已有 folder/子路径，不会自动创建文件夹
      </div>
      <a-skeleton v-if="editorLoading" active :paragraph="{ rows: 8 }" />
      <a-form
        v-else
        ref="formRef"
        layout="vertical"
        :model="editorForm"
        :rules="formRules"
        :required-mark="false"
        class="jenkins-editor-form"
      >
        <a-form-item label="Jenkins 路径" name="full_name">
          <a-input
            v-model:value="editorForm.full_name"
            :disabled="editorMode === 'edit'"
            placeholder="例如 folder-a/demo-pipeline 或 demo-pipeline"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-input
            v-model:value="editorForm.description"
            allow-clear
            placeholder="可选，填写这条管线的用途说明"
          />
        </a-form-item>
        <a-form-item label="Sandbox">
          <a-switch v-model:checked="editorForm.sandbox" />
        </a-form-item>
        <a-form-item label="原始脚本" name="script">
          <a-textarea
            v-model:value="editorForm.script"
            :auto-size="{ minRows: 14, maxRows: 24 }"
            placeholder="请输入 Jenkins Pipeline Script"
          />
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

.table-card {
  overflow: hidden;
  border-radius: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

:deep(.table-card .ant-card-body) {
  padding: 0;
}

.page-header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}

.jenkins-table :deep(.ant-table),
.jenkins-table :deep(.ant-table-content),
.jenkins-table :deep(.ant-table-body) {
  border-radius: 0 !important;
  background: transparent;
}

.jenkins-table :deep(.ant-table-container) {
  overflow: hidden;
  border-radius: 0 !important;
  border: 1px solid rgba(226, 232, 240, 0.92);
}

.jenkins-table :deep(.ant-table-thead > tr > th) {
  background: linear-gradient(180deg, #243247, #1f2a3d);
  color: rgba(239, 246, 255, 0.96);
  border-bottom: none;
  border-radius: 0 !important;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.jenkins-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid rgba(226, 232, 240, 0.76);
  border-radius: 0 !important;
  background: rgba(255, 255, 255, 0.64);
  transition: background 0.18s ease;
}

.jenkins-table :deep(.ant-table-tbody > tr:hover > td) {
  background: rgba(248, 250, 252, 0.92) !important;
}

.jenkins-table :deep(.ant-table-cell-fix-right) {
  background: #fff !important;
  box-shadow: -12px 0 24px rgba(15, 23, 42, 0.05);
}

.jenkins-table :deep(.ant-table-thead > tr > th.ant-table-cell-fix-right) {
  background: linear-gradient(180deg, #243247, #1f2a3d) !important;
}

.jenkins-table :deep(.ant-table-tbody > tr:hover > td.ant-table-cell-fix-right) {
  background: #f8fafc !important;
}

.jenkins-pipeline-name-link {
  max-width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: #0f172a;
  font: inherit;
  font-weight: 700;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: color 0.18s ease;
}

.jenkins-pipeline-name-link:hover,
.jenkins-pipeline-name-link:focus-visible {
  color: #2563eb;
  outline: none;
}

.jenkins-row-actions {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 236px;
}

:deep(.jenkins-row-action-btn.ant-btn) {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 28px;
  padding-inline: 10px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.82) !important;
  background: rgba(255, 255, 255, 0.72) !important;
  color: #334155 !important;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04);
}

:deep(.jenkins-row-action-btn.ant-btn:hover),
:deep(.jenkins-row-action-btn.ant-btn:focus-visible) {
  border-color: rgba(96, 165, 250, 0.46) !important;
  background: rgba(239, 246, 255, 0.92) !important;
  color: #1d4ed8 !important;
}

.jenkins-row-more-btn {
  min-width: 58px;
}

:deep(.jenkins-row-action-btn.ant-btn[disabled]),
:deep(.jenkins-row-action-btn.ant-btn[disabled]:hover) {
  border-color: rgba(226, 232, 240, 0.82) !important;
  background: rgba(248, 250, 252, 0.62) !important;
  color: rgba(100, 116, 139, 0.44) !important;
  box-shadow: none;
}

:deep(.jenkins-danger-popover .ant-popover-inner) {
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.24);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(254, 242, 242, 0.96)),
    #fff;
  box-shadow: 0 18px 38px rgba(127, 29, 29, 0.12);
}

:deep(.jenkins-danger-popover .ant-popover-inner-content) {
  padding: 12px;
}

.jenkins-hidden-danger-panel {
  width: 220px;
}

.jenkins-hidden-danger-title {
  color: #991b1b;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.jenkins-hidden-danger-copy {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

:deep(.jenkins-hidden-delete-btn.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 30px;
  margin-top: 10px;
  border-radius: 12px;
  font-weight: 700;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

:deep(.application-toolbar-action-btn.ant-btn),
:deep(.application-toolbar-icon-btn.ant-btn),
:deep(.jenkins-toolbar-query-btn.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.34) !important;
  background: rgba(255, 255, 255, 0.42) !important;
  color: #0f172a !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 10px 22px rgba(15, 23, 42, 0.05) !important;
  backdrop-filter: blur(14px) saturate(135%);
}

:deep(.application-toolbar-action-btn.ant-btn),
:deep(.jenkins-toolbar-query-btn.ant-btn) {
  padding-inline: 14px;
  font-weight: 600;
}

:deep(.application-toolbar-icon-btn.ant-btn) {
  width: 42px;
  min-width: 42px;
  padding-inline: 0;
}

:deep(.jenkins-toolbar-select.ant-select) {
  min-width: 138px;
}

:deep(.jenkins-toolbar-select.ant-select .ant-select-selector) {
  display: flex;
  align-items: center;
  height: 42px !important;
  padding: 0 14px !important;
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.34) !important;
  background: rgba(255, 255, 255, 0.42) !important;
  color: #0f172a !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 10px 22px rgba(15, 23, 42, 0.05) !important;
  backdrop-filter: blur(14px) saturate(135%);
}

:deep(.jenkins-toolbar-select.ant-select .ant-select-selection-item),
:deep(.jenkins-toolbar-select.ant-select .ant-select-selection-placeholder),
:deep(.jenkins-toolbar-select.ant-select .ant-select-arrow) {
  color: #0f172a !important;
  font-weight: 600;
}

:deep(.application-toolbar-action-btn.ant-btn:hover),
:deep(.application-toolbar-action-btn.ant-btn:focus),
:deep(.application-toolbar-action-btn.ant-btn:focus-visible),
:deep(.application-toolbar-icon-btn.ant-btn:hover),
:deep(.application-toolbar-icon-btn.ant-btn:focus),
:deep(.application-toolbar-icon-btn.ant-btn:focus-visible),
:deep(.jenkins-toolbar-query-btn.ant-btn:hover),
:deep(.jenkins-toolbar-query-btn.ant-btn:focus),
:deep(.jenkins-toolbar-query-btn.ant-btn:focus-visible) {
  border-color: rgba(96, 165, 250, 0.34) !important;
  background: rgba(255, 255, 255, 0.56) !important;
  color: #0f172a !important;
}

.script-meta {
  margin-bottom: 12px;
}

.jenkins-inline-note {
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 3px solid #3b82f6;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.script-panel {
  margin: 0;
  min-height: 280px;
  max-height: 560px;
  overflow: auto;
  padding: 14px;
  border-radius: 10px;
  background: #141414;
  color: #f5f5f5;
  font-size: 12px;
  line-height: 1.6;
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.jenkins-editor-modal-wrap :deep(.ant-modal) {
  padding-bottom: 32px;
}

.jenkins-editor-modal-wrap :deep(.ant-modal-content) {
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.68);
  background:
    radial-gradient(circle at top right, rgba(134, 239, 172, 0.18), transparent 34%),
    radial-gradient(circle at left bottom, rgba(96, 165, 250, 0.16), transparent 40%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 32px 90px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(18px) saturate(180%);
}

.jenkins-editor-modal-wrap :deep(.ant-modal-content)::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), transparent 36%);
}

.jenkins-editor-modal-wrap :deep(.ant-modal-header) {
  padding: 24px 28px 0;
  margin-bottom: 0;
  background: transparent;
  border-bottom: none;
}

.jenkins-editor-modal-wrap :deep(.ant-modal-title) {
  width: 100%;
}

.jenkins-editor-modal-wrap :deep(.ant-modal-body) {
  padding: 20px 28px 28px;
}

.jenkins-editor-modal-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.jenkins-editor-modal-title {
  color: #0f172a;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
}

.jenkins-editor-modal-actions {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.jenkins-editor-modal-action-btn.ant-btn,
.jenkins-editor-modal-save-btn.ant-btn {
  flex: none;
  font-size: 14px;
}

.jenkins-editor-note {
  margin-bottom: 18px;
  padding-left: 12px;
  border-left: 3px solid #3b82f6;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.jenkins-editor-form :deep(.ant-form-item-label > label) {
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.jenkins-editor-form :deep(.ant-input),
.jenkins-editor-form :deep(.ant-input-affix-wrapper),
.jenkins-editor-form :deep(.ant-input-textarea textarea) {
  border-color: rgba(203, 213, 225, 0.78);
  background: rgba(255, 255, 255, 0.5);
}

.jenkins-search-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: var(--layout-sider-width, 220px);
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 84px 24px 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px) saturate(112%);
}

.jenkins-search-floating-panel {
  width: min(100%, 480px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.jenkins-search-floating-input {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 14px;
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.6)),
    rgba(255, 255, 255, 0.44);
  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 16px 32px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px) saturate(125%);
}

.jenkins-search-floating-icon {
  color: rgba(148, 163, 184, 0.9);
  font-size: 14px;
}

.jenkins-search-floating-field {
  flex: 1;
  min-width: 0;
  height: 34px;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  box-shadow: none;
  color: #0f172a;
  font-size: 13px;
  line-height: 34px;
}

.jenkins-search-floating-field::placeholder {
  color: rgba(71, 85, 105, 0.72);
}

.jenkins-search-floating-input:focus-within {
  border-color: rgba(255, 255, 255, 0.82);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.66)),
    rgba(255, 255, 255, 0.5);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 18px 36px rgba(15, 23, 42, 0.1);
}

.jenkins-search-suggestions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.36)),
    rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.74),
    0 16px 30px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px) saturate(124%);
}

.jenkins-search-suggestion,
.jenkins-search-suggestion-loading {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.34);
}

.jenkins-search-suggestion {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;
}

.jenkins-search-suggestion:hover {
  background: rgba(255, 255, 255, 0.54);
  transform: translateY(-1px);
}

.jenkins-search-suggestion-loading {
  padding: 12px 14px;
  color: rgba(51, 65, 85, 0.76);
  font-size: 12px;
  font-weight: 600;
}

.jenkins-search-suggestion-title {
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
}

.jenkins-search-suggestion-subtitle {
  color: rgba(51, 65, 85, 0.78);
  font-size: 12px;
  font-weight: 600;
}

.jenkins-search-fade-enter-active,
.jenkins-search-fade-leave-active {
  transition: opacity 0.18s ease;
}

.jenkins-search-fade-enter-from,
.jenkins-search-fade-leave-to {
  opacity: 0;
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

  .page-header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  :deep(.jenkins-toolbar-select.ant-select) {
    min-width: min(100%, 180px);
  }

  .jenkins-editor-modal-titlebar {
    align-items: flex-start;
    flex-direction: column;
  }

  .jenkins-editor-modal-actions {
    flex-wrap: wrap;
  }

  .jenkins-search-overlay {
    left: 0;
    padding-inline: 16px;
  }
}
</style>
