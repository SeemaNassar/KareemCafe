import { useEffect, useState, useCallback } from 'react'
import type { Category, ProductWithVariants } from '../../lib/types'
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  replaceVariants,
} from '../../lib/data'

interface VariantDraft {
  id?: number
  name: string
  price: string
  sort_order: number
}

interface ProductDraft {
  name: string
  description: string
  price: string
  image: string
  featured: boolean
  category_id: string
  hasVariants: boolean
  variants: VariantDraft[]
}

const emptyDraft: ProductDraft = {
  name: '',
  description: '',
  price: '0',
  image: '',
  featured: false,
  category_id: '',
  hasVariants: false,
  variants: [{ name: '', price: '', sort_order: 0 }],
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([p, c]) => {
        setProducts(p)
        setCategories(c)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditingId(null)
    setDraft(emptyDraft)
    setError(null)
    setShowModal(true)
  }

  const openEdit = (p: ProductWithVariants) => {
    setEditingId(p.id)
    setError(null)
    setDraft({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      image: p.image ?? '',
      featured: p.featured,
      category_id: p.category_id ? String(p.category_id) : '',
      hasVariants: p.variants.length > 0,
      variants:
        p.variants.length > 0
          ? p.variants.map(v => ({
              id: v.id,
              name: v.name,
              price: String(v.price),
              sort_order: v.sort_order,
            }))
          : [{ name: '', price: '', sort_order: 0 }],
    })
    setShowModal(true)
  }

  const addVariant = () => {
    setDraft(d => ({
      ...d,
      variants: [...d.variants, { name: '', price: '', sort_order: d.variants.length }],
    }))
  }

  const removeVariant = (idx: number) => {
    setDraft(d => ({
      ...d,
      variants: d.variants.filter((_, i) => i !== idx),
    }))
  }

  const moveVariant = (idx: number, dir: -1 | 1) => {
    setDraft(d => {
      const next = [...d.variants]
      const target = idx + dir
      if (target < 0 || target >= next.length) return d
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return { ...d, variants: next.map((v, i) => ({ ...v, sort_order: i })) }
    })
  }

  const updateVariant = (idx: number, field: keyof VariantDraft, value: string) => {
    setDraft(d => ({
      ...d,
      variants: d.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const categoryId = draft.category_id ? Number(draft.category_id) : null

      const productPayload = {
        name: draft.name,
        description: draft.description || null,
        price: Number(draft.price) || 0,
        image: draft.image || null,
        featured: draft.featured,
        category_id: categoryId,
      }

      if (editingId === null) {
        const variants = draft.hasVariants
          ? draft.variants
              .filter(v => v.name.trim() && v.price)
              .map((v, i) => ({
                name: v.name.trim(),
                price: Number(v.price),
                sort_order: i,
              }))
          : []
        await createProduct(productPayload, variants)
      } else {
        await updateProduct(editingId, productPayload)

        if (draft.hasVariants) {
          const variants = draft.variants
            .filter(v => v.name.trim() && v.price)
            .map((v, i) => ({
              name: v.name.trim(),
              price: Number(v.price),
              sort_order: i,
            }))
          await replaceVariants(editingId, variants)
        } else {
          await replaceVariants(editingId, [])
        }
      }

      setShowModal(false)
      load()
    } catch (err: any) {
      setError(err.message ?? 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      await deleteProduct(id)
      load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="animate-pulse text-stone-400">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-stone-800">Products</h1>
        <button onClick={openCreate} className="btn-primary">+ Add Product</button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-center text-stone-500 py-12">No products yet. Click "Add Product" to create one.</p>
        ) : (
          products.map(p => (
            <div key={p.id} className="card flex items-center gap-4 p-4">
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl">☕</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-800">{p.name}</h3>
                <p className="text-sm text-stone-500">
                  ${Number(p.price).toFixed(2)}
                  {p.variants.length > 0 && (
                    <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {p.variants.length} sizes
                    </span>
                  )}
                  {p.featured && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Featured
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="btn-secondary text-xs">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="btn-danger text-xs">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
              <h2 className="font-display text-xl font-bold text-stone-800">
                {editingId === null ? 'Add Product' : 'Edit Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  required
                  className="input"
                  value={draft.name}
                  onChange={e => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input"
                  rows={2}
                  value={draft.description}
                  onChange={e => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    value={draft.price}
                    onChange={e => setDraft({ ...draft, price: e.target.value })}
                    disabled={draft.hasVariants}
                  />
                  {draft.hasVariants && (
                    <p className="mt-1 text-xs text-stone-400">Price is set per variant</p>
                  )}
                </div>
                <div>
                  <label className="label">Category</label>
                  <select
                    className="input"
                    value={draft.category_id}
                    onChange={e => setDraft({ ...draft, category_id: e.target.value })}
                  >
                    <option value="">No category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Image URL</label>
                <input
                  className="input"
                  value={draft.image}
                  onChange={e => setDraft({ ...draft, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  checked={draft.featured}
                  onChange={e => setDraft({ ...draft, featured: e.target.checked })}
                />
                <span className="text-sm font-medium text-stone-700">Featured product</span>
              </label>

              <div className="border-t border-stone-200 pt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                    checked={draft.hasVariants}
                    onChange={e => setDraft({ ...draft, hasVariants: e.target.checked })}
                  />
                  <span className="text-sm font-semibold text-stone-700">
                    This product has size variants (e.g. Small, Medium, Large)
                  </span>
                </label>

                {draft.hasVariants && (
                  <div className="space-y-2">
                    <p className="text-xs text-stone-500">
                      Add sizes with individual prices. Use the arrows to reorder. The first size is the default.
                    </p>
                    {draft.variants.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveVariant(idx, -1)}
                            disabled={idx === 0}
                            className="text-stone-400 hover:text-stone-600 disabled:opacity-30 text-xs leading-none"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => moveVariant(idx, 1)}
                            disabled={idx === draft.variants.length - 1}
                            className="text-stone-400 hover:text-stone-600 disabled:opacity-30 text-xs leading-none"
                          >
                            ▼
                          </button>
                        </div>
                        <input
                          className="input flex-1"
                          placeholder="Size name (e.g. Small)"
                          value={v.name}
                          onChange={e => updateVariant(idx, 'name', e.target.value)}
                        />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="input w-28"
                          placeholder="Price"
                          value={v.price}
                          onChange={e => updateVariant(idx, 'price', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="btn-danger text-xs px-3 py-2"
                          disabled={draft.variants.length <= 1}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addVariant}
                      className="btn-secondary text-xs"
                    >
                      + Add Size
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
