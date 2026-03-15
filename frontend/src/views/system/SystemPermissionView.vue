<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { listApplications } from '../../api/application'
import { listPlatformParamDicts } from '../../api/platform-param'
import {
  deleteUserParamPermission,
  grantUserPermissions,
  listPermissions,
  listUserParamPermissions,
  listUserPermissions,
  listUsers,
  revokeUserPermissions,
  upsertUserParamPermission,
} from '../../api/user'
import type { PermissionMeta, UserParamPermission, UserPermission } from '../../types/user'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface SelectOption {
  label: string
  value: string
}

interface ParamPermissionFormState {
  id: string
  param_key: string
  application_id: string
  can_view: boolean
  can_edit: boolean
}

interface ApplicationPermissionRow {
  application_id: string
  application_name: string
}

const usersLoading = ref(false)
const selectedUserID = ref('')
const userOptions = ref<SelectOption[]>([])

const permissionsLoading = ref(false)
const permissionMetas = ref<PermissionMeta[]>([])
const userPermissions = ref<UserPermission[]>([])
const checkedPermissionCodes = ref<string[]>([])
const savingPermissions = ref(false)

const paramPermissionLoading = ref(false)
const paramPermissionList = ref<UserParamPermission[]>([])
const paramPermissionDeletingID = ref('')
const paramPermissionModalVisible = ref(false)
const paramPermissionSubmitting = ref(false)
const paramPermissionFormRef = ref<FormInstance>()
const paramPermissionForm = reactive<ParamPermissionFormState>({
  id: '',
  param_key: '',
  application_id: '',
  can_view: true,
  can_edit: false,
})

const paramKeyOptions = ref<SelectOption[]>([])
const applicationOptions = ref<SelectOption[]>([])
const applicationPermissionMap = ref<Record<string, boolean>>({})
const applicationViewScopedCodes = new Set(['application.view'])
const applicationReleaseScopedCodes = new Set(['release.view', 'release.create', 'release.execute', 'release.cancel'])
const applicationScopedCodes = Array.from(new Set([...applicationViewScopedCodes, ...applicationReleaseScopedCodes]))
const hiddenPermissionCodes = new Set(['release.param_config.view', 'application.view', 'release.view'])

const permissionGroupOrder = ['application', 'pipeline', 'platform_param', 'pipeline_param', 'component', 'release', 'system']

const groupedPermissions = computed(() => {
  const groups = new Map<string, PermissionMeta[]>()
  for (const item of permissionMetas.value) {
    if (hiddenPermissionCodes.has(String(item.code || '').trim().toLowerCase())) {
      continue
    }
    if (applicationReleaseScopedCodes.has(String(item.code || '').trim().toLowerCase())) {
      continue
    }
    if (!groups.has(item.module)) {
      groups.set(item.module, [])
    }
    groups.get(item.module)?.push(item)
  }
  const modules = Array.from(groups.keys()).sort((a, b) => {
    const ai = permissionGroupOrder.indexOf(a)
    const bi = permissionGroupOrder.indexOf(b)
    if (ai === -1 && bi === -1) {
      return a.localeCompare(b)
    }
    if (ai === -1) {
      return 1
    }
    if (bi === -1) {
      return -1
    }
    return ai - bi
  })
  return modules.map((module) => ({
    module,
    items: (groups.get(module) || []).slice().sort((a, b) => a.code.localeCompare(b.code)),
  }))
})

