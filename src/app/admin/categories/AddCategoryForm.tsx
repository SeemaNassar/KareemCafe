"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase-browser";

export default function AddCategoryForm() {
  const [name, setName] = useState("");

  async function handleAdd() {
    if (!name.trim()) return;
    const { error } = await supabase.from("categories").insert({ name });
    if (error) {
      alert(error.message);
      return;
    }
    location.reload();
  }

  return (
    <div className="glass rounded-2xl p-6 shadow-luxe mb-8">
      <h2 className="font-display text-2xl font-bold text-cream mb-4">
        Add Category
      </h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition mb-4"
      />
      <button
        onClick={handleAdd}
        className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
      >
        Add Category
      </button>
    </div>
  );
}
