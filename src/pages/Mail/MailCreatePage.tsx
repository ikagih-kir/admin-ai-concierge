import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stack,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

import { MailForm } from "@/types/mail";
import { ProductOption } from "@/types/product";
import { fetchProducts } from "@/api/products";
import ProductSelect from "../Product/components/ProductSelect";

const TEMPLATES = {
  none: "",
  wakeup: `<h2>お久しぶりです</h2><p>最近ログインがありませんが、<br/>今週の注目レースはこちら！</p>`,
  firstPay: `<h2>初回限定のご案内</h2><p>今だけ使える特典ポイントを配布中です。</p>`,
};

const MailCreatePage = () => {
  // ===== state =====
  const [form, setForm] = useState<MailForm>({
    title: "",
    body: "",
    product_id: null,
  });

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [mailType, setMailType] = useState("normal");
  const [templateKey, setTemplateKey] = useState<keyof typeof TEMPLATES>("none");
  const [html, setHtml] = useState("");
  const [tab, setTab] = useState(0);

  // ===== 商品一覧取得 =====
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const handleTemplateChange = (key: keyof typeof TEMPLATES) => {
    setTemplateKey(key);
    setHtml(TEMPLATES[key]);
    setForm({ ...form, body: TEMPLATES[key] });
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        メルマガ作成
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* ===== 基本情報 ===== */}
          <Box>
            <Typography variant="h6" mb={1}>
              基本情報
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                label="件名"
                fullWidth
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <TextField
                select
                label="配信種別"
                value={mailType}
                onChange={(e) => setMailType(e.target.value)}
                sx={{ width: 200 }}
              >
                <MenuItem value="normal">通常メルマガ</MenuItem>
                <MenuItem value="auto">自動メルマガ</MenuItem>
              </TextField>
            </Stack>
          </Box>

          {/* ===== 対象商品 ===== */}
          <ProductSelect
            products={products}
            value={form.product_id}
            onChange={(v) => setForm({ ...form, product_id: v })}
          />

          <Divider />

          {/* ===== テンプレ選択 ===== */}
          <Box>
            <Typography variant="h6" mb={1}>
              HTMLテンプレート
            </Typography>

            <TextField
              select
              label="テンプレ選択"
              value={templateKey}
              onChange={(e) =>
                handleTemplateChange(
                  e.target.value as keyof typeof TEMPLATES
                )
              }
              sx={{ width: 360 }}
            >
              <MenuItem value="none">テンプレなし</MenuItem>
              <MenuItem value="wakeup">休眠ユーザー掘り起こし</MenuItem>
              <MenuItem value="firstPay">初課金促進テンプレ</MenuItem>
            </TextField>
          </Box>

          <Divider />

          {/* ===== 編集 / プレビュー ===== */}
          <Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="HTML編集" />
              <Tab label="プレビュー" />
            </Tabs>

            {tab === 0 && (
              <TextField
                multiline
                minRows={14}
                fullWidth
                value={html}
                onChange={(e) => {
                  setHtml(e.target.value);
                  setForm({ ...form, body: e.target.value });
                }}
                sx={{ mt: 2, fontFamily: "monospace" }}
              />
            )}

            {tab === 1 && (
              <Paper
                variant="outlined"
                sx={{ mt: 2, p: 2, backgroundColor: "#fafafa" }}
              >
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </Paper>
            )}
          </Box>

          <Divider />

          {/* ===== 操作 ===== */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined">下書き保存</Button>
            <Button variant="contained">配信 or 予約へ進む</Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MailCreatePage;
