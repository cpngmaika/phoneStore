"use client";

import type { AdminUser } from "@/types/user.types";

interface UserTableProps {
  users: AdminUser[];
  loading: boolean;
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}

export function UserTable({
  users,
  loading,
  onEdit,
  onToggleStatus,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-soft">
      <table className="w-full text-left text-sm text-text">
        <thead className="border-b border-border bg-surface-muted text-xs uppercase font-semibold text-text-muted">
          <tr>
            <th className="px-5 py-4">ID</th>
            <th className="px-5 py-4">Họ và tên</th>
            <th className="px-5 py-4">Email</th>
            <th className="px-5 py-4">Số điện thoại</th>
            <th className="px-5 py-4">Vai trò</th>
            <th className="px-5 py-4">Trạng thái</th>
            <th className="px-5 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-text-muted">
                Đang tải danh sách người dùng...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-text-muted">
                Không tìm thấy người dùng nào phù hợp.
              </td>
            </tr>
          ) : (
            users.map((item) => (
              <tr key={item.id} className="transition hover:bg-surface-muted/50">
                <td className="px-5 py-4 font-mono text-xs text-text-muted">
                  #{item.id}
                </td>
                <td className="px-5 py-4 font-medium">{item.fullName}</td>
                <td className="px-5 py-4 text-text-muted">{item.email}</td>
                <td className="px-5 py-4 text-text-muted">
                  {item.phone || "—"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : item.status === "LOCKED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text transition hover:border-border-strong hover:bg-surface-muted"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onToggleStatus(item)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        item.status === "ACTIVE"
                          ? "border border-red-200 text-red-600 hover:bg-red-50"
                          : "border border-green-200 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      {item.status === "ACTIVE" ? "Khóa" : "Mở khóa"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
