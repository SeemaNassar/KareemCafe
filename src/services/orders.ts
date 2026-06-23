import { supabase } from "../lib/supabase-browser";
import type { CartItem, Offer } from "../types";
import { computeDiscountBreakdown } from "../utils/discounts";
import { DELIVERY_FEE } from "../utils/cart";

export async function saveOrder(
  items: ReadonlyArray<CartItem>,
  orderType: "delivery" | "pickup",
  customer: { name: string; phone: string; address: string; notes: string },
  offers: ReadonlyArray<Offer> = []
): Promise<void> {
  const breakdown = computeDiscountBreakdown(items, offers);
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = breakdown.discountedTotal + deliveryFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_address: customer.address,
      notes: customer.notes,
      order_type: orderType,
      subtotal: breakdown.subtotal,
      discount: breakdown.savings,
      delivery_fee: deliveryFee,
      total,
    })
    .select("id")
    .single();

  if (orderError || !order) throw orderError ?? new Error("Failed to create order");

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;
}