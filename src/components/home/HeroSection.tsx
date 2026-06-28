"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowDown, Star } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93";

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.95]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink"
    >
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={HERO_IMG}
          alt="Pouring premium coffee"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink"
      />
      <div className="absolute inset-0 bg-grain opacity-60" />

      {/* Gold glow */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gold/10 blur-[120px] pointer-events-none" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 mb-6"
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 fill-gold text-gold"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          <span className="ml-2 text-xs uppercase tracking-[0.3em] text-cream/60">
          قهوة مختصة منذ سنوات
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[3.5rem] leading-[0.95] sm:text-7xl md:text-8xl lg:text-[9.5rem] font-black text-cream"
        >
          Kareem{" "}
          <span className="text-gold-gradient italic">Cafe</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-lg md:text-xl text-cream/75 tracking-wide"
        >
          قهوة مختصة &bull; حلويات &bull; موهيتو
          {/* Premium Coffee &bull; Desserts &bull; Mojitos */}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#menu"
            className="group relative overflow-hidden bg-gold-gradient text-ink px-9 py-4 rounded-full font-semibold tracking-wide shadow-gold-glow transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center gap-2">
            استكشف القائمة
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </a>
          <a
            href="#offers"
            className="glass-light text-cream px-9 py-4 rounded-full font-medium tracking-wide hover:bg-cream/10 transition-colors duration-300"
          >
            العروض
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-cream/40">
        اسحب للأسفل
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent overflow-hidden relative">
          <motion.div
            animate={{ y: [-48, 48] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-4 bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
