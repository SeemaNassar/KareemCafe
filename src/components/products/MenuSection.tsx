"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";
import { MenuSkeleton } from "../ui/Skeletons";
import type { Product, Category, ProductSummary } from "../../types";

type Props = {
  initialProducts: Product[];
  initialCategories: Category[];
};

export default function MenuSection({
  initialProducts,
  initialCategories,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const featured = useMemo(
    () => initialProducts.filter((p) => p.featured),
    [initialProducts]
  );
  const regular = useMemo(
    () => initialProducts.filter((p) => !p.featured),
    [initialProducts]
  );

  const filtered = useMemo(
    () =>
      selected === null
        ? regular
        : regular.filter((p) => p.category_id === selected),
    [regular, selected]
  );

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 mb-14">
        <CategoryPill
          active={selected === null}
          onClick={() => setSelected(null)}
          label="الكل"
        />
        {initialCategories.map((c) => (
          <CategoryPill
            key={c.id}
            active={selected === c.id}
            onClick={() => setSelected(c.id)}
            label={c.name}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <MenuSkeleton count={6} />
      ) : (
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard
                  product={product}
                  onOpenDetail={(p: ProductSummary) => setDetailProduct(p as Product)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {featured.length === 0 && filtered.length === 0 && (
        <div className="text-center text-cream/40 py-20">
          لا يوجد عناصر في هذا التصنيف بعد.
        </div>
      )}

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
      />
    </div>
  );
}

function CategoryPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-colors duration-300 ${
        active ? "text-ink" : "text-cream/70 hover:text-cream"
      }`}
    >
      {active && (
        <motion.span
          layoutId="active-pill"
          className="absolute inset-0 rounded-full bg-gold-gradient shadow-gold-glow"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
