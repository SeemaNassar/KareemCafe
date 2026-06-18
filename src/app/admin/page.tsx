"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-ink text-cream">
        Loading...
      </div>
    );
  }

  const cards = [
    { href: "/admin/products", label: "Products", icon: "☕" },
    { href: "/admin/categories", label: "Categories", icon: "🏷" },
    { href: "/admin/offers", label: "Offers", icon: "🔥" },
    { href: "/admin/gallery", label: "Gallery", icon: "📸" },
  ];

  return (
    <div className="min-h-screen bg-ink p-8 md:p-12 text-cream">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-gold">
            Dashboard
          </span>
          <h1 className="mt-2 font-display text-5xl font-black text-cream">
            Admin <span className="text-gold-gradient">Panel</span>
          </h1>
          <p className="mt-3 text-cream/50">Manage your cafe content</p>
        </div>
        <button
          onClick={logout}
          className="bg-error hover:bg-error/80 text-cream px-5 py-3 rounded-xl transition-colors font-medium"
        >
          Logout
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group glass rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-luxe"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <div className="font-display text-2xl font-bold text-cream group-hover:text-gold-gradient transition-all">
              {card.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
