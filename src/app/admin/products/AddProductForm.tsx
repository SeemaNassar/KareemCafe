"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase-browser";
import { uploadImage } from "../../../utils/storage";
import type { Category } from "../../../types";

export default function AddProductForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .then(({ data }) => setCategories(data || []));
  }, []);

  async function handleSubmit() {
    if (!imageFile) {
      alert("Select image");
      return;
    }
    let publicUrl: string;
    try {
      publicUrl = await uploadImage(imageFile);
    } catch (err) {
      alert((err as Error).message);
      return;
    }

    const { error } = await supabase.from("products").insert({
      name,
      description,
      price: Number(price),
      image: publicUrl,
      category_id: Number(categoryId),
      featured,
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
    <div className="glass rounded-3xl p-8 shadow-luxe mb-10">
      <h2 className="font-display text-2xl font-bold text-cream mb-6">
        Add Product
      </h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputClass}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={inputClass}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className={inputClass}
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className={inputClass}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        className="mb-4 text-cream/70 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gold-gradient file:text-ink file:font-semibold"
      />
      <label className="flex items-center gap-2 mb-5 text-cream/70">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="accent-gold"
        />
        Featured Product
      </label>
      <button
        onClick={handleSubmit}
        className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
      >
        Add Product
      </button>
    </div>
  );
}
