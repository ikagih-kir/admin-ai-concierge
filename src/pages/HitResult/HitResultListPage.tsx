import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteHitResult } from "../../api/hitResult";
import { useNavigate } from "react-router-dom";
import { fetchHitResults } from "@api/hitResult";

/**
 * 🔽 JOIN後の型
 */
type HitResult = {
  id: number;
  race_name: string;
  hit_amount: number;
  created_at: string;
  product: {
    id: number;
    name: string;
  };
};

const HitResultListPage = () => {
  const [items, setItems] = useState<HitResult[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await fetchHitResults();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("削除してもよろしいですか？")) return;
    await deleteHitResult(id);
    await load();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">実績管理</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/hit-results/new")}
        >
          実績を作成
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>商品名</TableCell>
            <TableCell>レース</TableCell>
            <TableCell>日付</TableCell>
            <TableCell>的中金額</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id}>
              {/* 🟢 商品名（JOIN） */}
              <TableCell>{row.product.name}</TableCell>

              <TableCell>{row.race_name}</TableCell>

              <TableCell>
                {new Date(row.created_at).toLocaleDateString()}
              </TableCell>

              <TableCell>
                ¥{row.hit_amount.toLocaleString()}
              </TableCell>

              <TableCell align="right">
                <IconButton
                  onClick={() =>
                    navigate(`/hit-results/${row.id}/edit`)
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default HitResultListPage;
