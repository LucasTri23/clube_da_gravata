import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/catalog/ProductCard'
import { createClient } from '@/lib/supabase-server'
import { Product } from '@/types'

const CATEGORIES = [
  { slug: 'ternos', label: 'Ternos', desc: 'Microfibra e oliviscose', emoji: '🤵' },
  { slug: 'gravatas', label: 'Gravatas', desc: 'Slim, tradicional e infantil', emoji: '👔' },
  { slug: 'camisas', label: 'Camisas', desc: 'Estilo e conforto', emoji: '👕' },
  { slug: 'prendedores', label: 'Prendedores', desc: 'Detalhes que fazem a diferença', emoji: '📎' },
]

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug,order_index)')
    .eq('active', true)
    .order('order_index', { ascending: true })
    .limit(8)
  return (data as Product[]) ?? []
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-36 relative">
          <div className="max-w-2xl">
            <p className="text-[#C9A84C] text-sm font-semibold tracking-widest uppercase mb-4">
              Estilo Premium
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Vista-se com{' '}
              <span className="text-[#C9A84C]">elegância</span>
            </h1>
            <p className="text-[#6b7280] text-lg mb-8 leading-relaxed">
              Gravatas premium, ternos e acessórios masculinos de alta qualidade.
              Enviamos para todo o Brasil.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/catalogo"
                className="bg-[#C9A84C] hover:bg-[#E2C87A] text-black font-bold px-8 py-3 rounded-lg transition-colors"
              >
                Ver Catálogo
              </Link>
              <a
                href="https://wa.me/5531995463588"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/10 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">
          Nossas <span className="text-[#C9A84C]">Categorias</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${cat.slug}`}
              className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#C9A84C]/50 hover:shadow-lg hover:shadow-[#C9A84C]/5 transition-all group text-center"
            >
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <h3 className="text-white font-semibold group-hover:text-[#C9A84C] transition-colors">
                {cat.label}
              </h3>
              <p className="text-[#6b7280] text-xs mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Destaques da <span className="text-[#C9A84C]">Loja</span>
            </h2>
            <Link href="/catalogo" className="text-[#C9A84C] text-sm hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-[#141414] to-[#1a1a1a] border border-[#C9A84C]/20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Dúvidas sobre algum produto?
          </h2>
          <p className="text-[#6b7280] mb-6">
            Fale conosco pelo WhatsApp e tire todas as suas dúvidas.
          </p>
          <a
            href="https://wa.me/5531995463588"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chamar no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
