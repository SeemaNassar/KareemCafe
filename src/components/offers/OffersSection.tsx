"use client";

import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery";
import { StaggerGroup } from "../ui/Reveal";
import { fadeUp } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";

type Offer = {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  active: boolean;
};

export default function OffersSection() {
  const { data: offers } = useRealtimeQuery<Offer[]>("offers", () =>
    supabase.from("offers").select("*").eq("active", true).order("id", {
      ascending: false,
    })
  );

  const list = offers ?? [];

  return (
    <section
      id="offers"
      className="relative py-28 md:py-36 px-6 bg-gradient-to-b from-ink via-espresso/40 to-ink overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-gold/5 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading eyebrow="Limited Time" title="Special Offers" className="mb-16" />

        {list.length === 0 ? (
          <div className="text-center text-cream/40 py-20">
            New offers coming soon.
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
                  <img
                    src={offer.image || undefined}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute top-4 left-4 glass-dark px-3 py-1.5 rounded-full text-xs font-semibold text-gold tracking-wide">
                    Offer
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
                    Order Now
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
