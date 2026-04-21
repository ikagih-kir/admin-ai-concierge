import apiClient from "./client";

export const fetchAdminLogs = async (params?: {
  admin_email?: string;
  action?: string;
}) => {
  const res = await apiClient.get("/admin/logs", { params });
  return res.data;
};
