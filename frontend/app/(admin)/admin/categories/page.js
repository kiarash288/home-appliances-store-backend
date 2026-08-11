"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import PageHeader from "@/components/admin/PageHeader";
import { Table, TableSkeleton } from "@/components/admin/Table";
import Button from "@/components/ui/Button";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";

const EMPTY_FORM = { name: "", description: "", parentId: "" };

function getParentId(category) {
  return category.parentId ?? category.parent_id ?? null;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load categories"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
      parentId: getParentId(category) ? String(getParentId(category)) : "",
    });
    setModalOpen(true);
  };

  const update = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name };
      if (form.description.trim()) payload.description = form.description.trim();
      if (form.parentId) {
        payload.parentId = Number(form.parentId);
      } else if (editing && getParentId(editing)) {
        payload.parentId = null;
      }

      if (editing) {
        await api.put(`/categories/${editing.id}`, payload);
        toast.success("Category updated");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save the category"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.delete(`/categories/${deleting.id}`);
      toast.success("Category deleted");
      setDeleting(null);
      fetchCategories();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete the category"));
    } finally {
      setDeleteBusy(false);
    }
  };

  const parentName = (category) => {
    const parentId = getParentId(category);
    if (!parentId) return "—";
    return (
      categories.find((item) => Number(item.id) === Number(parentId))?.name ||
      `#${parentId}`
    );
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description={`${categories.length} categories`}
      >
        <Button onClick={openCreate}>
          <Plus size={15} /> Add category
        </Button>
      </PageHeader>

      {loading ? (
        <TableSkeleton columns={5} rows={5} />
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center text-sm text-stone-400">
          No categories yet. Products need at least one category.
        </div>
      ) : (
        <Table columns={["Name", "Description", "Parent", "Created", ""]}>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="transition-colors hover:bg-stone-50/60"
            >
              <td className="px-5 py-3.5">
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-stone-400">#{category.id}</p>
              </td>
              <td className="max-w-64 px-5 py-3.5">
                <p className="truncate text-stone-500">
                  {category.description || "—"}
                </p>
              </td>
              <td className="px-5 py-3.5 text-stone-500">
                {parentName(category)}
              </td>
              <td className="px-5 py-3.5 text-stone-500">
                {formatDate(category.createdAt)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => openEdit(category)}
                    aria-label="Edit category"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleting(category)}
                    aria-label="Delete category"
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit "${editing.name}"` : "Add a new category"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            id="category-name"
            label="Name"
            placeholder="Electronics"
            value={form.name}
            onChange={update("name")}
            required
          />
          <Textarea
            id="category-description"
            label="Description (optional)"
            placeholder="What belongs in this category?"
            value={form.description}
            onChange={update("description")}
            rows={3}
          />
          <Select
            id="category-parent"
            label="Parent category (optional)"
            value={form.parentId}
            onChange={update("parentId")}
          >
            <option value="">No parent — top level</option>
            {categories
              .filter(
                (item) => !editing || Number(item.id) !== Number(editing.id)
              )
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </Select>
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create category"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteBusy}
        title="Delete this category?"
        description={`"${deleting?.name}" will be removed. Products in it will become uncategorized.`}
      />
    </div>
  );
}
