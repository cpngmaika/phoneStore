import { apiEndpoints } from "@/api/endpoints";
import { requestData } from "@/api/response";
import type {
  ApiReview,
  ReviewRequest,
  ReviewSummary,
} from "@/types/review.types";

export function getReviewsByProduct(productId: number | string) {
  const params = new URLSearchParams({ productId: String(productId) });
  return requestData<ApiReview[]>(`${apiEndpoints.reviews}?${params}`);
}

export function getReviewSummary(productId: number | string) {
  const params = new URLSearchParams({ productId: String(productId) });
  return requestData<ReviewSummary>(
    `${apiEndpoints.reviews}/summary?${params}`,
  );
}

export function createReview(payload: ReviewRequest) {
  return requestData<ApiReview>(apiEndpoints.reviews, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function hideReview(id: number | string) {
  return requestData<null>(`${apiEndpoints.reviews}/hide/${id}`, {
    method: "PUT",
  });
}