const paramPermissionColumns: TableColumnsType<UserParamPermission> = [
  { title: '平台标准 Key', dataIndex: 'param_key', key: 'param_key', width: 220 },
  { title: '应用范围', dataIndex: 'application_id', key: 'application_id', width: 220 },
  { title: '可见', dataIndex: 'can_view', key: 'can_view', width: 100 },
  { title: '可编辑', dataIndex: 'can_edit', key: 'can_edit', width: 100 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' },
]

const applicationPermissionColumns: TableColumnsType<ApplicationPermissionRow> = [
  { title: '应用', dataIndex: 'application_name', key: 'application_name', width: 360 },
  { title: '允许展示与发布', key: 'enabled', width: 180 },
]

const paramPermissionRules = {
  param_key: [{ required: true, message: '请选择平台标准 Key', trigger: 'change' }],
}

const applicationPermissionRows = computed<ApplicationPermissionRow[]>(() =>
  applicationOptions.value.map((item) => ({
    application_id: item.value,
    application_name: item.label,
  })),
)

function isPermissionChecked(code: string) {
  return checkedPermissionCodes.value.includes(code)
}

function normalizeScopeType(value: string) {
  return String(value || '').trim().toLowerCase()
}

function handlePermissionToggle(code: string, checked: boolean) {
  const next = new Set(checkedPermissionCodes.value)
  if (checked) {
    next.add(code)
  } else {
    next.delete(code)
  }
  checkedPermissionCodes.value = Array.from(next)
}

function moduleLabel(module: string) {
  const mapping: Record<string, string> = {
    application: '应用管理',
    pipeline: '管线管理',
    platform_param: '标准字库',
    pipeline_param: '管线参数',
    component: '组件管理',
    release: '发布管理',
    system: '系统管理',
  }
  return mapping[module] || module
}

function syncApplicationPermissionMap() {
  const nextMap: Record<string, boolean> = {}
  const grantedScopeValues = new Set(
    userPermissions.value
      .filter(
        (item) =>
          item.enabled &&
          applicationScopedCodes.includes(String(item.permission_code || '').trim().toLowerCase()) &&
          normalizeScopeType(item.scope_type) === 'application' &&
          String(item.scope_value || '').trim() !== '',
      )
      .map((item) => String(item.scope_value || '').trim()),
  )

  for (const item of applicationOptions.value) {
    nextMap[item.value] = grantedScopeValues.has(item.value)
  }
  applicationPermissionMap.value = nextMap
}

function isApplicationReleaseEnabled(applicationID: string) {
  return Boolean(applicationPermissionMap.value[String(applicationID || '').trim()])
}

function handleApplicationReleaseToggle(applicationID: string, enabled: boolean) {
  const id = String(applicationID || '').trim()
  if (!id) {
    return
  }
  applicationPermissionMap.value = {
    ...applicationPermissionMap.value,
    [id]: Boolean(enabled),
  }
}

function resetParamPermissionForm() {
  paramPermissionForm.id = ''
  paramPermissionForm.param_key = ''
  paramPermissionForm.application_id = ''
  paramPermissionForm.can_view = true
  paramPermissionForm.can_edit = false
}

async function loadUsers() {
  usersLoading.value = true
  try {
    const response = await listUsers({
      page: 1,
      page_size: 200,
    })
    userOptions.value = response.data.map((item) => ({
      label: `${item.display_name} (${item.username})`,
      value: item.id,
    }))
    if (!selectedUserID.value && userOptions.value.length > 0) {
      const first = userOptions.value[0]
      if (first) {
        selectedUserID.value = first.value
      }
    }
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '用户下拉加载失败'))
  } finally {
    usersLoading.value = false
  }
}

async function loadPermissionMeta() {
  permissionsLoading.value = true
  try {
    const response = await listPermissions()
    permissionMetas.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '权限字典加载失败'))
  } finally {
    permissionsLoading.value = false
  }
}

async function loadParamKeyOptions() {
  try {
    const response = await listPlatformParamDicts({ page: 1, page_size: 200 })
    paramKeyOptions.value = response.data.map((item) => ({
      label: `${item.param_key} - ${item.name}`,
      value: item.param_key,
    }))
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '标准字库下拉加载失败'))
  }
}

async function loadApplicationOptions() {
  try {
    const response = await listApplications({ page: 1, page_size: 200 })
    applicationOptions.value = response.data.map((item) => ({
      label: `${item.name} (${item.key})`,
      value: item.id,
    }))
    syncApplicationPermissionMap()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '应用下拉加载失败'))
  }
}

