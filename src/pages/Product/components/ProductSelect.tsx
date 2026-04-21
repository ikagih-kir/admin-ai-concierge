// ProductSelect.tsx
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Props = {
  products: { id: number; name: string }[];
  value: number | null;
  onChange: (v: number | null) => void;
};

const ProductSelect = ({ products, value, onChange }: Props) => {
  return (
    <FormControl fullWidth>
      <InputLabel>対象商品</InputLabel>
      <Select
        label="対象商品"
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value as unknown as string;
          onChange(raw === "" ? null : Number(raw));
        }}
      >
        <MenuItem value="">（未選択）</MenuItem>
        {products.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProductSelect;
