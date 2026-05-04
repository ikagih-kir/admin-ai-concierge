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
  Chip,
} from "@mui/material";
import {
  deleteHomeDialog,
  fetchHomeDialogs,
  toggleHomeDialog,
  type HomeDialog,
} from "@api/homeDialogs";

export default function HomeDialogListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HomeDialog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHomeDialogs();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("このホームダイアログを削除しますか？");
    if (!ok) return;

    await deleteHomeDialog(id);
    await load();
  };

  const handleToggle = async (id: number, active: boolean) => {
    await toggleHomeDialog(id, active);
    await load();
  };

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">ホームダイアログ管理</Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/home-dialogs/create")}
        >
          新規作成
        </Button>
      </Stack>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>タイトル</TableCell>
              <TableCell>本文</TableCell>
              <TableCell>ボタン</TableCell>
              <TableCell>遷移先</TableCell>
              <TableCell>1日1回</TableCell>
              <TableCell>表示</TableCell>
              <TableCell>表示順</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  読み込み中...
                </TableCell>
              </TableRow>
            )}

            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  データがありません
                </TableCell>
              </TableRow>
            )}

            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
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
                    }}
                  >
                    {item.body}
                  </Typography>
                </TableCell>
                <TableCell>{item.primary_button_text ?? "-"}</TableCell>
                <TableCell>{item.primary_button_path ?? "-"}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={item.show_once_per_day ? "ON" : "OFF"}
                    color={item.show_once_per_day ? "primary" : "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.is_active}
                    onChange={(e) => handleToggle(item.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{item.sort_order}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/home-dialogs/${item.id}/edit`)}
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