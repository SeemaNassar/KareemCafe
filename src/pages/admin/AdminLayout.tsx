import { Navigate, Outlet, NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export default function AdminLayout() {
  const { isAdmin, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="animate-pulse text-stone-400">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/admin/login" replace />

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-600 text-white' : 'text-stone-600 hover:bg-stone-100'
    }`

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-stone-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-stone-200 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white font-display text-sm font-bold">K</span>
          <span className="font-display font-bold text-stone-800">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <NavLink to="/admin" end className={navLink}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={navLink}>Products</NavLink>
          <NavLink to="/admin/categories" className={navLink}>Categories</NavLink>
          <NavLink to="/admin/orders" className={navLink}>Orders</NavLink>
          <NavLink to="/admin/offers" className={navLink}>Offers</NavLink>
          <NavLink to="/admin/gallery" className={navLink}>Gallery</NavLink>
          <NavLink to="/admin/settings" className={navLink}>Settings</NavLink>
        </nav>
        <div className="border-t border-stone-200 p-3 space-y-1">
          <Link to="/" className="block rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-stone-100">← View Site</Link>
          <button onClick={signOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50">Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4">
          <span className="font-display font-bold text-stone-800">Admin</span>
          <div className="flex gap-2">
            <Link to="/" className="text-sm text-stone-500">Site</Link>
            <button onClick={signOut} className="text-sm text-red-500">Out</button>
          </div>
        </header>
        <div className="md:hidden border-b border-stone-200 bg-white px-4 py-2 flex gap-2 overflow-x-auto">
          <NavLink to="/admin" end className="whitespace-nowrap rounded px-3 py-1 text-sm">Home</NavLink>
          <NavLink to="/admin/products" className="whitespace-nowrap rounded px-3 py-1 text-sm">Products</NavLink>
          <NavLink to="/admin/categories" className="whitespace-nowrap rounded px-3 py-1 text-sm">Categories</NavLink>
          <NavLink to="/admin/orders" className="whitespace-nowrap rounded px-3 py-1 text-sm">Orders</NavLink>
          <NavLink to="/admin/offers" className="whitespace-nowrap rounded px-3 py-1 text-sm">Offers</NavLink>
          <NavLink to="/admin/gallery" className="whitespace-nowrap rounded px-3 py-1 text-sm">Gallery</NavLink>
          <NavLink to="/admin/settings" className="whitespace-nowrap rounded px-3 py-1 text-sm">Settings</NavLink>
        </div>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
