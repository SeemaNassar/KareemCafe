"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Offers", href: "#offers" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-dark py-3 shadow-luxe"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="group flex items-center gap-3">
            <span className="relative grid place-items-center w-10 h-10 rounded-full bg-gold-gradient text-ink font-display font-black text-lg shadow-gold-glow">
              K
              <span className="absolute inset-0 rounded-full ring-1 ring-gold/40" />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-cream">
              Kareem{" "}
              <span className="text-gold-gradient">Cafe</span>
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-9">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative text-sm font-medium tracking-wide text-cream/70 hover:text-cream transition-colors duration-300 group"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-gradient transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+970594650848"
              className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="tabular-nums">+970 59 465 0848</span>
            </a>
            <a
              href="#menu"
              className="bg-gold-gradient text-ink px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              Order Now
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid place-items-center w-11 h-11 rounded-full glass-light text-cream"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/80 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] glass-dark p-8 pt-28 flex flex-col gap-2"
            >
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl font-display font-semibold text-cream hover:text-gold transition-colors py-3 border-b border-gold/10"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href="tel:+970594650848"
                className="mt-6 flex items-center gap-3 text-cream/70"
              >
                <Phone className="w-5 h-5 text-gold" />
                +970 59 465 0848
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
