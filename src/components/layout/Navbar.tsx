'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

function TieLogo() {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ border: '2px solid var(--gold)', background: 'var(--bg)' }}
    >
      <svg width="18" height="22" viewBox="0 0 18 24" fill="none">
        <path d="M5.5 2L9 7.5" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12.5 2L9 7.5" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="9" cy="9.2" rx="2.3" ry="1.8" fill="var(--gold)" />
        <path d="M6.7 10.8L5.2 23L9 25L12.8 23L11.3 10.8Z" fill="var(--gold)" />
      </svg>
    </div>
  )
}

const NAV_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/catalogo?categoria=ternos', label: 'Ternos' },
  { href: '/catalogo?categoria=gravatas', label: 'Gravatas' },
]

export default function Navbar() {
  const { totalItems, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur border-b"
      style={{ background: 'var(--navbar-bg)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <TieLogo />
          <div className="leading-none">
            <span
              className="font-bold tracking-[0.12em] text-sm uppercase block"
              style={{ color: 'var(--text)' }}
            >
              Clube da Gravata
            </span>
            <span
              className="text-[9px] tracking-[0.2em] uppercase"
              style={{ color: 'var(--gold)' }}
            >
              Moda Masculina
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide transition-opacity hover:opacity-60"
              style={{ color: 'var(--text-sub)' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <button
            onClick={openCart}
            className="relative p-2 transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-sub)' }}
            aria-label="Carrinho"
          >
            <ShoppingCart size={21} />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                style={{ background: 'var(--gold)' }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2"
            style={{ color: 'var(--text-sub)' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-5 flex flex-col gap-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {NAV_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide"
              style={{ color: 'var(--text-sub)' }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
