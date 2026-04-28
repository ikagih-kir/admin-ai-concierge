import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  createJockeyTrend,
  deleteJockeyTrend,
  fetchJockeyTrends,
  JockeyTrendItem,
  MeetingType,
} from "@api/jockeyTrends";

const CENTRAL_VENUES = [
  "札幌",
  "函館",
  "福島",
  "新潟",
  "中山",
  "東京",
  "中京",
  "京都",
  "阪神",
  "小倉",
];

const LOCAL_VENUES = [
  "大井",
  "船橋",
  "川崎",
  "浦和",
  "門別",
  "名古屋",
  "笠松",
  "園田",
  "姫路",
  "高知",
  "佐賀",
  "金沢",
  "盛岡",
  "水沢",
];

type RaceInputRow = {
  raceNumber: number;
  jockeyName: string;
  horseName: string;
  memo: string;
};

function buildInitialRows(): RaceInputRow[] {
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    raceNumber: n,
    jockeyName: "",
    horseName: "",
    memo: "",
  }));
}

function todayJstString(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function JockeyTrendInputPage() {
  const navigate = useNavigate();

  const [meetingType, setMeetingType] = useState<MeetingType>("central");
  const [raceDate, setRaceDate] = useState(todayJstString());
  const [venue, setVenue] = useState(CENTRAL_VENUES[0]);
  const [rows, setRows] = useState<RaceInputRow[]>(buildInitialRows());

  const [existingItems, setExistingItems] = useState<JockeyTrendItem[]>([]);
  const [latestItems, setLatestItems] = useState<JockeyTrendItem[]>([]);

  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const venueOptions = useMemo(
    () => (meetingType === "central" ? CENTRAL_VENUES : LOCAL_VENUES),
    [meetingType]
  );

  const filledRows = useMemo(
    () => rows.filter((row) => row.jockeyName.trim()),
    [rows]
  );

  const jockeyCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    rows.forEach((row) => {
      const name = row.jockeyName.trim();
      if (!name) return;
      counts[name] = (counts[name] ?? 0) + 1;
    });

    return counts;
  }, [rows]);

  const previewTopJockey = useMemo(() => {
    const entries = Object.entries(jockeyCounts).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return null;

    return {
      jockeyName: entries[0][0],
      winCount: entries[0][1],
    };
  }, [jockeyCounts]);

  const showMessage = (severity: "success" | "error", message: string) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const loadExistingItems = async () => {
    if (!raceDate || !venue) return;

    setIsLoadingExisting(true);

    try {
      const data = await fetchJockeyTrends({
        race_date: raceDate,
        meeting_type: meetingType,
        venue,
      });

      setExistingItems(data);
      setLatestItems(data);

      const nextRows = buildInitialRows();

      data.forEach((item) => {
        const index = item.race_no - 1;
        if (index < 0 || index >= nextRows.length) return;

        nextRows[index] = {
          raceNumber: item.race_no,
          jockeyName: item.jockey_name ?? "",
          horseName: item.horse_name ?? "",
          memo: item.memo ?? "",
        };
      });

      setRows(nextRows);
    } catch (e: any) {
      showMessage(
        "error",
        e?.response?.data?.detail ?? "既存データの取得に失敗しました"
      );
    } finally {
      setIsLoadingExisting(false);
    }
  };

  useEffect(() => {
    loadExistingItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raceDate, meetingType, venue]);

  const handleMeetingTypeChange = (value: MeetingType) => {
    setMeetingType(value);
    setVenue(value === "central" ? CENTRAL_VENUES[0] : LOCAL_VENUES[0]);
    setExistingItems([]);
    setLatestItems([]);
    setRows(buildInitialRows());
  };

  const handleRowChange = (
    raceNumber: number,
    key: keyof RaceInputRow,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber ? { ...row, [key]: value } : row
      )
    );
  };

  const handleReset = () => {
    setRows(buildInitialRows());
    setLatestItems([]);
  };

  const handleSample = () => {
    setRows([
      { raceNumber: 1, jockeyName: "横山武史", horseName: "", memo: "" },
      { raceNumber: 2, jockeyName: "川田将雅", horseName: "", memo: "" },
      { raceNumber: 3, jockeyName: "横山武史", horseName: "", memo: "" },
      { raceNumber: 4, jockeyName: "武豊", horseName: "", memo: "" },
      { raceNumber: 5, jockeyName: "川田将雅", horseName: "", memo: "" },
      { raceNumber: 6, jockeyName: "横山武史", horseName: "", memo: "" },
    ]);
  };

  const handleSubmit = async () => {
    if (!raceDate) {
      showMessage("error", "対象日を入力してください。");
      return;
    }

    if (!venue.trim()) {
      showMessage("error", "競馬場を選択してください。");
      return;
    }

    if (filledRows.length === 0) {
      showMessage("error", "1R〜6Rのうち、最低1件は騎手名を入力してください。");
      return;
    }

    const ok =
      existingItems.length > 0
        ? window.confirm(
            "既存データがあります。現在の入力内容で上書き保存しますか？"
          )
        : true;

    if (!ok) return;

    setIsSaving(true);

    try {
      for (const item of existingItems) {
        await deleteJockeyTrend(item.id);
      }

      for (const row of filledRows) {
        await createJockeyTrend({
          race_date: raceDate,
          venue,
          meeting_type: meetingType,
          race_no: row.raceNumber,
          race_name: `${row.raceNumber}R`,
          jockey_name: row.jockeyName.trim(),
          horse_name: row.horseName.trim() || undefined,
          memo: row.memo.trim() || undefined,
          is_published: true,
        });
      }

      const saved = await fetchJockeyTrends({
        race_date: raceDate,
        meeting_type: meetingType,
        venue,
      });

      setExistingItems(saved);
      setLatestItems(saved);

      showMessage("success", "騎手トレンドを保存しました。");
    } catch (e: any) {
      showMessage("error", e?.response?.data?.detail ?? "保存に失敗しました");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" mb={1}>
            騎手トレンド入力
          </Typography>
          <Typography variant="body2" color="text.secondary">
            開催区分・対象日・競馬場を選ぶと、既存データがあれば自動で読み込みます。
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  select
                  label="開催区分"
                  value={meetingType}
                  onChange={(e) =>
                    handleMeetingTypeChange(e.target.value as MeetingType)
                  }
                  fullWidth
                >
                  <MenuItem value="central">中央競馬</MenuItem>
                  <MenuItem value="local">地方競馬</MenuItem>
                </TextField>

                <TextField
                  label="対象日"
                  type="date"
                  value={raceDate}
                  onChange={(e) => setRaceDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                <TextField
                  select
                  label="競馬場"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  fullWidth
                >
                  {venueOptions.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={loadExistingItems}
                  disabled={isLoadingExisting}
                >
                  {isLoadingExisting ? "読み込み中..." : "既存データ再読み込み"}
                </Button>

                {existingItems.length > 0 && (
                  <Typography color="success.main" alignSelf="center">
                    既存データ {existingItems.length}件を読み込み済み
                  </Typography>
                )}
              </Stack>

              <Divider />

              <Stack spacing={2}>
                {rows.map((row) => (
                  <Stack
                    key={row.raceNumber}
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", md: "center" }}
                  >
                    <Box minWidth={80}>
                      <Typography fontWeight={600}>
                        {row.raceNumber}R
                      </Typography>
                    </Box>

                    <TextField
                      label="1着騎手"
                      placeholder="例：横山武史"
                      value={row.jockeyName}
                      onChange={(e) =>
                        handleRowChange(
                          row.raceNumber,
                          "jockeyName",
                          e.target.value
                        )
                      }
                      fullWidth
                    />

                    <TextField
                      label="馬名（任意）"
                      placeholder="例：サンプルホース"
                      value={row.horseName}
                      onChange={(e) =>
                        handleRowChange(
                          row.raceNumber,
                          "horseName",
                          e.target.value
                        )
                      }
                      fullWidth
                    />

                    <TextField
                      label="メモ（任意）"
                      value={row.memo}
                      onChange={(e) =>
                        handleRowChange(
                          row.raceNumber,
                          "memo",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </Stack>
                ))}
              </Stack>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="outlined" onClick={handleSample}>
                  サンプル入力
                </Button>

                <Button variant="outlined" color="inherit" onClick={handleReset}>
                  入力をクリア
                </Button>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "保存中..."
                    : existingItems.length > 0
                    ? "上書き保存する"
                    : "保存する"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/jockey-trends")}
                >
                  一覧に戻る
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              入力プレビュー
            </Typography>

            {previewTopJockey ? (
              <Stack spacing={1}>
                <Typography>
                  仮注目騎手: <b>{previewTopJockey.jockeyName}</b>
                </Typography>
                <Typography color="text.secondary">
                  1〜6R内で {previewTopJockey.winCount}勝しています。
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  集計内訳:{" "}
                  {Object.entries(jockeyCounts)
                    .map(([name, count]) => `${name}:${count}勝`)
                    .join(" / ")}
                </Typography>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                まだ入力がありません。
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              保存済みデータ
            </Typography>

            {latestItems.length > 0 ? (
              <Stack spacing={1}>
                {latestItems.map((item) => (
                  <Typography key={item.id}>
                    {item.race_no}R：<b>{item.jockey_name}</b>
                    {item.horse_name ? ` / ${item.horse_name}` : ""}
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                この条件の保存済みデータはありません。
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}