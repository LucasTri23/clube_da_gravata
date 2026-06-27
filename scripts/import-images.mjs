/**
 * Importa imagens JPEG de uma pasta como produtos de gravata.
 *
 * Uso:
 *   node scripts/import-images.mjs <pasta> <nome-modelo> <preco>
 *
 * Exemplos:
 *   node scripts/import-images.mjs "C:\Downloads\lisas" "Lisa" 22.90
 *   node scripts/import-images.mjs "C:\Downloads\xadrez-detalhado" "Xadrez Detalhado" 29.99
 */

import { readdir, readFile } from 'fs/promises'
import path from 'path'

const SUPABASE_URL = 'https://jfayxhqgntipfwbfusfw.supabase.co'
const SERVICE_ROLE_KEY = 'sb_secret_d7_GOxTA-32YIqkOqmRxsg_t5aVL3RJ'
const BUCKET = 'product-images'

async function apiJSON(apiPath, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${apiPath}`, {
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
  if (!res.ok) throw new Error(`${res.status}: ${body}`)
  return body ? JSON.parse(body) : null
}

async function uploadImage(storagePath, buffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buffer,
  })
  if (!res.ok) throw new Error(`Upload falhou ${storagePath}: ${await res.text()}`)
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`
}

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 3) {
    console.error('Uso: node scripts/import-images.mjs <pasta> <nome-modelo> <preco>')
    process.exit(1)
  }

  const folderPath = args[0]
  const modeloName = args.slice(1, -1).join(' ')
  const price = parseFloat(args[args.length - 1])

  if (isNaN(price)) { console.error('Preço inválido'); process.exit(1) }

  const cats = await apiJSON('categories?select=id,slug')
  const catId = cats.find(c => c.slug === 'gravatas')?.id
  if (!catId) throw new Error('Categoria "gravatas" não encontrada')

  const files = (await readdir(folderPath))
    .filter(f => /\.(jpe?g|png)$/i.test(f))
    .sort()

  const slug = toSlug(modeloName)

  console.log(`\nImportando gravatas: ${modeloName}`)
  console.log(`Preço: R$ ${price.toFixed(2)} | Slug: ${slug}`)
  console.log(`Imagens encontradas: ${files.length}\n`)

  let ok = 0, fail = 0

  // batch product inserts to reduce API calls
  const batch = []

  for (let i = 0; i < files.length; i++) {
    const num = String(i + 1).padStart(3, '0')
    const storagePath = `gravatas/${slug}/${num}.jpg`
    const productName = `Gravata ${modeloName} ${num}`

    try {
      const buf = await readFile(path.join(folderPath, files[i]))
      const imageUrl = await uploadImage(storagePath, buf)
      batch.push({
        name: productName,
        description: `Modelo: ${modeloName}`,
        price,
        category_id: catId,
        images: [imageUrl],
        active: true,
      })
      process.stdout.write(`\r  Uploaded ${i + 1}/${files.length}`)
    } catch (err) {
      fail++
      console.error(`\n[${num}] ✗ ${err.message}`)
    }
  }

  // insert all products at once
  console.log(`\n\nCriando ${batch.length} produtos no banco...`)
  try {
    await apiJSON('products', {
      method: 'POST',
      body: JSON.stringify(batch),
    })
    ok = batch.length
    console.log(`✓ ${ok} produtos criados`)
  } catch (err) {
    // fallback: insert one by one
    console.error('Batch falhou, tentando um a um...')
    for (const product of batch) {
      try {
        await apiJSON('products', { method: 'POST', body: JSON.stringify(product) })
        ok++
      } catch (e2) {
        fail++
        console.error(`✗ ${product.name}: ${e2.message}`)
      }
    }
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Produtos criados : ${ok}`)
  console.log(`Falhas           : ${fail}`)
}

main().catch(err => { console.error('\nErro fatal:', err.message); process.exit(1) })
