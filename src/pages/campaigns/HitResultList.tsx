import { useState } from "react";
import useSWR from "swr";

import {
  fetchHitResults,
  deleteHitResult,
} from "@api/hitResult";

import { HitResultForm } from "@/components/hitResults/HitResultForm";

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

export default function HitResultList() {
  const { data, error, mutate } = useSWR<HitResult[]>(
    "/admin/hit-results",
    fetchHitResults
  );

  const [isOpen, setIsOpen] = useState(false);

  if (error) return <div>読み込みエラー</div>;
  if (!data) return <div>Loading...</div>;

  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await deleteHitResult(id);
    mutate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">的中実績管理</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsOpen(true)}
        >
          新規追加
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>商品</th>
            <th>レース名</th>
            <th>的中金額</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.product?.name}</td>
              <td>{r.race_name}</td>
              <td>¥{r.hit_amount.toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(r.id)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isOpen && (
        <HitResultForm
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            mutate();
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
