<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createApplication } from '../../api/application'
import type { ApplicationPayload } from '../../types/application'
import { extractHTTPErrorMessage } from '../../utils/http-error'
import ApplicationForm from './ApplicationForm.vue'

const router = useRouter()
const submitting = ref(false)

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

    <ApplicationForm :loading="submitting" submit-text="创建应用" @submit="handleSubmit" @cancel="goBack" />
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
