'use client'

import { useRouter, useSearchParams } from 'next/navigation'

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

  function select(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('categoria', slug)
    } else {
      params.delete('categoria')
    }
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map(cat => {
        const active = current === cat.slug
        return (
          <button
            key={cat.slug}
            onClick={() => select(cat.slug)}
            className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
            style={
              active
                ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: '#000' }
                : { background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-sub)' }
            }
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
