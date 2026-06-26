import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { AnalyticsEventType } from '@/types'

const VALID_EVENTS: AnalyticsEventType[] = ['view', 'cart_add', 'whatsapp_click']

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { event_type, product_id } = body

  if (!VALID_EVENTS.includes(event_type)) {
    return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
  }

  const supabase = await createClient()
  const session_id = req.cookies.get('session_id')?.value ?? null

  await supabase.from('analytics_events').insert({
    event_type,
    product_id: product_id ?? null,
    session_id,
  })

  return NextResponse.json({ ok: true })
}
