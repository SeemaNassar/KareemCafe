"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase-browser";
import type { Category } from "../../../types";

export default function EditCategoryButton({ category }: { category: Category }) {
  const [name, setName] = useState(category.name);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", category.id);
    if (error) {
      alert(error.message);
      setSaving(false);
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
        تعديل
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
              تعديل التصنيف
            </h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream focus:ring-1 focus:ring-gold/40 outline-none transition mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="glass-light text-cream/70 px-6 py-3 rounded-xl hover:text-cream transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
