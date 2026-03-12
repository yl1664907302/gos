<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 12,
        fontSize: 14,
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>
