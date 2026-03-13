# Vue3 + Ant Design Vue 前端需求文档 v0.0.1

## 1. 文档信息
- 版本: `v0.0.1`
- 对应后端基线日期: `2026-03-12`
- 对应 API: 当前 `applications` 模块（含分页查询）
- 目标: 基于 Vue3 + Ant Design Vue 实现应用管理前端

## 2. 范围说明
本版本只覆盖应用管理（Application）能力，不包含发布、部署、运行时、环境管理等模块。

包含功能:
- 应用列表分页查询
- 应用创建
- 应用详情查看
- 应用编辑
- 应用删除

不包含功能:
- 登录鉴权与权限控制
- 多租户
- 审计日志
- 发布/部署流程 UI

## 3. 技术选型
- `Vue 3`
- `Vue Router 4`
- `Pinia`
- `Axios`
- `Ant Design Vue`
- `TypeScript`（建议）
- `Vite`

## 4. 页面与路由
- 菜单结构：
- 一级菜单：`应用管理`
- 二级菜单：`我的应用`（承载原应用管理模块）
- `/applications`: 应用列表页（筛选 + 分页 + 操作）
- `/applications/new`: 应用创建页
- `/applications/:id`: 应用详情页
- `/applications/:id/edit`: 应用编辑页

## 5. 业务对象定义
Application 字段:
- `id: string`
- `name: string`
- `key: string`
- `repo_url: string`
- `description: string`
- `owner: string`
- `status: string`，枚举: `active | inactive`
- `artifact_type: string`
- `language: string`
- `created_at: string`（ISO 时间）
- `updated_at: string`（ISO 时间）

## 6. 功能需求

### 6.1 应用列表页
功能:
- 顶部筛选条件:
- `key`（输入框）
- `name`（输入框）
- `status`（下拉: `active/inactive`）
- 表格展示字段:
- `name`
- `key`
- `status`
- `artifact_type`
- `language`
- `owner`
- `repo_url`
- `updated_at`
- 操作列:
- `查看`
- `编辑`
- `删除`
- 远程分页:
- 分页参数 `page`、`page_size`
- 默认 `page=1`、`page_size=20`
- `page_size` 最大 `100`
- 删除操作需二次确认（`a-popconfirm` 或 `a-modal`）

交互要求:
- 修改筛选条件后点击“查询”触发请求
- 点击“重置”恢复默认筛选并回到第一页
- 分页切换时保留筛选条件

### 6.2 应用创建页
表单字段:
- `name`（必填）
- `key`（必填）
- `repo_url`（选填）
- `description`（选填）
- `owner`（选填）
- `status`（必填，默认 `active`）
- `artifact_type`（必填，下拉选择）
- `language`（必填，下拉选择）

提交行为:
- 调用 `POST /applications`
- 成功后提示并跳转到列表页或详情页
- 失败时根据错误码展示消息

### 6.3 应用详情页
功能:
- 调用 `GET /applications/{id}`
- 只读展示完整字段
- 提供“返回列表”“去编辑”按钮

### 6.4 应用编辑页
功能:
- 先调用 `GET /applications/{id}` 回填
- 提交调用 `PUT /applications/{id}`
- 字段与创建页一致
- `status` 必填，值仅允许 `active/inactive`
- `artifact_type` 必填，使用下拉选择
- `language` 必填，使用下拉选择

### 6.5 删除应用
功能:
- 列表页点击删除后确认
- 调用 `DELETE /applications/{id}`
- 成功后刷新当前页数据
- 若当前页删除后无数据，可回退到上一页再查询

## 7. API 对接要求

### 7.1 列表查询
- 方法: `GET /applications`
- Query:
- `key?: string`
- `name?: string`
- `status?: string`
- `page?: number`
- `page_size?: number`
- 响应:
- `data: Application[]`
- `page: number`
- `page_size: number`
- `total: number`

### 7.2 创建应用
- 方法: `POST /applications`
- Body: `CreateApplicationRequest`
- 响应: `{ data: Application }`

### 7.3 查询详情
- 方法: `GET /applications/{id}`
- 响应: `{ data: Application }`

### 7.4 编辑应用
- 方法: `PUT /applications/{id}`
- Body: `UpdateApplicationRequest`
- 响应: `{ data: Application }`

