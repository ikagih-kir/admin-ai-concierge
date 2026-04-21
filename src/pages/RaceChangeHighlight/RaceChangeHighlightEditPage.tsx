import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  fetchRaceChangeHighlight,
  updateRaceChangeHighlight,
} from "@api/raceChangeHighlights";

export default function RaceChangeHighlightEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = Number(id);

  const [targetDate, setTargetDate] = useState("");
  const [raceName, setRaceName] = useState("");
  const [raceCourse, setRaceCourse] = useState("");
  const [horseName, setHorseName] = useState("");

  const [previousSurface, setPreviousSurface] = useState("");
  const [currentSurface, setCurrentSurface] = useState("");
  const [previousDistance, setPreviousDistance] = useState("");
  const [currentDistance, setCurrentDistance] = useState("");
  const [previousJockey, setPreviousJockey] = useState("");
  const [currentJockey, setCurrentJockey] = useState("");

  const [surfaceChanged, setSurfaceChanged] = useState(false);
  const [distanceChanged, setDistanceChanged] = useState(false);
  const [distanceDirection, setDistanceDirection] = useState("");
  const [gearChanged, setGearChanged] = useState(false);
  const [jockeyChanged, setJockeyChanged] = useState(false);
  const [classChanged, setClassChanged] = useState(false);

  const [changeSummary, setChangeSummary] = useState("");
  const [aiComment, setAiComment] = useState("");
  const [note, setNote] = useState("");
  const [impactLevel, setImpactLevel] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");
  const [isPublic, setIsPublic] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const item = await fetchRaceChangeHighlight(itemId);

        setTargetDate(item.target_date ?? "");
        setRaceName(item.race_name ?? "");
        setRaceCourse(item.race_course ?? "");
        setHorseName(item.horse_name ?? "");
        setPreviousSurface(item.previous_surface ?? "");
        setCurrentSurface(item.current_surface ?? "");
        setPreviousDistance(
          item.previous_distance != null ? String(item.previous_distance) : ""
        );
        setCurrentDistance(
          item.current_distance != null ? String(item.current_distance) : ""
        );
        setPreviousJockey(item.previous_jockey ?? "");
        setCurrentJockey(item.current_jockey ?? "");
        setSurfaceChanged(!!item.surface_changed);
        setDistanceChanged(!!item.distance_changed);
        setDistanceDirection(item.distance_direction ?? "");
        setGearChanged(!!item.gear_changed);
        setJockeyChanged(!!item.jockey_changed);
        setClassChanged(!!item.class_changed);
        setChangeSummary(item.change_summary ?? "");
        setAiComment(item.ai_comment ?? "");
        setNote(item.note ?? "");
        setImpactLevel(item.impact_level ?? "");
        setIsFeatured(!!item.is_featured);
        setSortOrder(String(item.sort_order ?? 0));
        setIsPublic(!!item.is_public);
      } catch (e: any) {
        setError(e?.response?.data?.detail ?? "データ取得に失敗しました");
      }
    };

    if (itemId) load();
  }, [itemId]);

  const handleSubmit = async () => {
    setError(null);

    if (!targetDate.trim()) {
      setError("対象日を入力してください");
      return;
    }
    if (!raceName.trim()) {
      setError("レース名を入力してください");
      return;
    }
    if (!horseName.trim()) {
      setError("馬名を入力してください");
      return;
    }

    try {
      await updateRaceChangeHighlight(itemId, {
        target_date: targetDate,
        race_name: raceName,
        race_course: raceCourse || undefined,
        horse_name: horseName,
        previous_surface: previousSurface || undefined,
        current_surface: currentSurface || undefined,
        previous_distance: previousDistance ? Number(previousDistance) : undefined,
        current_distance: currentDistance ? Number(currentDistance) : undefined,
        previous_jockey: previousJockey || undefined,
        current_jockey: currentJockey || undefined,
        surface_changed: surfaceChanged,
        distance_changed: distanceChanged,
        distance_direction: distanceDirection || undefined,
        gear_changed: gearChanged,
        jockey_changed: jockeyChanged,
        class_changed: classChanged,
        change_summary: changeSummary || undefined,
        ai_comment: aiComment || undefined,
        note: note || undefined,
        impact_level: impactLevel || undefined,
        is_featured: isFeatured,
        sort_order: Number(sortOrder),
        is_public: isPublic,
      });

      alert("条件変わり馬データを更新しました");
      navigate("/race-change-highlights");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "更新に失敗しました");
    }
  };

  return (
    <Box p={3} maxWidth={760}>
      <Typography variant="h5" mb={3}>
        条件変わり馬 編集
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="対象日"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <TextField
          label="レース名"
          value={raceName}
          onChange={(e) => setRaceName(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="開催/レース情報"
          value={raceCourse}
          onChange={(e) => setRaceCourse(e.target.value)}
          fullWidth
        />

        <TextField
          label="馬名"
          value={horseName}
          onChange={(e) => setHorseName(e.target.value)}
          required
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>前走馬場</InputLabel>
          <Select
            value={previousSurface}
            label="前走馬場"
            onChange={(e) => setPreviousSurface(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="turf">芝</MenuItem>
            <MenuItem value="dirt">ダート</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>今回馬場</InputLabel>
          <Select
            value={currentSurface}
            label="今回馬場"
            onChange={(e) => setCurrentSurface(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="turf">芝</MenuItem>
            <MenuItem value="dirt">ダート</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="前走距離"
          type="number"
          value={previousDistance}
          onChange={(e) => setPreviousDistance(e.target.value)}
          fullWidth
        />

        <TextField
          label="今回距離"
          type="number"
          value={currentDistance}
          onChange={(e) => setCurrentDistance(e.target.value)}
          fullWidth
        />

        <TextField
          label="前走騎手"
          value={previousJockey}
          onChange={(e) => setPreviousJockey(e.target.value)}
          fullWidth
        />

        <TextField
          label="今回騎手"
          value={currentJockey}
          onChange={(e) => setCurrentJockey(e.target.value)}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>距離変化方向</InputLabel>
          <Select
            value={distanceDirection}
            label="距離変化方向"
            onChange={(e) => setDistanceDirection(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="up">距離延長</MenuItem>
            <MenuItem value="down">距離短縮</MenuItem>
            <MenuItem value="same">同距離</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="変化要約"
          value={changeSummary}
          onChange={(e) => setChangeSummary(e.target.value)}
          fullWidth
        />

        <TextField
          label="AIコメント"
          value={aiComment}
          onChange={(e) => setAiComment(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          label="補足メモ"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>注目度</InputLabel>
          <Select
            value={impactLevel}
            label="注目度"
            onChange={(e) => setImpactLevel(e.target.value)}
          >
            <MenuItem value="">未設定</MenuItem>
            <MenuItem value="high">高</MenuItem>
            <MenuItem value="medium">中</MenuItem>
            <MenuItem value="low">低</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="表示順"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={surfaceChanged}
              onChange={(e) => setSurfaceChanged(e.target.checked)}
            />
          }
          label="芝ダート変更あり"
        />

        <FormControlLabel
          control={
            <Switch
              checked={distanceChanged}
              onChange={(e) => setDistanceChanged(e.target.checked)}
            />
          }
          label="距離変更あり"
        />

        <FormControlLabel
          control={
            <Switch
              checked={gearChanged}
              onChange={(e) => setGearChanged(e.target.checked)}
            />
          }
          label="馬具変更あり"
        />

        <FormControlLabel
          control={
            <Switch
              checked={jockeyChanged}
              onChange={(e) => setJockeyChanged(e.target.checked)}
            />
          }
          label="騎手変更あり"
        />

        <FormControlLabel
          control={
            <Switch
              checked={classChanged}
              onChange={(e) => setClassChanged(e.target.checked)}
            />
          }
          label="クラス変更あり"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
          }
          label="注目表示"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label="公開する"
        />

        {error && <Typography color="error">{error}</Typography>}

        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={handleSubmit}>
            更新
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/race-change-highlights")}
          >
            一覧に戻る
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}