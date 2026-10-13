export type ApiBrand = {
  id: number;
  name: string;
  logoUrl: string | null;
  description: string | null;
};

export type BrandRequest = Omit<ApiBrand, "id">;
