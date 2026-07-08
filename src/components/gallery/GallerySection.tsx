"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { GallerySkeleton } from "../ui/Skeletons";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery";
import { supabase } from "../../lib/supabase-browser";
import type { GalleryImage, QueryResult } from "../../types";

type Props = {
  initialGallery: GalleryImage[];
};

export default function GallerySection({ initialGallery }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialGallery);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const fetchGallery = useCallback(async (): Promise<
    QueryResult<GalleryImage[]>
  > => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false });
    return {
      data: (data as GalleryImage[]) ?? null,
      error: error as Error | null,
    };
  }, []);

  const { data: rtImages, loading } = useRealtimeQuery<GalleryImage[]>(
    "gallery",
    fetchGallery
  );

  const list = rtImages ?? images;

  return (
    <section
      id="gallery"
      className="relative py-28 md:py-36 px-6 bg-gradient-to-b from-ink via-espresso/30 to-ink overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          // eyebrow="Moments"
          eyebrow="لحظات"

          // title="Cafe Gallery"
          title="معرض الكافيه"
          className="mb-16"
        />

        {loading && list.length === 0 ? (
          <GallerySkeleton />
        ) : list.length === 0 ? (
          <div className="text-center text-cream/40 py-20">
            يتم إعداد المعرض قريباً.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-4">
            {list.map((img, i) => {
              const span = i % 5 === 0 ? "md:col-span-2 md:row-span-2" : "";
              return (
                <motion.button
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: (i % 5) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 0.98 }}
                  onClick={() => setActiveIndex(i)}
                  className={`group relative overflow-hidden rounded-3xl ${span}`}
                >
                  <Image
                    src={img.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={75}
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-xs uppercase tracking-[0.3em] text-gold">
                    عرض
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeIndex !== null && list[activeIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/90 backdrop-blur-xl p-6"
            onClick={() => setActiveIndex(null)}
          >
            <button
              className="absolute top-6 right-6 grid place-items-center w-12 h-12 rounded-full glass-light text-cream hover:text-gold transition-colors"
              onClick={() => setActiveIndex(null)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[90vw] h-[85vh] max-w-[1200px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={list[activeIndex].image}
                alt=""
                fill
                sizes="90vw"
                quality={75}
                className="object-contain rounded-2xl shadow-luxe ring-gold"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
