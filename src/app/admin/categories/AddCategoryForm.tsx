"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddCategoryForm() {
  const [name, setName] =
    useState("");

  async function handleAdd() {
    if (!name.trim()) return;

    const { error } =
      await supabase
        .from("categories")
        .insert({
          name,
        });

    if (error) {
      alert(error.message);
      return;
    }

    location.reload();
  }

  return (
    <div
      className="
      bg-white
      p-6
      rounded-2xl
      shadow
      mb-8
      "
    >
      <h2
        className="
        text-2xl
        font-bold
        mb-4
        "
      >
        Add Category
      </h2>

      <input
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Category Name"
        className="
        w-full
        border
        p-3
        rounded-xl
        mb-4
        "
      />

      <button
        onClick={handleAdd}
        className="
        bg-green-600
        text-white
        px-6
        py-3
        rounded-xl
        "
      >
        Add Category
      </button>
    </div>
  );
}