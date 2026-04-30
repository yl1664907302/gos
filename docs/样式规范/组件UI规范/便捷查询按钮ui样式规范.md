# 便捷查询按钮 UI 样式规范

## 1. 目的
- 统一页面筛选区中"便捷查询"类按钮的触发与展开交互模式。
- 触发按钮与展开后的子选项按钮视觉一致，均复用右上角工具栏按钮（`release-toolbar-action-btn`）体系。
- 消除筛选区按钮与页头按钮之间的视觉割裂，保持同一页面按钮风格统一。
- 支持多组便捷查询（如状态查询、环境筛选）在同一行内并排展示。

## 2. 适用范围
- 前端技术栈：`Vue 3 + Ant Design Vue`
- 适用场景：筛选区中需要折叠/展开的分组查询按钮，例如状态查询、环境筛选等
- 不适用于：独立的查询/重置按钮、高级检索面板、表格操作列按钮

## 3. 基线实现
- 发布列表页：
  - `/Users/lingyunxieqing/Desktop/gos/frontend/src/views/release/ReleaseOrderListView.vue`
  - 状态查询：`statusExpanded` 控制展开
  - 环境筛选：`envExpanded` 控制展开

## 4. 多组便捷查询同行布局

### 4.1 布局结构
- 多组便捷查询（如状态查询、环境筛选）统一放在同一个 `.quick-filter-row` 容器内。
- 容器使用 flex 布局，自动换行（`flex-wrap: wrap`），各组按钮之间通过 `gap: 10px` 间隔。
- 不同组之间使用竖线分隔符（`.quick-filter-divider`）视觉区分。

```html
<div class="filter-entry-row">
  <div class="quick-filter-row">
    <!-- 第一组：状态查询 -->
    <a-button class="release-toolbar-action-btn release-toolbar-action-btn--primary release-quick-filter-trigger-btn">
      状态查询
    </a-button>
    <transition-group name="filter-expand">
      <!-- 状态子选项按钮 ... -->
    </transition-group>

    <!-- 分隔符 -->
    <div v-if="hasSecondGroup" class="quick-filter-divider"></div>

    <!-- 第二组：环境筛选 -->
    <template v-if="hasSecondGroup">
      <a-button class="release-toolbar-action-btn release-toolbar-action-btn--primary release-quick-filter-trigger-btn">
        环境筛选
      </a-button>
      <transition-group name="filter-expand">
        <!-- 环境子选项按钮 ... -->
      </transition-group>
    </template>
  </div>
</div>
```

### 4.2 分隔符样式

```css
.quick-filter-divider {
  width: 1px;
  height: 24px;
  background: rgba(148, 163, 184, 0.24);
  flex-shrink: 0;
}
```

### 4.3 布局规则
- 所有便捷查询组必须在同一行内展示，禁止拆成多行独立区域。
- 分隔符仅在存在多组时渲染，单组场景不显示分隔符。
- 各组的展开/收起互不影响，子选项按钮在各自触发按钮之后换行展示。
- 外层 `.filter-entry-row` 负责整体对齐，不额外添加 margin-top 或 border-top。

## 5. 交互规范

### 5.1 触发行为
- 点击触发按钮切换展开/收起状态。
- 展开后子按钮从触发按钮位置**原地渐现**（纯 opacity 过渡），不使用位移动画。
- 收起时子按钮**原地渐隐**，同样不使用位移动画。

### 5.2 触发按钮状态
- 默认态：与工具栏按钮一致的毛玻璃外观。
- 展开态：切换为 `--primary` 变体（蓝渐变底 + 蓝色边框 + 蓝色文字），明确提示当前处于展开状态。

### 5.3 子选项按钮
- 每个子按钮使用 `release-toolbar-action-btn` 基础样式。
- 当前选中的子按钮使用 `release-toolbar-action-btn--primary` 变体高亮。
- 子按钮点击后立即切换筛选值，无需额外确认。

### 5.4 图标约定
- 触发按钮左侧放置业务图标（如 `FilterOutlined`、`EnvironmentOutlined`）。
- 触发按钮右侧放置 `DownOutlined` 箭头，展开时旋转 180°。

## 6. 按钮样式规范

### 6.1 触发按钮（默认态）
与 `release-toolbar-action-btn` 基础样式完全一致：

```css
.release-toolbar-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.42);
  color: #0f172a;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 10px 22px rgba(15, 23, 42, 0.05);
  backdrop-filter: blur(14px) saturate(135%);
  padding-inline: 14px;
  font-weight: 600;
}
```

### 6.2 触发按钮（展开态）
切换为 `--primary` 变体：

