"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import AddressFormModal from "@/components/shop/AddressFormModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { ConfirmModal } from "@/components/ui/Modal";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(Array.isArray(data) ? data : []);
    } catch (_) {
      // keep previous list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetDefault = async (address) => {
    try {
      await api.put(`/addresses/${address.id}/default`);
      toast.success(`"${address.title}" is now your default address`);
      fetchAddresses();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not set default address"));
    }
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.delete(`/addresses/${deleting.id}`);
      toast.success("Address deleted");
      setDeleting(null);
      fetchAddresses();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete the address"));
    } finally {
      setDeleteBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-48 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-500">
          {addresses.length} of 3 addresses used
        </p>
        <Button
          size="sm"
          disabled={addresses.length >= 3}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={15} /> Add address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses yet"
          description="Add a delivery address to speed through checkout."
        >
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus size={15} /> Add your first address
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-6"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold tracking-tight">
                    {address.title}
                  </p>
                  {address.isDefault && <Badge tone="emerald">Default</Badge>}
                </div>
                <div className="mt-3 space-y-1 text-sm text-stone-600">
                  <p>{address.fullAddress}</p>
                  <p>
                    {address.city}, {address.state} · {address.postalCode}
                  </p>
                  <p className="text-stone-400">{address.phone}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-stone-100 pt-4">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <Star size={13} /> Make default
                  </button>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => {
                    setEditing(address);
                    setModalOpen(true);
                  }}
                  aria-label="Edit address"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleting(address)}
                  aria-label="Delete address"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchAddresses}
        address={editing}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteBusy}
        title="Delete this address?"
        description={`"${deleting?.title}" will be removed permanently.`}
      />
    </div>
  );
}
