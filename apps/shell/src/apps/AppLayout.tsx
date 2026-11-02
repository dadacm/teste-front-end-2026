import { lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import type { NavigationPath } from "@icasei/contracts";
import { useFetch } from "@icasei/hooks";

import { MicroFrontendErrorBoundary } from "../components/MicroFrontendErrorBoundary/MicroFrontendErrorBoundary";
import { endSession } from "../controllers/auth.controller";

const RemoteDrawer = lazy(() => import("mf_drawer/DrawerApp"));

export function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentPath: NavigationPath = pathname === "/favorites" ? "/favorites" : "/videos";

  const {
    error: logoutError,
    isLoading: isLoggingOut,
    execute: executeLogout,
  } = useFetch<void, void>(endSession, {
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });

  const handleLogout = () => {
    if (isLoggingOut) return;

    void executeLogout(undefined);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border-b border-border-ui md:border-r md:border-b-0">
        <div className="app-layout">
          <MicroFrontendErrorBoundary remoteName="Menu lateral">
            <Suspense fallback={<p>Carregando menu...</p>}>
              <RemoteDrawer
                currentPath={currentPath}
                favoritesCount={0}
                onNavigate={(path: NavigationPath) => navigate(path)}
                onLogout={handleLogout}
                isLoggingOut={isLoggingOut}
              />
            </Suspense>
          </MicroFrontendErrorBoundary>

          {logoutError && (
            <p role="alert" className="px-4 py-2 text-sm text-red-200">
              {logoutError}
            </p>
          )}
        </div>
      </aside>

      <main className="min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
