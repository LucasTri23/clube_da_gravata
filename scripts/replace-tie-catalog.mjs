// Preview: node scripts/replace-tie-catalog.mjs
// Apply: node scripts/replace-tie-catalog.mjs --apply
// Requires .env.local and CATALOG_SEDA_PRICE / CATALOG_PREMIUM_SEDA_PRICE.
import { readdir, readFile, mkdir, writeFile, copyFile } from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
try { process.loadEnvFile(path.join(root, '.env.local')) } catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const apply = process.argv.includes('--apply')
const sourceRoot = process.env.CATALOG_PHOTO_ROOT || 'C:/Users/x17859816/Downloads'
const output = path.join(root, '.local/catalog-replacement')
const groups = [
  ['lisa', 'Lisa', 'lisa', 22.90],
  ['lenço', 'Com Lenço', 'com-lenco', 40],
  ['premium seda', 'Premium Seda', 'premium-seda', Number(process.env.CATALOG_PREMIUM_SEDA_PRICE) || null],
  ['tradicional 7,5', 'Tradicional 7,5cm', 'tradicional-7-5cm', 33.90],
  ['seda', 'Seda', 'seda', Number(process.env.CATALOG_SEDA_PRICE) || null],
  ['kashmir', 'Kashmir/Floral', 'kashmir-floral', 29.99],
  ['xadrez', 'Xadrez Detalhado', 'xadrez-detalhado', 29.99],
]
await mkdir(path.join(output, 'photos'), { recursive: true })
const plan = [], duplicates = [], summary = []
for (const [folder, model, slug, price] of groups) {
  const files = (await readdir(path.join(sourceRoot, folder))).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort()
  const hashes = new Set()
  let number = 0
  for (const filename of files) {
    const source = path.join(sourceRoot, folder, filename)
    const bytes = await readFile(source)
    const hash = createHash('sha256').update(bytes).digest('hex')
    if (hashes.has(hash)) { duplicates.push({ folder, filename, hash }); continue }
    hashes.add(hash)
    const ext = path.extname(filename).toLowerCase()
    const staged = path.join(output, 'photos', `${slug}-${hash}${ext}`)
    await copyFile(source, staged)
    plan.push({ source, staged, hash, storagePath: `gravatas/${slug}/replacement-2026-10-21/${hash}${ext}`,
      contentType: ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg',
      name: `Gravata ${model} ${String(++number).padStart(3, '0')}`, description: `Modelo: ${model}`, price })
  }
  summary.push({ folder, model, files: files.length, products: number, price })
}
await writeFile(path.join(output, 'plan.json'), JSON.stringify({ summary, duplicates, plan }, null, 2))
console.table(summary)
console.log(`${plan.length} produtos; ${duplicates.length} arquivos idênticos descartados dentro da mesma pasta.`)
if (!apply) { console.log('Prévia preparada em .local/catalog-replacement; catálogo não alterado.'); process.exit(0) }
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Restaure .env.local com as credenciais do Supabase antes de aplicar.')
if (plan.some(p => !Number.isFinite(p.price) || p.price <= 0)) throw new Error('Informe CATALOG_SEDA_PRICE e CATALOG_PREMIUM_SEDA_PRICE; nenhum produto foi alterado.')
async function request(endpoint, { method = 'GET', body, contentType = 'application/json', prefer } = {}) {
  const response = await fetch(`${url}${endpoint}`, { method, headers: {
    apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': contentType,
    ...(prefer ? { Prefer: prefer } : {}),
  }, body: body === undefined ? undefined : contentType === 'application/json' ? JSON.stringify(body) : body })
  if (!response.ok) throw new Error(`${method} ${endpoint}: ${response.status} ${await response.text()}`)
  const text = await response.text()
  return text ? JSON.parse(text) : null
}
const categories = await request('/rest/v1/categories?slug=eq.gravatas&select=id')
if (categories.length !== 1) throw new Error('Categoria Gravatas não encontrada de forma única.')
const categoryId = categories[0].id
const existing = []
for (let offset = 0; ; offset += 1000) {
  const page = await request(`/rest/v1/products?category_id=eq.${categoryId}&select=*&order=id&limit=1000&offset=${offset}`)
  existing.push(...page)
  if (page.length < 1000) break
}
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
await writeFile(path.join(output, `backup-${stamp}.json`), JSON.stringify(existing, null, 2))
const products = []
for (const [index, item] of plan.entries()) {
  await request(`/storage/v1/object/product-images/${item.storagePath}`, {
    method: 'POST', contentType: item.contentType, body: await readFile(item.staged),
  }).catch(error => { if (!/already exists|Duplicate/i.test(error.message)) throw error })
  products.push({ id: randomUUID(), name: item.name, description: item.description, price: item.price,
    category_id: categoryId, images: [`${url}/storage/v1/object/public/product-images/${item.storagePath}`],
    active: false, order_index: index + 1 })
  if ((index + 1) % 25 === 0) console.log(`Fotos enviadas: ${index + 1}/${plan.length}`)
}
// Keep old rows and image objects for recovery and existing product links.
await request('/rest/v1/products', { method: 'POST', body: products })
const oldActive = existing.filter(p => p.active).map(p => p.id)
const newIds = products.map(p => p.id)
async function setActive(ids, active) {
  for (let i = 0; i < ids.length; i += 50) {
    await request(`/rest/v1/products?id=in.(${ids.slice(i, i + 50).join(',')})`, { method: 'PATCH', body: { active } })
  }
}
try {
  await setActive(oldActive, false)
  await setActive(newIds, true)
  const visible = await request(`/rest/v1/products?category_id=eq.${categoryId}&active=eq.true&select=id&limit=1000`)
  if (visible.length !== newIds.length || visible.some(p => !newIds.includes(p.id))) throw new Error('Verificação dos produtos ativos falhou.')
} catch (error) {
  await setActive(newIds, false)
  await setActive(oldActive, true)
  throw error
}
await writeFile(path.join(output, `result-${stamp}.json`), JSON.stringify({ oldActive, newIds, summary }, null, 2))
console.log(`Concluído: ${newIds.length} gravatas ativas; ${oldActive.length} produtos anteriores arquivados.`)
