import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { createAssistantMessage } from "@api/assistantMessages";

export default function AssistantMessageCreatePage() {
  const navigate = useNavigate();

  const [targetDate, setTargetDate] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");
  const [priority, setPriority] = useState("0");
  const [sortOrder, setSortOrder] = useState("0");

  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const [actionType, setActionType] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [actionPath, setActionPath] = useState("");

  const [targetSegment, setTargetSegment] = useState("");
  const [relatedContentType, setRelatedContentType] = useState("");
  const [relatedContentId, setRelatedContentId] = useState("");

  const [note, setNote] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!targetDate.trim()) {
      setError("対象日を入力してください");
      return;
    }

    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }

    if (!message.trim()) {
      setError("本文を入力してください");
      return;
    }

    try {
      await createAssistantMessage({
        target_date: targetDate,
        title,
        message,
        message_type: messageType || undefined,
        priority: Number(priority),
        sort_order: Number(sortOrder),
        is_featured: isFeatured,
        is_public: isPublic,
        action_type: actionType || undefined,
        action_label: actionLabel || undefined,
        action_path: actionPath || undefined,
        target_segment: targetSegment || undefined,
        related_content_type: relatedContentType || undefined,
        related_content_id: relatedContentId
          ? Number(relatedContentId)
          : undefined,
        note: note || undefined,
      });

      alert("秘書メッセージを作成しました");
      navigate("/assistant-messages");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "保存に失敗しました");
    }
  };

  return (
    <Box p={3} maxWidth={760}>
      <Typography variant="h5" mb={3}>
        秘書メッセージ 新規作成
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="対象日"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <TextField
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="本文"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          rows={4}
          required
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>メッセージ種別</InputLabel>
          <Select
            value={messageType}
            label="メッセージ種別"
            onChange={(e) => setMessageType(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="daily">daily</MenuItem>
            <MenuItem value="condition">condition</MenuItem>
            <MenuItem value="frame_trend">frame_trend</MenuItem>
            <MenuItem value="site_guide">site_guide</MenuItem>
            <MenuItem value="free_prediction">free_prediction</MenuItem>
            <MenuItem value="campaign">campaign</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="優先度"
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
        />

        <TextField
          label="表示順"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>導線種別</InputLabel>
          <Select
            value={actionType}
            label="導線種別"
            onChange={(e) => setActionType(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="internal">internal</MenuItem>
            <MenuItem value="external">external</MenuItem>
            <MenuItem value="none">none</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="導線ボタン文言"
          value={actionLabel}
          onChange={(e) => setActionLabel(e.target.value)}
          placeholder="例: 条件変わり馬を見る"
          fullWidth
        />

        <TextField
          label="導線パス"
          value={actionPath}
          onChange={(e) => setActionPath(e.target.value)}
          placeholder="例: /race-change-highlights"
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>対象セグメント</InputLabel>
          <Select
            value={targetSegment}
            label="対象セグメント"
            onChange={(e) => setTargetSegment(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="all">all</MenuItem>
            <MenuItem value="beginner">beginner</MenuItem>
            <MenuItem value="stable">stable</MenuItem>
            <MenuItem value="hole">hole</MenuItem>
            <MenuItem value="free_first">free_first</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>関連コンテンツ種別</InputLabel>
          <Select
            value={relatedContentType}
            label="関連コンテンツ種別"
            onChange={(e) => setRelatedContentType(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="race_change_highlight">
              race_change_highlight
            </MenuItem>
            <MenuItem value="frame_trend">frame_trend</MenuItem>
            <MenuItem value="site">site</MenuItem>
            <MenuItem value="product">product</MenuItem>
            <MenuItem value="article">article</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="関連コンテンツID"
          type="number"
          value={relatedContentId}
          onChange={(e) => setRelatedContentId(e.target.value)}
          fullWidth
        />

        <TextField
          label="管理メモ"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
          }
          label="注目表示"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label="公開する"
        />

        {error && <Typography color="error">{error}</Typography>}

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit}>
            保存
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/assistant-messages")}
          >
            一覧に戻る
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}