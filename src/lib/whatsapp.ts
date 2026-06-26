import { CartItem } from '@/types'

const PHONE = '5531995463588'

export function buildWhatsAppCheckoutURL(items: CartItem[]): string {
  const lines = items.map(
    (item, i) =>
      `${i + 1}. ${item.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''} - R$${(item.price * item.quantity).toFixed(2).replace('.', ',')}`
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
