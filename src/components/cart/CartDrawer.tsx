'use client'

import { X, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { buildWhatsAppCheckoutURL } from '@/lib/whatsapp'
import CartItemRow from './CartItem'

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalPrice, clearCart } = useCart()

  if (!isOpen) return null

  function handleCheckout() {
    if (items.length === 0) return
    const url = buildWhatsAppCheckoutURL(items)
    window.open(url, '_blank')
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />
      <aside
        className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col shadow-2xl border-l"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <ShoppingBag size={18} style={{ color: 'var(--gold)' }} />
            Meu Carrinho
          </h2>
          <button
            onClick={closeCart}
            className="p-1 transition-opacity hover:opacity-60"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={48} style={{ color: 'var(--border)' }} />
              <p style={{ color: 'var(--text-muted)' }}>Seu carrinho está vazio</p>
              <button
                onClick={closeCart}
                className="text-sm hover:underline"
                style={{ color: 'var(--gold)' }}
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t px-5 py-5 space-y-4" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Total estimado</span>
              <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>
                R${totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full text-white font-semibold py-3 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
              style={{ background: '#25D366' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Finalizar via WhatsApp
            </button>
            <button
              onClick={clearCart}
              className="w-full text-sm transition-colors hover:text-red-400"
              style={{ color: 'var(--text-muted)' }}
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
