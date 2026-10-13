export type WarrantyPolicy = {
  id: number;
  name: string;
  durationMonths: number;
  coverage: string;
  exclusions: string;
  contactInfo: string;
};

export type WarrantyPolicyRequest = Omit<WarrantyPolicy, "id">;