### 7.5 删除应用
- 方法: `DELETE /applications/{id}`
- 响应: `204 No Content`

## 8. 错误处理
- `400`: 参数错误，展示后端 `error` 文案
- `404`: 资源不存在，提示后返回列表页
- `409`: `key` 冲突，提示“应用 Key 已存在”
- `500`: 通用错误提示“系统异常，请稍后重试”

## 9. UI 组件约束（Ant Design Vue）
- 列表: `a-table` + `pagination`
- 查询: `a-form` + `a-input` + `a-select`
- 编辑/创建: `a-form` + `a-input` + `a-textarea` + `a-select`
- 操作反馈: `message` / `notification`
- 删除确认: `a-popconfirm` 或 `a-modal`

## 10. 验收标准（v0.0.1）
- 最重要！ 使用统一的Ant Design Vue 构建
- 可完成应用的增删改查全流程
- 列表支持筛选与后端分页联动
- 分页参数与后端规则一致（默认值、最大值）
- 所有 API 异常码有可见、可理解的提示
- 页面在桌面端正常使用（Chrome 最新版）
- 页面必须和设计需求一致
- 不允许随意发挥视觉风格
- 若需求不明确，先列出缺失项，再按现有设计系统最保守实现
- 风格：简洁、企业后台风
- 圆角：统一 rounded-xl
- 间距：卡片 p-6，模块间 gap-6
- 字号：标题 text-xl/font-semibold，正文 text-sm
- 颜色：优先中性色，主色只用于按钮和链接
- 禁止写内联 style，优先复用现有组件
- 响应式必须支持 1440 / 1024 / 768 三档

## 11. 当前样式基线（已落地）

### 11.1 全局设计 Token
- 主色：`#1677ff`（仅按钮、链接、关键交互）
- 圆角：`12px`（rounded-xl）
- 正文字号：`14px`（text-sm）
- 标题字号：`20px`，字重 `600`（text-xl / font-semibold）
- 页面背景：中性色 `#f5f7fa`
- 容器边框：`#f0f0f0`

### 11.2 布局结构
- 左侧固定菜单栏（`Sider`，默认宽度 `220`）
- 右侧内容区（顶部页面标题 + 业务内容）
- 内容区最大宽度 `1440px`，居中展示

### 11.3 页面间距与卡片规范
- 模块间距：`gap-6`（桌面为 `24px`）
- 卡片内边距：`p-6`（桌面为 `24px`）
- 表单、筛选区、表格区均使用 Ant Design Vue Card
- 卡片统一 `12px` 圆角，白底 + 浅边框，不使用装饰性渐变

### 11.4 组件风格约束
- 统一使用 Ant Design Vue 组件，不混用其他 UI 库
- 列表页：`a-form` + `a-table` + `a-pagination`
- 新增/编辑页：`a-form` + `a-input` + `a-select` + `a-textarea`
- 删除确认：`a-popconfirm`
- 反馈：`message`

### 11.5 响应式规则
- `<=1440`: 保持桌面布局，留白与间距按桌面规范
- `<=1024`: 内容区缩小，筛选与头部操作区允许换行
- `<=768`: 左侧菜单宽度缩小，页面头部改为纵向排列，表单与筛选单列展示

### 11.6 禁止项
- 不允许内联 `style`
- 不允许无需求定义的视觉风格扩展（如渐变背景、强装饰阴影、品牌色泛滥）

## 12. 当前进度（2026-03-12）
已完成：
- `Vue3 + Vite + TypeScript + Ant Design Vue` 工程已落地
- 左侧菜单结构已调整为 `应用管理 > 我的应用`
- 应用列表页已实现筛选、分页、查看、编辑、删除
- 应用创建页已实现并对接 `POST /applications`
- 应用详情页已实现并对接 `GET /applications/{id}`
- 应用编辑页已实现并对接 `PUT /applications/{id}`
- 删除确认已实现并对接 `DELETE /applications/{id}`
- 错误码提示（400/404/409/500）已实现
- 样式基线已按企业后台风统一（圆角、间距、字号、颜色）
- 响应式 `1440 / 1024 / 768` 三档已实现

未完成：
- `artifact_type`、`language` 下拉选项仍为前端静态枚举，未改为字典接口
- 登录鉴权、权限控制、多租户
- E2E/UI 自动化测试
