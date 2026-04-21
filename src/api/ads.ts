import apiClient from "./client";

export const fetchAdsSummary = async () => {
  const res = await apiClient.get("/admin/ads/summary");
  return res.data;
};

export const fetchAdsByChannel = async () => {
  const res = await apiClient.get("/admin/ads/by-channel");
  return res.data;
};
