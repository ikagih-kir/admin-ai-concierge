import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import { fetchChatLogs, sendAdminReply } from "../../api/chatLogs";
import { useChatSocket } from "../../hooks/useChatSocket";
import {
  connectChatSocket,
  closeChatSocket,
  ChatSocketMessage,
} from "../../ws/chatSocket";

type ChatLog = {
  id: number;
  sender: "user" | "admin";
  message: string;
  created_at: string;
  user_id?: number;
  is_unreplied?: boolean;
};

/** 🔴 未返信判定（ユーザーごとの最新発言が user なら未返信） */
const markUnreplied = (logs: ChatLog[]) => {
  const latestByUser: Record<number, ChatLog> = {};

  logs.forEach((log) => {
    if (!log.user_id) return;
    const prev = latestByUser[log.user_id];
    if (!prev || new Date(log.created_at) > new Date(prev.created_at)) {
      latestByUser[log.user_id] = log;
    }
  });

  return logs.map((log) => ({
    ...log,
    is_unreplied: Boolean(
      log.user_id &&
        latestByUser[log.user_id] &&
        latestByUser[log.user_id].sender === "user"
    ),
  }));
};

const ChatLogListPage = () => {
  const [items, setItems] = useState<ChatLog[]>([]);
  const [selected, setSelected] = useState<ChatLog | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  /** ✅ 初期 & 再読込 */
  const load = async () => {
    const logs = await fetchChatLogs(100); // ← 配列で返る前提
    setItems(markUnreplied(logs));
  };

  /** ✅ 初回ロード */
  useEffect(() => {
    load();
  }, []);

  /** ✅ WebSocket（一覧即反映） */
  useEffect(() => {
    connectChatSocket((data: ChatSocketMessage) => {
      setItems((prev) =>
        markUnreplied([
          {
            id: Date.now(), // 仮ID（DB保存後に置換される想定）
            sender: data.sender,
            message: data.message,
            created_at: new Date().toISOString(),
            user_id: data.user_id,
          },
          ...prev,
        ])
      );
    });

    return () => {
      closeChatSocket();
    };
  }, []);

  /** ✅ 選択中ユーザーのチャットをリアルタイム受信 */
  useChatSocket(
    selected ? selected.user_id : undefined,
    (msg) => {
      setItems((prev) => markUnreplied([...prev, msg]));
    }
  );


  const handleSend = async () => {
    if (!selected?.user_id || !reply.trim()) return;

    try {
      setSending(true);
      await sendAdminReply(reply, selected.user_id);
      setReply("");
      await load(); // 返信後すぐ未返信解除
    } finally {
      setSending(false);
    }
  };

  return (
    <Box p={3} display="flex" gap={3}>
      {/* ===== 左：チャット一覧 ===== */}
      <Box flex={1}>
        <Typography variant="h5" mb={2}>
          チャット履歴
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>日時</TableCell>
              <TableCell>送信者</TableCell>
              <TableCell>内容</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((log) => (
              <TableRow
                key={log.id}
                hover
                sx={{
                  cursor: "pointer",
                  backgroundColor: log.is_unreplied
                    ? "#fff4f4"
                    : selected?.id === log.id
                    ? "#f0f7ff"
                    : "transparent",
                }}
                onClick={() => setSelected(log)}
              >
                <TableCell>{log.created_at}</TableCell>

                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {log.sender}
                    {log.is_unreplied && log.sender === "user" && (
                      <Chip label="未返信" size="small" color="error" />
                    )}
                  </Box>
                </TableCell>

                <TableCell>
                  {log.message.length > 30
                    ? log.message.slice(0, 30) + "..."
                    : log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* ===== 右：チャット詳細＋返信 ===== */}
      <Box width={420}>
        <Typography variant="h6" mb={1}>
          チャット詳細
        </Typography>

        {!selected ? (
          <Typography color="text.secondary">
            左の一覧からチャットを選択してください
          </Typography>
        ) : (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {selected.created_at}
            </Typography>

            <Typography mt={1} mb={2}>
              {selected.message}
            </Typography>

            <TextField
              label="管理者返信"
              fullWidth
              multiline
              minRows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              disabled={sending}
              onClick={handleSend}
            >
              返信する
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ChatLogListPage;
