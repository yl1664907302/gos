<script setup lang="ts">
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, TableColumnsType } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  createUser,
  deleteUser,
  listUsers,
  type UserListParams,
  updateUser,
  type UserPayload,
} from '../../api/user'
import { useResizableColumns } from '../../composables/useResizableColumns'
import type { UserProfile, UserRole, UserStatus } from '../../types/user'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface UserFormState {
  username: string
  display_name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  password: string
}

const loading = ref(false)
const submitting = ref(false)
const deletingID = ref('')
const userList = ref<UserProfile[]>([])
const total = ref(0)

const filters = reactive({
  username: '',
  name: '',
  role: '' as UserRole | '',
  status: '' as UserStatus | '',
  page: 1,
  pageSize: 20,
})

const formRef = ref<FormInstance>()
const modalVisible = ref(false)
const editingID = ref('')
const formState = reactive<UserFormState>({
  username: '',
  display_name: '',
  email: '',
  phone: '',
  role: 'normal',
  status: 'active',
  password: '',
})

const isEdit = computed(() => Boolean(editingID.value))

const initialColumns: TableColumnsType<UserProfile> = [
  { title: '用户名', dataIndex: 'username', key: 'username', width: 180 },
  { title: '姓名', dataIndex: 'display_name', key: 'display_name', width: 180 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 220, ellipsis: true },
  { title: '电话', dataIndex: 'phone', key: 'phone', width: 140 },
  { title: '操作', key: 'actions', width: 220, fixed: 'right' },
]
const { columns } = useResizableColumns(initialColumns, { minWidth: 100, maxWidth: 520, hitArea: 10 })

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  display_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  password: [
    {
      validator: async (_rule: Rule, value: string) => {
        const text = String(value || '').trim()
        if (!isEdit.value && !text) {
          return Promise.reject(new Error('新增用户必须设置密码'))
        }
        if (text && text.length < 6) {
          return Promise.reject(new Error('密码长度不能少于 6 位'))
        }
        return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
}

function resetFormState() {
  editingID.value = ''
  formState.username = ''
  formState.display_name = ''
  formState.email = ''
  formState.phone = ''
  formState.role = 'normal'
  formState.status = 'active'
  formState.password = ''
}

function fillFormState(item: UserProfile) {
  editingID.value = item.id
  formState.username = item.username
  formState.display_name = item.display_name
  formState.email = item.email || ''
  formState.phone = item.phone || ''
  formState.role = item.role
  formState.status = item.status
  formState.password = ''
}

function toUserPayload(): UserPayload {
  const payload: UserPayload = {
    display_name: formState.display_name.trim(),
    role: formState.role,
    status: formState.status,
    email: formState.email.trim() || undefined,
    phone: formState.phone.trim() || undefined,
  }
  if (formState.password.trim()) {
    payload.password = formState.password.trim()
  }
  if (!isEdit.value) {
    payload.username = formState.username.trim()
  }
  return payload
}

async function loadUsers() {
  loading.value = true
  try {
    const params: UserListParams = {
      username: filters.username.trim() || undefined,
      name: filters.name.trim() || undefined,
      role: filters.role || undefined,
      status: filters.status || undefined,
      page: filters.page,
      page_size: filters.pageSize,
    }
    const response = await listUsers(params)
    userList.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.pageSize = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '用户列表加载失败'))
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  filters.page = 1
  void loadUsers()
}

function handleReset() {
  filters.username = ''
  filters.name = ''
  filters.role = ''
  filters.status = ''
  filters.page = 1
  filters.pageSize = 20
  void loadUsers()
}


function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.pageSize = pageSize
  void loadUsers()
}

function openCreateModal() {
  resetFormState()
  modalVisible.value = true
}

function openEditModal(item: UserProfile) {
  fillFormState(item)
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  resetFormState()
  void formRef.value?.clearValidate()
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const payload = toUserPayload()
    if (isEdit.value) {
      await updateUser(editingID.value, payload)
      message.success('用户更新成功')
    } else {
      await createUser(payload)
      message.success('用户创建成功')
    }
    closeModal()
    await loadUsers()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '用户保存失败'))
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id: string) {
  deletingID.value = id
  try {
    await deleteUser(id)
    message.success('用户删除成功')
    if (userList.value.length === 1 && filters.page > 1) {
      filters.page -= 1
    }
    await loadUsers()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '用户删除失败'))
  } finally {
    deletingID.value = ''
  }
}

