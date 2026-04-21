import useSWR from "swr";
import { fetchReviews, deleteReview } from "@api/reviews";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewTable from "@/components/reviews/ReviewTable";

const ReviewList = () => {
  const {
    data,
    mutate,
    isLoading,
    error,
  } = useSWR("/admin/reviews", fetchReviews);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">データの取得に失敗しました</div>;
  }

  // 🔑 data が undefined の場合に備える
  const reviews = data ?? [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">クチコミ管理（旧ReviewList）</h1>

      {/* 新規投稿 */}
      <ReviewForm onSuccess={mutate} />

      {/* 一覧 */}
      <ReviewTable
        reviews={reviews}
        onDelete={async (id: number) => {
          await deleteReview(id);
          mutate();
        }}
      />
    </div>
  );
};

export default ReviewList;
