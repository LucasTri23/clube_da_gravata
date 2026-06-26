import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Clube da Gravata — Gravatas Premium & Moda Masculina',
  description:
    'Gravatas premium, ternos, camisas e prendedores de gravata. Estilo social masculino com qualidade e elegância. Enviamos para todo o Brasil.',
  keywords: ['gravata', 'terno', 'moda masculina', 'estilo social', 'gravata premium'],
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
