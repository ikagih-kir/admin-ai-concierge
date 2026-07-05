import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  cancelScheduledPushNotification,
  createScheduledPushNotification,
  fetchScheduledPushNotifications,
  sendPushNotification,
  type ScheduledPushNotification,
} from "@api/pushNotifications";
import { fetchArticles } from "@api/articles";


const ARTICLE_DETAIL_TARGET = "__article_detail__";

type ArticleOption = {
  id: number;
  title: string;
  is_public?: boolean;
};


const targetPathOptions = [
  { label: "騎手トレンド", value: "/jockey-trends" },
  { label: "枠順トレンド", value: "/frame-trends" },
  { label: "無料予想", value: "/free-predictions" },
  { label: "予想サイト一覧", value: "/sites" },
  { label: "記事詳細", value: ARTICLE_DETAIL_TARGET },
];

const toIsoFromLocal = (value: string) => {
  if (!value) return "";
  return new Date(value).toISOString();
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ja-JP");
};

const statusLabel = (status: string) => {
  switch (status) {
    case "scheduled":
      return "予約中";
    case "sent":
      return "送信済";
    case "failed":
      return "失敗";
    case "canceled":
      return "キャンセル";
    default:
      return status;
  }
};

const statusColor = (
  status: string
): "default" | "primary" | "success" | "error" | "warning" => {
  switch (status) {
    case "scheduled":
      return "primary";
    case "sent":
      return "success";
    case "failed":
      return "error";
    case "canceled":
      return "default";
    default:
      return "default";
  }
};

export default function PushNotificationSendPage() {
  const [title, setTitle] = useState("🔥今日の勝ち騎手をチェック");
  const [body, setBody] = useState("今アツい騎手を確認しよう");
  const [targetPath, setTargetPath] = useState("/jockey-trends");

  const [scheduledAt, setScheduledAt] = useState("");
  const [items, setItems] = useState<ScheduledPushNotification[]>([]);

  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  
  const [sending, setSending] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadScheduled = async () => {
    const data = await fetchScheduledPushNotifications();
    setItems(data);
  };

  useEffect(() => {
    loadScheduled();

    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadArticles();
  }, []);

  const buildTargetPath = () => {
    if (targetPath === ARTICLE_DETAIL_TARGET) {
      return selectedArticleId ? `/articles/${selectedArticleId}` : "";
    }

    return targetPath;
  };

  const validateBase = () => {
    if (!title.trim() || !body.trim()) {
      alert("タイトルと本文を入力してください");
      return false;
    }

    if (targetPath === ARTICLE_DETAIL_TARGET && !selectedArticleId) {
      alert("記事詳細に遷移する記事を選択してください");
      return false;
    }

    return true;
  };

  const handleSendNow = async () => {
    if (!validateBase()) return;

    const resolvedTargetPath = buildTargetPath();

    const ok = window.confirm(
      "登録済みユーザー全員にプッシュ通知を即時送信します。よろしいですか？"
    );
    if (!ok) return;

    setSending(true);
    setResultMessage("");
    setErrorMessage("");

    try {
      const result = await sendPushNotification({
        title,
        body,
        target_path: resolvedTargetPath || undefined,
        target: "all",
      });

      setResultMessage(
        `即時送信完了：成功 ${result.success_count}件 / 失敗 ${result.failure_count}件 / 対象 ${result.total_count}件`
      );
      await loadScheduled();
    } catch (error) {
      console.error(error);
      setErrorMessage("即時送信に失敗しました。FastAPIログを確認してください。");
    } finally {
      setSending(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!validateBase()) return;

    const resolvedTargetPath = buildTargetPath();

    if (!scheduledAt) {
      alert("送信予約日時を入力してください");
      return;
    }

    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      alert("送信予約日時が不正です");
      return;
    }

    if (scheduledDate.getTime() <= Date.now()) {
      alert("現在より未来の日時を指定してください");
      return;
    }

    const ok = window.confirm(
      `この内容で予約しますか？\n\n送信予定：${scheduledDate.toLocaleString(
        "ja-JP"
      )}`
    );
    if (!ok) return;

    setSavingSchedule(true);
    setResultMessage("");
    setErrorMessage("");

    try {
      await createScheduledPushNotification({
        title,
        body,
        target_path: resolvedTargetPath || undefined,
        scheduled_at: toIsoFromLocal(scheduledAt),
      });

      setResultMessage("予約を作成しました。");
      setScheduledAt("");
      await loadScheduled();
    } catch (error) {
      console.error(error);
      setErrorMessage("予約作成に失敗しました。");
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleCancel = async (id: number) => {
    const ok = window.confirm("この予約通知をキャンセルしますか？");
    if (!ok) return;

    try {
      await cancelScheduledPushNotification(id);
      await loadScheduled();
    } catch (error) {
      console.error(error);
      alert("キャンセルに失敗しました");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        プッシュ通知送信
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 760, mb: 3 }}>
        <Stack spacing={2}>
          {resultMessage && <Alert severity="success">{resultMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <TextField
            label="通知タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100`}
          />

          <TextField
            label="通知本文"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            multiline
            rows={3}
            fullWidth
            inputProps={{ maxLength: 255 }}
            helperText={`${body.length}/255`}
          />

          <TextField
            select
            label="通知タップ後の遷移先"
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            fullWidth
          >
            {targetPathOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}（{option.value}）
              </MenuItem>
            ))}
          </TextField>

          {targetPath === ARTICLE_DETAIL_TARGET && (
            <TextField
              select
              label="遷移先の記事"
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              fullWidth
              helperText="通知をタップした時に開く記事詳細ページを選択してください"
            >
              {articles.map((article) => (
                <MenuItem key={article.id} value={String(article.id)}>
                  #{article.id} {article.title}
                  {article.is_public === false ? "（非公開）" : ""}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Divider />

          <TextField
            label="送信予約日時"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            helperText="未入力なら即時送信のみ使えます"
            fullWidth
          />

          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
            <Typography fontWeight={700}>{title || "通知タイトル"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {body || "通知本文"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              遷移先：{buildTargetPath() || "なし"}
            </Typography>
          </Paper>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSendNow}
              disabled={sending || savingSchedule}
            >
              {sending ? "送信中..." : "今すぐ送信"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleCreateSchedule}
              disabled={sending || savingSchedule}
            >
              {savingSchedule ? "予約中..." : "予約送信を作成"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Typography variant="h6" mb={2}>
        予約・送信履歴
      </Typography>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>送信予定</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>本文</TableCell>
              <TableCell>遷移先</TableCell>
              <TableCell>結果</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  データがありません
                </TableCell>
              </TableRow>
            )}

            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={statusLabel(item.status)}
                    color={statusColor(item.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatDateTime(item.scheduled_at)}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 220,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.body}
                  </Typography>
                </TableCell>
                <TableCell>{item.target_path ?? "-"}</TableCell>
                <TableCell>
                  成功 {item.success_count} / 失敗 {item.failure_count} / 対象{" "}
                  {item.total_count}
                  {item.error_message && (
                    <Typography variant="caption" color="error" display="block">
                      {item.error_message}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {item.status === "scheduled" ? (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleCancel(item.id)}
                    >
                      キャンセル
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}