async function loadUserPermissions() {
  if (!selectedUserID.value) {
    userPermissions.value = []
    checkedPermissionCodes.value = []
    applicationPermissionMap.value = {}
    return
  }
  permissionsLoading.value = true
  try {
    const response = await listUserPermissions(selectedUserID.value)
    userPermissions.value = response.data
    checkedPermissionCodes.value = response.data
      .filter((item) => item.enabled && normalizeScopeType(item.scope_type) === 'global')
      .map((item) => item.permission_code)
    syncApplicationPermissionMap()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '用户权限加载失败'))
  } finally {
    permissionsLoading.value = false
  }
}

async function loadUserParamPermissions() {
  if (!selectedUserID.value) {
    paramPermissionList.value = []
    return
  }
  paramPermissionLoading.value = true
  try {
    const response = await listUserParamPermissions(selectedUserID.value)
    paramPermissionList.value = response.data
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '参数权限加载失败'))
  } finally {
    paramPermissionLoading.value = false
  }
}

async function loadSelectedUserAuthorization() {
  await Promise.all([loadUserPermissions(), loadUserParamPermissions()])
}

async function handleUserChange(value: string | undefined) {
  selectedUserID.value = String(value || '').trim()
  await loadSelectedUserAuthorization()
}

async function handleSavePermissions() {
  if (!selectedUserID.value) {
    message.warning('请先选择用户')
    return
  }
  savingPermissions.value = true
  try {
    const current = new Set(
      checkedPermissionCodes.value.filter(
        (code) => !applicationReleaseScopedCodes.has(String(code || '').trim().toLowerCase()),
      ),
    )
    const before = new Set(
      userPermissions.value
        .filter(
          (item) =>
            item.enabled &&
            normalizeScopeType(item.scope_type) === 'global' &&
            !applicationReleaseScopedCodes.has(String(item.permission_code || '').trim().toLowerCase()),
        )
        .map((item) => item.permission_code),
    )

    const toGrant = Array.from(current).filter((code) => !before.has(code))
    const toRevoke = Array.from(before).filter((code) => !current.has(code))
    const legacyGlobalReleasePermissions = userPermissions.value
      .filter(
        (item) =>
          item.enabled &&
          normalizeScopeType(item.scope_type) === 'global' &&
          (
            applicationScopedCodes.includes(String(item.permission_code || '').trim().toLowerCase())
          ),
      )
      .map((item) => ({
        permission_code: item.permission_code,
        scope_type: 'global',
        scope_value: '',
      }))

    if (toGrant.length > 0) {
      await grantUserPermissions(selectedUserID.value, {
        items: toGrant.map((code) => ({
          permission_code: code,
          scope_type: 'global',
          scope_value: '',
        })),
      })
    }
    if (toRevoke.length > 0) {
      await revokeUserPermissions(selectedUserID.value, {
        items: toRevoke.map((code) => ({
          permission_code: code,
          scope_type: 'global',
          scope_value: '',
        })),
      })
    }
    const appCurrent = new Set(
      Object.entries(applicationPermissionMap.value)
        .filter(([, enabled]) => Boolean(enabled))
        .map(([applicationID]) => String(applicationID || '').trim())
        .filter(Boolean),
    )

    const beforeItems = userPermissions.value
      .filter(
        (item) =>
          item.enabled &&
          applicationScopedCodes.includes(String(item.permission_code || '').trim().toLowerCase()) &&
          normalizeScopeType(item.scope_type) === 'application' &&
          String(item.scope_value || '').trim() !== '',
      )
      .map((item) => ({
        permission_code: String(item.permission_code || '').trim().toLowerCase(),
        scope_type: 'application',
        scope_value: String(item.scope_value || '').trim(),
      }))

    const beforeKeySet = new Set(
      beforeItems.map((item) => `${item.permission_code}::${item.scope_type}::${item.scope_value}`),
    )
    const currentItems = Array.from(appCurrent).flatMap((applicationID) =>
      applicationScopedCodes.map((code) => ({
        permission_code: code,
        scope_type: 'application',
        scope_value: applicationID,
      })),
    )
    const currentKeySet = new Set(
      currentItems.map((item) => `${item.permission_code}::${item.scope_type}::${item.scope_value}`),
    )

    const appToGrant = currentItems.filter(
      (item) => !beforeKeySet.has(`${item.permission_code}::${item.scope_type}::${item.scope_value}`),
    )
    const appToRevoke = beforeItems.filter(
      (item) => !currentKeySet.has(`${item.permission_code}::${item.scope_type}::${item.scope_value}`),
    )

    if (appToGrant.length > 0) {
      await grantUserPermissions(selectedUserID.value, {
        items: appToGrant,
      })
    }
    if (appToRevoke.length > 0) {
      await revokeUserPermissions(selectedUserID.value, {
        items: appToRevoke,
      })
    }
    if (legacyGlobalReleasePermissions.length > 0) {
      await revokeUserPermissions(selectedUserID.value, {
        items: legacyGlobalReleasePermissions,
      })
    }

    message.success('权限授权已保存')
    await loadUserPermissions()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '权限保存失败'))
  } finally {
    savingPermissions.value = false
  }
}

