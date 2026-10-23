import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

async function loadModule(file) {
  const source = await readFile(file, 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}
const { catalogReturnURL } = await loadModule('src/lib/catalog-navigation.ts')
const filtered = '/catalogo?categoria=ternos&tipo=Heritage+Intreccio&tamanho=44&q=Henry'
assert.equal(catalogReturnURL(filtered), filtered)
for (const value of ['https://other.example/catalogo', '//other.example/catalogo', '/catalogo/other', 'javascript:alert(1)', '/catalogo\\@other.example']) {
  assert.equal(catalogReturnURL(value, 'ternos'), '/catalogo?categoria=ternos')
}
assert.equal(catalogReturnURL(null), '/catalogo')
const { buildWhatsAppCheckoutURL, buildWhatsAppProductURL } = await loadModule('src/lib/whatsapp.ts')
const items = [
  { id: 'terno-1', name: 'Terno Heritage Intreccio', price: 649.99, quantity: 2, image: '' },
  { id: 'gravata-1', name: 'Gravata Seda', price: 44.9, quantity: 1, image: '' },
]
const checkout = new URL(buildWhatsAppCheckoutURL(items, 'https://loja.example'))
const text = checkout.searchParams.get('text')
assert.match(text, /Terno Heritage Intreccio \(x2\)/)
assert.match(text, /https:\/\/loja.example\/produto\/terno-1/)
assert.match(text, /https:\/\/loja.example\/produto\/gravata-1/)
assert.match(text, /Total estimado: R\$1344,88/)
const direct = new URL(buildWhatsAppProductURL({ id: 'abc', name: 'Gravata', price: 44.9 }, 'https://loja.example'))
assert.match(direct.searchParams.get('text'), /https:\/\/loja.example\/produto\/abc/)
console.log('Verificados: retorno com filtros, validação do endereço de retorno, links dos produtos e total do WhatsApp.')
