import {
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from "@mui/material";

type Props = {
  isActive: boolean;
  isSoldOut: boolean;
  publishFrom?: string;
  publishTo?: string;
  soldOutAfter?: string;

  onChangeActive: (v: boolean) => void;
  onChangeSoldOut: (v: boolean) => void;
  onChangePublishFrom: (v: string) => void;
  onChangePublishTo: (v: string) => void;
  onChangeSoldOutAfter: (v: string) => void;
};

const ProductStatusBanner = ({
  isActive,
  isSoldOut,
  publishFrom,
  publishTo,
  soldOutAfter,
  onChangeActive,
  onChangeSoldOut,
  onChangePublishFrom,
  onChangePublishTo,
  onChangeSoldOutAfter,
}: Props) => {
  return (
    <Box
      border="1px solid #e0e0e0"
      borderRadius={2}
      p={2}
      bgcolor="#fafafa"
    >
      <Typography fontWeight="bold" mb={1}>
        キャンペーン情報
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        <Typography variant="body2">ID：自動付与</Typography>
        <Typography variant="body2">カテゴリー：未選択</Typography>
        <Typography variant="body2">更新日：—</Typography>

        <Divider />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => onChangeActive(e.target.checked)}
            />
          }
          label="公開する"
        />

        <Chip
          label={isActive ? "公開中" : "非公開"}
          color={isActive ? "success" : "default"}
          size="small"
        />

        <Divider />

        <Typography fontWeight="bold" variant="body2">
          公開期間
        </Typography>

        <TextField
          type="date"
          label="開始日"
          size="small"
          value={publishFrom ?? ""}
          onChange={(e) => onChangePublishFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          type="date"
          label="終了日"
          size="small"
          value={publishTo ?? ""}
          onChange={(e) => onChangePublishTo(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Divider />

        <Typography fontWeight="bold" variant="body2">
          完売設定
        </Typography>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={isSoldOut ? "sold" : "on_sale"}
          onChange={(_, v) => {
            if (!v) return;
            const nextIsSoldOut = v === "sold";
            onChangeSoldOut(nextIsSoldOut);

            // 販売中に戻したら完売日時は空にする
            if (!nextIsSoldOut) {
              onChangeSoldOutAfter("");
            }
          }}
        >
          <ToggleButton value="on_sale">販売中</ToggleButton>
          <ToggleButton value="sold">完売</ToggleButton>
        </ToggleButtonGroup>

        {isSoldOut && (
          <TextField
            type="date"
            label="完売日"
            size="small"
            value={soldOutAfter ?? ""}
            onChange={(e) => onChangeSoldOutAfter(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        )}
      </Stack>
    </Box>
  );
};

export default ProductStatusBanner;