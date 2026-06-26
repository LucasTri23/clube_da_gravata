import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductForm from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase-server'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug,order_index)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div>
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-1 text-[#6b7280] hover:text-[#C9A84C] text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>
      <h1 className="text-2xl font-bold text-white mb-8">Editar Produto</h1>
      <ProductForm
        mode="edit"
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description ?? '',
          price: String(product.price),
          category_slug: (product as { category?: { slug?: string } }).category?.slug ?? 'gravatas',
          images: product.images ?? [],
          active: product.active,
        }}
      />
    </div>
  )
}
