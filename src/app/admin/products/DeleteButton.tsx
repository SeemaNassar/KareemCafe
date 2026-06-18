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
    if (!confirm("Delete this product?")) return;
    if (image) {
      const path = image.split("/storage/v1/object/public/cafe-images/")[1];
      await supabase.storage.from("cafe-images").remove([path]);
    }
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-error/20 hover:bg-error/30 text-error px-4 py-2 rounded-xl text-sm font-medium transition-colors"
    >
      Delete
    </button>
  );
}
