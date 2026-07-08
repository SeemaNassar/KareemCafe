"use client";

import { supabase } from "../../../lib/supabase-browser";

export default function DeleteCategoryButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  async function handleDelete() {
    if (!confirm(`حذف "${name}" وجميع منتجاتها؟`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
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
