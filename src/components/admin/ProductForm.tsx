'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import ImageUploader from './ImageUploader'

const CATEGORIES = [
  { name: 'Ternos', slug: 'ternos' },
  { name: 'Gravatas', slug: 'gravatas' },
  { name: 'Camisas', slug: 'camisas' },
  { name: 'Prendedores', slug: 'prendedores' },
]

interface FormData {
  name: string
  description: string
  price: string
  category_slug: string
  images: string[]
  active: boolean
}

interface Props {
  initialData?: Partial<FormData> & { id?: string }
  mode: 'create' | 'edit'
}

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price ?? '',
    category_slug: initialData?.category_slug ?? 'gravatas',
    images: initialData?.images ?? [],
    active: initialData?.active ?? true,
  })

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const url =
      mode === 'create'
        ? '/api/products'
        : `/api/products/${initialData?.id}`

    const res = await fetch(url, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category_slug: form.category_slug,
        images: form.images,
        active: form.active,
      }),
    })

    if (res.ok) {
      router.push('/admin/produtos')
      router.refresh()
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Erro ao salvar produto.')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm text-[#6b7280] mb-1">Nome do produto *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          required
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
          placeholder="Ex: Gravata Slim Azul Marinho"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#6b7280] mb-1">Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={e => update('price', e.target.value)}
            required
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
            placeholder="89.90"
          />
        </div>
        <div>
          <label className="block text-sm text-[#6b7280] mb-1">Categoria *</label>
          <select
            value={form.category_slug}
            onChange={e => update('category_slug', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
          >
            {CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-[#6b7280] mb-1">Descrição</label>
        <textarea
          value={form.description}
          onChange={e => update('description', e.target.value)}
          rows={3}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
          placeholder="Detalhes do produto, material, tamanhos disponíveis..."
        />
      </div>

      <div>
        <label className="block text-sm text-[#6b7280] mb-2">Imagens</label>
        <ImageUploader
          images={form.images}
          onChange={imgs => update('images', imgs)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update('active', !form.active)}
          className={`relative w-10 h-6 rounded-full transition-colors ${form.active ? 'bg-[#C9A84C]' : 'bg-[#2a2a2a]'}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.active ? 'left-5' : 'left-1'}`}
          />
        </button>
        <span className="text-sm text-[#e0e0e0]">
          {form.active ? 'Produto ativo (visível no catálogo)' : 'Produto inativo (oculto)'}
        </span>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#C9A84C] hover:bg-[#E2C87A] disabled:opacity-50 text-black font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {mode === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-[#141414] border border-[#2a2a2a] text-[#e0e0e0] px-6 py-2.5 rounded-lg hover:border-[#C9A84C] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
