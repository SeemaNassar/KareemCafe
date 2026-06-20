"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase-browser";
import { uploadImage } from "../../../utils/storage";
import type { Product } from "../../../types";

export default function AddOfferForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | "">("");
  const [requiredQty, setRequiredQty] = useState<number>(2);
  const [discountedPrice, setDiscountedPrice] = useState<number>(0);
  const [useDiscount, setUseDiscount] = useState(false);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("name")
      .then(({ data }) => setProducts((data as Product[]) ?? []));
  }, []);

  const selected = products.find((p) => p.id === Number(productId));

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

    const payload = {
      title,
      description,
      image: imageUrl,
      active: true,
      product_id: useDiscount && productId !== "" ? Number(productId) : null,
      required_quantity: useDiscount && requiredQty > 1 ? requiredQty : null,
      discounted_price: useDiscount ? discountedPrice : null,
    };

    const { error } = await supabase.from("offers").insert(payload);
    if (error) {
      alert(error.message);
      return;
    }
    location.reload();
  }

  const inputClass =
    "w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition mb-3 bg-transparent";

  return (
    <div className="glass rounded-3xl p-6 shadow-luxe">
      <input
        placeholder="Title (e.g. 2 Mojitos for 30₪)"
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

      <label className="flex items-center gap-2 mb-4 text-cream/70">
        <input
          type="checkbox"
          checked={useDiscount}
          onChange={(e) => setUseDiscount(e.target.checked)}
          className="accent-gold"
        />
        Apply a quantity-based discount
      </label>

      {useDiscount && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <select
            value={productId}
            onChange={(e) =>
              setProductId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className={inputClass}
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (₪{p.price})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={2}
            value={requiredQty}
            onChange={(e) => setRequiredQty(Number(e.target.value))}
            placeholder="Required qty"
            className={inputClass}
          />
          <input
            type="number"
            min={0}
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(Number(e.target.value))}
            placeholder="Bundle price"
            className={inputClass}
          />
        </div>
      )}

      {useDiscount && selected && requiredQty > 1 && discountedPrice > 0 && (
        <p className="text-sm text-emerald-400/90 mb-4">
          Preview: {requiredQty} × {selected.name} for ₪{discountedPrice}{" "}
          (normal ₪{(selected.price * requiredQty).toFixed(0)})
        </p>
      )}

      <button
        onClick={handleAdd}
        className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
      >
        Add Offer
      </button>
    </div>
  );
}
