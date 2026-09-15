'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'
import { Product } from '@/types'

interface Props {
  products: Product[]
  categoria: string
}

function extractTipo(name: string): string {
  const m = name.match(/^Terno (Microfibra|Poliviscose|Elastomultiéster)/)
  return m?.[1] ?? ''
}

function extractCor(name: string): string {
  const after = name.match(/ - (.+)$/)
  if (!after) return ''
  return after[1].replace(/\s+[\dA-Z]{3,}$/, '').trim()
}

function extractSizes(description: string | null): string[] {
  if (!description) return []
  const m = description.match(/Tamanhos[^:]*:\s*([^|]+)/)
  if (!m) return []
  const out: string[] = []
  for (const part of m[1].trim().split('/')) {
    const p = part.trim()
    const range = p.match(/^(\d+)\s+ao\s+(\d+)$/)
    if (range) {
      for (let s = +range[1]; s <= +range[2]; s += 2) out.push(String(s))
    } else if (/^\d+$/.test(p)) {
      out.push(p)
    }
  }
  return [...new Set(out)].sort((a, b) => +a - +b)
}

function extractModelo(name: string, description: string | null): string {
  const m = description?.match(/Modelo:\s*([^|]+)/)
  if (m) return m[1].trim()
  const nm = name.match(/^Gravata (.+?) \d{3}$/)
  return nm?.[1] ?? ''
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

export default function CatalogClient({ products, categoria }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tipo = searchParams.get('tipo') ?? ''
  const tamanho = searchParams.get('tamanho') ?? ''
  const cor = searchParams.get('cor') ?? ''
  const modelo = searchParams.get('modelo') ?? ''
  const preco = searchParams.get('preco') ?? ''

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.replace(`/catalogo?${params.toString()}`, { scroll: false })
  }

  const isTernos = categoria === 'ternos'
  const isGravatas = categoria === 'gravatas'

  const tipos = useMemo(
    () => unique(products.map(p => extractTipo(p.name)).filter(Boolean)).sort(),
    [products]
  )
  const cores = useMemo(
    () => unique(products.map(p => extractCor(p.name)).filter(Boolean)).sort(),
    [products]
  )
  const tamanhos = useMemo(
    () => unique(products.flatMap(p => extractSizes(p.description))).sort((a, b) => +a - +b),
    [products]
  )
  const modelos = useMemo(
    () => unique(products.map(p => extractModelo(p.name, p.description)).filter(Boolean)).sort(),
    [products]
  )
  const precos = useMemo(
    () => unique(products.map(p => p.price)).sort((a, b) => a - b),
    [products]
  )

  const filtered = useMemo(() => products.filter(p => {
    if (isTernos) {
      if (tipo && extractTipo(p.name) !== tipo) return false
      if (tamanho && !extractSizes(p.description).includes(tamanho)) return false
      if (cor && extractCor(p.name) !== cor) return false
    }
    if (isGravatas) {
      if (modelo && extractModelo(p.name, p.description) !== modelo) return false
      if (preco && p.price !== parseFloat(preco)) return false
    }
    return true
  }), [products, tipo, tamanho, cor, modelo, preco, isTernos, isGravatas])

  const hasFilters = !!(tipo || tamanho || cor || modelo || preco)

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tipo'); params.delete('tamanho'); params.delete('cor')
    params.delete('modelo'); params.delete('preco')
    router.replace(`/catalogo?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      {(isTernos || isGravatas) && (
        <div className="flex items-center gap-3 flex-wrap mb-6">
          {isTernos && (
            <>
              <FilterSelect label="Tipo" value={tipo} onChange={v => setFilter('tipo', v)} options={tipos} />
              <FilterSelect label="Tamanho" value={tamanho} onChange={v => setFilter('tamanho', v)} options={tamanhos} />
              <FilterSelect label="Cor" value={cor} onChange={v => setFilter('cor', v)} options={cores} />
            </>
          )}
          {isGravatas && (
            <>
              <FilterSelect label="Modelo" value={modelo} onChange={v => setFilter('modelo', v)} options={modelos} />
              <FilterSelect
                label="Preço"
                value={preco}
                onChange={v => setFilter('preco', v)}
                options={precos.map(String)}
                formatLabel={v => `R$ ${parseFloat(v).toFixed(2).replace('.', ',')}`}
              />
            </>
          )}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm px-2 hover:underline"
              style={{ color: 'var(--gold)' }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} produto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}

function FilterSelect({
  label, value, onChange, options, formatLabel,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  formatLabel?: (v: string) => string
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="flex-1 min-w-[130px] sm:flex-none sm:min-w-0 px-3 py-2.5 sm:py-2 rounded-lg text-sm border transition-colors cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        borderColor: value ? 'var(--gold)' : 'var(--border)',
        color: value ? 'var(--gold)' : 'var(--text)',
      }}
    >
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>
          {formatLabel ? formatLabel(opt) : opt}
        </option>
      ))}
    </select>
  )
}
