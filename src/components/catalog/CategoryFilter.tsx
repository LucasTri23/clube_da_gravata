'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES = [
  { label: 'Todos', slug: '' },
  { label: 'Ternos', slug: 'ternos' },
  { label: 'Gravatas', slug: 'gravatas' },
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
      {CATEGORIES.map(cat => (
        <button
          key={cat.slug}
          onClick={() => select(cat.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            current === cat.slug
              ? 'bg-[#C9A84C] text-black'
              : 'bg-[#141414] border border-[#2a2a2a] text-[#e0e0e0] hover:border-[#C9A84C] hover:text-[#C9A84C]'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
