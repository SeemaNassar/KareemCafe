"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        : error.message);
      setLoading(false);
      return;
    }
    setTimeout(() => {
      window.location.href = "/admin";
    }, 600);
  }

  return (
    <div className="min-h-screen grid place-items-center bg-ink p-6">
      <div className="absolute inset-0 bg-radial-gold opacity-60" />
      <div className="relative w-full max-w-md glass-dark rounded-3xl p-10 shadow-luxe ring-gold">
        <div className="flex items-center gap-3 mb-8">
          <span className="grid place-items-center w-11 h-11 rounded-full bg-gold-gradient text-ink font-display font-black text-lg">
            K
          </span>
          <div>
            <div className="font-display text-xl font-bold text-cream">
              كافيه كريم
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-gold">
              لوحة الإدارة
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-cream mb-6">
          تسجيل الدخول
        </h1>

        {error && (
          <div className="mb-4 bg-error/15 border border-error/30 text-error rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition mb-4"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition mb-6"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gold-gradient text-ink py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </div>
    </div>
  );
}
