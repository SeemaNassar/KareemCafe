"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabase-browser";
import { uploadImage, removeImageByUrl } from "../../../utils/storage";
import SizeEditor from "../../../components/admin/SizeEditor";
import type { Product, ProductSize } from "../../../types";

export default function EditButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [price, setPrice] = useState(product.price);
  const [featured, setFeatured] = useState(product.featured ?? false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<ProductSize[]>(product.sizes ?? []);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    let imageUrl = product.image;
    if (imageFile) {
      try {
        await removeImageByUrl(product.image);
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        alert((err as Error).message);
        setSaving(false);
        return;
      }
    }

    const validSizes = sizes
      .filter((s) => s.label.trim() && s.price > 0)
      .map((s) => ({ label: s.label.trim(), price: Number(s.price) }));

    const { error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        featured,
        image: imageUrl,
        sizes: validSizes.length > 0 ? validSizes : null,
      })
      .eq("id", product.id);
    if (error) {
      alert(error.message);
      setSaving(false);
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
        تعديل
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
              تعديل المنتج
            </h2>
            {product.image && (
              <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden ring-1 ring-gold/20">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="500px"
                  className="object-cover"
                />
              </div>
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم المنتج"
              className={inputClass}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="الوصف"
              className={inputClass}
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="السعر الأساسي"
              className={inputClass}
            />
            <SizeEditor sizes={sizes} onChange={setSizes} />
            <label className="flex items-center gap-2 mb-5 text-cream/70">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-gold"
              />
              منتج مميز
            </label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mb-4 text-cream/70 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-gold-gradient file:text-ink file:font-semibold"
            />
            <div className="flex gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="bg-gold-gradient text-ink px-5 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all disabled:opacity-60"
              >
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="glass-light text-cream/70 px-5 py-3 rounded-xl hover:text-cream transition-colors"
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
