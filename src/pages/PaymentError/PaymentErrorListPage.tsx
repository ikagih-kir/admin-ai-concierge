import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchPaymentErrors,
  resolvePaymentError,
} from "../../api/paymentError";

const PaymentErrorListPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const res = await fetchPaymentErrors();
    setItems(res.items);
  };

  useEffect(() => {
    load();
  }, []);

  const handleResolve = async (id: number) => {
    if (!window.confirm("この決済エラーを対応済みにしますか？")) return;
    await resolvePaymentError(id);
    load();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        決済エラー管理
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ユーザー</TableCell>
            <TableCell>エラー内容</TableCell>
            <TableCell>金額</TableCell>
            <TableCell>発生日時</TableCell>
            <TableCell>状態</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((e) => (
            <TableRow key={e.id}>
              <TableCell>
                {e.email}
                <br />
                <small>ID: {e.user_id}</small>
              </TableCell>

              <TableCell>
                <b>{e.error_code}</b>
                <br />
                {e.error_message}
              </TableCell>

              <TableCell>
                ¥{e.amount.toLocaleString()}
              </TableCell>

              <TableCell>{e.occurred_at}</TableCell>

              <TableCell>
                <Chip
                  label={e.status}
                  color={e.status === "unresolved" ? "error" : "success"}
                  size="small"
                />
              </TableCell>

              <TableCell>
                <Button
                  size="small"
                  onClick={() => navigate(`/payment-errors/${e.id}`)}
                >
                  詳細
                </Button>

                {e.status === "unresolved" && (
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => handleResolve(e.id)}
                  >
                    対応済み
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PaymentErrorListPage;
