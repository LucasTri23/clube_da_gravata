// Apaga produtos cujo nome bate com um padrão (ilike), antes de reimportar uma linha de catálogo
// Execute: node scripts/delete-products-by-name.mjs "Poliviscose"

import { fileURLToPath } from 'url'
import { config } from 'dotenv'
config({ path: fileURLToPath(new URL('../.env.local', import.meta.url)) })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Faltam variáveis no .env.local')
  process.exit(1)
}

async function api(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers ?? {}),
    },
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${body}`)
  return body ? JSON.parse(body) : null
}

async function main() {
  const term = process.argv[2]
  if (!term) {
    console.error('Uso: node scripts/delete-products-by-name.mjs "<termo>"')
    process.exit(1)
  }

  const pattern = `*${term}*`
  const found = await api(`products?select=id,name&name=ilike.${encodeURIComponent(pattern)}`)
  console.log(`Encontrados ${found.length} produtos contendo "${term}":`)
  found.forEach(p => console.log(`  - ${p.name}`))

  if (found.length === 0) {
    console.log('Nada para apagar.')
    return
  }

  await api(`products?name=ilike.${encodeURIComponent(pattern)}`, { method: 'DELETE' })
  const after = await api(`products?select=id&name=ilike.${encodeURIComponent(pattern)}`)
  console.log(`\nApagados. Restantes com "${term}": ${after.length}`)
}

main().catch(err => { console.error(err.message); process.exit(1) })
