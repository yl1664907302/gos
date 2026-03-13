<script setup lang="ts">
import { AppstoreOutlined, ClusterOutlined, RocketOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeMenuKey = computed(() => {
  if (route.path.includes('/pipeline-bindings')) {
    return ['pipeline-bindings']
  }
  if (route.path.startsWith('/platform-param-dicts')) {
    return ['platform-param-dicts']
  }
  if (route.path.startsWith('/components/pipeline-params')) {
    return ['pipeline-param-management']
  }
  if (route.path.startsWith('/components/jenkins')) {
    return ['jenkins-management']
  }
  if (route.path.startsWith('/releases')) {
    return ['release-orders']
  }
  if (route.path.startsWith('/applications')) {
    return ['my-applications']
  }
  return []
})

const openMenuKeys = computed(() => {
  if (route.path.startsWith('/components/')) {
    return ['component-management']
  }
  if (route.path.startsWith('/releases')) {
    return ['release-management']
  }
  if (route.path.startsWith('/applications') || route.path.startsWith('/platform-param-dicts')) {
    return ['application-management']
  }
  return []
})

const pageTitle = computed(() => String(route.meta.title || '应用管理'))

function goToApplications() {
  void router.push('/applications')
}

function goToPipelineBindings() {
  const appID = String(route.params.id || route.query.application_id || '').trim()
  if (appID) {
    void router.push(`/applications/${appID}/pipeline-bindings`)
    return
  }
  message.info('请先进入具体应用，再查看管线绑定')
  void router.push('/applications')
}

function goToPlatformParamDicts() {
  void router.push('/platform-param-dicts')
}

function goToJenkinsManagement() {
  void router.push('/components/jenkins')
}

function goToPipelineParamManagement() {
  const appID = String(route.params.id || route.query.application_id || '').trim()
  if (appID) {
    void router.push(`/components/pipeline-params?application_id=${encodeURIComponent(appID)}&binding_type=ci`)
    return
  }
  void router.push('/components/pipeline-params')
}

function goToReleaseOrders() {
  void router.push('/releases')
}
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider class="app-sider" theme="dark" :width="220">
      <div class="sider-brand" @click="goToApplications">GOS Platform</div>
      <a-menu
        mode="inline"
        theme="dark"
        :selected-keys="activeMenuKey"
        :open-keys="openMenuKeys"
        class="sider-menu"
      >
        <a-sub-menu key="application-management">
          <template #icon>
            <AppstoreOutlined />
          </template>
          <template #title>应用管理</template>

          <a-menu-item key="my-applications" @click="goToApplications">我的应用</a-menu-item>
          <a-menu-item key="pipeline-bindings" @click="goToPipelineBindings">管线绑定</a-menu-item>
          <a-menu-item key="platform-param-dicts" @click="goToPlatformParamDicts">标准字库</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="component-management">
          <template #icon>
            <ClusterOutlined />
          </template>
          <template #title>组件管理</template>

          <a-menu-item key="jenkins-management" @click="goToJenkinsManagement">Jenkins管理</a-menu-item>
          <a-menu-item key="pipeline-param-management" @click="goToPipelineParamManagement">管线参数</a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="release-management">
          <template #icon>
            <RocketOutlined />
          </template>
          <template #title>发布管理</template>

          <a-menu-item key="release-orders" @click="goToReleaseOrders">发布单</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="app-header">
        <div class="header-title">{{ pageTitle }}</div>
      </a-layout-header>

      <a-layout-content class="app-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.app-sider {
  min-height: 100vh;
}

.sider-brand {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  background: #001529;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  white-space: nowrap;
}

.sider-menu {
  border-inline-end: none;
}

.app-header {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.app-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 1024px) {
  .app-sider {
    width: 200px !important;
    min-width: 200px !important;
    max-width: 200px !important;
    flex: 0 0 200px !important;
  }

  .app-header {
    padding: 0 20px;
  }

  .app-content {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .app-sider {
    width: 180px !important;
    min-width: 180px !important;
    max-width: 180px !important;
    flex: 0 0 180px !important;
  }

  .sider-brand {
    padding: 0 12px;
    font-size: 14px;
  }

  .app-header {
    padding: 0 16px;
  }

  .app-content {
    padding: 16px;
  }
}
</style>
