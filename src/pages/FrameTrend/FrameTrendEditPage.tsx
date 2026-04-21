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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { fetchFrameTrend, updateFrameTrend } from "@api/frameTrends";

export default function FrameTrendEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = Number(id);

  const [targetDate, setTargetDate] = useState("");
  const [title, setTitle] = useState("");
  const [raceScope, setRaceScope] = useState("");
  const [luckyFrame, setLuckyFrame] = useState("");
  const [trendSummary, setTrendSummary] = useState("");
  const [trendNote, setTrendNote] = useState("");
  const [recommendedStyle, setRecommendedStyle] = useState("");
  const [sampleSize, setSampleSize] = useState("");
  const [winFrameData, setWinFrameData] = useState("");
  const [placeFrameData, setPlaceFrameData] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");
  const [isPublic, setIsPublic] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const item = await fetchFrameTrend(itemId);

        setTargetDate(item.target_date ?? "");
        setTitle(item.title ?? "");
        setRaceScope(item.race_scope ?? "");
        setLuckyFrame(item.lucky_frame != null ? String(item.lucky_frame) : "");
        setTrendSummary(item.trend_summary ?? "");
        setTrendNote(item.trend_note ?? "");
        setRecommendedStyle(item.recommended_style ?? "");
        setSampleSize(item.sample_size != null ? String(item.sample_size) : "");
        setWinFrameData(item.win_frame_data ?? "");
        setPlaceFrameData(item.place_frame_data ?? "");
        setAiComment(item.ai_comment ?? "");
        setIsFeatured(!!item.is_featured);
        setSortOrder(String(item.sort_order ?? 0));
        setIsPublic(!!item.is_public);
      } catch (e: any) {
        setError(e?.response?.data?.detail ?? "データ取得に失敗しました");
      }
    };

    if (itemId) load();
  }, [itemId]);

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

    try {
      await updateFrameTrend(itemId, {
        target_date: targetDate,
        title,
        race_scope: raceScope || undefined,
        lucky_frame: luckyFrame ? Number(luckyFrame) : undefined,
        trend_summary: trendSummary || undefined,
        trend_note: trendNote || undefined,
        recommended_style: recommendedStyle || undefined,
        sample_size: sampleSize ? Number(sampleSize) : undefined,
        win_frame_data: winFrameData || undefined,
        place_frame_data: placeFrameData || undefined,
        ai_comment: aiComment || undefined,
        is_featured: isFeatured,
        sort_order: Number(sortOrder),
        is_public: isPublic,
      });

      alert("枠順トレンドデータを更新しました");
      navigate("/frame-trends");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "更新に失敗しました");
    }
  };

  return (
    <Box p={3} maxWidth={760}>
      <Typography variant="h5" mb={3}>
        枠順トレンド 編集
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
          label="集計対象範囲"
          value={raceScope}
          onChange={(e) => setRaceScope(e.target.value)}
          fullWidth
        />

        <TextField
          label="ラッキー枠"
          type="number"
          value={luckyFrame}
          onChange={(e) => setLuckyFrame(e.target.value)}
          inputProps={{ min: 1, max: 8 }}
          fullWidth
        />

        <TextField
          label="傾向要約"
          value={trendSummary}
          onChange={(e) => setTrendSummary(e.target.value)}
          fullWidth
        />

        <TextField
          label="補足文"
          value={trendNote}
          onChange={(e) => setTrendNote(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>おすすめスタイル</InputLabel>
          <Select
            value={recommendedStyle}
            label="おすすめスタイル"
            onChange={(e) => setRecommendedStyle(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="stable">堅実型</MenuItem>
            <MenuItem value="hole">穴狙い型</MenuItem>
            <MenuItem value="balanced">バランス型</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="サンプル数"
          type="number"
          value={sampleSize}
          onChange={(e) => setSampleSize(e.target.value)}
          fullWidth
        />

        <TextField
          label="1着枠集計JSON文字列"
          value={winFrameData}
          onChange={(e) => setWinFrameData(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          label="複勝圏枠集計JSON文字列"
          value={placeFrameData}
          onChange={(e) => setPlaceFrameData(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          label="AIコメント"
          value={aiComment}
          onChange={(e) => setAiComment(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          label="表示順"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
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
            更新
          </Button>
          <Button variant="outlined" onClick={() => navigate("/frame-trends")}>
            一覧に戻る
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}