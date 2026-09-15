import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import TestimonialForm from '@/components/admin/TestimonialForm'
import { createClient } from '@/lib/supabase-server'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarDepoimentoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: testimonial } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()

  if (!testimonial) notFound()

  return (
    <div>
      <Link
        href="/admin/depoimentos"
        className="inline-flex items-center gap-1 text-[#6b7280] hover:text-[#C9A84C] text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <h1 className="text-2xl font-bold text-white mb-8">Editar Depoimento</h1>
      <TestimonialForm
        mode="edit"
        initialData={{
          id: testimonial.id,
          client_name: testimonial.client_name,
          feedback: testimonial.feedback,
          photo_url: testimonial.photo_url ?? '',
          active: testimonial.active,
        }}
      />
    </div>
  )
}
