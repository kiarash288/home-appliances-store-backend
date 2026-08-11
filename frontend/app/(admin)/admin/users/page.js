"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import PageHeader from "@/components/admin/PageHeader";
import { Table, TableSkeleton } from "@/components/admin/Table";
import Badge from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/Modal";
import {
  cn,
  formatDate,
  getInitials,
  getUserDisplayName,
} from "@/lib/utils";

export default function AdminUsersPage() {
  const currentUser = useAuthStore((state) => state.user);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load users"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (user, role) => {
    setUpdatingId(user.id);
    try {
      await api.put(`/users/${user.id}/role`, { role });
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, role } : item))
      );
      toast.success(`${getUserDisplayName(user)} is now ${role}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not change the role"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await api.delete(`/users/${deleting.id}`);
      toast.success("User deleted");
      setDeleting(null);
      fetchUsers();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete the user"));
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description={`${users.length} registered accounts`}
      />

      {loading ? (
        <TableSkeleton columns={6} rows={6} />
      ) : (
        <Table
          columns={["User", "Contact", "Verified", "Joined", "Role", ""]}
        >
          {users.map((user) => {
            const isSelf = Number(user.id) === Number(currentUser?.id);
            return (
              <tr
                key={user.id}
                className="transition-colors hover:bg-stone-50/60"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                        user.role === "admin" ? "bg-emerald-600" : "bg-stone-900"
                      )}
                    >
                      {getInitials(user)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {getUserDisplayName(user)}
                        {isSelf && (
                          <span className="ml-1.5 text-xs text-stone-400">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-stone-400">#{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-stone-600">{user.email}</p>
                  <p className="text-xs text-stone-400">
                    {user.phone || "no phone"}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  {user.isVerified ? (
                    <Badge tone="emerald">
                      <BadgeCheck size={12} /> Verified
                    </Badge>
                  ) : (
                    <Badge tone="amber">Pending</Badge>
                  )}
                </td>
                <td className="px-5 py-3.5 text-stone-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={user.role}
                    disabled={isSelf || updatingId === user.id}
                    onChange={(event) =>
                      handleRoleChange(user, event.target.value)
                    }
                    className={cn(
                      "h-8 rounded-full border border-stone-200 bg-white px-2.5 text-xs font-medium capitalize focus:border-stone-900 focus:outline-none",
                      (isSelf || updatingId === user.id) &&
                        "cursor-not-allowed opacity-50"
                    )}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setDeleting(user)}
                      disabled={isSelf}
                      aria-label="Delete user"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      )}

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        loading={deleteBusy}
        title="Delete this user?"
        description={`${getUserDisplayName(
          deleting
        )}'s account and related data will be removed.`}
      />
    </div>
  );
}
