import { supabase } from "../../../lib/supabase";
import AddProductForm from "./AddProductForm";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export default async function ProductsAdmin() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  return (
    <div className="min-h-screen bg-ink p-8 md:p-12 text-cream">
      <h1 className="font-display text-4xl font-bold text-cream mb-10">
        Products
      </h1>
      <AddProductForm />
      <div className="mt-10 overflow-x-auto rounded-3xl glass shadow-luxe">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/15 text-left text-xs uppercase tracking-[0.2em] text-gold">
              <th className="p-5">Name</th>
              <th className="p-5">Price</th>
              <th className="p-5">Featured</th>
              <th className="p-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gold/10 hover:bg-gold/5 transition-colors"
              >
                <td className="p-5 font-medium">{product.name}</td>
                <td className="p-5 text-gold-gradient font-semibold">
                  ₪{product.price}
                </td>
                <td className="p-5">{product.featured ? "⭐" : "—"}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <EditButton product={product} />
                    <DeleteButton id={product.id} image={product.image} />
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
