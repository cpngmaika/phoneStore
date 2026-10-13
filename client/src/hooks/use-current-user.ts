"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/api/auth.service";
import type { ApiUser } from "@/types/user.types";

/**
 * =============================================================================
 * TÊN SỰ KIỆN ĐỒNG BỘ TRẠNG THÁI XÁC THỰC TOÀN CỤC (GLOBAL AUTH EVENT)
 * =============================================================================
 * - Khi người dùng đăng nhập hoặc đăng xuất ở bất kỳ trang nào, sự kiện này
 *   sẽ được phát đi (dispatch) để mọi component (như Header) lập tức cập nhật
 *   lại giao diện mà không cần reload toàn bộ trang web.
 */
export const AUTH_CHANGE_EVENT = "app:auth-change";

/**
 * Hàm tiện ích phát sự kiện thông báo trạng thái đăng nhập thay đổi.
 * Được gọi sau khi đăng nhập thành công (tại LoginPage) hoặc đăng xuất (tại Header).
 */
export function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

/**
 * Custom Hook: useCurrentUser
 * - Vai trò: Quản lý và cung cấp thông tin tài khoản đang đăng nhập trong phiên làm việc.
 * - Đầu vào: refreshKey (tùy chọn, ví dụ pathname) để tái kích hoạt khi chuyển trang.
 * - Đầu ra:
 *   + user: Đối tượng ApiUser nếu đã đăng nhập, null nếu chưa đăng nhập hoặc đã đăng xuất.
 *   + loading: boolean biểu thị trạng thái đang gọi API kiểm tra session.
 *   + error: Thông báo lỗi hệ thống (nếu có sự cố kết nối máy chủ).
 *   + setUser: Hàm cập nhật state trực tiếp từ component gọi (ví dụ reset về null khi logout).
 *   + refetch: Hàm chủ động gọi lại API để làm mới thông tin tài khoản.
 */
export function useCurrentUser(refreshKey = "") {
  // State lưu thông tin tài khoản của phiên hiện tại (mặc định ban đầu là null)
  const [user, setUser] = useState<ApiUser | null>(null);

  // State biểu thị trạng thái đang tải dữ liệu xác thực
  const [loading, setLoading] = useState(true);

  // State lưu lỗi mạng nếu máy chủ không phản hồi
  const [error, setError] = useState<string | null>(null);

  /**
   * Hàm gọi API GET /api/auth/me để lấy dữ liệu người dùng mới nhất
   */
  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch {
      // Khi không có phiên đăng nhập hợp lệ (401), giải phóng dữ liệu về null
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    // 1. Kiểm tra phiên đăng nhập từ Backend khi component được nạp hoặc refreshKey thay đổi
    getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser);
          setError(null);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          // QUAN TRỌNG: Khi gặp lỗi 401 (chưa đăng nhập/đã logout), PHẢI đặt user về null
          // để tránh giữ lại thông tin tài khoản cũ trong bộ nhớ RAM
          setUser(null);

          const message =
            requestError instanceof Error ? requestError.message : "";
          // Chỉ lưu lỗi nếu đây là sự cố máy chủ, không hiển thị lỗi đỏ khi chỉ là trạng thái chưa đăng nhập
          if (!message.includes("401") && !message.includes("Not logged in")) {
            setError(message || "Không thể tải tài khoản.");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // 2. Đăng ký lắng nghe sự kiện đăng nhập / đăng xuất từ các trang khác
    const handleAuthChange = () => {
      void fetchUser();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    // 3. Hủy lắng nghe khi component unmount để tránh rò rỉ bộ nhớ (memory leak)
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, [refreshKey]);

  return { user, loading, error, setUser, refetch: fetchUser };
}
