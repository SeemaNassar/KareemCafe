"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    console.log("SESSION:", session);
  
    if (!session) {
      console.log("NO SESSION");
      router.replace("/login");
      return;
    }
  
    console.log("USER:", session.user.email);
  
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();

    router.replace("/login");
  }

  if (loading) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#F8F5EF]
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-[#F8F5EF]
      p-10
      "
    >
      <div
        className="
        flex
        justify-between
        items-center
        "
      >
        <div>
          <h1
            className="
            text-5xl
            font-black
            text-[#2A1F1A]
            "
          >
            Admin Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your cafe content
          </p>
        </div>

        <button
          onClick={logout}
          className="
          bg-red-500
          hover:bg-red-600
          text-white
          px-5
          py-3
          rounded-xl
          transition
          "
        >
          Logout
        </button>
      </div>

      <div
        className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        mt-12
        "
      >
        <Link
          href="/admin/products"
          className="
          bg-white
          p-8
          rounded-3xl
          shadow-lg
          hover:-translate-y-2
          transition
          "
        >
          ☕ Products
        </Link>

        <Link
          href="/admin/categories"
          className="
          bg-white
          p-8
          rounded-3xl
          shadow-lg
          hover:-translate-y-2
          transition
          "
        >
          🏷 Categories
        </Link>

        <Link
          href="/admin/offers"
          className="
          bg-white
          p-8
          rounded-3xl
          shadow-lg
          hover:-translate-y-2
          transition
          "
        >
          🔥 Offers
        </Link>

        <Link
          href="/admin/gallery"
          className="
          bg-white
          p-8
          rounded-3xl
          shadow-lg
          hover:-translate-y-2
          transition
          "
        >
          📸 Gallery
        </Link>
      </div>
    </div>
  );
}