import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { fetchPaymentErrors } from "../../api/paymentError";
import { useNavigate } from "react-router-dom";

const PaymentErrorListPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [errorCode, setErrorCode] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentErrors({
      error_code: errorCode || undefined,
    }).then((res) => {
      setItems(res.items);
    });
  }, [errorCode]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        決済エラー管理
      </Typography>

      <Box mb={2}>
        <Select
          value={errorCode}
          onChange={(e) => setErrorCode(e.target.value)}
          size="small"
          displayEmpty
        >
          <MenuItem value="">全て</MenuItem>
          <MenuItem value="card_declined">カード拒否</MenuItem>
          <MenuItem value="insufficient_funds">残高不足</MenuItem>
          <MenuItem value="expired_card">カード期限切れ</MenuItem>
        </Select>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ユーザー</TableCell>
            <TableCell>エラー内容</TableCell>
            <TableCell>金額</TableCell>
            <TableCell>発生日時</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Chip label={row.error_code} color="error" size="small" />
                <Typography variant="body2">
                  {row.error_message}
                </Typography>
              </TableCell>
              <TableCell>¥{row.amount}</TableCell>
              <TableCell>{row.occurred_at}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  onClick={() => navigate(`/users/${row.user_id}`)}
                >
                  ユーザー詳細
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PaymentErrorListPage;
