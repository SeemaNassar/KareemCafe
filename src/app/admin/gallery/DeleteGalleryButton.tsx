"use client";

import { supabase } from "../../../lib/supabase";

export default function DeleteGalleryButton({
  image,
}: {
  image: any;
}) {
  async function remove() {
    if (
      !confirm(
        "Delete image?"
      )
    )
      return;

    const path =
      image.image.split(
        "/storage/v1/object/public/cafe-images/"
      )[1];

    await supabase.storage
      .from("cafe-images")
      .remove([path]);

    await supabase
      .from("gallery")
      .delete()
      .eq("id", image.id);

    location.reload();
  }

  return (
    <button
      onClick={remove}
      className="
      bg-red-500
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