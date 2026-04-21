import { useState } from "react";
import { createReview } from "@api/reviews";
import ProductSelect from "@/components/common/ProductSelect";

type Props = {
  onSuccess: () => void;
};

const ReviewForm = ({ onSuccess }: Props) => {
  const [productId, setProductId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    if (!productId) return alert("商品を選択してください");
    if (!userName.trim()) return alert("ユーザー名を入力してください");
    if (!comment.trim()) return alert("コメントを入力してください");

    await createReview({
      product_id: productId,
      user_name: userName,
      rating,
      comment,
      image_url: imageUrl || undefined,
      is_public: true,
      helpful_count: 0,
    });

    setUserName("");
    setComment("");
    setRating(5);
    setImageUrl("");
    onSuccess();
  };

  return (
    <div className="border p-4 mb-6 rounded">
      <h2 className="font-bold mb-3">レビュー新規投稿</h2>

      <ProductSelect value={productId} onChange={setProductId} />

      <div className="mt-2">
        <label className="block text-sm">ユーザー名</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border w-full p-2"
          placeholder="山田太郎"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm">評価（1〜5）</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-1 w-20"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm">コメント</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border w-full p-2"
        />
      </div>

      <div className="mt-2">
        <label className="block text-sm">画像URL（任意）</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border w-full p-2"
          placeholder="https://example.com/review.jpg"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        投稿
      </button>
    </div>
  );
};

export default ReviewForm;