import { supabase } from "../../../lib/supabase";
import AddProductForm from "./AddProductForm";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export default async function ProductsAdmin() {
  const { data: products } =
    await supabase
      .from("products")
      .select("*");

  return (
    <div
      className="
      min-h-screen
      bg-[#F8F5EF]
      p-10
      "
    >
      <h1
        className="
        text-4xl
        font-bold
        mb-10
        "
      >
        Products
      </h1>
      <AddProductForm />
      <table
        className="
        w-full
        bg-white
        rounded-3xl
        overflow-hidden
        "
      >
        <thead>
          <tr className="bg-[#3A2A22] text-white">
            <th className="p-4">
              Name
            </th>

            <th className="p-4">
              Price
            </th>

            <th className="p-4">
              Featured
            </th>
            <th className="p-4">
                Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products?.map((product) => (
            <tr
              key={product.id}
              className="
              border-b
              "
            >
              <td className="p-4">
                {product.name}
              </td>

              <td className="p-4">
                ₪{product.price}
              </td>

              <td className="p-4">
                {product.featured
                  ? "⭐"
                  : "-"}
              </td>
              <td className="p-4">
  <div className="flex gap-2">
    <EditButton
      product={product}
    />

    <DeleteButton
      id={product.id}
      image={product.image}
    />
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}