import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  envDir: fileURLToPath(new URL("../../", import.meta.url)),
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "shell",
      remotes: {
        mf_drawer: {
          type: "module",
          name: "mf_drawer",
          entry: "http://localhost:5174/remoteEntry.js",
        },
        mf_videos: {
          type: "module",
          name: "mf_videos",
          entry: "http://localhost:5175/remoteEntry.js",
        },
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    origin: "http://localhost:5173",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
});
