import { supabase } from "../../../lib/supabase";
import AddCategoryForm from "./AddCategoryForm";
import EditCategoryButton from "./EditCategoryButton";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function CategoriesPage() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  return (
    <div className="min-h-screen bg-ink p-8 md:p-12 text-cream">
      <h1 className="font-display text-4xl font-bold text-cream mb-10">
        Categories
      </h1>
      <AddCategoryForm />
      <div className="mt-10 overflow-hidden rounded-2xl glass shadow-luxe">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/15 text-left text-xs uppercase tracking-[0.2em] text-gold">
              <th className="p-5">Name</th>
              <th className="p-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr
                key={category.id}
                className="border-b border-gold/10 hover:bg-gold/5 transition-colors"
              >
                <td className="p-5 font-medium">{category.name}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <EditCategoryButton category={category} />
                    <DeleteCategoryButton
                      id={category.id}
                      name={category.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
