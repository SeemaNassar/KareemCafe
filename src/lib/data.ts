import { supabase } from './supabase'
import type {
  Category,
  Product,
  ProductVariant,
  ProductWithVariants,
  Offer,
  GalleryImage,
  SiteSettings,
  Order,
  OrderItem,
  OrderWithItems,
} from './types'

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('id')
  if (error) throw error
  return data ?? []
}

export async function fetchProducts(): Promise<ProductWithVariants[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  const rows = (data ?? []) as any[]
  return rows.map(p => ({
    ...p,
    variants: (p.variants ?? []).sort(
      (a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order,
    ),
  }))
}

export async function fetchFeaturedProducts(): Promise<ProductWithVariants[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('featured', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  const rows = (data ?? []) as any[]
  return rows.map(p => ({
    ...p,
    variants: (p.variants ?? []).sort(
      (a: ProductVariant, b: ProductVariant) => a.sort_order - b.sort_order,
    ),
  }))
}

export async function fetchOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  return data
}

export async function fetchOrders(): Promise<OrderWithItems[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as OrderWithItems[]
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at'>,
  items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[],
): Promise<Order> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  if (orderError) throw orderError
  const newOrder = orderData as Order

  const itemsWithOrderId = items.map(i => ({ ...i, order_id: newOrder.id }))
  const { error: itemsError } = await supabase.from('order_items').insert(itemsWithOrderId)
  if (itemsError) throw itemsError

  return newOrder
}

// ---- Admin mutations ----

export async function createProduct(
  product: Omit<Product, 'id' | 'created_at'>,
  variants: Omit<ProductVariant, 'id' | 'product_id' | 'created_at'>[],
): Promise<ProductWithVariants> {
  const { data, error } = await supabase.from('products').insert(product).select().single()
  if (error) throw error
  const created = data as Product

  let createdVariants: ProductVariant[] = []
  if (variants.length > 0) {
    const rows = variants.map(v => ({ ...v, product_id: created.id }))
    const { data: vData, error: vError } = await supabase
      .from('product_variants')
      .insert(rows)
      .select()
      .order('sort_order')
    if (vError) throw vError
    createdVariants = (vData ?? []) as ProductVariant[]
  }

  return { ...created, variants: createdVariants }
}

export async function updateProduct(
  id: number,
  product: Partial<Omit<Product, 'id' | 'created_at'>>,
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function replaceVariants(
  productId: number,
  variants: Omit<ProductVariant, 'id' | 'product_id' | 'created_at'>[],
): Promise<ProductVariant[]> {
  await supabase.from('product_variants').delete().eq('product_id', productId)

  if (variants.length === 0) return []

  const rows = variants.map(v => ({ ...v, product_id: productId }))
  const { data, error } = await supabase
    .from('product_variants')
    .insert(rows)
    .select()
    .order('sort_order')
  if (error) throw error
  return (data ?? []) as ProductVariant[]
}

export async function createCategory(name: string): Promise<Category> {
  const { data, error } = await supabase.from('categories').insert({ name }).select().single()
  if (error) throw error
  return data as Category
}

export async function updateCategory(id: number, name: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ name }).eq('id', id)
  if (error) throw error
}

export async function deleteCategory(id: number): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const { error } = await supabase.from('site_settings').update(settings).eq('id', 1)
  if (error) throw error
}

export async function createGalleryImage(image: string): Promise<void> {
  const { error } = await supabase.from('gallery').insert({ image })
  if (error) throw error
}

export async function deleteGalleryImage(id: number): Promise<void> {
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw error
}

export async function createOffer(offer: Omit<Offer, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('offers').insert(offer)
  if (error) throw error
}

export async function deleteOffer(id: number): Promise<void> {
  const { error } = await supabase.from('offers').delete().eq('id', id)
  if (error) throw error
}
