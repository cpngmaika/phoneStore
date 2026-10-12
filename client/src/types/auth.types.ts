export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF";
export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}
