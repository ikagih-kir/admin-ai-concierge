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
  Link,
  TableContainer,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  deleteHomeBanner,
  fetchHomeBanners,
  toggleHomeBanner,
  type HomeBanner,
} from "@api/homeBanners";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ja-JP");
};

export default function HomeBannerListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HomeBanner[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHomeBanners();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("このホームバナーを削除しますか？");
    if (!ok) return;

    await deleteHomeBanner(id);
    await load();
  };

  const handleToggle = async (id: number, active: boolean) => {
    try {
      await toggleHomeBanner(id, active);
      await load();
    } catch (e) {
      console.error(e);
      alert("表示状態の更新に失敗しました");
    }
  };

  return (
    <Box p={3} sx={{ width: "100%", minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            ホームバナー管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            アプリHome画面のコンテンツ間に表示する自社バナーを管理します
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/home-banners/create")}
        >
          新規作成
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 1080 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell sx={{ minWidth: 220 }}>バナー</TableCell>
                <TableCell sx={{ minWidth: 180 }}>タイトル</TableCell>
                <TableCell sx={{ minWidth: 220 }}>リンク先</TableCell>
                <TableCell sx={{ minWidth: 220 }}>表示期間</TableCell>
                <TableCell>表示</TableCell>
                <TableCell>表示順</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    読み込み中...
                  </TableCell>
                </TableRow>
              )}

              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    データがありません
                  </TableCell>
                </TableRow>
              )}

              {items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>

                  <TableCell>
                    <Box
                      component="img"
                      src={item.image_url}
                      alt={item.title}
                      sx={{
                        width: 180,
                        height: 90,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                        bgcolor: "#fafafa",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>{item.title}</Typography>
                  </TableCell>

                  <TableCell>
                    {item.link_url ? (
                      <Link
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          wordBreak: "break-all",
                        }}
                      >
                        リンクを開く
                        <OpenInNewIcon sx={{ fontSize: 14 }} />
                      </Link>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      開始: {formatDateTime(item.start_at)}
                    </Typography>
                    <Typography variant="body2">
                      終了: {formatDateTime(item.end_at)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Switch
                        checked={item.is_active}
                        onChange={(e) =>
                          handleToggle(item.id, e.target.checked)
                        }
                      />
                      <Chip
                        size="small"
                        label={item.is_active ? "ON" : "OFF"}
                        color={item.is_active ? "primary" : "default"}
                        variant="outlined"
                      />
                    </Stack>
                  </TableCell>

                  <TableCell>{item.sort_order}</TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/home-banners/${item.id}/edit`)}
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
        </TableContainer>
      </Paper>
    </Box>
  );
}