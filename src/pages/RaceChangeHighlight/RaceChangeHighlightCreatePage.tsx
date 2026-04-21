import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { createRaceChangeHighlight } from "@api/raceChangeHighlights";

export default function RaceChangeHighlightCreatePage() {
  const navigate = useNavigate();

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
      await createRaceChangeHighlight({
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

      alert("条件変わり馬データを作成しました");
      navigate("/race-change-highlights");
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "保存に失敗しました");
    }
  };

  return (
    <Box p={3} maxWidth={760}>
      <Typography variant="h5" mb={3}>
        条件変わり馬 新規作成
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
          placeholder="例: 中京11R"
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
          placeholder="例: 芝→ダート替わり + 距離短縮"
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
            保存
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