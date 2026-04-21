import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Divider,
} from "@mui/material";

const MailConditionPage = () => {
  const [conditions, setConditions] = useState({
    paid: false,
    free: false,
    registered: false,
    tempRegistered: false,
    hasPayment: false,
    noPayment: false,
    hitExperience: false,
    minPayment: "",
    maxPayment: "",
    registeredFrom: "",
    registeredTo: "",
  });

  const handleChange = (key: string, value: any) => {
    setConditions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        メルマガ条件設定
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* ===== 会員条件 ===== */}
          <Box>
            <Typography variant="h6">会員条件</Typography>
            <Divider sx={{ my: 1 }} />

            <Stack direction="row" spacing={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={conditions.paid}
                    onChange={(e) =>
                      handleChange("paid", e.target.checked)
                    }
                  />
                }
                label="有料会員"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={conditions.free}
                    onChange={(e) =>
                      handleChange("free", e.target.checked)
                    }
                  />
                }
                label="無料会員"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={conditions.registered}
                    onChange={(e) =>
                      handleChange("registered", e.target.checked)
                    }
                  />
                }
                label="本登録"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={conditions.tempRegistered}
                    onChange={(e) =>
                      handleChange("tempRegistered", e.target.checked)
                    }
                  />
                }
                label="仮登録"
              />
            </Stack>

            <Stack direction="row" spacing={2} mt={2}>
              <TextField
                label="登録日（開始）"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={conditions.registeredFrom}
                onChange={(e) =>
                  handleChange("registeredFrom", e.target.value)
                }
              />
              <TextField
                label="登録日（終了）"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={conditions.registeredTo}
                onChange={(e) =>
                  handleChange("registeredTo", e.target.value)
                }
              />
            </Stack>
          </Box>

          {/* ===== 課金条件 ===== */}
          <Box>
            <Typography variant="h6">課金条件</Typography>
            <Divider sx={{ my: 1 }} />

            <Stack direction="row" spacing={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={conditions.hasPayment}
                    onChange={(e) =>
                      handleChange("hasPayment", e.target.checked)
                    }
                  />
                }
                label="課金経験あり"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={conditions.noPayment}
                    onChange={(e) =>
                      handleChange("noPayment", e.target.checked)
                    }
                  />
                }
                label="課金経験なし"
              />
            </Stack>

            <Stack direction="row" spacing={2} mt={2}>
              <TextField
                label="合計課金額（以上）"
                type="number"
                value={conditions.minPayment}
                onChange={(e) =>
                  handleChange("minPayment", e.target.value)
                }
              />
              <TextField
                label="合計課金額（以下）"
                type="number"
                value={conditions.maxPayment}
                onChange={(e) =>
                  handleChange("maxPayment", e.target.value)
                }
              />
            </Stack>
          </Box>

          {/* ===== 行動条件 ===== */}
          <Box>
            <Typography variant="h6">行動条件</Typography>
            <Divider sx={{ my: 1 }} />

            <FormControlLabel
              control={
                <Checkbox
                  checked={conditions.hitExperience}
                  onChange={(e) =>
                    handleChange("hitExperience", e.target.checked)
                  }
                />
              }
              label="的中経験あり"
            />
          </Box>

          <Divider />

          {/* 保存 */}
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained">
              条件を保存
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MailConditionPage;
