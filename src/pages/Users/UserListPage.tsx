import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../api/users";

const UserListPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    const res = await fetchUsers({ q });
    setUsers(res.items);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        ユーザー一覧
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="検索（ID / メール / ニックネーム）"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          fullWidth
        />
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>ニックネーム</TableCell>
            <TableCell>メール</TableCell>
            <TableCell>登録状態</TableCell>
            <TableCell>課金</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((u) => (
            <TableRow
              key={u.id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/users/${u.id}`)}
            >
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.nickname}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.register_status}</TableCell>
              <TableCell>
                ¥{u.total_payment.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UserListPage;
