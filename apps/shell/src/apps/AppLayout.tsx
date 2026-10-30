import { lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import type { NavigationPath } from "@icasei/contracts";
import { MicroFrontendErrorBoundary } from "../components/MicroFrontendErrorBoundary/MicroFrontendErrorBoundary";

const RemoteDrawer = lazy(() => import("mf_drawer/DrawerApp"));

export function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentPath: NavigationPath = pathname === "/favorites" ? "/favorites" : "/videos";

  return (
    <div className="min-h-screen bg-background text-text-primary md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      <div className="border-b border-border-ui md:border-r md:border-b-0">
        <div className="app-layout">
          <MicroFrontendErrorBoundary remoteName="Menu lateral">
            <Suspense fallback={<p>Carregando menu...</p>}>
              <RemoteDrawer
                currentPath={currentPath}
                favoritesCount={0}
                onNavigate={(path: NavigationPath) => navigate(path)}
              />
            </Suspense>
          </MicroFrontendErrorBoundary>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
