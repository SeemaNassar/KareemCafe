"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="
      fixed
      top-0
      left-0
      right-0
      z-50
      backdrop-blur-xl
      bg-black/20
      border-b
      border-white/10
      "
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <h1 className="text-white text-2xl font-bold">
          Cafe Kareem
        </h1>

        <div className="hidden md:flex gap-8 text-gray-300">
          <a href="#">Home</a>
          <a href="#">Menu</a>
          <a href="#">Offers</a>
          <a href="#">Gallery</a>
          <a href="#">Contact</a>
        </div>

      </div>
    </motion.nav>
  );
}