import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/catalog/ProductCard'
import { createClient } from '@/lib/supabase-server'
import { Product, Testimonial } from '@/types'

const CATEGORIES = [
  { slug: 'ternos', label: 'Ternos', desc: 'Do clássico ao contemporâneo' },
  { slug: 'feminino', label: 'Feminino', desc: 'Blazers, ternos e peças elegantes' },
  { slug: 'infantil', label: 'Infantil', desc: 'Ternos para os pequenos' },
  { slug: 'gravatas', label: 'Gravatas', desc: 'Slim, tradicional e infantil' },
  { slug: 'camisas', label: 'Camisas', desc: 'Corte e qualidade para cada ocasião' },
  { slug: 'prendedores', label: 'Prendedores', desc: 'O detalhe que eleva o look' },
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

async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('active', true)
    .order('order_index', { ascending: true })
  return (data as Testimonial[]) ?? []
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()
  const testimonials = await getTestimonials()

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 20% 40%, var(--hero-glow), transparent)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-16 md:pt-24 md:pb-24 relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-10" style={{ background: 'var(--gold)' }} />
                <p
                  className="text-xs font-semibold tracking-[0.35em] uppercase"
                  style={{ color: 'var(--gold)' }}
                >
                  Moda Masculina Premium
                </p>
              </div>

              <h1
                className="text-5xl md:text-6xl font-bold leading-[1.04] mb-7"
                style={{ color: 'var(--text)' }}
              >
                Vista-se com<br />
                <span style={{ color: 'var(--gold)' }}>elegância.</span>
              </h1>

              <p className="text-lg mb-10 max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Ternos, gravatas e acessórios de alta qualidade para o homem que valoriza cada detalhe.
                Enviamos para todo o Brasil.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/catalogo"
                  className="font-bold px-8 py-3.5 rounded text-sm tracking-wide transition-opacity hover:opacity-85"
                  style={{ background: 'var(--gold)', color: '#000' }}
                >
                  Ver Catálogo
                </Link>
                <a
                  href="https://wa.me/5531995463588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold px-8 py-3.5 rounded text-sm tracking-wide border transition-opacity hover:opacity-75"
                  style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            <div className="relative">
              <div
                className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden border"
                style={{ borderColor: 'var(--border-gold)' }}
              >
                <Image
                  src="/hero-bg.png"
                  alt="Cliente Clube da Gravata"
                  fill
                  priority
                  className="object-cover object-[75%_15%]"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(0deg, var(--bg) 0%, transparent 25%)',
                  }}
                />
              </div>
              <div
                className="absolute -bottom-4 -left-4 h-24 w-24 rounded-2xl -z-10"
                style={{ background: 'var(--hero-glow)' }}
              />
            </div>
          </div>
        </div>

        <div
          className="h-px max-w-7xl mx-auto"
          style={{ background: 'linear-gradient(90deg, var(--gold) 0%, transparent 60%)' }}
        />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center gap-5 mb-12">
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          <p className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: 'var(--gold)' }}>
            Nossas Categorias
          </p>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/catalogo?categoria=${cat.slug}`}
              className="category-card group block rounded-xl p-6 border transition-all duration-300"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div
                className="h-0.5 w-8 mb-5 rounded transition-all duration-300 group-hover:w-14"
                style={{ background: 'var(--gold)' }}
              />
              <h3 className="font-bold text-base mb-1.5" style={{ color: 'var(--text)' }}>
                {cat.label}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {cat.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--gold)' }}>
                Seleção
              </p>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>
                Destaques da Loja
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-sm font-medium transition-opacity hover:opacity-60"
              style={{ color: 'var(--gold)' }}
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex items-center gap-5 mb-12">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <p className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: 'var(--gold)' }}>
              O Que Dizem Nossos Clientes
            </p>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="rounded-xl p-7 border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <p
                  className="text-3xl font-serif leading-none mb-3"
                  style={{ color: 'var(--gold)' }}
                >
                  &ldquo;
                </p>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-sub)' }}>
                  {t.feedback}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border"
                    style={{ borderColor: 'var(--border-gold)' }}
                  >
                    {t.photo_url ? (
                      <Image src={t.photo_url} alt={t.client_name} fill className="object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'var(--bg-card-2)', color: 'var(--gold)' }}
                      >
                        {t.client_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {t.client_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div
          className="rounded-2xl p-10 md:p-16 text-center border relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 70% at 50% 110%, var(--hero-glow), transparent)',
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-8" style={{ background: 'var(--border)' }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--gold)' }}>
                Atendimento
              </span>
              <div className="h-px w-8" style={{ background: 'var(--border)' }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Dúvidas sobre algum produto?
            </h2>
            <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
              Nossa equipe está pronta para te ajudar a encontrar o look perfeito.
            </p>
            <a
              href="https://wa.me/5531995463588"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-white font-semibold px-8 py-3.5 rounded text-sm transition-opacity hover:opacity-85"
              style={{ background: '#25D366' }}
            >
              <WaSvg />
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function WaSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
