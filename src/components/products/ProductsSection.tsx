import { supabase } from "../../lib/supabase";
import ProductCard from "./ProductCard";
import MenuSection from "./MenuSection";

export default async function ProductsSection() {
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories(*)
    `);

  const { data: categories } = await supabase
    .from("categories")
    .select("*");

  const featuredProducts =
    products?.filter((p) => p.featured) || [];

  const regularProducts =
    products?.filter((p) => !p.featured) || [];

  return (
    <section
      id="menu"
      className="
      py-28
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
        mb-16
        "
      >
        Our Menu
      </h2>

      {/* Best Sellers */}
      {featuredProducts.length > 0 && (
        <>
          <h2
            className="
            text-4xl
            font-bold
            mb-8
            text-[#2A1F1A]
            "
          >
            ⭐ Best Sellers
          </h2>

          <div
            className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
            mb-24
            "
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </>
      )}

      {/* Full Menu */}
      <h2
        className="
        text-4xl
        font-bold
        mb-8
        text-[#2A1F1A]
        "
      >
        Full Menu
      </h2>

      <MenuSection
        products={regularProducts}
        categories={categories || []}
      />
    </section>
  );
}