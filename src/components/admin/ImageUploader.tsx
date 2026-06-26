'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { X, Upload, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return
      setUploading(true)
      const supabase = createClient()
      const uploaded: string[] = []

      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error } = await supabase.storage
          .from('product-images')
          .upload(path, file, { upsert: false })

        if (!error) {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(path)
          uploaded.push(data.publicUrl)
        }
      }

      onChange([...images, ...uploaded])
      setUploading(false)
    },
    [images, onChange]
  )

  function removeImage(url: string) {
    onChange(images.filter(i => i !== url))
  }

  return (
    <div>
      <div
        className="border-2 border-dashed border-[#2a2a2a] hover:border-[#C9A84C]/50 rounded-xl p-8 text-center cursor-pointer transition-colors"
        onClick={() => document.getElementById('img-upload')?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
      >
        <input
          id="img-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-[#C9A84C] animate-spin" />
            <p className="text-[#6b7280] text-sm">Enviando...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-[#6b7280]" />
            <p className="text-[#6b7280] text-sm">
              Clique ou arraste imagens aqui
            </p>
            <p className="text-[#6b7280] text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mt-4">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image src={url} alt={`Imagem ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
