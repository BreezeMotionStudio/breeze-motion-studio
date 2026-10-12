// BMS content access without any login session. Uses SANITY_API_WRITE_TOKEN from web/.env.local.
//   node scripts/sanity-api.mjs query '<GROQ>'
//   node scripts/sanity-api.mjs mutate mutations.json [--dry-run]   (file: {"mutations":[...]})
// Remember: publish after creating (no orphan drafts), never `set` a full `sections` array.
import {readFileSync} from 'node:fs'
import {resolve, dirname} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const env = readFileSync(resolve(root, 'web/.env.local'), 'utf8')
const token = env.match(/^SANITY_API_WRITE_TOKEN=(.+)$/m)?.[1]?.trim()
if (!token) throw new Error('SANITY_API_WRITE_TOKEN missing from web/.env.local')

const base = 'https://ce9w3sdr.api.sanity.io/v2025-01-01/data'
const headers = {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
const [cmd, arg, flag] = process.argv.slice(2)

if (cmd === 'query') {
  const res = await fetch(`${base}/query/production?query=${encodeURIComponent(arg)}&perspective=raw`, {headers})
  console.log(JSON.stringify(await res.json(), null, 2))
} else if (cmd === 'mutate') {
  const body = readFileSync(resolve(arg), 'utf8')
  const qs = `returnIds=true${flag === '--dry-run' ? '&dryRun=true' : ''}`
  const res = await fetch(`${base}/mutate/production?${qs}`, {method: 'POST', headers, body})
  console.log(JSON.stringify(await res.json(), null, 2))
} else {
  console.error('usage: query <GROQ> | mutate <file.json> [--dry-run]')
  process.exit(1)
}
