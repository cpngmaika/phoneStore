import type { ApiUser } from "@/types/user.types";

type AdminUsersTableProps = {
  users: ApiUser[];
  loading: boolean;
  onToggleStatus: (user: ApiUser) => void;
};

export function AdminUsersTable({
  users,
  loading,
  onToggleStatus,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase text-text-muted">
          <tr>
            <th className="px-6 py-3.5">Họ và tên</th>
            <th className="px-6 py-3.5">Email / SĐT</th>
            <th className="w-32 px-6 py-3.5 text-center">Vai trò</th>
            <th className="w-36 px-6 py-3.5 text-center">Trạng thái</th>
            <th className="w-36 px-6 py-3.5 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-muted">
                Đang tải danh sách người dùng...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-muted">
                Không tìm thấy người dùng nào phù hợp với bộ lọc.
              </td>
            </tr>
          ) : (
            users.map((item) => (
              <tr key={item.id} className="transition hover:bg-surface-muted/40">
                <td className="px-6 py-4 font-medium text-text">{item.fullName}</td>
                <td className="max-w-xs truncate px-6 py-4 text-text-muted">
                  <div>{item.email}</div>
                  {item.phone ? <div className="text-xs text-text-muted/80">{item.phone}</div> : null}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {item.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {item.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(item)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      item.status === "LOCKED"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {item.status === "LOCKED" ? "Mở khóa" : "Khóa tài khoản"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
