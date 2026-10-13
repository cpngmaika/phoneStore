import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type {
  WarrantyPolicy,
  WarrantyPolicyRequest,
} from "@/types/warranty.types";

export function getWarrantyPolicies() {
  return requestData<WarrantyPolicy[]>(apiEndpoints.warrantyPolicies.list);
}

export function getWarrantyPolicyById(id: number | string) {
  return requestData<WarrantyPolicy>(apiEndpoints.warrantyPolicies.byId(id));
}

export function createWarrantyPolicy(payload: WarrantyPolicyRequest) {
  return requestData<WarrantyPolicy>(apiEndpoints.warrantyPolicies.list, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateWarrantyPolicy(
  id: number | string,
  payload: WarrantyPolicyRequest,
) {
  return requestData<WarrantyPolicy>(
    apiEndpoints.warrantyPolicies.byId(id),
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export function deleteWarrantyPolicy(id: number | string) {
  return requestData<null>(apiEndpoints.warrantyPolicies.byId(id), {
    method: "DELETE",
  });
}
