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
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { fetchProducts, updateProduct, deleteProduct } from "@api/products";
import { Product } from "@/types/product";

const ProductListPage = () => {
  const [items, setItems] = useState<Product[]>([]);
  const navigate = useNavigate();

  const load = async () => {
    const data = await fetchProducts();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔥 ON / OFF 切替
  const handleToggle = async (product: Product) => {
    await updateProduct(product.id, {
      is_active: !product.is_active,
    });
    await load(); // 安全に再取得
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("削除してもよろしいですか？")) return;
    await deleteProduct(id);
    await load();
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">無料予想管理</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/products/new")}
        >
          無料予想を作成
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>商品名</TableCell>
            <TableCell>価格</TableCell>
            <TableCell align="center">販売状態</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                opacity: row.is_active ? 1 : 0.4, // 👈 非公開は薄く
              }}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell>¥{row.price?.toLocaleString() ?? "-"}</TableCell>


              {/* 🔥 トグル */}
              <TableCell align="center">
                <Switch
                  checked={row.is_active}
                  color="success"
                  onChange={() => handleToggle(row)}
                />
              </TableCell>

              <TableCell align="right">
                <IconButton
                  onClick={() => navigate(`/products/${row.id}/edit`)}
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

export default ProductListPage;
