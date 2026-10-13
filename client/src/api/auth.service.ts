import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { LoginRequest, RegisterRequest } from "@/types/auth.types";
import type { ApiUser } from "@/types/user.types";

export function login(payload: LoginRequest) {
  return requestData<ApiUser>(apiEndpoints.auth.login, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterRequest) {
  return requestData<ApiUser>(apiEndpoints.auth.register, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return requestData<null>(apiEndpoints.auth.logout, { method: "POST" });
}

export function getCurrentUser() {
  return requestData<ApiUser>(apiEndpoints.auth.currentUser);
}
