import { useState } from "react";
import { adminLogin } from "../../api/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await adminLogin(email, password);
      localStorage.setItem("admin_token", res.access_token);
      setError(null);
      return true;
    } catch {
      setError("ログインに失敗しました");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => localStorage.removeItem("admin_token");
  const isAuthenticated = () => !!localStorage.getItem("admin_token");

  return { signIn, signOut, isAuthenticated, loading, error };
};
