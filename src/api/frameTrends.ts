import apiClient from "@api/client";

export type FrameTrendPayload = {
  target_date: string; // YYYY-MM-DD
  title: string;
  race_scope?: string;

  lucky_frame?: number;
  trend_summary?: string;
  trend_note?: string;
  recommended_style?: string;

  sample_size?: number;
  win_frame_data?: string;
  place_frame_data?: string;

  ai_comment?: string;

  is_featured?: boolean;
  sort_order?: number;
  is_public?: boolean;
};

export type FrameTrendInputItem = {
  race_number: number;
  winning_frame: number;
};

export type FrameTrendInputBatchPayload = {
  target_date: string;
  venue: string;
  results: FrameTrendInputItem[];
};

export type FrameTrendInputOut = {
  id: number;
  target_date: string;
  venue: string;
  race_number: number;
  winning_frame: number;
  created_at: string;
  updated_at: string;
};

export const fetchFrameTrends = async () => {
  const res = await apiClient.get("/admin/frame-trends");
  return res.data;
};

export const fetchFrameTrend = async (id: number) => {
  const res = await apiClient.get(`/admin/frame-trends/${id}`);
  return res.data;
};

export const createFrameTrend = async (data: FrameTrendPayload) => {
  const res = await apiClient.post("/admin/frame-trends", data);
  return res.data;
};

export const updateFrameTrend = async (
  id: number,
  data: Partial<FrameTrendPayload>
) => {
  const res = await apiClient.put(`/admin/frame-trends/${id}`, data);
  return res.data;
};

export const deleteFrameTrend = async (id: number) => {
  const res = await apiClient.delete(`/admin/frame-trends/${id}`);
  return res.data;
};

export const toggleFrameTrendPublic = async (
  id: number,
  is_public: boolean
) => {
  const res = await apiClient.post(`/admin/frame-trends/${id}/toggle_public`, {
    is_public,
  });
  return res.data;
};

export const fetchFrameTrendInputs = async (params?: {
  target_date?: string;
  venue?: string;
}) => {
  const res = await apiClient.get("/admin/frame-trends/inputs/list", {
    params,
  });
  return res.data as FrameTrendInputOut[];
};

export const createFrameTrendInputsBatch = async (
  data: FrameTrendInputBatchPayload
) => {
  const res = await apiClient.post("/admin/frame-trends/inputs/batch", data);
  return res.data as FrameTrendInputOut[];
};