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
  if (route.path.startsWith('/system/notifications')) {
    return ['system-notifications']
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
  if (route.path.startsWith('/components/agents')) {
    return ['agent-overview']
  }
  if (route.path.startsWith('/components/agent-scripts')) {
    return ['agent-script-management']
  }
  if (route.path.startsWith('/components/agent-tasks')) {
    return ['agent-task-management']
  }
  if (route.path.startsWith('/releases')) {
    return ['release-orders']
  }
  if (route.path.startsWith('/release-approvals')) {
    return ['release-approval-workbench']
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
    if (
      route.path.startsWith('/components/agents') ||
      route.path.startsWith('/components/agent-scripts') ||
      route.path.startsWith('/components/agent-tasks')
    ) {
      return ['component-management', 'agent-management-group']
    }
    return ['component-management']
  }
  if (route.path.startsWith('/releases')) {
    return ['release-management']
  }
  if (route.path.startsWith('/release-approvals')) {
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
const canViewAgent = computed(
  () => authStore.hasPermission('component.agent.view') || authStore.hasPermission('component.agent.manage'),
)
const canManageReleaseTemplate = computed(() => authStore.hasPermission('release.template.manage'))
const canManageUser = computed(() => authStore.hasPermission('system.user.manage'))
const canManagePermission = computed(() => authStore.hasPermission('system.permission.manage'))
const canManageNotification = computed(() => authStore.hasPermission('system.notification.manage'))

const showApplicationMenu = computed(() => true)
const showComponentMenu = computed(
  () =>
    canViewComponent.value ||
    canManagePipelineParam.value ||
    canViewArgoCD.value ||
    canViewGitOps.value ||
    canViewAgent.value,
)
const showReleaseMenu = computed(() => true)
const showSystemMenu = computed(() => canManageUser.value || canManagePermission.value || canManageNotification.value)

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

function goToAgentManagement() {
  void router.push('/components/agents')
}

function goToAgentScriptManagement() {
  void router.push('/components/agent-scripts')
}

function goToAgentTaskManagement() {
  void router.push('/components/agent-tasks')
}

function goToReleaseOrders() {
  void router.push('/releases')
}

function goToReleaseTemplates() {
  void router.push('/release-templates')
}

function goToReleaseApprovalWorkbench() {
  void router.push('/release-approvals')
}

function goToSystemUsers() {
  void router.push('/system/users')
}

function goToSystemPermissions() {
  void router.push('/system/permissions')
}

function goToSystemNotifications() {
  void router.push('/system/notifications')
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
      <div class="sider-brand" @click="goToApplications">
        <div class="brand-mark">G</div>
        <div class="brand-copy">
          <div class="brand-title">GOS Release</div>
          <div class="brand-subtitle">发布工作台</div>
        </div>
      </div>
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
          <a-sub-menu v-if="canViewAgent" key="agent-management-group">
            <template #title>Agent管理</template>

            <a-menu-item key="agent-overview" @click="goToAgentManagement">
              Agent概览
            </a-menu-item>
            <a-menu-item key="agent-script-management" @click="goToAgentScriptManagement">
              脚本管理
            </a-menu-item>
            <a-menu-item key="agent-task-management" @click="goToAgentTaskManagement">
              任务管理
            </a-menu-item>
          </a-sub-menu>
        </a-sub-menu>

        <a-sub-menu v-if="showReleaseMenu" key="release-management">
          <template #icon>
            <RocketOutlined />
          </template>
          <template #title>发布管理</template>

          <a-menu-item key="release-orders" @click="goToReleaseOrders">发布单</a-menu-item>
          <a-menu-item key="release-approval-workbench" @click="goToReleaseApprovalWorkbench">
            审批工作台
          </a-menu-item>
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
          <a-menu-item v-if="canManageNotification" key="system-notifications" @click="goToSystemNotifications">
            通知模块
          </a-menu-item>
          <a-menu-item v-if="canManagePermission" key="system-settings" @click="goToSystemSettings">
            系统设置
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
      <div class="sider-footer">
        <div class="sider-footer-role">{{ roleText }}</div>
        <div class="sider-footer-user">
          <UserOutlined />
          <span>{{ displayName }}</span>
        </div>
        <a-button type="text" class="sider-footer-logout" @click="handleLogout">
          <template #icon>
            <LogoutOutlined />
          </template>
          退出登录
        </a-button>
      </div>
    </a-layout-sider>

    <a-layout>
      <a-layout-content class="app-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 24%),
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.08), transparent 22%),
    linear-gradient(180deg, #eaf0f8 0%, #edf2f8 18%, #f3f6fb 100%);
}

.app-sider {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.2), transparent 30%),
    linear-gradient(180deg, #0d1728 0%, #101b2d 52%, #0b1424 100%) !important;
  border-inline-end: 1px solid rgba(96, 165, 250, 0.1);
  box-shadow: 18px 0 44px rgba(15, 23, 42, 0.14);
}

