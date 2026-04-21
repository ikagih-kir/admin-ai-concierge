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
} from "@mui/material";
import { createArticle } from "@api/articles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ArticleCreatePage() {
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

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [bodyImageUrl, setBodyImageUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [publishedAt, setPublishedAt] = useState("");
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
    editor.insertText(insertIndex + 1, "\n");
    editor.setSelection(insertIndex + 2, 0);

    setBodyImageUrl("");
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError("記事タイトルを入力してください");
      return;
    }

    if (!slug.trim()) {
      setError("slugを入力してください");
      return;
    }

    try {
      await createArticle({
        title,
        slug,
        category: category || undefined,
        excerpt: excerpt || undefined,
        body: body || undefined,
        thumbnail_url: thumbnailUrl || undefined,
        banner_url: bannerUrl || undefined,
        sort_order: Number(sortOrder),
        is_featured: isFeatured,
        is_public: isPublic,
        published_at: publishedAt || null,
      });

      alert("記事を作成しました");
      navigate("/articles");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "保存に失敗しました");
    }
  };

  return (
    <Box p={3} maxWidth={760}>
      <Typography variant="h5" mb={3}>
        記事 新規作成
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="記事タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          helperText="例: beginner-guide"
          required
          fullWidth
        />

        <TextField
          label="カテゴリ"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="例: 初心者向け / 比較 / 攻略"
          fullWidth
        />

        <TextField
          label="一覧用の短い説明文"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <Box>
          <Typography variant="subtitle2" mb={1}>
            記事本文（HTML装飾可）
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

        <FormControlLabel
          control={
            <Switch
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
          }
          label="注目記事にする"
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

          <Button variant="outlined" onClick={() => navigate("/articles")}>
            一覧に戻る
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}