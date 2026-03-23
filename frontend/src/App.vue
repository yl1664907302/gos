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
        colorInfo: '#334155',
        colorInfoHover: '#1e293b',
        colorInfoActive: '#0f172a',
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
        fontSize: 14,
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>
