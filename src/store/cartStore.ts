import { create } from "zustand";
import type { CartItem } from "../types";

type CartStore = {
  items: CartItem[];
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  increase: (id: number, sizeLabel?: string) => void;
  decrease: (id: number, sizeLabel?: string) => void;
  removeItem: (id: number, sizeLabel?: string) => void;
};

function matches(item: CartItem, id: number, sizeLabel?: string) {
  return item.id === id && (item.sizeLabel ?? null) === (sizeLabel ?? null);
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => matches(i, item.id, item.sizeLabel));
      if (existing) {
        return {
          items: state.items.map((i) =>
            matches(i, item.id, item.sizeLabel)
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  increase: (id, sizeLabel) =>
    set((state) => ({
      items: state.items.map((i) =>
        matches(i, id, sizeLabel) ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decrease: (id, sizeLabel) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          matches(i, id, sizeLabel) ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0),
    })),

  removeItem: (id, sizeLabel) =>
    set((state) => ({
      items: state.items.filter((item) => !matches(item, id, sizeLabel)),
    })),
}));
