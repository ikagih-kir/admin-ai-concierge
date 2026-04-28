import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import {
  deleteJockeyTrend,
  fetchJockeyTrends,
  JockeyTrendItem,
  MeetingType,
} from "@api/jockeyTrends";

export default function JockeyTrendListPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<JockeyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJockeyTrends();
      setItems(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "一覧取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("この騎手トレンドデータを削除しますか？");
    if (!ok) return;

    try {
      await deleteJockeyTrend(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "削除に失敗しました");
    }
  };

  const meetingLabel = (value: MeetingType) => {
    return value === "central" ? "中央競馬" : "地方競馬";
  };

  const filteredItems = showPublicOnly
    ? items.filter((item) => item.is_published)
    : items;

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h5">騎手トレンド 一覧</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            1〜6Rの勝利騎手を登録し、本日の好調騎手としてアプリに表示します。
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={load}>
            再読み込み
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/jockey-trends/input")}
          >
            1〜6R入力
          </Button>
        </Stack>
      </Stack>

      <Box mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={showPublicOnly}
              onChange={(e) => setShowPublicOnly(e.target.checked)}
            />
          }
          label="公開中のみ表示"
        />
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>対象日</TableCell>
              <TableCell>種別</TableCell>
              <TableCell>競馬場</TableCell>
              <TableCell>R</TableCell>
              <TableCell>騎手名</TableCell>
              <TableCell>馬名</TableCell>
              <TableCell>メモ</TableCell>
              <TableCell>公開</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  読み込み中...
                </TableCell>
              </TableRow>
            )}

            {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  データがありません
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.race_date}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={meetingLabel(item.meeting_type)}
                      color={
                        item.meeting_type === "central" ? "success" : "warning"
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{item.venue ?? "-"}</TableCell>
                  <TableCell>{item.race_no}R</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">
                      {item.jockey_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.horse_name ?? "-"}</TableCell>
                  <TableCell>{item.memo ?? "-"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={item.is_published ? "公開" : "非公開"}
                      color={item.is_published ? "primary" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => handleDelete(item.id)}
                      >
                        削除
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}