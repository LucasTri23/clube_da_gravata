// Seed de produtos extraídos dos catálogos PDF
// Execute DEPOIS de rodar o SQL de migração no Supabase:
//   node scripts/seed-products.mjs

const SUPABASE_URL = 'https://jfayxhqgntipfwbfusfw.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (ex: node --env-file=.env scripts/seed-products.mjs)')
  process.exit(1)
}

const PRODUCTS = [
  // ── TERNOS MASCULINOS (ELASTOMULTIÉSTER) ────────────────────────────────
  {
    name: 'Terno Primefit Elastomultiéster - Homus 3417',
    description: 'Tamanhos disponíveis: 44 46 60 62 | Antuérpia Prime Regulagem Fosco | Coleção Estação Real',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Primefit Elastomultiéster - Marinho 3414',
    description: 'Tamanhos disponíveis: 42 46 60 66 | Antuérpia Prime Regulagem Fosco | Coleção Estação Real',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Primefit Elastomultiéster - Cinza Médio 3411',
    description: 'Tamanhos disponíveis: 44 64 66 | Antuérpia Prime Regulagem Fosco | Coleção Estação Real',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Primefit Elastomultiéster - Preto 3405',
    description: 'Tamanhos disponíveis: 64 | Antuérpia Prime Regulagem Fosco | Coleção Estação Real',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Elastomultiéster Prime Fosco - Homus 4164',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Elastomultiéster Prime Fosco - Militar 4170',
    description: 'Tamanhos disponíveis: 42 ao 66 | Meridian Collection | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Elastomultiéster Prime Fosco - Marinho 4161',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Elastomultiéster Prime Fosco - Chocolate 4167',
    description: 'Tamanhos disponíveis: 42 44 46 48 54 56 58 60 | Meridian Collection | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Elastomultiéster Prime Fosco - Cinza 4158',
    description: 'Tamanhos disponíveis: 44 46 48 52 54 56 58 60 62 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Elastomultiéster Prime Fosco - Chumbo 4155',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Elastomultiéster Prime Fosco - Preto 4152',
    description: 'Tamanhos disponíveis: 42 44 48 50 52 54 56 58 62 64 66 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── FEMININO (WOMAN COLLECTION) ──────────────────────────────────────────
  {
    name: 'Terno Feminino Gabrielle - Azul Íris',
    description: 'Tamanhos disponíveis: 36/40 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Giz 3506',
    description: 'Tamanhos disponíveis: 36/38/40/42/46/50/52/54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Preto 3488',
    description: 'Tamanhos disponíveis: 38/48/52 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Gabrielle - Preto',
    description: 'Tamanhos disponíveis: 36/40 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Purple 3509',
    description: 'Tamanhos disponíveis: 36 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Calça Gabrielle - Azul Niágara',
    description: 'Tamanhos disponíveis: 36/40/42/44/48 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Marsala 3497',
    description: 'Tamanhos disponíveis: 38 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Marinho 3494',
    description: 'Tamanhos disponíveis: 36/40/42/44/48/50/52/54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Prata 3485',
    description: 'Tamanhos disponíveis: 36/40/42/50/52/54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Avela 3491',
    description: 'Tamanhos disponíveis: 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Blazer Elza - Off White',
    description: 'Tamanhos disponíveis: 50 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Blazer Elza - Prata',
    description: 'Tamanhos disponíveis: 42/52 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Colete Elza - Off White',
    description: 'Tamanhos disponíveis: 44 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Terno Feminino Thays Refinada - Branco 3500',
    description: 'Tamanhos disponíveis: 42/50/52/54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Colete Elza - Marsala',
    description: 'Tamanhos disponíveis: 38/44 ao 52 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Calça Elza - Prata',
    description: 'Tamanhos disponíveis: 36/40 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Calça Elza - Off White',
    description: 'Tamanhos disponíveis: 34 ao 52 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Colete Elza - Homus',
    description: 'Tamanhos disponíveis: 36/42 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Calça Elza - Marsala',
    description: 'Tamanhos disponíveis: 36/38/40/42/46 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Colete Elza - Prata',
    description: 'Tamanhos disponíveis: 36/40/42/44/46/50/54 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Calça Elza - Homus',
    description: 'Tamanhos disponíveis: 36 ao 52 | Woman Collection',
    category_slug: 'feminino',
  },
  {
    name: 'Blazer Elza - Homus',
    description: 'Tamanhos disponíveis: 36/40 ao 54 | Woman Collection',
    category_slug: 'feminino',
  },

  // ── INFANTIL (LINHA KIDS) ─────────────────────────────────────────────────
  {
    name: 'Terno Infantil Fio Indiano - Grafite Xadrez OC 4488',
    description: 'Tamanhos disponíveis: 04 ao 16 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Fio Indiano - Marinho OC 4045',
    description: 'Tamanhos disponíveis: 04 ao 16 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Fio Indiano Padrão Detalhado - Azul 2799',
    description: 'Tamanhos disponíveis: 08 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Fio Indiano - Grafite 2794',
    description: 'Tamanhos disponíveis: 06/08/10/12 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Fio Indiano Padrão Liso - Chumbo 4048',
    description: 'Tamanhos disponíveis: 04 ao 16 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Microfibra Padrão Detalhado - Verde 2396',
    description: 'Tamanhos disponíveis: 04/06/08 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Microfibra Padrão Detalhado - Branco 2390',
    description: 'Tamanhos disponíveis: 04 ao 16 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Microfibra - Verde Militar OC 4039',
    description: 'Tamanhos disponíveis: 04 ao 16 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Microfibra - Grafite Listrado OC 4481',
    description: 'Tamanhos disponíveis: 04 ao 16 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Microfibra Padrão Xadrez - Chumbo 2402',
    description: 'Tamanhos disponíveis: 04/06 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
  {
    name: 'Terno Infantil Microfibra - Grafite OC 4491',
    description: 'Tamanhos disponíveis: 04 ao 16 | Linha Kids | Via do Terno',
    category_slug: 'infantil',
  },
]

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
  return JSON.parse(body)
}

async function main() {
  console.log('Conectando ao Supabase...\n')

  // Garante que as categorias feminino e infantil existem
  const extraCategories = [
    { name: 'Feminino', slug: 'feminino', order_index: 5 },
    { name: 'Infantil', slug: 'infantil', order_index: 6 },
  ]
  for (const cat of extraCategories) {
    await api('categories', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
      body: JSON.stringify(cat),
    }).catch(() => {})
  }

  // Busca todas as categorias
  const categories = await api('categories?select=id,slug')
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]))
  console.log('Categorias encontradas:', Object.keys(catMap).join(', '), '\n')

  let ok = 0
  let fail = 0

  for (const [i, p] of PRODUCTS.entries()) {
    const category_id = catMap[p.category_slug]
    if (!category_id) {
      console.warn(`[SKIP] Categoria "${p.category_slug}" não encontrada — ${p.name}`)
      fail++
      continue
    }
    try {
      await api('products', {
        method: 'POST',
        body: JSON.stringify({
          name: p.name,
          description: p.description ?? null,
          price: 0,
          category_id,
          images: [],
          active: true,
        }),
      })
      ok++
      console.log(`[${ok.toString().padStart(2, '0')}] ✓ ${p.name}`)
    } catch (err) {
      fail++
      console.error(`[ERRO] ${p.name}: ${err.message}`)
    }
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Total inserido : ${ok} produtos`)
  console.log(`Falhas         : ${fail}`)
  console.log('\nAgora acesse /admin/produtos para adicionar os preços e as imagens.')
}

main().catch(err => {
  console.error('\nErro fatal:', err.message)
  console.error('\nCertifique-se de que rodou o SQL de migração no Supabase antes de executar este script.')
  process.exit(1)
})
