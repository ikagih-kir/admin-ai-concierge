import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";

const MailAutoPage = () => {
  const [enabled, setEnabled] = useState(true);
  const [name, setName] = useState("未ログイン7日フォロー");
  const [template, setTemplate] = useState("休眠ユーザー掘り起こし");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("自動メルマガ設定を保存しました");
    }, 800);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        自動メルマガ設定
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 900 }}>
        <Stack spacing={3}>
          {/* ===== 基本設定 ===== */}
          <Box>
            <Typography variant="h6" mb={1}>
              基本設定
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="自動メルマガ名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ width: 320 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                  />
                }
                label={enabled ? "有効" : "無効"}
              />
            </Stack>
          </Box>

          <Divider />

          {/* ===== 発火条件 ===== */}
          <Box>
            <Typography variant="h6" mb={1}>
              発火条件
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="ログインから7日以上経過"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="課金履歴がない"
              />
              <FormControlLabel
                control={<Checkbox />}
                label="最終配信から3日以上"
              />
            </FormGroup>
          </Box>

          <Divider />

          {/* ===== 送信タイミング ===== */}
          <Box>
            <Typography variant="h6" mb={1}>
              送信タイミング
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="送信タイミング"
                defaultValue="翌日"
                sx={{ width: 200 }}
              >
                <MenuItem value="即時">即時</MenuItem>
                <MenuItem value="翌日">翌日</MenuItem>
                <MenuItem value="3日後">3日後</MenuItem>
              </TextField>

              <TextField
                type="time"
                label="送信時刻"
                defaultValue="12:00"
                sx={{ width: 160 }}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Box>

          <Divider />

          {/* ===== テンプレ選択 ===== */}
          <Box>
            <Typography variant="h6" mb={1}>
              使用テンプレート
            </Typography>

            <TextField
              select
              label="HTMLテンプレート"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              sx={{ width: 360 }}
            >
              <MenuItem value="休眠ユーザー掘り起こし">
                休眠ユーザー掘り起こし
              </MenuItem>
              <MenuItem value="初課金促進テンプレ">
                初課金促進テンプレ
              </MenuItem>
              <MenuItem value="新規登録直後テンプレ">
                新規登録直後テンプレ
              </MenuItem>
            </TextField>
          </Box>

          {/* ===== 保存 ===== */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              size="large"
              disabled={saving}
              onClick={handleSave}
            >
              設定を保存
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MailAutoPage;
