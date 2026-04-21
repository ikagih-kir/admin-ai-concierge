import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPaymentErrorDetail,
  retryPayment,
  resolvePaymentError,
} from "../../api/paymentError";

const PaymentErrorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchPaymentErrorDetail(Number(id)).then(setData);
  }, [id]);

  if (!data) return null;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        決済エラー詳細
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">ユーザー</Typography>
        <Typography>{data.user.email}</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">エラー内容</Typography>
        <Typography>{data.error.code}</Typography>
        <Typography>{data.error.message}</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">金額</Typography>
        <Typography>¥{data.payment.amount}</Typography>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          disabled={loading}
          onClick={async () => {
            if (!window.confirm("再決済を実行しますか？")) return;

            setLoading(true);
            setResult(null);

            try {
              const res = await retryPayment(Number(id));
              setResult(res);
            } finally {
              setLoading(false);
            }
          }}
        >
          再決済
        </Button>
        {result && (
          <Paper
            sx={{
            p: 2,
              mt: 3,
              bgcolor: result.success ? "#e8f5e9" : "#fdecea",
            }}
          >
            <Typography
              color={result.success ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              {result.success ? "再決済成功" : "再決済失敗"}
            </Typography>

            <Typography>{result.message}</Typography>
          </Paper>
        )}


        <Button
          variant="outlined"
          onClick={async () => {
            await resolvePaymentError(Number(id));
            alert("対応済みにしました");
            navigate("/payment-errors");
          }}
        >
          対応済み
        </Button>
      </Stack>
    </Box>
  );
};

export default PaymentErrorDetailPage;
