import { supabase } from "../../../lib/supabase";

import AddCategoryForm from "./AddCategoryForm";
import EditCategoryButton from "./EditCategoryButton";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function CategoriesPage() {
  const { data: categories } =
    await supabase
      .from("categories")
      .select("*")
      .order("id");

  return (
    <div className="p-10">
      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >
        Categories
      </h1>

      <AddCategoryForm />

      <table
        className="
        w-full
        bg-white
        rounded-2xl
        overflow-hidden
        "
      >
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">
              Name
            </th>

            <th className="p-4">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories?.map(
            (category) => (
              <tr
                key={category.id}
                className="
                border-b
                "
              >
                <td className="p-4">
                  {category.name}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <EditCategoryButton
                      category={category}
                    />

                    <DeleteCategoryButton
                      id={category.id}
                      name={category.name}
                    />
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}