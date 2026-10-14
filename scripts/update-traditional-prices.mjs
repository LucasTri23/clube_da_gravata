// Prévia: node scripts/update-traditional-prices.mjs
// Aplicar: node scripts/update-traditional-prices.mjs --apply
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile } from 'node:fs/promises'

config({ path: new URL('../.env.local', import.meta.url), quiet: true })
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) throw new Error('Credenciais do Supabase ausentes no .env.local')
const supabase = createClient(url, key, { auth: { persistSession: false } })
const price = 33.90

const { data: category, error: categoryError } = await supabase
  .from('categories').select('id').eq('slug', 'gravatas').single()
if (categoryError) throw categoryError
const { data: products, error } = await supabase.from('products')
  .select('id,name,price').eq('category_id', category.id)
  .like('name', 'Gravata Tradicional 7,5cm %')
if (error) throw error
if (!products.length) throw new Error('Nenhuma gravata tradicional encontrada')
const changes = products.filter(product => Number(product.price) !== price)
console.log(`${products.length} tradicionais encontradas; ${changes.length} ajustes para R$ 33,90.`)

if (process.argv.includes('--apply') && changes.length) {
  const backupFolder = new URL('../.local/catalog-backups/', import.meta.url)
  await mkdir(backupFolder, { recursive: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  await writeFile(new URL(`tradicionais-${timestamp}.json`, backupFolder),
    JSON.stringify({ timestamp, newPrice: price, products: changes }, null, 2))
  const { data: updated, error: updateError } = await supabase.from('products')
    .update({ price }).in('id', changes.map(product => product.id)).select('id,price')
  if (updateError) throw updateError
  if (updated.length !== changes.length || updated.some(product => Number(product.price) !== price)) {
    throw new Error('A atualização não retornou todos os produtos com o preço esperado')
  }
  console.log(`${updated.length} preços atualizados. Valores anteriores salvos em .local/catalog-backups.`)
} else if (changes.length) {
  console.log('Prévia sem alterações. Use --apply para aplicar.')
}

const { data: verified, error: verifyError } = await supabase.from('products')
  .select('id,price').in('id', products.map(product => product.id))
if (verifyError) throw verifyError
if (process.argv.includes('--apply') &&
    (verified.length !== products.length || verified.some(product => Number(product.price) !== price))) {
  throw new Error('A conferência final encontrou preços divergentes')
}
console.log(`Conferência: ${verified.length} produtos; preços: ${[...new Set(verified.map(product => product.price))].join(', ')}.`)
