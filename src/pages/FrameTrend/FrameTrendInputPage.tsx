import { useMemo, useState } from "react";
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
  createFrameTrendInputsBatch,
  fetchFrameTrends,
} from "@api/frameTrends";

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

const FRAME_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

type MeetingType = "central" | "local";

type RaceInputRow = {
  raceNumber: number;
  winningFrame: number | "";
};

type FrameTrend = {
  id: number;
  target_date: string;
  title: string;
  race_scope?: string;
  lucky_frame?: number;
  trend_summary?: string;
  trend_note?: string;
  sample_size?: number;
  is_public?: boolean;
};

function buildInitialRows(): RaceInputRow[] {
  return [1, 2, 3, 4, 5, 6].map((n) => ({
    raceNumber: n,
    winningFrame: "",
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

export default function FrameTrendInputPage() {
  const navigate = useNavigate();

  const [meetingType, setMeetingType] = useState<MeetingType>("central");
  const [targetDate, setTargetDate] = useState(todayJstString());
  const [venue, setVenue] = useState(CENTRAL_VENUES[0]);
  const [rows, setRows] = useState<RaceInputRow[]>(buildInitialRows());
  const [isSaving, setIsSaving] = useState(false);

  const [latestSnapshot, setLatestSnapshot] = useState<FrameTrend | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const venueOptions = useMemo(
    () => (meetingType === "central" ? CENTRAL_VENUES : LOCAL_VENUES),
    [meetingType]
  );

  const allFilled = useMemo(
    () => rows.every((row) => row.winningFrame !== ""),
    [rows]
  );

  const frameCounts = useMemo(() => {
    const counts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    };

    rows.forEach((row) => {
      if (row.winningFrame !== "") {
        counts[row.winningFrame] += 1;
      }
    });

    return counts;
  }, [rows]);

  const previewLucky = useMemo(() => {
    const filled = rows.filter((row) => row.winningFrame !== "");
    if (filled.length === 0) return null;

    const maxCount = Math.max(...Object.values(frameCounts));
    const topFrames = Object.entries(frameCounts)
      .filter(([, count]) => count === maxCount)
      .map(([frame]) => Number(frame))
      .sort((a, b) => a - b);

    if (topFrames.length === 0) return null;

    return {
      luckyFrame: topFrames[0],
      hitCount: maxCount,
      totalRaces: filled.length,
    };
  }, [frameCounts, rows]);

  const handleMeetingTypeChange = (value: MeetingType) => {
    setMeetingType(value);
    setVenue(value === "central" ? CENTRAL_VENUES[0] : LOCAL_VENUES[0]);
    setLatestSnapshot(null);
  };

  const handleFrameChange = (raceNumber: number, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber
          ? {
              ...row,
              winningFrame: value === "" ? "" : Number(value),
            }
          : row
      )
    );
  };

  const handleReset = () => {
    setRows(buildInitialRows());
    setLatestSnapshot(null);
  };

  const handleSample = () => {
    setRows([
      { raceNumber: 1, winningFrame: 3 },
      { raceNumber: 2, winningFrame: 5 },
      { raceNumber: 3, winningFrame: 3 },
      { raceNumber: 4, winningFrame: 1 },
      { raceNumber: 5, winningFrame: 3 },
      { raceNumber: 6, winningFrame: 7 },
    ]);
  };

  const handleSubmit = async () => {
    if (!allFilled) {
      setSnackbarSeverity("error");
      setSnackbarMessage("1R〜6Rの枠をすべて入力してください。");
      setSnackbarOpen(true);
      return;
    }

    setIsSaving(true);

    try {
      await createFrameTrendInputsBatch({
        target_date: targetDate,
        venue,
        results: rows.map((row) => ({
          race_number: row.raceNumber,
          winning_frame: Number(row.winningFrame),
        })),
      });

      const snapshots = await fetchFrameTrends();
      const raceScope = `${venue}_1to6`;

      const matched =
        snapshots.find(
          (item: FrameTrend) =>
            item.target_date === targetDate && item.race_scope === raceScope
        ) ?? null;

      setLatestSnapshot(matched);

      setSnackbarSeverity("success");
      setSnackbarMessage("枠順トレンドを保存して自動集計しました。");
      setSnackbarOpen(true);
    } catch (e: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(e?.response?.data?.detail ?? "保存に失敗しました");
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" mb={1}>
            枠順トレンド入力
          </Typography>
          <Typography variant="body2" color="text.secondary">
            開催区分と競馬場を選んで、1〜6Rの1着枠を入力するとラッキー枠を自動集計します。
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
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
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

              <Divider />

              <Stack spacing={2}>
                {rows.map((row) => (
                  <Stack
                    key={row.raceNumber}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    <Box minWidth={80}>
                      <Typography fontWeight={600}>{row.raceNumber}R</Typography>
                    </Box>

                    <TextField
                      select
                      label="1着枠"
                      value={row.winningFrame}
                      onChange={(e) =>
                        handleFrameChange(row.raceNumber, e.target.value)
                      }
                      sx={{ minWidth: 180 }}
                    >
                      <MenuItem value="">未選択</MenuItem>
                      {FRAME_OPTIONS.map((frame) => (
                        <MenuItem key={frame} value={frame}>
                          {frame}枠
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                ))}
              </Stack>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="outlined" onClick={handleSample}>
                  サンプル入力
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleReset}>
                  リセット
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? "保存中..." : "保存して集計する"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/frame-trends")}
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

            {previewLucky ? (
              <Stack spacing={1}>
                <Typography>
                  仮ラッキー枠: <b>{previewLucky.luckyFrame}枠</b>
                </Typography>
                <Typography color="text.secondary">
                  {previewLucky.totalRaces}レース中、
                  {previewLucky.luckyFrame}枠が
                  {previewLucky.hitCount}勝です。
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  集計内訳:{" "}
                  {Object.entries(frameCounts)
                    .map(([frame, count]) => `${frame}枠:${count}`)
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
              保存後の集計結果
            </Typography>

            {latestSnapshot ? (
              <Stack spacing={1.5}>
                <Typography>
                  タイトル: <b>{latestSnapshot.title}</b>
                </Typography>
                <Typography>
                  ラッキー枠:{" "}
                  <b>
                    {latestSnapshot.lucky_frame
                      ? `${latestSnapshot.lucky_frame}枠`
                      : "未判定"}
                  </b>
                </Typography>
                <Typography>
                  要約: {latestSnapshot.trend_summary ?? "-"}
                </Typography>
                <Typography>
                  補足: {latestSnapshot.trend_note ?? "-"}
                </Typography>
                <Typography>
                  サンプル数: {latestSnapshot.sample_size ?? 0}
                </Typography>
                <Typography>
                  対象: {meetingType === "central" ? "中央競馬" : "地方競馬"} / {venue}
                </Typography>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                まだ保存後の結果はありません。
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