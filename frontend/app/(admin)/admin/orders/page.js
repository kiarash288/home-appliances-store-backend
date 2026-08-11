"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import { Table, TableSkeleton } from "@/components/admin/Table";
import ProductImage from "@/components/shop/ProductImage";
import Badge from "@/components/ui/Badge";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import {
  cn,
  formatDate,
  formatPrice,
  getUserDisplayName,
  ORDER_STATUSES,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
} from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [viewing, setViewing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get("/orders/admin", { params });
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load orders"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    if (!viewing) {
      setDetail(null);
      return;
    }
    setDetailLoading(true);
    api
      .get(`/orders/admin/${viewing.id}`)
      .then(({ data }) => setDetail(data))
      .catch((error) =>
        toast.error(getErrorMessage(error, "Could not load order details"))
      )
      .finally(() => setDetailLoading(false));
  }, [viewing]);

  const handleStatusChange = async (order, nextStatus) => {
    setUpdatingId(order.id);
    try {
      await api.put(`/orders/admin/${order.id}/status`, {
        status: nextStatus.toUpperCase(),
      });
      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id ? { ...item, status: nextStatus } : item
        )
      );
      toast.success(`Order #${order.id} marked as ${nextStatus}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update the status"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.delete(`/orders/admin/${deleting.id}`);
      toast.success(`Order #${deleting.id} deleted`);
      setDeleting(null);
      fetchOrders();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete the order"));
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${orders.length} orders${
          statusFilter ? ` · ${statusFilter}` : ""
        }`}
      />

      {/* Status filter */}
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        <FilterPill
          active={!statusFilter}
          label="All"
          onClick={() => setStatusFilter("")}
        />
        {ORDER_STATUSES.map((status) => (
          <FilterPill
            key={status}
            active={statusFilter === status}
            label={ORDER_STATUS_META[status].label}
            onClick={() => setStatusFilter(status)}
          />
        ))}
      </div>

      {loading ? (
        <TableSkeleton columns={6} rows={6} />
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center text-sm text-stone-400">
          No orders match this filter.
        </div>
      ) : (
        <Table
          columns={["Order", "Customer", "Date", "Total", "Status", ""]}
        >
          {orders.map((order) => (
            <tr
              key={order.id}
              className="transition-colors hover:bg-stone-50/60"
            >
              <td className="px-5 py-3.5">
                <p className="font-medium">#{order.id}</p>
                <p className="mt-0.5 max-w-44 truncate font-mono text-[11px] text-stone-400">
                  {order.tracking_code}
                </p>
              </td>
              <td className="px-5 py-3.5">
                <p>{getUserDisplayName(order.user)}</p>
                <p className="mt-0.5 text-xs text-stone-400">
                  {order.user?.email}
                </p>
              </td>
              <td className="px-5 py-3.5 text-stone-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-5 py-3.5 font-medium tabular-nums">
                {formatPrice(order.total_amount)}
              </td>
              <td className="px-5 py-3.5">
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(event) =>
                    handleStatusChange(order, event.target.value)
                  }
                  className={cn(
                    "h-8 rounded-full border border-stone-200 bg-white px-2.5 text-xs font-medium capitalize focus:border-stone-900 focus:outline-none",
                    updatingId === order.id && "opacity-50"
                  )}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {ORDER_STATUS_META[status].label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setViewing(order)}
                    aria-label="View order"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => setDeleting(order)}
                    aria-label="Delete order"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Order detail modal */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing ? `Order #${viewing.id}` : ""}
        description={viewing?.tracking_code}
        maxWidth="max-w-2xl"
      >
        {detailLoading || !detail ? (
          <div className="space-y-3">
            <div className="skeleton h-20 rounded-2xl" />
            <div className="skeleton h-32 rounded-2xl" />
          </div>
        ) : (
          <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
            {/* Status + customer */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {getUserDisplayName(detail.user)}
                </p>
                <p className="text-xs text-stone-400">
                  {detail.user?.email} · {detail.user?.phone || "no phone"}
                </p>
              </div>
              <Badge tone={ORDER_STATUS_META[detail.status]?.tone}>
                {ORDER_STATUS_META[detail.status]?.label || detail.status}
              </Badge>
            </div>

            {/* Items */}
            <div className="overflow-hidden rounded-2xl border border-stone-100">
              {(detail.orderItems || []).map((line) => (
                <div
                  key={line.id}
                  className="flex items-center gap-3 border-b border-stone-100 p-3 last:border-0"
                >
                  <div className="h-11 w-10 shrink-0 overflow-hidden rounded-lg">
                    <ProductImage product={line.item} letterSize={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{line.item?.name}</p>
                    <p className="text-xs text-stone-400">
                      {line.quantity} × {formatPrice(line.unit_price)}
                    </p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">
                    {formatPrice(
                      Number(line.unit_price) * Number(line.quantity)
                    )}
                  </p>
                </div>
              ))}
              <div className="flex justify-between bg-stone-50 p-3 text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatPrice(detail.total_amount)}
                </span>
              </div>
            </div>

            {/* Address */}
            {detail.address && (
              <div className="rounded-2xl bg-stone-50 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Delivery address
                </p>
                <p className="mt-1.5 font-medium">{detail.address.title}</p>
                <p className="text-stone-600">{detail.address.fullAddress}</p>
                <p className="text-stone-400">
                  {detail.address.city}, {detail.address.state} ·{" "}
                  {detail.address.postalCode} · {detail.address.phone}
                </p>
              </div>
            )}

            {/* Payments */}
            {detail.payments?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                  Payments
                </p>
                <div className="space-y-2">
                  {detail.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-xl border border-stone-100 px-3.5 py-2.5 text-sm"
                    >
                      <div>
                        <span className="font-medium capitalize">
                          {payment.gateway_name}
                        </span>
                        <span className="ml-2 text-xs text-stone-400">
                          {formatDate(payment.createdAt)}
                          {payment.ref_id && ` · Ref ${payment.ref_id}`}
                        </span>
                      </div>
                      <Badge tone={PAYMENT_STATUS_META[payment.status]?.tone}>
                        {PAYMENT_STATUS_META[payment.status]?.label ||
                          payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteBusy}
        title={`Delete order #${deleting?.id}?`}
        description="The order and its line items will be permanently removed."
      />
    </div>
  );
}

function FilterPill({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition",
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
      )}
    >
      {label}
    </button>
  );
}
