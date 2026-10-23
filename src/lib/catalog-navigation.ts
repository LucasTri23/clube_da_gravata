/** Only allow a local catalogue route in the product's return link. */
export function catalogReturnURL(value: string | null, category?: string): string {
  if (value?.startsWith('/catalogo')) {
    try {
      const parsed = new URL(value, 'https://catalog.local')
      if (parsed.origin === 'https://catalog.local' && parsed.pathname === '/catalogo') {
        return parsed.pathname + parsed.search
      }
    } catch {}
  }
  return category ? `/catalogo?categoria=${encodeURIComponent(category)}` : '/catalogo'
}
