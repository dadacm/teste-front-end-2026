import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    federation({
      name: "mf_videos",
      filename: "remoteEntry.js",
      exposes: {
        "./VideosPage": "./src/pages/VideosPage.tsx",
        "./FavoritesPage": "./src/pages/FavoritesPage.tsx",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
      dts: {
        generateTypes: {
          tsConfigPath: fileURLToPath(new URL("./tsconfig.federation.json", import.meta.url)),
          abortOnError: true,
        },
      },
    }),
  ],
  server: {
    port: 5175,
    strictPort: true,
    origin: "http://localhost:5175",
    cors: true,
  },
});