.sider-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 88px;
  padding: 20px 22px 18px;
  color: #fff;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
  cursor: pointer;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: 1px solid rgba(96, 165, 250, 0.24);
  background:
    linear-gradient(180deg, rgba(37, 99, 235, 0.3), rgba(15, 23, 42, 0.18)),
    rgba(59, 130, 246, 0.08);
  color: #eff6ff;
  font-size: 18px;
  font-weight: 800;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.brand-copy {
  min-width: 0;
}

.brand-title {
  color: #f8fafc;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand-subtitle {
  margin-top: 4px;
  color: rgba(191, 219, 254, 0.72);
  font-size: 12px;
  letter-spacing: 0.08em;
}

.sider-menu {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  border-inline-end: none;
  padding: 14px 10px 18px;
  background: transparent !important;
}

.app-content {
  width: 100%;
  max-width: 1520px;
  margin: 0 auto;
  padding: 28px 28px 32px;
  position: relative;
}

.app-content::before {
  content: '';
  position: absolute;
  inset: 0 24px auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.16), transparent);
  pointer-events: none;
}

.app-sider :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
}

.sider-menu :deep(.ant-menu),
.sider-menu :deep(.ant-menu-dark),
.sider-menu :deep(.ant-menu-inline) {
  background: transparent !important;
}

.sider-menu :deep(.ant-menu-submenu-title),
.sider-menu :deep(.ant-menu-item) {
  height: 46px;
  margin: 6px 0;
  border-radius: 14px;
  color: rgba(226, 232, 240, 0.82) !important;
  transition: all 0.2s ease;
}

.sider-menu :deep(.ant-menu-submenu-title:hover),
.sider-menu :deep(.ant-menu-item:hover) {
  color: #f8fafc !important;
  background: rgba(51, 65, 85, 0.58) !important;
}

.sider-menu :deep(.ant-menu-submenu-title .ant-menu-title-content),
.sider-menu :deep(.ant-menu-item .ant-menu-title-content) {
  font-weight: 600;
}

.sider-menu :deep(.ant-menu-submenu-title .anticon),
.sider-menu :deep(.ant-menu-item .anticon) {
  color: rgba(191, 219, 254, 0.76);
}

.sider-menu :deep(.ant-menu-submenu-open > .ant-menu-submenu-title) {
  color: #f8fafc !important;
  background: rgba(30, 41, 59, 0.66) !important;
}

.sider-menu :deep(.ant-menu-submenu-selected > .ant-menu-submenu-title) {
  color: #f8fafc !important;
}

.sider-menu :deep(.ant-menu-item-selected) {
  color: #eff6ff !important;
  border: 1px solid rgba(96, 165, 250, 0.24);
  background:
    linear-gradient(135deg, rgba(29, 78, 216, 0.62), rgba(37, 99, 235, 0.34)) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 8px 18px rgba(15, 23, 42, 0.16);
}

.sider-menu :deep(.ant-menu-item-selected .anticon),
.sider-menu :deep(.ant-menu-item-selected .ant-menu-title-content) {
  color: #eff6ff !important;
}

.sider-menu :deep(.ant-menu-sub.ant-menu-inline) {
  margin-top: 4px;
  padding: 2px 0 8px !important;
  background: transparent !important;
}

.sider-menu :deep(.ant-menu-sub.ant-menu-inline .ant-menu-submenu-title),
.sider-menu :deep(.ant-menu-sub.ant-menu-inline .ant-menu-item) {
  margin-inline: 0;
  padding-inline-start: 16px !important;
  color: rgba(203, 213, 225, 0.84) !important;
  border-radius: 12px;
}

.sider-menu :deep(.ant-menu-sub.ant-menu-inline .ant-menu-item::before) {
  display: none;
}

.sider-menu :deep(.ant-menu-sub.ant-menu-inline .ant-menu-item-selected::before) {
  display: none;
}

.sider-footer {
  margin-top: auto;
  flex: 0 0 auto;
  padding: 16px 14px 18px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
  background: linear-gradient(180deg, rgba(9, 14, 24, 0), rgba(9, 14, 24, 0.34));
}

.sider-menu::-webkit-scrollbar {
  width: 6px;
}

.sider-menu::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.24);
}

.sider-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sider-footer-role {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(96, 165, 250, 0.18);
  background: rgba(59, 130, 246, 0.12);
  color: #dbeafe;
  font-size: 12px;
  font-weight: 600;
}

.sider-footer-user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: rgba(226, 232, 240, 0.82);
  font-size: 13px;
  font-weight: 500;
}

.sider-footer-logout {
  margin-top: 12px;
  width: 100%;
  justify-content: flex-start;
  border-radius: 12px;
  color: rgba(226, 232, 240, 0.82);
}

.sider-footer-logout:hover,
.sider-footer-logout:focus {
  color: #eff6ff;
  background: rgba(51, 65, 85, 0.72);
}

@media (max-width: 1024px) {
  .app-sider {
    width: 200px !important;
    min-width: 200px !important;
    max-width: 200px !important;
    flex: 0 0 200px !important;
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
    min-height: 76px;
    gap: 10px;
  }

  .brand-title {
    font-size: 16px;
  }

  .app-content {
    padding: 16px;
  }
}
</style>
