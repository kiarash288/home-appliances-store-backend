"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Badge from "@/components/ui/Badge";
import { cn, formatPrice } from "@/lib/utils";

const PAID_STATUSES = ["processing", "shipped", "delivered"];

const RANGES = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

/** Builds the empty time buckets for a given range (oldest first). */
function buildBuckets(range) {
  const now = new Date();
  const buckets = [];

  if (range === "daily") {
    // Last 7 days, one bucket per day
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        }),
      });
    }
  } else if (range === "weekly") {
    // Last 8 weeks, one bucket per 7-day window ending today
    for (let i = 7; i >= 0; i--) {
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7 + 1);
      const start = new Date(end);
      start.setDate(end.getDate() - 7);
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }
  } else if (range === "monthly") {
    // Last 12 calendar months
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      buckets.push({
        start,
        end,
        label: start.toLocaleDateString("en-US", { month: "short" }),
      });
    }
  } else {
    // Last 5 calendar years
    for (let i = 4; i >= 0; i--) {
      const start = new Date(now.getFullYear() - i, 0, 1);
      const end = new Date(now.getFullYear() - i + 1, 0, 1);
      buckets.push({ start, end, label: String(start.getFullYear()) });
    }
  }

  return buckets;
}

/** Deterministic demo series so the chart still looks alive with no sales. */
function sampleData(buckets) {
  return buckets.map((bucket, index) => ({
    label: bucket.label,
    revenue: 850 + Math.round(Math.abs(Math.sin(index * 1.7 + 1)) * 4200),
    orders: 3 + ((index * 7) % 9),
  }));
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 shadow-lg">
      <p className="text-xs font-medium text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">
        {formatPrice(point.revenue)}
      </p>
      <p className="text-xs text-stone-500">
        {point.orders} paid {point.orders === 1 ? "order" : "orders"}
      </p>
    </div>
  );
}

export default function SalesChart({ orders = [], loading = false }) {
  const [range, setRange] = useState("monthly");

  const { data, isSample } = useMemo(() => {
    const buckets = buildBuckets(range);
    const paidOrders = orders.filter((order) =>
      PAID_STATUSES.includes(order.status)
    );

    const aggregated = buckets.map((bucket) => {
      const inBucket = paidOrders.filter((order) => {
        const created = new Date(order.createdAt);
        return created >= bucket.start && created < bucket.end;
      });
      return {
        label: bucket.label,
        revenue: inBucket.reduce(
          (sum, order) => sum + Number(order.total_amount || 0),
          0
        ),
        orders: inBucket.length,
      };
    });

    const hasSales = aggregated.some((point) => point.revenue > 0);
    if (!hasSales) {
      return { data: sampleData(buckets), isSample: true };
    }
    return { data: aggregated, isSample: false };
  }, [orders, range]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <TrendingUp size={17} />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight">Sales statistics</h2>
            <p className="text-xs text-stone-400">
              Revenue from paid &amp; fulfilled orders
            </p>
          </div>
          {isSample && !loading && (
            <Badge tone="amber" className="ml-1">
              Sample data
            </Badge>
          )}
        </div>

        {/* Time-range filter */}
        <div className="flex rounded-full border border-stone-200 bg-stone-50 p-1">
          {RANGES.map((option) => (
            <button
              key={option.id}
              onClick={() => setRange(option.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                range === option.id
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="skeleton h-72 w-full rounded-xl" />
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e7e5e4"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#a8a29e" }}
                dy={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={54}
                tick={{ fontSize: 11, fill: "#a8a29e" }}
                tickFormatter={(value) =>
                  value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`
                }
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#d6d3d1" }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#059669"
                strokeWidth={2.5}
                fill="url(#salesGradient)"
                animationDuration={600}
                dot={false}
                activeDot={{ r: 4, fill: "#059669", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.section>
  );
}
