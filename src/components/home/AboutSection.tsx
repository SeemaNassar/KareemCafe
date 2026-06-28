"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Coffee, Leaf, Heart } from "lucide-react";

type Settings = {
  about_title: string | null;
  about_body: string | null;
  about_image: string | null;
  hero_tagline: string | null;
};

const PILLARS = [
  {
    icon: Coffee,
    title: "حبوب مختارة بعناية",
    body: "عربيكا أصيلة من أصول مفردة، محمّصة بكميات صغيرة لكوب يحكي قصته الخاصة.",
  },
  {
    icon: Leaf,
    title: "طازج كل يوم",
    body: "مهبّلات تُحضَّر عند الطلب وحلويات تُصنع كل صباح من مكونات طبيعية.",
  },
  {
    icon: Heart,
    title: "ضيافة دافئة",
    body: "مكان تطول فيه الأحاديث وتشعر في كل زيارة أنك عدت إلى البيت.",
  },
];

export default function AboutSection({
  settings,
}: {
  settings: Settings | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const title = settings?.about_title ?? "Crafted with Passion";
  const body = settings?.about_body ?? "";
  const img =
    settings?.about_image ||
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24";

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 md:py-40 px-6 overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 bg-radial-gold" />
      <div className="absolute inset-0 bg-grain opacity-40" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 lg:order-1"
        >
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-luxe ring-gold">
            <motion.img
              src={img}
              alt={title}
              style={{ y: imgY, scale: 1.15 }}
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          </div>

          {/* Floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-8 -right-4 sm:right-8 glass-dark rounded-3xl p-6 shadow-luxe"
          >
            <div className="font-display text-5xl font-black text-gold-gradient">
              10+
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/60">
            سنوات من الشغف
            </div>
          </motion.div>

          {/* Decorative ring */}
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border border-gold/20 pointer-events-none" />
          <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full border border-gold/10 pointer-events-none" />
        </motion.div>

        {/* Content side */}
        <div className="order-1 lg:order-2">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.4em] text-gold"
          >
            من نحن
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-[1.1]"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 text-lg leading-relaxed text-cream/65 max-w-lg"
          >
            {body}
          </motion.p>

          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group"
              >
                <div className="grid place-items-center w-12 h-12 rounded-2xl glass-light text-gold mb-4 group-hover:bg-gold-gradient group-hover:text-ink transition-all duration-300">
                  <p.icon className="w-5 h-5" />
                </div>
                <h4 className="font-display text-lg font-semibold text-cream">
                  {p.title}
                </h4>
                <p className="mt-2 text-sm text-cream/55 leading-relaxed">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
