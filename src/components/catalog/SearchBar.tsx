'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) params.set('q', value.trim())
    else params.delete('q')
    router.push(`/catalogo?${params.toString()}`)
  }

  function clear() {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <form onSubmit={submit} className="relative w-full sm:max-w-xs">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Buscar produtos..."
        className="w-full pl-9 pr-9 py-2.5 rounded-lg text-sm border transition-colors outline-none"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpar busca"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={15} />
        </button>
      )}
    </form>
  )
}
