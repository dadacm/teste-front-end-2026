
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
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
  },
});
