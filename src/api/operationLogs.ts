// src/api/operationLogs.ts
import apiClient from "./client";

export interface OperationLog {
  id: number;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: number;
  detail?: string;
  created_at: string;
}

export interface OperationLogListResponse {
  total: number;
  items: OperationLog[];
}

export const fetchOperationLogs = async (params?: {
  admin_email?: string;
  action?: string;
  limit?: number;
  offset?: number;
}): Promise<OperationLogListResponse> => {
  const res = await apiClient.get<OperationLogListResponse>(
    "/admin/operation-logs",
    { params }
  );
  return res.data;
};
