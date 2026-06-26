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
      className="product-card group block rounded-xl overflow-hidden border transition-all duration-200"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="relative aspect-square" style={{ background: 'var(--bg-card-2)' }}>
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg width="32" height="40" viewBox="0 0 18 24" fill="none" style={{ opacity: 0.2 }}>
              <path d="M5.5 2L9 7.5" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12.5 2L9 7.5" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
              <ellipse cx="9" cy="9.2" rx="2.3" ry="1.8" fill="var(--gold)" />
              <path d="M6.7 10.8L5.2 23L9 25L12.8 23L11.3 10.8Z" fill="var(--gold)" />
            </svg>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Sem foto</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-medium text-sm leading-snug line-clamp-2 mb-3"
          style={{ color: 'var(--text)' }}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="font-bold text-base" style={{ color: 'var(--gold)' }}>
            R${product.price.toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 text-black text-xs font-semibold px-3 py-1.5 rounded transition-opacity hover:opacity-80"
            style={{ background: 'var(--gold)' }}
          >
            <ShoppingCart size={13} />
            Adicionar
          </button>
        </div>
      </div>
    </Link>
  )
}
