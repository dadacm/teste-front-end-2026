
import { lazy, Suspense } from "react";

const RemoteDrawer = lazy(
  () => import("mf_drawer/DrawerApp")
);

export default function App() {
  return (
    <div>
      <h1>iCasei Front-End Challenge</h1>

      <Suspense fallback={<p>Carregando menu...</p>}>
        <RemoteDrawer />
      </Suspense>

      <main>
        <h2>Aplicação principal</h2>
        <p>Conteúdo do Shell</p>
      </main>
    </div>
  );
}
