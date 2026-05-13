import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import {
  deleteJockeyTrendsByDateVenue,
  fetchJockeyTrends,
  JockeyTrendItem,
  MeetingType,
} from "@api/jockeyTrends";

export default function JockeyTrendListPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<JockeyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchJockeyTrends();
      setItems(data);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "一覧取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);


  const meetingLabel = (value: MeetingType) => {
    return value === "central" ? "中央競馬" : "地方競馬";
  };

  const filteredItems = showPublicOnly
    ? items.filter((item) => item.is_published)
    : items;

  type JockeyTrendGroup = {
    key: string;
    race_date: string;
    venue: string;
    meeting_type: MeetingType;
    is_published: boolean;
    items: JockeyTrendItem[];
  };

  const groupedItems: JockeyTrendGroup[] = Object.values(
    filteredItems.reduce<Record<string, JockeyTrendGroup>>((acc, item) => {
      const venue = item.venue ?? "-";
      const key = `${item.race_date}_${item.meeting_type}_${venue}`;

      if (!acc[key]) {
        acc[key] = {
          key,
          race_date: item.race_date,
          venue,
          meeting_type: item.meeting_type,
          is_published: item.is_published,
          items: [],
        };
      }

      acc[key].items.push(item);

      if (item.is_published) {
        acc[key].is_published = true;
      }

      return acc;
    }, {})
  ).sort((a, b) => {
    const dateCompare =
      new Date(b.race_date).getTime() - new Date(a.race_date).getTime();

    if (dateCompare !== 0) return dateCompare;

    return a.venue.localeCompare(b.venue, "ja");
  });  

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h5">騎手トレンド 一覧</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            1〜6Rの勝利騎手を登録し、本日の好調騎手としてアプリに表示します。
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={load}>
            再読み込み
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/jockey-trends/input")}
          >
            1〜6R入力
          </Button>
        </Stack>
      </Stack>

      <Box mb={2}>
        <FormControlLabel
          control={
            <Switch
              checked={showPublicOnly}
              onChange={(e) => setShowPublicOnly(e.target.checked)}
            />
          }
          label="公開中のみ表示"
        />
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>対象日</TableCell>
              <TableCell>種別</TableCell>
              <TableCell>競馬場</TableCell>
              <TableCell>登録R</TableCell>
              <TableCell>1〜6R 勝利騎手</TableCell>
              <TableCell>公開</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  読み込み中...
                </TableCell>
              </TableRow>
            )}

            {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  データがありません
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              groupedItems.map((group) => {
                const sortedRaces = [...group.items].sort(
                  (a, b) => a.race_no - b.race_no
                );

                return (
                  <TableRow key={group.key}>
                    <TableCell>{group.race_date}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={meetingLabel(group.meeting_type)}
                        color={group.meeting_type === "central" ? "success" : "warning"}
                        variant="outlined"
                      />
                    </TableCell>
            
                    <TableCell>{group.venue}</TableCell>
            
                    <TableCell>{sortedRaces.length}件</TableCell>
            
                    <TableCell>
                      <Stack spacing={0.5}>
                        {sortedRaces.map((item) => (
                          <Typography key={item.id} variant="body2">
                            <strong>{item.race_no}R</strong>：{item.jockey_name}
                            {item.horse_name ? `（${item.horse_name}）` : ""}
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>
            
                    <TableCell>
                      <Chip
                        size="small"
                        label={group.is_published ? "公開あり" : "非公開"}
                        color={group.is_published ? "primary" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
            
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              `/jockey-trends/input?race_date=${group.race_date}&venue=${encodeURIComponent(
                                group.venue
                              )}&meeting_type=${group.meeting_type}`
                            )
                          }
                        >
                          編集
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={async () => {
                            const ok = window.confirm(
                              `${group.race_date} / ${group.venue} の騎手トレンドをまとめて削除します。\n\n月間勝利数ランキングや今年の月間No.1騎手の集計からも外れます。\n\n本当に削除しますか？`
                            );

                            if (!ok) return;

                            try {
                              await deleteJockeyTrendsByDateVenue({
                                raceDate: group.race_date,
                                meetingType: group.meeting_type,
                                venue: group.venue,
                              });
                        
                              await load();
                            } catch (e: any) {
                              alert(e?.response?.data?.detail ?? "削除に失敗しました");
                            }
                          }}
                        >
                          まとめて削除
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}