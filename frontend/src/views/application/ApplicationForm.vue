<script setup lang="ts">
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import { reactive, ref, watch } from 'vue'
import type { ApplicationPayload, GitOpsBranchMapping, ReleaseBranchOption } from '../../types/application'

interface OwnerOption {
  label: string
  value: string
}

interface ProjectOption {
  label: string
  value: string
}

interface ApplicationFormModel {
  name: string
  key: string
  project_id: string
  repo_url: string
  description: string
  owner_user_id: string
  status: ApplicationPayload['status']
  artifact_type: string
  language: string
  gitops_branch_mappings: GitOpsBranchMapping[]
  release_branches: ReleaseBranchOption[]
}

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<ApplicationPayload>
    ownerOptions?: OwnerOption[]
    projectOptions?: ProjectOption[]
    ownerLoading?: boolean
    projectLoading?: boolean
    loading?: boolean
    submitText?: string
  }>(),
  {
    initialValues: () => ({}),
    ownerOptions: () => [],
    projectOptions: () => [],
    ownerLoading: false,
    projectLoading: false,
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
  project_id: '',
  repo_url: '',
  description: '',
  owner_user_id: '',
  status: 'active',
  artifact_type: '',
  language: '',
  gitops_branch_mappings: [],
  release_branches: [],
})

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入应用 Key', trigger: 'blur' }],
  project_id: [{ required: true, message: '请选择归属项目', trigger: 'change' }],
  owner_user_id: [{ required: true, message: '请选择负责人', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  artifact_type: [{ required: true, message: '请选择制品类型', trigger: 'change' }],
  language: [{ required: true, message: '请选择语言', trigger: 'change' }],
}

watch(
  () => props.initialValues,
  (values) => {
    model.name = values.name ?? ''
    model.key = values.key ?? ''
    model.project_id = values.project_id ?? ''
    model.repo_url = values.repo_url ?? ''
    model.description = values.description ?? ''
    model.owner_user_id = values.owner_user_id ?? ''
    model.status = values.status ?? 'active'
    model.artifact_type = values.artifact_type ?? ''
    model.language = values.language ?? ''
    model.gitops_branch_mappings = Array.isArray(values.gitops_branch_mappings)
      ? values.gitops_branch_mappings.map((item) => ({
          env_code: item.env_code ?? '',
          branch: item.branch ?? '',
        }))
      : []
    model.release_branches = Array.isArray(values.release_branches)
      ? values.release_branches.map((item) => ({
          name: item.name ?? '',
          branch: item.branch ?? '',
        }))
      : []
  },
  { immediate: true, deep: true },
)

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    emit('submit', { ...model })
  } catch {
    // 校验失败由表单项自身提示。
  }
}

function handleCancel() {
  emit('cancel')
}

function addGitOpsBranchMapping() {
  model.gitops_branch_mappings.push({
    env_code: '',
    branch: '',
  })
}

function removeGitOpsBranchMapping(index: number) {
  model.gitops_branch_mappings.splice(index, 1)
}

function addReleaseBranch() {
  model.release_branches.push({
    name: '',
    branch: '',
  })
}

function removeReleaseBranch(index: number) {
  model.release_branches.splice(index, 1)
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
        <a-form-item label="归属项目" name="project_id">
          <a-select
            v-model:value="model.project_id"
            show-search
            allow-clear
            option-filter-prop="label"
            :options="projectOptions"
            :loading="projectLoading"
            placeholder="请选择归属项目"
          />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="负责人" name="owner_user_id">
          <a-select
            v-model:value="model.owner_user_id"
            show-search
            allow-clear
            option-filter-prop="label"
            :options="ownerOptions"
            :loading="ownerLoading"
            placeholder="请选择负责人"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-row :gutter="16">
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

    <a-form-item label="发布分支">
      <div class="mapping-panel">
        <div class="mapping-header">
          <div class="mapping-copy">
            <div class="mapping-title">维护应用可选发布分支</div>
            <div class="mapping-help">
              这里维护的分支会作为发布基础字段中的下拉选项，可直接映射给发布模板中的 CI / CD 管线字段。
            </div>
          </div>
          <a-button type="dashed" @click="addReleaseBranch">
            <template #icon>
              <PlusOutlined />
            </template>
            新增分支
          </a-button>
        </div>
        <div v-if="!model.release_branches.length" class="mapping-empty">
          当前未配置发布分支，发布时将无法从发布基础字段里直接下拉选择分支。
        </div>
        <div v-else class="mapping-list">
          <div v-for="(item, index) in model.release_branches" :key="`release-branch-${index}`" class="mapping-row">
            <a-input v-model:value="item.name" placeholder="显示名称，例如：开发分支" />
            <a-input v-model:value="item.branch" placeholder="分支，例如：release/dev" />
            <a-button danger type="text" @click="removeReleaseBranch(index)">
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </div>
        </div>
      </div>
    </a-form-item>

    <a-form-item label="GitOps 分支环境映射">
      <div class="mapping-panel">
        <div class="mapping-header">
          <div class="mapping-copy">
            <div class="mapping-title">按应用配置 GitOps 分支映射</div>
            <div class="mapping-help">
              未配置映射时，平台默认使用 <code>app_key-env</code>，例如
              <code>java-nantong-test-prod</code>
            </div>
          </div>
          <a-button type="dashed" @click="addGitOpsBranchMapping">
            <template #icon>
              <PlusOutlined />
            </template>
            新增映射
          </a-button>
        </div>
        <div v-if="!model.gitops_branch_mappings.length" class="mapping-empty">
          当前未配置映射，将按默认规则使用 `app_key-env` 分支。
        </div>
        <div v-else class="mapping-list">
          <div v-for="(item, index) in model.gitops_branch_mappings" :key="index" class="mapping-row">
            <a-input v-model:value="item.env_code" placeholder="环境，例如：prod" />
            <a-input v-model:value="item.branch" placeholder="分支，例如：java-nantong-test-prod" />
            <a-button danger type="text" @click="removeGitOpsBranchMapping(index)">
              <template #icon>
                <DeleteOutlined />
              </template>
            </a-button>
          </div>
        </div>
      </div>
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

.mapping-help code,
.mapping-empty code {
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: #22304d;
  font-size: 12px;
}

.mapping-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: #fafbfc;
}

.mapping-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.mapping-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mapping-title {
  font-weight: 600;
  color: var(--heading-color);
}

.mapping-help,
.mapping-empty {
  color: var(--text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.mapping-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mapping-row {
  display: grid;
  grid-template-columns: minmax(0, 180px) minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
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

  .mapping-header {
    flex-direction: column;
  }

  .mapping-row {
    grid-template-columns: 1fr;
  }
}
</style>
