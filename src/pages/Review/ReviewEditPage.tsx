import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Rating,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { fetchSites } from "@api/sites";
import { fetchReviews, updateReview } from "@api/reviews";

type Site = {
  id: number;
  name: string;
};

type Review = {
  id: number;
  site_id?: number | null;
  product_id?: number | null;
  user_name: string;
  rating: number;
  comment: string;
  image_url?: string | null;
  is_public: boolean;
  helpful_count?: number;
  created_at: string;
};

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

export default function ReviewEditPage() {
  const { id } = useParams();
  const reviewId = Number(id);
  const navigate = useNavigate();

  const [sites, setSites] = useState<Site[]>([]);
  const [siteId, setSiteId] = useState<number | "">("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [createdAt, setCreatedAt] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [siteData, reviewData] = await Promise.all([
          fetchSites(),
          fetchReviews(),
        ]);

        setSites(siteData);

        const target = (reviewData as Review[]).find(
          (review) => review.id === reviewId
        );

        if (!target) {
          alert("対象のクチコミが見つかりません");
          navigate("/reviews");
          return;
        }

        setSiteId(target.site_id ?? "");
        setUserName(target.user_name ?? "");
        setRating(target.rating ?? 5);
        setComment(target.comment ?? "");
        setImageUrl(target.image_url ?? "");
        setIsPublic(!!target.is_public);
        setHelpfulCount(target.helpful_count ?? 0);
        setCreatedAt(toDatetimeLocal(target.created_at));
      } catch (error) {
        console.error(error);
        alert("クチコミ情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [reviewId, navigate]);

  const handleSubmit = async () => {
    if (!siteId || !userName || !rating || !comment) {
      alert("必須項目を入力してください");
      return;
    }

    try {
      await updateReview(reviewId, {
        site_id: Number(siteId),
        user_name: userName,
        rating,
        comment,
        image_url: imageUrl || undefined,
        is_public: isPublic,
        helpful_count: helpfulCount,
        created_at: createdAt ? new Date(createdAt).toISOString() : undefined,
      });

      alert("更新しました");
      navigate("/reviews");
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
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
    <Box p={3} maxWidth={600}>
      <Typography variant="h5" mb={3}>
        クチコミ編集
      </Typography>

      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel>掲載サイト</InputLabel>
          <Select
            value={siteId}
            label="掲載サイト"
            onChange={(e) => setSiteId(Number(e.target.value))}
          >
            {sites.map((site) => (
              <MenuItem key={site.id} value={site.id}>
                {site.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="ユーザー名"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <Box>
          <Typography>評価</Typography>
          <Rating value={rating} onChange={(_, value) => setRating(value)} />
        </Box>

        <TextField
          label="クチコミ内容"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <TextField
          label="画像URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <TextField
          label="投稿日"
          type="datetime-local"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="役に立った人数"
          type="number"
          value={helpfulCount}
          onChange={(e) =>
            setHelpfulCount(Math.max(0, Number(e.target.value || 0)))
          }
          inputProps={{ min: 0 }}
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

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleSubmit}>
            更新
          </Button>

          <Button variant="outlined" onClick={() => navigate("/reviews")}>
            戻る
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}