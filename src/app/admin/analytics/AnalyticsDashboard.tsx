"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingBag, DollarSign, Package,
  Calendar, Award, BarChart2,
} from "lucide-react";

type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  total: number;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  order_type: string;
  created_at: string;
};

type OrderItem = {
  product_id: number | null;
  product_name: string;
  quantity: number;
  line_total: number;
  order_id: number;
  created_at: string;
};

type Period = "7" | "30" | "90";

function getStartDate(period: Period): Date {
  const d = new Date();
  d.setDate(d.getDate() - parseInt(period));
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmt(n: number) {
  return `₪${n.toFixed(0)}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    month: "short",
    day: "numeric",
  });
}

function MiniBar({
  value,
  max,
  gold = false,
}: {
  value: number;
  max: number;
  gold?: boolean;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 rounded-full glass-light overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`h-full rounded-full ${gold ? "bg-gold-gradient" : "bg-cream/25"}`}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-light rounded-2xl p-5 flex gap-4 items-start"
    >
      <span className="grid place-items-center w-11 h-11 rounded-xl bg-gold-gradient text-ink shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold text-cream">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-cream/50">{sub}</p>}
      </div>
    </motion.div>
  );
}

function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export default function AnalyticsDashboard({
  orders,
  orderItems,
}: {
  orders: Order[];
  orderItems: OrderItem[];
}) {
  const [period, setPeriod] = useState<Period>("30");

  const start = useMemo(() => getStartDate(period), [period]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => new Date(o.created_at) >= start),
    [orders, start]
  );

  const filteredItems = useMemo(
    () => orderItems.filter((i) => new Date(i.created_at) >= start),
    [orderItems, start]
  );

  // ── Core stats ───────────────────────────────────────────────────
  const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.total), 0);
  const totalDiscount = filteredOrders.reduce((s, o) => s + Number(o.discount), 0);
  const totalOrders = filteredOrders.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const deliveryCount = filteredOrders.filter((o) => o.order_type === "delivery").length;
  const pickupCount = totalOrders - deliveryCount;

  // ── Best sellers ─────────────────────────────────────────────────
  const productMap = new Map<string, { qty: number; revenue: number }>();
  for (const item of filteredItems) {
    const cur = productMap.get(item.product_name) ?? { qty: 0, revenue: 0 };
    productMap.set(item.product_name, {
      qty: cur.qty + item.quantity,
      revenue: cur.revenue + Number(item.line_total),
    });
  }
  const bestSellers = [...productMap.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8);
  const maxQty = bestSellers[0]?.qty ?? 1;

  // ── Revenue by day ────────────────────────────────────────────────
  const dayMap = new Map<string, number>();
  for (const o of filteredOrders) {
    const day = o.created_at.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + Number(o.total));
  }
  // أخذ آخر N يوم بشكل صحيح
  const maxBars = parseInt(period) <= 30 ? parseInt(period) : 30;
  const chartDays = [...dayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-maxBars);
  const maxRevDay = Math.max(...chartDays.map(([, v]) => v), 1);

  // ── Orders by day of week ─────────────────────────────────────────
  const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const dowCount = new Array(7).fill(0) as number[];
  for (const o of filteredOrders) {
    dowCount[new Date(o.created_at).getDay()]++;
  }
  const maxDow = Math.max(...dowCount, 1);
  const busiestDay = weekdays[dowCount.indexOf(Math.max(...dowCount))];

  const periods: { label: string; value: Period }[] = [
    { label: "آخر أسبوع", value: "7" },
    { label: "آخر شهر", value: "30" },
    { label: "آخر 3 أشهر", value: "90" },
  ];

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">كافيه كريم</p>
            <h1 className="mt-1 font-display text-4xl font-bold text-cream">التحليلات</h1>
          </div>
          <div className="flex gap-2 glass-light p-1 rounded-xl self-start sm:self-auto">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p.value
                    ? "bg-gold-gradient text-ink shadow-gold-glow"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="الإيرادات"  value={fmt(totalRevenue)}  sub={`خصم ${fmt(totalDiscount)}`} delay={0} />
          <StatCard icon={ShoppingBag} label="الطلبات"   value={`${totalOrders}`}   sub={`متوسط ${fmt(avgOrder)}`}    delay={0.05} />
          <StatCard icon={TruckIcon}   label="التوصيل"   value={`${deliveryCount}`} sub={`استلام ${pickupCount}`}     delay={0.1} />
          <StatCard icon={Package}     label="المنتجات"  value={`${productMap.size}`} sub="نوع مختلف"               delay={0.15} />
        </div>

        {/* Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-light rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-gold" />
            <h2 className="font-display text-xl font-bold text-cream">الإيرادات اليومية</h2>
            <span className="mr-auto text-xs text-cream/40">{chartDays.length} يوم</span>
          </div>

          {chartDays.length === 0 ? (
            <p className="text-cream/40 text-center py-12">لا يوجد بيانات في هذه الفترة</p>
          ) : (
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute right-0 top-0 h-[120px] flex flex-col justify-between text-[10px] text-cream/30 pr-1 pointer-events-none">
                <span>{fmt(maxRevDay)}</span>
                <span>{fmt(maxRevDay / 2)}</span>
                <span>₪0</span>
              </div>
              {/* Bars */}
              <div className="flex items-end gap-2 pr-10 overflow-x-auto pb-8" style={{ height: "160px" }}>
                {chartDays.map(([day, rev], i) => (
                  <div
                    key={day}
                    className="flex flex-col items-center flex-1 min-w-[24px] group cursor-default"
                    style={{ height: "120px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
                  >
                    <div className="relative w-full" style={{ height: `${(rev / maxRevDay) * 100}%`, minHeight: "4px" }}>
                      <motion.div
                        className="w-full h-full bg-gold-gradient rounded-t-md"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        style={{ transformOrigin: "bottom" }}
                        transition={{ delay: 0.25 + i * 0.02, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                      {/* Tooltip */}
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-gold bg-ink border border-gold/20 px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {fmt(rev)}
                      </span>
                    </div>
                    <span className="mt-2 text-[9px] text-cream/30 whitespace-nowrap">
                      {day.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Best Sellers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-light rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-gold" />
              <h2 className="font-display text-xl font-bold text-cream">الأكثر طلباً</h2>
            </div>

            {bestSellers.length === 0 ? (
              <p className="text-cream/40 text-center py-12">لا يوجد بيانات بعد</p>
            ) : (
              <div className="space-y-5">
                {bestSellers.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (
                            <span className="text-xs text-cream/30 w-4 inline-block text-center">{i + 1}</span>
                          )}
                        </span>
                        <span className="text-sm text-cream truncate">{p.name}</span>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-bold text-gold">{p.qty}</span>
                        <span className="text-xs text-cream/40"> وحدة</span>
                      </div>
                    </div>
                    <MiniBar value={p.qty} max={maxQty} gold />
                    <p className="text-xs text-cream/40 text-right">{fmt(p.revenue)} إجمالي</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Orders by day of week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-light rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-gold" />
              <h2 className="font-display text-xl font-bold text-cream">الطلبات حسب اليوم</h2>
            </div>

            <div className="space-y-4">
              {weekdays.map((day, i) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="space-y-1.5"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/70">{day}</span>
                    <span className={`font-bold ${dowCount[i] === maxDow && maxDow > 0 ? "text-gold" : "text-cream/50"}`}>
                      {dowCount[i]}
                    </span>
                  </div>
                  <MiniBar value={dowCount[i]} max={maxDow} gold={dowCount[i] === maxDow && maxDow > 0} />
                </motion.div>
              ))}
            </div>

            {totalOrders > 0 && (
              <div className="mt-6 pt-4 border-t border-gold/10 flex justify-between text-xs text-cream/40">
                <span>أكثر يوم: <span className="text-gold">{busiestDay}</span></span>
                <span>إجمالي: {totalOrders} طلب</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="glass-light rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gold" />
            <h2 className="font-display text-xl font-bold text-cream">آخر الطلبات</h2>
            <span className="mr-auto text-xs text-cream/40">{Math.min(filteredOrders.length, 20)} من {filteredOrders.length}</span>
          </div>

          {filteredOrders.length === 0 ? (
            <p className="text-cream/40 text-center py-12">لا يوجد طلبات في هذه الفترة</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-cream/40 text-xs uppercase tracking-wider border-b border-gold/10">
                    <th className="text-right pb-3 font-normal">الاسم</th>
                    <th className="text-right pb-3 font-normal hidden sm:table-cell">الهاتف</th>
                    <th className="text-right pb-3 font-normal hidden md:table-cell">النوع</th>
                    <th className="text-right pb-3 font-normal">الإجمالي</th>
                    <th className="text-right pb-3 font-normal hidden sm:table-cell">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {[...filteredOrders]
                    .sort((a, b) => b.created_at.localeCompare(a.created_at))
                    .slice(0, 20)
                    .map((order, i) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.025 }}
                        className="text-cream/80 hover:text-cream transition-colors"
                      >
                        <td className="py-3">{order.customer_name || "—"}</td>
                        <td className="py-3 hidden sm:table-cell text-cream/60">{order.customer_phone || "—"}</td>
                        <td className="py-3 hidden md:table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.order_type === "delivery"
                              ? "bg-blue-500/15 text-blue-300"
                              : "bg-emerald-500/15 text-emerald-300"
                          }`}>
                            {order.order_type === "delivery" ? "توصيل" : "استلام"}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-gold">{fmt(Number(order.total))}</td>
                        <td className="py-3 text-cream/40 hidden sm:table-cell">{fmtDate(order.created_at)}</td>
                      </motion.tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );

}