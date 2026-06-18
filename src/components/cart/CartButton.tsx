"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function CartButton() {
  const openCart = useCartStore(
    (state) => state.openCart
  );

  const items = useCartStore(
    (state) => state.items
  );

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <button
      onClick={openCart}
      className="
      fixed
      bottom-8
      right-8
      w-16
      h-16
      rounded-full
      bg-[#3A2A22]
      text-white
      shadow-2xl
      z-50
      hover:scale-110
      transition
      "
    >
      <ShoppingCart className="mx-auto" />
      {count > 0 && (
      <span
        className="
        absolute
        -top-2
        -right-2
        bg-red-500
        text-white
        text-xs
        w-6
        h-6
        rounded-full
        flex
        items-center
        justify-center
        "
      >
        {count}
      </span>
      )}
    </button>
  );
}