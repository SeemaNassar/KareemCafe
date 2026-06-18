"use client";

import { useState } from "react";
import { useCartStore } from "../../store/cartStore";

export default function CartDrawer() {
  const items = useCartStore(
    (state) => state.items
  );

  const isOpen = useCartStore(
    (state) => state.isOpen
  );

  const closeCart = useCartStore(
    (state) => state.closeCart
  );

  const increase = useCartStore(
    (state) => state.increase
  );

  const decrease = useCartStore(
    (state) => state.decrease
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const deliveryFee =
  orderType === "delivery" ? 5 : 0;

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );
  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const finalTotal = total + deliveryFee;

  const whatsappText = encodeURIComponent(`
  طريقة الاستلام:
${orderType === "delivery"
  ? "توصيل"
  : "استلام من المحل"}
الاسم: ${name}
الهاتف: ${phone}
العنوان: ${address}

الطلبات:

${items
  .map(
    (item) =>
      `${item.name} x${item.quantity}`
  )
  .join("\n")}

ملاحظات:
${notes}

المجموع ₪${total}

رسوم التوصيل ₪${deliveryFee}

الإجمالي ₪${finalTotal}
`);

    return (
        <>
        {isOpen && (
            <div
            onClick={closeCart}
            className="
                fixed
                inset-0
                bg-black/40
                z-40
            "
            />
        )}
    
        <div
            className={`
            fixed
            top-0
            right-0
            h-screen
            w-full
            sm:w-[420px]
            bg-[#F8F5EF]
            z-50
            shadow-2xl
            transition-transform
            duration-300
            flex
            flex-col
            ${
                isOpen
                ? "translate-x-0"
                : "translate-x-full"
            }
            `}
        >
            <div
            className="
                flex-1
                overflow-y-auto
                p-6
            "
            >
            <h2
                className="
                text-3xl
                font-bold
                text-[#2A1F1A]
                "
            >
                Your Order
            </h2>
    
            <div className="mt-6 space-y-4">
                {items.map((item) => (
                    <div
                    key={item.id}
                    className="
                    bg-white
                    rounded-2xl
                    p-4
                    flex
                    gap-4
                    "
                    >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="
                        w-20
                        h-20
                        rounded-xl
                        object-cover
                        "
                    />

                    <div className="flex-1">
                        <div className="font-semibold">
                        {item.name}
                        </div>

                        <div className="text-[#C8A97E] mt-1">
                        ₪{item.price}
                        </div>

                        <div
                        className="
                        flex
                        gap-3
                        mt-3
                        items-center
                        "
                        >
                        <button
                            onClick={() => decrease(item.id)}
                            className="
                            w-8
                            h-8
                            rounded-full
                            bg-gray-200
                            "
                        >
                            -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                            onClick={() => increase(item.id)}
                            className="
                            w-8
                            h-8
                            rounded-full
                            bg-[#3A2A22]
                            text-white
                            "
                        >
                            +
                        </button>
                        </div>
                    </div>
                    <button
                        onClick={() =>
                            removeItem(item.id)
                        }
                        className="
                        text-red-500
                        text-sm
                        mt-2
                        "
                        >
                        حذف
                        </button>
                    </div>
                ))}
            </div>
    
            <div className="mt-6">
                <label className="font-semibold text-[#2A1F1A]">
                طريقة الاستلام
                </label>
    
                <div className="flex gap-3 mt-3">
                <button
                    onClick={() => setOrderType("delivery")}
                    className={`px-4 py-2 rounded-xl border ${
                    orderType === "delivery"
                        ? "bg-[#3A2A22] text-white"
                        : "bg-white"
                    }`}
                >
                    🚚 توصيل
                </button>
    
                <button
                    onClick={() => setOrderType("pickup")}
                    className={`px-4 py-2 rounded-xl border ${
                    orderType === "pickup"
                        ? "bg-[#3A2A22] text-white"
                        : "bg-white"
                    }`}
                >
                    🏪 استلام من المحل
                </button>
                </div>
            </div>
    
            <input
                placeholder="الاسم"
                className="w-full mt-6 border p-3 rounded-xl"
                value={name}
                onChange={(e) =>
                setName(e.target.value)
                }
            />
    
            <input
                placeholder="رقم الهاتف"
                className="w-full mt-3 border p-3 rounded-xl"
                value={phone}
                onChange={(e) =>
                setPhone(e.target.value)
                }
            />
    
            {orderType === "delivery" && (
                <input
                placeholder="العنوان"
                className="w-full mt-3 border p-3 rounded-xl"
                value={address}
                onChange={(e) =>
                    setAddress(e.target.value)
                }
                />
            )}
    
            <textarea
                placeholder="ملاحظات"
                className="w-full mt-3 border p-3 rounded-xl"
                value={notes}
                onChange={(e) =>
                setNotes(e.target.value)
                }
            />
    
            <div className="mt-6 border-t pt-4">
                <div className="flex justify-between">
                <span>المجموع</span>
                <span>₪ {total}</span>
                </div>
    
                <div className="flex justify-between mt-2">
                <span>التوصيل</span>
                <span>₪ {deliveryFee}</span>
                </div>
    
                <div
                className="
                    flex
                    justify-between
                    mt-4
                    text-2xl
                    font-bold
                "
                >
                <span>الإجمالي</span>
                <span>₪ {finalTotal}</span>
                </div>
            </div>
            </div>
    
            <div
            className="
                border-t
                bg-[#F8F5EF]
                p-4
                shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
            "
            >
            <a
                href={`https://wa.me/970594650848?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                block
                w-full
                text-center
                bg-green-500
                hover:bg-green-600
                text-white
                py-4
                rounded-xl
                font-bold
                transition
                "
            >
                إرسال الطلب عبر واتساب
            </a>
            </div>
        </div>
        </>
    );
}