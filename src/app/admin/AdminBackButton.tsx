import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdminBackButton() {
  return (
    <Link
      href="/admin"
      className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors mb-6 group"
    >
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      <span className="text-sm font-medium">العودة للوحة التحكم</span>
    </Link>
  );
}
