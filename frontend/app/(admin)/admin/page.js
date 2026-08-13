"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Banknote, Package, ShoppingCart, Users } from "lucide-react";
import api from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import SalesChart from "@/components/admin/SalesChart";
import { Table, TableSkeleton } from "@/components/admin/Table";
import Badge from "@/components/ui/Badge";
import {
  formatDate,
  formatPrice,
  getUserDisplayName,
  ORDER_STATUS_META,
} from "@/lib/utils";

const PAID_STATUSES = ["processing", "shipped", "delivered"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      api.get("/items", { params: { limit: 1 } }),
      api.get("/orders/admin"),
      api.get("/users"),
    ]).then(([itemsResult, ordersResult, usersResult]) => {
      if (!active) return;

      const totalProducts =
        itemsResult.status === "fulfilled"
          ? itemsResult.value.data.totalItems
          : 0;

      const orders =
        ordersResult.status === "fulfilled" &&
        Array.isArray(ordersResult.value.data)
          ? ordersResult.value.data
          : [];

      const users =
        usersResult.status === "fulfilled" &&
        Array.isArray(usersResult.value.data)
          ? usersResult.value.data
          : [];

      const revenue = orders
        .filter((order) => PAID_STATUSES.includes(order.status))
        .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

      const pendingCount = orders.filter(
        (order) => order.status === "pending"
      ).length;

      setStats({
        revenue,
        totalOrders: orders.length,
        pendingCount,
        totalProducts,
        totalUsers: users.length,
      });
      setAllOrders(orders);
      setRecentOrders(orders.slice(0, 6));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A quick pulse on your store."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          icon={Banknote}
          tone="emerald"
          label="Revenue"
          value={loading ? "…" : formatPrice(stats.revenue)}
          hint="From paid & fulfilled orders"
        />
        <StatCard
          index={1}
          icon={ShoppingCart}
          tone="blue"
          label="Orders"
          value={loading ? "…" : stats.totalOrders}
          hint={loading ? "" : `${stats.pendingCount} awaiting payment`}
        />
        <StatCard
          index={2}
          icon={Package}
          tone="amber"
          label="Products"
          value={loading ? "…" : stats.totalProducts}
          hint="Active catalog items"
        />
        <StatCard
          index={3}
          icon={Users}
          tone="violet"
          label="Customers"
          value={loading ? "…" : stats.totalUsers}
          hint="Registered accounts"
        />
      </div>

      {/* Sales chart with time-range filter */}
      <div className="mt-8">
        <SalesChart orders={allOrders} loading={loading} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold tracking-tight">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-medium text-stone-500 transition hover:text-stone-900"
          >
            View all <ArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <TableSkeleton columns={5} rows={5} />
        ) : recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center text-sm text-stone-400">
            No orders yet — they will appear here as customers check out.
          </div>
        ) : (
          <Table columns={["Order", "Customer", "Date", "Total", "Status"]}>
            {recentOrders.map((order) => {
              const meta = ORDER_STATUS_META[order.status] || {};
              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-stone-50/60"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">#{order.id}</p>
                    <p className="mt-0.5 max-w-40 truncate font-mono text-[11px] text-stone-400">
                      {order.tracking_code}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p>{getUserDisplayName(order.user)}</p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      {order.user?.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-stone-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4 font-medium tabular-nums">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={meta.tone}>{meta.label || order.status}</Badge>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </div>
    </div>
  );
}
