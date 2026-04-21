import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Stack,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  conditionName: string;
};

const MailTargetUserModal = ({
  open,
  onClose,
  conditionName,
}: Props) => {
  // 仮データ（後でAPI接続）
  const data = {
    count: 1234,
    details: [
      "有料会員：ON",
      "退会ユーザー：除外",
      "最終ログイン：30日以内",
    ],
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>配信対象ユーザー確認</DialogTitle>

      <DialogContent>
        <Typography mb={1}>
          条件名：<strong>{conditionName}</strong>
        </Typography>

        <Typography mb={2}>
          対象人数：<strong>{data.count.toLocaleString()} 人</strong>
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" mb={1}>
          条件詳細
        </Typography>

        <Stack spacing={0.5}>
          {data.details.map((d, i) => (
            <Typography key={i} fontSize={14}>
              ・{d}
            </Typography>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MailTargetUserModal;
