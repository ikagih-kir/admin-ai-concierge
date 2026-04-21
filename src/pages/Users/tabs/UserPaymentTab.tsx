import { useEffect, useState } from "react";
import { fetchUserPayment } from "../../../api/userDetail";
import { Box, Typography } from "@mui/material";

type Props = {
  userId: number;
};

const UserPaymentTab = ({ userId }: Props) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchUserPayment(userId).then(setData);
  }, [userId]);

  if (!data) return null;

  return (
    <Box>
      <Typography>決済ステータス：{data.payment_status}</Typography>
      <Typography>累計支払額：¥{data.total_payment}</Typography>
      <Typography>最終決済日：{data.last_payment_at ?? "-"}</Typography>
    </Box>
  );
};

export default UserPaymentTab;
