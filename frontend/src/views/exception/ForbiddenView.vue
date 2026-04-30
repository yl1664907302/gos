<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function backHome() {
  void router.replace('/')
}

async function toLogin() {
  await authStore.logout()
  await router.replace('/login')
}
</script>

<template>
  <div class="forbidden-page">
    <a-result
      status="403"
      title="403"
      sub-title="抱歉，当前账号没有访问该页面的权限"
    >
      <template #extra>
        <a-space>
          <a-button @click="backHome">返回首页</a-button>
          <a-button type="primary" @click="toLogin">返回登录</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<style scoped>
.forbidden-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f5f7fa;
}
</style>
