<script setup lang="ts">
import { ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  checkArgoCDInstance,
  createArgoCDInstance,
  getArgoCDApplicationByID,
  getArgoCDApplicationOriginalLink,
  listArgoCDApplications,
  listArgoCDEnvBindings,
  listArgoCDInstances,
  syncArgoCDApplications,
  updateArgoCDEnvBindings,
  updateArgoCDInstance,
} from '../../api/argocd'
import { listGitOpsInstances } from '../../api/gitops'
import { getReleaseSettings } from '../../api/system'
import { useAuthStore } from '../../stores/auth'
import type {
  ArgoCDApplication,
  ArgoCDEnvBinding,
  ArgoCDInstance,
  ArgoCDRecordStatus,
  UpsertArgoCDInstancePayload,
} from '../../types/argocd'
import type { GitOpsInstance } from '../../types/gitops'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()

const activeTab = ref('instances')
const loadingApps = ref(false)
const syncingApps = ref(false)
const loadingInstances = ref(false)
const loadingBindings = ref(false)
const savingBindings = ref(false)
const savingInstance = ref(false)
const checkingInstanceID = ref('')
const detailLoading = ref(false)
const detailVisible = ref(false)
const openingOriginalID = ref('')
const instanceModalVisible = ref(false)
const editingInstanceID = ref('')
const appTotal = ref(0)
const instanceTotal = ref(0)
const appDataSource = ref<ArgoCDApplication[]>([])
const instanceDataSource = ref<ArgoCDInstance[]>([])
const gitopsInstanceOptions = ref<GitOpsInstance[]>([])
const envOptions = ref<string[]>([])
const envBindingMap = ref<Record<string, ArgoCDEnvBinding>>({})
const detail = ref<ArgoCDApplication | null>(null)

const appFilters = reactive({
  argocd_instance_id: '',
  app_name: '',
  project: '',
  sync_status: '',
  health_status: '',
  status: '' as ArgoCDRecordStatus | '',
  page: 1,
  pageSize: 20,
})

const instanceFilters = reactive({
  keyword: '',
  status: '' as ArgoCDRecordStatus | '',
  page: 1,
  pageSize: 20,
})

const instanceForm = reactive<UpsertArgoCDInstancePayload>({
  instance_code: '',
  name: '',
  base_url: '',
  insecure_skip_verify: true,
  auth_mode: 'token',
  token: '',
  username: '',
  password: '',
  gitops_instance_id: '',
  cluster_name: '',
  default_namespace: '',
  status: 'active',
  remark: '',
})

const canViewArgoCD = computed(() =>
  [
    'component.argocd.view',
    'component.argocd.manage',
    'component.argocd.instance.view',
    'component.argocd.instance.manage',
    'component.argocd.binding.view',
    'component.argocd.binding.manage',
  ].some((code) => authStore.hasPermission(code)),
)
const canViewApplications = computed(
  () =>
    authStore.hasPermission('component.argocd.view') ||
    authStore.hasPermission('component.argocd.manage') ||
    authStore.hasPermission('component.argocd.instance.view') ||
    authStore.hasPermission('component.argocd.instance.manage'),
)
const canViewInstances = computed(
  () =>
    authStore.hasPermission('component.argocd.instance.view') ||
    authStore.hasPermission('component.argocd.instance.manage') ||
    authStore.hasPermission('component.argocd.binding.view') ||
    authStore.hasPermission('component.argocd.binding.manage') ||
    authStore.hasPermission('component.argocd.view') ||
    authStore.hasPermission('component.argocd.manage'),
)
const canViewBindings = computed(
  () =>
    authStore.hasPermission('component.argocd.binding.view') ||
    authStore.hasPermission('component.argocd.binding.manage') ||
    authStore.hasPermission('component.argocd.instance.view') ||
    authStore.hasPermission('component.argocd.instance.manage') ||
    authStore.hasPermission('component.argocd.view') ||
    authStore.hasPermission('component.argocd.manage'),
)
const canManageArgoCD = computed(() => authStore.hasPermission('component.argocd.manage'))
const canManageInstances = computed(
  () => authStore.hasPermission('component.argocd.instance.manage') || authStore.hasPermission('component.argocd.manage'),
)
const canManageBindings = computed(
  () =>
    authStore.hasPermission('component.argocd.binding.manage') ||
    authStore.hasPermission('component.argocd.instance.manage') ||
    authStore.hasPermission('component.argocd.manage'),
)

