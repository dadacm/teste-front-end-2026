
import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { AppLayout } from "./apps/AppLayout";
import { MicroFrontendErrorBoundary } from "./components/MicroFrontendErrorBoundary";

const VideosPage = lazy(
  () => import("mf_videos/VideosPage")
);

const FavoritesPage = lazy(
  () => import("mf_videos/FavoritesPage")
);

function LoginPage() {
  return <h2>Login em desenvolvimento</h2>;
}


export default function App() {
  return (
    <Suspense fallback={<p>Carregando página...</p>}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/videos" replace />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<AppLayout />}>
          <Route
            path="/videos"
            element={
            <MicroFrontendErrorBoundary remoteName="Vídeos">
              <Suspense fallback={<p>Carregando vídeos...</p>}>
                <VideosPage />
              </Suspense>
            </MicroFrontendErrorBoundary>
            }
          />
          <Route
            path="/favorites"
            element={
            <MicroFrontendErrorBoundary remoteName="Favoritos">
              <Suspense fallback={<p>Carregando favoritos...</p>}>
                <FavoritesPage />
              </Suspense>
            </MicroFrontendErrorBoundary>
            }
          />
        </Route>

        <Route
          path="*"
          element={<h2>Página não encontrada</h2>}
        />
      </Routes>
    </Suspense>
  );
}
