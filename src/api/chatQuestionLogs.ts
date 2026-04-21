import apiClient from "@api/client";

export type ChatQuestionLog = {
  id: number;
  thread_id?: number | null;
  message_id?: number | null;
  user_id?: number | null;
  raw_question: string;
  normalized_question?: string | null;
  intent?: string | null;
  sub_intent?: string | null;
  answered_by?: string | null;
  faq_id?: number | null;
  is_answered_successfully: boolean;
  needs_improvement: boolean;
  feedback_score?: number | null;
  created_at: string;
};

export const fetchChatQuestionLogs = async () => {
  const res = await apiClient.get("/admin/chat-question-logs");
  return res.data;
};