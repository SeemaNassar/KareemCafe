"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EditCategoryButton({
  category,
}: {
  category: any;
}) {
  const [name, setName] =
    useState(category.name);

  const [open, setOpen] =
    useState(false);

  async function save() {
    const { error } =
      await supabase
        .from("categories")
        .update({
          name,
        })
        .eq("id", category.id);

    if (error) {
      alert(error.message);
      return;
    }

    location.reload();
  }

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
        bg-amber-500
        text-white
        px-4
        py-2
        rounded-xl
        "
      >
        Edit
      </button>

      {open && (
        <div
          className="
          fixed
          inset-0
          bg-black/50
          flex
          items-center
          justify-center
          z-50
          "
        >
          <div
            className="
            bg-white
            p-8
            rounded-3xl
            w-[450px]
            "
          >
            <h2
              className="
              text-2xl
              font-bold
              mb-4
              "
            >
              Edit Category
            </h2>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="
              w-full
              border
              p-3
              rounded-xl
              mb-4
              "
            />

            <button
              onClick={save}
              className="
              bg-green-600
              text-white
              px-6
              py-3
              rounded-xl
              "
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}