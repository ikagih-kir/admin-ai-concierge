import apiClient from "@api/client";


/**
 * 一覧取得
 */
export const fetchHitResults = async () => {
  const res = await apiClient.get("/admin/hit-results");
  return res.data;
};

/**
 * 作成（画像なし・JSON）
 * ※ 既存互換用
 */
export const createHitResult = async (data: {
  product_id: number;
  race_name: string;
  hit_amount: number;
}) => {
  const res = await apiClient.post("/admin/hit-results", data);
  return res.data;
};

/**
 * 作成（画像あり・multipart/form-data）
 * ★ NEW
 */
export const createHitResultWithImage = async (data: {
  product_id: number;
  race_name: string;
  hit_amount: number;
  image?: File | null;
}) => {
  const formData = new FormData();

  formData.append("product_id", String(data.product_id));
  formData.append("race_name", data.race_name);
  formData.append("hit_amount", String(data.hit_amount));

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await apiClient.post("/admin/hit-results", formData);
  return res.data;
};

/**
 * 更新
 */
export const updateHitResult = async (id: number, data: any) => {
  await apiClient.put(`/admin/hit-results/${id}`, data);
};

/**
 * 削除
 */
export const deleteHitResult = async (id: number) => {
  await apiClient.delete(`/admin/hit-results/${id}`);
};

/**
 * 詳細取得
 */
export const fetchHitResultDetail = async (id: number) => {
  const res = await apiClient.get(`/admin/hit-results/${id}`);
  return res.data;
};
