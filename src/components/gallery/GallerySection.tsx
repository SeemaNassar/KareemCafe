"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function GallerySection({
  images,
}: {
  images: any[];
}) {
  const [active, setActive] =
    useState<number | null>(null);

  return (
    <section
      className="
      py-32
      px-6
      max-w-7xl
      mx-auto
      "
    >
      <h2
        className="
        text-5xl
        font-black
        text-center
        text-[#2A1F1A]
        mb-20
        "
      >
        Cafe Gallery
      </h2>

      <div
        className="
        grid
        grid-cols-2
        md:grid-cols-4
        auto-rows-[220px]
        gap-5
        "
      >
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            onMouseEnter={() =>
              setActive(index)
            }
            onMouseLeave={() =>
              setActive(null)
            }
            animate={{
              scale:
                active === index
                  ? 1.08
                  : 1,

              opacity:
                active === null
                  ? 1
                  : active === index
                  ? 1
                  : 0.45,
            }}
            transition={{
              duration: 0.35,
            }}
            className={`
              relative
              overflow-hidden
              rounded-3xl
              cursor-pointer
              ${
                index % 5 === 0
                  ? "md:col-span-2 md:row-span-2"
                  : ""
              }
            `}
          >
            <img
              src={image.image}
              alt=""
              className="
              w-full
              h-full
              object-cover
              transition
              duration-700
              hover:scale-110
              "
            />

            <div
              className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/50
              to-transparent
              opacity-0
              hover:opacity-100
              transition
              "
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}