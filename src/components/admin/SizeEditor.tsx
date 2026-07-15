"use client";

import { Plus, X } from "lucide-react";
import type { ProductSize } from "../../types";

type Props = {
  sizes: ProductSize[];
  onChange: (sizes: ProductSize[]) => void;
};

export default function SizeEditor({ sizes, onChange }: Props) {
  function addSize() {
    onChange([...sizes, { label: "", price: 0 }]);
  }

  function updateSize(index: number, field: keyof ProductSize, value: string | number) {
    const next = sizes.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange(next);
  }

  function removeSize(index: number) {
    onChange(sizes.filter((_, i) => i !== index));
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm text-cream/70 font-medium">
          الأحجام والأسعار
        </label>
        <button
          type="button"
          onClick={addSize}
          className="flex items-center gap-1 text-sm text-gold hover:text-gold-bright transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة حجم
        </button>
      </div>

      {sizes.length === 0 ? (
        <p className="text-xs text-cream/40">
          لا توجد أحجام. اتركه فارغاً إذا كان المنتج بحجم واحد.
        </p>
      ) : (
        <div className="space-y-2">
          {sizes.map((size, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={size.label}
                onChange={(e) => updateSize(i, "label", e.target.value)}
                placeholder="اسم الحجم (مثال: وسط)"
                className="flex-1 glass-light rounded-xl border-0 px-3 py-2.5 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition text-sm bg-transparent"
              />
              <input
                type="number"
                min={1}
                value={size.price}
                onChange={(e) => updateSize(i, "price", Math.max(1, Number(e.target.value)))}
                placeholder="السعر"
                className="w-24 glass-light rounded-xl border-0 px-3 py-2.5 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition text-sm bg-transparent"
              />
              <button
                type="button"
                onClick={() => removeSize(i)}
                className="grid place-items-center w-9 h-9 rounded-lg bg-error/15 text-error hover:bg-error/25 transition-colors shrink-0"
                aria-label="Remove size"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
