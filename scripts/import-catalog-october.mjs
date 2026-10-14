// Prévia: node scripts/import-catalog-october.mjs
// Importar: node scripts/import-catalog-october.mjs --apply
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'node:crypto'
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

config({ path: new URL('../.env.local', import.meta.url), quiet: true })
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Credenciais do Supabase ausentes')
const supabase = createClient(url, key, { auth: { persistSession: false } })
const apply = process.argv.includes('--apply')
const downloads = process.env.CATALOG_PHOTO_ROOT || 'C:/Users/lucas/Downloads'
const assetRoot = fileURLToPath(new URL('../public/catalogo/2026-10/', import.meta.url))
const groups = [
  { folder: 'lisa', model: 'Lisa', slug: 'lisa', price: 22.90 },
  { folder: 'tradicionais', model: 'Tradicional 7,5cm', slug: 'tradicional-7-5cm', price: 33.90 },
  { folder: 'kashmir', model: 'Kashmir/Floral', slug: 'kashmir-floral', price: 29.99 },
  { folder: 'xadrezDetalhada', model: 'Xadrez Detalhado', slug: 'xadrez-detalhado', price: 29.99 },
  { folder: 'lenco', model: 'Com Lenco', slug: 'com-lenco', price: 40.00 },
  { folder: assetRoot, model: 'Kit Gravata, Lenço e Abotoaduras', slug: 'kit-gravata-lenco-abotoaduras', price: 70.00, kit: true },
]

const { data: category, error: categoryError } = await supabase.from('categories')
  .select('id').eq('slug', 'gravatas').single()
if (categoryError) throw categoryError
const existing = []
for (let offset = 0; ; offset += 1000) {
  const { data, error } = await supabase.from('products').select('*')
    .order('id').range(offset, offset + 999)
  if (error) throw error
  existing.push(...data)
  if (data.length < 1000) break
}
const knownImages = new Set(existing.flatMap(product => product.images || []))
const plannedImages = new Set()
const plan = []
let skipped = 0
let nextOrder = Math.max(0, ...existing.map(product => product.order_index || 0)) + 1
for (const group of groups) {
  const folder = group.kit ? group.folder : path.join(downloads, group.folder)
  const files = (await readdir(folder)).filter(file => /\.(jpe?g|png|webp)$/i.test(file))
    .filter(file => group.kit ? /^kit-.*\.png$/.test(file) : file !== 'gravata-lenco-abotoadura.jpeg').sort()
  const prefix = `Gravata ${group.model} `
  let number = Math.max(0, ...existing.filter(product => product.name.startsWith(prefix))
    .map(product => Number(product.name.slice(prefix.length)) || 0))
  let additions = 0
  for (const file of files) {
    const source = path.join(folder, file)
    const buffer = await readFile(source)
    const hash = createHash('sha256').update(buffer).digest('hex')
    const ext = path.extname(file).toLowerCase()
    const storagePath = `gravatas/${group.slug}/catalogo-2026-10/${hash}${ext}`
    const imageUrl = `${url}/storage/v1/object/public/product-images/${storagePath}`
    if (knownImages.has(imageUrl) || plannedImages.has(imageUrl)) { skipped++; continue }
    plannedImages.add(imageUrl)
    const colour = file.replace(/^kit-/, '').replace(/\.[^.]+$/, '')
    const name = group.kit ? `Kit Gravata, Lenço e Abotoaduras - ${colour.charAt(0).toUpperCase() + colour.slice(1)}`
      : `${prefix}${String(++number).padStart(3, '0')}`
    if (existing.some(product => product.name === name)) throw new Error(`Nome já cadastrado: ${name}`)
    plan.push({ source, storagePath, contentType: ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg',
      product: { name, description: `Modelo: ${group.model}${group.kit ? ' | Inclui gravata, lenço e par de abotoaduras.' : ''}`,
        price: group.price, category_id: category.id, images: [imageUrl], active: true, order_index: nextOrder++ } })
    additions++
  }
  console.log(`${group.model}: ${files.length} fotos, ${additions} novos produtos; R$ ${group.price.toFixed(2)}.`)
}
console.log(`Total: ${plan.length} novos produtos; ${skipped} fotos já importadas ou repetidas.`)
const reportRoot = new URL('../.local/catalog-backups/', import.meta.url)
await mkdir(reportRoot, { recursive: true })
await writeFile(new URL('october-plan.json', reportRoot), JSON.stringify(plan, null, 2))
if (!apply) { console.log('Prévia sem alterações no catálogo. Use --apply.'); process.exit(0) }
if (plan.length) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await writeFile(new URL(`before-october-${timestamp}.json`, reportRoot), JSON.stringify(existing, null, 2))
}
let cursor = 0, done = 0
const failures = []
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < plan.length) {
    const item = plan[cursor++]
    try {
      const { error: uploadError } = await supabase.storage.from('product-images')
        .upload(item.storagePath, await readFile(item.source), { contentType: item.contentType, upsert: true })
      if (uploadError) throw uploadError
      const { error: insertError } = await supabase.from('products').insert(item.product)
      if (insertError) throw insertError
      done++
      if (done % 20 === 0 || done === plan.length) console.log(`Importados: ${done}/${plan.length}`)
    } catch (error) { failures.push({ name: item.product.name, message: error.message }); console.error(item.product.name, error.message) }
  }
}))
await writeFile(new URL('october-result.json', reportRoot), JSON.stringify({ imported: done, failures }, null, 2))
if (failures.length) throw new Error(`${failures.length} produtos não importados; consulte .local/catalog-backups/october-result.json`)
console.log(`Concluído: ${done} produtos cadastrados.`)
