// Teste rápido: renderiza a 1ª página de um PDF e salva como JPEG
// Usage: node scripts/test-pdf-render.mjs "caminho/para/arquivo.pdf"

import { createCanvas } from '@napi-rs/canvas'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

const pdfPath = process.argv[2]
if (!pdfPath) {
  console.error('Uso: node scripts/test-pdf-render.mjs "caminho/do/arquivo.pdf"')
  process.exit(1)
}

// pdfjs-dist legacy build (funciona em Node.js sem worker)
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height)
    return { canvas, context: canvas.getContext('2d') }
  }
  reset(c, w, h) { c.canvas.width = w; c.canvas.height = h }
  destroy() {}
}

const data = new Uint8Array(await readFile(pdfPath))
const loadingTask = pdfjsLib.getDocument({ data, useSystemFonts: true })
const pdf = await loadingTask.promise
console.log(`PDF tem ${pdf.numPages} páginas`)

const page = await pdf.getPage(1)
const scale = 1.5
const viewport = page.getViewport({ scale })
const factory = new NodeCanvasFactory()
const { canvas, context } = factory.create(viewport.width, viewport.height)

await page.render({ canvasContext: context, viewport, canvasFactory: factory }).promise

const buf = canvas.toBuffer('image/jpeg', { quality: 0.85 })
const outPath = path.resolve('scripts/test-page1.jpg')
await writeFile(outPath, buf)
console.log(`Salvo: ${outPath}`)
