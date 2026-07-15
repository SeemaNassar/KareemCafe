"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { StaggerGroup } from "../ui/Reveal";
import { fadeUp } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";
import type { BestSeller } from "../../types";

type Props = {
  bestSellers: BestSeller[];
};

export default function BestSellersSection({ bestSellers }: Props) {
  if (bestSellers.length === 0) return null;

  return (
    <section
      id="bestsellers"
      className="relative py-28 md:py-36 px-6 bg-gradient-to-b from-ink via-espresso/30 to-ink overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="الأكثر مبيعاً"
          title="يحبها زبائننا"
          className="mb-16"
        />

        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellers.map((item, i) => {
            const hasSizes = !!(item.product_sizes && item.product_sizes.length > 0);
            const minPrice = hasSizes
              ? Math.min(...item.product_sizes!.map((s) => Number(s.price)))
              : Number(item.product_price);

            return (
              <motion.article
                key={item.product_id}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative overflow-hidden rounded-[1.75rem] glass shadow-luxe"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={
                      item.product_image ||
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
                    }
                    alt={item.product_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    quality={75}
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full text-xs font-semibold text-gold">
                    {i < 3 ? (
                      <>
                        <Star className="w-3 h-3 fill-gold" />
                        #{i + 1}
                      </>
                    ) : (
                      <span className="text-cream/60">#{i + 1}</span>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4 glass-dark px-3 py-1.5 rounded-full text-xs font-medium text-cream/80">
                    {item.total_sold} مبيع
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-display text-2xl font-bold text-cream group-hover:text-gold-gradient transition-all duration-300">
                    {item.product_name}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      {hasSizes && (
                        <span className="text-xs text-cream/40 block">يبدأ من</span>
                      )}
                      <span className="font-display text-2xl font-bold text-gold-gradient">
                        ₪{minPrice.toFixed(0)}
                      </span>
                    </div>
                    <a
                      href="#menu"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:gap-3 transition-all"
                    >
                      اطلب الآن
                      <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
