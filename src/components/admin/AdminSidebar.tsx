'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FileUp,
  Quote,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/depoimentos', label: 'Depoimentos', icon: Quote },
  { href: '/admin/importar-pdf', label: 'Importar PDF', icon: FileUp },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  function isActive(href: string) {
    return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[#141414] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center text-black font-bold text-xs">
            CG
          </div>
          <span className="text-white font-semibold text-sm">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="p-2 text-[#e0e0e0]"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {mobileOpen && (
        <nav className="md:hidden fixed top-14 left-0 right-0 z-40 bg-[#141414] border-b border-[#2a2a2a] p-4 space-y-1 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-[#C9A84C]/15 text-[#C9A84C]'
                  : 'text-[#6b7280] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <div className="border-t border-[#2a2a2a] mt-2 pt-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors mb-1"
            >
              Ver site →
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6b7280] hover:text-red-400 transition-colors w-full"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#141414] border-r border-[#2a2a2a] flex-col z-30 hidden md:flex">
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-black font-bold text-xs">
              CG
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Clube da Gravata</p>
              <p className="text-[#6b7280] text-xs">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-[#C9A84C]/15 text-[#C9A84C]'
                  : 'text-[#6b7280] hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6b7280] hover:text-white hover:bg-[#2a2a2a] transition-colors mb-1"
          >
            Ver site →
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6b7280] hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
