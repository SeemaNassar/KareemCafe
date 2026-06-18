import { supabase } from "../../../lib/supabase";
import AddGalleryForm from "./AddGalleryForm";
import DeleteGalleryButton from "./DeleteGalleryButton";
import ToggleGalleryButton from "./ToggleGalleryButton";

export default async function GalleryPage() {
  const { data: images } = await supabase
    .from("gallery")
    .select("*")
    .order("id", { ascending: false });

  return (
    <div className="min-h-screen bg-ink p-8 md:p-12 text-cream">
      <h1 className="font-display text-4xl font-bold text-cream mb-10">
        Gallery
      </h1>
      <AddGalleryForm />
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {images?.map((image) => (
          <div
            key={image.id}
            className="glass rounded-3xl overflow-hidden shadow-luxe"
          >
            <img
              src={image.image}
              alt=""
              className="w-full h-56 object-cover"
            />
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
