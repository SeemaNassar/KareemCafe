import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { createOrder } from '../lib/data'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    notes: '',
    order_type: 'delivery',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deliveryFee = form.order_type === 'delivery' ? (subtotal >= 25 ? 0 : 3) : 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)

    try {
      const orderItems = items.map(i => ({
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price: i.unit_price,
        line_total: i.unit_price * i.quantity,
      }))

      await createOrder(
        {
          ...form,
          subtotal,
          discount: 0,
          delivery_fee: deliveryFee,
          total,
        },
        orderItems,
      )

      clearCart()
      navigate('/cart')
    } catch (err: any) {
      setError(err.message ?? 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-stone-800">No items to checkout</h2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-stone-800">Customer Details</h2>
          <div>
            <label className="label">Name</label>
            <input
              required
              className="input"
              value={form.customer_name}
              onChange={e => setForm({ ...form, customer_name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              required
              className="input"
              value={form.customer_phone}
              onChange={e => setForm({ ...form, customer_phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea
              className="input"
              rows={2}
              value={form.customer_address}
              onChange={e => setForm({ ...form, customer_address: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Order Type</label>
            <select
              className="input"
              value={form.order_type}
              onChange={e => setForm({ ...form, order_type: e.target.value })}
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={2}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="card p-6 h-fit">
          <h2 className="font-semibold text-stone-800 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-stone-600">{item.product_name} × {item.quantity}</span>
                <span className="font-medium">${(item.unit_price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Delivery Fee</span>
              <span className="font-medium">{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-stone-200">
              <span>Total</span>
              <span className="text-brand-700">${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}
