"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function CartButton() {
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore(
    (s) => s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          onClick={openCart}
          className="fixed bottom-6 right-6 z-40 group"
        >
          <span className="absolute inset-0 rounded-full bg-gold-gradient blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="relative grid place-items-center w-16 h-16 rounded-full bg-gold-gradient text-ink shadow-gold-glow transition-transform duration-300 group-hover:scale-110">
            <ShoppingBag className="w-6 h-6" />
            <motion.span
              key={count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 grid place-items-center min-w-6 h-6 px-1.5 rounded-full bg-error text-cream text-xs font-bold ring-2 ring-ink"
            >
              {count}
            </motion.span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
