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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  createFrameTrendInputsBatch,
  fetchFrameTrendInputs,
  fetchFrameTrends,
  deleteFrameTrendInputs,
} from "@api/frameTrends";
import {
  createJockeyTrend,
  deleteJockeyTrend,
  deleteJockeyTrendsByDateVenue,
  fetchJockeyTrends,
  JockeyTrendItem,
  MeetingType,
} from "@api/jockeyTrends";

// ─── 定数 ────────────────────────────────────────────────
const CENTRAL_VENUES = [
  "札幌", "函館", "福島", "新潟", "中山",
  "東京", "中京", "京都", "阪神", "小倉",
];
const LOCAL_VENUES = [
  "大井", "船橋", "川崎", "浦和", "門別",
  "名古屋", "笠松", "園田", "姫路", "高知",
  "佐賀", "金沢", "盛岡", "水沢",
];
const FRAME_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const RACE_NUMBERS = [1, 2, 3, 4, 5, 6];

// ─── 型 ──────────────────────────────────────────────────
type RaceInputRow = {
  raceNumber: number;
  winningFrame: number | "";
  jockeyName: string;
  horseName: string;
  memo: string;
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

// ─── ユーティリティ ──────────────────────────────────────
function buildInitialRows(): RaceInputRow[] {
  return RACE_NUMBERS.map((n) => ({
    raceNumber: n,
    winningFrame: "",
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

// ─── コンポーネント ──────────────────────────────────────
export default function TrendInputPage() {
  const navigate = useNavigate();

  // 共通条件
  const [meetingType, setMeetingType] = useState<MeetingType>("central");
  const [targetDate, setTargetDate] = useState(todayJstString());
  const [venue, setVenue] = useState(CENTRAL_VENUES[0]);

  // 入力行
  const [rows, setRows] = useState<RaceInputRow[]>(buildInitialRows());

  // 保存状態
  const [isSavingFrame, setIsSavingFrame] = useState(false);
  const [isSavingJockey, setIsSavingJockey] = useState(false);
  const [isDeletingFrame, setIsDeletingFrame] = useState(false);
  const [isDeletingJockey, setIsDeletingJockey] = useState(false);

  // 既存データ（騎手）
  const [existingJockeyItems, setExistingJockeyItems] = useState<JockeyTrendItem[]>([]);

  // 保存後スナップショット
  const [frameSnapshot, setFrameSnapshot] = useState<FrameTrend | null>(null);
  const [latestJockeyItems, setLatestJockeyItems] = useState<JockeyTrendItem[]>([]);

  // タブ（入力 / プレビュー）
  const [activeTab, setActiveTab] = useState(0);

  // スナックバー
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const venueOptions = useMemo(
    () => (meetingType === "central" ? CENTRAL_VENUES : LOCAL_VENUES),
    [meetingType]
  );

  const filledFrameRows = useMemo(
    () => rows.filter((row) => row.winningFrame !== ""),
    [rows]
  );

  const frameCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
    rows.forEach((row) => {
      if (row.winningFrame !== "") counts[row.winningFrame as number] += 1;
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
    return { luckyFrame: topFrames[0], hitCount: maxCount, totalRaces: filled.length };
  }, [frameCounts, rows]);

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
    return { jockeyName: entries[0][0], winCount: entries[0][1] };
  }, [jockeyCounts]);

  const filledJockeyRows = useMemo(
    () => rows.filter((row) => row.jockeyName.trim()),
    [rows]
  );

  const showMessage = (severity: "success" | "error", message: string) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // 既存データ（枠順・騎手）を読み込む
  const loadExistingInputData = async () => {
    if (!targetDate || !venue) return;

    try {
      const [frameData, jockeyData] = await Promise.all([
        fetchFrameTrendInputs({ target_date: targetDate, venue }),
        fetchJockeyTrends({ race_date: targetDate, meeting_type: meetingType, venue }),
      ]);

      setExistingJockeyItems(jockeyData);
      setLatestJockeyItems(jockeyData);

      const nextRows = buildInitialRows();

      frameData.forEach((item) => {
        const index = item.race_number - 1;
        if (index < 0 || index >= nextRows.length) return;

        nextRows[index] = {
          ...nextRows[index],
          winningFrame: item.winning_frame,
        };
      });

      jockeyData.forEach((item) => {
        const index = item.race_no - 1;
        if (index < 0 || index >= nextRows.length) return;

        nextRows[index] = {
          ...nextRows[index],
          jockeyName: item.jockey_name ?? "",
          horseName: item.horse_name ?? "",
          memo: item.memo ?? "",
        };
      });

      setRows(nextRows);
    } catch {
      // 読み込み失敗は無視（初回は空）
    }
  };

  useEffect(() => {
    loadExistingInputData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate, meetingType, venue]);

  const handleMeetingTypeChange = (value: MeetingType) => {
    setMeetingType(value);
    setVenue(value === "central" ? CENTRAL_VENUES[0] : LOCAL_VENUES[0]);
    setRows(buildInitialRows());
    setExistingJockeyItems([]);
    setLatestJockeyItems([]);
    setFrameSnapshot(null);
  };

  const handleRowChange = (
    raceNumber: number,
    key: keyof RaceInputRow,
    value: string | number | ""
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.raceNumber === raceNumber ? { ...row, [key]: value } : row
      )
    );
  };

  const handleReset = () => {
    setRows(buildInitialRows());
    setFrameSnapshot(null);
    setLatestJockeyItems([]);
  };

  const handleSample = () => {
    setRows([
      { raceNumber: 1, winningFrame: 3, jockeyName: "横山武史", horseName: "", memo: "" },
      { raceNumber: 2, winningFrame: 5, jockeyName: "川田将雅", horseName: "", memo: "" },
      { raceNumber: 3, winningFrame: 3, jockeyName: "横山武史", horseName: "", memo: "" },
      { raceNumber: 4, winningFrame: 1, jockeyName: "武豊", horseName: "", memo: "" },
      { raceNumber: 5, winningFrame: 3, jockeyName: "川田将雅", horseName: "", memo: "" },
      { raceNumber: 6, winningFrame: 7, jockeyName: "横山武史", horseName: "", memo: "" },
    ]);
  };

  // ── 枠順保存 ──────────────────────────────────────────
  const handleSaveFrame = async () => {
    if (filledFrameRows.length === 0) {
      showMessage("error", "1R〜6Rのうち、最低1件は枠を入力してください。");
      return;
    }
    setIsSavingFrame(true);
    try {
      await createFrameTrendInputsBatch({
        target_date: targetDate,
        venue,
        results: filledFrameRows.map((row) => ({
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
      setFrameSnapshot(matched);

      showMessage("success", "枠順トレンドを保存して自動集計しました。");
    } catch (e: any) {
      showMessage("error", e?.response?.data?.detail ?? "枠順の保存に失敗しました");
    } finally {
      setIsSavingFrame(false);
    }
  };

  // ── 騎手保存 ──────────────────────────────────────────
  const handleSaveJockey = async () => {
    if (filledJockeyRows.length === 0) {
      showMessage("error", "1R〜6Rのうち、最低1件は騎手名を入力してください。");
      return;
    }

    const ok =
      existingJockeyItems.length > 0
        ? window.confirm("既存データがあります。現在の入力内容で上書き保存しますか？")
        : true;
    if (!ok) return;

    setIsSavingJockey(true);
    try {
      for (const item of existingJockeyItems) {
        await deleteJockeyTrend(item.id);
      }
      for (const row of filledJockeyRows) {
        await createJockeyTrend({
          race_date: targetDate,
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

      const saved = await fetchJockeyTrends({ race_date: targetDate, meeting_type: meetingType, venue });
      setExistingJockeyItems(saved);
      setLatestJockeyItems(saved);

      showMessage("success", "騎手トレンドを保存しました。");
    } catch (e: any) {
      showMessage("error", e?.response?.data?.detail ?? "騎手の保存に失敗しました");
    } finally {
      setIsSavingJockey(false);
    }
  };

  // ── 両方まとめて保存 ─────────────────────────────────
  const handleSaveAll = async () => {
    if (filledFrameRows.length === 0 && filledJockeyRows.length === 0) {
      showMessage("error", "枠または騎手名を入力してください。");
      return;
    }
    if (filledFrameRows.length > 0) await handleSaveFrame();
    if (filledJockeyRows.length > 0) await handleSaveJockey();
  };

  // ── 枠順削除 ──────────────────────────────────────────
  const handleDeleteFrame = async () => {
    const ok = window.confirm(
      `${targetDate} / ${venue} の枠順トレンド入力データを削除します。\n本当に削除しますか？`
    );
    if (!ok) return;
    setIsDeletingFrame(true);
    try {
      await deleteFrameTrendInputs({ targetDate, venue });
      setRows((prev) => prev.map((r) => ({ ...r, winningFrame: "" })));
      setFrameSnapshot(null);
      showMessage("success", "枠順トレンド入力データを削除しました。");
    } catch (e: any) {
      showMessage("error", e?.response?.data?.detail ?? "削除に失敗しました。");
    } finally {
      setIsDeletingFrame(false);
    }
  };

  // ── 騎手削除 ──────────────────────────────────────────
  const handleDeleteJockey = async () => {
    const ok = window.confirm(
      `${targetDate} / ${venue} の騎手トレンドデータを削除します。\n本当に削除しますか？`
    );
    if (!ok) return;
    setIsDeletingJockey(true);
    try {
      await deleteJockeyTrendsByDateVenue({ raceDate: targetDate, meetingType, venue });
      setRows((prev) => prev.map((r) => ({ ...r, jockeyName: "", horseName: "", memo: "" })));
      setExistingJockeyItems([]);
      setLatestJockeyItems([]);
      showMessage("success", "騎手トレンドデータを削除しました。");
    } catch (e: any) {
      showMessage("error", e?.response?.data?.detail ?? "削除に失敗しました。");
    } finally {
      setIsDeletingJockey(false);
    }
  };

  const isSaving = isSavingFrame || isSavingJockey;
  const isDeleting = isDeletingFrame || isDeletingJockey;

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {/* ── ヘッダー ── */}
        <Box>
          <Typography variant="h5" mb={1}>
            枠順・騎手トレンド入力
          </Typography>
          <Typography variant="body2" color="text.secondary">
            1〜6Rの1着枠と1着騎手をまとめて入力できます。枠順・騎手はそれぞれ独立して保存されます。
          </Typography>
        </Box>

        {/* ── 共通条件 ── */}
        <Card>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="開催区分"
                value={meetingType}
                onChange={(e) => handleMeetingTypeChange(e.target.value as MeetingType)}
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
                slotProps={{ inputLabel: { shrink: true } }}
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
          </CardContent>
        </Card>

        {/* ── タブ ── */}
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="入力フォーム" />
          <Tab label="プレビュー・保存結果" />
        </Tabs>

        {/* ── 入力フォームタブ ── */}
        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Stack spacing={3}>
                {existingJockeyItems.length > 0 && (
                  <Alert severity="info" variant="outlined">
                    騎手データ {existingJockeyItems.length}件を読み込み済み（上書き保存されます）
                  </Alert>
                )}

                <Stack
                  direction="row"
                  sx={{ display: { xs: "none", md: "flex" } }}
                  spacing={2}
                >
                  <Box minWidth={60} />
                  <Box flex={1}><Typography variant="caption" color="text.secondary">1着枠</Typography></Box>
                  <Box flex={2}><Typography variant="caption" color="text.secondary">1着騎手</Typography></Box>
                  <Box flex={2}><Typography variant="caption" color="text.secondary">馬名（任意）</Typography></Box>
                  <Box flex={2}><Typography variant="caption" color="text.secondary">メモ（任意）</Typography></Box>
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
                      <Box minWidth={60}>
                        <Typography fontWeight={600}>{row.raceNumber}R</Typography>
                      </Box>

                      {/* 枠 */}
                      <TextField
                        select
                        label="1着枠"
                        value={row.winningFrame}
                        onChange={(e) =>
                          handleRowChange(
                            row.raceNumber,
                            "winningFrame",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        sx={{ flex: 1, minWidth: 110 }}
                      >
                        <MenuItem value="">未選択</MenuItem>
                        {FRAME_OPTIONS.map((frame) => (
                          <MenuItem key={frame} value={frame}>
                            {frame}枠
                          </MenuItem>
                        ))}
                      </TextField>

                      {/* 騎手 */}
                      <TextField
                        label="1着騎手"
                        placeholder="例：横山武史"
                        value={row.jockeyName}
                        onChange={(e) =>
                          handleRowChange(row.raceNumber, "jockeyName", e.target.value)
                        }
                        sx={{ flex: 2 }}
                      />

                      {/* 馬名 */}
                      <TextField
                        label="馬名（任意）"
                        placeholder="例：サンプルホース"
                        value={row.horseName}
                        onChange={(e) =>
                          handleRowChange(row.raceNumber, "horseName", e.target.value)
                        }
                        sx={{ flex: 2 }}
                      />

                      {/* メモ */}
                      <TextField
                        label="メモ（任意）"
                        value={row.memo}
                        onChange={(e) =>
                          handleRowChange(row.raceNumber, "memo", e.target.value)
                        }
                        sx={{ flex: 2 }}
                      />
                    </Stack>
                  ))}
                </Stack>

                <Divider />

                {/* アクションボタン */}
                <Stack spacing={2}>
                  <Alert severity="warning" variant="outlined">
                    削除すると、枠順・騎手それぞれのデータと集計結果が削除されます。
                  </Alert>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button variant="outlined" onClick={handleSample}>
                      サンプル入力
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={handleReset}>
                      リセット
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveAll}
                      disabled={isSaving || isDeleting}
                    >
                      {isSaving ? "保存中..." : "枠順・騎手をまとめて保存"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSaveFrame}
                      disabled={isSaving || isDeleting}
                    >
                      {isSavingFrame ? "保存中..." : "枠順のみ保存"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleSaveJockey}
                      disabled={isSaving || isDeleting}
                    >
                      {isSavingJockey ? "保存中..." : "騎手のみ保存"}
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteFrame}
                      disabled={isSaving || isDeleting}
                    >
                      {isDeletingFrame ? "削除中..." : "枠順データを削除"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDeleteJockey}
                      disabled={isSaving || isDeleting}
                    >
                      {isDeletingJockey ? "削除中..." : "騎手データを削除"}
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => navigate("/frame-trends")}>
                      枠順トレンド一覧
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/jockey-trends")}>
                      騎手トレンド一覧
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* ── プレビュータブ ── */}
        {activeTab === 1 && (
          <Stack spacing={3}>
            {/* 枠順プレビュー */}
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  枠順 入力プレビュー
                </Typography>
                {previewLucky ? (
                  <Stack spacing={1}>
                    <Typography>
                      仮ラッキー枠: <b>{previewLucky.luckyFrame}枠</b>
                    </Typography>
                    <Typography color="text.secondary">
                      {previewLucky.totalRaces}レース中、{previewLucky.luckyFrame}枠が{previewLucky.hitCount}勝
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      集計内訳:{" "}
                      {Object.entries(frameCounts).map(([f, c]) => `${f}枠:${c}`).join(" / ")}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">まだ枠の入力がありません。</Typography>
                )}
              </CardContent>
            </Card>

            {/* 枠順保存結果 */}
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  枠順 保存後の集計結果
                </Typography>
                {frameSnapshot ? (
                  <Stack spacing={1.5}>
                    <Typography>タイトル: <b>{frameSnapshot.title}</b></Typography>
                    <Typography>
                      ラッキー枠:{" "}
                      <b>{frameSnapshot.lucky_frame ? `${frameSnapshot.lucky_frame}枠` : "未判定"}</b>
                    </Typography>
                    <Typography>要約: {frameSnapshot.trend_summary ?? "-"}</Typography>
                    <Typography>補足: {frameSnapshot.trend_note ?? "-"}</Typography>
                    <Typography>サンプル数: {frameSnapshot.sample_size ?? 0}</Typography>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">まだ保存後の結果はありません。</Typography>
                )}
              </CardContent>
            </Card>

            {/* 騎手プレビュー */}
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  騎手 入力プレビュー
                </Typography>
                {previewTopJockey ? (
                  <Stack spacing={1}>
                    <Typography>
                      仮注目騎手: <b>{previewTopJockey.jockeyName}</b>
                    </Typography>
                    <Typography color="text.secondary">
                      1〜6R内で {previewTopJockey.winCount}勝
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      集計内訳:{" "}
                      {Object.entries(jockeyCounts).map(([n, c]) => `${n}:${c}勝`).join(" / ")}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">まだ騎手名の入力がありません。</Typography>
                )}
              </CardContent>
            </Card>

            {/* 騎手保存結果 */}
            <Card>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  騎手 保存済みデータ
                </Typography>
                {latestJockeyItems.length > 0 ? (
                  <Stack spacing={1}>
                    {latestJockeyItems.map((item) => (
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
        )}
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
