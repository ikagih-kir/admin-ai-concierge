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
} from "@mui/material";
import { createChatFaq } from "@api/chatFaqs";

export default function ChatFaqCreatePage() {
  const navigate = useNavigate();

  const [questionPattern, setQuestionPattern] = useState("");
  const [normalizedQuestion, setNormalizedQuestion] = useState("");
  const [intent, setIntent] = useState("");
  const [subIntent, setSubIntent] = useState("");
  const [answerTitle, setAnswerTitle] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [suggestedActionsJson, setSuggestedActionsJson] = useState("");
  const [keywordsJson, setKeywordsJson] = useState("");
  const [priority, setPriority] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!questionPattern.trim()) {
      setError("質問パターンを入力してください");
      return;
    }

    if (!normalizedQuestion.trim()) {
      setError("正規化質問を入力してください");
      return;
    }

    if (!intent.trim()) {
      setError("intentを入力してください");
      return;
    }

    if (!answerText.trim()) {
      setError("回答本文を入力してください");
      return;
    }

    try {
      await createChatFaq({
        question_pattern: questionPattern,
        normalized_question: normalizedQuestion,
        intent,
        sub_intent: subIntent || undefined,
        answer_title: answerTitle || undefined,
        answer_text: answerText,
        suggested_actions_json: suggestedActionsJson || undefined,
        keywords_json: keywordsJson || undefined,
        priority: Number(priority || 0),
        is_active: isActive,
      });

      alert("FAQを作成しました");
      navigate("/chat-faqs");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "保存に失敗しました");
    }
  };

  return (
    <Box p={3} maxWidth={860}>
      <Typography variant="h5" mb={3}>
        AIチャットFAQ 新規作成
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="質問パターン"
          value={questionPattern}
          onChange={(e) => setQuestionPattern(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="正規化質問"
          value={normalizedQuestion}
          onChange={(e) => setNormalizedQuestion(e.target.value)}
          helperText="例: 初心者 おすすめ サイト"
          required
          fullWidth
        />

        <TextField
          label="intent"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          helperText="例: beginner_question"
          required
          fullWidth
        />

        <TextField
          label="sub_intent"
          value={subIntent}
          onChange={(e) => setSubIntent(e.target.value)}
          fullWidth
        />

        <TextField
          label="回答タイトル"
          value={answerTitle}
          onChange={(e) => setAnswerTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="回答本文"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          multiline
          rows={6}
          required
          fullWidth
        />

        <TextField
          label="suggested_actions_json"
          value={suggestedActionsJson}
          onChange={(e) => setSuggestedActionsJson(e.target.value)}
          multiline
          rows={4}
          placeholder='[{"type":"open_page","label":"ランキングを見る","path":"/rankings"}]'
          fullWidth
        />

        <TextField
          label="keywords_json"
          value={keywordsJson}
          onChange={(e) => setKeywordsJson(e.target.value)}
          multiline
          rows={3}
          placeholder='["初心者","おすすめ","サイト"]'
          fullWidth
        />

        <TextField
          label="優先度"
          type="number"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="有効にする"
        />

        {error && <Typography color="error">{error}</Typography>}

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit}>
            保存
          </Button>
          <Button variant="outlined" onClick={() => navigate("/chat-faqs")}>
            一覧に戻る
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}