const appColumns: TableColumnsType<ArgoCDApplication> = [
  { title: '实例', dataIndex: 'instance_name', key: 'instance_name', width: 180 },
  { title: '集群', dataIndex: 'cluster_name', key: 'cluster_name', width: 160 },
  { title: '应用名称', dataIndex: 'app_name', key: 'app_name', width: 220 },
  { title: 'Project', dataIndex: 'project', key: 'project', width: 140 },
  { title: 'Repo地址', dataIndex: 'repo_url', key: 'repo_url', width: 280 },
  { title: 'Source Path', dataIndex: 'source_path', key: 'source_path', width: 220 },
  { title: '目标Namespace', dataIndex: 'dest_namespace', key: 'dest_namespace', width: 160 },
  { title: '同步状态', dataIndex: 'sync_status', key: 'sync_status', width: 120 },
  { title: '健康状态', dataIndex: 'health_status', key: 'health_status', width: 120 },
  { title: '最后同步时间', dataIndex: 'last_synced_at', key: 'last_synced_at', width: 180 },
  { title: '操作', key: 'actions', width: 160, fixed: 'right' },
]

const instanceColumns: TableColumnsType<ArgoCDInstance> = [
  { title: '实例编码', dataIndex: 'instance_code', key: 'instance_code', width: 140 },
  { title: '实例名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: 'GitOps实例', dataIndex: 'gitops_instance_name', key: 'gitops_instance_name', width: 180 },
  { title: 'Base URL', dataIndex: 'base_url', key: 'base_url', width: 260 },
  { title: '集群', dataIndex: 'cluster_name', key: 'cluster_name', width: 160 },
  { title: '认证方式', dataIndex: 'auth_mode', key: 'auth_mode', width: 120 },
  { title: '健康状态', dataIndex: 'health_status', key: 'health_status', width: 120 },
  { title: '记录状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '最近检查', dataIndex: 'last_check_at', key: 'last_check_at', width: 180 },
  { title: '操作', key: 'actions', width: 220, fixed: 'right' },
]

const bindingRows = computed(() =>
  envOptions.value.map((envCode) => ({
    env_code: envCode,
    binding: envBindingMap.value[envCode] || null,
  })),
)

const detailRawMeta = computed(() => {
  const text = String(detail.value?.raw_meta || '').trim()
  if (!text) {
    return '-'
  }
  try {
    return JSON.stringify(JSON.parse(text), null, 2)
  } catch {
    return text
  }
})

function resolveDefaultTab() {
  if (canViewInstances.value) {
    return 'instances'
  }
  if (canViewBindings.value) {
    return 'bindings'
  }
  if (canViewApplications.value) {
    return 'applications'
  }
  return 'instances'
}

async function refreshVisibleData() {
  const tasks: Array<Promise<unknown>> = []
  if (canViewInstances.value || canViewBindings.value || canViewApplications.value) {
    tasks.push(loadInstances())
  }
  if (canManageInstances.value) {
    tasks.push(loadGitOpsInstances())
  }
  if (canViewBindings.value) {
    tasks.push(loadEnvOptions(), loadBindings())
  }
  if (canViewApplications.value) {
    tasks.push(loadApplications())
  }
  await Promise.all(tasks)
}

function formatTime(value?: string | null) {
  const text = String(value || '').trim()
  if (!text) {
    return '-'
  }
  return dayjs(text).format('YYYY-MM-DD HH:mm:ss')
}

function normalizeEnvOptions(values: string[]) {
  const result: string[] = []
  const seen = new Set<string>()
  values.forEach((item) => {
    const value = String(item || '').trim()
    if (!value || seen.has(value)) {
      return
    }
    seen.add(value)
    result.push(value)
  })
  return result
}

function resetInstanceForm() {
  editingInstanceID.value = ''
  instanceForm.instance_code = ''
  instanceForm.name = ''
  instanceForm.base_url = ''
  instanceForm.insecure_skip_verify = true
  instanceForm.auth_mode = 'token'
  instanceForm.token = ''
  instanceForm.username = ''
  instanceForm.password = ''
  instanceForm.gitops_instance_id = ''
  instanceForm.cluster_name = ''
  instanceForm.default_namespace = ''
  instanceForm.status = 'active'
  instanceForm.remark = ''
}

function openCreateInstance() {
  resetInstanceForm()
  instanceModalVisible.value = true
}

function openEditInstance(record: ArgoCDInstance) {
  editingInstanceID.value = record.id
  instanceForm.instance_code = record.instance_code
  instanceForm.name = record.name
  instanceForm.base_url = record.base_url
  instanceForm.insecure_skip_verify = record.insecure_skip_verify
  instanceForm.auth_mode = record.auth_mode || 'token'
  instanceForm.token = ''
  instanceForm.username = record.username || ''
  instanceForm.password = ''
  instanceForm.gitops_instance_id = record.gitops_instance_id || ''
  instanceForm.cluster_name = record.cluster_name || ''
  instanceForm.default_namespace = record.default_namespace || ''
  instanceForm.status = (record.status || 'active') as ArgoCDRecordStatus
  instanceForm.remark = record.remark || ''
  instanceModalVisible.value = true
}

function closeInstanceModal() {
  instanceModalVisible.value = false
  resetInstanceForm()
}

async function loadEnvOptions() {
  try {
    const response = await getReleaseSettings()
    envOptions.value = normalizeEnvOptions(response.data.env_options || [])
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '发布环境配置加载失败'))
  }
}

