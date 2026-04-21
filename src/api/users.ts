import apiClient from "./client";

export const fetchUsers = async (params: any) => {
  const res = await apiClient.get("/admin/users", { params });
  return res.data;
};

export const fetchUserDetail = async (id: string) => {
  const res = await apiClient.get(`/admin/users/${id}/basic`);
  return res.data;
};
