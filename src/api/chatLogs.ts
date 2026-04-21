import apiClient from "@api/client";

export const fetchChatLogs = async (limit = 100) => {
  const res = await apiClient.get("/admin/chat-logs", {
    params: { limit },
  });
  return res.data;
};


export const sendAdminReply = async (
  message: string,
  userId?: number
) => {
  await apiClient.post("/admin/chat/reply", {
    message,
    user_id: userId,
  });
};