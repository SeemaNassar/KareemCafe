"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase-browser";
import { uploadImage } from "../../../utils/storage";

export default function AddOfferForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleAdd() {
    let imageUrl = "";
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        alert((err as Error).message);
        return;
      }
    }
    const { error } = await supabase.from("offers").insert({
      title,
      description,
      image: imageUrl,
      active: true,
    });
    if (error) {
      alert(error.message);
      return;
    }
    location.reload();
  }

  const inputClass =
    "w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition mb-3";

  return (
    <div className="glass rounded-3xl p-6 shadow-luxe">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={inputClass}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="mb-4 text-cream/70 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gold-gradient file:text-ink file:font-semibold"
      />
      <button
        onClick={handleAdd}
        className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
      >
        Add Offer
      </button>
    </div>
  );
}
