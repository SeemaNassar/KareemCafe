import dynamic from "next/dynamic";
import { Suspense } from "react";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import Footer from "../components/layout/Footer";
import CartButton from "../components/cart/CartButton";
import CartDrawer from "../components/cart/CartDrawer";
import FloatingWhatsapp from "../components/FloatingWhatsapp";
import {
  OfferGridSkeleton,
  GallerySkeleton,
} from "../components/ui/Skeletons";
import { fetchHomePayload } from "../services/home";

const OffersSection = dynamic(
  () => import("../components/offers/OffersSection")
);
const ProductsSection = dynamic(
  () => import("../components/products/ProductsSection")
);
const GallerySection = dynamic(
  () => import("../components/gallery/GallerySection")
);

export default async function Home() {
  const payload = await fetchHomePayload();

  return (
    <main className="relative bg-ink">
      <Navbar />
      <HeroSection />
      <AboutSection settings={payload.settings} />

      <Suspense fallback={<OfferGridSkeleton count={3} />}>
        <OffersSection initialOffers={payload.offers} />
      </Suspense>

      <Suspense fallback={null}>
        <ProductsSection
          initialProducts={payload.products}
          initialCategories={payload.categories}
        />
      </Suspense>

      <Suspense fallback={<GallerySkeleton />}>
        <GallerySection initialGallery={payload.gallery} />
      </Suspense>

      <Footer />
      <CartButton />
      <CartDrawer />
      <FloatingWhatsapp />
    </main>
  );
}
