// Тонкая обёртка над CLI пакета `modern-web-guidance` (npm).
// Без зависимостей от dsh — можно тестировать отдельно (npm test).
// Гайды лежат внутри npm-пакета; поиск локальный и офлайн.
import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, resolve, sep } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const require = createRequire(import.meta.url)

let cachedBin

/** Путь к bin-скрипту установленного пакета modern-web-guidance. */
export function resolveBin() {
  if (cachedBin) return cachedBin
  const pkgPath = require.resolve('modern-web-guidance/package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  const rel = typeof pkg.bin === 'string'
    ? pkg.bin
    : (pkg.bin?.['modern-web-guidance'] ?? Object.values(pkg.bin ?? {})[0])
  if (!rel) throw new Error('modern-web-guidance: no "bin" entry in its package.json')
  const bin = resolve(dirname(pkgPath), rel)
  if (!existsSync(bin)) throw new Error(`modern-web-guidance: bin not found at ${bin}`)
  return (cachedBin = bin)
}

async function exec(args) {
  // node напрямую, без shell и без npx: работает на Windows и нет инъекции в аргументы.
  const { stdout } = await run(process.execPath, [resolveBin(), ...args], {
    timeout: 120_000,
    maxBuffer: 8 * 1024 * 1024,
    windowsHide: true,
    // Анонимную телеметрию Google отключаем по умолчанию; свой DISABLE_TELEMETRY=0 это перебьёт.
    env: { DISABLE_TELEMETRY: '1', ...process.env },
  })
  return stdout.trim()
}

/** search: возвращает JSON-строку [{id, description}, ...]. */
export function search(query) {
  return exec(['search', String(query)])
}

/** list: все доступные гайды. */
export function list() {
  return exec(['list'])
}

/**
 * retrieve: CLI при выводе > ~9.5 KB сам сохраняет гайд во временный файл и печатает
 * "Output (...) saved to <path> to prevent CLI stdout truncation." — подхватываем и читаем файл.
 */
export async function retrieve(ids) {
  const out = await exec(['retrieve', String(ids)])
  const m = out.match(/saved to (.+?) to prevent CLI stdout truncation/)
  if (!m) return out
  const file = resolve(m[1].trim())
  const tmp = resolve(tmpdir()).toLowerCase() + sep
  if (!file.toLowerCase().startsWith(tmp) || !basename(file).startsWith('mwg-guide-')) {
    return out // подозрительный путь — не читаем, отдаём как есть
  }
  try {
    const text = readFileSync(file, 'utf8')
    try { unlinkSync(file) } catch {}
    return text
  } catch {
    return out
  }
}
