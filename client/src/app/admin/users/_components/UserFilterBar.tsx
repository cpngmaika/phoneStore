"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface UserFilterBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function UserFilterBar({
  keyword,
  setKeyword,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onSearch,
  onReset,
}: UserFilterBarProps) {
  return (
    <form
      onSubmit={onSearch}
      className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-soft"
    >
      <div className="min-w-[220px] flex-1">
        <Input
          placeholder="Tìm theo tên hoặc email..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none transition focus:border-primary"
      >
        <option value="">Tất cả vai trò</option>
        <option value="CUSTOMER">Khách hàng (CUSTOMER)</option>
        <option value="STAFF">Nhân viên (STAFF)</option>
        <option value="ADMIN">Quản trị viên (ADMIN)</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none transition focus:border-primary"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="ACTIVE">Hoạt động (ACTIVE)</option>
        <option value="LOCKED">Bị khóa (LOCKED)</option>
        <option value="INACTIVE">Chưa kích hoạt (INACTIVE)</option>
      </select>

      <Button type="submit">Tìm kiếm</Button>
      <Button variant="secondary" type="button" onClick={onReset}>
        Làm mới
      </Button>
    </form>
  );
}
