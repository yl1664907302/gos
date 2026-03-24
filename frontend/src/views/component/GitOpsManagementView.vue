<script setup lang="ts">
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import {
  createGitOpsInstance,
  getGitOpsInstanceStatus,
  listGitOpsInstances,
  updateGitOpsInstance,
} from '../../api/gitops'
import { useAuthStore } from '../../stores/auth'
import type {
  GitOpsInstance,
  GitOpsRecordStatus,
  GitOpsStatus,
  UpsertGitOpsInstancePayload,
} from '../../types/gitops'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()

const loadingInstances = ref(false)
const loadingStatus = ref(false)
const savingInstance = ref(false)
const instanceTotal = ref(0)
const instanceDataSource = ref<GitOpsInstance[]>([])
const selectedInstanceID = ref('')
const selectedInstance = ref<GitOpsInstance | null>(null)
const detail = ref<GitOpsStatus | null>(null)
const instanceModalVisible = ref(false)
const editingInstanceID = ref('')
let pageAlive = true

const instanceFilters = reactive({
  keyword: '',
  status: '' as GitOpsRecordStatus | '',
  page: 1,
  pageSize: 20,
})

const instanceForm = reactive<UpsertGitOpsInstancePayload>({
  instance_code: '',
  name: '',
  local_root: '',
  default_branch: 'master',
  username: '',
  password: '',
  token: '',
  author_name: 'gos-bot',
  author_email: 'gos@example.com',
  commit_message_template: 'chore(release): {app_key}/{project_name}/{env} -> {image_version} ({branch})',
  command_timeout_sec: 30,
  status: 'active',
  remark: '',
})

const canManageGitOps = computed(() => authStore.hasPermission('component.gitops.manage'))

