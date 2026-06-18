"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddOfferForm() {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  async function handleAdd() {
    let imageUrl = "";

    if (imageFile) {
      const fileName =
        `${Date.now()}-${imageFile.name}`;

      const { error } =
        await supabase.storage
          .from("cafe-images")
          .upload(
            fileName,
            imageFile,
            {
              upsert: true,
            }
          );

      if (error) {
        alert(error.message);
        return;
      }

      imageUrl =
        supabase.storage
          .from("cafe-images")
          .getPublicUrl(fileName)
          .data.publicUrl;
    }

    const { error } =
      await supabase
        .from("offers")
        .insert({
          title,
          description,
          image: imageUrl,
          active: true,
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
      rounded-3xl
      shadow
      "
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        className="
        w-full
        border
        p-3
        rounded-xl
        mb-3
        "
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        className="
        w-full
        border
        p-3
        rounded-xl
        mb-3
        "
      />

      <input
        type="file"
        onChange={(e) =>
          setImageFile(
            e.target.files?.[0] ||
              null
          )
        }
        className="mb-4"
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
        Add Offer
      </button>
    </div>
  );
}