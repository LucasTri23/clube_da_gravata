import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import { createCanvas } from '@napi-rs/canvas'
const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
const source = 'C:/Users/x17859816/Downloads'
const output = '.local/suit-replacement'
await mkdir(output, { recursive: true })
const configs = [
  ['MICROFIBRA - 19.10 .pdf', 'Microfibra', 500],
  ['POLIVISCOSE - 19.10.pdf', 'Poliviscose', 589.90],
  ['PV COM AJUSTE - 19.10.pdf', 'Poliviscose com Regulagem', 679.90],
  ['ELASTOMULTIESTER - 16.10 (1).pdf', 'Elastomultiéster', 719.90],
  ['HERITAGE INTRECCIO - 16.10 (1).pdf', 'Heritage Intreccio', 649.99],
  ['FIO INDIANO - 29.09.pdf', 'Fio Indiano', 469.90],
]
class CanvasFactory {
  create(w, h) { const canvas = createCanvas(w, h); return { canvas, context: canvas.getContext('2d') } }
  reset(target, w, h) { target.canvas.width = w; target.canvas.height = h }
  destroy(target) { target.canvas.width = 0; target.canvas.height = 0 }
}
const catalogs = []
for (const [filename, model, price] of configs) {
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await readFile(path.join(source, filename))), useSystemFonts: true }).promise
  const pages = []
  const slug = model.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-')
  await mkdir(path.join(output, slug), { recursive: true })
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n)
    const content = await page.getTextContent()
    const lines = []
    let line = ''
    for (const item of content.items) {
      line += item.str + ' '
      if (item.hasEOL) { lines.push(line.trim()); line = '' }
    }
    if (line.trim()) lines.push(line.trim())
    pages.push({ page: n, lines })
    if (process.argv.includes('--render')) {
      const file = path.join(output, slug, `${String(n).padStart(3, '0')}.jpg`)
      const existing = await readdir(path.join(output, slug))
      if (!existing.includes(path.basename(file))) {
        const viewport = page.getViewport({ scale: 1.6 })
        const factory = new CanvasFactory()
        const target = factory.create(Math.ceil(viewport.width), Math.ceil(viewport.height))
        await page.render({ canvasContext: target.context, viewport, canvasFactory: factory }).promise
        await writeFile(file, target.canvas.toBuffer('image/jpeg', 88))
        factory.destroy(target)
      }
    }
    page.cleanup()
  }
  catalogs.push({ filename, model, slug, price, pages })
  console.log(`${model}: ${pdf.numPages} páginas; R$ ${price.toFixed(2)}`)
  await pdf.cleanup()
}
await writeFile(path.join(output, 'extracted.json'), JSON.stringify(catalogs, null, 2))
