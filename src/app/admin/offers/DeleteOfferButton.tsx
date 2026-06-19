"use client";

import { supabase } from "../../../lib/supabase-browser";
import { removeImageByUrl } from "../../../utils/storage";
import type { Offer } from "../../../types";

export default function DeleteOfferButton({ offer }: { offer: Offer }) {
  async function remove() {
    if (!confirm("Delete offer?")) return;
    await removeImageByUrl(offer.image);
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
