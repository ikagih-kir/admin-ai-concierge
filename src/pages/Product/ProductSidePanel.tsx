// src/pages/Product/components/ProductSidePanel.tsx
import {
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  TextField,
  Button,
} from "@mui/material";

const ProductSidePanel = () => {
  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        キャンペーン状態
      </Typography>

      <Stack spacing={2}>
        {/* ID */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            ID
          </Typography>
          <Typography fontWeight="bold">自動付与</Typography>
        </Box>

        <Divider />

        {/* カテゴリー */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            キャンペーンカテゴリー
          </Typography>
          <Chip label="重賞予想" color="primary" size="small" />
        </Box>

        {/* 更新日時 */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            記事更新日時
          </Typography>
          <TextField
            type="datetime-local"
            size="small"
            fullWidth
          />
        </Box>

        <Divider />

        {/* 公開ステータス */}
        <FormControlLabel
          control={<Switch defaultChecked color="success" />}
          label="公開中"
        />

        {/* 公開期間 */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            公開期間
          </Typography>
          <Stack spacing={1}>
            <TextField
              type="date"
              size="small"
              fullWidth
              label="開始日"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              size="small"
              fullWidth
              label="終了日"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <Stack direction="row" spacing={1} mt={1}>
            <Button size="small" variant="outlined">
              今週土曜
            </Button>
            <Button size="small" variant="outlined">
              今週日曜
            </Button>
          </Stack>
        </Box>

        <Divider />

        {/* 完売フラグ */}
        <FormControlLabel
          control={<Switch color="warning" />}
          label="完売"
        />

        {/* 完売日時 */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            完売日時
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined">
              1日後
            </Button>
            <Button size="small" variant="outlined">
              2日後
            </Button>
            <Button size="small" variant="outlined">
              3日後
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProductSidePanel;
