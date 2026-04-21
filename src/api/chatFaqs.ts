import apiClient from "@api/client";

export type ChatFaqPayload = {
  question_pattern: string;
  normalized_question: string;
  intent: string;
  sub_intent?: string;
  answer_title?: string;
  answer_text: string;
  suggested_actions_json?: string;
  keywords_json?: string;
  priority?: number;
  is_active?: boolean;
};

export const fetchChatFaqs = async () => {
  const res = await apiClient.get("/admin/chat-faqs");
  return res.data;
};

export const fetchChatFaq = async (id: number) => {
  const res = await apiClient.get(`/admin/chat-faqs/${id}`);
  return res.data;
};

export const createChatFaq = async (data: ChatFaqPayload) => {
  const res = await apiClient.post("/admin/chat-faqs", data);
  return res.data;
};

export const updateChatFaq = async (
  id: number,
  data: Partial<ChatFaqPayload>
) => {
  const res = await apiClient.put(`/admin/chat-faqs/${id}`, data);
  return res.data;
};

export const deleteChatFaq = async (id: number) => {
  const res = await apiClient.delete(`/admin/chat-faqs/${id}`);
  return res.data;
};