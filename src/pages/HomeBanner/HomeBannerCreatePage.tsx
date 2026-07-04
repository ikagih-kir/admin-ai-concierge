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
  Paper,
} from "@mui/material";
import {
  createHomeBanner,
  fetchHomeBanner,
  updateHomeBanner,
} from "@api/homeBanners";

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

export default function HomeBannerCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editId = id ? Number(id) : null;

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [loading, setLoading] = useState(!!editId);

  useEffect(() => {
    if (!editId) return;

    const load = async () => {
      try {
        const banner = await fetchHomeBanner(editId);

        setTitle(banner.title ?? "");
        setImageUrl(banner.image_url ?? "");
        setLinkUrl(banner.link_url ?? "");
        setIsActive(!!banner.is_active);
        setStartAt(toDatetimeLocal(banner.start_at));
        setEndAt(toDatetimeLocal(banner.end_at));
        setSortOrder(banner.sort_order ?? 0);
      } catch (e) {
        console.error(e);
        alert("対象のバナーが見つかりません");
        navigate("/home-banners");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [editId, navigate]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    if (!imageUrl.trim()) {
      alert("画像URLを入力してください");
      return;
    }

    const payload = {
      title,
      image_url: imageUrl,
      link_url: linkUrl || undefined,
      is_active: isActive,
      start_at: startAt ? new Date(startAt).toISOString() : null,
      end_at: endAt ? new Date(endAt).toISOString() : null,
      sort_order: sortOrder,
    };

    try {
      if (editId) {
        await updateHomeBanner(editId, payload);
        alert("更新しました");
      } else {
        await createHomeBanner(payload);
        alert("作成しました");
      }

      navigate("/home-banners");
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
    <Box p={3} maxWidth={760}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {editId ? "ホームバナー編集" : "ホームバナー作成"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="画像URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/banner.png"
          helperText="管理画面では外部画像URLを登録します。推奨サイズは300×250、または横幅いっぱい用の比率です。"
          required
          fullWidth
        />

        {imageUrl.trim() && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid #e0e0e0",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="subtitle2" mb={1}>
              プレビュー
            </Typography>
            <Box
              component="img"
              src={imageUrl}
              alt={title || "ホームバナー"}
              sx={{
                display: "block",
                width: "100%",
                maxWidth: 360,
                height: 240,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid #ddd",
                bgcolor: "#fff",
              }}
            />
          </Paper>
        )}

        <TextField
          label="リンク先URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://example.com"
          helperText="未入力の場合、タップしても遷移しないバナーとして扱えます。"
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

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>
            保存
          </Button>

          <Button variant="outlined" onClick={() => navigate("/home-banners")}>
            戻る
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}