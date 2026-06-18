import { supabase } from "../../../lib/supabase";
import AddGalleryForm from "./AddGalleryForm";
import DeleteGalleryButton from "./DeleteGalleryButton";
import ToggleGalleryButton from "./ToggleGalleryButton";

export default async function GalleryPage() {
  const { data: images } =
    await supabase
      .from("gallery")
      .select("*")
      .order("id", {
        ascending: false,
      });

  return (
    <div className="p-10">
      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >
        Gallery
      </h1>

      <AddGalleryForm />

      <div
        className="
        grid
        md:grid-cols-3
        lg:grid-cols-4
        gap-6
        mt-10
        "
      >
        {images?.map((image) => (
          <div
            key={image.id}
            className="
            bg-white
            rounded-3xl
            overflow-hidden
            shadow
            "
          >
            <img
              src={image.image}
              alt=""
              className="
              w-full
              h-56
              object-cover
              "
            />

            <div className="p-4">
              <div
                className="
                flex
                gap-2
                "
              >
                <ToggleGalleryButton
                  image={image}
                />

                <DeleteGalleryButton
                  image={image}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}