"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

    async function handleLogin() {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
    
      if (error) {
        alert(error.message);
        return;
      }
    
      setTimeout(() => {
        window.location.href =
          "/admin";
      }, 1000);
    }
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
      <div
        className="
        bg-white
        p-10
        rounded-3xl
        shadow-xl
        w-[400px]
        "
      >
        <h1
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
          w-full
          border
          p-3
          rounded-xl
          mb-4
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
          w-full
          border
          p-3
          rounded-xl
          mb-6
          "
        />

        <button
          onClick={handleLogin}
          className="
          w-full
          bg-[#3A2A22]
          text-white
          py-3
          rounded-xl
          "
        >
          Login
        </button>
      </div>
    </div>
  );
}