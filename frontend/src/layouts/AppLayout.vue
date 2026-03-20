<script setup lang="ts">
import {
  AppstoreOutlined,
  ClusterOutlined,
  LogoutOutlined,
  RocketOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenuKey = computed(() => {
  if (route.path.startsWith('/system/users')) {
    return ['system-users']
  }
  if (route.path.startsWith('/system/permissions')) {
    return ['system-permissions']
  }
  if (route.path.startsWith('/system/settings')) {
    return ['system-settings']
  }
  if (route.path.includes('/pipeline-bindings')) {
    return ['pipeline-bindings']
  }
  if (route.path.startsWith('/platform-param-dicts')) {
    return ['platform-param-dicts']
  }
  if (route.path.startsWith('/components/executor-params')) {
    return ['executor-param-management']
  }
  if (route.path.startsWith('/components/jenkins')) {
    return ['jenkins-pipeline-list']
  }
  if (route.path.startsWith('/components/argocd')) {
    return ['argocd-management']
  }
  if (route.path.startsWith('/components/gitops')) {
    return ['gitops-management']
  }
  if (route.path.startsWith('/releases')) {
    return ['release-orders']
  }
  if (route.path.startsWith('/release-templates')) {
    return ['release-templates']
  }
  if (route.path.startsWith('/applications')) {
    return ['my-applications']
  }
  return []
})

const openMenuKeys = computed(() => {
  if (route.path.startsWith('/components/')) {
    if (route.path.startsWith('/components/jenkins') || route.path.startsWith('/components/executor-params')) {
      return ['component-management', 'jenkins-management-group']
    }
    return ['component-management']
  }
  if (route.path.startsWith('/releases')) {
    return ['release-management']
  }
  if (route.path.startsWith('/release-templates')) {
    return ['release-management']
  }
  if (route.path.startsWith('/applications') || route.path.startsWith('/platform-param-dicts')) {
    return ['application-management']
  }
  if (route.path.startsWith('/system/')) {
    return ['system-management']
  }
  return []
})

const pageTitle = computed(() => String(route.meta.title || '应用管理'))
const displayName = computed(() => {
  const name = String(authStore.profile?.display_name || '').trim()
  if (name) {
    return name
  }
  return String(authStore.profile?.username || '')
})
const roleText = computed(() => (authStore.isAdmin ? '管理员' : '普通用户'))

const canViewApplications = computed(() => authStore.hasPermission('application.view'))
const canManageApplications = computed(() => authStore.hasPermission('application.manage'))
const canCreateRelease = computed(() => authStore.hasPermission('release.create'))
const canViewPipeline = computed(() => authStore.hasPermission('pipeline.view'))
const canManagePlatformParam = computed(() => authStore.hasPermission('platform_param.manage'))
const canViewComponent = computed(() => authStore.hasPermission('component.view'))
const canManagePipelineParam = computed(() => authStore.hasPermission('pipeline_param.manage'))
const canViewArgoCD = computed(
  () =>
    [
      'component.argocd.view',
      'component.argocd.manage',
      'component.argocd.instance.view',
      'component.argocd.instance.manage',
      'component.argocd.binding.view',
      'component.argocd.binding.manage',
    ].some((code) => authStore.hasPermission(code)),
)
const canViewGitOps = computed(
  () => authStore.hasPermission('component.gitops.view') || authStore.hasPermission('component.gitops.manage'),
)
const canManageReleaseTemplate = computed(() => authStore.hasPermission('release.template.manage'))
const canManageUser = computed(() => authStore.hasPermission('system.user.manage'))
const canManagePermission = computed(() => authStore.hasPermission('system.permission.manage'))

const showApplicationMenu = computed(() => true)
const showComponentMenu = computed(
  () => canViewComponent.value || canManagePipelineParam.value || canViewArgoCD.value || canViewGitOps.value,
)
const showReleaseMenu = computed(() => true)
const showSystemMenu = computed(() => canManageUser.value || canManagePermission.value)

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

function goToExecutorParamManagement() {
  const appID = String(route.params.id || route.query.application_id || '').trim()
  if (appID) {
    void router.push(`/components/executor-params?application_id=${encodeURIComponent(appID)}&binding_type=ci`)
    return
  }
  void router.push('/components/executor-params')
}

function goToArgoCDManagement() {
  void router.push('/components/argocd')
}

function goToGitOpsManagement() {
  void router.push('/components/gitops')
}

function goToReleaseOrders() {
  void router.push('/releases')
}

function goToReleaseTemplates() {
  void router.push('/release-templates')
}

function goToSystemUsers() {
  void router.push('/system/users')
}

function goToSystemPermissions() {
  void router.push('/system/permissions')
}

function goToSystemSettings() {
  void router.push('/system/settings')
}

async function handleLogout() {
  await authStore.logout()
  message.success('已退出登录')
  void router.replace('/login')
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
        <a-sub-menu v-if="showApplicationMenu" key="application-management">
          <template #icon>
            <AppstoreOutlined />
          </template>
          <template #title>应用管理</template>

          <a-menu-item key="my-applications" @click="goToApplications">
            我的应用
          </a-menu-item>
          <a-menu-item v-if="canViewPipeline" key="pipeline-bindings" @click="goToPipelineBindings">
            管线绑定
          </a-menu-item>
          <a-menu-item v-if="canManagePlatformParam" key="platform-param-dicts" @click="goToPlatformParamDicts">
            标准字库
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu v-if="showComponentMenu" key="component-management">
          <template #icon>
            <ClusterOutlined />
          </template>
          <template #title>组件管理</template>

          <a-sub-menu v-if="canViewComponent || canManagePipelineParam" key="jenkins-management-group">
            <template #title>Jenkins管理</template>

            <a-menu-item v-if="canViewComponent" key="jenkins-pipeline-list" @click="goToJenkinsManagement">
              管线列表
            </a-menu-item>
            <a-menu-item v-if="canManagePipelineParam" key="executor-param-management" @click="goToExecutorParamManagement">
              执行器参数
            </a-menu-item>
          </a-sub-menu>

          <a-menu-item v-if="canViewArgoCD" key="argocd-management" @click="goToArgoCDManagement">
            ArgoCD管理
          </a-menu-item>
          <a-menu-item v-if="canViewGitOps" key="gitops-management" @click="goToGitOpsManagement">
            GitOps管理
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu v-if="showReleaseMenu" key="release-management">
          <template #icon>
            <RocketOutlined />
          </template>
          <template #title>发布管理</template>

          <a-menu-item key="release-orders" @click="goToReleaseOrders">发布单</a-menu-item>
          <a-menu-item v-if="canManageReleaseTemplate" key="release-templates" @click="goToReleaseTemplates">
            发布模板
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu v-if="showSystemMenu" key="system-management">
          <template #icon>
            <SettingOutlined />
          </template>
          <template #title>系统管理</template>

          <a-menu-item v-if="canManageUser" key="system-users" @click="goToSystemUsers">
            用户管理
          </a-menu-item>
          <a-menu-item v-if="canManagePermission" key="system-permissions" @click="goToSystemPermissions">
            权限授权
          </a-menu-item>
          <a-menu-item v-if="canManagePermission" key="system-settings" @click="goToSystemSettings">
            系统设置
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="app-header">
        <div class="header-title">{{ pageTitle }}</div>
        <a-space class="header-right">
          <a-tag color="blue">{{ roleText }}</a-tag>
          <span class="username">
            <UserOutlined />
            {{ displayName }}
          </span>
          <a-button type="text" @click="handleLogout">
            <template #icon>
              <LogoutOutlined />
            </template>
            退出
          </a-button>
        </a-space>
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
  justify-content: space-between;
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

.header-right {
  display: flex;
  align-items: center;
}

.username {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #595959;
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
    gap: 8px;
  }

  .header-right {
    gap: 8px;
  }

  .username {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .app-content {
    padding: 16px;
  }
}
</style>
