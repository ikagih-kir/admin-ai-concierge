import { useMemo, useRef, useState } from "react";
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
import { createSite } from "@api/sites";
import { createRaceChangeHighlight } from "@api/raceChangeHighlights";
import { createFrameTrend } from "@api/frameTrends";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function SiteCreatePage() {
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill | null>(null);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [catchCopy, setCatchCopy] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [bodyImageUrl, setBodyImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [rating, setRating] = useState("0");
  const [reviewCount, setReviewCount] = useState("0");
  const [sortOrder, setSortOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [publishedAt, setPublishedAt] = useState("");
  
  const [hitAmount, setHitAmount] = useState("0");
  const [hitRate, setHitRate] = useState("0");
  const [recoveryRate, setRecoveryRate] = useState("0");
  
  const [styleType, setStyleType] = useState("");
  const [freeLevel, setFreeLevel] = useState("");
  const [predictionType, setPredictionType] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleInsertBodyImage = () => {
    if (!bodyImageUrl.trim()) {
      setError("本文内に入れる画像URLを入力してください");
      return;
    }

    const editor = quillRef.current?.getEditor();

    if (!editor) {
      setError("エディタの取得に失敗しました");
      return;
    }

    const range = editor.getSelection(true);
    const insertIndex = range ? range.index : editor.getLength();

    editor.insertEmbed(insertIndex, "image", bodyImageUrl.trim());
    editor.setSelection(insertIndex + 1, 0);

    setBody(editor.root.innerHTML);
    setBodyImageUrl("");
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim()) {
      setError("サイト名を入力してください");
      return;
    }

    if (!slug.trim()) {
      setError("slugを入力してください");
      return;
    }

    if (!externalUrl.trim()) {
      setError("外部リンクURLを入力してください");
      return;
    }

    try {
      await createSite({
        name,
        slug,
        catch_copy: catchCopy || undefined,
        description: description || undefined,
        body: body || undefined,
        logo_url: logoUrl || undefined,
        thumbnail_url: thumbnailUrl || undefined,
        banner_url: bannerUrl || undefined,
        external_url: externalUrl,
        affiliate_url: affiliateUrl || undefined,
        rating: Number(rating),
        review_count: Number(reviewCount),
        sort_order: Number(sortOrder),
        is_featured: isFeatured,
        is_recommended: isRecommended,
        is_public: isPublic,
        style_type: styleType || undefined,
        free_level: freeLevel || undefined,
        prediction_type: predictionType || undefined,
        published_at: publishedAt || null,
        hit_amount: Number(hitAmount || 0),
        hit_rate: Number(hitRate || 0),
        recovery_rate: Number(recoveryRate || 0),
      });

      alert("掲載サイトを作成しました");
      navigate("/sites");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "保存に失敗しました");
    }
  };

  const handleCreateRaceChangeTest = async () => {
    setError(null);

    try {
      const res = await createRaceChangeHighlight({
        target_date: "2026-03-29",
        race_name: "高松宮記念",
        race_course: "中京11R",
        horse_name: "テストホースA",
        previous_surface: "turf",
        current_surface: "dirt",
        previous_distance: 1600,
        current_distance: 1400,
        previous_jockey: "川田将雅",
        current_jockey: "坂井瑠星",
        surface_changed: true,
        distance_changed: true,
        distance_direction: "down",
        gear_changed: false,
        jockey_changed: true,
        class_changed: false,
        change_summary: "芝→ダート替わり + 距離短縮",
        ai_comment:
          "条件替わりで一変に注意したい1頭です。人気次第では面白い存在です。",
        note: "前走は外を回されて参考外。今回は条件替わりで見直し余地あり。",
        impact_level: "high",
        is_featured: true,
        sort_order: 0,
        is_public: true,
      });

      console.log("race change created:", res);
      alert("条件変わり馬のテスト登録に成功しました");
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.detail ??
          "条件変わり馬のテスト登録に失敗しました"
      );
    }
  };

  const handleCreateFrameTrendTest = async () => {
    setError(null);

    try {
      const res = await createFrameTrend({
        target_date: "2026-03-29",
        title: "今日の枠順トレンド",
        race_scope: "today_all",
        lucky_frame: 3,
        trend_summary: "中枠優勢",
        trend_note:
          "直近傾向では3〜5枠が好調です。極端な外枠はやや割引で見たい流れです。",
        recommended_style: "balanced",
        sample_size: 30,
        win_frame_data:
          "{\"1\":2,\"2\":4,\"3\":6,\"4\":5,\"5\":4,\"6\":3,\"7\":2,\"8\":1}",
        place_frame_data:
          "{\"1\":5,\"2\":7,\"3\":9,\"4\":8,\"5\":7,\"6\":6,\"7\":4,\"8\":3}",
        ai_comment:
          "今日は中枠を意識して見ると面白いかもしれません。迷ったら3〜5枠を先にチェックしたいです。",
        is_featured: true,
        sort_order: 0,
        is_public: true,
      });

      console.log("frame trend created:", res);
      alert("枠順トレンドのテスト登録に成功しました");
    } catch (e: any) {
      console.error(e);
      setError(
        e?.response?.data?.detail ?? "枠順トレンドのテスト登録に失敗しました"
      );
    }
  };

  return (
    <Box p={3} maxWidth={760}>
      <Typography variant="h5" mb={3}>
        掲載サイト 新規作成
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="サイト名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          helperText="例: uma-pro"
          required
          fullWidth
        />

        <TextField
          label="キャッチコピー"
          value={catchCopy}
          onChange={(e) => setCatchCopy(e.target.value)}
          fullWidth
        />

        <TextField
          label="説明文"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <Box>
          <Typography variant="subtitle2" mb={1}>
            詳細本文（HTML装飾可）
          </Typography>
          <ReactQuill
            ref={quillRef}
            value={body}
            onChange={(content) => setBody(content)}
            theme="snow"
            modules={quillModules}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            見出し、太字、文字色、箇条書き、リンクに対応しています。画像は下の「本文内画像URL」から追加してください。
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="subtitle2" mb={1}>
            本文内画像URL
          </Typography>

          <Box display="flex" gap={1.5} alignItems="flex-start" flexWrap="wrap">
            <TextField
              label="画像URL"
              value={bodyImageUrl}
              onChange={(e) => setBodyImageUrl(e.target.value)}
              placeholder="https://example.com/sample.jpg"
              fullWidth
              sx={{ flex: 1, minWidth: 280 }}
            />
            <Button
              variant="outlined"
              onClick={handleInsertBodyImage}
              sx={{ whiteSpace: "nowrap", height: 56 }}
            >
              本文に画像を追加
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            URL画像をカーソル位置に追加します。ローカル画像の直接アップロードではなく、公開URLを使ってください。
          </Typography>
        </Box>

        <TextField
          label="ロゴ画像URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          fullWidth
        />

        <TextField
          label="サムネイル画像URL"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          fullWidth
        />

        <TextField
          label="バナー画像URL"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          fullWidth
        />

        <TextField
          label="外部リンクURL"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="アフィリエイトURL"
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>診断用スタイル</InputLabel>
          <Select
            value={styleType}
            label="診断用スタイル"
            onChange={(e) => setStyleType(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="beginner">初心者向け</MenuItem>
            <MenuItem value="balanced">バランス型</MenuItem>
            <MenuItem value="aggressive">攻め型</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>無料情報レベル</InputLabel>
          <Select
            value={freeLevel}
            label="無料情報レベル"
            onChange={(e) => setFreeLevel(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="high">多い</MenuItem>
            <MenuItem value="medium">普通</MenuItem>
            <MenuItem value="low">少ない</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>予想タイプ</InputLabel>
          <Select
            value={predictionType}
            label="予想タイプ"
            onChange={(e) => setPredictionType(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="stable">堅実型</MenuItem>
            <MenuItem value="hole">穴狙い型</MenuItem>
            <MenuItem value="mixed">バランス型</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="評価"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          inputProps={{ min: 0, max: 5, step: 0.1 }}
          fullWidth
        />

        <TextField
          label="口コミ件数"
          type="number"
          value={reviewCount}
          onChange={(e) => setReviewCount(e.target.value)}
          inputProps={{ min: 0 }}
          fullWidth
        />

        <TextField
          label="表示順"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          fullWidth
        />

        <TextField
          label="公開日時"
          type="datetime-local"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="的中金額"
          type="number"
          value={hitAmount}
          onChange={(e) => setHitAmount(e.target.value)}
          fullWidth
        />

        <TextField
          label="的中率"
          type="number"
          value={hitRate}
          onChange={(e) => setHitRate(e.target.value)}
          fullWidth
        />

        <TextField
          label="回収率"
          type="number"
          value={recoveryRate}
          onChange={(e) => setRecoveryRate(e.target.value)}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
          }
          label="注目掲載"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isRecommended}
              onChange={(e) => setIsRecommended(e.target.checked)}
            />
          }
          label="おすすめ掲載"
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
          <Button variant="outlined" onClick={() => navigate("/sites")}>
            一覧に戻る
          </Button>
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1" mb={1}>
            開発用テスト
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCreateRaceChangeTest}
            >
              条件変わり馬テスト登録
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCreateFrameTrendTest}
            >
              枠順トレンドテスト登録
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}