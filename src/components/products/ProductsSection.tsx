"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { StaggerGroup } from "../ui/Reveal";
import { fadeUp } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";
import { ProductCard } from "./ProductCard";
import MenuSection from "./MenuSection";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery";
import { supabase } from "../../lib/supabase-browser";
import type { Product, Category, QueryResult } from "../../types";

type Props = {
  initialProducts: Product[];
  initialCategories: Category[];
};

export default function ProductsSection({
  initialProducts,
  initialCategories,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] =
    useState<Category[]>(initialCategories);

  const fetchProducts = useCallback(async (): Promise<
    QueryResult<Product[]>
  > => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });
    return { data: (data as Product[]) ?? null, error: error as Error | null };
  }, []);

  const fetchCategories = useCallback(async (): Promise<
    QueryResult<Category[]>
  > => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id");
    return {
      data: (data as Category[]) ?? null,
      error: error as Error | null,
    };
  }, []);

  const { data: rtProducts } = useRealtimeQuery<Product[]>(
    "products",
    fetchProducts
  );
  const { data: rtCategories } = useRealtimeQuery<Category[]>(
    "categories",
    fetchCategories
  );

  const currentProducts = rtProducts ?? products;
  const currentCategories = rtCategories ?? categories;

  const featured = currentProducts.filter((p) => p.featured);
  const regular = currentProducts.filter((p) => !p.featured);

  return (
    <section
      id="menu"
      className="relative py-28 md:py-36 px-6 bg-ink overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial-gold opacity-70" />
      <div className="absolute inset-0 bg-grain opacity-30" />

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading eyebrow="Signature Craft" title="Our Menu" />

        {featured.length > 0 && (
          <div className="mt-16">
            <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        )}

        <div className="mt-20">
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-cream mb-10 text-center">
            Full Menu
          </h3>
          <MenuSection
            initialProducts={regular}
            initialCategories={currentCategories}
          />
        </div>
      </div>
    </section>
  );
}
