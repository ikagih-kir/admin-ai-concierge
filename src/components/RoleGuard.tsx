import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AdminRole } from "../types/roles";

type Props = {
  allow: AdminRole[];
  children: React.ReactNode;
};

const RoleGuard = ({ allow, children }: Props) => {
  const auth = useAuth();
  if (!auth) return <Navigate to="/login" />;

  if (!allow.includes(auth.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default RoleGuard;
