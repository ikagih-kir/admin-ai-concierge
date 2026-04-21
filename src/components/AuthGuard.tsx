import { Navigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: Props) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
