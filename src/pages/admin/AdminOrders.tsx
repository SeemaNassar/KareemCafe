import { useEffect, useState, useCallback } from 'react'
import type { OrderWithItems } from '../../lib/types'
import { fetchOrders } from '../../lib/data'

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="animate-pulse text-stone-400">Loading...</div>

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-stone-500 py-12">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div>
                  <span className="font-semibold text-stone-800">Order #{o.id}</span>
                  <span className="ml-2 text-sm text-stone-500">
                    {new Date(o.created_at).toLocaleString()}
                  </span>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase text-brand-700">
                  {o.order_type}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-stone-600"><span className="font-medium">Customer:</span> {o.customer_name || '—'}</p>
                  <p className="text-stone-600"><span className="font-medium">Phone:</span> {o.customer_phone || '—'}</p>
                  <p className="text-stone-600"><span className="font-medium">Address:</span> {o.customer_address || '—'}</p>
                  {o.notes && <p className="text-stone-600"><span className="font-medium">Notes:</span> {o.notes}</p>}
                </div>
                <div>
                  <ul className="space-y-1">
                    {o.order_items.map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span className="text-stone-600">{item.product_name} × {item.quantity}</span>
                        <span className="font-medium">${Number(item.line_total).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 border-t border-stone-200 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-brand-700">${Number(o.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
