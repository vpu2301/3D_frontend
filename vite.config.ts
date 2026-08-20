import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Dev proxy for the standalone Notes service (`notes_app`).
 *
 * The dev server runs on :3000, but the Notes service's `cors_origins` only
 * lists :8080 and :5173 — so a direct browser call to http://localhost:8000
 * fails its preflight. Proxying makes the requests same-origin, which sidesteps
 * CORS entirely rather than asking the backend to enumerate every dev port.
 *
 * Point `VITE_NOTES_API_URL` at `/notes-api` in `.env.local` to use it. Override
 * the upstream with `NOTES_API_TARGET` if the service is not on :8000.
 */
const NOTES_API_TARGET = process.env.NOTES_API_TARGET ?? "http://localhost:8000";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    strictPort: true,
    proxy: {
      "/notes-api": {
        target: NOTES_API_TARGET,
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/notes-api/, ""),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
