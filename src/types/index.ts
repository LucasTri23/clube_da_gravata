export interface Category {
  id: string
  name: string
  slug: string
  order_index: number
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string
  images: string[]
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface Testimonial {
  id: string
  client_name: string
  feedback: string
  photo_url: string | null
  order_index: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export type AnalyticsEventType = 'view' | 'cart_add' | 'whatsapp_click'

export interface AnalyticsEvent {
  id: string
  event_type: AnalyticsEventType
  product_id: string | null
  session_id: string | null
  created_at: string
}

export interface DashboardStats {
  totalProducts: number
  productsByCategory: { category: string; count: number }[]
  viewsToday: number
  whatsappClicksToday: number
  topCartProducts: { product_id: string; name: string; count: number }[]
}
