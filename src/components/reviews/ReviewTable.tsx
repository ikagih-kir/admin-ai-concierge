type Review = {
  id: number;
  rating: number;
  comment: string;
  product: {
    name: string;
  };
};

type Props = {
  reviews: Review[];
  onDelete: (id: number) => void;
};

const ReviewTable = ({ reviews, onDelete }: any) => {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>評価</th>
          <th>コメント</th>
          <th>画像</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {reviews.map((r: any) => (
          <tr key={r.id} className="border-t">
            <td>{r.rating}</td>
            <td>{r.comment}</td>
            <td>
              {r.image_url && (
                <img
                  src={r.image_url}
                  className="w-24 h-auto rounded"
                />
              )}
            </td>
            <td>
              <button
                onClick={() => onDelete(r.id)}
                className="text-red-600"
              >
                削除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReviewTable;
