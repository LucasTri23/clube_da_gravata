'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import PhotoUploader from './PhotoUploader'

interface FormData {
  client_name: string
  feedback: string
  photo_url: string
  active: boolean
}

interface Props {
  initialData?: Partial<FormData> & { id?: string }
  mode: 'create' | 'edit'
}

export default function TestimonialForm({ initialData, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    client_name: initialData?.client_name ?? '',
    feedback: initialData?.feedback ?? '',
    photo_url: initialData?.photo_url ?? '',
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
        ? '/api/testimonials'
        : `/api/testimonials/${initialData?.id}`

    const res = await fetch(url, {
      method: mode === 'create' ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: form.client_name,
        feedback: form.feedback,
        photo_url: form.photo_url,
        active: form.active,
      }),
    })

    if (res.ok) {
      router.push('/admin/depoimentos')
      router.refresh()
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'Erro ao salvar depoimento.')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm text-[#6b7280] mb-2">Foto do cliente</label>
        <PhotoUploader photoUrl={form.photo_url} onChange={url => update('photo_url', url)} />
      </div>

      <div>
        <label className="block text-sm text-[#6b7280] mb-1">Nome do cliente *</label>
        <input
          type="text"
          value={form.client_name}
          onChange={e => update('client_name', e.target.value)}
          required
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
          placeholder="Ex: Henrique"
        />
      </div>

      <div>
        <label className="block text-sm text-[#6b7280] mb-1">Depoimento *</label>
        <textarea
          value={form.feedback}
          onChange={e => update('feedback', e.target.value)}
          required
          rows={4}
          className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
          placeholder="O que o cliente disse sobre a experiência..."
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
          {form.active ? 'Depoimento ativo (visível na home)' : 'Depoimento inativo (oculto)'}
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
          {mode === 'create' ? 'Criar Depoimento' : 'Salvar Alterações'}
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
