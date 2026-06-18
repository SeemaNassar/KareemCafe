"use client";

import { supabase } from "../../../lib/supabase";

export default function ToggleGalleryButton({
  image,
}: {
  image: any;
}) {
  async function toggle() {
    await supabase
      .from("gallery")
      .update({
        active:
          !image.active,
      })
      .eq("id", image.id);

    location.reload();
  }

  return (
    <button
      onClick={toggle}
      className="
      bg-amber-500
      text-white
      px-4
      py-2
      rounded-xl
      "
    >
      {image.active
        ? "Hide"
        : "Show"}
    </button>
  );
}