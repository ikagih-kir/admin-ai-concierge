import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  Stack,
} from "@mui/material";

type HtmlTemplate = {
  id: number;
  title: string;
  category: string;
  html: string;
  updated_at: string;
};

const MOCK_TEMPLATES: HtmlTemplate[] = [
  {
    id: 1,
    title: "新規登録直後テンプレ",
    category: "新規",
    updated_at: "2025-01-10",
    html: `<h2>ご登録ありがとうございます！</h2><p>まずはこちらをご覧ください。</p>`,
  },
  {
    id: 2,
    title: "初課金促進テンプレ",
    category: "課金",
    updated_at: "2025-01-12",
    html: `<h2>今だけ限定情報</h2><p>本日限定の勝負レースはこちら。</p>`,
  },
  {
    id: 3,
    title: "休眠ユーザー掘り起こし",
    category: "再アクティブ",
    updated_at: "2025-01-15",
    html: `<h2>最近ログインされていません</h2><p>最新の的中実績を公開中。</p>`,
  },
];

const MailHtmlTemplatePage = () => {
  const [selected, setSelected] = useState<HtmlTemplate | null>(
    MOCK_TEMPLATES[0]
  );

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.html);
    alert("HTMLをコピーしました");
  };

  return (
    <Box p={3} display="flex" gap={3}>
      {/* ===== 左：テンプレ一覧 ===== */}
      <Box width={320}>
        <Typography variant="h6" mb={1}>
          HTMLテンプレ一覧
        </Typography>

        <Paper variant="outlined">
          <List>
            {MOCK_TEMPLATES.map((tpl) => (
              <ListItemButton
                key={tpl.id}
                selected={selected?.id === tpl.id}
                onClick={() => setSelected(tpl)}
              >
                <ListItemText
                  primary={tpl.title}
                  secondary={`${tpl.category} / 更新日 ${tpl.updated_at}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Box>

      {/* ===== 右：プレビュー ===== */}
      <Box flex={1}>
        <Typography variant="h6" mb={1}>
          プレビュー
        </Typography>

        {!selected ? (
          <Typography color="text.secondary">
            テンプレートを選択してください
          </Typography>
        ) : (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">
                {selected.title}
              </Typography>

              <Divider />

              {/* 疑似メール表示 */}
              <Box
                sx={{
                  border: "1px solid #ddd",
                  p: 2,
                  minHeight: 200,
                  backgroundColor: "#fafafa",
                }}
                dangerouslySetInnerHTML={{
                  __html: selected.html,
                }}
              />

              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleCopy}>
                  HTMLをコピー
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default MailHtmlTemplatePage;
