import { useState } from 'react'
import type { ProductWithVariants } from '../lib/types'
import { useCart } from '../lib/cart'

interface ProductCardProps {
  product: ProductWithVariants
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const hasVariants = product.variants.length > 0
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    hasVariants ? product.variants[0].id : null,
  )

  const selectedVariant = hasVariants
    ? product.variants.find(v => v.id === selectedVariantId) ?? product.variants[0]
    : null

  const displayPrice = hasVariants ? selectedVariant!.price : product.price

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      product_name: hasVariants ? `${product.name} (${selectedVariant!.name})` : product.name,
      unit_price: displayPrice,
      quantity: 1,
      image: product.image,
      variant_id: hasVariants ? selectedVariant!.id : null,
      variant_name: hasVariants ? selectedVariant!.name : null,
    })
  }

  return (
    <div className="card group overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-100">
            <span className="text-4xl">☕</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold text-stone-800">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-stone-500 line-clamp-2">{product.description}</p>
        )}

        {hasVariants ? (
          <div className="mt-3">
            <span className="mb-1.5 block text-xs font-medium text-stone-500">Size</span>
            <div className="flex flex-wrap gap-2">
              {product.variants.map(variant => {
                const isSelected = variant.id === selectedVariantId
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-stone-300 bg-white text-stone-600 hover:border-brand-400 hover:text-brand-600'
                    }`}
                  >
                    {variant.name}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-xl font-bold text-brand-700">
            ${displayPrice.toFixed(2)}
          </span>
          <button onClick={handleAdd} className="btn-primary text-xs px-4 py-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
