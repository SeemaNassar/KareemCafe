export function ProductCardSkeleton() {
  return (
    <div className="rounded-[1.75rem] glass overflow-hidden shadow-luxe animate-pulse">
      <div className="aspect-[4/3] bg-cream/5" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-2/3 rounded-full bg-cream/5" />
        <div className="h-3 w-full rounded-full bg-cream/5" />
        <div className="h-3 w-1/2 rounded-full bg-cream/5" />
        <div className="flex justify-between items-center pt-3">
          <div className="h-6 w-12 rounded-full bg-cream/5" />
          <div className="h-8 w-16 rounded-full bg-cream/5" />
        </div>
      </div>
    </div>
  );
}

export function MenuSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OfferCardSkeleton() {
  return (
    <div className="rounded-[1.75rem] glass overflow-hidden shadow-luxe animate-pulse">
      <div className="aspect-[4/3] bg-cream/5" />
      <div className="p-7 space-y-3">
        <div className="h-5 w-1/2 rounded-full bg-cream/5" />
        <div className="h-3 w-full rounded-full bg-cream/5" />
        <div className="h-3 w-2/3 rounded-full bg-cream/5" />
      </div>
    </div>
  );
}

export function OfferGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-3xl bg-cream/5 animate-pulse ${
            i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
          }`}
        />
      ))}
    </div>
  );
}
