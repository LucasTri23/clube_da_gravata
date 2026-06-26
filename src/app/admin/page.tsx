import { createClient } from '@/lib/supabase-server'
import StatsCard from '@/components/admin/StatsCard'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const [productsRes, viewsRes, waClicksRes, cartAddsRes, categoryRes] =
    await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'view')
        .gte('created_at', todayISO),
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'whatsapp_click')
        .gte('created_at', todayISO),
      supabase
        .from('analytics_events')
        .select('product_id')
        .eq('event_type', 'cart_add'),
      supabase
        .from('products')
        .select('category:categories(name)', { count: 'exact' })
        .eq('active', true),
    ])

  const topMap: Record<string, number> = {}
  for (const ev of cartAddsRes.data ?? []) {
    if (ev.product_id) topMap[ev.product_id] = (topMap[ev.product_id] ?? 0) + 1
  }
  const topProductIds = Object.entries(topMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)

  let topProducts: { id: string; name: string; count: number }[] = []
  if (topProductIds.length > 0) {
    const { data: pData } = await supabase
      .from('products')
      .select('id, name')
      .in('id', topProductIds)
    topProducts = (pData ?? []).map(p => ({
      id: p.id,
      name: p.name,
      count: topMap[p.id] ?? 0,
    })).sort((a, b) => b.count - a.count)
  }

  const catMap: Record<string, number> = {}
  for (const p of categoryRes.data ?? []) {
    const item = p as unknown as { category?: { name: string } }
    const name = item.category?.name ?? 'Sem categoria'
    catMap[name] = (catMap[name] ?? 0) + 1
  }

  return {
    totalProducts: productsRes.count ?? 0,
    viewsToday: viewsRes.count ?? 0,
    waClicksToday: waClicksRes.count ?? 0,
    topProducts,
    categoryStats: Object.entries(catMap),
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Visão geral da loja
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Produtos Ativos"
          value={stats.totalProducts}
          color="gold"
        />
        <StatsCard
          title="Visualizações Hoje"
          value={stats.viewsToday}
          color="blue"
        />
        <StatsCard
          title="Cliques WhatsApp Hoje"
          value={stats.waClicksToday}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Produtos por Categoria</h2>
          {stats.categoryStats.length === 0 ? (
            <p className="text-[#6b7280] text-sm">Nenhum produto cadastrado.</p>
          ) : (
            <div className="space-y-3">
              {stats.categoryStats.map(([cat, count]) => (
                <div key={cat} className="flex justify-between items-center">
                  <span className="text-[#e0e0e0] text-sm">{cat}</span>
                  <span className="text-[#C9A84C] font-bold text-sm">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">
            Top 5 — Mais Adicionados ao Carrinho
          </h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-[#6b7280] text-sm">Nenhum evento ainda.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={p.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C9A84C] text-sm font-bold w-5">
                      {i + 1}.
                    </span>
                    <span className="text-[#e0e0e0] text-sm truncate max-w-[200px]">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[#6b7280] text-sm">{p.count}x</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex gap-4 flex-wrap">
        <Link
          href="/admin/produtos/novo"
          className="bg-[#C9A84C] hover:bg-[#E2C87A] text-black font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          + Novo Produto
        </Link>
        <Link
          href="/admin/importar-pdf"
          className="bg-[#141414] border border-[#2a2a2a] hover:border-[#C9A84C] text-[#e0e0e0] font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          Importar PDF
        </Link>
      </div>
    </div>
  )
}
