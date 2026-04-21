export const getToken = (): string | null => {
  return localStorage.getItem("admin_token");
};

export const logout = () => {
  localStorage.removeItem("admin_token");
  window.location.href = "/login";
};
