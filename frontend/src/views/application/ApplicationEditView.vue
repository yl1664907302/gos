<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getApplicationByID, updateApplication } from '../../api/application'
import { listUserOptions } from '../../api/user'
import type { ApplicationPayload } from '../../types/application'
import { extractHTTPErrorMessage } from '../../utils/http-error'
import ApplicationForm from './ApplicationForm.vue'

interface OwnerOption {
  label: string
  value: string
}

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const ownerLoading = ref(false)
const ownerOptions = ref<OwnerOption[]>([])
const initialValues = ref<Partial<ApplicationPayload>>({})

const applicationId = computed(() => String(route.params.id || ''))

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

async function loadDetail() {
  if (!applicationId.value) {
    message.error('缺少应用 ID')
    void router.push('/applications')
    return
  }

  loading.value = true
  try {
    const response = await getApplicationByID(applicationId.value)
    const app = response.data
    initialValues.value = {
      name: app.name,
      key: app.key,
      repo_url: app.repo_url,
      description: app.description,
      owner_user_id: app.owner_user_id,
      status: app.status,
      artifact_type: app.artifact_type,
      language: app.language,
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '加载应用失败'))
    void router.push('/applications')
  } finally {
    loading.value = false
  }
}

async function handleSubmit(payload: ApplicationPayload) {
  if (!applicationId.value) {
    message.error('缺少应用 ID')
    return
  }

  submitting.value = true
  try {
    await updateApplication(applicationId.value, payload)
    message.success('应用更新成功')
    void router.push(`/applications/${applicationId.value}`)
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用更新失败'))
  } finally {
    submitting.value = false
  }
}

function goBack() {
  if (!applicationId.value) {
    void router.push('/applications')
    return
  }
  void router.push(`/applications/${applicationId.value}`)
}

onMounted(async () => {
  await Promise.all([loadOwnerOptions(), loadDetail()])
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <a-button type="link" @click="goBack">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        返回详情
      </a-button>
      <h2 class="page-title">编辑应用</h2>
    </div>

    <a-skeleton v-if="loading" active :paragraph="{ rows: 8 }" />
    <ApplicationForm
      v-else
      :initial-values="initialValues"
      :owner-options="ownerOptions"
      :owner-loading="ownerLoading"
      :loading="submitting"
      submit-text="保存修改"
      @submit="handleSubmit"
      @cancel="goBack"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
