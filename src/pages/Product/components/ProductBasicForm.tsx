import { Stack, TextField } from "@mui/material";
import { ProductForm } from "@/types/product";

type Props = {
  value: ProductForm;
  onChange: (next: ProductForm) => void;
};

const ProductBasicForm = ({ value, onChange }: Props) => {
  const update = <K extends keyof ProductForm>(key: K, val: ProductForm[K]) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="無料予想タイトル"
        value={value.name}
        onChange={(e) => update("name", e.target.value)}
        fullWidth
      />

      <TextField
        label="説明文"
        value={value.description}
        onChange={(e) => update("description", e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      <TextField
        label="本文"
        value={value.body}
        onChange={(e) => update("body", e.target.value)}
        multiline
        rows={8}
        fullWidth
      />

      <TextField
        label="価格"
        type="number"
        value={value.price}
        onChange={(e) => update("price", Number(e.target.value))}
        fullWidth
      />
    </Stack>
  );
};

export default ProductBasicForm;