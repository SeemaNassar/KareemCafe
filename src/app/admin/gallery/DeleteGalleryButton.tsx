"use client";

import { supabase } from "../../../lib/supabase-browser";
import { removeImageByUrl } from "../../../utils/storage";
import type { GalleryImage } from "../../../types";

export default function DeleteGalleryButton({
  image,
}: {
  image: GalleryImage;
}) {
  async function remove() {
    if (!confirm("حذف هذه الصورة؟")) return;
    await removeImageByUrl(image.image);
    await supabase.from("gallery").delete().eq("id", image.id);
    location.reload();
  }

  return (
    <button
      onClick={remove}
      className="bg-error/20 hover:bg-error/30 text-error px-4 py-2 rounded-xl text-sm font-medium transition-colors"
    >
      حذف
    </button>
  );
}
