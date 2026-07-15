import { supabase } from "../lib/supabase-browser";
import type { CartItem, Offer } from "../types";
import { computeDiscountBreakdown } from "../utils/discounts";
import { DELIVERY_FEE } from "../utils/cart";

export type OrderInput = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};

export type OrderValidation = {
  valid: boolean;
  errors: string[];
};

export function validateOrder(
  items: ReadonlyArray<CartItem>,
  orderType: "delivery" | "pickup",
  customer: OrderInput
): OrderValidation {
  const errors: string[] = [];

  if (items.length === 0) errors.push("السلة فارغة");
  if (!customer.name.trim()) errors.push("الاسم مطلوب");
  if (!customer.phone.trim()) errors.push("رقم الهاتف مطلوب");
  if (customer.phone.trim() && customer.phone.trim().length < 7)
    errors.push("رقم الهاتف غير صحيح");
  if (orderType === "delivery" && !customer.address.trim())
    errors.push("العنوان مطلوب للتوصيل");

  return { valid: errors.length === 0, errors };
}

function sanitize(value: string): string {
  return value.trim().slice(0, 500);
}

export async function saveOrder(
  items: ReadonlyArray<CartItem>,
  orderType: "delivery" | "pickup",
  customer: OrderInput,
  offers: ReadonlyArray<Offer> = []
): Promise<void> {
  const validation = validateOrder(items, orderType, customer);
  if (!validation.valid) {
    throw new Error(validation.errors.join("، "));
  }

  const breakdown = computeDiscountBreakdown(items, offers);
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = breakdown.discountedTotal + deliveryFee;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: sanitize(customer.name),
      customer_phone: sanitize(customer.phone),
      customer_address: sanitize(customer.address),
      notes: sanitize(customer.notes),
      order_type: orderType,
      subtotal: breakdown.subtotal,
      discount: breakdown.savings,
      delivery_fee: deliveryFee,
      total,
    })
    .select("id")
    .single();

  if (orderError || !order) throw orderError ?? new Error("فشل في إنشاء الطلب");

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    line_total: item.price * item.quantity,
    size_label: item.sizeLabel ?? null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;
}
