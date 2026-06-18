"use client";

import { supabase } from "../../../lib/supabase";

export default function DeleteCategoryButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  async function handleDelete() {
    const confirmed =
      confirm(
        `Delete ${name} and all its products?`
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("categories")
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