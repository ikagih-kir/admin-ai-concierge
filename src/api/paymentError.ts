// src/api/paymentError.ts

import apiClient from "./client";

export type PaymentErrorParams = {
  error_code?: string;
};

export type PaymentErrorItem = {
  id: number;
  user_id: number;
  email: string;
  error_code: string;
  error_message: string;
  amount: number;
  occurred_at: string;
};

export type PaymentErrorResponse = {
  items: PaymentErrorItem[];
};

export const fetchPaymentErrors = async (
  params?: PaymentErrorParams   // ← ここが重要
) => {
  const res = await apiClient.get("/admin/payment-errors", {
    params,
  });
  return res.data;
};

export const fetchPaymentErrorDetail = async (id: number) => {
  const res = await apiClient.get(`/admin/payment-errors/${id}`);
  return res.data;
};


export const resolvePaymentError = async (id: number) => {
  const res = await apiClient.post(
    `/admin/payment-errors/${id}/resolve`
  );
  return res.data;
};

export type RetryPaymentResponse = {
  success: boolean;
  message: string;
};

export const retryPayment = async (
  id: number
): Promise<RetryPaymentResponse> => {
  const res = await apiClient.post<RetryPaymentResponse>(
    `/admin/payment-errors/${id}/retry`
  );
  return res.data;
};
