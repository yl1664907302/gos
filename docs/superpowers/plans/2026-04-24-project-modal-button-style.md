# Project Modal Button Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将项目管理页的新增/编辑项目弹窗改造成按钮弹窗风格，去掉默认 footer，并让编辑态补齐说明块与当前配置上下文块。

**Architecture:** 在 `ProjectManagementView.vue` 内直接平移管线绑定页的按钮弹窗壳层与遮蔽逻辑，保持项目页现有数据流不变。编辑态把 `project key` 收进只读上下文块，只保留允许修改的字段在表单区展示。

**Tech Stack:** Vue 3, Ant Design Vue, node:test, Vite

---

### Task 1: 锁定项目弹窗布局约束

**Files:**
- Modify: `frontend/tests/project-management-layout.test.mjs`
- Test: `frontend/tests/project-management-layout.test.mjs`

- [ ] **Step 1: 写失败测试**

```js
test('project modal uses the button-dialog shell and edit readonly context', () => {
  assert.match(source, /:footer="null"/)
  assert.match(source, /class="project-form-modal-titlebar"/)
  assert.match(source, /class="application-toolbar-action-btn project-form-modal-save-btn"/)
  assert.match(source, /:mask-style="projectFormMaskStyle"/)
  assert.match(source, /:wrap-props="projectFormWrapProps"/)
  assert.match(source, /wrap-class-name="project-form-modal-wrap"/)
  assert.match(source, /v-if="isEditMode"[\s\S]*class="project-form-note"/)
  assert.match(source, /v-if="isEditMode"[\s\S]*class="project-form-context"/)
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node --test frontend/tests/project-management-layout.test.mjs`
Expected: FAIL，提示项目弹窗仍然是默认 `a-modal` footer 结构。

- [ ] **Step 3: 提交测试约束改动**

```bash
git add frontend/tests/project-management-layout.test.mjs
git commit -m "test: cover project modal button dialog layout"
```

### Task 2: 实现项目弹窗按钮风格

**Files:**
- Modify: `frontend/src/views/application/ProjectManagementView.vue`
- Test: `frontend/tests/project-management-layout.test.mjs`

- [ ] **Step 1: 最小实现弹窗壳层**

```ts
const projectFormViewportInset = ref(0)
const projectFormMaskStyle = computed(() => ({
  left: `${projectFormViewportInset.value}px`,
  width: `calc(100% - ${projectFormViewportInset.value}px)`,
  background: 'rgba(15, 23, 42, 0.08)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  pointerEvents: modalOpen.value ? 'auto' : 'none',
}))
```

- [ ] **Step 2: 改 modal 结构**

```vue
<a-modal
  :open="modalOpen"
  :width="760"
  :closable="false"
  :footer="null"
  :destroy-on-close="true"
  :after-close="handleFormAfterClose"
  :mask-style="projectFormMaskStyle"
  :wrap-props="projectFormWrapProps"
  wrap-class-name="project-form-modal-wrap"
  @cancel="closeFormModal"
>
  <template #title>
    <div class="project-form-modal-titlebar">
      <span class="project-form-modal-title">{{ modalTitle }}</span>
      <a-button class="application-toolbar-action-btn project-form-modal-save-btn" :loading="saving" @click="submitForm">
        保存
      </a-button>
    </div>
  </template>
</a-modal>
```

- [ ] **Step 3: 改编辑态内容分区**

```vue
<div v-if="isEditMode" class="project-form-note">
  编辑态保留项目 Key 为只读标识，避免项目归属标识被误改。
</div>

<div v-if="isEditMode" class="project-form-panel project-form-panel--context">
  <div class="project-form-panel-title">当前配置</div>
  <div class="project-form-context">
    <!-- name + key readonly -->
  </div>
</div>

<div class="project-form-panel">
  <div class="project-form-panel-title">{{ isEditMode ? '可编辑配置' : '项目配置' }}</div>
  <!-- create: name/key/status/description; edit: name/status/description -->
</div>
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test frontend/tests/project-management-layout.test.mjs`
Expected: PASS

- [ ] **Step 5: 跑类型检查和构建**

Run: `cd frontend && npx vue-tsc --noEmit`
Expected: PASS

Run: `cd frontend && npm run build`
Expected: build succeeds

### Task 3: 浏览器验收

**Files:**
- Modify: `frontend/src/views/application/ProjectManagementView.vue`

- [ ] **Step 1: 刷新项目页并检查新增弹窗**

Run: use Browser Use on `http://192.168.30.196:5174/projects`
Expected: 新增项目弹窗显示标题栏保存按钮，无默认关闭图标和 footer 按钮。

- [ ] **Step 2: 检查编辑弹窗**

Run: use Browser Use on the first project row edit action
Expected: 编辑弹窗出现只读说明块和“当前配置”上下文块，`项目 Key` 不在可编辑表单区。
