import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryFilter from '@/components/catalog/CategoryFilter'
import CatalogClient from '@/components/catalog/CatalogClient'
import SearchBar from '@/components/catalog/SearchBar'
import { createClient } from '@/lib/supabase-server'
import { Product } from '@/types'

interface Props {
  searchParams: Promise<{ categoria?: string; q?: string }>
}

async function getProducts(categoria?: string, q?: string): Promise<{ products: Product[]; failed: boolean }> {
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

  const { data, error } = await query
  if (error) {
    console.error('Falha ao carregar o catálogo:', error)
    return { products: [], failed: true }
  }

  if (categoria) {
    return { products: ((data ?? []) as Product[]).filter(p => p.category?.slug === categoria), failed: false }
  }
  return { products: (data ?? []) as Product[], failed: false }
}

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams
  const { categoria, q } = params
  const { products, failed } = await getProducts(categoria, q)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>
              {categoria
                ? categoria.charAt(0).toUpperCase() + categoria.slice(1)
                : 'Catálogo'}
            </h1>
            {q && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Resultados para &ldquo;{q}&rdquo;
              </p>
            )}
          </div>
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        <div className="mb-6">
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        {failed ? (
          <div role="alert" className="text-center py-24" style={{ color: 'var(--text-muted)' }}>
            <p className="text-lg">Não foi possível carregar os produtos.</p>
            <p className="text-sm mt-2">Tente novamente em alguns instantes.</p>
            <a href="" className="inline-block mt-4 text-sm underline" style={{ color: 'var(--gold)' }}>
              Tentar novamente
            </a>
          </div>
        ) : (
          <Suspense>
            <CatalogClient products={products} categoria={categoria ?? ''} />
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  )
}
