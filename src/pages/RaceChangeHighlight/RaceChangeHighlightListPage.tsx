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
  fetchRaceChangeHighlights,
  deleteRaceChangeHighlight,
  toggleRaceChangeHighlightPublic,
} from "@api/raceChangeHighlights";

type RaceChangeHighlight = {
  id: number;
  target_date: string;
  race_name: string;
  race_course?: string;
  horse_name: string;
  change_summary?: string;
  impact_level?: string;
  is_featured?: boolean;
  is_public?: boolean;
  sort_order?: number;
};

export default function RaceChangeHighlightListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<RaceChangeHighlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRaceChangeHighlights();
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
    const ok = window.confirm("この条件変わり馬データを削除しますか？");
    if (!ok) return;

    try {
      await deleteRaceChangeHighlight(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.detail ?? "削除に失敗しました");
    }
  };

  const handleTogglePublic = async (id: number, isPublic: boolean) => {
    try {
      await toggleRaceChangeHighlightPublic(id, isPublic);
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
        <Typography variant="h5">条件変わり馬 一覧</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/race-change-highlights/create")}
        >
          新規作成
        </Button>
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
              <TableCell>レース</TableCell>
              <TableCell>馬名</TableCell>
              <TableCell>変化要約</TableCell>
              <TableCell>注目度</TableCell>
              <TableCell>注目表示</TableCell>
              <TableCell>公開</TableCell>
              <TableCell>表示順</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  データがありません
                </TableCell>
              </TableRow>
            )}

            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.target_date}</TableCell>
                <TableCell>
                  {item.race_name}
                  {item.race_course ? ` / ${item.race_course}` : ""}
                </TableCell>
                <TableCell>{item.horse_name}</TableCell>
                <TableCell>{item.change_summary ?? "-"}</TableCell>
                <TableCell>{item.impact_level ?? "-"}</TableCell>
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
                        navigate(`/race-change-highlights/${item.id}/edit`)
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