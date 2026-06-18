"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EditButton({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [featured, setFeatured] = useState(product.featured);
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function save() {
    let imageUrl = product.image;
    if (imageFile) {
      if (product.image) {
        const oldPath = product.image.split(
          "/storage/v1/object/public/cafe-images/"
        )[1];
        await supabase.storage.from("cafe-images").remove([oldPath]);
      }
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("cafe-images")
        .upload(fileName, imageFile, { upsert: true });
      if (uploadError) {
        alert(uploadError.message);
        return;
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("cafe-images").getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    const { error } = await supabase
      .from("products")
      .update({ name, description, price, featured, image: imageUrl })
      .eq("id", product.id);
    if (error) {
      alert(error.message);
      return;
    }
    location.reload();
  }

  const inputClass =
    "w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition mb-3 bg-transparent";

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
            className="glass-dark rounded-3xl p-8 w-full max-w-lg shadow-luxe ring-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl font-bold text-cream mb-5">
              Edit Product
            </h2>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4 ring-1 ring-gold/20"
              />
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className={inputClass}
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
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mb-4 text-cream/70 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gold-gradient file:text-ink file:font-semibold"
            />
            <div className="flex gap-3">
              <button
                onClick={save}
                className="bg-gold-gradient text-ink px-5 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setOpen(false)}
                className="glass-light text-cream/70 px-5 py-3 rounded-xl hover:text-cream transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
