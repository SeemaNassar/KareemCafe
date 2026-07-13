import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProductWithVariants, SiteSettings } from '../lib/types'
import { fetchFeaturedProducts, fetchSiteSettings } from '../lib/data'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState<ProductWithVariants[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchFeaturedProducts(), fetchSiteSettings()])
      .then(([p, s]) => {
        setFeatured(p)
        setSettings(s)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-brand-900">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold text-white md:text-6xl">
              Cafe Kareem
            </h1>
            <p className="mt-4 text-lg text-stone-300 md:text-xl">
              {settings?.hero_tagline ?? 'Premium Coffee, Desserts & Mojitos'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary bg-brand-500 hover:bg-brand-400">
                View Menu
              </Link>
              <Link to="/about" className="btn border border-white/30 text-white hover:bg-white/10">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-stone-800">Featured Items</h2>
            <p className="mt-1 text-stone-500">Our most loved selections</p>
          </div>
          <Link to="/menu" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-80" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-stone-500 text-center py-12">No featured items yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
