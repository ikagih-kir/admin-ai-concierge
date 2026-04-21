import apiClient from "@api/client";

export type DashboardSummary = {
  product_count: number;
  hit_result_count: number;
  site_count: number;
  article_count: number;
  chat_faq_count: number;
  chat_question_log_count: number;
  needs_improvement_question_count: number;
};

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await apiClient.get<DashboardSummary>(
    "/admin/dashboard/summary"
  );
  return res.data;
};