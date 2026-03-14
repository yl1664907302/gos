<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formState = reactive({
  username: '',
  password: '',
})

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await authStore.login(formState.username, formState.password)
    message.success('登录成功')
    const redirect = String(route.query.redirect || '').trim()
    void router.replace(redirect || '/applications')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '登录失败，请检查用户名和密码'))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-background"></div>
    <a-card class="login-card" :bordered="false">
      <div class="login-title-area">
        <h1 class="login-title">GOS 平台登录</h1>
        <p class="login-subtitle">内部部署平台 · 用户与权限统一入口</p>
      </div>

      <a-form
        ref="formRef"
        layout="vertical"
        :model="formState"
        :rules="rules"
        autocomplete="off"
        @keyup.enter="handleSubmit"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username" placeholder="请输入用户名">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="formState.password" placeholder="请输入密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-button type="primary" block :loading="submitting" @click="handleSubmit">登录</a-button>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #eaf3ff 0%, #f7fafc 45%, #eff8f1 100%);
  padding: 20px;
}

.login-background {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 20%, rgba(22, 119, 255, 0.12), transparent 32%),
    radial-gradient(circle at 78% 30%, rgba(82, 196, 26, 0.12), transparent 36%),
    radial-gradient(circle at 50% 80%, rgba(24, 144, 255, 0.08), transparent 40%);
  pointer-events: none;
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 14px 38px rgba(15, 35, 95, 0.12);
}

.login-title-area {
  margin-bottom: 8px;
}

.login-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f1f1f;
}

.login-subtitle {
  margin: 8px 0 16px;
  color: #595959;
}

@media (max-width: 768px) {
  .login-card {
    max-width: 100%;
  }

  .login-title {
    font-size: 22px;
  }
}
</style>
