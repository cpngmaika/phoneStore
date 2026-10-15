export type ApiReview = {
  id: number;
  reviewerName: string;
  productId: number;
  rating: number;
  content: string;
  isHidden: boolean;
};

export type ReviewRequest = {
  productId: number;
  rating: number;
  content: string;
};

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
};
