"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/auth.context";
import { ProfileHeader } from "./_components/ProfileHeader";
import { ProfileInfoTab } from "./_components/ProfileInfoTab";
import { ChangePasswordTab } from "./_components/ChangePasswordTab";
import { AddressListTab } from "./_components/AddressListTab";

type ActiveTab = "info" | "password" | "addresses";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  // Initialize activeTab from window URL query (?tab=addresses) to persist across F5
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as ActiveTab | null;
      if (tab === "password" || tab === "addresses" || tab === "info") {
        return tab;
      }
    }
    return "info";
  });

  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-text-muted">Đang tải thông tin tài khoản...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Header Profile */}
      <ProfileHeader user={user} />

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-border pb-4 mb-8">
        <button
          onClick={() => switchTab("info")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "info"
              ? "bg-primary text-white"
              : "bg-surface-muted text-text hover:bg-border/50"
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => switchTab("password")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "password"
              ? "bg-primary text-white"
              : "bg-surface-muted text-text hover:bg-border/50"
          }`}
        >
          Đổi mật khẩu
        </button>
        <button
          onClick={() => switchTab("addresses")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "addresses"
              ? "bg-primary text-white"
              : "bg-surface-muted text-text hover:bg-border/50"
          }`}
        >
          Sổ địa chỉ
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "info" && (
        <ProfileInfoTab
          key={`${user.id}-${user.avatarUrl || ""}`}
          user={user}
          refreshUser={refreshUser}
        />
      )}

      {activeTab === "password" && <ChangePasswordTab />}

      {activeTab === "addresses" && <AddressListTab />}
    </div>
  );
}
