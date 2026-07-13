import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchOrders, fetchCategories } from '../../lib/data'
import type { ProductWithVariants, OrderWithItems, Category } from '../../lib/types'

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders(), fetchCategories()])
      .then(([p, o, c]) => {
        setProducts(p)
        setOrders(o)
        setCategories(c)
      })
      .finally(() => setLoading(false))
  }, [])

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const variantCount = products.reduce((sum, p) => sum + p.variants.length, 0)

  if (loading) return <div className="animate-pulse text-stone-400">Loading...</div>

  const stats = [
    { label: 'Products', value: products.length, link: '/admin/products' },
    { label: 'Categories', value: categories.length, link: '/admin/categories' },
    { label: 'Orders', value: orders.length, link: '/admin/orders' },
    { label: 'Revenue', value: `$${revenue.toFixed(2)}`, link: '/admin/orders' },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} to={s.link} className="card p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-stone-500">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-stone-800">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold text-stone-800 mb-3">Products with Variants</h2>
          <p className="text-3xl font-bold text-brand-600">{variantCount}</p>
          <p className="text-sm text-stone-500 mt-1">
            {products.filter(p => p.variants.length > 0).length} products have size variants
          </p>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-stone-800 mb-3">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-stone-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2">
              {orders.slice(0, 5).map(o => (
                <li key={o.id} className="flex justify-between text-sm">
                  <span className="text-stone-600">{o.customer_name || 'Unknown'}</span>
                  <span className="font-medium">${Number(o.total).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
