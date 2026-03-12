import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import ApplicationCreateView from '../views/application/ApplicationCreateView.vue'
import ApplicationDetailView from '../views/application/ApplicationDetailView.vue'
import ApplicationEditView from '../views/application/ApplicationEditView.vue'
import ApplicationListView from '../views/application/ApplicationListView.vue'

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
      ],
    },
  ],
})
