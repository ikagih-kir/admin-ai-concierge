// src/pages/Mail/MailListPage.tsx
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const dummyMails = [
  {
    id: 1,
    title: "【的中速報】今週も高配当！",
    status: "sent",
    sent_at: "2026-01-27",
  },
  {
    id: 2,
    title: "週末重賞の注目馬",
    status: "draft",
    sent_at: null,
  },
];

export default function MailListPage() {
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">メルマガ管理</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/mail/new")}
        >
          新規作成
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>件名</TableCell>
            <TableCell>状態</TableCell>
            <TableCell>送信日</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dummyMails.map((m) => (
            <TableRow
              key={m.id}
              hover
              onClick={() => navigate(`/mail/${m.id}`)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>{m.title}</TableCell>
              <TableCell>
                <Chip
                  label={m.status === "sent" ? "送信済" : "下書き"}
                  color={m.status === "sent" ? "success" : "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>{m.sent_at ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
