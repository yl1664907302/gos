<script setup lang="ts">
import { CopyOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { getGitOpsStatus, listGitOpsTemplateFields, updateGitOpsCommitMessageTemplate } from '../../api/gitops'
import { useAuthStore } from '../../stores/auth'
import type { GitOpsStatus, GitOpsTemplateField } from '../../types/gitops'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const authStore = useAuthStore()

const loading = ref(false)
const savingTemplate = ref(false)
const loadingTemplateFields = ref(false)
const editVisible = ref(false)
const editTemplate = ref('')
const selectedFieldKey = ref<string>()
const detail = ref<GitOpsStatus | null>(null)
const templateFields = ref<GitOpsTemplateField[]>([])

const canManageGitOps = computed(() => authStore.hasPermission('component.gitops.manage'))

const pathTagColor = computed(() => {
  if (!detail.value?.enabled) {
    return 'default'
  }
  return detail.value.path_exists ? 'green' : 'orange'
})

const repoTagColor = computed(() => {
  if (!detail.value?.enabled) {
    return 'default'
  }
  return detail.value.is_git_repo ? 'green' : 'orange'
})

const remoteTagColor = computed(() => {
  if (!detail.value?.enabled || !detail.value.remote_origin) {
    return 'default'
  }
  return detail.value.remote_reachable ? 'green' : 'red'
})

const worktreeTagColor = computed(() => {
  if (!detail.value?.enabled || !detail.value.is_git_repo) {
    return 'default'
  }
  return detail.value.worktree_dirty ? 'orange' : 'green'
})

async function loadDetail() {
  loading.value = true
  try {
    const response = await getGitOpsStatus()
    detail.value = response.data
    if (!editVisible.value) {
      editTemplate.value = response.data.commit_message_template || ''
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'GitOps 状态加载失败'))
  } finally {
    loading.value = false
  }
}

async function loadTemplateFields() {
  loadingTemplateFields.value = true
  try {
    const response = await listGitOpsTemplateFields()
    templateFields.value = response.data || []
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '提交信息模版字段加载失败'))
  } finally {
    loadingTemplateFields.value = false
  }
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

function openEditModal() {
  editTemplate.value = detail.value?.commit_message_template || ''
  selectedFieldKey.value = undefined
  editVisible.value = true
  if (!templateFields.value.length) {
    void loadTemplateFields()
  }
}

function closeEditModal() {
  editVisible.value = false
}

function insertTemplateField(paramKey: string) {
  const token = `{${String(paramKey || '').trim()}}`
  if (!token || token === '{}') {
    return
  }
  editTemplate.value = `${editTemplate.value || ''}${token}`
  selectedFieldKey.value = undefined
}

function useDefaultTemplate() {
  editTemplate.value = 'chore(release): {env} -> {image_version}'
}

async function saveTemplate() {
  savingTemplate.value = true
  try {
    const response = await updateGitOpsCommitMessageTemplate(editTemplate.value)
    detail.value = response.data
    editTemplate.value = response.data.commit_message_template || ''
    editVisible.value = false
    message.success('GitOps 提交信息模版已更新')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'GitOps 提交信息模版更新失败'))
  } finally {
    savingTemplate.value = false
  }
}

onMounted(() => {
  void Promise.all([loadDetail(), loadTemplateFields()])
})
</script>

