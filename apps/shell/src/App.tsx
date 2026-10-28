
import { lazy, Suspense } from "react";

const RemoteDrawer = lazy(
  () => import("mf_drawer/DrawerApp")
);

const RemoteVideosPage = lazy(
  () => import("mf_videos/VideosPage")
);

export default function App() {
  return (
    <div>
      <header>
        <h1>iCasei Front-End Challenge</h1>
      </header>

      <div style={{ display: "flex", gap: "24px" }}>
        <Suspense fallback={<p>Carregando menu...</p>}>
          <RemoteDrawer />
        </Suspense>

        <main>
          <Suspense fallback={<p>Carregando vídeos...</p>}>
            <RemoteVideosPage />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
