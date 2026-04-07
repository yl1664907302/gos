<script setup lang="ts">
import { ArrowLeftOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApplicationByID } from '../../api/application'
import { listReleaseTemplates } from '../../api/release'
import { useAuthStore } from '../../stores/auth'
import type { Application } from '../../types/application'
import { extractHTTPErrorMessage, isHTTPStatus } from '../../utils/http-error'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const application = ref<Application | null>(null)
const loadingTemplateAvailability = ref(false)
const hasActiveTemplate = ref(false)

const applicationId = computed(() => String(route.params.id || ''))
const canManageApplication = computed(() => authStore.hasPermission('application.manage'))
const canViewPipeline = computed(() => authStore.hasPermission('pipeline.view'))
const canCreateRelease = computed(
  () =>
    authStore.hasApplicationPermission('release.create', applicationId.value) &&
    hasActiveTemplate.value &&
    !loadingTemplateAvailability.value,
)

const detailItems = computed(() => {
  if (!application.value) {
    return []
  }
  const app = application.value
  return [
    { label: '应用 ID', value: app.id },
    { label: '应用名称', value: app.name },
    { label: '应用 Key', value: app.key },
    { label: '状态', value: app.status },
    { label: '负责人', value: app.owner || '-' },
    { label: '制品类型', value: app.artifact_type || '-' },
    { label: '语言', value: app.language || '-' },
    { label: '仓库地址', value: app.repo_url || '-' },
    { label: '描述', value: app.description || '-' },
    { label: '创建时间', value: formatTime(app.created_at) },
    { label: '更新时间', value: formatTime(app.updated_at) },
  ]
})

const gitopsBranchMappings = computed(() => application.value?.gitops_branch_mappings ?? [])

function formatTime(value: string) {
  if (!value) {
    return '-'
  }
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

async function loadDetail() {
  if (!applicationId.value) {
    message.error('缺少应用 ID')
    void router.push('/applications')
    return
  }

  loading.value = true
  try {
    const response = await getApplicationByID(applicationId.value)
    application.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用详情加载失败'))
    void router.push('/applications')
  } finally {
    loading.value = false
  }
}

async function loadTemplateAvailability() {
  if (!applicationId.value) {
    hasActiveTemplate.value = false
    return
  }
  loadingTemplateAvailability.value = true
  try {
    const response = await listReleaseTemplates({
      application_id: applicationId.value,
      status: 'active',
      page: 1,
      page_size: 1,
    })
    hasActiveTemplate.value = response.total > 0
  } catch (error) {
    hasActiveTemplate.value = false
    if (!isHTTPStatus(error, 403)) {
      message.error(extractHTTPErrorMessage(error, '发布模板状态加载失败'))
    }
  } finally {
    loadingTemplateAvailability.value = false
  }
}

function goBack() {
  void router.push('/applications')
}

function toEdit() {
  if (!applicationId.value) {
    return
  }
  void router.push(`/applications/${applicationId.value}/edit`)
}

function toBindings() {
  if (!applicationId.value) {
    return
  }
  void router.push(`/applications/${applicationId.value}/pipeline-bindings`)
}

function toRelease() {
  if (!applicationId.value || !canCreateRelease.value) {
    return
  }
  void router.push({
    path: '/releases/new',
    query: { application_id: applicationId.value },
  })
}

onMounted(() => {
  void Promise.all([loadDetail(), loadTemplateAvailability()])
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-main">
        <a-button class="page-header-back" @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回列表
        </a-button>
        <div class="page-header-copy">
          <h2 class="page-title">应用详情</h2>
          <p class="page-subtitle">集中查看应用基础档案、仓库信息与发布准备情况，常用操作会始终保持在标题区右侧。</p>
        </div>
      </div>
      <a-space class="page-header-actions" wrap>
        <a-button v-if="canManageApplication" type="primary" @click="toEdit">
          <template #icon>
            <EditOutlined />
          </template>
          去编辑
        </a-button>
        <a-button v-if="canViewPipeline" @click="toBindings">
          <template #icon>
            <LinkOutlined />
          </template>
          管线绑定
        </a-button>
        <a-button type="primary" ghost :disabled="!canCreateRelease" @click="toRelease">发起发布</a-button>
      </a-space>
    </div>

    <a-card title="应用详情" :bordered="true" class="detail-card" :loading="loading">
      <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
        <a-descriptions-item v-for="item in detailItems" :key="item.label" :label="item.label">
          {{ item.value }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-card title="GitOps 分支环境映射" :bordered="true" class="detail-card" :loading="loading">
      <div v-if="!gitopsBranchMappings.length" class="mapping-empty">
        当前未配置映射，平台默认按 `app_key-env` 规则选分支。
      </div>
      <a-table
        v-else
        :data-source="gitopsBranchMappings"
        :pagination="false"
        row-key="env_code"
        size="small"
      >
        <a-table-column title="环境" data-index="env_code" key="env_code" />
        <a-table-column title="Git 分支" data-index="branch" key="branch" />
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.page-header-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.page-header-actions {
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header-actions {
    justify-content: flex-start;
  }
}

.detail-card {
  border-radius: var(--radius-xl);
}

.mapping-empty {
  color: var(--text-color-secondary);
}
</style>
