import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

export default function MailScheduledPage() {
  return (
    <Box p={3}>
      <Typography variant="h5" mb={1}>定時メルマガ</Typography>
      <Typography color="text.secondary" mb={3}>
        毎日・毎週など定期配信されるメルマガ管理
      </Typography>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>配信頻度</TableCell>
              <TableCell>状態</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>毎朝メルマガ</TableCell>
              <TableCell>毎日 09:00</TableCell>
              <TableCell>有効</TableCell>
              <TableCell align="right">
                <Button size="small">編集</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
