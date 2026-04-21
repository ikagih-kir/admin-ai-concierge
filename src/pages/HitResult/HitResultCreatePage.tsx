// src/pages/HitResult/HitResultCreatePage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "@api/products";
import { createHitResult } from "@api/hitResult";
import { Product } from "@/types/product";

export default function HitResultCreatePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | "">("");
  const [raceName, setRaceName] = useState("");
  const [hitAmount, setHitAmount] = useState("");

  // 🔹 商品一覧取得
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // 🔹 登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      alert("商品を選択してください");
      return;
    }

    await createHitResult({
      product_id: productId,
      race_name: raceName,
      hit_amount: Number(hitAmount),
    });

    navigate("/hit-results");
  };

  return (
    <div>
      <h1>実績 新規作成</h1>

      <form onSubmit={handleSubmit}>
        {/* 🟢 無料予想 SelectBox */}
        <div>
          <label>無料予想</label>
          <select
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
          >
            <option value="">無料予想を選択してください</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>レース名</label>
          <input
            value={raceName}
            onChange={(e) => setRaceName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>的中金額</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={hitAmount}
            onChange={(e) => setHitAmount(e.target.value.replace(/[^0-9]/g, ""))}
          />

        </div>

        <button type="submit">登録</button>
      </form>
    </div>
  );
}
