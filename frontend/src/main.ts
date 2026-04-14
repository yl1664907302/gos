import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'
import { registerHTTPInterceptors } from './api/http'
import { router } from './router'
import { useAuthStore } from './stores/auth'

const PRELOAD_RELOAD_KEY = 'gos-vite-preload-reload-path'
const PRELOAD_RELOAD_QUERY = '__gos_reload'

function buildReloadURL(currentURL: string) {
  const url = new URL(currentURL, window.location.origin)
  url.searchParams.set(PRELOAD_RELOAD_QUERY, String(Date.now()))
  return `${url.pathname}${url.search}${url.hash}`
}

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    const targetPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
    const reloadedPath = sessionStorage.getItem(PRELOAD_RELOAD_KEY)
    if (reloadedPath === targetPath) {
      sessionStorage.removeItem(PRELOAD_RELOAD_KEY)
      return
    }
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, targetPath)
    window.location.replace(buildReloadURL(targetPath))
  })
}

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
  sessionStorage.removeItem(PRELOAD_RELOAD_KEY)
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    if (url.searchParams.has(PRELOAD_RELOAD_QUERY)) {
      url.searchParams.delete(PRELOAD_RELOAD_QUERY)
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
  }
  app.mount('#app')
}

void bootstrap()
