import { useEffect, useState } from 'react'
import type { SiteSettings } from '../lib/types'
import { fetchSiteSettings } from '../lib/data'

export default function About() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 rounded bg-stone-200" />
          <div className="h-64 rounded-2xl bg-stone-200" />
          <div className="h-32 rounded bg-stone-200" />
        </div>
      ) : (
        <>
          <h1 className="font-display text-4xl font-bold text-stone-800 mb-6">
            {settings?.about_title ?? 'Our Story'}
          </h1>
          {settings?.about_image && (
            <img
              src={settings.about_image}
              alt="About"
              className="mb-8 w-full rounded-2xl object-cover"
            />
          )}
          <p className="text-lg leading-relaxed text-stone-600 whitespace-pre-line">
            {settings?.about_body ?? ''}
          </p>
        </>
      )}
    </div>
  )
}