<template>
  <div class="page-wrap">
    <a-card :bordered="false" class="toolbar-card">
      <div class="toolbar">
        <div>
          <div class="page-title">GitOps管理</div>
          <div class="page-subtitle">查看平台当前使用的 GitOps 仓库、工作区、分支与提交状态，便于排查 ArgoCD 写回链路。</div>
        </div>
        <a-space>
          <a-button v-if="canManageGitOps" @click="openEditModal">
            <template #icon>
              <EditOutlined />
            </template>
            编辑提交模版
          </a-button>
          <a-button @click="loadDetail" :loading="loading">
            <template #icon>
              <ReloadOutlined />
            </template>
            刷新
          </a-button>
        </a-space>
      </div>
    </a-card>

    <a-alert
      v-if="detail && !detail.enabled"
      class="status-alert"
      type="warning"
      show-icon
      message="GitOps 当前未启用"
      description="后端未开启 GitOps 写回能力，ArgoCD CD 执行将无法进行仓库改写。"
    />

    <a-row :gutter="16">
      <a-col :xs="24" :md="8">
        <a-card class="summary-card" :loading="loading">
          <div class="summary-label">工作目录</div>
          <div class="summary-value">{{ detail?.local_root || '-' }}</div>
          <a-tag :color="pathTagColor">{{ detail?.path_exists ? '路径可用' : '路径不存在' }}</a-tag>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-card class="summary-card" :loading="loading">
          <div class="summary-label">仓库状态</div>
          <div class="summary-value">{{ detail?.is_git_repo ? '已识别为 Git 仓库' : '未识别为 Git 仓库' }}</div>
          <a-tag :color="repoTagColor">{{ detail?.mode === 'direct_repo' ? '直接仓库模式' : '工作根目录模式' }}</a-tag>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="8">
        <a-card class="summary-card" :loading="loading">
          <div class="summary-label">工作区状态</div>
          <div class="summary-value">{{ detail?.worktree_dirty ? '存在未提交变更' : '工作区干净' }}</div>
          <a-tag :color="worktreeTagColor">{{ detail?.worktree_dirty ? 'dirty' : 'clean' }}</a-tag>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="detail-card" title="配置摘要" :loading="loading" :bordered="true">
      <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
        <a-descriptions-item label="启用状态">
          <a-tag :color="detail?.enabled ? 'green' : 'default'">{{ detail?.enabled ? '已启用' : '未启用' }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="工作模式">
          {{ detail?.mode === 'direct_repo' ? '直接仓库模式' : '工作根目录模式' }}
        </a-descriptions-item>
        <a-descriptions-item label="默认分支">{{ detail?.default_branch || '-' }}</a-descriptions-item>
        <a-descriptions-item label="命令超时">{{ detail?.command_timeout_sec || 0 }}s</a-descriptions-item>
        <a-descriptions-item label="提交身份">{{ detail?.author_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="提交邮箱">{{ detail?.author_email || '-' }}</a-descriptions-item>
        <a-descriptions-item label="认证账号">{{ detail?.username || '-' }}</a-descriptions-item>
        <a-descriptions-item label="提交信息模版" :span="2">
          <div class="template-block">{{ detail?.commit_message_template || '-' }}</div>
          <div class="template-hint">
            字段来自标准平台 Key；发布执行时会按流程参数自动取值。历史模版里如果手工写了旧系统字段，占位符也会继续兼容。
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="工作目录">
          <a-space>
            <span>{{ detail?.local_root || '-' }}</span>
            <a-button type="link" size="small" @click="copyValue(detail?.local_root || '', '工作目录')">
              <template #icon><CopyOutlined /></template>
              复制
            </a-button>
          </a-space>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card class="detail-card" title="目录约定" :loading="loading" :bordered="true">
      <a-alert
        type="info"
        show-icon
        message="当前 GitOps 目录层级说明"
        description="平台当前按 apps -> 应用目录 -> overlays -> 环境目录 的层级识别 GitOps 仓库。CD 绑定为 ArgoCD 时，external_ref 会从 apps/<应用目录> 这一层下拉选择；实际执行环境由平台标准 Key env 传递，运行时再拼出 overlays/<env>。"
      />
    </a-card>

    <a-card class="detail-card" title="仓库状态" :loading="loading" :bordered="true">
      <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
        <a-descriptions-item label="远端仓库">
          <a-space>
            <span>{{ detail?.remote_origin || '-' }}</span>
            <a-button
              v-if="detail?.remote_origin"
              type="link"
              size="small"
              @click="copyValue(detail?.remote_origin || '', '远端仓库地址')"
            >
              <template #icon><CopyOutlined /></template>
              复制
            </a-button>
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="远端可达">
          <a-tag :color="remoteTagColor">
            {{ detail?.remote_origin ? (detail?.remote_reachable ? '可达' : '不可达') : '未配置' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="当前分支">{{ detail?.current_branch || '-' }}</a-descriptions-item>
        <a-descriptions-item label="最新提交">{{ detail?.head_commit_short || '-' }}</a-descriptions-item>
        <a-descriptions-item label="提交说明" :span="2">{{ detail?.head_commit_subject || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card class="detail-card" title="工作区变化" :loading="loading" :bordered="true">
      <a-alert
        v-if="detail && detail.worktree_dirty"
        class="status-alert"
        type="warning"
        show-icon
        message="当前工作区存在未提交变化"
        description="ArgoCD 写回前建议先确认这些变更是否为预期内容，避免平台提交与人工修改相互覆盖。"
      />
      <a-empty v-if="!detail?.status_summary?.length" description="当前没有未提交的工作区变化" />
      <pre v-else class="status-panel">{{ detail.status_summary.join('\n') }}</pre>
    </a-card>

    <a-modal
      v-model:open="editVisible"
      title="编辑 GitOps 提交信息模版"
      width="760px"
      :confirm-loading="savingTemplate"
      ok-text="保存"
      cancel-text="取消"
      @ok="saveTemplate"
      @cancel="closeEditModal"
    >
      <a-alert
        type="info"
        show-icon
        class="status-alert"
        message="平台会在 ArgoCD 写回 GitOps 仓库前渲染这条提交信息"
        description="字段从标准平台 Key 中选择；保存后会立即写入当前运行配置，并同步更新后端内存中的 GitOps 提交信息模版。"
      />
      <div class="template-helper">
        <span class="template-helper__label">从标准平台 Key 选择字段：</span>
        <div class="template-helper__controls">
          <a-select
            v-model:value="selectedFieldKey"
            show-search
            allow-clear
            placeholder="请选择字段"
            style="width: 320px"
            :loading="loadingTemplateFields"
            option-filter-prop="label"
          >
            <a-select-option
              v-for="field in templateFields"
              :key="field.param_key"
              :value="field.param_key"
              :label="`${field.name} (${field.param_key})`"
            >
              {{ field.name }} ({{ field.param_key }})
            </a-select-option>
          </a-select>
          <a-button :disabled="!selectedFieldKey" @click="insertTemplateField(selectedFieldKey || '')">插入字段</a-button>
          <a-button size="small" type="dashed" @click="useDefaultTemplate">恢复默认</a-button>
        </div>
      </div>
      <a-textarea
        v-model:value="editTemplate"
        :rows="5"
        placeholder="请输入 GitOps 提交信息模版，例如：chore(release): {env} -> {image_version}"
      />
      <div class="template-hint modal-hint">
        为空时会自动回退到默认模版，不会生成空提交说明。发布时会从流程参数里读取这些标准 Key 的值。
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.toolbar-card,
.detail-card,
.summary-card {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2329;
}

.page-subtitle {
  margin-top: 6px;
  color: #5c6773;
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
}

.summary-value {
  margin: 10px 0 14px;
  min-height: 44px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  word-break: break-all;
}

.status-alert {
  margin-bottom: 16px;
}

.status-panel {
  margin: 0;
  padding: 14px 16px;
  border-radius: 12px;
  background: #111827;
  color: #f9fafb;
  overflow: auto;
  font-size: 12px;
  line-height: 1.65;
}

.template-block {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f6f8fa;
  color: #1f2329;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  word-break: break-word;
}

.template-hint {
  margin-top: 8px;
  color: #667085;
  font-size: 12px;
  line-height: 1.6;
}

.template-helper {
  margin-bottom: 12px;
}

.template-helper__label {
  display: inline-block;
  margin-bottom: 8px;
  color: #475467;
  font-size: 13px;
}

.template-helper__controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.modal-hint {
  margin-top: 10px;
}
</style>
