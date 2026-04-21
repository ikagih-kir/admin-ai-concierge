import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Stack,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "@mui/material";
import MailTargetUserModal from "../../components/Mail/MailTargetUserModal";



const MailSendPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mailId = params.get("id");

  const [tab, setTab] = useState(0);
  const [openTarget, setOpenTarget] = useState(false);


  // 仮データ（後でAPI接続）
  const mail = {
    subject: "【本日限定】激アツ情報解禁",
    type: "予約配信",
    sendAt: "2026/01/28 18:00",
    condition: "課金ユーザー",
    admin: "admin",
    bodyText:
      "こんにちは。\n本日は特別なご案内があります。\nぜひご確認ください。",
    bodyHtml: `<p>こんにちは。</p><p><strong>本日は特別なご案内</strong>があります。</p>`,
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        メルマガ配信確認
      </Typography>

      <Alert severity="warning" sx={{ mb: 2 }}>
        この操作は取り消せません。内容を必ず確認してください。
      </Alert>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>
          基本情報
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1}>
          <Typography>件名：{mail.subject}</Typography>
          <Typography>配信種別：{mail.type}</Typography>
          <Typography>配信日時：{mail.sendAt}</Typography>
          <Typography>
            配信対象：
            <Link
              component="button"
              underline="hover"
              sx={{ ml: 1 }}
              onClick={() => setOpenTarget(true)}
            >
              {mail.condition}
            </Link>
          </Typography>
          <MailTargetUserModal
            open={openTarget}
            onClose={() => setOpenTarget(false)}
            conditionName={mail.condition}
          />
          <Typography>作成者：{mail.admin}</Typography>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={1}>
          本文プレビュー
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="テキスト" />
          <Tab label="HTML" />
        </Tabs>

        <Box mt={2}>
          {tab === 0 && (
            <Typography
              whiteSpace="pre-wrap"
              sx={{ fontFamily: "monospace" }}
            >
              {mail.bodyText}
            </Typography>
          )}

          {tab === 1 && (
            <Box
              sx={{
                border: "1px solid #ddd",
                p: 2,
                borderRadius: 1,
              }}
              dangerouslySetInnerHTML={{ __html: mail.bodyHtml }}
            />
          )}
        </Box>
      </Paper>

      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={() => navigate(`/mail/create?id=${mailId}`)}
        >
          修正する
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => {
            if (
              window.confirm(
                "本当に配信しますか？この操作は取り消せません。"
              )
            ) {
              alert("※ここで配信APIを呼びます");
              navigate("/mail/reservations");
            }
          }}
        >
          配信する
        </Button>
      </Stack>
    </Box>
  );
};

export default MailSendPage;
