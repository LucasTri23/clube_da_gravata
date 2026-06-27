// Apaga TODOS os produtos do banco antes de reimportar com fotos
// Execute: node scripts/delete-all-products.mjs

const SUPABASE_URL = 'https://jfayxhqgntipfwbfusfw.supabase.co'
const SERVICE_ROLE_KEY = 'sb_secret_d7_GOxTA-32YIqkOqmRxsg_t5aVL3RJ'

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
  const count = await api('products?select=id')
  console.log(`Encontrados ${count.length} produtos. Apagando...`)
  await api('products?id=neq.00000000-0000-0000-0000-000000000000', { method: 'DELETE' })
  const after = await api('products?select=id')
  console.log(`Produtos restantes: ${after.length}`)
  console.log('Pronto! Agora rode os scripts de importação com PDF.')
}

main().catch(err => { console.error(err.message); process.exit(1) })
