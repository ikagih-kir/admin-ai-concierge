import apiClient from "./client";
import { MailCreatePayload, MailReservation } from "../types/mail";

type ListResponse = {
  items: MailReservation[];
};

export const fetchMailReservations = async (params?: {
  q?: string;
  status?: string;
}): Promise<ListResponse> => {
  const res = await apiClient.get<ListResponse>("/admin/mail/reservations", {
    params,
  });
  return res.data;
};

export const createMail = async (payload: MailCreatePayload) => {
  const res = await apiClient.post("/admin/mail", payload);
  return res.data;
};

export const updateMail = async (id: number, payload: Partial<MailCreatePayload>) => {
  const res = await apiClient.put(`/admin/mail/${id}`, payload);
  return res.data;
};

export const deleteMail = async (id: number) => {
  await apiClient.delete(`/admin/mail/${id}`);
};

export const duplicateMail = async (id: number) => {
  const res = await apiClient.post(`/admin/mail/${id}/duplicate`);
  return res.data;
};
