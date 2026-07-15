import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import { Testimonial } from '@/types'
import DeleteTestimonialButton from '@/components/admin/DeleteTestimonialButton'

async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
  return (data as Testimonial[]) ?? []
}

export default async function AdminDepoimentosPage() {
  const testimonials = await getTestimonials()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Depoimentos</h1>
          <p className="text-[#6b7280] text-sm mt-1">{testimonials.length} depoimento(s)</p>
        </div>
        <Link
          href="/admin/depoimentos/novo"
          className="bg-[#C9A84C] hover:bg-[#E2C87A] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + Novo Depoimento
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-20 bg-[#141414] border border-[#2a2a2a] rounded-xl">
          <p className="text-[#6b7280] mb-4">Nenhum depoimento cadastrado ainda.</p>
          <Link
            href="/admin/depoimentos/novo"
            className="text-[#C9A84C] hover:underline text-sm"
          >
            Criar primeiro depoimento →
          </Link>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left text-xs text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Cliente
                </th>
                <th className="text-left text-xs text-[#6b7280] uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                  Depoimento
                </th>
                <th className="text-left text-xs text-[#6b7280] uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr
                  key={t.id}
                  className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                        {t.photo_url ? (
                          <Image
                            src={t.photo_url}
                            alt={t.client_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6b7280] text-xs">
                            —
                          </div>
                        )}
                      </div>
                      <span className="text-white text-sm font-medium line-clamp-1">
                        {t.client_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-[#6b7280] text-sm line-clamp-1 max-w-xs block">
                      {t.feedback}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        t.active
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-[#2a2a2a] text-[#6b7280]'
                      }`}
                    >
                      {t.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/depoimentos/${t.id}`}
                        className="text-xs text-[#6b7280] hover:text-[#C9A84C] transition-colors"
                      >
                        Editar
                      </Link>
                      <DeleteTestimonialButton id={t.id} name={t.client_name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
