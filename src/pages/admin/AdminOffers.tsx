import { useEffect, useState, useCallback } from 'react'
import type { Offer, ProductWithVariants } from '../../lib/types'
import { fetchOffers, fetchProducts, createOffer, deleteOffer } from '../../lib/data'

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    product_id: '',
    required_quantity: '1',
    discounted_price: '',
  })

  const load = useCallback(() => {
    Promise.all([fetchOffers(), fetchProducts()])
      .then(([o, p]) => {
        setOffers(o)
        setProducts(p)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createOffer({
        title: form.title,
        description: form.description || null,
        image: form.image || null,
        active: true,
        product_id: form.product_id ? Number(form.product_id) : null,
        required_quantity: Number(form.required_quantity) || null,
        discounted_price: form.discounted_price ? Number(form.discounted_price) : null,
      })
      setForm({ title: '', description: '', image: '', product_id: '', required_quantity: '1', discounted_price: '' })
      load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this offer?')) return
    try {
      await deleteOffer(id)
      load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="animate-pulse text-stone-400">Loading...</div>

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Offers</h1>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Product</label>
            <select className="input" value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })}>
              <option value="">No product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <input className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Required Qty</label>
            <input type="number" min="1" className="input" value={form.required_quantity} onChange={e => setForm({ ...form, required_quantity: e.target.value })} />
          </div>
          <div>
            <label className="label">Discounted Price</label>
            <input type="number" step="0.01" min="0" className="input" value={form.discounted_price} onChange={e => setForm({ ...form, discounted_price: e.target.value })} />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          </div>
        </div>
        <button type="submit" className="btn-primary">+ Add Offer</button>
      </form>

      <div className="space-y-2">
        {offers.map(o => (
          <div key={o.id} className="card flex items-center justify-between p-4">
            <div>
              <span className="font-semibold text-stone-800">{o.title}</span>
              {o.description && <p className="text-sm text-stone-500">{o.description}</p>}
            </div>
            <button onClick={() => handleDelete(o.id)} className="btn-danger text-xs">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
