// Seed dos primeiros depoimentos de clientes.
// Requer que a migration 002_testimonials.sql já tenha sido executada
// no Supabase SQL Editor, e que o bucket "testimonial-images" exista (público).
//   node scripts/seed-testimonials.mjs

import { readFile } from 'fs/promises'
import path from 'path'

const SUPABASE_URL = 'https://jfayxhqgntipfwbfusfw.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (ex: node --env-file=.env scripts/seed-testimonials.mjs)')
  process.exit(1)
}
const BUCKET = 'testimonial-images'

const TESTIMONIALS = [
  {
    client_name: 'Henrique',
    feedback:
      'O acabamento do terno superou minhas expectativas. Vestiu muito bem, o tecido é confortável e a modelagem ficou impecável. Com certeza comprarei novamente.',
    photoFile: 'henrique.jpeg',
    order_index: 1,
  },
  {
    client_name: 'Peter',
    feedback:
      'Comprei o kit completo e fiquei impressionado com a qualidade. A combinação do terno, da camisa e da gravata ficou perfeita. Chegou muito bem embalado e exatamente como nas fotos.',
    photoFile: 'peter.jpeg',
    order_index: 2,
  },
]

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

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  })
  if (!res.ok) {
    const body = await res.text()
    if (!body.includes('already exists') && !body.includes('Duplicate')) {
      console.warn(`Aviso ao criar bucket "${BUCKET}": ${res.status} ${body}`)
    }
  } else {
    console.log(`Bucket "${BUCKET}" criado.`)
  }
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

async function main() {
  console.log('Conectando ao Supabase...\n')
  await ensureBucket()

  let ok = 0
  let fail = 0

  for (const t of TESTIMONIALS) {
    try {
      const buf = await readFile(path.join('client', t.photoFile))
      const storagePath = `testimonials/${t.client_name.toLowerCase()}.jpeg`
      const photo_url = await uploadImage(storagePath, buf)

      await apiJSON('testimonials', {
        method: 'POST',
        body: JSON.stringify({
          client_name: t.client_name,
          feedback: t.feedback,
          photo_url,
          order_index: t.order_index,
          active: true,
        }),
      })
      ok++
      console.log(`✓ ${t.client_name}`)
    } catch (err) {
      fail++
      console.error(`✗ ${t.client_name}: ${err.message}`)
    }
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Depoimentos criados : ${ok}`)
  console.log(`Falhas              : ${fail}`)
}

main().catch(err => {
  console.error('\nErro fatal:', err.message)
  console.error('\nCertifique-se de que rodou o SQL da migration 002_testimonials.sql no Supabase antes de executar este script.')
  process.exit(1)
})
