"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen grid place-items-center bg-ink text-cream p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠</div>
          <h2 className="font-display text-2xl font-bold text-cream mb-3">
            حدث خطأ في التطبيق
          </h2>
          <p className="text-cream/50 mb-6">
            {error.message || "يرجى المحاولة مرة أخرى"}
          </p>
          <button
            onClick={reset}
            className="bg-gold-gradient text-ink px-6 py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
