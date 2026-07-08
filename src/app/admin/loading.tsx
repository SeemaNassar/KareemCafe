"use client";

export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center bg-ink text-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        <p className="text-cream/50 text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
}
