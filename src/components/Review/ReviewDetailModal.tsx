import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  Rating,
  Switch,
  FormControlLabel,
  Box,
  Divider,
} from "@mui/material";

import { Review } from "@/types/review";
import { updateReview } from "@api/reviews";
import ReviewReplyForm from "./ReviewReplyForm";

type Props = {
  review: Review;
  onClose: () => void;
  onReplied: () => void;
};

export default function ReviewDetailModal({
  review,
  onClose,
  onReplied,
}: Props) {
  const [userName, setUserName] = useState(review.user_name ?? "");
  const [ratingValue, setRatingValue] = useState<number | null>(review.rating ?? 0);
  const [comment, setComment] = useState(review.comment ?? "");
  const [imageUrl, setImageUrl] = useState(review.image_url ?? "");
  const [isPublic, setIsPublic] = useState(!!review.is_public);
  const [helpfulCount, setHelpfulCount] = useState<number>(review.helpful_count ?? 0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUserName(review.user_name ?? "");
    setRatingValue(review.rating ?? 0);
    setComment(review.comment ?? "");
    setImageUrl(review.image_url ?? "");
    setIsPublic(!!review.is_public);
    setHelpfulCount(review.helpful_count ?? 0);
  }, [review]);

  const handleSave = async () => {
    if (!userName.trim()) {
      alert("ユーザー名を入力してください");
      return;
    }

    if (!ratingValue || ratingValue < 1) {
      alert("評価を入力してください");
      return;
    }

    if (!comment.trim()) {
      alert("クチコミ内容を入力してください");
      return;
    }

    setSaving(true);

    try {
      await updateReview(review.id, {
        user_name: userName.trim(),
        rating: ratingValue,
        comment: comment.trim(),
        image_url: imageUrl.trim() || undefined,
        is_public: isPublic,
        helpful_count: Math.max(0, Number(helpfulCount || 0)),
      });

      alert("更新しました");
      onReplied();
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>クチコミ詳細</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              掲載サイト
            </Typography>
            <Typography variant="body1">
              {review.site?.name ?? "-"}
            </Typography>
          </Box>

          <TextField
            label="ユーザー名"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
          />

          <Box>
            <Typography variant="body2" mb={0.5}>
              評価
            </Typography>
            <Rating
              value={ratingValue}
              onChange={(_, newValue) => setRatingValue(newValue)}
            />
          </Box>

          <TextField
            label="クチコミ内容"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />

          <TextField
            label="画像URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />

          <TextField
            label="役に立った人数"
            type="number"
            value={helpfulCount}
            onChange={(e) =>
              setHelpfulCount(Math.max(0, Number(e.target.value || 0)))
            }
            inputProps={{ min: 0 }}
            fullWidth
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

          {review.created_at && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                投稿日時
              </Typography>
              <Typography variant="body2">{review.created_at}</Typography>
            </Box>
          )}

          <Divider />

          <ReviewReplyForm
            review={review}
            onReplied={onReplied}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          閉じる
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}