import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import { fetchChatQuestionLogs, ChatQuestionLog } from "@api/chatQuestionLogs";

function formatDate(value?: string | null) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("ja-JP");
  } catch {
    return value;
  }
}

function yesNoChip(value: boolean, yesLabel: string, noLabel: string) {
  return (
    <Chip
      size="small"
      label={value ? yesLabel : noLabel}
      color={value ? "warning" : "default"}
      variant={value ? "filled" : "outlined"}
    />
  );
}

export default function ChatQuestionLogListPage() {
  const [items, setItems] = useState<ChatQuestionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // デフォルトON
  const [showNeedsImprovementOnly, setShowNeedsImprovementOnly] =
    useState(true);
  const [intentFilter, setIntentFilter] = useState("");
  const [answeredByFilter, setAnsweredByFilter] = useState("");
  const [keyword, setKeyword] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchChatQuestionLogs();
      setItems(data);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail ?? "質問ログ一覧の取得に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const intentOptions = useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item.intent).filter(Boolean))
    ) as string[];
  }, [items]);

  const answeredByOptions = useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item.answered_by).filter(Boolean))
    ) as string[];
  }, [items]);

  const intentCounts = useMemo(() => {
    const map = new Map<string, number>();

    items.forEach((item) => {
      const key = item.intent?.trim() || "unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    });

    return Array.from(map.entries())
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count);
  }, [items]);

  const needsImprovementCount = useMemo(() => {
    return items.filter((item) => item.needs_improvement).length;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (showNeedsImprovementOnly && !item.needs_improvement) {
        return false;
      }

      if (intentFilter && item.intent !== intentFilter) {
        return false;
      }

      if (answeredByFilter && item.answered_by !== answeredByFilter) {
        return false;
      }

      if (keyword.trim()) {
        const q = keyword.trim().toLowerCase();
        const haystack = [
          item.raw_question,
          item.normalized_question ?? "",
          item.intent ?? "",
          item.sub_intent ?? "",
          item.answered_by ?? "",
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [
    items,
    showNeedsImprovementOnly,
    intentFilter,
    answeredByFilter,
    keyword,
  ]);

  const clearFilters = () => {
    setShowNeedsImprovementOnly(false);
    setIntentFilter("");
    setAnsweredByFilter("");
    setKeyword("");
  };

  return (
    <Box p={3}>
      <Stack spacing={2} mb={3}>
        <Typography variant="h5">AIチャット質問ログ 一覧</Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Paper sx={{ p: 2, minWidth: 180 }}>
            <Typography variant="body2" color="text.secondary">
              総質問数
            </Typography>
            <Typography variant="h5">{items.length} 件</Typography>
          </Paper>

          <Paper sx={{ p: 2, minWidth: 180 }}>
            <Typography variant="body2" color="text.secondary">
              要改善
            </Typography>
            <Typography variant="h5" color="warning.main">
              {needsImprovementCount} 件
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, minWidth: 180 }}>
            <Typography variant="body2" color="text.secondary">
              表示件数
            </Typography>
            <Typography variant="h5">{filteredItems.length} 件</Typography>
          </Paper>
        </Stack>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" mb={1.5}>
            intent別件数
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`すべて (${items.length})`}
              color={intentFilter === "" ? "primary" : "default"}
              variant={intentFilter === "" ? "filled" : "outlined"}
              onClick={() => setIntentFilter("")}
            />

            {intentCounts.map((item) => (
              <Chip
                key={item.intent}
                label={`${item.intent} (${item.count})`}
                color={intentFilter === item.intent ? "primary" : "default"}
                variant={intentFilter === item.intent ? "filled" : "outlined"}
                onClick={() => setIntentFilter(item.intent)}
              />
            ))}
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="キーワード検索"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="質問文 / intent / answered_by"
            fullWidth
          />

          <TextField
            select
            label="intent絞り込み"
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">すべて</MenuItem>
            {intentOptions.map((intent) => (
              <MenuItem key={intent} value={intent}>
                {intent}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="answered_by絞り込み"
            value={answeredByFilter}
            onChange={(e) => setAnsweredByFilter(e.target.value)}
            fullWidth
          >
            <MenuItem value="">すべて</MenuItem>
            {answeredByOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showNeedsImprovementOnly}
                onChange={(e) => setShowNeedsImprovementOnly(e.target.checked)}
              />
            }
            label="改善必要な質問のみ表示"
          />

          <Chip
            label="フィルタをリセット"
            variant="outlined"
            onClick={clearFilters}
          />
        </Stack>
      </Stack>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>日時</TableCell>
              <TableCell>質問文</TableCell>
              <TableCell>正規化質問</TableCell>
              <TableCell>intent</TableCell>
              <TableCell>sub_intent</TableCell>
              <TableCell>answered_by</TableCell>
              <TableCell>faq_id</TableCell>
              <TableCell>回答成功</TableCell>
              <TableCell>改善必要</TableCell>
              <TableCell>feedback</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  質問ログがありません
                </TableCell>
              </TableRow>
            )}

            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{formatDate(item.created_at)}</TableCell>
                <TableCell sx={{ minWidth: 260 }}>{item.raw_question}</TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  {item.normalized_question ?? "-"}
                </TableCell>
                <TableCell>{item.intent ?? "-"}</TableCell>
                <TableCell>{item.sub_intent ?? "-"}</TableCell>
                <TableCell>{item.answered_by ?? "-"}</TableCell>
                <TableCell>{item.faq_id ?? "-"}</TableCell>
                <TableCell>
                  {yesNoChip(
                    item.is_answered_successfully,
                    "成功",
                    "失敗"
                  )}
                </TableCell>
                <TableCell>
                  {yesNoChip(
                    item.needs_improvement,
                    "要改善",
                    "通常"
                  )}
                </TableCell>
                <TableCell>{item.feedback_score ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}