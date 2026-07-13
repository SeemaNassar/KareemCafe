import { useEffect, useState } from 'react'
import { fetchSiteSettings, updateSiteSettings } from '../../lib/data'

export default function AdminSettings() {
  const [form, setForm] = useState({
    about_title: '',
    about_body: '',
    about_image: '',
    hero_tagline: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSiteSettings()
      .then(s => {
        if (s) {
          setForm({
            about_title: s.about_title ?? '',
            about_body: s.about_body ?? '',
            about_image: s.about_image ?? '',
            hero_tagline: s.hero_tagline ?? '',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await updateSiteSettings({
        about_title: form.about_title,
        about_body: form.about_body,
        about_image: form.about_image || null,
        hero_tagline: form.hero_tagline || null,
      })
      setSaved(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse text-stone-400">Loading...</div>

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Settings</h1>

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-6">
        <div>
          <label className="label">Hero Tagline</label>
          <input className="input" value={form.hero_tagline} onChange={e => setForm({ ...form, hero_tagline: e.target.value })} />
        </div>
        <div>
          <label className="label">About Title</label>
          <input className="input" value={form.about_title} onChange={e => setForm({ ...form, about_title: e.target.value })} />
        </div>
        <div>
          <label className="label">About Body</label>
          <textarea className="input" rows={5} value={form.about_body} onChange={e => setForm({ ...form, about_body: e.target.value })} />
        </div>
        <div>
          <label className="label">About Image URL</label>
          <input className="input" value={form.about_image} onChange={e => setForm({ ...form, about_image: e.target.value })} />
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
        {saved && <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-600">Settings saved!</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
