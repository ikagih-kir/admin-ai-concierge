import apiClient from "@api/client";

export const fetchReviews = async () => {
  const res = await apiClient.get("/admin/reviews");
  return res.data;
};

export const createReview = async (data: {
  product_id?: number;
  site_id?: number;
  user_name: string;
  rating: number;
  comment: string;
  image_url?: string;
  is_public: boolean;
  helpful_count?: number;
}) => {
  const res = await apiClient.post("/admin/reviews", {
    ...data,
    helpful_count: data.helpful_count ?? 0,
  });
  return res.data;
};

export const updateReview = async (
  id: number,
  data: {
    product_id?: number;
    site_id?: number;
    user_name?: string;
    rating?: number;
    comment?: string;
    image_url?: string;
    is_public?: boolean;
    helpful_count?: number;
  }
) => {
  const res = await apiClient.put(`/admin/reviews/${id}`, data);
  return res.data;
};

export const deleteReview = async (id: number) => {
  await apiClient.delete(`/admin/reviews/${id}`);
};

export const replyReview = async (id: number, reply: string) => {
  await apiClient.post(`/admin/reviews/${id}/reply`, {
    admin_reply: reply,
  });
};

export const toggleReviewPublic = async (id: number, is_public: boolean) => {
  await apiClient.post(`/admin/reviews/${id}/toggle_public`, { is_public });
};