function openCreateParamPermissionModal() {
  resetParamPermissionForm()
  paramPermissionModalVisible.value = true
}

function openEditParamPermissionModal(item: UserParamPermission) {
  paramPermissionForm.id = item.id
  paramPermissionForm.param_key = item.param_key
  paramPermissionForm.application_id = item.application_id || ''
  paramPermissionForm.can_view = Boolean(item.can_view)
  paramPermissionForm.can_edit = Boolean(item.can_edit)
  paramPermissionModalVisible.value = true
}

function closeParamPermissionModal() {
  paramPermissionModalVisible.value = false
  resetParamPermissionForm()
  void paramPermissionFormRef.value?.clearValidate()
}

function handleCanEditChange(value: boolean) {
  if (value) {
    paramPermissionForm.can_view = true
  }
}

async function submitParamPermission() {
  if (!selectedUserID.value) {
    message.warning('请先选择用户')
    return
  }
  try {
    await paramPermissionFormRef.value?.validate()
  } catch {
    return
  }

  if (paramPermissionForm.can_edit) {
    paramPermissionForm.can_view = true
  }

  paramPermissionSubmitting.value = true
  try {
    await upsertUserParamPermission(
      selectedUserID.value,
      {
        param_key: paramPermissionForm.param_key,
        application_id: paramPermissionForm.application_id || undefined,
        can_view: Boolean(paramPermissionForm.can_view),
        can_edit: Boolean(paramPermissionForm.can_edit),
      },
      paramPermissionForm.id || undefined,
    )
    message.success('参数权限保存成功')
    closeParamPermissionModal()
    await loadUserParamPermissions()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '参数权限保存失败'))
  } finally {
    paramPermissionSubmitting.value = false
  }
}

