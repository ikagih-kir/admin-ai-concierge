import { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchUserDetail } from "../../api/users";

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetchUserDetail(id).then(setUser);
  }, [id]);

  if (!user) return null;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        ユーザー詳細（ID: {id}）
      </Typography>

      <Stack spacing={1}>
        <Typography>ニックネーム：{user.nickname}</Typography>
        <Typography>メール：{user.email}</Typography>
        <Typography>登録状態：{user.register_status}</Typography>
        <Typography>課金状態：{user.payment_status}</Typography>
        <Typography>
          累計課金：¥{user.total_payment.toLocaleString()}
        </Typography>
      </Stack>
    </Box>
  );
};

export default UserDetailPage;
