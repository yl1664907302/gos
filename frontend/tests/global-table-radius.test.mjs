import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const styleURL = new URL('../src/style.css', import.meta.url)
const source = readFileSync(styleURL, 'utf8')

function extractStyleRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))
  assert.ok(match, `expected style rule for ${selector}`)
  return match[1]
}

test('all Ant table shells use square corners globally', () => {
  const tableShellRule = extractStyleRule('body :where(.ant-table-wrapper, .ant-table, .ant-table-container, .ant-table-content, .ant-table-body)')
  assert.match(tableShellRule, /border-radius:\s*0\s*!important/, 'table shells should not keep rounded corners')

  const tableElementRule = extractStyleRule('body :where(.ant-table-wrapper) table')
  assert.match(tableElementRule, /border-radius:\s*0\s*!important/, 'native table element should be square')

  const routeTableRule = extractStyleRule('body .page-wrapper table')
  assert.match(routeTableRule, /border-radius:\s*0\s*!important/, 'route-level native tables should be square')
})

test('all Ant table header and last-row cells use square corners globally', () => {
  const headRule = extractStyleRule('body :where(.ant-table-wrapper) :where(.ant-table-thead > tr > th)')
  assert.match(headRule, /border-radius:\s*0\s*!important/, 'header cells should be square')

  const bodyLastRowRule = extractStyleRule('body :where(.ant-table-wrapper) :where(.ant-table-tbody > tr:last-child > td)')
  assert.match(bodyLastRowRule, /border-radius:\s*0\s*!important/, 'last body row cells should be square')

  const routeTableCellRule = extractStyleRule('body .page-wrapper :where(thead > tr > th, tbody > tr:last-child > td)')
  assert.match(routeTableCellRule, /border-radius:\s*0\s*!important/, 'route-level native table edge cells should be square')
})