async function handleDeleteParamPermission(id: string) {
  if (!selectedUserID.value) {
    return
  }
  paramPermissionDeletingID.value = id
  try {
    await deleteUserParamPermission(selectedUserID.value, id)
    message.success('参数权限删除成功')
    await loadUserParamPermissions()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '参数权限删除失败'))
  } finally {
    paramPermissionDeletingID.value = ''
  }
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadPermissionMeta(), loadParamKeyOptions(), loadApplicationOptions()])
  await loadSelectedUserAuthorization()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div>
        <h2 class="page-title">权限授权</h2>
        <p class="page-subtitle">按用户授权模块权限、应用权限，并维护发布参数字段级权限。</p>
      </div>
      <a-space>
        <a-select
          v-model:value="selectedUserID"
          class="user-select"
          show-search
          allow-clear
          option-filter-prop="label"
          :loading="usersLoading"
          :options="userOptions"
          placeholder="请选择用户"
          @change="handleUserChange"
        />
        <a-button type="primary" :loading="savingPermissions" @click="handleSavePermissions">
          <template #icon>
            <SaveOutlined />
          </template>
          保存权限设置
        </a-button>
      </a-space>
    </div>

    <a-card class="permission-card" :bordered="true" :loading="permissionsLoading">
      <a-empty v-if="!selectedUserID" description="请先选择用户" />
      <div v-else class="permission-groups">
        <div v-for="group in groupedPermissions" :key="group.module" class="group-card">
          <div class="group-title">{{ moduleLabel(group.module) }}</div>
          <a-row :gutter="[12, 12]">
            <a-col v-for="item in group.items" :key="item.code" :xs="24" :md="12">
              <a-checkbox
                :checked="isPermissionChecked(item.code)"
                @change="handlePermissionToggle(item.code, Boolean($event?.target?.checked))"
              >
                {{ item.name }}
                <span class="permission-code">({{ item.code }})</span>
              </a-checkbox>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>

    <a-card class="app-release-permission-card" :bordered="true">
      <template #title>应用权限</template>

      <a-empty v-if="!selectedUserID" description="请先选择用户" />
      <a-table
        v-else
        row-key="application_id"
        :columns="applicationPermissionColumns"
        :data-source="applicationPermissionRows"
        :pagination="false"
        :scroll="{ x: 620 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'enabled'">
            <a-switch
              :checked="isApplicationReleaseEnabled(record.application_id)"
              @change="handleApplicationReleaseToggle(record.application_id, Boolean($event))"
            />
          </template>
        </template>
      </a-table>
      <p class="save-tip">提示：本区域修改后，点击页面顶部“保存权限设置”统一生效。</p>
    </a-card>

    <a-card class="param-permission-card" :bordered="true">
      <template #title>发布参数权限</template>
      <template #extra>
        <a-button type="primary" @click="openCreateParamPermissionModal">
          <template #icon>
            <PlusOutlined />
          </template>
          新增参数权限
        </a-button>
      </template>

      <a-table
        row-key="id"
        :columns="paramPermissionColumns"
        :data-source="paramPermissionList"
        :loading="paramPermissionLoading"
        :pagination="false"
        :scroll="{ x: 940 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'application_id'">
            {{ record.application_id || '全应用' }}
          </template>
          <template v-else-if="column.key === 'can_view'">
            <a-tag :color="record.can_view ? 'blue' : 'default'">{{ record.can_view ? '是' : '否' }}</a-tag>
          </template>
          <template v-else-if="column.key === 'can_edit'">
            <a-tag :color="record.can_edit ? 'green' : 'default'">{{ record.can_edit ? '是' : '否' }}</a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openEditParamPermissionModal(record)">编辑</a-button>
              <a-popconfirm title="确认删除该参数权限吗？" ok-text="删除" cancel-text="取消" @confirm="handleDeleteParamPermission(record.id)">
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button type="link" size="small" danger :loading="paramPermissionDeletingID === record.id">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      :open="paramPermissionModalVisible"
      :title="paramPermissionForm.id ? '编辑参数权限' : '新增参数权限'"
      width="560px"
      destroy-on-close
      :confirm-loading="paramPermissionSubmitting"
      @ok="submitParamPermission"
      @cancel="closeParamPermissionModal"
    >
      <a-form
        ref="paramPermissionFormRef"
        layout="vertical"
        :model="paramPermissionForm"
        :rules="paramPermissionRules"
      >
        <a-form-item label="平台标准 Key" name="param_key">
          <a-select
            v-model:value="paramPermissionForm.param_key"
            show-search
            option-filter-prop="label"
            :options="paramKeyOptions"
            placeholder="请选择平台标准 Key"
          />
        </a-form-item>
        <a-form-item label="应用范围（可选）" name="application_id">
          <a-select
            v-model:value="paramPermissionForm.application_id"
            allow-clear
            show-search
            option-filter-prop="label"
            :options="applicationOptions"
            placeholder="留空表示全应用生效"
          />
        </a-form-item>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="可见" name="can_view">
              <a-switch v-model:checked="paramPermissionForm.can_view" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="可编辑" name="can_edit">
              <a-switch v-model:checked="paramPermissionForm.can_edit" @change="handleCanEditChange" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.user-select {
  width: 320px;
}

.permission-card,
.app-release-permission-card,
.param-permission-card {
  border-radius: var(--radius-xl);
}

.permission-groups {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.group-card {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 14px 16px;
}

.group-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
}

.permission-checkbox-group {
  width: 100%;
}

.permission-code {
  color: #8c8c8c;
}

.save-tip {
  margin: 12px 0 0;
  color: #8c8c8c;
  font-size: 12px;
}

.danger-icon {
  color: #ff4d4f;
}

@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-select {
    width: 100%;
  }
}
</style>
