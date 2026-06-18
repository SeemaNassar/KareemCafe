"use client";

import { supabase } from "../../../lib/supabase";

export default function DeleteOfferButton({ offer }: { offer: any }) {
  async function remove() {
    if (!confirm("Delete offer?")) return;
    if (offer.image) {
      const path = offer.image.split(
        "/storage/v1/object/public/cafe-images/"
      )[1];
      await supabase.storage.from("cafe-images").remove([path]);
    }
    await supabase.from("offers").delete().eq("id", offer.id);
    location.reload();
  }

  return (
    <button
      onClick={remove}
      className="bg-error/20 hover:bg-error/30 text-error px-4 py-2 rounded-xl text-sm font-medium transition-colors"
    >
      Delete
    </button>
  );
}
