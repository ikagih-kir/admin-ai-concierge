import apiClient from "@api/client";

export type SitePayload = {
  name: string;
  slug: string;
  catch_copy?: string;
  description?: string;
  body?: string;
  logo_url?: string;
  thumbnail_url?: string;
  banner_url?: string;
  external_url: string;
  affiliate_url?: string;
  rating?: number;
  review_count?: number;
  sort_order?: number;
  is_featured?: boolean;
  is_recommended?: boolean;
  is_public?: boolean;

  // 診断用
  style_type?: string;
  free_level?: string;
  prediction_type?: string;

  // ランキング用
  hit_amount?: number;
  hit_rate?: number;
  recovery_rate?: number;

  published_at?: string | null;
};

export const fetchSites = async () => {
  const res = await apiClient.get("/admin/sites");
  return res.data;
};

export const fetchSite = async (id: number) => {
  const res = await apiClient.get(`/admin/sites/${id}`);
  return res.data;
};

export const createSite = async (data: SitePayload) => {
  const res = await apiClient.post("/admin/sites", data);
  return res.data;
};

export const updateSite = async (id: number, data: Partial<SitePayload>) => {
  const res = await apiClient.put(`/admin/sites/${id}`, data);
  return res.data;
};

export const deleteSite = async (id: number) => {
  const res = await apiClient.delete(`/admin/sites/${id}`);
  return res.data;
};

export const toggleSitePublic = async (id: number, is_public: boolean) => {
  const res = await apiClient.post(`/admin/sites/${id}/toggle_public`, {
    is_public,
  });
  return res.data;
};