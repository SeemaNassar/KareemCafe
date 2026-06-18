"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddGalleryForm() {
  const [file, setFile] =
    useState<File | null>(null);

  async function upload() {
    if (!file) return;

    const fileName =
      `${Date.now()}-${file.name}`;

    const { error } =
      await supabase.storage
        .from("cafe-images")
        .upload(
          fileName,
          file,
          {
            upsert: true,
          }
        );

    if (error) {
      alert(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("cafe-images")
      .getPublicUrl(fileName);

    await supabase
      .from("gallery")
      .insert({
        image: publicUrl,
      });

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
        type="file"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] ||
              null
          )
        }
      />

      <button
        onClick={upload}
        className="
        ml-4
        bg-green-600
        text-white
        px-5
        py-2
        rounded-xl
        "
      >
        Upload
      </button>
    </div>
  );
}