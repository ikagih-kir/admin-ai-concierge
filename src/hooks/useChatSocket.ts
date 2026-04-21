import { useEffect } from "react";
import { ChatLog } from "@/types/chat";

export const useChatSocket = (
  userId?: number,
  onMessage?: (msg: ChatLog) => void
) => {
  useEffect(() => {
    if (!userId || !onMessage) return;

    // socket 接続処理
  }, [userId]);
};
