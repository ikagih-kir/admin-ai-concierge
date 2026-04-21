import apiClient from "@api/client";

export type RaceChangeHighlightPayload = {
  target_date: string; // YYYY-MM-DD
  race_name: string;
  race_course?: string;
  horse_name: string;

  previous_surface?: string;
  current_surface?: string;

  previous_distance?: number;
  current_distance?: number;

  previous_jockey?: string;
  current_jockey?: string;

  surface_changed?: boolean;
  distance_changed?: boolean;
  distance_direction?: string;
  gear_changed?: boolean;
  jockey_changed?: boolean;
  class_changed?: boolean;

  change_summary?: string;
  ai_comment?: string;
  note?: string;

  impact_level?: string;
  is_featured?: boolean;
  sort_order?: number;
  is_public?: boolean;
};

export const fetchRaceChangeHighlights = async () => {
  const res = await apiClient.get("/admin/race-change-highlights");
  return res.data;
};

export const fetchRaceChangeHighlight = async (id: number) => {
  const res = await apiClient.get(`/admin/race-change-highlights/${id}`);
  return res.data;
};

export const createRaceChangeHighlight = async (
  data: RaceChangeHighlightPayload
) => {
  const res = await apiClient.post("/admin/race-change-highlights", data);
  return res.data;
};

export const updateRaceChangeHighlight = async (
  id: number,
  data: Partial<RaceChangeHighlightPayload>
) => {
  const res = await apiClient.put(`/admin/race-change-highlights/${id}`, data);
  return res.data;
};

export const deleteRaceChangeHighlight = async (id: number) => {
  const res = await apiClient.delete(`/admin/race-change-highlights/${id}`);
  return res.data;
};

export const toggleRaceChangeHighlightPublic = async (
  id: number,
  is_public: boolean
) => {
  const res = await apiClient.post(
    `/admin/race-change-highlights/${id}/toggle_public`,
    { is_public }
  );
  return res.data;
};