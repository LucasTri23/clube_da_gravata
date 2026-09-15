// Seed dos ternos Microfibra (80 páginas do catálogo MICROFIBRA)
// Execute: node scripts/seed-microfibra.mjs

const SUPABASE_URL = 'https://jfayxhqgntipfwbfusfw.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (ex: node --env-file=.env scripts/seed-microfibra.mjs)')
  process.exit(1)
}

const PRODUCTS = [
  // ── STRETCH LISO ─────────────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Stretch Liso - Branco 3655',
    description: 'Tamanhos disponíveis: 42/52/56 ao 62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Branco 3589',
    description: 'Tamanhos disponíveis: 44/58/60 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Cinza 1313',
    description: 'Tamanhos disponíveis: 44/58/60 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Asphalt 3761',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Asphalt 3658',
    description: 'Tamanhos disponíveis: 42 ao 56/60 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Asphalt 3580',
    description: 'Tamanhos disponíveis: 42 ao 46/58 ao 64 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Asphalt 2514',
    description: 'Tamanhos disponíveis: 42/44 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Preto 3770',
    description: 'Tamanhos disponíveis: 56/60 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — AZUIS ───────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Dark Blue 3677',
    description: 'Tamanhos disponíveis: 42/44/52/54/58 ao 62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Blue 3604',
    description: 'Tamanhos disponíveis: 44/60 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Navy 2824',
    description: 'Tamanhos disponíveis: 42 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Azul 3437',
    description: 'Tamanhos disponíveis: 44 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Azul 3306',
    description: 'Tamanhos disponíveis: 44/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Azul 3262',
    description: 'Tamanhos disponíveis: 44/60 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — GRAFITE / CINZA ────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Grafite 3431',
    description: 'Tamanhos disponíveis: 42/44/60 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Grafite 3198',
    description: 'Tamanhos disponíveis: 42/44 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Grafite 2690',
    description: 'Tamanhos disponíveis: 42 ao 46 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Cinza Claro MF 4424',
    description: 'Tamanhos disponíveis: 42/44/54 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Cinza 3683',
    description: 'Tamanhos disponíveis: 42/44/46 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Grafite 153012',
    description: 'Tamanhos disponíveis: 44/46 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — CHUMBO ─────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Chumbo 3680',
    description: 'Tamanhos disponíveis: 42/44/48 ao 54/58/60/62/64 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — PRETO / BLACK JET ──────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Preto MF 1274',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Black Jet 004015',
    description: 'Tamanhos disponíveis: 44/52/54/58 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Black Jet 3897',
    description: 'Tamanhos disponíveis: 62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Black Jet 3674',
    description: 'Tamanhos disponíveis: 44/50 ao 64 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrao Liso - Black Jet 3979',
    description: 'Tamanhos disponíveis: 42 ao 60 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Preto 3607',
    description: 'Tamanhos disponíveis: 44/50/52/58/60/62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Preto 3253',
    description: 'Tamanhos disponíveis: 52/60 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO XADREZ ────────────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Xadrez - Marinho 2709',
    description: 'Tamanhos disponíveis: 42/44 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Xadrez - Chumbo 1944',
    description: 'Tamanhos disponíveis: 42/44/46 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — CINZA CLARO / PRATA ────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Cinza Claro MF 4427',
    description: 'Tamanhos disponíveis: 42/50/56 ao 62/66 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — BEGE / AREIA ───────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Bege 3191',
    description: 'Tamanhos disponíveis: 42/62 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO MELANGE ───────────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Melange - Bege 3562',
    description: 'Tamanhos disponíveis: 42/58 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Melange - Azul Índigo 3315',
    description: 'Tamanhos disponíveis: 62/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Melange - Cinza 2809',
    description: 'Tamanhos disponíveis: 62 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — GRAFITE MELANGE ────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Grafite 002718',
    description: 'Tamanhos disponíveis: 44 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── STRETCH MESCLA ───────────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Stretch Mescla - Preto 4454',
    description: 'Tamanhos disponíveis: 44 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO DETALHADO ─────────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Detalhado - Azul 004009',
    description: 'Tamanhos disponíveis: 42/58/62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Detalhado - Azul 4415',
    description: 'Tamanhos disponíveis: 44/46/48/58 | Meridian Collection | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Detalhado - Chumbo 004460',
    description: 'Tamanhos disponíveis: 42/44/52 ao 58 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — PRATA ──────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Prata 4571',
    description: 'Tamanhos disponíveis: 48/52/54/56 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Prata 4291',
    description: 'Tamanhos disponíveis: 42/54/56/58/62/64 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrao Liso - Prata 004006',
    description: 'Tamanhos disponíveis: 42/52/58/60/62/64/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Prata 3169',
    description: 'Tamanhos disponíveis: 42 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Cinza Claro MF 3885',
    description: 'Tamanhos disponíveis: 42/44/46/50/52/54/56/62 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — BRANCO ─────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrao Liso - Branco 3577',
    description: 'Tamanhos disponíveis: 42/44/52/58/62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Branco 003976',
    description: 'Tamanhos disponíveis: 42/44/52/54/56/58/60 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — CHUMBO (mais modelos) ──────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Chumbo 004021',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Chumbo 3891',
    description: 'Tamanhos disponíveis: 42 ao 62/66 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — CINZA / TITÂNIO ────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Cinza 3790',
    description: 'Tamanhos disponíveis: 42/44/46/58/60/62/64/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Titânio 3312',
    description: 'Tamanhos disponíveis: 46/60/62/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Titânio 3256',
    description: 'Tamanhos disponíveis: 46/54/56/60/62 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PREMIUM / FIRENZE ────────────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Premium Firenze Check - Aço 3894',
    description: 'Tamanhos disponíveis: 42/44/60 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Premium Encerado - Areia 3601',
    description: 'Tamanhos disponíveis: 44/46/60 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Firenze Quadri - Kaky 4003',
    description: 'Tamanhos disponíveis: 42/44 | Tradição italiana, xadrez sutil | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Cinza Claro MF 4294',
    description: 'Tamanhos disponíveis: 42/44/56/58/60/62/64/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Firenze Quadri - Navy 4000',
    description: 'Tamanhos disponíveis: 42/44/52/66 | Tradição italiana, xadrez sutil | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Azul Marinho 4503',
    description: 'Tamanhos disponíveis: 42 ao 54 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Firenze Quadri - Cinza 3997',
    description: 'Tamanhos disponíveis: 44/56/60/66 | Tradição italiana, xadrez sutil | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Firenze Quadri - Chumbo 3994',
    description: 'Tamanhos disponíveis: 44/66 | Tradição italiana, xadrez sutil | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Escuro MF 4297',
    description: 'Tamanhos disponíveis: 44/52/56/58/62 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── IMPERMEÁVEL / ESPECIAIS ───────────────────────────────────────────────────
  {
    name: 'Terno Microfibra WR Impermeável - Preto 937',
    description: 'Tamanhos disponíveis: 42/44 | Impermeável | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch - Azul 541',
    description: 'Tamanhos disponíveis: 44 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── STRETCH LISO — CORES ESPECIAIS ───────────────────────────────────────────
  {
    name: 'Terno Microfibra Stretch Liso - Verde 4386',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Areia 3776',
    description: 'Tamanhos disponíveis: 42/56/60/62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Areia 3646',
    description: 'Tamanhos disponíveis: 56/58/60/62 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Vinho 3764',
    description: 'Tamanhos disponíveis: 42/50/58/62/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Astral 4383',
    description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Astral 3773',
    description: 'Tamanhos disponíveis: 44/52 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Astral 3652',
    description: 'Tamanhos disponíveis: 44/62/64/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Cinza 3643',
    description: 'Tamanhos disponíveis: 42/44/46/58/60 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Cinza 3586',
    description: 'Tamanhos disponíveis: 62/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Stretch Liso - Cinza 2758',
    description: 'Tamanhos disponíveis: 42/62/64/66 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — CAQUI / CORES NATURAIS ─────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Caqui 3686',
    description: 'Tamanhos disponíveis: 42/44/54 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Caqui 3440',
    description: 'Tamanhos disponíveis: 42/44/58 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Homus 4430',
    description: 'Tamanhos disponíveis: 42/52 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrao Liso - Verde Sálvia 1330',
    description: 'Tamanhos disponíveis: 42/44/52 ao 66 | Via do Terno',
    category_slug: 'ternos',
  },

  // ── PADRÃO LISO — DARK BLUE ──────────────────────────────────────────────────
  {
    name: 'Terno Microfibra Padrão Liso - Dark Blue 3879',
    description: 'Tamanhos disponíveis: 42/44/54/60/62/66 | Via do Terno',
    category_slug: 'ternos',
  },
  {
    name: 'Terno Microfibra Padrão Liso - Dark Blue 4018',
    description: 'Tamanhos disponíveis: 42 ao 52/58/62 | Via do Terno',
    category_slug: 'ternos',
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

  const categories = await api('categories?select=id,slug')
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]))
  console.log('Categorias encontradas:', Object.keys(catMap).join(', '), '\n')

  let ok = 0
  let fail = 0

  for (const p of PRODUCTS) {
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
  process.exit(1)
})
