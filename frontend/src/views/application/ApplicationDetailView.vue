<script setup lang="ts">
import { ArrowLeftOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApplicationByID } from '../../api/application'
import type { Application } from '../../types/application'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const application = ref<Application | null>(null)

const applicationId = computed(() => String(route.params.id || ''))

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
  if (!applicationId.value) {
    return
  }
  void router.push({
    path: '/releases/new',
    query: { application_id: applicationId.value },
  })
}

onMounted(() => {
  void loadDetail()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <a-space>
        <a-button @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回列表
        </a-button>
        <a-button type="primary" @click="toEdit">
          <template #icon>
            <EditOutlined />
          </template>
          去编辑
        </a-button>
        <a-button @click="toBindings">
          <template #icon>
            <LinkOutlined />
          </template>
          管线绑定
        </a-button>
        <a-button type="primary" ghost @click="toRelease">发起发布</a-button>
      </a-space>
    </div>

    <a-card title="应用详情" :bordered="true" class="detail-card" :loading="loading">
      <a-descriptions :column="{ xs: 1, md: 2 }" bordered>
        <a-descriptions-item v-for="item in detailItems" :key="item.label" :label="item.label">
          {{ item.value }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: flex-start;
}

.detail-card {
  border-radius: var(--radius-xl);
}
</style>
