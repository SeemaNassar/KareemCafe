"use client";

import { motion } from "framer-motion";
import { useCartStore } from "../../store/cartStore";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {

  const addItem = useCartStore(
    (state) => state.addItem
  );

  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.03,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
      group
      overflow-hidden
      rounded-[30px]
      bg-white
      shadow-lg
      hover:shadow-2xl
      transition-all
      duration-500
      "
    >
      <div className="relative overflow-hidden">

        <img
          src={
            product.image ||
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
          }
          alt={product.name}
          className="
          h-72
          w-full
          object-cover
          transition
          duration-700
          group-hover:scale-110
          "
        />

        <div
          className="
          absolute
          top-4
          left-4
          bg-[#C8A97E]
          text-white
          px-3
          py-1
          rounded-full
          text-sm
          "
        >
          Cafe Kareem
        </div>

      </div>

      <div className="p-6">

        <h3
          className="
          text-2xl
          font-bold
          text-[#2A1F1A]
          "
        >
          {product.name}
        </h3>

        <p
          className="
          text-gray-500
          mt-2
          line-clamp-2
          "
        >
          {product.description}
        </p>

        <div
          className="
          flex
          justify-between
          items-center
          mt-6
          "
        >
          <span
            className="
            text-3xl
            font-bold
            text-[#C8A97E]
            "
          >
            ₪ {product.price}
          </span>

          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                image: product.image || "",
                price: product.price,
              })
            }
            className="
            bg-[#3A2A22]
            hover:bg-[#C8A97E]
            text-white
            px-5
            py-3
            rounded-full
            font-semibold
            transition-all
            duration-300
            "
          >
            Add To Cart
          </button>

        </div>

      </div>
    </motion.div>
  );
}