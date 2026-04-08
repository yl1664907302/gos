<script setup lang="ts">
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { getReleaseSettings, updateReleaseSettings } from '../../api/system'
import { extractHTTPErrorMessage } from '../../utils/http-error'

const loading = ref(false)
const saving = ref(false)
const envOptions = ref<string[]>([])
const concurrency = reactive({
  enabled: false,
  lock_scope: 'application_env',
  conflict_strategy: 'reject',
  lock_timeout_sec: 1800,
})

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
    concurrency.enabled = Boolean(response.data.concurrency?.enabled)
    concurrency.lock_scope = response.data.concurrency?.lock_scope || 'application_env'
    concurrency.conflict_strategy = response.data.concurrency?.conflict_strategy || 'reject'
    concurrency.lock_timeout_sec = Number(response.data.concurrency?.lock_timeout_sec || 1800)
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
      concurrency: {
        enabled: concurrency.enabled,
        lock_scope: concurrency.lock_scope as 'application' | 'application_env' | 'gitops_repo_branch',
        conflict_strategy: concurrency.conflict_strategy as 'reject' | 'queue',
        lock_timeout_sec: Number(concurrency.lock_timeout_sec || 1800),
      },
    })
    envOptions.value = normalizeEnvOptions(response.data.env_options || [])
    concurrency.enabled = Boolean(response.data.concurrency?.enabled)
    concurrency.lock_scope = response.data.concurrency?.lock_scope || 'application_env'
    concurrency.conflict_strategy = response.data.concurrency?.conflict_strategy || 'reject'
    concurrency.lock_timeout_sec = Number(response.data.concurrency?.lock_timeout_sec || 1800)
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
        <div class="page-header-copy">
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

    <a-card title="并发发布配置" :loading="loading" style="margin-top: 16px">
      <a-alert
        type="info"
        show-icon
        class="section-alert"
        message="配置同一目标的并发发布行为"
        description="启用后，平台会在发布执行前按应用、应用环境或 GitOps 仓库分支加锁；冲突时可直接拒绝，或进入排队等待。"
      />
      <a-form layout="vertical">
        <a-form-item label="启用并发控制">
          <a-switch v-model:checked="concurrency.enabled" />
        </a-form-item>
        <a-form-item label="锁范围">
          <a-select v-model:value="concurrency.lock_scope">
            <a-select-option value="application">按应用</a-select-option>
            <a-select-option value="application_env">按应用 + 环境</a-select-option>
            <a-select-option value="gitops_repo_branch">按 GitOps 仓库分支</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="冲突策略">
          <a-select v-model:value="concurrency.conflict_strategy">
            <a-select-option value="reject">直接拒绝</a-select-option>
            <a-select-option value="queue">进入排队</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="锁超时（秒）">
          <a-input-number v-model:value="concurrency.lock_timeout_sec" :min="30" :max="86400" style="width: 100%" />
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
