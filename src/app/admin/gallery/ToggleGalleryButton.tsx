"use client";

import { supabase } from "../../../lib/supabase";

export default function ToggleGalleryButton({ image }: { image: any }) {
  async function toggle() {
    await supabase
      .from("gallery")
      .update({ active: !image.active })
      .eq("id", image.id);
    location.reload();
  }

  return (
    <button
      onClick={toggle}
      className="bg-gold/20 hover:bg-gold/30 text-gold px-4 py-2 rounded-xl text-sm font-medium transition-colors"
    >
      {image.active ? "Hide" : "Show"}
    </button>
  );
}
