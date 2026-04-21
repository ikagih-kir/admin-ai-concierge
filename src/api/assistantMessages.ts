import apiClient from "@api/client";

export type AssistantMessagePayload = {
  target_date: string; // YYYY-MM-DD
  title: string;
  message: string;

  message_type?: string;
  priority?: number;
  sort_order?: number;

  is_featured?: boolean;
  is_public?: boolean;

  action_type?: string;
  action_label?: string;
  action_path?: string;

  target_segment?: string;
  related_content_type?: string;
  related_content_id?: number;

  note?: string;
};

export const fetchAssistantMessages = async () => {
  const res = await apiClient.get("/admin/assistant-messages");
  return res.data;
};

export const fetchAssistantMessage = async (id: number) => {
  const res = await apiClient.get(`/admin/assistant-messages/${id}`);
  return res.data;
};

export const createAssistantMessage = async (
  data: AssistantMessagePayload
) => {
  const res = await apiClient.post("/admin/assistant-messages", data);
  return res.data;
};

export const updateAssistantMessage = async (
  id: number,
  data: Partial<AssistantMessagePayload>
) => {
  const res = await apiClient.put(`/admin/assistant-messages/${id}`, data);
  return res.data;
};

export const deleteAssistantMessage = async (id: number) => {
  const res = await apiClient.delete(`/admin/assistant-messages/${id}`);
  return res.data;
};

export const toggleAssistantMessagePublic = async (
  id: number,
  is_public: boolean
) => {
  const res = await apiClient.post(
    `/admin/assistant-messages/${id}/toggle_public`,
    { is_public }
  );
  return res.data;
};