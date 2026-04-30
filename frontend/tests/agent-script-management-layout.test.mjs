import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const sourceURL = new URL('../src/views/component/AgentScriptManagementView.vue', import.meta.url)
const source = readFileSync(sourceURL, 'utf8')

function extractStyleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  assert.ok(match, `expected style rule for ${selector}`)
  return match[1]
}

test('agent script management follows the component management standard layout', () => {
  assert.match(source, /<div class="page-wrap">[\s\S]*<div class="page-header">[\s\S]*<div class="page-title">脚本<\/div>/, 'script page should use the standard page header')
  assert.match(source, /class="application-toolbar-icon-btn"[\s\S]*SearchOutlined/, 'script keyword search should use the standard floating search entry')
  assert.match(source, /component-search-overlay[\s\S]*placeholder="脚本名称 \/ 文件名 \/ 说明"/, 'script page should use a floating keyword search overlay')
  assert.match(source, /class="component-toolbar-select"[\s\S]*类型 · 全部[\s\S]*class="component-toolbar-query-btn"/, 'script type filter should live in the header action strip')
  assert.match(source, /<\/transition>\s*<a-card :bordered="false" class="table-card">[\s\S]*<a-table/, 'script table should sit directly on the page without an extra module shell')
  assert.match(source, /<a-table[\s\S]*:columns="columns"[\s\S]*:data-source="dataSource"[\s\S]*showSizeChanger:\s*true[\s\S]*pageSizeOptions:\s*\['10', '20', '50'\]/, 'script list should keep the original Ant table and full page-size pagination')
  assert.match(source, /const columns: TableColumnsType<AgentScript> = \[[\s\S]*脚本名称[\s\S]*类型[\s\S]*Shell[\s\S]*脚本文件[\s\S]*说明[\s\S]*更新时间[\s\S]*操作/, 'script table should keep the original columns')
  assert.match(source, /#bodyCell="\{ column, record \}"[\s\S]*script-name[\s\S]*taskTypeText\(record\.task_type\)[\s\S]*record\.script_path[\s\S]*formatTime\(record\.updated_at\)[\s\S]*openEdit\(record\)[\s\S]*handleDelete\(record\)/, 'script table body should keep name, type, path, update time and row actions')
  assert.match(source, /wrap-class-name="component-instance-modal-wrap agent-script-modal-wrap"/, 'script modal should use the shared modal shell')
  assert.match(source, /class="application-toolbar-action-btn component-instance-modal-save-btn"[\s\S]*保存/, 'script modal save action should live in the titlebar')
  assert.doesNotMatch(source, /page-wrapper|page-header-card|filter-card|filter-form|agent-script-unified-layout|agent-script-module|agent-script-resource-card|agent-script-resource-list|01 · 脚本库|Agent 脚本|共 \{\{ total \}\} 个脚本|type="primary"|@ok="handleSave"|confirm-loading|okText="保存"|cancelText="取消"/, 'script page should not keep old header/filter cards, extra module shell, card-list rewrite, primary buttons or default modal save actions')

  const cardShellRule = extractStyleRule('.table-card')
  assert.doesNotMatch(cardShellRule, /overflow:\s*hidden/, 'script list shell should not clip rounded card edges')

  const modalRule = extractStyleRule('.component-instance-modal-wrap :deep(.ant-modal-content)')
  assert.match(modalRule, /border-radius:\s*24px/, 'script modal should use the standard rounded shell')
  assert.match(modalRule, /backdrop-filter:\s*blur\(18px\) saturate\(180%\)/, 'script modal should use glass treatment')
})
