import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { sendPushNotification } from "@api/pushNotifications";

const targetPathOptions = [
  { label: "騎手トレンド", value: "/jockey-trends" },
  { label: "枠順トレンド", value: "/frame-trends" },
  { label: "無料予想", value: "/free-predictions" },
  { label: "予想サイト一覧", value: "/sites" },
];

export default function PushNotificationSendPage() {
  const [title, setTitle] = useState("🔥今日の勝ち騎手をチェック");
  const [body, setBody] = useState("今アツい騎手を確認しよう");
  const [targetPath, setTargetPath] = useState("/jockey-trends");
  const [sending, setSending] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      alert("タイトルと本文を入力してください");
      return;
    }

    const ok = window.confirm(
      "登録済みユーザー全員にプッシュ通知を送信します。よろしいですか？"
    );
    if (!ok) return;

    setSending(true);
    setResultMessage("");
    setErrorMessage("");

    try {
      const result = await sendPushNotification({
        title,
        body,
        target_path: targetPath || undefined,
        target: "all",
      });

      setResultMessage(
        `送信完了：成功 ${result.success_count}件 / 失敗 ${result.failure_count}件 / 対象 ${result.total_count}件`
      );
    } catch (error) {
      console.error(error);
      setErrorMessage("送信に失敗しました。ログイン状態、FastAPIログ、Firebase秘密鍵を確認してください。");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box p={3} maxWidth={720}>
      <Typography variant="h5" mb={3}>
        プッシュ通知送信
      </Typography>

      <Paper sx={{ p: 3 }}>
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

          <Divider />

          <Box>
            <Typography variant="subtitle2" mb={1}>
              プレビュー
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
              <Typography fontWeight={700}>{title || "通知タイトル"}</Typography>
              <Typography variant="body2" color="text.secondary">
                {body || "通知本文"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                遷移先：{targetPath || "なし"}
              </Typography>
            </Paper>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={sending}
          >
            {sending ? "送信中..." : "全ユーザーへ送信"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}