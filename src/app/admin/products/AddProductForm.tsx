"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AddProductForm() {
  const [categories, setCategories] =
    useState<any[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [featured, setFeatured] =
    useState(false);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } =
      await supabase
        .from("categories")
        .select("*");

    setCategories(data || []);
  }

  async function handleSubmit() {
    if (!imageFile) {
      alert("Select image");
      return;
    }

    const fileName =
      `${Date.now()}-${imageFile.name}`;

      const { data, error: uploadError } =
      await supabase.storage
        .from("cafe-images")
        .upload(
          fileName,
          imageFile,
          {
            upsert: true,
          }
        );
    
    console.log(data);
    console.log(uploadError);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("cafe-images")
      .getPublicUrl(fileName);

    const { error } =
      await supabase
        .from("products")
        .insert({
          name,
          description,
          price: Number(price),
          image: publicUrl,
          category_id:
            Number(categoryId),
          featured,
        });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Product Added");

    location.reload();
  }

  return (
    <div
      className="
      bg-white
      p-8
      rounded-3xl
      shadow-lg
      mb-10
      "
    >
      <h2 className="text-2xl font-bold mb-6">
        Add Product
      </h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
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
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(e.target.value)
        }
        className="
        w-full
        border
        p-3
        rounded-xl
        mb-3
        "
      />

      <select
        value={categoryId}
        onChange={(e) =>
          setCategoryId(
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
      >
        <option value="">
          Select Category
        </option>

        {categories.map(
          (category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          )
        )}
      </select>

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

      <button
        onClick={handleSubmit}
        className="
        bg-[#3A2A22]
        text-white
        px-6
        py-3
        rounded-xl
        "
      >
        Add Product
      </button>
    </div>
  );
}