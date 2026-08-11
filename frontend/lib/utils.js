import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value) {
  const amount = Number(value || 0);
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })} Toman`;
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getUserDisplayName(user) {
  if (!user) return "Unknown";
  const first = user.firstName ?? user.first_name ?? "";
  const last = user.lastName ?? user.last_name ?? "";
  return `${first} ${last}`.trim() || user.email || "Unknown";
}

export function getInitials(user) {
  if (!user) return "?";
  const first = user.firstName ?? user.first_name ?? "";
  const last = user.lastName ?? user.last_name ?? "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "?";
}

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_META = {
  pending: { label: "Pending", tone: "amber" },
  processing: { label: "Processing", tone: "blue" },
  shipped: { label: "Shipped", tone: "violet" },
  delivered: { label: "Delivered", tone: "emerald" },
  cancelled: { label: "Cancelled", tone: "red" },
};

export const PAYMENT_STATUS_META = {
  pending: { label: "Pending", tone: "amber" },
  success: { label: "Success", tone: "emerald" },
  failed: { label: "Failed", tone: "red" },
};
