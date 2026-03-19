import fs from 'node:fs'
import path from 'node:path'

const target = path.resolve(
  process.cwd(),
  'node_modules/@vitejs/plugin-vue/dist/index.mjs',
)

if (!fs.existsSync(target)) {
  console.warn(`[patch-plugin-vue] skip: ${target} not found`)
  process.exit(0)
}

let content = fs.readFileSync(target, 'utf8')
let changed = false

const replacements = [
  {
    from: 'if (options.value.compiler.invalidateTypeCache) options.value.compiler.invalidateTypeCache(ctx.file);',
    to: 'options.value.compiler?.invalidateTypeCache?.(ctx.file);',
  },
  {
    from: 'if (compiler.invalidateTypeCache) options.value.devServer?.watcher.on("unlink", (file) => {',
    to: 'if (compiler?.invalidateTypeCache) options.value.devServer?.watcher.on("unlink", (file) => {',
  },
]

for (const item of replacements) {
  if (content.includes(item.to)) {
    continue
  }
  if (!content.includes(item.from)) {
    console.warn(`[patch-plugin-vue] pattern not found: ${item.from}`)
    continue
  }
  content = content.replace(item.from, item.to)
  changed = true
}

if (changed) {
  fs.writeFileSync(target, content, 'utf8')
  console.log('[patch-plugin-vue] patched @vitejs/plugin-vue HMR null-compiler guard')
} else {
  console.log('[patch-plugin-vue] already patched or no changes needed')
}
