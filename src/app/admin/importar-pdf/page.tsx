import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PdfImporter from '@/components/admin/PdfImporter'

export default function ImportarPdfPage() {
  return (
    <div>
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-1 text-[#6b7280] hover:text-[#C9A84C] text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar aos produtos
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Importar PDF</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Suba um catálogo em PDF e cada página vira um produto individual.
        </p>
      </div>
      <PdfImporter />
    </div>
  )
}
