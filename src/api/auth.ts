import apiClient from "@api/client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

/** 管理者ログイン */

export const adminLogin = async (email: string, password: string) => {
  const res = await apiClient.post("/admin/auth/login", {
    email,
    password,
  });

  // 🔑 これがないと全部403になる
  localStorage.setItem("admin_token", res.data.access_token);

  return res.data;
};
