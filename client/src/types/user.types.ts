export type ApiUser = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: "CUSTOMER" | "ADMIN";
  status: "ACTIVE" | "LOCKED" | "INACTIVE";
};

export type UpdateProfileRequest = {
  fullName: string;
  phone?: string;
  avatarUrl?: string;
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type ApiAddress = {
  id: number;
  receiverName: string;
  receiverPhone: string;
  country: string;
  province: string;
  district: string;
  ward: string;
  streetDetail: string;
  isDefault: boolean;
};

export type AddressRequest = Omit<ApiAddress, "id">;

export type AdminUserCreateRequest = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
  role?: ApiUser["role"];
};

export type AdminUserUpdateRequest = {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  role?: ApiUser["role"];
  status?: ApiUser["status"];
};
