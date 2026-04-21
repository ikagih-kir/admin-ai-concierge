import { useEffect, useState } from "react";
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
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PauseIcon from "@mui/icons-material/Pause";
import { useNavigate } from "react-router-dom";

type MailReservation = {
  id: number;
  status: "draft" | "reserved" | "sent" | "stopped";
  type: "instant" | "scheduled" | "auto";
  subject: string;
  send_at: string;
  condition_name: string;
  admin_name: string;
  updated_at: string;
};

const statusChip = (status: MailReservation["status"]) => {
  switch (status) {
    case "draft":
      return <Chip label="下書き" color="warning" size="small" />;
    case "reserved":
      return <Chip label="予約中" color="info" size="small" />;
    case "sent":
      return <Chip label="配信済" color="success" size="small" />;
    case "stopped":
      return <Chip label="停止" color="error" size="small" />;
  }
};

const typeLabel = (type: MailReservation["type"]) => {
  switch (type) {
    case "instant":
      return "即時";
    case "scheduled":
      return "予約";
    case "auto":
      return "自動";
  }
};

const MailReservationListPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MailReservation[]>([]);

  useEffect(() => {
    // TODO: API接続
    setItems([
      {
        id: 1,
        status: "reserved",
        type: "scheduled",
        subject: "【本日限定】激アツ情報解禁",
        send_at: "2026/01/28 18:00",
        condition_name: "課金ユーザー",
        admin_name: "admin",
        updated_at: "2026/01/27 22:10",
      },
    ]);
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">配信予約一覧</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/mail/create")}
        >
          新規メルマガ作成
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>状態</TableCell>
            <TableCell>種別</TableCell>
            <TableCell>件名</TableCell>
            <TableCell>配信日時</TableCell>
            <TableCell>対象条件</TableCell>
            <TableCell>作成者</TableCell>
            <TableCell>更新日時</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{statusChip(row.status)}</TableCell>
              <TableCell>{typeLabel(row.type)}</TableCell>
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.send_at}</TableCell>
              <TableCell>{row.condition_name}</TableCell>
              <TableCell>{row.admin_name}</TableCell>
              <TableCell>{row.updated_at}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton
                    size="small"
                    onClick={() =>
                      navigate(`/mail/create?id=${row.id}`)
                    }
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() =>
                      navigate(`/mail/send?id=${row.id}`)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>

                  {row.status === "reserved" && (
                    <IconButton size="small" color="error">
                      <PauseIcon />
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default MailReservationListPage;
