interface JwtPayload {
  sub: string;
  email: string;
  role: "super_admin" | "operator" | "viewer";
  exp: number;
}

export const decodeJwt = (): JwtPayload | null => {
  const token = localStorage.getItem("admin_token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};