onMounted(() => {
  void loadUsers()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-copy">
        <h2 class="page-title">用户管理</h2>
        <p class="page-subtitle">管理平台用户，支持账号创建、编辑与状态控制。</p>
      </div>
      <a-button type="primary" @click="openCreateModal">
        <template #icon>
          <PlusOutlined />
        </template>
        新增用户
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <div class="advanced-search-panel">
        <a-form layout="inline" class="filter-form">
          <a-form-item label="用户名">
            <a-input v-model:value="filters.username" allow-clear placeholder="按用户名查询" />
          </a-form-item>
          <a-form-item label="姓名">
            <a-input v-model:value="filters.name" allow-clear placeholder="按姓名查询" />
          </a-form-item>
          <a-form-item label="角色">
            <a-select
              v-model:value="filters.role"
              allow-clear
              placeholder="全部"
              :options="[
                { label: '管理员', value: 'admin' },
                { label: '普通用户', value: 'normal' },
              ]"
              class="filter-select"
            />
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="filters.status"
              allow-clear
              placeholder="全部"
              :options="[
                { label: 'active', value: 'active' },
                { label: 'inactive', value: 'inactive' },
              ]"
              class="filter-select"
            />
          </a-form-item>
          <a-form-item class="filter-form-actions">
            <a-space>
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-card>

    <a-card class="table-card" :bordered="true">
      <a-table
        row-key="id"
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        :pagination="false"
        :scroll="{ x: 1180 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="record.role === 'admin' ? 'blue' : 'default'">
              {{ record.role === 'admin' ? '管理员' : '普通用户' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'default'">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="openEditModal(record)">编辑</a-button>
              <a-popconfirm title="确认删除该用户吗？" ok-text="删除" cancel-text="取消" @confirm="handleDelete(record.id)">
                <template #icon>
                  <ExclamationCircleOutlined class="danger-icon" />
                </template>
                <a-button type="link" size="small" danger :loading="deletingID === record.id">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <div class="pagination-area">
        <a-pagination
          :current="filters.page"
          :page-size="filters.pageSize"
          :total="total"
          :page-size-options="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          :show-total="(count: number) => `共 ${count} 条`"
          @change="handlePageChange"
        />
      </div>
    </a-card>

    <a-modal
      :open="modalVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="560px"
      destroy-on-close
      :confirm-loading="submitting"
      @ok="handleSubmit"
      @cancel="closeModal"
    >
      <a-form ref="formRef" layout="vertical" :model="formState" :rules="rules">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="formState.username" :disabled="isEdit" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="姓名" name="display_name">
          <a-input v-model:value="formState.display_name" placeholder="请输入姓名" />
        </a-form-item>
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="角色" name="role">
              <a-select
                v-model:value="formState.role"
                :options="[
                  { label: '管理员', value: 'admin' },
                  { label: '普通用户', value: 'normal' },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态" name="status">
              <a-select
                v-model:value="formState.status"
                :options="[
                  { label: 'active', value: 'active' },
                  { label: 'inactive', value: 'inactive' },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" placeholder="可选" />
        </a-form-item>
        <a-form-item label="电话" name="phone">
          <a-input v-model:value="formState.phone" placeholder="可选" />
        </a-form-item>
        <a-form-item :label="isEdit ? '重置密码（可选）' : '密码'" name="password">
          <a-input-password
            v-model:value="formState.password"
            :placeholder="isEdit ? '留空表示不修改密码' : '请输入密码（至少 6 位）'"
          />
        </a-form-item>
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

.filter-card,
.table-card {
  border-radius: var(--radius-xl);
}

.filter-form {
  display: flex;
  gap: 8px;
}

.filter-select {
  width: 140px;
}

.pagination-area {
  margin-top: var(--space-6);
  display: flex;
  justify-content: flex-end;
}

.danger-icon {
  color: #ff4d4f;
}

@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-form {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .filter-form {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .pagination-area {
    justify-content: center;
  }
}
</style>
