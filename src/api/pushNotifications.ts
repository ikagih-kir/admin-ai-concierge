import apiClient from "@api/client";

export type PushNotificationPayload = {
  title: string;
  body: string;
  target_path?: string;
  target: "all";
};

export type PushNotificationSendResult = {
  success_count: number;
  failure_count: number;
  total_count: number;
};

export type ScheduledPushNotification = {
  id: number;
  title: string;
  body: string;
  target_path?: string | null;
  status: "scheduled" | "sent" | "failed" | "canceled";
  scheduled_at: string;
  sent_at?: string | null;
  canceled_at?: string | null;
  success_count: number;
  failure_count: number;
  total_count: number;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
};

export type ScheduledPushNotificationPayload = {
  title: string;
  body: string;
  target_path?: string;
  scheduled_at: string;
};

export const sendPushNotification = async (
  data: PushNotificationPayload
): Promise<PushNotificationSendResult> => {
  const res = await apiClient.post("/admin/push-notifications/send", data);
  return res.data;
};

export const fetchScheduledPushNotifications = async (): Promise<
  ScheduledPushNotification[]
> => {
  const res = await apiClient.get("/admin/push-notifications/scheduled");
  return res.data;
};

export const createScheduledPushNotification = async (
  data: ScheduledPushNotificationPayload
): Promise<ScheduledPushNotification> => {
  const res = await apiClient.post("/admin/push-notifications/scheduled", data);
  return res.data;
};

export const cancelScheduledPushNotification = async (
  id: number
): Promise<ScheduledPushNotification> => {
  const res = await apiClient.post(
    `/admin/push-notifications/scheduled/${id}/cancel`
  );
  return res.data;
};