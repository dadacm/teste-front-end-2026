import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useFetch } from "@icasei/hooks";

import { verifySession } from "../../controllers/auth.controller";

export function RequireAuth() {
  const location = useLocation();

  const {
    data: isAuthenticated,
    status,
    error,
    execute: executeCheckSession,
  } = useFetch<boolean, void>(verifySession);

  useEffect(() => {
    void executeCheckSession(undefined);
  }, [executeCheckSession]);

  if (status === "idle" || status === "loading") {
    return <div role="status">Verificando sessão...</div>;
  }

  if (status === "error") {
    return <p role="alert">{error}</p>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return isAuthenticated === true ? <Outlet /> : null;
}
