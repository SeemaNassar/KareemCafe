import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import ProductsSection from "../components/products/ProductsSection";
import CartButton from "../components/cart/CartButton";
import CartDrawer from "../components/cart/CartDrawer";
import FloatingWhatsapp from "../components/FloatingWhatsapp";
import OffersSection from "../components/offers/OffersSection";
import GallerySection from "../components/gallery/GallerySection";
import { supabase } from "../lib/supabase";

export default async function Home() {
  const { data: gallery } =
  await supabase
    .from("gallery")
    .select("*")
    .eq("active", true);

  return (
    <main className="bg-[#F8F5EF] min-h-screen">
      <Navbar />

      <HeroSection />
      <OffersSection />
      <ProductsSection />
      <GallerySection
        images={gallery || []}
      />
      <CartButton />
      <CartDrawer />
      <FloatingWhatsapp />
    </main>
  );
}
