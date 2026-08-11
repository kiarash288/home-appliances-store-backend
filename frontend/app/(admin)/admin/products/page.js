"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import { useDebouncedValue } from "@/lib/hooks";
import PageHeader from "@/components/admin/PageHeader";
import { Table, TableSkeleton } from "@/components/admin/Table";
import ProductImage from "@/components/shop/ProductImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal, { ConfirmModal } from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { formatDate, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
};

export default function AdminProductsPage() {
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_SIZE };
      if (debouncedSearch) params.name = debouncedSearch;
      const { data: result } = await api.get("/items", { params });
      setData(result);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load products"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data: list }) => setCategories(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      categoryId: String(product.category_id ?? product.category?.id ?? ""),
    });
    setModalOpen(true);
  };

  const update = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
      };
      if (editing) {
        await api.put(`/items/${editing.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/items", payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save the product"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.delete(`/items/${deleting.id}`);
      toast.success("Product deleted");
      setDeleting(null);
      fetchProducts();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete the product"));
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${data.totalItems} items in the catalog`}
      >
        <Button onClick={openCreate}>
          <Plus size={15} /> Add product
        </Button>
      </PageHeader>

      <div className="mb-5 max-w-sm">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name…"
            className="h-10 w-full rounded-full border border-stone-200 bg-white pl-9 pr-4 text-sm placeholder:text-stone-400 focus:border-stone-900 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <TableSkeleton columns={6} rows={6} />
      ) : data.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-10 text-center text-sm text-stone-400">
          No products found. Create your first product to get started.
        </div>
      ) : (
        <Table
          columns={["Product", "Category", "Price", "Stock", "Created", ""]}
        >
          {data.items.map((product) => (
            <tr
              key={product.id}
              className="transition-colors hover:bg-stone-50/60"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                    <ProductImage product={product} letterSize={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="max-w-56 truncate font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-stone-400">#{product.id}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 text-stone-500">
                {product.category?.name || "—"}
              </td>
              <td className="px-5 py-3.5 font-medium tabular-nums">
                {formatPrice(product.price)}
              </td>
              <td className="px-5 py-3.5">
                {Number(product.stock) <= 0 ? (
                  <Badge tone="red">Out of stock</Badge>
                ) : Number(product.stock) <= 5 ? (
                  <Badge tone="amber">{product.stock} left</Badge>
                ) : (
                  <span className="tabular-nums text-stone-600">
                    {product.stock}
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5 text-stone-500">
                {formatDate(product.createdAt)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => openEdit(product)}
                    aria-label="Edit product"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleting(product)}
                    aria-label="Delete product"
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

      <div className="mt-6">
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={setPage}
        />
      </div>

      {/* Create / edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit "${editing.name}"` : "Add a new product"}
        description={
          editing
            ? "Update the product details below."
            : "Fill in the details to publish a new product."
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            id="product-name"
            label="Name"
            placeholder="Wireless Headphones"
            value={form.name}
            onChange={update("name")}
            required
          />
          <Select
            id="product-category"
            label="Category"
            value={form.categoryId}
            onChange={update("categoryId")}
            required
          >
            <option value="" disabled>
              Select a category…
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="product-price"
              label="Price (Toman)"
              type="number"
              min="1"
              placeholder="1299000"
              value={form.price}
              onChange={update("price")}
              required
            />
            <Input
              id="product-stock"
              label="Stock"
              type="number"
              min="0"
              placeholder="25"
              value={form.stock}
              onChange={update("stock")}
              required
            />
          </div>
          <Textarea
            id="product-description"
            label="Description"
            placeholder="Describe the product…"
            hint="At least 10 characters"
            value={form.description}
            onChange={update("description")}
            rows={4}
            required
          />
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? "Save changes" : "Create product"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteBusy}
        title="Delete this product?"
        description={`"${deleting?.name}" will be permanently removed from the catalog.`}
      />
    </div>
  );
}
