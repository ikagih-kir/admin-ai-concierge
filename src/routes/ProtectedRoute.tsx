import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../features/auth/useAuth";

type Props = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
