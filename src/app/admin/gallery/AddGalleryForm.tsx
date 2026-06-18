"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddGalleryForm() {
  const [file, setFile] = useState<File | null>(null);

  async function upload() {
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("cafe-images")
      .upload(fileName, file, { upsert: true });
    if (error) {
      alert(error.message);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("cafe-images").getPublicUrl(fileName);
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
        className="ml-4 bg-gold-gradient text-ink px-5 py-2 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
      >
        Upload
      </button>
    </div>
  );
}