const instanceColumns: TableColumnsType<GitOpsInstance> = [
  { title: '实例编码', dataIndex: 'instance_code', key: 'instance_code', width: 140 },
  { title: '实例名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '工作目录', dataIndex: 'local_root', key: 'local_root', width: 300 },
  { title: '默认分支', dataIndex: 'default_branch', key: 'default_branch', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '操作', key: 'actions', width: 120, fixed: 'right' },
]

const pathTagColor = computed(() => {
  if (!detail.value?.enabled) return 'default'
  return detail.value.path_exists ? 'green' : 'orange'
})
const repoTagColor = computed(() => {
  if (!detail.value?.enabled) return 'default'
  return detail.value.is_git_repo ? 'green' : 'orange'
})
const remoteTagColor = computed(() => {
  if (!detail.value?.enabled || !detail.value.remote_origin) return 'default'
  return detail.value.remote_reachable ? 'green' : 'red'
})
const worktreeTagColor = computed(() => {
  if (!detail.value?.enabled || !detail.value.is_git_repo) return 'default'
  return detail.value.worktree_dirty ? 'orange' : 'green'
})

function resetInstanceForm() {
  editingInstanceID.value = ''
  instanceForm.instance_code = ''
  instanceForm.name = ''
  instanceForm.local_root = ''
  instanceForm.default_branch = 'master'
  instanceForm.username = ''
  instanceForm.password = ''
  instanceForm.token = ''
  instanceForm.author_name = 'gos-bot'
  instanceForm.author_email = 'gos@example.com'
  instanceForm.commit_message_template = 'chore(release): {app_key}/{project_name}/{env} -> {image_version} ({branch})'
  instanceForm.command_timeout_sec = 30
  instanceForm.status = 'active'
  instanceForm.remark = ''
}

function openCreateInstance() {
  resetInstanceForm()
  instanceModalVisible.value = true
}

function openEditInstance(record: GitOpsInstance) {
  editingInstanceID.value = record.id
  instanceForm.instance_code = record.instance_code
  instanceForm.name = record.name
  instanceForm.local_root = record.local_root
  instanceForm.default_branch = record.default_branch || 'master'
  instanceForm.username = record.username || ''
  instanceForm.password = ''
  instanceForm.token = ''
  instanceForm.author_name = record.author_name || 'gos-bot'
  instanceForm.author_email = record.author_email || 'gos@example.com'
  instanceForm.commit_message_template = record.commit_message_template || 'chore(release): {app_key}/{project_name}/{env} -> {image_version} ({branch})'
  instanceForm.command_timeout_sec = record.command_timeout_sec || 30
  instanceForm.status = (record.status || 'active') as GitOpsRecordStatus
  instanceForm.remark = record.remark || ''
  instanceModalVisible.value = true
}

function closeInstanceModal() {
  instanceModalVisible.value = false
  resetInstanceForm()
}

async function loadInstances() {
  loadingInstances.value = true
  try {
    const response = await listGitOpsInstances({
      keyword: instanceFilters.keyword.trim() || undefined,
      status: instanceFilters.status || undefined,
      page: instanceFilters.page,
      page_size: instanceFilters.pageSize,
    })
    if (!pageAlive) return
    instanceDataSource.value = response.data
    instanceTotal.value = response.total
    instanceFilters.page = response.page
    instanceFilters.pageSize = response.page_size

    const current = selectedInstanceID.value
    const matched = response.data.find((item) => item.id === current)
    const fallback = matched || response.data[0] || null
    selectedInstance.value = fallback
    selectedInstanceID.value = fallback?.id || ''
    if (fallback?.id) {
      await loadStatus(fallback.id)
    } else {
      detail.value = null
    }
  } catch (error) {
    if (pageAlive) {
      message.error(extractHTTPErrorMessage(error, 'GitOps 实例列表加载失败'))
    }
  } finally {
    if (pageAlive) {
      loadingInstances.value = false
    }
  }
}

async function loadStatus(id?: string) {
  const instanceID = String(id || selectedInstanceID.value || '').trim()
  if (!instanceID) {
    detail.value = null
    return
  }
  loadingStatus.value = true
  try {
    const response = await getGitOpsInstanceStatus(instanceID)
    if (!pageAlive) return
    selectedInstance.value = response.data.instance
    selectedInstanceID.value = response.data.instance.id
    detail.value = response.data.status
  } catch (error) {
    if (pageAlive) {
      message.error(extractHTTPErrorMessage(error, 'GitOps 状态加载失败'))
    }
  } finally {
    if (pageAlive) {
      loadingStatus.value = false
    }
  }
}

async function handleSaveInstance() {
  savingInstance.value = true
  try {
    if (editingInstanceID.value) {
      await updateGitOpsInstance(editingInstanceID.value, instanceForm)
      message.success('GitOps 实例已更新')
    } else {
      await createGitOpsInstance(instanceForm)
      message.success('GitOps 实例已创建')
    }
    closeInstanceModal()
    await loadInstances()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, editingInstanceID.value ? 'GitOps 实例更新失败' : 'GitOps 实例创建失败'))
  } finally {
    savingInstance.value = false
  }
}

function handleSelectInstance(record: GitOpsInstance) {
  selectedInstanceID.value = record.id
  selectedInstance.value = record
  void loadStatus(record.id)
}

async function copyValue(value: string, label: string) {
  const text = String(value || '').trim()
  if (!text) {
    message.warning(`${label}为空，无法复制`)
    return
  }
  try {
    await navigator.clipboard.writeText(text)
    message.success(`${label}已复制`)
  } catch {
    message.error(`${label}复制失败`)
  }
}

onMounted(() => {
  pageAlive = true
  void loadInstances()
})

onUnmounted(() => {
  pageAlive = false
})
</script>

