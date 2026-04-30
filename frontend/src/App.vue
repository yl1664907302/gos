<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#1e293b',
        colorPrimaryHover: '#334155',
        colorPrimaryActive: '#0f172a',
        colorInfo: '#2563eb',
        colorInfoHover: '#1d4ed8',
        colorInfoActive: '#1e40af',
        colorLink: '#334155',
        colorLinkHover: '#1e293b',
        colorSuccess: '#16a34a',
        colorWarning: '#d97706',
        colorError: '#dc2626',
        colorText: '#111827',
        colorTextSecondary: '#64748b',
        colorBorder: '#d7dee8',
        colorBgLayout: '#f3f6fb',
        colorBgContainer: '#ffffff',
        colorTextLightSolid: '#eff6ff',
        borderRadius: 12,
        fontSize: 12,
      },
    }"
  >
    <router-view v-slot="{ Component, route }">
      <Transition name="root-route-switch" mode="out-in" appear>
        <component :is="Component" :key="route.matched[0]?.path || route.path" class="root-route-view" />
      </Transition>
    </router-view>
  </a-config-provider>
</template>

<style scoped>
.root-route-view {
  min-height: 100vh;
}

.root-route-switch-enter-active,
.root-route-switch-leave-active {
  transition: opacity 0.12s ease;
}

.root-route-switch-enter-from {
  opacity: 0;
}

.root-route-switch-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .root-route-switch-enter-active,
  .root-route-switch-leave-active {
    transition: none;
  }
}
</style>
