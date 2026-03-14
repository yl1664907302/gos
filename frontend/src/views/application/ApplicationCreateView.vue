<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createApplication } from '../../api/application'
import { listUserOptions } from '../../api/user'
import type { ApplicationPayload } from '../../types/application'
import { extractHTTPErrorMessage } from '../../utils/http-error'
import ApplicationForm from './ApplicationForm.vue'

interface OwnerOption {
  label: string
  value: string
}

const router = useRouter()
const submitting = ref(false)
const ownerLoading = ref(false)
const ownerOptions = ref<OwnerOption[]>([])

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
  void loadOwnerOptions()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <a-button type="link" @click="goBack">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        返回列表
      </a-button>
      <h2 class="page-title">新增应用</h2>
    </div>

    <ApplicationForm
      :owner-options="ownerOptions"
      :owner-loading="ownerLoading"
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
