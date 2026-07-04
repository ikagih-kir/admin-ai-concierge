import apiClient from "@api/client";

export type HomeBanner = {
  id: number;
  title: string;
  image_url: string;
  link_url?: string | null;
  is_active: boolean;
  start_at?: string | null;
  end_at?: string | null;
  sort_order: number;
  created_at: string;
  updated_at?: string | null;
};

export type HomeBannerPayload = {
  title: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  start_at?: string | null;
  end_at?: string | null;
  sort_order: number;
};

export const fetchHomeBanners = async (): Promise<HomeBanner[]> => {
  const res = await apiClient.get("/admin/home-banners");
  return res.data;
};

export const fetchHomeBanner = async (id: number): Promise<HomeBanner> => {
  const res = await apiClient.get(`/admin/home-banners/${id}`);
  return res.data;
};

export const createHomeBanner = async (data: HomeBannerPayload) => {
  const res = await apiClient.post("/admin/home-banners", data);
  return res.data;
};

export const updateHomeBanner = async (
  id: number,
  data: Partial<HomeBannerPayload>
) => {
  const res = await apiClient.put(`/admin/home-banners/${id}`, data);
  return res.data;
};

export const deleteHomeBanner = async (id: number) => {
  const res = await apiClient.delete(`/admin/home-banners/${id}`);
  return res.data;
};

export const toggleHomeBanner = async (id: number, is_active: boolean) => {
  const res = await apiClient.post(`/admin/home-banners/${id}/toggle`, {
    is_active,
  });
  return res.data;
};