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
  Paper,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchArticles, deleteArticle, toggleArticlePublic } from "@api/articles";

type Article = {
  id: number;
  title: string;
  slug: string;
  category?: string | null;
  excerpt?: string | null;
  thumbnail_url?: string | null;
  banner_url?: string | null;
  is_featured: boolean;
  is_public: boolean;
  sort_order: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export default function ArticleListPage() {
  const [items, setItems] = useState<Article[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await fetchArticles();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("この記事を削除してもよろしいですか？")) return;
    await deleteArticle(id);
    await load();
  };

  const handleTogglePublic = async (id: number, checked: boolean) => {
    try {
      await toggleArticlePublic(id, checked);
      setItems((prev) =>
        prev.map((article) =>
          article.id === id ? { ...article, is_public: checked } : article
        )
      );
    } catch (e) {
      alert("公開状態の更新に失敗しました");
    }
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            記事管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            比較記事・攻略記事・コラムなどを管理します
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/articles/new")}
        >
          新規作成
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: "1px solid #e0e0e0", overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={70}>ID</TableCell>
              <TableCell>記事情報</TableCell>
              <TableCell width={120}>カテゴリ</TableCell>
              <TableCell width={90}>表示順</TableCell>
              <TableCell width={110}>注目</TableCell>
              <TableCell width={150}>公開状態</TableCell>
              <TableCell width={170}>公開日時</TableCell>
              <TableCell width={140} align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box py={4}>
                    <Typography color="text.secondary">
                      記事がまだ登録されていません
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              items.map((article) => (
                <TableRow key={article.id} hover>
                  <TableCell>{article.id}</TableCell>

                  <TableCell>
                    <Box>
                      <Typography fontWeight={600}>
                        {article.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        slug: {article.slug}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 360,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {article.excerpt || "抜粋文未設定"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {article.category || "-"}
                  </TableCell>

                  <TableCell>{article.sort_order}</TableCell>

                  <TableCell>
                    {article.is_featured ? (
                      <Chip label="注目" color="primary" size="small" />
                    ) : (
                      <Chip label="通常" variant="outlined" size="small" />
                    )}
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={article.is_public}
                        onChange={(_, checked) =>
                          handleTogglePublic(article.id, checked)
                        }
                      />
                      {article.is_public ? (
                        <Chip label="公開中" color="success" size="small" />
                      ) : (
                        <Chip label="非公開" color="default" size="small" />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    {article.published_at
                      ? new Date(article.published_at).toLocaleString()
                      : "-"}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/articles/${article.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(article.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}