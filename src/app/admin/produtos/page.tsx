import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-server'
import { Product } from '@/types'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(id,name,slug,order_index)')
    .order('created_at', { ascending: false })
  return (data as Product[]) ?? []
}

export default async function AdminProdutosPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-[#6b7280] text-sm mt-1">{products.length} produto(s)</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/admin/importar-pdf"
            className="bg-[#141414] border border-[#2a2a2a] hover:border-[#C9A84C] text-[#e0e0e0] font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Importar PDF
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="bg-[#C9A84C] hover:bg-[#E2C87A] text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            + Novo Produto
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-[#141414] border border-[#2a2a2a] rounded-xl">
          <p className="text-[#6b7280] mb-4">Nenhum produto cadastrado ainda.</p>
          <Link
            href="/admin/produtos/novo"
            className="text-[#C9A84C] hover:underline text-sm"
          >
            Criar primeiro produto →
          </Link>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left text-xs text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Produto
                </th>
                <th className="text-left text-xs text-[#6b7280] uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                  Categoria
                </th>
                <th className="text-left text-xs text-[#6b7280] uppercase tracking-wider px-5 py-3">
                  Preço
                </th>
                <th className="text-left text-xs text-[#6b7280] uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name}
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
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-[#6b7280] text-sm">
                      {p.category?.name ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[#C9A84C] font-semibold text-sm">
                      R${p.price.toFixed(2).replace('.', ',')}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.active
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-[#2a2a2a] text-[#6b7280]'
                      }`}
                    >
                      {p.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/produtos/${p.id}`}
                        className="text-xs text-[#6b7280] hover:text-[#C9A84C] transition-colors"
                      >
                        Editar
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
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
