"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import type { ProductSummary } from "../../types";

type Props = { product: ProductSummary };

function ProductCardBase({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.article
      whileHover={{ y: -12 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-[1.75rem] glass shadow-luxe flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={
            product.image ||
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
          }
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent pointer-events-none" />

        {product.featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full text-xs font-semibold text-gold">
            <Star className="w-3 h-3 fill-gold" />
            Best Seller
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-cream group-hover:text-gold-gradient transition-all duration-300">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-2 text-sm text-cream/55 leading-relaxed line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <span className="font-display text-2xl font-bold text-gold-gradient">
            ₪{Number(product.price).toFixed(0)}
          </span>
          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                image: product.image || "",
                price: Number(product.price),
              })
            }
            className="group/btn flex items-center gap-2 bg-gold-gradient text-ink px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export const ProductCard = memo(ProductCardBase);
