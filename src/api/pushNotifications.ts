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

export const sendPushNotification = async (
  data: PushNotificationPayload
): Promise<PushNotificationSendResult> => {
  const res = await apiClient.post("/admin/push-notifications/send", data);
  return res.data;
};