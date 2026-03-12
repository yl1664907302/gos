<script setup lang="ts">
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { reactive, ref, watch } from 'vue'
import type { ApplicationPayload } from '../../types/application'

interface ApplicationFormModel {
  name: string
  key: string
  repo_url: string
  description: string
  owner: string
  status: ApplicationPayload['status']
  artifact_type: string
  language: string
}

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<ApplicationPayload>
    loading?: boolean
    submitText?: string
  }>(),
  {
    initialValues: () => ({}),
    loading: false,
    submitText: '保存',
  },
)

const emit = defineEmits<{
  (e: 'submit', payload: ApplicationPayload): void
  (e: 'cancel'): void
}>()

const formRef = ref<FormInstance>()

const artifactTypeOptions = [
  { label: 'docker-image', value: 'docker-image' },
  { label: 'binary', value: 'binary' },
  { label: 'jar', value: 'jar' },
]

const languageOptions = [
  { label: 'golang', value: 'golang' },
  { label: 'java', value: 'java' },
  { label: 'nodejs', value: 'nodejs' },
  { label: 'python', value: 'python' },
]

const model = reactive<ApplicationFormModel>({
  name: '',
  key: '',
  repo_url: '',
  description: '',
  owner: '',
  status: 'active',
  artifact_type: '',
  language: '',
})

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入应用 Key', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  artifact_type: [{ required: true, message: '请选择制品类型', trigger: 'change' }],
  language: [{ required: true, message: '请选择语言', trigger: 'change' }],
}

watch(
  () => props.initialValues,
  (values) => {
    model.name = values.name ?? ''
    model.key = values.key ?? ''
    model.repo_url = values.repo_url ?? ''
    model.description = values.description ?? ''
    model.owner = values.owner ?? ''
    model.status = values.status ?? 'active'
    model.artifact_type = values.artifact_type ?? ''
    model.language = values.language ?? ''
  },
  { immediate: true, deep: true },
)

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    emit('submit', { ...model })
  } catch {
    // 校验失败由表单项自身提示，这里不再额外处理。
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <a-form
    ref="formRef"
    layout="vertical"
    :model="model"
    :rules="rules"
    class="application-form"
    autocomplete="off"
  >
    <a-row :gutter="16">
      <a-col :xs="24" :md="12">
        <a-form-item label="应用名称" name="name">
          <a-input v-model:value="model.name" placeholder="例如：支付中心" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="应用 Key" name="key">
          <a-input v-model:value="model.key" placeholder="例如：pay-center" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :xs="24" :md="12">
        <a-form-item label="负责人" name="owner">
          <a-input v-model:value="model.owner" placeholder="例如：lingyun" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="状态" name="status">
          <a-select v-model:value="model.status" placeholder="请选择状态">
            <a-select-option value="active">active</a-select-option>
            <a-select-option value="inactive">inactive</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :xs="24" :md="12">
        <a-form-item label="制品类型" name="artifact_type">
          <a-select
            v-model:value="model.artifact_type"
            placeholder="请选择制品类型"
            :options="artifactTypeOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="语言" name="language">
          <a-select v-model:value="model.language" placeholder="请选择语言" :options="languageOptions" />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item label="代码仓库地址" name="repo_url">
      <a-input v-model:value="model.repo_url" placeholder="例如：https://github.com/org/repo" />
    </a-form-item>

    <a-form-item label="应用描述" name="description">
      <a-textarea v-model:value="model.description" :rows="4" placeholder="请输入应用描述" />
    </a-form-item>

    <a-space class="action-area">
      <a-button type="primary" :loading="loading" @click="handleSubmit">{{ submitText }}</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </a-space>
  </a-form>
</template>

<style scoped>
.application-form {
  background: #fff;
  border: 1px solid var(--border-color);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
}

.action-area {
  width: 100%;
  justify-content: flex-end;
}

@media (max-width: 1024px) {
  .application-form {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .application-form {
    padding: 16px;
  }
}
</style>
