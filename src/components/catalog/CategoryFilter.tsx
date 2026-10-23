'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { LoaderCircle } from 'lucide-react'

const CATEGORIES = [
  { label: 'Todos', slug: '' },
  { label: 'Ternos', slug: 'ternos' },
  { label: 'Gravatas', slug: 'gravatas' },
  { label: 'Feminino', slug: 'feminino' },
  { label: 'Infantil', slug: 'infantil' },
  { label: 'Camisas', slug: 'camisas' },
  { label: 'Prendedores', slug: 'prendedores' },
]

export default function CategoryFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const current = searchParams.get('categoria') ?? ''
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState(current)

  function select(slug: string) {
    if (slug === current) return
    setSelected(slug)
    const params = new URLSearchParams(searchParams.toString())
    for (const key of ['tipo', 'tamanho', 'cor', 'modelo', 'preco']) params.delete(key)
    if (slug) {
      params.set('categoria', slug)
    } else {
      params.delete('categoria')
    }
    startTransition(() => router.push(`/catalogo?${params.toString()}`))
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map(cat => {
        const active = (isPending ? selected : current) === cat.slug
        return (
          <button
            key={cat.slug}
            onClick={() => select(cat.slug)}
            disabled={isPending}
            aria-pressed={active}
            aria-busy={isPending && active}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all"
            style={
              active
                ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: '#000' }
                : { background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-sub)' }
            }
          >
            {cat.label}
            {isPending && active && <LoaderCircle size={14} className="animate-spin" aria-label="Carregando categoria" />}
          </button>
        )
      })}
    </div>
  )
}
