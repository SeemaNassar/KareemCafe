import { Outlet, Link, NavLink } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { useState } from 'react'

export default function Layout() {
  const { totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-700' : 'text-stone-600 hover:text-brand-600'
    }`

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white font-display text-lg font-bold">
                K
              </span>
              <span className="font-display text-xl font-bold text-stone-800">Cafe Kareem</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <NavLink to="/" className={navLink} end>Home</NavLink>
              <NavLink to="/menu" className={navLink}>Menu</NavLink>
              <NavLink to="/gallery" className={navLink}>Gallery</NavLink>
              <NavLink to="/about" className={navLink}>About</NavLink>
              <Link to="/admin/login" className="text-sm font-medium text-stone-500 hover:text-brand-600 transition-colors">
                Admin
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="relative flex items-center gap-2 rounded-lg bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.484M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <nav className="md:hidden flex flex-col gap-2 pb-4">
              <NavLink to="/" className={navLink} end onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/menu" className={navLink} onClick={() => setMobileOpen(false)}>Menu</NavLink>
              <NavLink to="/gallery" className={navLink} onClick={() => setMobileOpen(false)}>Gallery</NavLink>
              <NavLink to="/about" className={navLink} onClick={() => setMobileOpen(false)}>About</NavLink>
              <Link to="/admin/login" className="text-sm font-medium text-stone-500" onClick={() => setMobileOpen(false)}>Admin</Link>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white font-display text-sm font-bold">K</span>
              <span className="font-display text-lg font-bold text-white">Cafe Kareem</span>
            </div>
            <p className="text-sm text-stone-400">Premium Coffee, Desserts & Mojitos</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
