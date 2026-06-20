"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, Plus, Minus, Trash2, Truck, Store } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../../store/cartStore";
import { useRealtimeQuery } from "../../hooks/useRealtimeQuery";
import { supabase } from "../../lib/supabase-browser";
import type { Offer } from "../../types";
import {
  DELIVERY_FEE,
  computeTotals,
  buildWhatsAppOrderLink,
} from "../../utils/cart";

type OrderType = "delivery" | "pickup";
const WHATSAPP_NUMBER = "970594650848";

export default function CartDrawer() {
  const { items, isOpen, closeCart, increase, decrease, removeItem } =
    useCartStore(
      useShallow((s) => ({
        items: s.items,
        isOpen: s.isOpen,
        closeCart: s.closeCart,
        increase: s.increase,
        decrease: s.decrease,
        removeItem: s.removeItem,
      }))
    );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("delivery");

  // Share the offers cache with OffersSection (same table name → one fetch).
  const { data: offers } = useRealtimeQuery<Offer[]>("offers", async () => {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false });
    return { data: (data as Offer[]) ?? [], error: error as Error | null };
  });

  const activeOffers = offers ?? [];
  const breakdown = computeTotals(items, activeOffers);
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const final = breakdown.discountedTotal + deliveryFee;

  const whatsappLink = buildWhatsAppOrderLink(
    items,
    orderType,
    { name, phone, address, notes },
    WHATSAPP_NUMBER,
    activeOffers
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-50 h-screen w-full sm:w-[440px] glass-dark flex flex-col border-l border-gold/15"
          >
            <div className="flex items-center justify-between p-6 border-b border-gold/10">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-gold">
                  Your Order
                </span>
                <h2 className="mt-1 font-display text-3xl font-bold text-cream">
                  Checkout
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="grid place-items-center w-10 h-10 rounded-full glass-light text-cream hover:text-gold transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.length === 0 ? (
                <div className="grid place-items-center h-48 text-center">
                  <div>
                    <div className="text-5xl mb-3 opacity-40">☕</div>
                    <p className="text-cream/50">
                      Your cart is empty.
                      <br />
                      Add something delicious from the menu.
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="glass-light rounded-2xl p-4 flex gap-4"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-1 ring-gold/20 shrink-0">
                        <Image
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
                          }
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-cream truncate">
                          {item.name}
                        </div>
                        <div className="mt-1 font-display text-gold-gradient font-bold">
                          ₪{item.price}
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => decrease(item.id)}
                            className="grid place-items-center w-7 h-7 rounded-full glass-light text-cream hover:text-gold transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-cream tabular-nums w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increase(item.id)}
                            className="grid place-items-center w-7 h-7 rounded-full bg-gold-gradient text-ink"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start text-error/70 hover:text-error transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {items.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-gold">
                      طريقة الاستلام
                    </label>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => setOrderType("delivery")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 transition-all ${
                          orderType === "delivery"
                            ? "bg-gold-gradient text-ink shadow-gold-glow"
                            : "glass-light text-cream/70"
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        توصيل
                      </button>
                      <button
                        onClick={() => setOrderType("pickup")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 transition-all ${
                          orderType === "pickup"
                            ? "bg-gold-gradient text-ink shadow-gold-glow"
                            : "glass-light text-cream/70"
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        استلام
                      </button>
                    </div>
                  </div>

                  <input
                    placeholder="الاسم"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition"
                  />
                  <input
                    placeholder="رقم الهاتف"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition"
                  />
                  {orderType === "delivery" && (
                    <input
                      placeholder="العنوان"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition"
                    />
                  )}
                  <textarea
                    placeholder="ملاحظات"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full glass-light rounded-xl border-0 px-4 py-3 text-cream placeholder:text-cream/40 focus:ring-1 focus:ring-gold/40 outline-none transition resize-none"
                  />
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-gold/10 glass-dark space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-cream/60">
                    <span>المجموع</span>
                    <span className="tabular-nums">₪{breakdown.subtotal.toFixed(0)}</span>
                  </div>
                  {breakdown.savings > 0 && (
                    <div className="flex justify-between text-emerald-400/90">
                      <span>الخصم</span>
                      <span className="tabular-nums">-₪{breakdown.savings.toFixed(0)}</span>
                    </div>
                  )}
                  {breakdown.applied.map((a) => (
                    <div
                      key={a.offer.id}
                      className="flex justify-between text-xs text-cream/40 pl-2"
                    >
                      <span>{a.offer.title}</span>
                      <span className="tabular-nums">
                        {a.bundles} × ₪{a.bundlePrice}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-cream/60">
                    <span>التوصيل</span>
                    <span className="tabular-nums">₪{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gold/10">
                    <span className="font-display text-xl font-bold text-cream">
                      الإجمالي
                    </span>
                    <span className="font-display text-xl font-bold text-gold-gradient tabular-nums">
                      ₪{final.toFixed(0)}
                    </span>
                  </div>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-600 hover:bg-green-500 text-cream py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                >
                  إرسال الطلب عبر واتساب
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
