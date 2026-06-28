"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { fadeUp } from "../../lib/animations";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink border-t border-gold/10 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gold opacity-50" />
      <div className="absolute inset-0 bg-grain opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-5">
            <Image
              src="/kareemLogo.png"
              alt="Kareem Café"
              width={52}
              height={52}
              className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-105"
            />
              {/* <span className="grid place-items-center w-10 h-10 rounded-full bg-gold-gradient text-ink font-display font-black">
                K
              </span> */}
              <span className="font-display text-2xl font-bold text-cream">
                Kareem <span className="text-gold-gradient">Cafe</span>
              </span>
            </div>
            <p className="max-w-md text-cream/55 leading-relaxed">
              {/* A sanctuary of specialty coffee, handcrafted desserts, and fresh
              mojitos. Crafted moments worth savoring, every single day. */}
              وجهتك لأجود القهوة المختصة والحلويات الطازجة والموهيتو المنعش. لحظات تستحق التذوق كل يوم.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-xs uppercase tracking-[0.3em] text-gold mb-5">
            زورونا
            </h4>
            <ul className="space-y-3 text-cream/60">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gold/60 shrink-0" />
                <span>وسط المدينة، الشارع الرئيسي</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold/60 shrink-0" />
                <a href="tel:+970594650848" className="hover:text-gold transition-colors">
                  +970 59 465 0848
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-gold/60 shrink-0" />
                <span>يومياً، 8:00 AM – 12:00 AM</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-xs uppercase tracking-[0.3em] text-gold mb-5">
            تواصل معنا
            </h4>
            <a
              href="https://wa.me/970594650848"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              @kareemcafe
            </a>
            <a
              href="#menu"
              className="block mt-5 bg-gold-gradient text-ink px-6 py-3 rounded-full text-sm font-semibold hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-0.5 w-fit"
            >
              اطلب الآن
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 pt-8 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-cream/40"
        >
          <span>`© ${year} كافيه كريم. جميع الحقوق محفوظة.`</span>
          <span>مصنوع بشغف وحب &amp; ☕</span>
        </motion.div>
      </div>
    </footer>
  );
}
