import Image from "next/image";
import { fetchAllGallery } from "../../../services/home";
import AddGalleryForm from "./AddGalleryForm";
import DeleteGalleryButton from "./DeleteGalleryButton";
import ToggleGalleryButton from "./ToggleGalleryButton";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await fetchAllGallery();

  return (
    <div className="min-h-screen bg-ink p-8 md:p-12 text-cream">
      <h1 className="font-display text-4xl font-bold text-cream mb-10">
        المعرض
      </h1>
      <AddGalleryForm />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {images.map((image) => (
          <div
            key={image.id}
            className="glass rounded-3xl overflow-hidden shadow-luxe"
          >
            <div className="relative w-full h-56">
              <Image
                src={image.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex gap-2">
                <ToggleGalleryButton image={image} />
                <DeleteGalleryButton image={image} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
