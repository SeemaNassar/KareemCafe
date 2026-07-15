"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Plus, Star } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import type { Product } from "../../types";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductDetailModal({ product, onClose }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const sizes = product?.sizes ?? null;
  const hasSizes = !!(sizes && sizes.length > 0);

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  useEffect(() => {
    setSelectedSizeIndex(0);
  }, [product?.id]);

  const currentPrice = hasSizes
    ? sizes![selectedSizeIndex]?.price ?? product!.price
    : product?.price ?? 0;
  const currentSizeLabel = hasSizes ? sizes![selectedSizeIndex]?.label : undefined;

  function handleAdd() {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      image: product.image || "",
      price: currentPrice,
      sizeLabel: currentSizeLabel,
    });
    onClose();
    openCart();
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg glass-dark rounded-3xl overflow-hidden shadow-luxe ring-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 grid place-items-center w-10 h-10 rounded-full glass-light text-cream hover:text-gold transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {product.image && (
              <div className="relative w-full h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="500px"
                  quality={75}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              </div>
            )}

            <div className="p-7">
              {product.featured && (
                <div className="flex items-center gap-1.5 mb-3 text-gold">
                  <Star className="w-4 h-4 fill-gold" />
                  <span className="text-xs uppercase tracking-[0.2em]">الأكثر طلباً</span>
                </div>
              )}

              <h2 className="font-display text-3xl font-bold text-cream">
                {product.name}
              </h2>

              {product.description && (
                <p className="mt-3 text-cream/60 leading-relaxed">
                  {product.description}
                </p>
              )}

              {hasSizes && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
                    اختر الحجم
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {sizes!.map((size, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSizeIndex(i)}
                        className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
                          selectedSizeIndex === i
                            ? "bg-gold-gradient text-ink shadow-gold-glow"
                            : "glass-light text-cream/70 hover:text-cream"
                        }`}
                      >
                        <span>{size.label}</span>
                        <span className="block text-xs opacity-70 mt-0.5">
                          ₪{Number(size.price).toFixed(0)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-7 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-cream/40">
                    السعر
                  </span>
                  <p className="font-display text-3xl font-bold text-gold-gradient">
                    ₪{Number(currentPrice).toFixed(0)}
                  </p>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-gold-gradient text-ink px-6 py-3.5 rounded-full font-semibold hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4" />
                  أضف للسلة
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