<template>
  <div class="page-wrap">
    <a-card :bordered="false" class="toolbar-card">
      <div class="toolbar">
        <div class="page-header-copy">
          <div class="page-title">GitOps管理</div>
          <div class="page-subtitle">统一维护多个 GitOps 实例，并将它们关联到不同的 ArgoCD 集群。</div>
        </div>
        <a-space>
          <a-button v-if="canManageGitOps" type="primary" @click="openCreateInstance">
            <template #icon><PlusOutlined /></template>
            新增实例
          </a-button>
          <a-button @click="loadInstances" :loading="loadingInstances">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
        </a-space>
      </div>
    </a-card>

    <a-row :gutter="16">
      <a-col :xs="24" :lg="10">
        <a-card :bordered="false" title="实例列表">
          <div class="section-toolbar">
            <a-form layout="inline">
              <a-form-item label="关键字">
                <a-input v-model:value="instanceFilters.keyword" allow-clear placeholder="实例编码 / 名称 / 目录" @pressEnter="loadInstances" />
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
          </div>

          <a-table
            row-key="id"
            size="small"
            :columns="instanceColumns"
            :data-source="instanceDataSource"
            :loading="loadingInstances"
            :pagination="false"
            :scroll="{ x: 920 }"
            :row-class-name="(record) => record.id === selectedInstanceID ? 'selected-row' : ''"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'local_root'">
                <a-button type="link" class="path-button" @click="handleSelectInstance(record)">{{ record.local_root }}</a-button>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 'active' ? 'green' : 'default'">{{ record.status }}</a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-button v-if="canManageGitOps" size="small" @click="openEditInstance(record)">编辑</a-button>
              </template>
              <template v-else>
                <span class="clickable-cell" @click="handleSelectInstance(record)">{{ record[column.dataIndex as keyof GitOpsInstance] || '-' }}</span>
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
      </a-col>

      <a-col :xs="24" :lg="14">
        <a-empty v-if="!selectedInstance" description="当前还没有 GitOps 实例，请先新增实例" />
        <template v-else>
          <a-card class="summary-card" :loading="loadingStatus" :title="selectedInstance.name">
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="实例编码">{{ selectedInstance.instance_code }}</a-descriptions-item>
              <a-descriptions-item label="工作目录">
                <a-space>
                  <span>{{ detail?.local_root || selectedInstance.local_root || '-' }}</span>
                  <a-button type="link" size="small" @click="copyValue(detail?.local_root || selectedInstance.local_root || '', '工作目录')">复制</a-button>
                </a-space>
              </a-descriptions-item>
              <a-descriptions-item label="默认分支">{{ detail?.default_branch || selectedInstance.default_branch || '-' }}</a-descriptions-item>
              <a-descriptions-item label="提交身份">{{ detail?.author_name || selectedInstance.author_name || '-' }}</a-descriptions-item>
              <a-descriptions-item label="提交邮箱">{{ detail?.author_email || selectedInstance.author_email || '-' }}</a-descriptions-item>
              <a-descriptions-item label="提交模版">
                <div class="template-block">{{ detail?.commit_message_template || selectedInstance.commit_message_template || '-' }}</div>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-row :gutter="16">
            <a-col :xs="24" :md="8">
              <a-card class="summary-card" :loading="loadingStatus">
                <div class="summary-label">路径状态</div>
                <div class="summary-value">{{ detail?.path_exists ? '路径可用' : '路径不存在' }}</div>
                <a-tag :color="pathTagColor">{{ detail?.path_exists ? 'ok' : 'missing' }}</a-tag>
              </a-card>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-card class="summary-card" :loading="loadingStatus">
                <div class="summary-label">仓库状态</div>
                <div class="summary-value">{{ detail?.is_git_repo ? '已识别 Git 仓库' : '未识别 Git 仓库' }}</div>
                <a-tag :color="repoTagColor">{{ detail?.mode === 'direct_repo' ? '直接仓库模式' : '工作根目录模式' }}</a-tag>
              </a-card>
            </a-col>
            <a-col :xs="24" :md="8">
              <a-card class="summary-card" :loading="loadingStatus">
                <div class="summary-label">工作区状态</div>
                <div class="summary-value">{{ detail?.worktree_dirty ? '存在未提交变更' : '工作区干净' }}</div>
                <a-tag :color="worktreeTagColor">{{ detail?.worktree_dirty ? 'dirty' : 'clean' }}</a-tag>
              </a-card>
            </a-col>
          </a-row>

          <a-card class="detail-card" title="仓库状态" :loading="loadingStatus">
            <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
              <a-descriptions-item label="远端仓库">{{ detail?.remote_origin || '-' }}</a-descriptions-item>
              <a-descriptions-item label="远端可达">
                <a-tag :color="remoteTagColor">{{ detail?.remote_origin ? (detail?.remote_reachable ? '可达' : '不可达') : '未配置' }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="当前分支">{{ detail?.current_branch || '-' }}</a-descriptions-item>
              <a-descriptions-item label="最新提交">{{ detail?.head_commit_short || '-' }}</a-descriptions-item>
              <a-descriptions-item label="提交说明" :span="2">{{ detail?.head_commit_subject || '-' }}</a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card class="detail-card" title="工作区变化" :loading="loadingStatus">
            <a-empty v-if="!detail?.status_summary?.length" description="当前没有未提交的工作区变化" />
            <pre v-else class="status-panel">{{ detail.status_summary.join('\n') }}</pre>
          </a-card>
        </template>
      </a-col>
    </a-row>

    <a-modal
      v-model:open="instanceModalVisible"
      :title="editingInstanceID ? '编辑 GitOps 实例' : '新增 GitOps 实例'"
      :confirm-loading="savingInstance"
      width="760px"
      @ok="handleSaveInstance"
      @cancel="closeInstanceModal"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="实例编码" required>
              <a-input v-model:value="instanceForm.instance_code" :disabled="Boolean(editingInstanceID)" placeholder="例如 prod-gitops" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="实例名称" required>
              <a-input v-model:value="instanceForm.name" placeholder="例如 生产 GitOps 仓库" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="工作目录" required>
          <a-input v-model:value="instanceForm.local_root" placeholder="例如 /data/gitops/prod" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="默认分支">
              <a-input v-model:value="instanceForm.default_branch" placeholder="master" />
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
            <a-form-item label="Git 用户名">
              <a-input v-model:value="instanceForm.username" placeholder="选填" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="editingInstanceID ? 'Git 密码（留空沿用）' : 'Git 密码'">
              <a-input-password v-model:value="instanceForm.password" placeholder="选填" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :label="editingInstanceID ? 'Git Token（留空沿用）' : 'Git Token'">
          <a-input-password v-model:value="instanceForm.token" placeholder="选填" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="提交身份">
              <a-input v-model:value="instanceForm.author_name" placeholder="gos-bot" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="提交邮箱">
              <a-input v-model:value="instanceForm.author_email" placeholder="gos@example.com" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="提交模版">
          <a-textarea v-model:value="instanceForm.commit_message_template" :rows="3" />
          <div class="field-help">仅允许使用平台字段字典中的标准字段占位符，例如 `app_key`、`project_name`、`env`、`image_version`、`branch`。</div>
        </a-form-item>
        <a-form-item label="命令超时（秒）">
          <a-input-number v-model:value="instanceForm.command_timeout_sec" :min="1" :max="600" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="instanceForm.remark" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
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

.summary-card,
.detail-card,
.toolbar-card {
  margin-bottom: 16px;
}

.summary-label {
  font-size: 13px;
  color: var(--color-text-soft);
}

.summary-value {
  margin: 10px 0 14px;
  min-height: 44px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-main);
  word-break: break-all;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.template-block {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--color-bg-subtle);
  color: var(--color-text-main);
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  word-break: break-word;
}

.field-help {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.status-panel {
  margin: 0;
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--color-dashboard-900);
  color: var(--color-dashboard-text);
  overflow: auto;
  font-size: 12px;
  line-height: 1.65;
}

.path-button,
.clickable-cell {
  padding: 0;
}

.selected-row > td {
  background: rgba(59, 130, 246, 0.08) !important;
}

@media (max-width: 768px) {
  .toolbar,
  .section-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
