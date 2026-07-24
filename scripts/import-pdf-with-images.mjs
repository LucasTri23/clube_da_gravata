/**
 * Importa um catálogo PDF: renderiza cada página como JPEG,
 * sobe ao Supabase Storage e cria os produtos com fotos e preço.
 *
 * Uso:
 *   node scripts/import-pdf-with-images.mjs <caminho-pdf> <tipo-catalogo> <preco>
 *
 * Tipos disponíveis: elastomultiester | infantil | microfibra | poliviscose | feminino
 *
 * Exemplos:
 *   node scripts/import-pdf-with-images.mjs "C:\Downloads\ELASTOMULTIESTER (2).pdf" elastomultiester 719.90
 *   node scripts/import-pdf-with-images.mjs "C:\Downloads\INFANTIL (6).pdf" infantil 450.00
 */

import { createCanvas } from '@napi-rs/canvas'
import { readFile } from 'fs/promises'

const SUPABASE_URL = 'https://jfayxhqgntipfwbfusfw.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_ROLE_KEY) {
  console.error('Defina SUPABASE_SERVICE_ROLE_KEY (ex: node --env-file=.env scripts/import-pdf-with-images.mjs)')
  process.exit(1)
}
const BUCKET = 'product-images'

// ── MAPEAMENTOS: página do PDF → produto ─────────────────────────────────────
const CATALOGS = {
  // Catálogo "ELASTOMULTIESTER 20-07.pdf" — transcrito manualmente das 14 páginas.
  // Todas as páginas trazem selo de tamanhos + código de produto próprio, ou
  // seja, todas as 14 são produtos distintos (nenhuma foto extra/null).
  elastomultiester: {
    category: 'ternos',
    namePattern: 'Elastomultiéster', // usado para apagar produtos antigos deste catálogo antes de reimportar
    // null = foto extra do produto anterior (ambas vão pro mesmo produto)
    pages: [
      { name: 'Terno Elastomultiéster Antuérpia Prime Regulagem Fosco - Homus 3417',       desc: 'Tamanhos disponíveis: 44/46/60/62 | Coleção Estação Real | Via do Terno' },
      { name: 'Terno Elastomultiéster Antuérpia Prime Regulagem Fosco - Marinho 3414',     desc: 'Tamanhos disponíveis: 42/46/60/66 | Coleção Estação Real | Via do Terno' },
      { name: 'Terno Elastomultiéster Antuérpia Prime Regulagem Fosco - Cinza Médio 3411', desc: 'Tamanhos disponíveis: 64/66 | Coleção Estação Real | Via do Terno' },
      { name: 'Terno Elastomultiéster Antuérpia Prime Regulagem Fosco - Preto 3405',       desc: 'Tamanhos disponíveis: 64 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Preto 4152',       desc: 'Tamanhos disponíveis: 42/44/48/58/60/62/64/66 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Cinza 4158',       desc: 'Tamanhos disponíveis: 44/48/54/56/58/60/62/66 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Chocolate 4359',   desc: 'Tamanhos disponíveis: 42/44/62/64/66 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Militar 4362',     desc: 'Tamanhos disponíveis: 42/44/50/52/54/56/58/60/64/66 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Homus 4356',       desc: 'Tamanhos disponíveis: 42/44/46/50 ao 66 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Homus 4164',       desc: 'Tamanhos disponíveis: 42/44/46/50/52/58/60 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Cinza Médio 4350', desc: 'Tamanhos disponíveis: 42 ao 64 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Chumbo 4347',      desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Chumbo 4155',      desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Elastomultiéster Prime Fosco - Preto 4344',       desc: 'Tamanhos disponíveis: 42/44/46/50/52/54/56/60/62/64/66 | Via do Terno' },
    ],
  },

  infantil: {
    category: 'infantil',
    pages: [
      { name: 'Terno Infantil Fio Indiano - Grafite Xadrez OC 4488',          desc: 'Tamanhos: 04 ao 16 | Fio Indiano | Linha Kids' },
      { name: 'Terno Infantil Fio Indiano - Marinho OC 4045',                 desc: 'Tamanhos: 04 ao 16 | Fio Indiano | Linha Kids' },
      { name: 'Terno Infantil Fio Indiano Padrão Detalhado - Azul 2799',      desc: 'Tamanhos: 08 | Fio Indiano | Linha Kids' },
      { name: 'Terno Infantil Fio Indiano - Grafite 2794',                    desc: 'Tamanhos: 06/08/10/12 | Fio Indiano | Linha Kids' },
      { name: 'Terno Infantil Fio Indiano Padrão Liso - Chumbo 4048',         desc: 'Tamanhos: 04 ao 16 | Fio Indiano | Linha Kids' },
      { name: 'Terno Infantil Microfibra Padrão Detalhado - Verde 2396',      desc: 'Tamanhos: 04/06/08 | Microfibra | Linha Kids' },
      { name: 'Terno Infantil Microfibra Padrão Detalhado - Branco 2390',     desc: 'Tamanhos: 04 ao 16 | Microfibra | Linha Kids' },
      { name: 'Terno Infantil Microfibra - Verde Militar OC 4039',            desc: 'Tamanhos: 04 ao 16 | Microfibra | Linha Kids' },
      { name: 'Terno Infantil Microfibra - Grafite Listrado OC 4481',         desc: 'Tamanhos: 04 ao 16 | Microfibra | Linha Kids' },
      { name: 'Terno Infantil Microfibra Padrão Xadrez - Chumbo 2402',       desc: 'Tamanhos: 04/06 | Microfibra | Linha Kids' },
      { name: 'Terno Infantil Microfibra - Grafite OC 4491',                  desc: 'Tamanhos: 04 ao 16 | Microfibra | Linha Kids' },
    ],
  },

  // Catálogo "MICROFIBRA 23-07.pdf" — transcrito manualmente das 77 páginas.
  // Páginas 58 e 69 são fotos extras de um produto já visto (mesmo código), por
  // isso viram `null` (foto extra, ver lógica de pendingImages abaixo).
  microfibra: {
    category: 'ternos',
    namePattern: 'Microfibra',
    pages: [
      { name: 'Terno Microfibra Stretch Liso - Vinho 3764',                desc: 'Tamanhos disponíveis: 42/62/66 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Areia 3646',                desc: 'Tamanhos disponíveis: 56/58/60/62 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Areia 3592',                desc: 'Tamanhos disponíveis: 58 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Bege 3056',                 desc: 'Tamanhos disponíveis: 62 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Astral 3652',               desc: 'Tamanhos disponíveis: 62/64/66 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Astral 3773',               desc: 'Tamanhos disponíveis: 42/44/58/60/62/64/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Detalhado - Chumbo 004460',         desc: 'Tamanhos disponíveis: 54/56/58/62/64/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Detalhado - Branco 4285',           desc: 'Tamanhos disponíveis: 52/54/56 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Xadrez - Marinho 002709',           desc: 'Tamanhos disponíveis: 42/44/58 | Coleção Estação Real | Via do Terno' },
      { name: 'Terno Microfibra Padrão Xadrez - Cinza 4427',               desc: 'Tamanhos disponíveis: 42/60/62/64/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Melange - Bege 2812',               desc: 'Tamanhos disponíveis: 60/62/64 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Xadrez - Aço 2712',                 desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Microfibra Premium Firenze Check - Aço 3894',         desc: 'Tamanhos disponíveis: 42/44/60 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Bege 3191',                  desc: 'Tamanhos disponíveis: 42/44/58/62 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Melange - Cinza 749',               desc: 'Tamanhos disponíveis: 58 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Mescla - Preto 4454',              desc: 'Tamanhos disponíveis: 42/44/52/54/56/58/60 | Via do Terno' },
      { name: 'Terno Microfibra Firenze Quadri - Marinho 4503',            desc: 'Tamanhos disponíveis: 42/44/56 ao 66 | Tradição italiana. Xadrez sutil. Alfaiataria moderna. | Via do Terno' },
      { name: 'Terno Microfibra Premium Encerado - Areia 3601',            desc: 'Tamanhos disponíveis: 44/46/48/56 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Firenze Quadri - Kaki 4294',               desc: 'Tamanhos disponíveis: 42/56/58/62/64/66 | Tradição italiana. Xadrez sutil. Alfaiataria moderna. | Via do Terno' },
      { name: 'Terno Microfibra Firenze Quadri - Navy 4565',               desc: 'Tamanhos disponíveis: 42/56 ao 66 | Tradição italiana. Xadrez sutil. Alfaiataria moderna. | Via do Terno' },
      { name: 'Terno Microfibra Firenze Quadri - Chumbo 4297',             desc: 'Tamanhos disponíveis: 44/62 | Tradição italiana. Xadrez sutil. Alfaiataria moderna. | Via do Terno' },
      { name: 'Terno Microfibra Firenze Quadri - Chumbo 3994',             desc: 'Tamanhos disponíveis: 44 | Tradição italiana. Xadrez sutil. Alfaiataria moderna. | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Cinza 3586',                desc: 'Tamanhos disponíveis: 62/66 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Cinza 3643',                desc: 'Tamanhos disponíveis: 42/44/56/58 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Asphalt 3761',              desc: 'Tamanhos disponíveis: 42 ao 62/66 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Cinza 2758',                desc: 'Tamanhos disponíveis: 42/62/64 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Branco 3655',               desc: 'Tamanhos disponíveis: 42/52/58/60 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Branco 3589',               desc: 'Tamanhos disponíveis: 44/58/60 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Preto 3583',                desc: 'Tamanhos disponíveis: 56/60 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Asphalt 3658',              desc: 'Tamanhos disponíveis: 42 ao 52/56/60 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Asphalt 3580',              desc: 'Tamanhos disponíveis: 42/44/46/58/60/62 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Asphalt 2514',              desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Caqui 3440',                 desc: 'Tamanhos disponíveis: 42/44/56 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Stretch Liso - Preto 3770',                desc: 'Tamanhos disponíveis: 56/60 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Branco 3577',                desc: 'Tamanhos disponíveis: 42/44/52/58 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Caqui 3686',                 desc: 'Tamanhos disponíveis: 42/44/54 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Verde Sálvia 1330',          desc: 'Tamanhos disponíveis: 42/44/54 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Areia 3300',                 desc: 'Tamanhos disponíveis: 44/52/56 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Militar',                    desc: 'Tamanhos disponíveis: 42/54/56/62/64/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Homus 4568',                 desc: 'Tamanhos disponíveis: 42/46/52 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - MF 4018',                    desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Midnight 4517',              desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Midnight 4273',              desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Dark Blue 3879',             desc: 'Tamanhos disponíveis: 44/48/54/60/62 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Dark Blue 3677',             desc: 'Tamanhos disponíveis: 42/44/50/52/54/56/62/64 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Navy 4421',                  desc: 'Tamanhos disponíveis: 46/52/54/56/58/60/62/64/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Blue 3604',                  desc: 'Tamanhos disponíveis: 42/44/60/62 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Azul 3262',                  desc: 'Tamanhos disponíveis: 42/44/60/62 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Azul 3437',                  desc: 'Tamanhos disponíveis: 44 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Azul 3306',                  desc: 'Tamanhos disponíveis: 44 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Cinza 4574',                 desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Caramelo 4520',              desc: 'Tamanhos disponíveis: 42/44/52/56/58/60/62 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Grafite 3431',               desc: 'Tamanhos disponíveis: 42/44/46/58/60 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Grafite 2690',               desc: 'Tamanhos disponíveis: 42/44/46 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Cinza 4506',                 desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Grafite 3198',               desc: 'Tamanhos disponíveis: 42/44/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Cinza 3683',                 desc: 'Tamanhos disponíveis: 42/44/58/60/62/64/66 | Via do Terno' },
      null, // foto extra do Grafite 2690 (mesma peça, ângulo diferente)
      { name: 'Terno Microfibra Padrão Liso - Ice 4424',                   desc: 'Tamanhos disponíveis: 56/58/62/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Black Jet 3674',             desc: 'Tamanhos disponíveis: 44/50 ao 64 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Black Jet 004015',           desc: 'Tamanhos disponíveis: 44/54/58 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Preto 3565',                 desc: 'Tamanhos disponíveis: 50 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Black Jet 4288',             desc: 'Tamanhos disponíveis: 54 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Black Jet 3979',             desc: 'Tamanhos disponíveis: 42/44/48/52/54/58 ao 62/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Preto 3607',                 desc: 'Tamanhos disponíveis: 52/58 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Preto 2870',                 desc: 'Tamanhos disponíveis: 62/64 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Preto 3181',                 desc: 'Tamanhos disponíveis: 44/60/62 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Preto 3253',                 desc: 'Tamanhos disponíveis: 44/52/60/62 | Via do Terno' },
      null, // foto extra do Preto 3253 (mesmo código, ângulo diferente)
      { name: 'Terno Microfibra Padrão Liso - Chumbo 004021',              desc: 'Tamanhos disponíveis: 42/44/52/54/58 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Prata 3169',                 desc: 'Tamanhos disponíveis: 42 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Cinza 3790',                 desc: 'Tamanhos disponíveis: 58/60/62/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Chumbo 3891',                desc: 'Tamanhos disponíveis: 42 ao 62/66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Chumbo 1274',                desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Titânio 3256',               desc: 'Tamanhos disponíveis: 60/62 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Chumbo 3680',                desc: 'Tamanhos disponíveis: 42/44/48/52/54/58/60/62/64 | Via do Terno' },
      { name: 'Terno Microfibra Padrão Liso - Black Jet 4511',             desc: 'Tamanhos disponíveis: 44 ao 66 | Via do Terno' },
    ],
  },

  // Catálogo "POLIVISCOSE 23-07.pdf" — transcrito manualmente das 50 páginas
  // (substitui o array antigo, que era de uma versão diferente do PDF e não
  // batia com a ordem/conteúdo real das páginas). Nenhuma página é foto extra
  // (nulls) — todas as 50 páginas trazem um código de produto distinto.
  poliviscose: {
    category: 'ternos',
    namePattern: 'Poliviscose',
    pages: [
      { name: 'Terno Poliviscose Antuerpia Semi Encerado - Azul 3946',                desc: 'Tamanhos disponíveis: 42/44/54/56/60/62/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Encerado - Azul Denim 3834',               desc: 'Tamanhos disponíveis: 62 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Prime London Noble - Marinho 4433',        desc: 'Tamanhos disponíveis: 42/58/62/64/66 | Meridian Collection | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Bege 3872',                          desc: 'Tamanhos disponíveis: 42/44/54 ao 66 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuerpia Prime Fosco - Marinho 4221',       desc: 'Tamanhos disponíveis: 42/44/46/54 ao 66 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuerpia Prime Mescla - Boss 4550',         desc: 'Tamanhos disponíveis: 42/44/46/52/58/62 | Meridian Collection | Via do Terno' },
      { name: 'Terno Poliviscose Padrão Xadrez - Cinza 3461',                         desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Prime London Noble - Branco 4270',         desc: 'Tamanhos disponíveis: 46 | Meridian Collection | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Fosco - Preto 4207',                       desc: 'Tamanhos disponíveis: 42/46/54 ao 62 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuerpia Prime Fosco - Chumbo 4215',        desc: 'Tamanhos disponíveis: 42/44/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuérpia Fosco - Cinza 3943',                       desc: 'Tamanhos disponíveis: 42/44/56/58/60/62 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuerpia Prime Fosco - Homus 4218',         desc: 'Tamanhos disponíveis: 42/44/54 ao 66 | Via do Terno' },
      { name: 'Terno Poliviscose Prime Xadrez - Royal 002888',                        desc: 'Tamanhos disponíveis: 42/44/62/66 | Coleção Estação Real | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuerpia Prime Fosco - Preto 4212',         desc: 'Tamanhos disponíveis: 44/46/54 ao 64 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Xadrez - Chumbo 169',                      desc: 'Tamanhos disponíveis: 46 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuérpia Prime Fosco - Spray 2452',         desc: 'Tamanhos disponíveis: 56/58/64/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuépia Semi Encerado - Cinza 4201',                desc: 'Tamanhos disponíveis: 42/44/52 ao 62 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Prime Fosco - Astral 4442',                desc: 'Tamanhos disponíveis: 44 ao 50/56 ao 66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Prime Semi Encerado - Steel Gray 4258',    desc: 'Tamanhos disponíveis: 42/62/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuérpia Fosco - Azul 3928',                        desc: 'Tamanhos disponíveis: 42/44/66 | Via do Terno' },
      { name: 'Terno Poliviscose Padrão Fosco - Preto 995',                           desc: 'Tamanhos disponíveis: 44 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Xadrez - Cinza 3937',                      desc: 'Tamanhos disponíveis: 42/44/46/50 ao 66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia London Noble - Cinza 004189',              desc: 'Tamanhos disponíveis: 42/46 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Prime Fosco - Preto 4261',                 desc: 'Tamanhos disponíveis: 42 ao 48/54/56/58/62/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Semi Encerado - Preto 3949',               desc: 'Tamanhos disponíveis: 42/60 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuerpia Prime Mescla - Suit 4553',         desc: 'Tamanhos disponíveis: 42/44/54/56/58/62/64/66 | Meridian Collection | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Prime Semi Encerado - Azul 4252',          desc: 'Tamanhos disponíveis: 42/44/46/56/58/60/62/66 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Kaki 3714',                          desc: 'Tamanhos disponíveis: 42/44/66 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Prata 3699',                         desc: 'Tamanhos disponíveis: 42/44/58/60/62/66 | Via do Terno' },
      { name: 'Terno Poliviscose Firenze Quadri - Black 3464',                        desc: 'Tamanhos disponíveis: 42/44 | Tradição italiana. Xadrez sutil. Alfaiataria moderna. | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Fosco - Kraft 786',                        desc: 'Tamanhos disponíveis: 44 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Semi Encerado - Steel Gray 4204',          desc: 'Tamanhos disponíveis: 42/44/58 ao 66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Xadrez - Bege Palha 1818',                 desc: 'Tamanhos disponíveis: 42/44/46/50 ao 58/62/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Xadrez - Areia 343',                       desc: 'Tamanhos disponíveis: 48/50 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Semi Encerado - Azul 3827',                desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Semi Encerado - Cinza 3824',               desc: 'Tamanhos disponíveis: 42/44/62 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Fosco - Preto 3821',                       desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Chumbo 3705',                        desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Poliviscose Antuérpia Fosco - Terracota 3934',                   desc: 'Tamanhos disponíveis: 42/44/60/62 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Semi Encerado - Steel 3830',               desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Cactus 2237',                        desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Bege 3708',                          desc: 'Tamanhos disponíveis: 60/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Xadrez - Chumbo 1821',                     desc: 'Tamanhos disponíveis: 44/46 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Detalhado - Homus 3866',                     desc: 'Tamanhos disponíveis: 60/62 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Detalhado - Bege Rizal 2623',                desc: 'Tamanhos disponíveis: 42/44/66 | Via do Terno' },
      { name: 'Terno Poliviscose Antuerpia Semi Encerado - 152011',                   desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Cinza 3869',                         desc: 'Tamanhos disponíveis: 42/44/58/60/62/66 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Fosco - Night Sky 3702',                     desc: 'Tamanhos disponíveis: 42/44 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Detalhado - Cosmic Blue 3857',               desc: 'Tamanhos disponíveis: 44 | Via do Terno' },
      { name: 'Terno Poliviscose Stretch Antuerpia - Marinho 4532',                   desc: 'Tamanhos disponíveis: 42 ao 66 | Via do Terno' },
    ],
  },
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
async function apiJSON(path, options = {}) {
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
  if (res.status !== 200 && res.status !== 409) {
    console.warn('Bucket aviso:', await res.text())
  } else {
    console.log('Bucket product-images OK')
  }
}

async function uploadImage(filename, jpegBuffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: jpegBuffer,
  })
  if (!res.ok) throw new Error(`Upload falhou ${filename}: ${await res.text()}`)
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`
}

class NodeCanvasFactory {
  create(w, h) { const c = createCanvas(w, h); return { canvas: c, context: c.getContext('2d') } }
  reset(c, w, h) { c.canvas.width = w; c.canvas.height = h }
  destroy() {}
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const [,, pdfPath, catalogType, priceStr] = process.argv
  if (!pdfPath || !catalogType || !priceStr) {
    console.error('Uso: node scripts/import-pdf-with-images.mjs <pdf> <tipo> <preco>')
    console.error('Tipos: elastomultiester | infantil | microfibra | poliviscose | feminino')
    process.exit(1)
  }

  const catalog = CATALOGS[catalogType]
  if (!catalog) {
    console.error(`Tipo desconhecido: ${catalogType}. Disponíveis: ${Object.keys(CATALOGS).join(', ')}`)
    process.exit(1)
  }

  const price = parseFloat(priceStr)
  if (isNaN(price)) { console.error('Preço inválido'); process.exit(1) }

  console.log(`\nImportando catálogo: ${catalogType}`)
  console.log(`Preço: R$ ${price.toFixed(2)} | Categoria: ${catalog.category}\n`)

  await ensureBucket()

  // buscar categoria
  const cats = await apiJSON('categories?select=id,slug')
  const catId = cats.find(c => c.slug === catalog.category)?.id
  if (!catId) throw new Error(`Categoria "${catalog.category}" não encontrada`)

  // substitui o catálogo antigo: apaga os produtos já cadastrados cujo nome
  // contém o namePattern do catálogo antes de importar os novos (evita
  // duplicar/misturar versões diferentes do mesmo catálogo)
  if (catalog.namePattern) {
    const existing = await apiJSON(
      `products?category_id=eq.${catId}&name=ilike.*${encodeURIComponent(catalog.namePattern)}*&select=id,name`
    )
    if (existing?.length) {
      console.log(`Removendo ${existing.length} produto(s) antigo(s) de "${catalog.namePattern}"...`)
      for (const p of existing) {
        await apiJSON(`products?id=eq.${p.id}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })
      }
      console.log('Remoção concluída.\n')
    }
  }

  // carregar PDF
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(await readFile(pdfPath))
  const pdf = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise
  console.log(`PDF carregado: ${pdf.numPages} páginas`)

  const factory = new NodeCanvasFactory()
  let productIndex = 0  // índice no array pages (pulando nulls)
  let ok = 0
  let fail = 0

  // mapa nome→imageUrls para produtos com foto extra (null pages)
  const pendingImages = {} // { productName: [url, url2, ...] }

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const pageConfig = catalog.pages[pageNum - 1]

    // renderiza a página independente de ser produto novo ou foto extra
    let imageUrl
    try {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1.8 })
      const { canvas, context } = factory.create(viewport.width, viewport.height)
      await page.render({ canvasContext: context, viewport, canvasFactory: factory }).promise

      const buf = canvas.toBuffer('image/jpeg', { quality: 0.88 })
      const filename = `${catalogType}/page-${String(pageNum).padStart(3, '0')}.jpg`
      imageUrl = await uploadImage(filename, buf)
      console.log(`[p${pageNum}] ✓ upload: ${filename}`)
    } catch (err) {
      console.error(`[p${pageNum}] Erro ao renderizar: ${err.message}`)
      fail++
      if (pageConfig !== null) productIndex++
      continue
    }

    if (pageConfig === undefined) {
      console.log(`[p${pageNum}] Página sem mapeamento — ignorada`)
      continue
    }

    if (pageConfig === null) {
      // foto extra: adiciona à lista do produto anterior
      const prevName = catalog.pages.slice(0, pageNum - 1).filter(Boolean).at(-1)?.name
      if (prevName) {
        pendingImages[prevName] = pendingImages[prevName] || []
        pendingImages[prevName].push(imageUrl)
        console.log(`[p${pageNum}] ↑ foto extra para: ${prevName}`)
      }
      continue
    }

    // novo produto
    const { name, desc } = pageConfig
    try {
      const images = [imageUrl]
      await apiJSON('products', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description: desc ?? null,
          price,
          category_id: catId,
          images,
          active: true,
        }),
      })
      ok++
      pendingImages[name] = pendingImages[name] || []
      pendingImages[name].forEach(() => {}) // será atualizado logo abaixo
      console.log(`[${ok.toString().padStart(2, '0')}] ✓ produto: ${name}`)
    } catch (err) {
      console.error(`[p${pageNum}] Erro ao criar produto: ${err.message}`)
      fail++
    }
    productIndex++
  }

  // atualizar produtos que têm fotos extras
  const extraEntries = Object.entries(pendingImages).filter(([, urls]) => urls.length > 0)
  if (extraEntries.length > 0) {
    console.log('\nAtualizando fotos extras...')
    for (const [name, extraUrls] of extraEntries) {
      const rows = await apiJSON(`products?name=eq.${encodeURIComponent(name)}&select=id,images`)
      if (!rows?.length) continue
      const { id, images } = rows[0]
      const updatedImages = [...(images ?? []), ...extraUrls]
      await apiJSON(`products?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ images: updatedImages }),
        headers: { Prefer: 'return=minimal' },
      })
      console.log(`  ✓ +${extraUrls.length} foto(s) para: ${name}`)
    }
  }

  console.log(`\n${'─'.repeat(55)}`)
  console.log(`Produtos criados : ${ok}`)
  console.log(`Falhas           : ${fail}`)
  console.log('\nAcesse /admin/produtos para revisar.')
}

main().catch(err => { console.error('\nErro fatal:', err.message); process.exit(1) })
