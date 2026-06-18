"use client";

import { supabase } from "../../../lib/supabase";

export default function DeleteButton({
  id,
  image,
}: {
  id: number;
  image: string | null;
}) {
  async function handleDelete() {
    const confirmed = confirm(
      "Delete this product?"
    );

    if (!confirmed) return;

    // حذف الصورة من Storage
    if (image) {
      const path = image.split(
        "/storage/v1/object/public/cafe-images/"
      )[1];

      const { error: storageError } =
        await supabase.storage
          .from("cafe-images")
          .remove([path]);

      if (storageError) {
        console.error(
          "Storage Delete Error:",
          storageError
        );
      }
    }

    // حذف المنتج من Database
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="
      bg-red-500
      hover:bg-red-600
      text-white
      px-4
      py-2
      rounded-xl
      "
    >
      Delete
    </button>
  );
}