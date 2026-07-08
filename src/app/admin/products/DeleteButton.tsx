"use client";

import { supabase } from "../../../lib/supabase-browser";
import { removeImageByUrl } from "../../../utils/storage";

export default function DeleteButton({
  id,
  image,
}: {
  id: number;
  image: string | null;
}) {
  async function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await removeImageByUrl(image);
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
      حذف
    </button>
  );
}
