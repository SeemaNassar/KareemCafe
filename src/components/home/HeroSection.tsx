"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="
      relative
      h-screen
      overflow-hidden
      "
    >
      <img
        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
        className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
        "
      />

      <div
        className="
        absolute
        inset-0
        bg-black/55
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 60,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
        }}
        className="
        relative
        z-10
        flex
        flex-col
        justify-center
        items-center
        h-full
        text-center
        px-6
        "
      >
        <h1
          className="
          text-white
          text-6xl
          md:text-8xl
          font-black
          "
        >
          Kareem Cafe
        </h1>

        <p
          className="
          text-white/80
          mt-6
          text-xl
          "
        >
          Premium Coffee • Desserts • Mojitos
        </p>

        <a
          href="#menu"
          className="
          mt-10
          bg-[#C8A97E]
          px-8
          py-4
          rounded-full
          font-bold
          hover:scale-105
          transition
          "
        >
          Explore Menu
        </a>
      </motion.div>
    </section>
  );
}