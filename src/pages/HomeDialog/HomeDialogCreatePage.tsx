import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  createHomeDialog,
  fetchHomeDialogs,
  updateHomeDialog,
  type HomeDialog,
} from "@api/homeDialogs";

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export default function HomeDialogCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editId = id ? Number(id) : null;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("見る");
  const [primaryButtonPath, setPrimaryButtonPath] = useState("/jockey-trends");
  const [secondaryButtonText, setSecondaryButtonText] = useState("閉じる");
  const [isActive, setIsActive] = useState(true);
  const [showOncePerDay, setShowOncePerDay] = useState(true);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [loading, setLoading] = useState(!!editId);

  useEffect(() => {
    if (!editId) return;

    const load = async () => {
      try {
        const list = await fetchHomeDialogs();
        const target = list.find((item: HomeDialog) => item.id === editId);

        if (!target) {
          alert("対象のダイアログが見つかりません");
          navigate("/home-dialogs");
          return;
        }

        setTitle(target.title);
        setBody(target.body);
        setPrimaryButtonText(target.primary_button_text ?? "");
        setPrimaryButtonPath(target.primary_button_path ?? "");
        setSecondaryButtonText(target.secondary_button_text ?? "閉じる");
        setIsActive(target.is_active);
        setShowOncePerDay(target.show_once_per_day);
        setStartAt(toDatetimeLocal(target.start_at));
        setEndAt(toDatetimeLocal(target.end_at));
        setSortOrder(target.sort_order ?? 0);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [editId, navigate]);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      alert("タイトルと本文は必須です");
      return;
    }

    const payload = {
      title,
      body,
      primary_button_text: primaryButtonText || undefined,
      primary_button_path: primaryButtonPath || undefined,
      secondary_button_text: secondaryButtonText || "閉じる",
      is_active: isActive,
      show_once_per_day: showOncePerDay,
      start_at: startAt ? new Date(startAt).toISOString() : null,
      end_at: endAt ? new Date(endAt).toISOString() : null,
      sort_order: sortOrder,
    };

    try {
      if (editId) {
        await updateHomeDialog(editId, payload);
        alert("更新しました");
      } else {
        await createHomeDialog(payload);
        alert("作成しました");
      }

      navigate("/home-dialogs");
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    }
  };

  if (loading) {
    return (
      <Box p={3}>
        <Typography>読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth={720}>
      <Typography variant="h5" mb={3}>
        {editId ? "ホームダイアログ編集" : "ホームダイアログ作成"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="本文"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          multiline
          rows={5}
          fullWidth
        />

        <TextField
          label="メインボタン文言"
          value={primaryButtonText}
          onChange={(e) => setPrimaryButtonText(e.target.value)}
          helperText="例：騎手トレンドを見る"
          fullWidth
        />

        <TextField
          label="メインボタン遷移先"
          value={primaryButtonPath}
          onChange={(e) => setPrimaryButtonPath(e.target.value)}
          helperText="例：/jockey-trends /frame-trends /free-predictions"
          fullWidth
        />

        <TextField
          label="閉じるボタン文言"
          value={secondaryButtonText}
          onChange={(e) => setSecondaryButtonText(e.target.value)}
          fullWidth
        />

        <TextField
          label="表示開始日時"
          type="datetime-local"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="表示終了日時"
          type="datetime-local"
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="表示順"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value || 0))}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="表示ON"
        />

        <FormControlLabel
          control={
            <Switch
              checked={showOncePerDay}
              onChange={(e) => setShowOncePerDay(e.target.checked)}
            />
          }
          label="1日1回だけ表示"
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>
            保存
          </Button>

          <Button variant="outlined" onClick={() => navigate("/home-dialogs")}>
            戻る
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}