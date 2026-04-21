import { AdminRole } from "../types/roles";


export const canView = (role: AdminRole) =>
  ["super_admin", "operator", "viewer"].includes(role);

export const canOperate = (role: AdminRole) =>
  ["super_admin", "operator"].includes(role);

export const isSuperAdmin = (role: AdminRole) =>
  role === "super_admin";
