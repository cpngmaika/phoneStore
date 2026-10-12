import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type { ApiBrand, BrandRequest } from "@/types/brand.types";

export function getBrands() {
  return requestData<ApiBrand[]>(apiEndpoints.brands.list);
}

export function getBrandById(id: number | string) {
  return requestData<ApiBrand>(apiEndpoints.brands.byId(id));
}

export function createBrand(payload: BrandRequest) {
  return requestData<ApiBrand>(apiEndpoints.brands.list, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBrand(id: number | string, payload: BrandRequest) {
  return requestData<ApiBrand>(apiEndpoints.brands.byId(id), {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteBrand(id: number | string) {
  return requestData<null>(apiEndpoints.brands.byId(id), {
    method: "DELETE",
  });
}
