"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase-browser";
import { uploadImage } from "../../../utils/storage";

export default function AddGalleryForm() {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function upload() {
    if (!file) return;
    setSaving(true);
    let publicUrl: string;
    try {
      publicUrl = await uploadImage(file);
    } catch (err) {
      alert((err as Error).message);
      setSaving(false);
      return;
    }
    await supabase.from("gallery").insert({ image: publicUrl });
    location.reload();
  }

  return (
    <div className="glass rounded-3xl p-6 shadow-luxe">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-cream/70 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gold-gradient file:text-ink file:font-semibold"
      />
      <button
        onClick={upload}
        disabled={saving}
        className="ml-4 bg-gold-gradient text-ink px-5 py-2 rounded-xl font-semibold hover:shadow-gold-glow transition-all disabled:opacity-60"
      >
        {saving ? "جاري الرفع..." : "رفع الصورة"}
      </button>
    </div>
  );
}
