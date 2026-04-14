<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createApplication } from '../../api/application'
import { listProjects } from '../../api/project'
import { listUserOptions } from '../../api/user'
import type { ApplicationPayload } from '../../types/application'
import { extractHTTPErrorMessage } from '../../utils/http-error'
import ApplicationForm from './ApplicationForm.vue'

interface OwnerOption {
  label: string
  value: string
}

interface ProjectOption {
  label: string
  value: string
}

const router = useRouter()
const submitting = ref(false)
const ownerLoading = ref(false)
const projectLoading = ref(false)
const ownerOptions = ref<OwnerOption[]>([])
const projectOptions = ref<ProjectOption[]>([])

async function loadOwnerOptions() {
  ownerLoading.value = true
  try {
    const response = await listUserOptions()
    ownerOptions.value = response.data.map((item) => ({
      label: `${item.display_name} (${item.username})`,
      value: item.id,
    }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '负责人下拉加载失败'))
  } finally {
    ownerLoading.value = false
  }
}

async function loadProjectOptions() {
  projectLoading.value = true
  try {
    const response = await listProjects({ page: 1, page_size: 200, status: 'active' })
    projectOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '项目下拉加载失败'))
  } finally {
    projectLoading.value = false
  }
}

async function handleSubmit(payload: ApplicationPayload) {
  submitting.value = true
  try {
    const response = await createApplication(payload)
    message.success('应用创建成功')
    void router.push(`/applications/${response.data.id}`)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用创建失败'))
  } finally {
    submitting.value = false
  }
}

function goBack() {
  void router.push('/applications')
}

onMounted(() => {
  void Promise.all([loadOwnerOptions(), loadProjectOptions()])
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-main">
        <a-button type="link" class="page-header-back" @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
          返回列表
        </a-button>
        <div class="page-header-copy">
          <h2 class="page-title">新增应用</h2>
          <p class="page-subtitle">创建新的应用档案，补齐基础信息后即可继续绑定管线、配置模板并进入发布链路</p>
        </div>
      </div>
    </div>

    <ApplicationForm
      :owner-options="ownerOptions"
      :project-options="projectOptions"
      :owner-loading="ownerLoading"
      :project-loading="projectLoading"
      :loading="submitting"
      submit-text="创建应用"
      @submit="handleSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
}

.page-header-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .page-header {
    align-items: stretch;
  }
}
</style>