async function loadInstances() {
  loadingInstances.value = true
  try {
    const response = await listArgoCDInstances({
      keyword: instanceFilters.keyword.trim() || undefined,
      status: instanceFilters.status || undefined,
      page: instanceFilters.page,
      page_size: instanceFilters.pageSize,
    })
    instanceDataSource.value = response.data
    instanceTotal.value = response.total
    instanceFilters.page = response.page
    instanceFilters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'ArgoCD 实例列表加载失败'))
  } finally {
    loadingInstances.value = false
  }
}

async function loadGitOpsInstances() {
  try {
    const response = await listGitOpsInstances({
      status: 'active',
      page: 1,
      page_size: 200,
    })
    gitopsInstanceOptions.value = response.data || []
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'GitOps 实例列表加载失败'))
  }
}

async function loadApplications() {
  loadingApps.value = true
  try {
    const response = await listArgoCDApplications({
      argocd_instance_id: appFilters.argocd_instance_id || undefined,
      app_name: appFilters.app_name.trim() || undefined,
      project: appFilters.project.trim() || undefined,
      sync_status: appFilters.sync_status || undefined,
      health_status: appFilters.health_status || undefined,
      status: appFilters.status || undefined,
      page: appFilters.page,
      page_size: appFilters.pageSize,
    })
    appDataSource.value = response.data
    appTotal.value = response.total
    appFilters.page = response.page
    appFilters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'ArgoCD 应用列表加载失败'))
  } finally {
    loadingApps.value = false
  }
}

async function loadBindings() {
  loadingBindings.value = true
  try {
    const response = await listArgoCDEnvBindings()
    const next: Record<string, ArgoCDEnvBinding> = {}
    ;(response.data || []).forEach((item) => {
      next[item.env_code] = item
    })
    envBindingMap.value = next
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '环境绑定加载失败'))
  } finally {
    loadingBindings.value = false
  }
}

async function handleSyncApplications() {
  syncingApps.value = true
  try {
    const response = await syncArgoCDApplications()
    message.success(`同步完成：共 ${response.data.total} 条（新增 ${response.data.created} / 更新 ${response.data.updated} / 失效 ${response.data.inactivated}）`)
    await Promise.all([loadApplications(), loadInstances()])
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'ArgoCD 手动同步失败'))
  } finally {
    syncingApps.value = false
  }
}

