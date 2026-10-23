import { readFile, writeFile } from 'node:fs/promises'
import { randomUUID, createHash } from 'node:crypto'
process.loadEnvFile('.env.local')
const root = '.local/suit-replacement'
const plan = JSON.parse(await readFile(`${root}/plan.json`, 'utf8'))
if (!plan.length || plan.some(p => !p.name || !p.images?.length || !(p.price > 0))) throw new Error('Plano inválido')
if (!process.argv.includes('--apply')) { console.log(`${plan.length} ternos preparados. Use --apply.`); process.exit(0) }
const url = process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, '')
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
async function request(endpoint, method = 'GET', body, type = 'application/json') {
  const r = await fetch(url + endpoint, { method, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': type },
    body: body === undefined ? undefined : type === 'application/json' ? JSON.stringify(body) : body })
  if (!r.ok) throw new Error(`${method} ${endpoint}: ${r.status} ${await r.text()}`)
  const text = await r.text(); return text ? JSON.parse(text) : null
}
const cats = await request('/rest/v1/categories?slug=eq.ternos&select=id')
if (cats.length !== 1) throw new Error('Categoria Ternos não encontrada de forma única')
const categoryId = cats[0].id
async function getProducts() {
  const rows = []
  for (let offset = 0; ; offset += 1000) {
    const page = await request(`/rest/v1/products?category_id=eq.${categoryId}&select=*&order=id&limit=1000&offset=${offset}`)
    rows.push(...page); if (page.length < 1000) return rows
  }
}
const existing = await getProducts()
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
await writeFile(`${root}/backup-${stamp}.json`, JSON.stringify(existing, null, 2))
const products = []
for (const [index, item] of plan.entries()) {
  const images = []
  for (const file of item.images) {
    const bytes = await readFile(file)
    const hash = createHash('sha256').update(bytes).digest('hex')
    const object = `ternos/replacement-2026-10-23/${hash}.jpg`
    try { await request(`/storage/v1/object/product-images/${object}`, 'POST', bytes, 'image/jpeg') }
    catch (error) { if (!/already exists|Duplicate/i.test(error.message)) throw error }
    const image = `${url}/storage/v1/object/public/product-images/${object}`
    const check = await fetch(image, { method: 'HEAD' })
    if (!check.ok) throw new Error(`Imagem indisponível para ${item.name}`)
    images.push(image)
  }
  products.push({ id: randomUUID(), name: item.name, description: item.description, price: item.price, category_id: categoryId,
    images, order_index: index + 1, active: true })
  if ((index + 1) % 20 === 0 || index + 1 === plan.length) console.log(`Ternos preparados no Storage: ${index + 1}/${plan.length}`)
}
await writeFile(`${root}/new-products-${stamp}.json`, JSON.stringify(products, null, 2))
await request('/rest/v1/products', 'POST', products)
const newIds = new Set(products.map(p => p.id))
const inserted = (await getProducts()).filter(p => newIds.has(p.id))
if (inserted.length !== products.length) throw new Error('Verificação de inserção falhou; produtos antigos preservados')
for (let i = 0; i < existing.length; i += 50) {
  await request(`/rest/v1/products?id=in.(${existing.slice(i, i + 50).map(p => p.id).join(',')})`, 'DELETE')
}
const final = await getProducts()
if (final.length !== products.length || final.some(p => !newIds.has(p.id) || !p.active)) throw new Error('Verificação final falhou')
const publicResponse = await fetch(`${url}/rest/v1/products?category_id=eq.${categoryId}&select=id,price&limit=1000`, {
  headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
})
if (!publicResponse.ok || (await publicResponse.json()).length !== products.length) throw new Error('Verificação pública falhou')
await writeFile(`${root}/result-${stamp}.json`, JSON.stringify({ deleted: existing.length, inserted: products.length, newIds: [...newIds] }, null, 2))
console.log(`Concluído: ${existing.length} ternos antigos excluídos; ${products.length} novos ternos verificados no catálogo público.`)
