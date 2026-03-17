<script setup lang="ts">
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { getGitOpsStatus } from '../../api/gitops'
import type { GitOpsStatus } from '../../types/gitops'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const loading = ref(false)
const detail = ref<GitOpsStatus | null>(null)

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
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, 'GitOps 状态加载失败'))
  } finally {
    loading.value = false
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

onMounted(() => {
  void loadDetail()
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
</style>