```css
.release-toolbar-action-btn--primary {
  background: linear-gradient(180deg, rgba(241, 247, 255, 0.9), rgba(223, 235, 255, 0.8));
  border-color: rgba(147, 197, 253, 0.74);
  color: #1d4ed8;
}
```

### 6.3 Hover / Focus 状态

```css
.release-toolbar-action-btn:hover,
.release-toolbar-action-btn:focus,
.release-toolbar-action-btn:focus-visible,
.release-toolbar-action-btn:active {
  border-color: rgba(96, 165, 250, 0.34);
  background: rgba(255, 255, 255, 0.56);
  color: #0f172a;
}

.release-toolbar-action-btn--primary:hover,
.release-toolbar-action-btn--primary:focus,
.release-toolbar-action-btn--primary:focus-visible,
.release-toolbar-action-btn--primary:active {
  background: linear-gradient(180deg, rgba(248, 251, 255, 0.96), rgba(231, 241, 255, 0.88));
  border-color: rgba(96, 165, 250, 0.66);
  color: #1e3a8a;
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 12px 26px rgba(59, 130, 246, 0.12);
}
```

### 6.4 箭头旋转

```css
.trigger-icon-rotate {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
```

## 7. 展开动画规范

- **仅使用 opacity 渐变**，禁止使用 `translateX`、`translateY`、`scale` 等位移/缩放属性。
- 进入动画：`opacity 0 → 1`，时长 `0.18s`，缓动 `ease`。
- 离开动画：`opacity 1 → 0`，时长 `0.12s`，缓动 `ease`。
- 使用 Vue `<transition-group name="filter-expand">` 实现。

```css
.filter-expand-enter-active {
  transition: opacity 0.18s ease;
}

.filter-expand-leave-active {
  transition: opacity 0.12s ease;
}

.filter-expand-enter-from,
.filter-expand-leave-to {
  opacity: 0;
}
```

## 8. 全局样式保障

当按钮位于 `.filter-card` 内时，全局 `style.css` 中的 `.page-wrapper .filter-card` 按钮规则必须同步使用毛玻璃样式，避免被实色背景覆盖：

```css
.page-wrapper .filter-card :where(.ant-btn-default) {
  background: rgba(255, 255, 255, 0.44) !important;
  border-color: rgba(255, 255, 255, 0.34) !important;
  color: var(--color-dashboard-800) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 10px 22px rgba(15, 23, 42, 0.05) !important;
  backdrop-filter: blur(14px) saturate(135%);
}

.page-wrapper .filter-card :where(.ant-btn-primary) {
  background: linear-gradient(180deg, rgba(219, 234, 254, 0.64), rgba(191, 219, 254, 0.5)) !important;
  border-color: rgba(96, 165, 250, 0.36) !important;
  color: #1d4ed8 !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 10px 24px rgba(59, 130, 246, 0.1) !important;
  backdrop-filter: blur(14px) saturate(140%);
}
```

## 9. 推荐实现模板

```vue
<template>
  <a-button
    class="release-toolbar-action-btn"
    :class="{ 'release-toolbar-action-btn--primary': expanded }"
    @click="expanded = !expanded"
  >
    <template #icon>
      <FilterOutlined />
    </template>
    状态查询
    <DownOutlined :class="{ 'trigger-icon-rotate': expanded }" />
  </a-button>

  <transition-group name="filter-expand">
    <a-button
      v-for="item in options"
      v-show="expanded"
      :key="item.value"
      class="release-toolbar-action-btn"
      :class="{ 'release-toolbar-action-btn--primary': currentValue === item.value }"
      @click="handleSelect(item.value)"
    >
      {{ item.label }}
    </a-button>
  </transition-group>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FilterOutlined, DownOutlined } from "@ant-design/icons-vue";

const expanded = ref(false);
const currentValue = ref("");
const options = [
  { label: "全部", value: "" },
  { label: "待执行", value: "pending" },
  { label: "发布中", value: "deploying" },
];

function handleSelect(value: string) {
  currentValue.value = value;
}
</script>
```

## 10. 禁止项
- 禁止为触发按钮和子选项按钮使用不同视觉体系（如触发按钮用圆角胶囊、子按钮用方角）。
- 禁止使用 `translateX` / `translateY` 位移动画，避免"飞入"效果。
- 禁止在筛选区使用实色深底按钮（如 `var(--color-dashboard-900)` 实色背景），统一使用毛玻璃半透明风格。
- 禁止子按钮展开后改变触发按钮位置或推挤其他元素（子按钮应在触发按钮下方换行展示）。
- 禁止将多组便捷查询拆成多个独立行区域，必须统一放在 `.quick-filter-row` 内同行展示。
- 禁止为展开态添加额外的外层卡片或容器背景。
