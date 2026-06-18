import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import OffersSection from "../components/offers/OffersSection";
import ProductsSection from "../components/products/ProductsSection";
import GallerySection from "../components/gallery/GallerySection";
import CartButton from "../components/cart/CartButton";
import CartDrawer from "../components/cart/CartDrawer";
import FloatingWhatsapp from "../components/FloatingWhatsapp";
import Footer from "../components/layout/Footer";
import { supabase } from "../lib/supabase";

export default async function Home() {
  const { data: settings } = await supabase
    .from("site_settings")
    .select("about_title, about_body, about_image, hero_tagline")
    .eq("id", 1)
    .single();

  return (
    <main className="relative bg-ink">
      <Navbar />
      <HeroSection />
      <AboutSection settings={settings} />
      <OffersSection />
      <ProductsSection />
      <GallerySection />
      <Footer />
      <CartButton />
      <CartDrawer />
      <FloatingWhatsapp />
    </main>
  );
}
