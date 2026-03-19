import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as vueCompiler from 'vue/compiler-sfc'

const disableHMR = process.env.VITE_DISABLE_HMR === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // 显式传入 compiler，避免 plugin-vue 在 HMR 极端时序下拿到空 compiler
      // 导致 `invalidateTypeCache` 空指针报错。
      compiler: vueCompiler,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    // 稳定模式下关闭 HMR，并改用轮询监听，牺牲一点实时性换更稳的开发服务。
    hmr: disableHMR ? false : undefined,
    watch: disableHMR
      ? {
          usePolling: true,
          interval: 500,
        }
      : undefined,
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
})
