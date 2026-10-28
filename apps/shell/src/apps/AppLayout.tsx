
import { lazy, Suspense } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";

import type { NavigationPath } from "@icasei/contracts";

const RemoteDrawer = lazy(
  () => import("mf_drawer/DrawerApp")
);

export function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const currentPath: NavigationPath =
    pathname === "/favorites"
      ? "/favorites"
      : "/videos";

  return (
    <div className="app-layout">
      <Suspense fallback={<p>Carregando menu...</p>}>
        <RemoteDrawer
          currentPath={currentPath}
          favoritesCount={0}
          onNavigate={(path: NavigationPath) => navigate(path)}
        />
      </Suspense>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
