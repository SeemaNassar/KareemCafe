import { useEffect, useState, useCallback } from 'react'
import type { Category } from '../../lib/types'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../lib/data'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    try {
      if (editingId) {
        await updateCategory(editingId, name.trim())
      } else {
        await createCategory(name.trim())
      }
      setName('')
      setEditingId(null)
      load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="animate-pulse text-stone-400">Loading...</div>

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Categories</h1>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="card mb-6 flex gap-3 p-4">
        <input
          className="input flex-1"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setName('') }} className="btn-secondary">
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-2">
        {categories.map(c => (
          <div key={c.id} className="card flex items-center justify-between p-4">
            <span className="font-medium text-stone-800">{c.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingId(c.id); setName(c.name) }}
                className="btn-secondary text-xs"
              >
                Edit
              </button>
              <button onClick={() => handleDelete(c.id)} className="btn-danger text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
