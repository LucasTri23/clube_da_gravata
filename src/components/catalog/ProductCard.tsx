'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const image = product.images?.[0] ?? ''

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
    })

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'cart_add', product_id: product.id }),
    }).catch(() => {})
  }

  return (
    <Link
      href={`/produto/${product.id}`}
      className="group block bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#C9A84C]/50 transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A84C]/5"
    >
      <div className="relative aspect-square bg-[#1a1a1a]">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6b7280] text-sm">
            Sem foto
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-white font-medium text-sm leading-snug line-clamp-2 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-[#C9A84C] font-bold text-base">
            R${product.price.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#E2C87A] text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <ShoppingCart size={13} />
            Adicionar
          </button>
        </div>
      </div>
    </Link>
  )
}
