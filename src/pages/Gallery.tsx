import { useEffect, useState } from 'react'
import type { GalleryImage } from '../lib/types'
import { fetchGallery } from '../lib/data'

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
      .then(setImages)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-stone-800 mb-2">Gallery</h1>
      <p className="text-stone-500 mb-8">A glimpse into our world</p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-stone-200" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-stone-500 py-16">No gallery images yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="aspect-square overflow-hidden rounded-xl bg-stone-100">
              <img
                src={img.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
