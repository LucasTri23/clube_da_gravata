'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { Loader2, CheckCircle, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface PageData {
  pageNum: number
  dataUrl: string
  selected: boolean
  name: string
  price: string
}

export default function PdfImporter() {
  const [pages, setPages] = useState<PageData[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handlePdf = useCallback(async (file: File) => {
    setLoading(true)
    setPages([])
    setDone(0)

    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const newPages: PageData[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 1.5 })
      canvas.width = viewport.width
      canvas.height = viewport.height
      await page.render({ canvasContext: ctx, viewport, canvas }).promise
      newPages.push({
        pageNum: i,
        dataUrl: canvas.toDataURL('image/jpeg', 0.85),
        selected: false,
        name: `Terno ${i}`,
        price: '',
      })
    }

    setPages(newPages)
    setLoading(false)
  }, [])

  function togglePage(i: number) {
    setPages(prev =>
      prev.map((p, idx) => (idx === i ? { ...p, selected: !p.selected } : p))
    )
  }

  function updatePage(i: number, key: 'name' | 'price', value: string) {
    setPages(prev =>
      prev.map((p, idx) => (idx === i ? { ...p, [key]: value } : p))
    )
  }

  async function handleImport() {
    const selected = pages.filter(p => p.selected)
    if (selected.length === 0) return
    setImporting(true)
    setDone(0)

    const supabase = createClient()

    for (const page of selected) {
      const res = await fetch(page.dataUrl)
      const blob = await res.blob()
      const path = `products/${Date.now()}-pg${page.pageNum}.jpg`

      const { error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(path, blob, { contentType: 'image/jpeg', upsert: false })

      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(path)

        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: page.name,
            price: parseFloat(page.price) || 0,
            category_slug: 'ternos',
            images: [urlData.publicUrl],
            active: true,
          }),
        })
      }

      setDone(d => d + 1)
    }

    setImporting(false)
    setPages(prev => prev.map(p => ({ ...p, selected: false })))
    alert(`${selected.length} produto(s) importado(s) com sucesso!`)
  }

  const selectedCount = pages.filter(p => p.selected).length

  return (
    <div>
      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-[#2a2a2a] hover:border-[#C9A84C]/50 rounded-xl p-12 text-center cursor-pointer transition-colors mb-8"
        onClick={() => document.getElementById('pdf-upload')?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file?.type === 'application/pdf') handlePdf(file)
        }}
      >
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handlePdf(file)
            e.target.value = ''
          }}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-[#C9A84C] animate-spin" />
            <p className="text-[#6b7280]">Processando PDF...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload size={32} className="text-[#6b7280]" />
            <p className="text-white font-medium">Clique ou arraste seu PDF aqui</p>
            <p className="text-[#6b7280] text-sm">Cada página vira um produto individual</p>
          </div>
        )}
      </div>

      {/* Pages grid */}
      {pages.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#6b7280] text-sm">
              {pages.length} página(s) — {selectedCount} selecionada(s)
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setPages(prev => prev.map(p => ({ ...p, selected: true })))
                }
                className="text-xs text-[#C9A84C] hover:underline"
              >
                Selecionar todas
              </button>
              <button
                onClick={() =>
                  setPages(prev => prev.map(p => ({ ...p, selected: false })))
                }
                className="text-xs text-[#6b7280] hover:underline"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {pages.map((page, i) => (
              <div
                key={i}
                className={`bg-[#141414] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  page.selected
                    ? 'border-[#C9A84C]'
                    : 'border-[#2a2a2a] hover:border-[#C9A84C]/40'
                }`}
                onClick={() => togglePage(i)}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={page.dataUrl}
                    alt={`Página ${page.pageNum}`}
                    fill
                    className="object-cover"
                  />
                  {page.selected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle size={20} className="text-[#C9A84C] bg-black rounded-full" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-white text-xs">Pág. {page.pageNum}</p>
                  </div>
                </div>

                {page.selected && (
                  <div
                    className="p-3 space-y-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={page.name}
                      onChange={e => updatePage(i, 'name', e.target.value)}
                      placeholder="Nome do produto"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#C9A84C]"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={page.price}
                      onChange={e => updatePage(i, 'price', e.target.value)}
                      placeholder="Preço R$"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedCount > 0 && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleImport}
                disabled={importing}
                className="bg-[#C9A84C] hover:bg-[#E2C87A] disabled:opacity-50 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                {importing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Importando {done}/{selectedCount}...
                  </>
                ) : (
                  `Importar ${selectedCount} produto(s)`
                )}
              </button>
            </div>
          )}
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
