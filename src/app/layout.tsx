import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Clube da Gravata — Gravatas Premium & Estilo Social',
  description:
    'Gravatas premium, ternos, camisas e prendedores. Estilo social para o homem moderno. Enviamos para todo o Brasil.',
  keywords: ['gravata', 'terno', 'moda masculina', 'estilo social', 'gravata premium'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="bg-[#0a0a0a] text-[#ededed] min-h-screen">
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
