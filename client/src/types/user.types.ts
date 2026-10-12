import type { UserRole, UserStatus } from "./auth.types";
export type { UserRole, UserStatus };

export interface Address {
  id: number;
  userId?: number;
  receiverName?: string;
  recipientName?: string;
  receiverPhone?: string;
  phone?: string;
  country?: string;
  province: string;
  district: string;
  ward: string;
  streetDetail?: string;
  streetAddress?: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface AddressRequest {
  receiverName?: string;
  recipientName?: string;
  receiverPhone?: string;
  phone?: string;
  country?: string;
  province: string;
  district: string;
  ward: string;
  streetDetail?: string;
  streetAddress?: string;
  isDefault?: boolean;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface AdminUpdateUserRequest {
  fullName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string;
}
