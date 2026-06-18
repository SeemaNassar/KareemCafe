"use client";

import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery";
import { StaggerGroup } from "../ui/Reveal";
import { fadeUp } from "../../lib/animations";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "./ProductCard";
import MenuSection from "./MenuSection";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  featured: boolean | null;
  category_id: number | null;
};

type Category = {
  id: number;
  name: string;
};

export default function ProductsSection() {
  const { data: products } = useRealtimeQuery<Product[]>("products", () =>
    supabase.from("products").select("*").order("id", { ascending: false })
  );

  const { data: categories } = useRealtimeQuery<Category[]>("categories", () =>
    supabase.from("categories").select("*").order("id")
  );

  const list = products ?? [];
  const cats = categories ?? [];
  const featured = list.filter((p) => p.featured);
  const regular = list.filter((p) => !p.featured);

  return (
    <section
      id="menu"
      className="relative py-28 md:py-36 px-6 bg-ink overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial-gold opacity-70" />
      <div className="absolute inset-0 bg-grain opacity-30" />

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading eyebrow="Signature Craft" title="Our Menu" />

        {/* Featured */}
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

        {/* Full menu */}
        <div className="mt-20">
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-cream mb-10 text-center">
            Full Menu
          </h3>
          <MenuSection products={regular} categories={cats} />
        </div>
      </div>
    </section>
  );
}
