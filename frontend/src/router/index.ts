import { message } from 'ant-design-vue'
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import ApplicationCreateView from '../views/application/ApplicationCreateView.vue'
import ApplicationDetailView from '../views/application/ApplicationDetailView.vue'
import ApplicationEditView from '../views/application/ApplicationEditView.vue'
import ApplicationListView from '../views/application/ApplicationListView.vue'
import ApplicationPipelineBindingView from '../views/application/ApplicationPipelineBindingView.vue'
import PlatformParamDictView from '../views/application/PlatformParamDictView.vue'
import ArgoCDManagementView from '../views/component/ArgoCDManagementView.vue'
import GitOpsManagementView from '../views/component/GitOpsManagementView.vue'
import JenkinsManagementView from '../views/component/JenkinsManagementView.vue'
import ExecutorParamManagementView from '../views/component/ExecutorParamManagementView.vue'
import ForbiddenView from '../views/exception/ForbiddenView.vue'
import LoginView from '../views/login/LoginView.vue'
import ReleaseOrderCreateView from '../views/release/ReleaseOrderCreateView.vue'
import ReleaseOrderDetailView from '../views/release/ReleaseOrderDetailView.vue'
import ReleaseOrderListView from '../views/release/ReleaseOrderListView.vue'
import ReleaseTemplateView from '../views/release/ReleaseTemplateView.vue'
import SystemPermissionView from '../views/system/SystemPermissionView.vue'
import SystemUserView from '../views/system/SystemUserView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    public?: boolean
    permission?: string | string[]
  }
}

function normalizePermissions(metaPermission: string | string[] | undefined): string[] {
  if (!metaPermission) {
    return []
  }
  if (Array.isArray(metaPermission)) {
    return metaPermission.map((item) => String(item || '').trim()).filter(Boolean)
  }
  const value = String(metaPermission || '').trim()
  return value ? [value] : []
}

function resolveFirstAccessiblePath(authStore: ReturnType<typeof useAuthStore>) {
  if (authStore.hasPermission('application.view') || authStore.hasPermission('application.manage')) {
    return '/applications'
  }
  if (authStore.hasPermission('platform_param.manage')) {
    return '/platform-param-dicts'
  }
  if (
    authStore.hasPermission('release.view') ||
    authStore.hasPermission('release.create') ||
    authStore.hasPermission('release.execute') ||
    authStore.hasPermission('release.cancel')
  ) {
    return '/releases'
  }
  if (authStore.hasPermission('release.template.manage')) {
    return '/release-templates'
  }
  if (authStore.hasPermission('component.view')) {
    return '/components/jenkins'
  }
  if (authStore.hasPermission('component.argocd.view') || authStore.hasPermission('component.argocd.manage')) {
    return '/components/argocd'
  }
  if (authStore.hasPermission('component.gitops.view')) {
    return '/components/gitops'
  }
  if (authStore.hasPermission('pipeline_param.manage')) {
    return '/components/executor-params'
  }
  if (authStore.hasPermission('system.user.manage')) {
    return '/system/users'
  }
  if (authStore.hasPermission('system.permission.manage')) {
    return '/system/permissions'
  }
  return '/403'
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录', public: true },
    },
    {
      path: '/403',
      name: 'forbidden',
      component: ForbiddenView,
      meta: { title: '无权限', public: true },
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          redirect: '/applications',
        },
        {
          path: 'applications',
          name: 'application-list',
          component: ApplicationListView,
          meta: { title: '我的应用', permission: ['application.view', 'application.manage'] },
        },
        {
          path: 'applications/new',
          name: 'application-create',
          component: ApplicationCreateView,
          meta: { title: '新增应用', permission: 'application.manage' },
        },
        {
          path: 'applications/:id',
          name: 'application-detail',
          component: ApplicationDetailView,
          meta: { title: '应用详情', permission: ['application.view', 'application.manage'] },
        },
        {
          path: 'applications/:id/edit',
          name: 'application-edit',
          component: ApplicationEditView,
          meta: { title: '编辑应用', permission: 'application.manage' },
        },
        {
          path: 'applications/:id/pipeline-bindings',
          name: 'application-pipeline-bindings',
          component: ApplicationPipelineBindingView,
          meta: { title: '管线绑定', permission: ['pipeline.view', 'pipeline.manage'] },
        },
        {
          path: 'platform-param-dicts',
          name: 'platform-param-dicts',
          component: PlatformParamDictView,
          meta: { title: '标准字库', permission: 'platform_param.manage' },
        },
        {
          path: 'components/jenkins',
          name: 'jenkins-management',
          component: JenkinsManagementView,
          meta: { title: '管线列表', permission: 'component.view' },
        },
        {
          path: 'components/argocd',
          name: 'argocd-management',
          component: ArgoCDManagementView,
          meta: { title: 'ArgoCD管理', permission: ['component.argocd.view', 'component.argocd.manage'] },
        },
        {
          path: 'components/gitops',
          name: 'gitops-management',
          component: GitOpsManagementView,
          meta: { title: 'GitOps管理', permission: 'component.gitops.view' },
        },
        {
          path: 'components/executor-params',
          name: 'executor-param-management',
          component: ExecutorParamManagementView,
          meta: { title: '执行器参数', permission: 'pipeline_param.manage' },
        },
        {
          path: 'releases',
          name: 'release-order-list',
          component: ReleaseOrderListView,
          meta: { title: '发布单', permission: ['release.view', 'release.create', 'release.execute', 'release.cancel'] },
        },
        {
          path: 'releases/new',
          name: 'release-order-create',
          component: ReleaseOrderCreateView,
          meta: { title: '新建发布单', permission: 'release.create' },
        },
        {
          path: 'releases/:id',
          name: 'release-order-detail',
          component: ReleaseOrderDetailView,
          meta: { title: '发布单详情', permission: ['release.view', 'release.create', 'release.execute', 'release.cancel'] },
        },
        {
          path: 'release-templates',
          name: 'release-template-list',
          component: ReleaseTemplateView,
          meta: { title: '发布模板', permission: 'release.template.manage' },
        },
        {
          path: 'system/users',
          name: 'system-users',
          component: SystemUserView,
          meta: { title: '用户管理', permission: 'system.user.manage' },
        },
        {
          path: 'system/permissions',
          name: 'system-permissions',
          component: SystemPermissionView,
          meta: { title: '权限授权', permission: 'system.permission.manage' },
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const token = String(authStore.accessToken || '').trim()
  const isPublic = Boolean(to.meta.public)

  if (isPublic) {
    // 登录页始终可访问，方便已登录用户切换账号。
    return true
  }

  if (!token) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  try {
    await authStore.loadMe(true)
  } catch {
    authStore.clearAuthState()
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  const permissions = normalizePermissions(to.meta.permission)
  if (permissions.length === 0) {
    return true
  }

  const allowed = permissions.some((item) => authStore.hasPermission(item))
  if (!allowed) {
    const fallback = resolveFirstAccessiblePath(authStore)
    if (fallback !== '/403' && fallback !== to.path) {
      message.warning('当前账号无该页面权限，已跳转到可访问页面')
      return { path: fallback }
    }
    message.warning('当前账号没有访问该页面的权限')
    return { path: '/403' }
  }
  return true
})
