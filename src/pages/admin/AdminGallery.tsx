import { useEffect, useState, useCallback } from 'react'
import type { GalleryImage } from '../../lib/types'
import { fetchGallery, createGalleryImage, deleteGalleryImage } from '../../lib/data'

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    fetchGallery()
      .then(setImages)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setError(null)
    try {
      await createGalleryImage(url.trim())
      setUrl('')
      load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return
    try {
      await deleteGalleryImage(id)
      load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="animate-pulse text-stone-400">Loading...</div>

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Gallery</h1>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleAdd} className="card mb-6 flex gap-3 p-4">
        <input
          className="input flex-1"
          placeholder="Image URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button type="submit" className="btn-primary">Add Image</button>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            <img src={img.image} alt="" className="h-full w-full object-cover" />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
