import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/catalog/ProductCard'
import CategoryFilter from '@/components/catalog/CategoryFilter'
import { createClient } from '@/lib/supabase-server'
import { Product } from '@/types'

interface Props {
  searchParams: Promise<{ categoria?: string; q?: string }>
}

async function getProducts(categoria?: string, q?: string): Promise<Product[]> {
  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug,order_index)')
    .eq('active', true)
    .order('order_index', { ascending: true })

  if (categoria) {
    query = query.eq('categories.slug', categoria)
  }
  if (q) {
    query = query.ilike('name', `%${q}%`)
  }

  const { data } = await query
  if (!data) return []

  if (categoria) {
    return (data as Product[]).filter(p => p.category?.slug === categoria)
  }
  return data as Product[]
}

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams
  const { categoria, q } = params
  const products = await getProducts(categoria, q)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {categoria
              ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
              : 'Catálogo'}
          </h1>
          <p className="text-[#6b7280] text-sm">
            {products.length} produto{products.length !== 1 ? 's' : ''} encontrado
            {products.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#6b7280] text-lg">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
