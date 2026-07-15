import type { CartItem, Offer } from "../types";
import { computeDiscountBreakdown, type DiscountBreakdown } from "./discounts";

export const DELIVERY_FEE = 5;

/**
 * Sum of every line at normal unit price (before any offers).
 */
export function subtotal(items: ReadonlyArray<CartItem>): number {
  return round2(
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
}

/**
 * Total after offers are applied. If no offers are passed (or none apply),
 * this equals the subtotal. This is the canonical "what the customer pays
 * for items" function used by the cart UI and the WhatsApp order.
 */
export function totalAmount(
  items: ReadonlyArray<CartItem>,
  offers: ReadonlyArray<Offer> = []
): number {
  if (offers.length === 0) return subtotal(items);
  return computeDiscountBreakdown(items, offers).discountedTotal;
}

/**
 * Full breakdown for UI rendering (shows savings, applied offers).
 */
export function computeTotals(
  items: ReadonlyArray<CartItem>,
  offers: ReadonlyArray<Offer> = []
): DiscountBreakdown {
  return computeDiscountBreakdown(items, offers);
}

/**
 * Final total including the delivery fee (0 for pickup).
 */
export function finalTotal(
  items: ReadonlyArray<CartItem>,
  orderType: "delivery" | "pickup",
  offers: ReadonlyArray<Offer> = []
): number {
  return round2(totalAmount(items, offers) + (orderType === "delivery" ? DELIVERY_FEE : 0));
}

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
  phone: string,
  offers: ReadonlyArray<Offer> = []
): string {
  const breakdown = computeDiscountBreakdown(items, offers);
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = round2(breakdown.discountedTotal + deliveryFee);

  const lines = items
    .map((i) => `${i.name}${i.sizeLabel ? ` (${i.sizeLabel})` : ""} x${i.quantity}`)
    .join("\n");

  const offerLines = breakdown.applied.length
    ? `\nالخصومات:\n${breakdown.applied
        .map(
          (a) =>
            `${a.offer.title} (-₪${a.savings.toFixed(0)})`
        )
        .join("\n")}\n`
    : "";

  const body =
    `طريقة الاستلام:\n${orderType === "delivery" ? "توصيل" : "استلام من المحل"}\n` +
    `الاسم: ${customer.name}\n` +
    `الهاتف: ${customer.phone}\n` +
    `العنوان: ${customer.address}\n\n` +
    `الطلبات:\n${lines}\n\n` +
    offerLines +
    `ملاحظات:\n${customer.notes}\n\n` +
    `المجموع ₪${breakdown.subtotal.toFixed(0)}\n` +
    (breakdown.savings > 0 ? `الخصم -₪${breakdown.savings.toFixed(0)}\n` : "") +
    `رسوم التوصيل ₪${deliveryFee}\n` +
    `الإجمالي ₪${total.toFixed(0)}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(body)}`;
}

/**
 * Derive total item count from a cart items array.
 */
export function totalQuantity(items: ReadonlyArray<CartItem>): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

/**
 * Line-item subtotals for rendering (normal price, no offers).
 */
export function lineTotals(items: ReadonlyArray<CartItem>): number[] {
  return items.map((i) => i.price * i.quantity);
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
