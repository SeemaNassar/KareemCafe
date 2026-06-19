"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase-browser";
import type { Category } from "../../../types";

export default function EditCategoryButton({ category }: { category: Category }) {
  const [name, setName] = useState(category.name);
  const [open, setOpen] = useState(false);

  async function save() {
    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", category.id);
    if (error) {
      alert(error.message);
      return;
    }
    location.reload();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gold/20 hover:bg-gold/30 text-gold px-4 py-2 rounded-xl text-sm font-medium transition-colors"
      >
        Edit
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-ink/80 backdrop-blur-md grid place-items-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-dark rounded-3xl p-8 w-full max-w-md shadow-luxe ring-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-cream mb-4">
              Edit Category
            </h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream focus:ring-1 focus:ring-gold/40 outline-none transition mb-4"
            />
            <button
              onClick={save}
              className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}
