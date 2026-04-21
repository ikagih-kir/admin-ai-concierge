// src/types/chat.ts
export type ChatLog = {
  id: number;
  sender: "user" | "admin";
  message: string;
  created_at: string;
  user_id?: number;
  is_unreplied?: boolean;
};
