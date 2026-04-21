import { useState } from 'react';
import axios from 'axios';
import { createHitResult } from '@api/hitResult';
import ProductSelect from '@/components/common/ProductSelect';



export function HitResultForm({ onSuccess }: any) {
  const [productId, setProductId] = useState<number | null>(null);
  const [raceName, setRaceName] = useState('');
  const [hitAmount, setHitAmount] = useState('');
  const [image, setImage] = useState<File | null>(null);


  const submit = async () => {
    if (!productId) return alert('商品を選択してください');

    const form = new FormData();
    form.append('product_id', String(productId));
    form.append('race_name', raceName);
    form.append('hit_amount', hitAmount);
    if (image) form.append('image', image);

    await axios.post('/admin/hit-results', form);
    onSuccess();
  };


  return (
    <div>
      <h3>的中実績追加</h3>

      <ProductSelect value={productId} onChange={setProductId} />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />

      <input
        placeholder="レース名"
        value={raceName}
        onChange={(e) => setRaceName(e.target.value)}
      />

      <input
        placeholder="的中金額"
        value={hitAmount}
        onChange={(e) => setHitAmount(e.target.value)}
      />

      <button onClick={submit}>追加</button>
    </div>
  );
}
