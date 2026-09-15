'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { X, Upload, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface Props {
  photoUrl: string
  onChange: (url: string) => void
}

export default function PhotoUploader({ photoUrl, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFile = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0]
      if (!file) return
      setUploading(true)
      const supabase = createClient()

      const ext = file.name.split('.').pop()
      const path = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('testimonial-images')
        .upload(path, file, { upsert: false })

      if (!error) {
        const { data } = supabase.storage
          .from('testimonial-images')
          .getPublicUrl(path)
        onChange(data.publicUrl)
      }
      setUploading(false)
    },
    [onChange]
  )

  if (photoUrl) {
    return (
      <div className="relative w-24 h-24 rounded-full overflow-hidden group">
        <Image src={photoUrl} alt="Foto do cliente" fill className="object-cover" />
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    )
  }

  return (
    <div
      className="w-24 h-24 rounded-full border-2 border-dashed border-[#2a2a2a] hover:border-[#C9A84C]/50 flex items-center justify-center cursor-pointer transition-colors"
      onClick={() => document.getElementById('photo-upload')?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault()
        handleFile(e.dataTransfer.files)
      }}
    >
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files)}
      />
      {uploading ? (
        <Loader2 size={18} className="text-[#C9A84C] animate-spin" />
      ) : (
        <Upload size={18} className="text-[#6b7280]" />
      )}
    </div>
  )
}
