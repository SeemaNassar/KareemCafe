export interface Category {
  id: number
  name: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  image: string | null
  featured: boolean
  category_id: number | null
  created_at: string
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  price: number
  sort_order: number
  created_at: string
}

export type ProductWithVariants = Product & {
  variants: ProductVariant[]
}

export interface Offer {
  id: number
  title: string
  description: string | null
  image: string | null
  active: boolean
  created_at: string
  product_id: number | null
  required_quantity: number | null
  discounted_price: number | null
}

export interface GalleryImage {
  id: number
  image: string
  active: boolean
  created_at: string
}

export interface SiteSettings {
  id: number
  about_title: string
  about_body: string
  about_image: string | null
  hero_tagline: string | null
  updated_at: string
}

export interface Order {
  id: number
  customer_name: string
  customer_phone: string
  customer_address: string
  notes: string
  order_type: string
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number | null
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
  created_at: string
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

export interface CartItem {
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
  image: string | null
  variant_id: number | null
  variant_name: string | null
}
