"use client";

import type { AuthUser } from "@/types/auth.types";

interface ProfileHeaderProps {
  user: AuthUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
      <div className="flex items-center gap-4">
        {user.avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="h-16 w-16 rounded-full object-cover shadow-soft border-2 border-primary/20"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-soft">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-text">{user.fullName}</h1>
          <p className="text-sm text-text-muted">{user.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
              Vai trò: {user.role}
            </span>
            <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              {user.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
