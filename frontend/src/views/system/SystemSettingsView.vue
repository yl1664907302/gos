<script setup lang="ts">
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { getReleaseSettings, updateReleaseSettings } from '../../api/system'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const loading = ref(false)
const saving = ref(false)
const envOptions = ref<string[]>([])

function normalizeEnvOptions(values: string[]) {
  const result: string[] = []
  const seen = new Set<string>()
  values.forEach((item) => {
    const value = String(item || '').trim()
    if (!value || seen.has(value)) {
      return
    }
    seen.add(value)
    result.push(value)
  })
  return result
}

async function loadSettings() {
  loading.value = true
  try {
    const response = await getReleaseSettings()
    envOptions.value = normalizeEnvOptions(response.data.env_options || [])
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '系统设置加载失败'))
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  const normalized = normalizeEnvOptions(envOptions.value)
  if (normalized.length === 0) {
    message.warning('请至少保留一个发布环境选项')
    return
  }
  saving.value = true
  try {
    const response = await updateReleaseSettings({
      env_options: normalized,
    })
    envOptions.value = normalizeEnvOptions(response.data.env_options || [])
    message.success('系统设置已保存')
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '系统设置保存失败'))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadSettings()
})
</script>

<template>
  <div class="page-wrap">
    <a-card class="toolbar-card" :bordered="false">
      <div class="toolbar">
        <div>
          <div class="page-title">系统设置</div>
          <div class="page-subtitle">配置发布单基础参数里的环境下拉选项。这里的值会直接用于新建发布单页面。</div>
        </div>
        <a-space>
          <a-button @click="loadSettings" :loading="loading">刷新</a-button>
          <a-button type="primary" :loading="saving" @click="saveSettings">保存</a-button>
        </a-space>
      </div>
    </a-card>

    <a-card title="发布环境" :loading="loading">
      <a-alert
        type="info"
        show-icon
        class="section-alert"
        message="发布单基础字段“环境”会从这里读取下拉选项"
        description="建议按实际环境维护，例如 dev、test、prod。修改后新建发布单页面会直接使用这里的配置。"
      />
      <a-form layout="vertical">
        <a-form-item label="环境选项">
          <a-select
            v-model:value="envOptions"
            mode="tags"
            :token-separators="[',', '，', ' ']"
            placeholder="输入环境并回车，例如 dev / test / prod"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
}

.page-subtitle {
  margin-top: 4px;
  color: var(--ant-color-text-description, #8c8c8c);
}

.section-alert {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
