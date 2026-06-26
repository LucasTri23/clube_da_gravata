'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/contexts/CartContext'
import { createClient } from '@/lib/supabase-client'
import { Product } from '@/types'

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('products')
      .select('*, category:categories(id,name,slug,order_index)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProduct(data as Product)
        setLoading(false)
      })

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'view', product_id: id }),
    }).catch(() => {})
  }, [id])

  function handleAdd() {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? '',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-[#6b7280]">Produto não encontrado.</p>
          <Link href="/catalogo" className="text-[#C9A84C] hover:underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1 text-[#6b7280] hover:text-[#C9A84C] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#141414] border border-[#2a2a2a]">
              {images.length > 0 ? (
                <Image
                  src={images[currentImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6b7280]">
                  Sem foto
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImage(i => (i > 0 ? i - 1 : images.length - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage(i => (i < images.length - 1 ? i + 1 : 0))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      i === currentImage
                        ? 'border-[#C9A84C]'
                        : 'border-[#2a2a2a] hover:border-[#C9A84C]/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <Link
                href={`/catalogo?categoria=${product.category.slug}`}
                className="text-[#C9A84C] text-xs font-semibold uppercase tracking-wider mb-3 hover:underline"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl font-bold text-white mb-4">
              {product.name}
            </h1>

            <p className="text-4xl font-bold text-[#C9A84C] mb-6">
              R${product.price.toFixed(2).replace('.', ',')}
            </p>

            {product.description && (
              <p className="text-[#6b7280] leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <button
              onClick={handleAdd}
              className={`flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-xl transition-all text-lg ${
                added
                  ? 'bg-green-600 text-white'
                  : 'bg-[#C9A84C] hover:bg-[#E2C87A] text-black'
              }`}
            >
              <ShoppingCart size={22} />
              {added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
            </button>

            <div className="mt-6 p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl">
              <p className="text-[#6b7280] text-sm">
                💬 Dúvidas sobre o produto?{' '}
                <a
                  href="https://wa.me/5531995463588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A84C] hover:underline"
                >
                  Fale conosco no WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
