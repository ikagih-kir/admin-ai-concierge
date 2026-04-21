import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  fetchChatFaqs,
  deleteChatFaq,
  updateChatFaq,
} from "@api/chatFaqs";

type ChatFaq = {
  id: number;
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
  usage_count?: number;
  last_used_at?: string | null;
};

export default function ChatFaqListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChatFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChatFaqs();
      setItems(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "FAQ一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("このFAQを削除しますか？");
    if (!ok) return;

    try {
      await deleteChatFaq(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "削除に失敗しました");
    }
  };

  const handleToggleActive = async (item: ChatFaq, isActive: boolean) => {
    try {
      await updateChatFaq(item.id, {
        is_active: isActive,
      });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "有効状態の更新に失敗しました");
    }
  };

  const filteredItems = showActiveOnly
    ? items.filter((item) => item.is_active)
    : items;

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5">AIチャットFAQ 一覧</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/chat-faqs/create")}
        >
          新規作成
        </Button>
      </Stack>

      <Box mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
            />
          }
          label="有効なFAQのみ表示"
        />
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>質問パターン</TableCell>
              <TableCell>正規化質問</TableCell>
              <TableCell>intent</TableCell>
              <TableCell>sub_intent</TableCell>
              <TableCell>優先度</TableCell>
              <TableCell>使用回数</TableCell>
              <TableCell>有効</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  FAQがありません
                </TableCell>
              </TableRow>
            )}

            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.question_pattern}</TableCell>
                <TableCell>{item.normalized_question}</TableCell>
                <TableCell>{item.intent}</TableCell>
                <TableCell>{item.sub_intent ?? "-"}</TableCell>
                <TableCell>{item.priority ?? 0}</TableCell>
                <TableCell>{item.usage_count ?? 0}</TableCell>
                <TableCell>
                  <Switch
                    checked={!!item.is_active}
                    onChange={(e) =>
                      handleToggleActive(item, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/chat-faqs/${item.id}/edit`)}
                    >
                      編集
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(item.id)}
                    >
                      削除
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}