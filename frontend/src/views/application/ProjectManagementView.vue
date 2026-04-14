<script setup lang="ts">
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { createProject, deleteProject, listProjects, updateProject } from '../../api/project'
import type { Project, ProjectPayload, ProjectStatus } from '../../types/project'
import { extractHTTPErrorMessage } from '../../utils/http-error'

interface ProjectFormState {
  name: string
  key: string
  description: string
  status: ProjectStatus
}

const loading = ref(false)
const saving = ref(false)
const modalOpen = ref(false)
const editingId = ref('')
const dataSource = ref<Project[]>([])
const total = ref(0)
const filters = reactive({ name: '', page: 1, page_size: 10 })
const form = reactive<ProjectFormState>({ name: '', key: '', description: '', status: 'active' })

const modalTitle = computed(() => (editingId.value ? '编辑项目' : '新增项目'))

async function loadProjects() {
  loading.value = true
  try {
    const response = await listProjects({ ...filters })
    dataSource.value = response.data
    total.value = response.total
    filters.page = response.page
    filters.page_size = response.page_size
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, '项目列表加载失败'))
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.name = ''
  form.key = ''
  form.description = ''
  form.status = 'active'
  editingId.value = ''
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(record: Project) {
  editingId.value = record.id
  form.name = record.name
  form.key = record.key
  form.description = record.description
  form.status = record.status
  modalOpen.value = true
}

async function submitForm() {
  if (!form.name.trim() || !form.key.trim()) {
    message.warning('请先填写项目名称和项目 Key')
    return
  }
  saving.value = true
  const payload: ProjectPayload = {
    name: form.name.trim(),
    key: form.key.trim(),
    description: form.description.trim(),
    status: form.status,
  }
  try {
    if (editingId.value) {
      await updateProject(editingId.value, payload)
      message.success('项目更新成功')
    } else {
      await createProject(payload)
      message.success('项目创建成功')
    }
    modalOpen.value = false
    resetForm()
    await loadProjects()
  } catch (error) {
    message.error(extractHTTPErrorMessage(error, editingId.value ? '项目更新失败' : '项目创建失败'))
  } finally {
    saving.value = false
  }
}

function confirmDelete(record: Project) {
  Modal.confirm({
    title: '确认删除项目吗？',
    content: h('div', `项目 ${record.name} 删除后将无法恢复，请确认当前没有新的应用继续归属到该项目。`),
    okText: '删除',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await deleteProject(record.id)
        message.success('项目删除成功')
        await loadProjects()
      } catch (error) {
        message.error(extractHTTPErrorMessage(error, '项目删除失败'))
        throw error
      }
    },
  })
}

function handleSearch() {
  filters.page = 1
  void loadProjects()
}

function handleReset() {
  filters.name = ''
  filters.page = 1
  void loadProjects()
}

function handlePageChange(page: number, pageSize: number) {
  filters.page = page
  filters.page_size = pageSize
  void loadProjects()
}

onMounted(() => {
  void loadProjects()
})
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header-card page-header">
      <div class="page-header-copy">
        <h2 class="page-title">项目管理</h2>
        <p class="page-subtitle">先建立项目，再让应用归属到项目，后续应用、模板和发布会更容易按业务域收拢</p>
      </div>
      <a-button type="primary" @click="openCreate">
        <template #icon><PlusOutlined /></template>
        新增项目
      </a-button>
    </div>

    <a-card class="filter-card" :bordered="true">
      <a-form layout="inline" class="filter-form">
        <a-form-item label="名称">
          <a-input v-model:value="filters.name" allow-clear placeholder="按项目名称查询" />
        </a-form-item>
        <a-form-item class="filter-actions">
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card class="table-card" :bordered="true">
      <a-table :data-source="dataSource" :loading="loading" :pagination="false" row-key="id">
        <a-table-column title="项目名称" data-index="name" key="name" />
        <a-table-column title="项目 Key" data-index="key" key="key" />
        <a-table-column title="状态" data-index="status" key="status" width="120" />
        <a-table-column title="描述" data-index="description" key="description" />
        <a-table-column title="操作" key="action" width="180">
          <template #default="{ record }">
            <a-space>
              <a-button type="link" @click="openEdit(record)">
                <template #icon><EditOutlined /></template>
                编辑
              </a-button>
              <a-button danger type="link" @click="confirmDelete(record)">
                <template #icon><DeleteOutlined /></template>
                删除
              </a-button>
            </a-space>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <div class="pagination-area">
      <a-pagination
        :current="filters.page"
        :page-size="filters.page_size"
        :total="total"
        :page-size-options="['10', '20', '50']"
        show-size-changer
        :show-total="(count: number) => `共 ${count} 个项目`"
        @change="handlePageChange"
        @showSizeChange="handlePageChange"
      />
    </div>

    <a-modal v-model:open="modalOpen" :title="modalTitle" :confirm-loading="saving" @ok="submitForm" @cancel="resetForm">
      <a-form layout="vertical">
        <a-form-item label="项目名称" required>
          <a-input v-model:value="form.name" placeholder="例如：南通业务线" />
        </a-form-item>
        <a-form-item label="项目 Key" required>
          <a-input v-model:value="form.key" placeholder="例如：nantong" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="form.status">
            <a-select-option value="active">active</a-select-option>
            <a-select-option value="inactive">inactive</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目描述">
          <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入项目描述" />
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

.pagination-area {
  display: flex;
  justify-content: flex-end;
}

.filter-form {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-actions {
  margin-left: auto;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-form {
    flex-wrap: wrap;
  }

  .filter-actions {
    margin-left: 0;
  }
}
</style>
