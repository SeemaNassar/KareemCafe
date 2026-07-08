import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-ink text-cream p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">☕</div>
        <h1 className="font-display text-4xl font-bold text-cream mb-3">
          404
        </h1>
        <p className="text-cream/50 mb-6">الصفحة غير موجودة</p>
        <Link
          href="/"
          className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
