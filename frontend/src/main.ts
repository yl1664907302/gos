import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'
import { registerHTTPInterceptors } from './api/http'
import { router } from './router'
import { useAuthStore } from './stores/auth'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  const authStore = useAuthStore(pinia)
  registerHTTPInterceptors({
    getAccessToken: () => authStore.accessToken,
    onUnauthorized: () => {
      const currentPath = String(router.currentRoute.value.fullPath || '')
      if (currentPath.startsWith('/login')) {
        return
      }
      authStore.clearAuthState()
      void router.replace({
        path: '/login',
        query: currentPath ? { redirect: currentPath } : undefined,
      })
    },
  })

  if (String(authStore.accessToken || '').trim()) {
    try {
      await authStore.loadMe()
    } catch {
      authStore.clearAuthState()
    }
  }

  app.use(router)
  app.use(Antd)
  await router.isReady()
  app.mount('#app')
}

void bootstrap()
