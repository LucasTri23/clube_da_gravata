import { NextRequest, NextResponse } from 'next/server'
import { createClient, isAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const categoria = searchParams.get('categoria')

  let query = supabase
    .from('products')
    .select('*, category:categories(id,name,slug,order_index)')
    .eq('active', true)
    .order('order_index', { ascending: true })

  if (categoria) {
    query = query.eq('categories.slug', categoria)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdmin(supabase))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name, description, price, category_slug, images, active } = body

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category_slug)
    .single()

  if (!category) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price,
      category_id: category.id,
      images: images ?? [],
      active: active ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
