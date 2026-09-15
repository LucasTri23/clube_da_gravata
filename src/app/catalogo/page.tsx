import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryFilter from '@/components/catalog/CategoryFilter'
import CatalogClient from '@/components/catalog/CatalogClient'
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            {categoria
              ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
              : 'Catálogo'}
          </h1>
        </div>

        <div className="mb-6">
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        <Suspense>
          <CatalogClient products={products} categoria={categoria ?? ''} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
