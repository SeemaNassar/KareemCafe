"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  featured: boolean;
  category_id: number | null;
};

export default function MenuSection({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<number | null>(null);

  const filteredProducts =
    selectedCategory === null
      ? products
      : products.filter(
          (product) =>
            product.category_id ===
            selectedCategory
        );
  return (
    <>
      <div
        className="
        flex
        justify-center
        gap-4
        mb-16
        flex-wrap
        "
      >
        <button
          onClick={() =>
            setSelectedCategory(null)
          }
          className={`
          px-5
          py-2
          rounded-full
          transition
          ${
            selectedCategory === null
              ? "bg-[#3A2A22] text-white"
              : "bg-white"
          }
        `}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              setSelectedCategory(category.id)
            }
            className={`
            px-5
            py-2
            rounded-full
            transition
            ${
              selectedCategory === category.id
                ? "bg-[#3A2A22] text-white"
                : "bg-white hover:bg-[#C8A97E]"
            }
          `}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-8
        "
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </>
  );
}