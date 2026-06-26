'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { totalItems, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-black font-bold text-xs">
            CG
          </div>
          <span className="font-bold text-white tracking-wider text-sm uppercase">
            Clube da Gravata
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm text-[#e0e0e0] hover:text-[#C9A84C] transition-colors"
          >
            Início
          </Link>
          <Link
            href="/catalogo"
            className="text-sm text-[#e0e0e0] hover:text-[#C9A84C] transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/catalogo?categoria=ternos"
            className="text-sm text-[#e0e0e0] hover:text-[#C9A84C] transition-colors"
          >
            Ternos
          </Link>
          <Link
            href="/catalogo?categoria=gravatas"
            className="text-sm text-[#e0e0e0] hover:text-[#C9A84C] transition-colors"
          >
            Gravatas
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative p-2 text-[#e0e0e0] hover:text-[#C9A84C] transition-colors"
            aria-label="Carrinho"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C9A84C] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 text-[#e0e0e0]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] bg-[#141414] px-4 py-4 flex flex-col gap-4">
          <Link
            href="/"
            className="text-sm text-[#e0e0e0]"
            onClick={() => setMenuOpen(false)}
          >
            Início
          </Link>
          <Link
            href="/catalogo"
            className="text-sm text-[#e0e0e0]"
            onClick={() => setMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link
            href="/catalogo?categoria=ternos"
            className="text-sm text-[#e0e0e0]"
            onClick={() => setMenuOpen(false)}
          >
            Ternos
          </Link>
          <Link
            href="/catalogo?categoria=gravatas"
            className="text-sm text-[#e0e0e0]"
            onClick={() => setMenuOpen(false)}
          >
            Gravatas
          </Link>
        </div>
      )}
    </header>
  )
}
