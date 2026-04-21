import apiClient from "@api/client";

export type ArticlePayload = {
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  body?: string;
  thumbnail_url?: string;
  banner_url?: string;
  is_featured?: boolean;
  is_public?: boolean;
  sort_order?: number;
  published_at?: string | null;
};

export const fetchArticles = async () => {
  const res = await apiClient.get("/admin/articles");
  return res.data;
};

export const fetchArticle = async (id: number) => {
  const res = await apiClient.get(`/admin/articles/${id}`);
  return res.data;
};

export const createArticle = async (data: ArticlePayload) => {
  const res = await apiClient.post("/admin/articles", data);
  return res.data;
};

export const updateArticle = async (
  id: number,
  data: Partial<ArticlePayload>
) => {
  const res = await apiClient.put(`/admin/articles/${id}`, data);
  return res.data;
};

export const deleteArticle = async (id: number) => {
  const res = await apiClient.delete(`/admin/articles/${id}`);
  return res.data;
};

export const toggleArticlePublic = async (
  id: number,
  is_public: boolean
) => {
  const res = await apiClient.post(`/admin/articles/${id}/toggle_public`, {
    is_public,
  });
  return res.data;
};