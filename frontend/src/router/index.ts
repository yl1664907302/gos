import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import ApplicationCreateView from '../views/application/ApplicationCreateView.vue'
import ApplicationDetailView from '../views/application/ApplicationDetailView.vue'
import ApplicationEditView from '../views/application/ApplicationEditView.vue'
import ApplicationListView from '../views/application/ApplicationListView.vue'
import ApplicationPipelineBindingView from '../views/application/ApplicationPipelineBindingView.vue'
import PlatformParamDictView from '../views/application/PlatformParamDictView.vue'
import JenkinsManagementView from '../views/component/JenkinsManagementView.vue'
import PipelineParamManagementView from '../views/component/PipelineParamManagementView.vue'
import ReleaseOrderCreateView from '../views/release/ReleaseOrderCreateView.vue'
import ReleaseOrderDetailView from '../views/release/ReleaseOrderDetailView.vue'
import ReleaseOrderListView from '../views/release/ReleaseOrderListView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
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
          meta: { title: '我的应用' },
        },
        {
          path: 'applications/new',
          name: 'application-create',
          component: ApplicationCreateView,
          meta: { title: '新增应用' },
        },
        {
          path: 'applications/:id',
          name: 'application-detail',
          component: ApplicationDetailView,
          meta: { title: '应用详情' },
        },
        {
          path: 'applications/:id/edit',
          name: 'application-edit',
          component: ApplicationEditView,
          meta: { title: '编辑应用' },
        },
        {
          path: 'applications/:id/pipeline-bindings',
          name: 'application-pipeline-bindings',
          component: ApplicationPipelineBindingView,
          meta: { title: '管线绑定' },
        },
        {
          path: 'platform-param-dicts',
          name: 'platform-param-dicts',
          component: PlatformParamDictView,
          meta: { title: '标准字库' },
        },
        {
          path: 'components/jenkins',
          name: 'jenkins-management',
          component: JenkinsManagementView,
          meta: { title: 'Jenkins管理' },
        },
        {
          path: 'components/pipeline-params',
          name: 'pipeline-param-management',
          component: PipelineParamManagementView,
          meta: { title: '管线参数' },
        },
        {
          path: 'releases',
          name: 'release-order-list',
          component: ReleaseOrderListView,
          meta: { title: '发布单' },
        },
        {
          path: 'releases/new',
          name: 'release-order-create',
          component: ReleaseOrderCreateView,
          meta: { title: '新建发布单' },
        },
        {
          path: 'releases/:id',
          name: 'release-order-detail',
          component: ReleaseOrderDetailView,
          meta: { title: '发布单详情' },
        },
      ],
    },
  ],
})
