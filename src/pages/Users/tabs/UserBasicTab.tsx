import { useEffect, useState } from "react";
import { fetchUserBasic } from "../../../api/userDetail";
import { Box, Typography } from "@mui/material";

type Props = {
  userId: number;
};

const UserBasicTab = ({ userId }: Props) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchUserBasic(userId).then(setData);
  }, [userId]);

  if (!data) return null;

  return (
    <Box>
      <Typography>Email：{data.email}</Typography>
      <Typography>ニックネーム：{data.nickname}</Typography>
      <Typography>登録状態：{data.register_status}</Typography>
      <Typography>最終アクセス：{data.last_access_at ?? "未ログイン"}</Typography>
      <Typography>登録日：{data.created_at}</Typography>
    </Box>
  );
};

export default UserBasicTab;
