import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Avatar,
  Link,
  Paper,
  Switch,
  TableContainer,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { fetchSites, deleteSite, toggleSitePublic } from "@api/sites";

type Site = {
  id: number;
  name: string;
  slug: string;
  catch_copy?: string | null;
  logo_url?: string | null;
  external_url: string;
  rating: number;
  review_count: number;
  sort_order: number;
  is_featured: boolean;
  is_recommended: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  style_type?: string | null;
  free_level?: string | null;
  prediction_type?: string | null;
};

export default function SiteListPage() {
  const [items, setItems] = useState<Site[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await fetchSites();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("この掲載サイトを削除してもよろしいですか？")) return;
    await deleteSite(id);
    await load();
  };

  const handleTogglePublic = async (id: number, checked: boolean) => {
    try {
      await toggleSitePublic(id, checked);
      setItems((prev) =>
        prev.map((site) =>
          site.id === id ? { ...site, is_public: checked } : site
        )
      );
    } catch (e) {
      alert("公開状態の更新に失敗しました");
    }
  };

  return (
    <Box p={3} sx={{ width: "100%", minWidth: 0 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        mb={2}
      >
        <Box minWidth={0}>
          <Typography variant="h5" fontWeight={700}>
            掲載サイト管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            掲載中の広告サイト・紹介サイトを管理します
          </Typography>
        </Box>

        <Button variant="contained" onClick={() => navigate("/sites/new")}>
          新規作成
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table size="small" sx={{ minWidth: 1280 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: "nowrap" }}>ID</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>ロゴ</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", minWidth: 320 }}>
                  サイト情報
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>評価</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>口コミ件数</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>表示順</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>注目</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>おすすめ</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", minWidth: 150 }}>
                  公開状態
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>スタイル</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>無料情報</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>予想タイプ</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }} align="right">
                  操作
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    <Box py={4}>
                      <Typography color="text.secondary">
                        掲載サイトがまだ登録されていません
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((site) => (
                  <TableRow key={site.id} hover>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{site.id}</TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Avatar
                        src={site.logo_url ?? undefined}
                        alt={site.name}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                      >
                        {site.name?.slice(0, 1)}
                      </Avatar>
                    </TableCell>

                    <TableCell sx={{ minWidth: 320, verticalAlign: "top" }}>
                      <Box minWidth={0}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {site.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{
                            mb: 0.5,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          slug: {site.slug}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: { xs: 220, sm: 320 },
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            mb: 0.5,
                          }}
                        >
                          {site.catch_copy || "キャッチコピー未設定"}
                        </Typography>

                        <Link
                          href={site.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: 13,
                            whiteSpace: "normal",
                            wordBreak: "break-all",
                          }}
                        >
                          外部サイトを開く
                          <OpenInNewIcon sx={{ fontSize: 14 }} />
                        </Link>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography fontWeight={600}>★ {site.rating}</Typography>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Typography>{site.review_count} 件</Typography>
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {site.sort_order}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {site.is_featured ? (
                        <Chip label="注目" color="primary" size="small" />
                      ) : (
                        <Chip label="通常" variant="outlined" size="small" />
                      )}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {site.is_recommended ? (
                        <Chip label="おすすめ" color="success" size="small" />
                      ) : (
                        <Chip label="通常" variant="outlined" size="small" />
                      )}
                    </TableCell>

                    <TableCell
                      sx={{ whiteSpace: "nowrap" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          checked={site.is_public}
                          onChange={(_, checked) =>
                            handleTogglePublic(site.id, checked)
                          }
                        />
                        {site.is_public ? (
                          <Chip label="公開中" color="success" size="small" />
                        ) : (
                          <Chip label="非公開" color="default" size="small" />
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell
                      sx={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {site.style_type || "-"}
                    </TableCell>

                    <TableCell
                      sx={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {site.free_level || "-"}
                    </TableCell>

                    <TableCell
                      sx={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {site.prediction_type || "-"}
                    </TableCell>

                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={0.5}
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/sites/${site.id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(site.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}