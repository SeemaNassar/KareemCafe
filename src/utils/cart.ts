import type { CartItem } from "../types";

/**
 * Derive total item count from a cart items array.
 */
export function totalQuantity(items: ReadonlyArray<CartItem>): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Derive line-item subtotals for rendering.
 */
export function lineTotals(items: ReadonlyArray<CartItem>): number[] {
  return items.map((i) => i.price * i.quantity);
}

/**
 * Total price of all items (excluding delivery).
 */
export function totalAmount(items: ReadonlyArray<CartItem>): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/**
 * Final total including the delivery fee (0 for pickup).
 */
export function finalTotal(
  items: ReadonlyArray<CartItem>,
  orderType: "delivery" | "pickup"
): number {
  return totalAmount(items) + (orderType === "delivery" ? 5 : 0);
}

export const DELIVERY_FEE = 5;

/**
 * Build the WhatsApp message query string for an order.
 */
export function buildWhatsAppOrderLink(
  items: ReadonlyArray<CartItem>,
  orderType: "delivery" | "pickup",
  customer: {
    name: string;
    phone: string;
    address: string;
    notes: string;
  },
  phone: string
): string {
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = totalAmount(items) + deliveryFee;
  const body =
    `طريقة الاستلام:\n${orderType === "delivery" ? "توصيل" : "استلام من المحل"}\n` +
    `الاسم: ${customer.name}\n` +
    `الهاتف: ${customer.phone}\n` +
    `العنوان: ${customer.address}\n\n` +
    `الطلبات:\n${items.map((i) => `${i.name} x${i.quantity}`).join("\n")}\n\n` +
    `ملاحظات:\n${customer.notes}\n\n` +
    `المجموع ₪${totalAmount(items)}\n` +
    `رسوم التوصيل ₪${deliveryFee}\n` +
    `الإجمالي ₪${total}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
}
