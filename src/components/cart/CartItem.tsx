'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/types'

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-3 items-start">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#2a2a2a] flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6b7280] text-xs">
            Sem foto
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium leading-snug truncate">
          {item.name}
        </p>
        <p className="text-[#C9A84C] text-sm font-semibold mt-0.5">
          R${(item.price * item.quantity).toFixed(2).replace('.', ',')}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-6 h-6 rounded border border-[#2a2a2a] flex items-center justify-center text-[#6b7280] hover:text-white hover:border-[#C9A84C] transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="text-white text-sm w-5 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-6 h-6 rounded border border-[#2a2a2a] flex items-center justify-center text-[#6b7280] hover:text-white hover:border-[#C9A84C] transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="p-1 text-[#6b7280] hover:text-red-400 transition-colors mt-0.5"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
