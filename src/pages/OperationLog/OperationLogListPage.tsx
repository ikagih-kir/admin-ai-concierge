import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { fetchOperationLogs } from "../../api/operationLogs";
import {
  OPERATION_LOG_ACTION_META,
  DANGEROUS_ACTIONS,
} from "../../constants/operationLog";

type OperationLog = {
  id: number;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: number;
  detail?: string;
  created_at: string;
};

/** 🔹 日付グループ判定 */
const getDateGroup = (dateStr: string) => {
  const logDate = new Date(dateStr);
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  if (logDate >= todayStart) return "today";
  if (logDate >= yesterdayStart) return "yesterday";
  return "past";
};

const OperationLogListPage = () => {
  const [items, setItems] = useState<OperationLog[]>([]);
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetchOperationLogs({
      admin_email: email || undefined,
      action: action || undefined,
    });
    setItems(res.items);
    setLoaded(true);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  /** 🔹 日付ごとにグルーピング */
  const grouped = {
    today: items.filter((l) => getDateGroup(l.created_at) === "today"),
    yesterday: items.filter((l) => getDateGroup(l.created_at) === "yesterday"),
    past: items.filter((l) => getDateGroup(l.created_at) === "past"),
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        操作ログ
      </Typography>

      {/* フィルタ */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="管理者Email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={load}
        />
        <TextField
          label="Action"
          size="small"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          onBlur={load}
        />
      </Box>

      {/* ✅ STEP2：ローディング表示 */}
      {loading && (
        <Typography color="text.secondary" mb={1}>
          読み込み中...
        </Typography>
      )}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>日時</TableCell>
            <TableCell>管理者</TableCell>
            <TableCell>操作</TableCell>
            <TableCell>対象</TableCell>
            <TableCell>詳細</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {/* ✅ STEP1：初期データなしUI */}
          {loaded && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography
                  align="center"
                  color="text.secondary"
                  py={4}
                >
                  操作ログはまだありません
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {[
            { key: "today", label: "🟢 今日", logs: grouped.today },
            { key: "yesterday", label: "🟡 昨日", logs: grouped.yesterday },
            { key: "past", label: "⚪ 過去", logs: grouped.past },
          ].map(
            (section) =>
              section.logs.length > 0 && (
                <tbody key={section.key}>
                  {/* 🔸 セクション見出し */}
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography fontWeight="bold" mt={2}>
                        {section.label}
                      </Typography>
                    </TableCell>
                  </TableRow>

                  {section.logs.map((log) => {
                    const meta = OPERATION_LOG_ACTION_META[log.action];
                    const isDanger = DANGEROUS_ACTIONS.includes(log.action);

                    return (
                      <TableRow key={log.id}>
                        {/* ✅ STEP3-① 日時フォーマット */}
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>

                        <TableCell>{log.admin_email}</TableCell>

                        {/* Action 表示 */}
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {meta?.icon}
                            <Typography
                              fontWeight={isDanger ? "bold" : "normal"}
                              color={isDanger ? "error" : "text.primary"}
                            >
                              {meta?.label ?? log.action}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          {log.target_type} #{log.target_id}
                        </TableCell>

                        {/* ✅ STEP3-② detail 空対応 */}
                        <TableCell>
                          {log.detail || (
                            <Typography
                              color="text.secondary"
                              fontSize={12}
                            >
                              （詳細なし）
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </tbody>
              )
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default OperationLogListPage;
