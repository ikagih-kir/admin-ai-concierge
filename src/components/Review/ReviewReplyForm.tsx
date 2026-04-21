import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { Review } from "@/types/review";
import { replyReview } from "@api/reviews";

type Props = {
  review: Review;
  onReplied: () => void;
};

const ReviewReplyForm = ({ review, onReplied }: Props) => {
  const [text, setText] = useState(review.admin_reply ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await replyReview(review.id, text);
    setLoading(false);
    onReplied();
  };

  return (
    <Box>
      <Typography variant="subtitle2" mb={1}>
        運営返信
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={submit}
        disabled={loading}
      >
        返信を保存
      </Button>
    </Box>
  );
};

export default ReviewReplyForm;
