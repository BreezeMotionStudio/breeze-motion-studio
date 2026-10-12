// Runs the Sanity CLI with a BMS-only home dir so it never reads or writes the
// machine-wide login (which other companies' agents use). Usage:
//   node scripts/sanity-bms.mjs login | projects list | schema deploy | ...
import {spawn} from 'node:child_process'
import {mkdirSync} from 'node:fs'
import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const home = resolve(root, '.sanity-home')
mkdirSync(home, {recursive: true})

const child = spawn('npx', ['sanity@latest', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: {...process.env, USERPROFILE: home, HOME: home, NODE_OPTIONS: process.env.NODE_OPTIONS ?? '--use-system-ca'},
})
child.on('exit', (code) => process.exit(code ?? 1))
