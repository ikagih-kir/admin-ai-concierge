// src/ws/chatSocket.ts

let socket: WebSocket | null = null;

export type ChatSocketMessage = {
  id?: number;
  user_id?: number;
  sender: "user" | "admin";
  message: string;
  created_at?: string;
};

export const connectChatSocket = (
  onMessage: (data: ChatSocketMessage) => void
) => {
  socket = new WebSocket("ws://localhost:8000/ws/chat/0");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data) as ChatSocketMessage;
    onMessage(data);
  };

  socket.onerror = (e) => {
    console.error("Chat socket error", e);
  };
};

export const closeChatSocket = () => {
  socket?.close();
  socket = null;
};
