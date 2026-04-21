
import {
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";

type Props = {
  initial?: any;
  onSubmit: (data: any) => Promise<void>;
};




const HitResultForm = ({ initial, onSubmit }: Props) => {
  const [form, setForm] = useState({
    product_id: initial?.product_id ?? "",
    product_name: initial?.product_name ?? "",
    race_name: initial?.race_name ?? "",
    race_date: initial?.race_date ?? "",
    hit_amount: initial?.hit_amount ?? "",
    comment: initial?.comment ?? "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Stack spacing={2}>
        <TextField
          label="商品ID"
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
        />
        <TextField
          label="商品名"
          name="product_name"
          value={form.product_name}
          onChange={handleChange}
        />
        <TextField
          label="レース名"
          name="race_name"
          value={form.race_name}
          onChange={handleChange}
        />
        <TextField
          type="date"
          label="レース日"
          name="race_date"
          InputLabelProps={{ shrink: true }}
          value={form.race_date}
          onChange={handleChange}
        />
        <TextField
          label="的中金額"
          name="hit_amount"
          type="number"
          value={form.hit_amount}
          onChange={handleChange}
        />
        <TextField
          label="コメント"
          name="comment"
          multiline
          rows={3}
          value={form.comment}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          onClick={() => onSubmit(form)}
        >
          保存する
        </Button>
      </Stack>
    </Box>
  );
};

export default HitResultForm;