async function handleSaveInstance() {
  savingInstance.value = true
  try {
    if (editingInstanceID.value) {
      await updateArgoCDInstance(editingInstanceID.value, instanceForm)
      message.success('ArgoCD 实例已更新')
    } else {
      await createArgoCDInstance(instanceForm)
      message.success('ArgoCD 实例已创建')
    }
    closeInstanceModal()
    await Promise.all([loadInstances(), loadApplications()])
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, editingInstanceID.value ? 'ArgoCD 实例更新失败' : 'ArgoCD 实例创建失败'))
  } finally {
    savingInstance.value = false
  }
}

async function handleCheckInstance(record: ArgoCDInstance) {
  checkingInstanceID.value = record.id
  try {
    await checkArgoCDInstance(record.id)
    message.success(`实例 ${record.name} 连接检查成功`)
    await Promise.all([loadInstances(), loadApplications()])
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, `实例 ${record.name} 连接检查失败`))
  } finally {
    checkingInstanceID.value = ''
  }
}

function updateBindingValue(envCode: string, instanceID?: string) {
  const next = { ...envBindingMap.value }
  if (!instanceID) {
    delete next[envCode]
  } else {
    const existing = next[envCode]
    const target = instanceDataSource.value.find((item) => item.id === instanceID)
    next[envCode] = {
      id: existing?.id || '',
      env_code: envCode,
      argocd_instance_id: instanceID,
      argocd_instance_code: target?.instance_code || existing?.argocd_instance_code || '',
      argocd_instance_name: target?.name || existing?.argocd_instance_name || '',
      cluster_name: target?.cluster_name || existing?.cluster_name || '',
      priority: existing?.priority || 1,
      status: 'active',
      created_at: existing?.created_at || '',
      updated_at: existing?.updated_at || '',
    }
  }
  envBindingMap.value = next
}

async function saveBindings() {
  const bindings = bindingRows.value
    .filter((item) => item.binding?.argocd_instance_id)
    .map((item) => ({
      env_code: item.env_code,
      argocd_instance_id: item.binding!.argocd_instance_id,
      status: 'active' as ArgoCDRecordStatus,
    }))
  savingBindings.value = true
  try {
    const response = await updateArgoCDEnvBindings({ bindings })
    const next: Record<string, ArgoCDEnvBinding> = {}
    ;(response.data || []).forEach((item) => {
      next[item.env_code] = item
    })
    envBindingMap.value = next
    message.success('环境绑定已保存')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '环境绑定保存失败'))
  } finally {
    savingBindings.value = false
  }
}

async function openDetail(record: ArgoCDApplication) {
  detailVisible.value = true
  detailLoading.value = true
  detail.value = record
  try {
    const response = await getArgoCDApplicationByID(record.id)
    detail.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '加载 ArgoCD 应用详情失败'))
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detailVisible.value = false
  detailLoading.value = false
  detail.value = null
}

async function openOriginalLink(record: ArgoCDApplication) {
  openingOriginalID.value = record.id
  try {
    const response = await getArgoCDApplicationOriginalLink(record.id)
    const target = String(response.data.original_link || '').trim()
    if (!target) {
      message.warning('当前应用缺少 ArgoCD 原始链接')
      return
    }
    window.open(target, '_blank', 'noopener,noreferrer')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '打开 ArgoCD 原始链接失败'))
  } finally {
    openingOriginalID.value = ''
  }
}

onMounted(() => {
  if (!canViewArgoCD.value) {
    return
  }
  activeTab.value = resolveDefaultTab()
  void refreshVisibleData()
})
</script>

