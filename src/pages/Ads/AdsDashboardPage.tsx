import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { fetchAdsSummary } from "../../api/ads";

const KPI = ({ title, value }: { title: string; value: string | number }) => (
  <Card sx={{ minWidth: 180 }}>
    <CardContent>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </Card>
);

const AdsDashboardPage = () => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchAdsSummary().then(setSummary);
  }, []);

  if (!summary) return null;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        広告効果ダッシュボード
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        flexWrap="wrap"
      >
        <KPI title="広告費" value={`¥${summary.total_cost.toLocaleString()}`} />
        <KPI title="インストール" value={summary.total_installs} />
        <KPI title="売上" value={`¥${summary.total_revenue.toLocaleString()}`} />
        <KPI title="ROI" value={summary.roi} />
        <KPI title="決済エラー" value={summary.payment_errors} />
      </Stack>
    </Box>
  );
};

export default AdsDashboardPage;
