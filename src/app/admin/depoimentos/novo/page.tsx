import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import TestimonialForm from '@/components/admin/TestimonialForm'

export default function NovoDepoimentoPage() {
  return (
    <div>
      <Link
        href="/admin/depoimentos"
        className="inline-flex items-center gap-1 text-[#6b7280] hover:text-[#C9A84C] text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <h1 className="text-2xl font-bold text-white mb-8">Novo Depoimento</h1>
      <TestimonialForm mode="create" />
    </div>
  )
}
