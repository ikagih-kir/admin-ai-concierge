import useSWR from 'swr';
import { fetchProducts } from "@api/products";


type Props = {
  value: number | null;
  onChange: (productId: number) => void;
};

export default function ProductSelect({ value, onChange }: Props) {
  const { data } = useSWR('/admin/products', fetchProducts);

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="">商品を選択してください</option>

      {data?.map((p: any) => (
        <option key={p.id} value={p.id}>
          {p.name}（¥{p.price.toLocaleString()}）
        </option>
      ))}
    </select>
  );
}
