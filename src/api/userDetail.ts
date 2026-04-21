import apiClient from "./client";

export const fetchUserBasic = async (id: number) => {
  const res = await apiClient.get(`/admin/users/${id}/basic`);
  return res.data;
};

export const fetchUserPayment = async (id: number) => {
  const res = await apiClient.get(`/admin/users/${id}/payment`);
  return res.data;
};

export const fetchUserTags = async (id: number) => {
  const res = await apiClient.get(`/admin/users/${id}/tags`);
  return res.data as string[];
};
