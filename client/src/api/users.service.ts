import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type {
  AddressRequest,
  ApiAddress,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "@/types/user.types";
import type { ApiUser } from "@/types/user.types";

export function getProfile() {
  return requestData<ApiUser>(apiEndpoints.users.profile);
}

export function updateProfile(payload: UpdateProfileRequest) {
  return requestData<ApiUser>(apiEndpoints.users.profile, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function changePassword(payload: ChangePasswordRequest) {
  return requestData<null>(apiEndpoints.users.changePassword, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAddresses() {
  return requestData<ApiAddress[]>(apiEndpoints.users.addresses);
}

export function addAddress(payload: AddressRequest) {
  return requestData<ApiAddress>(apiEndpoints.users.addresses, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteAddress(id: number | string) {
  return requestData<null>(apiEndpoints.users.address(id), {
    method: "DELETE",
  });
}
