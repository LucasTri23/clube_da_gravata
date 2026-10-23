import { CartItem } from '@/types'

const PHONE = '5531995463588'

function productLink(id: string, origin?: string): string {
  const base = origin || process.env.NEXT_PUBLIC_SITE_URL
  return base ? new URL(`/produto/${encodeURIComponent(id)}`, base).href : ''
}

export function buildWhatsAppCheckoutURL(items: CartItem[], origin?: string): string {
  const lines = items.map(
    (item, i) =>
      [
        `${i + 1}. ${item.name} (x${item.quantity}) - R$${(item.price * item.quantity).toFixed(2).replace('.', ',')}`,
        productLink(item.id, origin),
      ].filter(Boolean).join('\n')
  )
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const text = [
    'Olá! Tenho interesse nos seguintes itens do Clube da Gravata:',
    '',
    ...lines,
    '',
    `*Total estimado: R$${total.toFixed(2).replace('.', ',')}*`,
    '',
    'Poderia me ajudar a finalizar o pedido?',
  ].join('\n')

  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}

export function buildWhatsAppSupportURL(): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre os produtos do Clube da Gravata.')}`
}

export function buildWhatsAppProductURL(product: { id: string; name: string; price: number }, origin?: string): string {
  const text = [`Olá! Tenho interesse neste produto do Clube da Gravata:\n\n*${product.name}*\nR$${product.price.toFixed(2).replace('.', ',')}`, productLink(product.id, origin)].filter(Boolean).join('\n')
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`
}
