"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const EMPTY_FORM = {
  title: "",
  city: "",
  state: "",
  postalCode: "",
  fullAddress: "",
  phone: "",
  isDefault: false,
};

export default function AddressFormModal({ open, onClose, onSaved, address }) {
  const isEdit = Boolean(address);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      address
        ? {
            title: address.title || "",
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            fullAddress: address.fullAddress || "",
            phone: address.phone || "",
            isDefault: Boolean(address.isDefault),
          }
        : EMPTY_FORM
    );
  }, [open, address]);

  const update = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, isDefault: Boolean(form.isDefault) };
      const { data } = isEdit
        ? await api.put(`/addresses/${address.id}`, payload)
        : await api.post("/addresses", payload);
      toast.success(isEdit ? "Address updated" : "Address added");
      onSaved?.(data);
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save the address"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit address" : "Add a new address"}
      description="Used as the delivery destination for your orders."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="address-title"
            label="Title"
            placeholder="Home, Office…"
            value={form.title}
            onChange={update("title")}
            required
          />
          <Input
            id="address-phone"
            label="Phone"
            placeholder="09123456789"
            value={form.phone}
            onChange={update("phone")}
            required
          />
          <Input
            id="address-city"
            label="City"
            placeholder="Tehran"
            value={form.city}
            onChange={update("city")}
            required
          />
          <Input
            id="address-state"
            label="State / Province"
            placeholder="Tehran"
            value={form.state}
            onChange={update("state")}
            required
          />
        </div>
        <Input
          id="address-postal"
          label="Postal code"
          placeholder="10 digits"
          value={form.postalCode}
          onChange={update("postalCode")}
          hint="Exactly 10 digits"
          required
        />
        <Textarea
          id="address-full"
          label="Full address"
          placeholder="Street, number, unit…"
          value={form.fullAddress}
          onChange={update("fullAddress")}
          rows={3}
          required
        />
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-600">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isDefault: event.target.checked }))
            }
            className="h-4 w-4 rounded border-stone-300 accent-stone-900"
          />
          Set as my default address
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Save changes" : "Add address"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
