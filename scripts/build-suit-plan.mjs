import { readFile, writeFile } from 'node:fs/promises'
const root = '.local/suit-replacement'
const catalogs = JSON.parse(await readFile(`${root}/extracted.json`, 'utf8'))
const ocr = JSON.parse((await readFile(`${root}/ocr.json`, 'utf8')).replace(/^\uFEFF/, ''))
// One row per PDF page, in source order. Repeated codes become extra photos.
const names = {
  microfibra: `Padrão Detalhado - Preto 5234
Stretch Liso - Asphalt 4365
Stretch Liso - Preto 4371
Stretch Liso - Branco 3589
Padrão Detalhado - Prata 5764
Padrão Liso - Black Jet 4801
Padrão Liso - Titânio 3256
Padrão Liso - Chumbo 1274
Padrão Liso - Chumbo 3891
Padrão Liso - Chumbo 3680
Padrão Liso - Navy 5748
Padrão Liso - Chumbo 004021
Padrão Liso - Cinza 3790
Padrão Liso - Marinho 5599
Padrão Liso - Rubi 5401
Liso - Midnight 5884
Liso - Militar 5539
Liso - Caramelo 5773
Padrão Liso - Blue Uni 5398
Premium Brilhante - Calcário 5273
Premium Detalhado - Midnight 5661
Padrão Liso - Preto 4856
Firenze Check - Kaki 5222
Padrão Liso - Preto 5463
Padrão Liso - Preto 3607
Padrão Liso - Preto 4868
Padrão Liso - Black Jet 3897
Padrão Liso - Preto 3607
Padrão Liso - Chumbo 5652
Padrão Liso - Preto 5255
Padrão Liso - Ice 5590
Padrão Liso - Ice 5649
Padrão Liso - Black Jet 4418
Padrão Liso - Marlin 5542
Firenze Check - Cinza 5225
Padrão Liso - Granito 5745
Modelo 5228
Firenze Check - Marinho 4503
Modelo 5261
Firenze Quadri - Navy 5270
Firenze Quadri - Kaki 4294
Firenze Check - Marinho 5219
Firenze Quadri - Marinho 5264
Padrão Liso - Prata 4571
Stretch Mescla - Cimento 4448
Firenze Check - Kaki 5258
Stretch Liso - Verde Gelato Lote 940
Padrão Liso - Azul 3437
Modelo 4451
Padrão Liso - Dark Blue 3677
Padrão Liso - Azul 3306
Padrão Liso - Blue 3604
Padrão Liso - Midnight 4273
Padrão Liso - Midnight 4517
Padrão Liso - Dark Blue 3879
Padrão Liso - Bordô 4786
Padrão Liso - Verde Sálvia Lote 1330
Padrão Liso - Dark Blue 4018
Padrão Liso - Midnight 4804
Padrão Detalhado - Marinho 5407
Padrão Detalhado - Noturno 5249
Padrão Detalhado - Dark 5761
Padrão Detalhado - Verde 5767
Padrão Detalhado - Dark 5545
Padrão Detalhado - Kaki 5410
Padrão Detalhado - Kaki 5608
Padrão Detalhado - Bege 4811
Detalhado - Modelo 5785
Stretch Liso - Cinza 5122
Stretch Liso - Astral 3652
Stretch Liso - Cinza 3586
Stretch Liso - Cinza 3643
Stretch Liso - Azul 5125
Stretch Liso - Astral 3773
Stretch Liso - Astral 4383
Stretch Liso - Areia 3646
Stretch Liso - Vinho 3764
Padrão Liso - Cinza 4514
Stretch Liso - Bege 4377
Stretch Liso - Areia 3776
Padrão Liso - Ice 4862
Padrão Liso - Grafite 2690
Padrão Liso - Ice 4862
Padrão Liso - Cinza 4506
Padrão Liso - Cinza 4574
Padrão Liso - Grafite 3198
Padrão Liso - Cinza 3683
Padrão Liso - Caramelo 4520
Padrão Detalhado - Preto 5755
Padrão Liso - Grafite 3431`,
  poliviscose: `Antuérpia Prime Encerado - Cinza 4963
Antuérpia Prime Encerado - Preto 4713
Antuérpia Prime Fosco - Preto 4261
Antuérpia Prime Encerado - Azul 4972
Antuérpia Prime Fosco - Chumbo 4710
Antuérpia Prime Fosco - Preto 5013
Antuérpia Prime Fosco - Astral 4707
Antuérpia Prime Semi Encerado - Azul 4252
Antuérpia Prime Fosco - Astral 4442
Stretch Antuérpia Prime Fosco - Preto 4212
Stretch Antuérpia Prime Detalhado - Homus 5454
Stretch Antuérpia Prime Fosco - Marinho 4221
Stretch Antuérpia Prime Fosco - Homus 4218
Stretch Antuérpia Prime Fosco - Prata 5451
Stretch Antuérpia Prime Fosco - Black 4547
Stretch Antuérpia Prime Fosco - Marinho 4532
Stretch Antuérpia Prime Fosco - Preto 4535
Stretch Antuérpia Fosco - Preto 4960
Stretch Antuérpia Prime Fosco - Prata 4538
Stretch Fosco - Preto 3875
Stretch Fosco - Bege 3708
Stretch Fosco - Bege 3872
Stretch Fosco - Cinza 3869
Stretch Fosco - Night Sky 3702
Stretch Fosco - Cactus 2237
Stretch Fosco - Kaki 3714
Antuérpia Xadrez - Cinza 3937
Antuérpia Xadrez - Bege Palha 1818
Antuérpia Xadrez - Chumbo 1821
Antuérpia Fosco - Cinza 4847
Antuérpia Fosco - Azul 3928
Antuérpia Encerado - Preto 00000011
Antuérpia Fosco - Terracota 3934
Antuérpia Fosco - Sable 4844
Antuérpia Semi Encerado - Modelo 152011
Antuérpia Semi Encerado - Preto 000011
Antuérpia Fosco - Preto 4207
Antuérpia Semi Encerado - Steel Gray 004204
Antuérpia Semi Encerado - Cinza 4201
Antuérpia Semi Encerado - Preto 4853
Antuérpia Semi Encerado - Astral 4850
Antuérpia Semi Encerado - Azul 3946
Antuérpia Semi Encerado - Azul 3827
Firenze Quadri - Black 3464
Padrão Fosco - Preto 995
Antuérpia London Noble - Cinza 004189
Prime Xadrez - Royal 002888
Antuérpia Prime Liso - Vinho 4699
Padrão Fosco - Preto 000010
Padrão Liso - Azul Royal 780101
Stretch Fosco - Prata 3699`,
  'poliviscose-com-regulagem': `Com Regulagem Semi Encerado - Preto 3318
Com Regulagem Liso - Chumbo 3335
Antuérpia com Regulagem Encerado - Chumbo 3845
Antuérpia Prime Regulagem Fosco - Preto 4628
Stretch com Regulagem Fosco - Bege 3324
Stretch Antuérpia Prime Regulagem Fosco - Cinza 4637
Stretch Antuérpia Regulagem Fosco - Chumbo 4936
Stretch Antuérpia Regulagem Fosco - Cacau 4939
Stretch Antuérpia Prime Regulagem Fosco - Azul Noite 4634
Stretch Antuérpia Prime Regulagem Fosco - Cinza 3007
Stretch Antuérpia Prime Regulagem Fosco - Azul 4945
Stretch Antuérpia Regulagem Mescla - Dove Gray 4951
Antuérpia Prime Regulagem Fosco - Preto 4948`,
  elastomultiester: `Prime Fosco - Preto 4344
Prime Fosco - Chumbo 4155
Prime Fosco - Preto 4152
Prime Fosco - Cinza 4158
Prime Fosco - Chumbo 4347
Prime Fosco - Chocolate 4359
Prime Fosco - Cinza Médio 4350
Prime Fosco - Marinho 4161
Prime Fosco - Militar 4362
Prime Fosco - Marinho 4353
Prime Fosco - Homus 4356
Prime Fosco - Homus 4164
Antuérpia Prime Regulagem Fosco - Chumbo 3408
Antuérpia Prime Regulagem Fosco - Marinho 3414
Antuérpia Prime Regulagem Fosco - Cinza Médio 3411
Antuérpia Prime Regulagem Fosco - Homus 3417`,
  'heritage-intreccio': `Antuérpia Prime Luxo - Henry Preto 4129
Antuérpia Prime Liso - Cinza Mescla 4123
Antuérpia Prime Luxo - Henry Blue Space 4132
Antuérpia Prime Liso - Midnight 4126`,
  'fio-indiano': `Rochester Padrão Detalhado - Deep 5279
Padrão Detalhado - Chumbo 153004
Rochester Padrão Brilhante - Cinza 002273
Padrão Detalhado - Azul Marinho 2706
Padrão Detalhado - Preto 3988
Rochester Padrão Detalhado - Calcário 5276
Padrão Detalhado - Navy 4500
Padrão Detalhado - Preto 3166`,
}
const sizeOverrides = {
  'fio-indiano/3': '42/44/46/64/66',
  'elastomultiester/7': '42/44/58/60/62',
  'elastomultiester/12': '44/46/58',
  'heritage-intreccio/4': '42/44/46/50/52/54/56/58/60/64/66',
  'microfibra/9': '42/44/46/54 ao 60',
  'microfibra/14': '52/54/58/62/64/66',
  'microfibra/36': '66',
  'microfibra/48': '44',
  'microfibra/56': '58',
  'microfibra/59': '42/44/52/54/56/58/60/62/64/66',
  'poliviscose/22': '58/60/66',
  'poliviscose/23': '42/58/60/62/66',
  'poliviscose/27': '42/44/46/50/54 ao 66',
  'poliviscose/28': '42/44/46/62/64',
  'poliviscose/30': '44/46/52/54/58/60/64/66',
  'poliviscose/31': '42/44/66',
  'poliviscose/32': '42/44/58/60/62/64/66',
  'poliviscose/33': '60/62/64',
  'poliviscose/34': '58/60/62/64/66',
  'poliviscose/37': '42/56/58/62/64',
  'poliviscose/39': '44/58/60',
  'poliviscose/40': '44/46/50 ao 66',
  'poliviscose/42': '42/44/60/62/66',
  'poliviscose/48': '62/64/66',
  'poliviscose/49': '42/44/50/58/62',
  'poliviscose-com-regulagem/2': '42/44/46',
  'poliviscose-com-regulagem/4': '54/56/58/62',
  'poliviscose-com-regulagem/5': '60/62/66',
  'poliviscose-com-regulagem/8': '42/44/46/48/52/56/58/62/66',
  'poliviscose-com-regulagem/9': '42/44/54/56/58/60/62/66',
  'poliviscose-com-regulagem/10': '42/44/62',
  'poliviscose-com-regulagem/11': '42/44/46/50 ao 66',
  'poliviscose-com-regulagem/12': '44/46/50/54/56/58/60/64',
  'poliviscose-com-regulagem/13': '42/44/50 ao 60/64',
}
const plan = [], missing = []
for (const catalog of catalogs) {
  const rows = names[catalog.slug].split('\n')
  if (rows.length !== catalog.pages.length) throw new Error(`Mapeamento incompleto: ${catalog.slug}`)
  const products = new Map()
  for (const [index, suffix] of rows.entries()) {
    const page = index + 1
    const key = `${catalog.slug}/${page}`
    const scanned = ocr.find(p => p.slug === catalog.slug && p.page === page)
    const numeric = scanned.lines.filter(line => /^[\s\d/,aoAO.]+$/.test(line) && /\b(?:4[2468]|5[02468]|6[0246])\b/.test(line))
    let sizes = sizeOverrides[key] || numeric.join('/').replace(/\s*ao\s*/gi, ' ao ').replace(/[\s,]+/g, '/').replace(/\/ao\//g, ' ao ').replace(/\/{2,}/g, '/').replace(/^\/|\/$/g, '')
    if (!sizes) missing.push(key)
    const name = `Terno ${catalog.model === 'Poliviscose com Regulagem' ? 'Poliviscose' : catalog.model} ${suffix}`
    const product = products.get(name) || { name, price: catalog.price, model: catalog.model, sizes: [], images: [], sourcePages: [] }
    if (sizes) product.sizes.push(sizes)
    product.images.push(`${root}/clean/${catalog.slug}/${String(page).padStart(3, '0')}.jpg`)
    product.sourcePages.push({ file: catalog.filename, page })
    products.set(name, product)
  }
  for (const p of products.values()) {
    p.description = `${p.sizes.length ? `Tamanhos disponíveis: ${[...new Set(p.sizes)].join('/')}` : 'Consulte os tamanhos disponíveis'} | Modelo: ${p.model}`
    plan.push(p)
  }
  console.log(`${catalog.model}: ${products.size} produtos / ${rows.length} fotos / R$ ${catalog.price.toFixed(2)}`)
}
await writeFile(`${root}/plan.json`, JSON.stringify(plan, null, 2))
console.log('Páginas sem tamanhos reconhecidos:', missing.join(', '))
