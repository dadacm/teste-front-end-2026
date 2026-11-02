import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  FAVORITES_UPDATED_EVENT,
  type FavoritesUpdatedDetail,
  type NavigationPath,
} from "@icasei/contracts";

import { useFetch } from "@icasei/hooks";

import { MicroFrontendErrorBoundary } from "../components/MicroFrontendErrorBoundary/MicroFrontendErrorBoundary";
import { endSession } from "../controllers/auth.controller";

const RemoteDrawer = lazy(() => import("mf_drawer/DrawerApp"));

export function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [favoritesCount, setFavoritesCount] = useState(0);

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

  useEffect(() => {
    const handleFavoritesUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<FavoritesUpdatedDetail>;

      const count = customEvent.detail?.count;

      if (typeof count === "number" && Number.isInteger(count) && count >= 0) {
        setFavoritesCount(count);
      }
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated);

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated);
    };
  }, []);

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
                favoritesCount={favoritesCount}
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
