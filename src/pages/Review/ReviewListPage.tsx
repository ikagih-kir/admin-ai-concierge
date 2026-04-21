import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  Chip,
  Button,
  Rating,
  Stack,
} from "@mui/material";
import { fetchReviews, toggleReviewPublic } from "@api/reviews";
import { Review } from "@/types/review";
import ReviewDetailModal from "@components/Review/ReviewDetailModal";

const ReviewListPage = () => {
  const [items, setItems] = useState<Review[]>([]);
  const [selected, setSelected] = useState<Review | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setItems(await fetchReviews());
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">クチコミ管理</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/reviews/create")}
        >
          クチコミを作成
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>掲載サイト</TableCell>
            <TableCell>投稿者</TableCell>
            <TableCell>評価</TableCell>
            <TableCell>クチコミ</TableCell>
            <TableCell>役立った人数</TableCell>
            <TableCell>返信</TableCell>
            <TableCell>公開</TableCell>
            <TableCell align="center">操作</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((r) => (
            <TableRow key={r.id} hover>
              <TableCell>{r.site?.name ?? "-"}</TableCell>

              <TableCell>{r.user_name ?? "-"}</TableCell>

              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={r.rating ?? 0} readOnly size="small" />
                  <Typography variant="caption">{r.rating}</Typography>
                </Box>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 280,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    whiteSpace: "normal",
                    lineHeight: 1.5,
                  }}
                >
                  {r.comment}
                </Typography>
              </TableCell>

              <TableCell>
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap={0.75}
                  sx={{
                    px: 1.2,
                    py: 0.6,
                    borderRadius: 999,
                    backgroundColor: "#FFF3E0",
                  }}
                >
                  <ThumbUpAltOutlinedIcon
                    sx={{ fontSize: 16, color: "#ED6C02" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: "#A04A00" }}
                  >
                    {r.helpful_count ?? 0}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                {r.admin_reply ? (
                  <Chip label="返信済" color="success" size="small" />
                ) : (
                  <Chip label="未返信" color="error" size="small" />
                )}
              </TableCell>

              <TableCell>
                <Switch
                  checked={r.is_public}
                  onChange={async (_, v) => {
                    await toggleReviewPublic(r.id, v);
                    load();
                  }}
                />
              </TableCell>

              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => setSelected(r)}
                    sx={{
                      fontWeight: 700,
                      minWidth: 72,
                    }}
                  >
                    編集
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <ReviewDetailModal
          review={selected}
          onClose={() => setSelected(null)}
          onReplied={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </Box>
  );
};

export default ReviewListPage;