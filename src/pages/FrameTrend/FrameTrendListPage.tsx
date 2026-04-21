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
} from "@mui/material";
import {
  fetchFrameTrends,
  deleteFrameTrend,
  toggleFrameTrendPublic,
} from "@api/frameTrends";

type FrameTrend = {
  id: number;
  target_date: string;
  title: string;
  race_scope?: string;
  lucky_frame?: number;
  trend_summary?: string;
  recommended_style?: string;
  is_featured?: boolean;
  is_public?: boolean;
  sort_order?: number;
};

export default function FrameTrendListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<FrameTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFrameTrends();
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
    const ok = window.confirm("この枠順トレンドデータを削除しますか？");
    if (!ok) return;

    try {
      await deleteFrameTrend(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "削除に失敗しました");
    }
  };

  const handleTogglePublic = async (id: number, isPublic: boolean) => {
    try {
      await toggleFrameTrendPublic(id, isPublic);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "公開状態の更新に失敗しました");
    }
  };

  const filteredItems = showPublicOnly
    ? items.filter((item) => item.is_public)
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
        <Typography variant="h5">枠順トレンド 一覧</Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate("/frame-trends/input")}
          >
            1〜6R入力
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/frame-trends/create")}
          >
            新規作成
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
              <TableCell>タイトル</TableCell>
              <TableCell>対象範囲</TableCell>
              <TableCell>ラッキー枠</TableCell>
              <TableCell>傾向要約</TableCell>
              <TableCell>スタイル</TableCell>
              <TableCell>注目表示</TableCell>
              <TableCell>公開</TableCell>
              <TableCell>表示順</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  データがありません
                </TableCell>
              </TableRow>
            )}

            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.target_date}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.race_scope ?? "-"}</TableCell>
                <TableCell>{item.lucky_frame ?? "-"}</TableCell>
                <TableCell>{item.trend_summary ?? "-"}</TableCell>
                <TableCell>{item.recommended_style ?? "-"}</TableCell>
                <TableCell>{item.is_featured ? "ON" : "-"}</TableCell>
                <TableCell>
                  <Switch
                    checked={!!item.is_public}
                    onChange={(e) =>
                      handleTogglePublic(item.id, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>{item.sort_order ?? 0}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        navigate(`/frame-trends/${item.id}/edit`)
                      }
                    >
                      編集
                    </Button>
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