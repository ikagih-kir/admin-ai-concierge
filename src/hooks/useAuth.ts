import { jwtDecode } from "jwt-decode";
import { AdminRole } from "../types/roles";

type JwtPayload = {
  role: AdminRole;
  email: string;
  exp: number;
};

export const useAuth = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};
