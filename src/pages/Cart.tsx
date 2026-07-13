import { Link } from 'react-router-dom'
import { useCart } from '../lib/cart'

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <svg className="mx-auto h-16 w-16 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.484M7.5 14.25L5.106 5.272" />
        </svg>
        <h2 className="mt-4 font-display text-2xl font-bold text-stone-800">Your cart is empty</h2>
        <p className="mt-2 text-stone-500">Browse our menu and add some items!</p>
        <Link to="/menu" className="btn-primary mt-6 inline-block">Browse Menu</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-6">Your Cart ({totalItems})</h1>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="card flex items-center gap-4 p-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
              {item.image ? (
                <img src={item.image} alt={item.product_name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">☕</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-stone-800">{item.product_name}</h3>
              <p className="text-sm text-stone-500">${item.unit_price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"
              >
                +
              </button>
            </div>
            <span className="w-20 text-right font-bold text-stone-800">
              ${(item.unit_price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(item.product_id, item.variant_id)}
              className="text-red-400 hover:text-red-600 p-1"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.206A48.13 48.13 0 0012 5.25a48.13 48.13 0 00-3.05-.05m14.456 0L18 5.25m0 0L16.5 3m0 0L12 5.25 7.5 3" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-stone-700">Subtotal</span>
          <span className="font-display text-2xl font-bold text-brand-700">${subtotal.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="btn-primary mt-4 w-full">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}
