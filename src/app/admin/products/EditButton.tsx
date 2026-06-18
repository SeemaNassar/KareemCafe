"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function EditButton({
  product,
}: {
  product: any;
}) {
  const [open, setOpen] =
    useState(false);

  const [name, setName] =
    useState(product.name);

  const [description, setDescription] =
    useState(product.description);

  const [price, setPrice] =
    useState(product.price);

  const [featured, setFeatured] =
    useState(product.featured);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

    async function save() {
      let imageUrl = product.image;
    
      if (imageFile) {
        // حذف الصورة القديمة أولاً
        if (product.image) {
          const oldPath = product.image.split(
            "/storage/v1/object/public/cafe-images/"
          )[1];
    
          console.log("Deleting:", oldPath);
    
          const { error: deleteError } =
            await supabase.storage
              .from("cafe-images")
              .remove([oldPath]);
    
          if (deleteError) {
            console.error(deleteError);
          }
        }
    
        // رفع الصورة الجديدة
        const fileName =
          `${Date.now()}-${imageFile.name}`;
    
        const { error: uploadError } =
          await supabase.storage
            .from("cafe-images")
            .upload(
              fileName,
              imageFile,
              {
                upsert: true,
              }
            );
    
        if (uploadError) {
          alert(uploadError.message);
          return;
        }
    
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("cafe-images")
          .getPublicUrl(fileName);
    
        imageUrl = publicUrl;
      }
    
      const { error } =
        await supabase
          .from("products")
          .update({
            name,
            description,
            price,
            featured,
            image: imageUrl,
          })
          .eq("id", product.id);
    
      if (error) {
        alert(error.message);
        return;
      }
    
      alert("Updated");
      location.reload();
    }

  function getFilePathFromUrl(url: string) {
    return url.split("/cafe-images/")[1];
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
            w-[500px]
            "
          >
            <h2
              className="
              text-2xl
              font-bold
              mb-5
              "
            >
              Edit Product
            </h2>
            <img
                src={product.image}
                alt={product.name}
                className="
                    w-full
                    h-48
                    object-cover
                    rounded-xl
                    mb-4
                "
                />
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
              mb-3
              "
            />

            <textarea
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
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(
                  Number(
                    e.target.value
                  )
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

            <label
              className="
              flex
              gap-2
              mb-5
              "
            >
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) =>
                  setFeatured(
                    e.target.checked
                  )
                }
              />

              Featured Product
            </label>

            <input
                type="file"
                onChange={(e) =>
                    setImageFile(
                    e.target.files?.[0] || null
                    )
                }
                className="mb-4"
                />
            <div
              className="
              flex
              gap-3
              "
            >
              <button
                onClick={save}
                className="
                bg-green-500
                text-white
                px-5
                py-3
                rounded-xl
                "
              >
                Save
              </button>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                bg-gray-300
                px-5
                py-3
                rounded-xl
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}