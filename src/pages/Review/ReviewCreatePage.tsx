import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { createReview } from "@api/reviews";

type Site = {
  id: number;
  name: string;
};

export default function ReviewCreatePage() {
  const navigate = useNavigate();

  const [sites, setSites] = useState<Site[]>([]);
  const [siteId, setSiteId] = useState<number | "">("");
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [helpfulCount, setHelpfulCount] = useState(0);

  useEffect(() => {
    fetchSites().then(setSites);
  }, []);

  const handleSubmit = async () => {
    if (!siteId || !userName || !rating || !comment) {
      alert("全て入力してください");
      return;
    }

    try {
      await createReview({
        site_id: siteId,
        user_name: userName,
        rating,
        comment,
        is_public: isPublic,
        helpful_count: helpfulCount,
      });

      alert("保存しました");
      navigate("/reviews");
    } catch (error) {
      console.error(error);
      alert("保存に失敗しました");
    }
  };

  return (
    <Box p={3} maxWidth={600}>
      <Typography variant="h5" mb={3}>
        クチコミ作成
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
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
          />
        </Box>

        <TextField
          label="クチコミ内容"
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
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

        <Button variant="contained" onClick={handleSubmit}>
          保存
        </Button>
      </Stack>
    </Box>
  );
}