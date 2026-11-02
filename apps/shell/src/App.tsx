import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./apps/AppLayout";
import { MicroFrontendErrorBoundary } from "./components/MicroFrontendErrorBoundary/MicroFrontendErrorBoundary";
import { RequireAuth } from "./components/RequireAuth/RequireAuth";
import LoginPage from "./pages/LoginPage";

const VideosPage = lazy(() => import("mf_videos/VideosPage"));
const FavoritesPage = lazy(() => import("mf_videos/FavoritesPage"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/videos" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
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
      </Route>

      <Route path="*" element={<h2>Página não encontrada</h2>} />
    </Routes>
  );
}