<template>
  <div class="page-wrap">
    <a-card :bordered="false" class="toolbar-card">
      <div class="toolbar">
        <div class="page-header-copy">
          <div class="page-title">ArgoCD 管理</div>
          <div class="page-subtitle">统一维护多个 ArgoCD 实例、环境绑定和平台同步到本地的 Application 快照。</div>
        </div>
        <a-space>
          <a-button @click="refreshVisibleData">
            <template #icon><ReloadOutlined /></template>
            刷新全部
          </a-button>
        </a-space>
      </div>
    </a-card>

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane v-if="canViewInstances" key="instances" tab="实例管理">
        <a-card :bordered="false">
          <div class="section-toolbar">
            <a-form layout="inline">
              <a-form-item label="关键字">
                <a-input v-model:value="instanceFilters.keyword" allow-clear placeholder="实例编码 / 名称 / 集群" @pressEnter="loadInstances" />
              </a-form-item>
              <a-form-item label="状态">
                <a-select v-model:value="instanceFilters.status" allow-clear placeholder="全部" style="width: 140px">
                  <a-select-option value="active">active</a-select-option>
                  <a-select-option value="inactive">inactive</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="() => { instanceFilters.page = 1; void loadInstances() }">查询</a-button>
                  <a-button @click="() => { instanceFilters.keyword = ''; instanceFilters.status = ''; instanceFilters.page = 1; instanceFilters.pageSize = 20; void loadInstances() }">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
            <a-space>
              <a-button v-if="canManageInstances" type="primary" @click="openCreateInstance">
                <template #icon><PlusOutlined /></template>
                新增实例
              </a-button>
            </a-space>
          </div>

          <a-table row-key="id" :columns="instanceColumns" :data-source="instanceDataSource" :loading="loadingInstances" :pagination="false" :scroll="{ x: 1500 }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'base_url'">
                <span class="truncate-text" :title="record.base_url">{{ record.base_url || '-' }}</span>
              </template>
              <template v-else-if="column.key === 'health_status'">
                <a-tag :color="record.health_status === 'healthy' ? 'green' : record.health_status === 'unreachable' ? 'red' : 'default'">
                  {{ record.health_status || 'unknown' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'active' ? 'green' : 'default'">{{ record.status }}</a-tag>
              </template>
              <template v-else-if="column.key === 'last_check_at'">
                {{ formatTime(record.last_check_at) }}
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button v-if="canManageInstances" size="small" @click="openEditInstance(record)">编辑</a-button>
                  <a-button
                    v-if="canManageInstances"
                    size="small"
                    :loading="checkingInstanceID === record.id"
                    @click="handleCheckInstance(record)"
                  >
                    连接检查
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>

          <div class="pagination-wrap">
            <a-pagination
              :current="instanceFilters.page"
              :page-size="instanceFilters.pageSize"
              :total="instanceTotal"
              show-size-changer
              :page-size-options="['10', '20', '50', '100']"
              @change="(page, pageSize) => { instanceFilters.page = page; instanceFilters.pageSize = pageSize; void loadInstances() }"
            />
          </div>
        </a-card>
      </a-tab-pane>

      <a-tab-pane v-if="canViewBindings" key="bindings" tab="环境绑定">
        <a-card :bordered="false" :loading="loadingBindings">
          <a-alert
            type="info"
            show-icon
            class="section-alert"
            message="发布模板走 ArgoCD 时，平台会根据发布单的 env 自动命中这里绑定的 ArgoCD 实例。"
            description="建议先在系统设置里维护环境列表，再为每个环境选择默认 ArgoCD 实例。只有一个 ArgoCD 实例时，可暂时不绑，后端会自动回退到唯一实例。"
          />

          <a-table :pagination="false" :data-source="bindingRows" row-key="env_code" size="middle">
            <a-table-column title="环境" data-index="env_code" key="env_code" width="180" />
            <a-table-column title="默认 ArgoCD 实例" key="argocd_instance_id">
              <template #default="{ record }">
                <a-select
                  :value="record.binding?.argocd_instance_id || undefined"
                  allow-clear
                  placeholder="请选择 ArgoCD 实例"
                  style="width: 100%"
                  :disabled="!canManageBindings"
                  @change="(value) => updateBindingValue(record.env_code, value)"
                >
                  <a-select-option v-for="item in instanceDataSource.filter((x) => x.status === 'active')" :key="item.id" :value="item.id">
                    {{ item.name }}<span v-if="item.cluster_name">（{{ item.cluster_name }}）</span>
                  </a-select-option>
                </a-select>
              </template>
            </a-table-column>
            <a-table-column title="当前绑定" key="bound_instance" width="260">
              <template #default="{ record }">
                <span v-if="record.binding">{{ record.binding.argocd_instance_name || '-' }}<span v-if="record.binding.cluster_name"> / {{ record.binding.cluster_name }}</span></span>
                <span v-else>-</span>
              </template>
            </a-table-column>
          </a-table>

          <div class="section-toolbar bottom-actions">
            <span class="muted-text">共 {{ bindingRows.length }} 个环境</span>
            <a-space>
              <a-button @click="() => Promise.all([loadEnvOptions(), loadBindings()])">重置</a-button>
              <a-button type="primary" :loading="savingBindings" :disabled="!canManageBindings" @click="saveBindings">保存绑定</a-button>
            </a-space>
          </div>
        </a-card>
      </a-tab-pane>

      <a-tab-pane v-if="canViewApplications" key="applications" tab="应用列表">
        <a-card :bordered="false">
          <div class="section-toolbar">
            <a-form layout="inline">
              <a-form-item label="实例">
                <a-select v-model:value="appFilters.argocd_instance_id" allow-clear placeholder="全部" style="width: 200px">
                  <a-select-option v-for="item in instanceDataSource" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="应用名称">
                <a-input v-model:value="appFilters.app_name" allow-clear placeholder="请输入应用名称" @pressEnter="loadApplications" />
              </a-form-item>
              <a-form-item label="Project">
                <a-input v-model:value="appFilters.project" allow-clear placeholder="请输入 Project" @pressEnter="loadApplications" />
              </a-form-item>
              <a-form-item>
                <a-space>
                  <a-button type="primary" @click="() => { appFilters.page = 1; void loadApplications() }">查询</a-button>
                  <a-button @click="() => { appFilters.argocd_instance_id = ''; appFilters.app_name = ''; appFilters.project = ''; appFilters.sync_status = ''; appFilters.health_status = ''; appFilters.status = ''; appFilters.page = 1; appFilters.pageSize = 20; void loadApplications() }">重置</a-button>
                </a-space>
              </a-form-item>
            </a-form>
            <a-space>
              <a-button v-if="canManageArgoCD || canManageInstances" type="primary" :loading="syncingApps" @click="handleSyncApplications">
                <template #icon><ReloadOutlined /></template>
                手动同步
              </a-button>
            </a-space>
          </div>

          <a-table row-key="id" :columns="appColumns" :data-source="appDataSource" :loading="loadingApps" :pagination="false" :scroll="{ x: 1900 }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'repo_url' || column.key === 'source_path'">
                <span class="truncate-text" :title="String(record[column.dataIndex as keyof ArgoCDApplication] || '-')">
                  {{ record[column.dataIndex as keyof ArgoCDApplication] || '-' }}
                </span>
              </template>
              <template v-else-if="column.key === 'sync_status'">
                <a-tag :color="String(record.sync_status || '').toLowerCase() === 'synced' ? 'green' : String(record.sync_status || '').toLowerCase() === 'outofsync' ? 'orange' : 'default'">
                  {{ record.sync_status || 'Unknown' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'health_status'">
                <a-tag :color="String(record.health_status || '').toLowerCase() === 'healthy' ? 'green' : String(record.health_status || '').toLowerCase() === 'degraded' ? 'red' : String(record.health_status || '').toLowerCase() === 'progressing' ? 'blue' : 'default'">
                  {{ record.health_status || 'Unknown' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'last_synced_at'">
                {{ formatTime(record.last_synced_at) }}
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button size="small" @click="openDetail(record)">详情</a-button>
                  <a-button size="small" :loading="openingOriginalID === record.id" @click="openOriginalLink(record)">
                    <template #icon><ExportOutlined /></template>
                    原始链接
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>

          <div class="pagination-wrap">
            <a-pagination
              :current="appFilters.page"
              :page-size="appFilters.pageSize"
              :total="appTotal"
              show-size-changer
              :page-size-options="['10', '20', '50', '100']"
              @change="(page, pageSize) => { appFilters.page = page; appFilters.pageSize = pageSize; void loadApplications() }"
            />
          </div>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      v-model:open="instanceModalVisible"
      :title="editingInstanceID ? '编辑 ArgoCD 实例' : '新增 ArgoCD 实例'"
      :confirm-loading="savingInstance"
      width="720px"
      @ok="handleSaveInstance"
      @cancel="closeInstanceModal"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="实例编码" required>
              <a-input v-model:value="instanceForm.instance_code" :disabled="Boolean(editingInstanceID)" placeholder="例如 prod-cn" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="实例名称" required>
              <a-input v-model:value="instanceForm.name" placeholder="例如 生产华东集群" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Base URL" required>
          <a-input v-model:value="instanceForm.base_url" placeholder="例如 https://argocd.example.com" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="认证方式" required>
              <a-select v-model:value="instanceForm.auth_mode">
                <a-select-option value="token">token</a-select-option>
                <a-select-option value="password">password</a-select-option>
                <a-select-option value="basic">basic</a-select-option>
                <a-select-option value="session">session</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="记录状态">
              <a-select v-model:value="instanceForm.status">
                <a-select-option value="active">active</a-select-option>
                <a-select-option value="inactive">inactive</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="集群名称">
              <a-input v-model:value="instanceForm.cluster_name" placeholder="例如 华东生产集群" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="默认命名空间">
              <a-input v-model:value="instanceForm.default_namespace" placeholder="选填" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="关联 GitOps 实例">
          <a-select
            v-model:value="instanceForm.gitops_instance_id"
            allow-clear
            placeholder="请选择 GitOps 实例"
          >
            <a-select-option
              v-for="item in gitopsInstanceOptions"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}（{{ item.instance_code }}）
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="instanceForm.auth_mode === 'token'" label="Token" required>
          <a-input-password v-model:value="instanceForm.token" placeholder="留空则更新时沿用原值" />
        </a-form-item>
        <a-row v-else :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" required>
              <a-input v-model:value="instanceForm.username" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="editingInstanceID ? '密码（留空沿用）' : '密码'" required>
              <a-input-password v-model:value="instanceForm.password" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <a-checkbox v-model:checked="instanceForm.insecure_skip_verify">跳过 TLS 证书校验</a-checkbox>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="instanceForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-drawer :open="detailVisible" width="720" title="ArgoCD 应用详情" @close="closeDetail">
      <a-spin :spinning="detailLoading">
        <a-descriptions :column="1" bordered size="small">
          <a-descriptions-item label="实例">{{ detail?.instance_name || '-' }}</a-descriptions-item>
          <a-descriptions-item label="集群">{{ detail?.cluster_name || '-' }}</a-descriptions-item>
          <a-descriptions-item label="应用名称">{{ detail?.app_name || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Project">{{ detail?.project || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Repo地址">{{ detail?.repo_url || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Source Path">{{ detail?.source_path || '-' }}</a-descriptions-item>
          <a-descriptions-item label="Target Revision">{{ detail?.target_revision || '-' }}</a-descriptions-item>
          <a-descriptions-item label="目标集群">{{ detail?.dest_server || '-' }}</a-descriptions-item>
          <a-descriptions-item label="目标Namespace">{{ detail?.dest_namespace || '-' }}</a-descriptions-item>
          <a-descriptions-item label="同步状态">{{ detail?.sync_status || '-' }}</a-descriptions-item>
          <a-descriptions-item label="健康状态">{{ detail?.health_status || '-' }}</a-descriptions-item>
          <a-descriptions-item label="操作阶段">{{ detail?.operation_phase || '-' }}</a-descriptions-item>
          <a-descriptions-item label="最后同步时间">{{ formatTime(detail?.last_synced_at) }}</a-descriptions-item>
          <a-descriptions-item label="原始Meta">
            <pre class="raw-meta">{{ detailRawMeta }}</pre>
          </a-descriptions-item>
        </a-descriptions>
      </a-spin>
    </a-drawer>
  </div>
</template>

<style scoped>
.toolbar,
.section-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.muted-text {
  color: var(--ant-color-text-description, #8c8c8c);
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.truncate-text {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-alert {
  margin-bottom: 16px;
}

.bottom-actions {
  margin-top: 16px;
}

.raw-meta {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .toolbar,
  .section-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
