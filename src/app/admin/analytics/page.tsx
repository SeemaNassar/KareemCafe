import { getSupabaseServerClient } from "../../../lib/supabase";
import AnalyticsDashboard from "./AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = getSupabaseServerClient();

  const since = new Date();
  since.setDate(since.getDate() - 90);

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, customer_name, customer_phone, total, subtotal, discount, delivery_fee, order_type, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  const { data: orderItems, error: itemsError } = await supabase
    .from("order_items")
    .select("product_id, product_name, quantity, line_total, order_id, created_at")
    .gte("created_at", since.toISOString());

  if (ordersError || itemsError) {
    console.error("Analytics fetch error:", ordersError, itemsError);
  }

  return (
    <AnalyticsDashboard
      orders={orders ?? []}
      orderItems={orderItems ?? []}
    />
  );
}
