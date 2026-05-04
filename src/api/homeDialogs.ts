import apiClient from "@api/client";

export type HomeDialog = {
  id: number;
  title: string;
  body: string;
  primary_button_text?: string | null;
  primary_button_path?: string | null;
  secondary_button_text?: string | null;
  is_active: boolean;
  show_once_per_day: boolean;
  start_at?: string | null;
  end_at?: string | null;
  sort_order: number;
  created_at: string;
  updated_at?: string | null;
};

export type HomeDialogPayload = {
  title: string;
  body: string;
  primary_button_text?: string;
  primary_button_path?: string;
  secondary_button_text?: string;
  is_active: boolean;
  show_once_per_day: boolean;
  start_at?: string | null;
  end_at?: string | null;
  sort_order: number;
};

export const fetchHomeDialogs = async (): Promise<HomeDialog[]> => {
  const res = await apiClient.get("/admin/home-dialogs");
  return res.data;
};

export const createHomeDialog = async (data: HomeDialogPayload) => {
  const res = await apiClient.post("/admin/home-dialogs", data);
  return res.data;
};

export const updateHomeDialog = async (
  id: number,
  data: Partial<HomeDialogPayload>
) => {
  const res = await apiClient.put(`/admin/home-dialogs/${id}`, data);
  return res.data;
};

export const deleteHomeDialog = async (id: number) => {
  const res = await apiClient.delete(`/admin/home-dialogs/${id}`);
  return res.data;
};

export const toggleHomeDialog = async (id: number, is_active: boolean) => {
  const res = await apiClient.post(`/admin/home-dialogs/${id}/toggle`, {
    is_active,
  });
  return res.data;
};