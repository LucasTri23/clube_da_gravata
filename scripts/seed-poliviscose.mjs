// Seed dos ternos Poliviscose (79 páginas do catálogo POLIVISCOSE)
// Execute: node scripts/seed-poliviscose.mjs

const SUPABASE_URL = 'https://jfayxhqgntipfwbfusfw.supabase.co'
const SERVICE_ROLE_KEY = 'sb_secret_d7_GOxTA-32YIqkOqmRxsg_t5aVL3RJ'

const PRODUCTS = [
  // ── STRETCH DETALHADO ────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Stretch Detalhado - Cinza Intenso 3863', description: 'Tamanhos disponíveis: 42/44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Detalhado - Bege Rizal 2623', description: 'Tamanhos disponíveis: 42/44/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Detalhado - Bear 3860', description: 'Tamanhos disponíveis: 46/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Detalhado - Cosmic Blue 3857', description: 'Tamanhos disponíveis: 42/44/58/60/62/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Detalhado - Homus 3866', description: 'Tamanhos disponíveis: 44/60/64/66 | Via do Terno', category_slug: 'ternos' },

  // ── STRETCH DETALHADO — MAGNETO ───────────────────────────────────────────────
  { name: 'Terno Poliviscose Stretch Detalhado - Magneto 2617', description: 'Tamanhos disponíveis: 42 | Via do Terno', category_slug: 'ternos' },

  // ── ANTUERPIA XADREZ ─────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuerpia Xadrez - Chumbo 169', description: 'Tamanhos disponíveis: 46/62 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Light Gray 1830', description: 'Tamanhos disponíveis: 42/44/46/62/64/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Areia 343', description: 'Tamanhos disponíveis: 42/46 ao 54/60/62/64 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Blue Mineral 1827', description: 'Tamanhos disponíveis: 42/44/46/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Azul Marinho 178', description: 'Tamanhos disponíveis: 44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Cinza 109022', description: 'Tamanhos disponíveis: 44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Prata 346', description: 'Tamanhos disponíveis: 42 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Denim 000337', description: 'Tamanhos disponíveis: 42/44/62 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Chumbo 1821', description: 'Tamanhos disponíveis: 42/44/46/62 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Cinza 319', description: 'Tamanhos disponíveis: 42/46 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - 161011', description: 'Tamanhos disponíveis: 42/44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Cinza 3937', description: 'Tamanhos disponíveis: 42/44/46/50 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Xadrez - Bege Palha 1818', description: 'Tamanhos disponíveis: 42 ao 58/62/66 | Via do Terno', category_slug: 'ternos' },

  // ── STRETCH FOSCO ────────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Stretch Fosco - Kaki 3714', description: 'Tamanhos disponíveis: 42/44/46/58/60/62/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Preto 3711', description: 'Tamanhos disponíveis: 44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Bege 3708', description: 'Tamanhos disponíveis: 58/60/64/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Cactus 2237', description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Chumbo 3705', description: 'Tamanhos disponíveis: 42/44/46 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Prata 3699', description: 'Tamanhos disponíveis: 42/44/56 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Cinza 3869', description: 'Tamanhos disponíveis: 42/44/56 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Bege 3872', description: 'Tamanhos disponíveis: 42/44/54 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Fosco - Night Sky 3702', description: 'Tamanhos disponíveis: 42/44/62 | Via do Terno', category_slug: 'ternos' },

  // ── STRETCH ANTUERPIA LONDON NOBLE ───────────────────────────────────────────
  { name: 'Terno Poliviscose Stretch Antuerpia London Noble - Azul 004192', description: 'Tamanhos disponíveis: 42 | Via do Terno', category_slug: 'ternos' },

  // ── FESTA / BRILHANTE ────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Festa Antuerpia Prime Brilhante - Preto 4439', description: 'Tamanhos disponíveis: 42/44/48/52 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Festa Premium Brilhante - Granizo 3452', description: 'Tamanhos disponíveis: 44 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Festa Premium Brilhante - Preto 3449', description: 'Tamanhos disponíveis: 58 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuérpia Brilhante - Navy 2684', description: 'Tamanhos disponíveis: 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Prime Brilhante - Granizo 1987', description: 'Tamanhos disponíveis: 42/54 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Prime Brilhante - Navy 1996', description: 'Tamanhos disponíveis: 58/62/66 | Via do Terno', category_slug: 'ternos' },

  // ── FIRENZE LUCENTE ──────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Firenze Lucente - Preto Brilhante 3350', description: 'Tamanhos disponíveis: 66 | Tradição italiana. Brilho sutil. Alfaiataria moderna | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Firenze Lucente - Blue 3347', description: 'Tamanhos disponíveis: 42/44/52/60/64 | Tradição italiana. Brilho sutil | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Firenze Lucente - Azul 3341', description: 'Tamanhos disponíveis: 44/58/60/62/64 | Tradição italiana. Brilho sutil | Via do Terno', category_slug: 'ternos' },

  // ── ANTUERPIA ENCERADO / SEMI ENCERADO ───────────────────────────────────────
  { name: 'Terno Poliviscose Antuerpia Encerado - Azul Denim 3834', description: 'Tamanhos disponíveis: 62/64 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuépia Semi Encerado - Cinza 4201', description: 'Tamanhos disponíveis: 42/44/46/54/56/58/60/62/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Semi Encerado - Azul 3827', description: 'Tamanhos disponíveis: 42/44/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Semi Encerado - Azul 3946', description: 'Tamanhos disponíveis: 42/44/54/56/58/60/62/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Semi Encerado - Cinza 3824', description: 'Tamanhos disponíveis: 42/44/62/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Semi Encerado - 152011', description: 'Tamanhos disponíveis: 42/44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Semi Encerado - Steel 3830', description: 'Tamanhos disponíveis: 42/44 | Via do Terno', category_slug: 'ternos' },

  // ── PADRÃO LISO / XADREZ ─────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Padrão Liso - Azul Royal 780101', description: 'Tamanhos disponíveis: 42/44/58/62/64/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrão Xadrez - Cinza 3461', description: 'Tamanhos disponíveis: 42/44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrão Xadrez - Grafite 383', description: 'Tamanhos disponíveis: 42/44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrão Xadrez - Cinza 2249', description: 'Tamanhos disponíveis: 42/44/58/62/64/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrão Xadrez - 380', description: 'Tamanhos disponíveis: 42/44/62/64/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrao Xadrez - Chumbo 463', description: 'Tamanhos disponíveis: 44 | Via do Terno', category_slug: 'ternos' },

  // ── FIRENZE QUADRI ───────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Firenze Quadri - Black 3464', description: 'Tamanhos disponíveis: 42/44/46 | Tradição italiana. Xadrez sutil | Via do Terno', category_slug: 'ternos' },

  // ── ANTUERPIA DETALHADO ───────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuerpia Detalhado - 161061', description: 'Tamanhos disponíveis: 42 | Via do Terno', category_slug: 'ternos' },

  // ── ANTUERPIA LONDON NOBLE ────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuerpia London Noble - Cinza 004189', description: 'Tamanhos disponíveis: 42/44/46/56/58/62 | Via do Terno', category_slug: 'ternos' },

  // ── ANTUÉRPIA FOSCO ───────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuérpia Fosco - Cinza 3943', description: 'Tamanhos disponíveis: 42/44/50/52/54/56/58/60/62/64/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuérpia Fosco - Marrom 3940', description: 'Tamanhos disponíveis: 62/64 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Fosco - Preto 4207', description: 'Tamanhos disponíveis: 42/44/46/52/54/56/58/60/62/64/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuérpia Fosco - Bege 2675', description: 'Tamanhos disponíveis: 44/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Fosco - Kraft 786', description: 'Tamanhos disponíveis: 44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Fosco - Preto 3821', description: 'Tamanhos disponíveis: 42/44 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Liso - Chumbo 352', description: 'Tamanhos disponíveis: 42 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia - 162', description: 'Tamanhos disponíveis: 44 | Via do Terno', category_slug: 'ternos' },

  // ── TERRA COTA ────────────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Terra Cota 644', description: 'Tamanhos disponíveis: 42/62/64/66 | Via do Terno', category_slug: 'ternos' },

  // ── ANTUERPIA PRIME LONDON NOBLE ─────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuerpia Prime London Noble - Branco 4270', description: 'Tamanhos disponíveis: 42/46/58/60/66 | Meridian Collection | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Prime London Noble - Marinho 4433', description: 'Tamanhos disponíveis: 42/44/58 ao 66 | Meridian Collection | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Prime London Noble - Cinza 4436', description: 'Tamanhos disponíveis: 42/46/58/60/62/66 | Via do Terno', category_slug: 'ternos' },

  // ── STRETCH ANTUÉPIA PRIME FOSCO ─────────────────────────────────────────────
  { name: 'Terno Poliviscose Stretch Antuépia Prime Fosco - Spray 2452', description: 'Tamanhos disponíveis: 44/50/56 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Antuerpia Prime Fosco - Homus 4218', description: 'Tamanhos disponíveis: 42/44/46/50 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Antuerpia Prime Fosco - Preto 4212', description: 'Tamanhos disponíveis: 42 ao 48/52/56 ao 64 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Stretch Antuerpia Prime Fosco - Marinho 4221', description: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno', category_slug: 'ternos' },

  // ── ANTUERPIA PRIME SEMI ENCERADO ────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuerpia Prime Semi Encerado - Azul 4252', description: 'Tamanhos disponíveis: 42 ao 48/52 ao 66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia Prime Semi Encerado - Steel Gray 4258', description: 'Tamanhos disponíveis: 42/46 ao 50/54 ao 58/62/66 | Via do Terno', category_slug: 'ternos' },

  // ── ANTUÉRPIA COM REGULAGEM ───────────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuérpia com Regulagem Encerado - Chumbo 3845', description: 'Tamanhos disponíveis: 42/44/60/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Antuerpia com Regulagem - Azul Shine 3848', description: 'Tamanhos disponíveis: 44/56/58/60/62 | Via do Terno', category_slug: 'ternos' },

  // ── ANTUERPIA PRIME FOSCO ─────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Antuerpia Prime Fosco - Preto 4261', description: 'Tamanhos disponíveis: 42 ao 62/66 | Via do Terno', category_slug: 'ternos' },

  // ── PADRÃO FOSCO ─────────────────────────────────────────────────────────────
  { name: 'Terno Poliviscose Padrão Fosco - Azul Royal Escuro 1001', description: 'Tamanhos disponíveis: 58/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrao Fosco - Cinza 454', description: 'Tamanhos disponíveis: 42/62/64 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrao Fosco - Chumbo 998', description: 'Tamanhos disponíveis: 44/62/66 | Via do Terno', category_slug: 'ternos' },
  { name: 'Terno Poliviscose Padrao Fosco - Terracota 1702', description: 'Tamanhos disponíveis: 44/64/66 | Via do Terno', category_slug: 'ternos' },
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
  console.log('\nTodos os catálogos foram processados! Acesse /admin/produtos para adicionar preços e imagens.')
}

main().catch(err => {
  console.error('\nErro fatal:', err.message)
  process.exit(1)
})
