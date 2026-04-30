import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const apiURL = new URL('../src/api/release.ts', import.meta.url)
const source = readFileSync(apiURL, 'utf8')

test('pipeline stage log API uses extended timeout', () => {
  const match = source.match(
    /export async function getReleaseOrderPipelineStageLog\([\s\S]*?http\.get<ReleaseOrderPipelineStageLogResponse>\([\s\S]*?\{\s*timeout:\s*180_000,\s*\}/,
  )

  assert.ok(match, 'stage log loading should use a dedicated 180s timeout')
})
