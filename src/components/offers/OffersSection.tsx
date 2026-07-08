"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { StaggerGroup } from "../ui/Reveal";
import { fadeUp } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";
import { OfferGridSkeleton } from "../ui/Skeletons";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery";
import { supabase } from "../../lib/supabase-browser";
import type { Offer, QueryResult } from "../../types";

type Props = {
  initialOffers: Offer[];
};

export default function OffersSection({ initialOffers }: Props) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);

  const fetchOffers = useCallback(async (): Promise<QueryResult<Offer[]>> => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false });
    return { data: (data as Offer[]) ?? null, error: error as Error | null };
  }, []);

  const { data: rtOffers, loading } = useRealtimeQuery<Offer[]>(
    "offers",
    fetchOffers
  );

  const list = rtOffers ?? offers;

  return (
    <section
      id="offers"
      className="relative py-28 md:py-36 px-6 bg-gradient-to-b from-ink via-espresso/40 to-ink overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          // eyebrow="Limited Time"
          eyebrow="لفترة محدودة"

          // title="Special Offers"
          title="العروض الخاصة"

          className="mb-16"
        />

        {loading && list.length === 0 ? (
          <OfferGridSkeleton count={3} />
        ) : list.length === 0 ? (
          <div className="text-center text-cream/40 py-20">
            عروض جديدة قريباً.
          </div>
        ) : (
          <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((offer) => (
              <motion.article
                key={offer.id}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative overflow-hidden rounded-[1.75rem] glass shadow-luxe"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={
                      offer.image ||
                      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
                    }
                    alt={offer.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    quality={75}
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute top-4 left-4 glass-dark px-3 py-1.5 rounded-full text-xs font-semibold text-gold tracking-wide">
                  عرض
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-display text-2xl font-bold text-cream group-hover:text-gold-gradient transition-all duration-300">
                    {offer.title}
                  </h3>
                  {offer.description && (
                    <p className="mt-3 text-cream/60 leading-relaxed">
                      {offer.description}
                    </p>
                  )}
                  <a
                    href="#menu"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold hover:gap-3 transition-all"
                  >
                    اطلب الآن
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </motion.article>
            ))}
          </StaggerGroup>
        )}
      </div>
    </section>
  );
}
