import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import type { CartItem } from './types'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: number, variantId: number | null) => void
  updateQuantity: (productId: number, variantId: number | null, qty: number) => void
  clearCart: () => void
  subtotal: number
  totalItems: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.product_id === item.product_id && i.variant_id === item.variant_id,
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity }
        return next
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((productId: number, variantId: number | null) => {
    setItems(prev =>
      prev.filter(i => !(i.product_id === productId && i.variant_id === variantId)),
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: number, variantId: number | null, qty: number) => {
      setItems(prev =>
        prev
          .map(i =>
            i.product_id === productId && i.variant_id === variantId
              ? { ...i, quantity: qty }
              : i,
          )
          .filter(i => i.quantity > 0),
      )
    },
    [],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, totalItems }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
