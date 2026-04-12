import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  /** Chỉ bật proxy khi có BACKEND_URL và VITE_API_BASE_URL=/api (tránh CORS lúc dev). */
  const backendUrl = (env.BACKEND_URL || "").replace(/\/$/, "");
  const useApiProxy = env.VITE_API_BASE_URL === "/api" && backendUrl && /^https?:\/\//i.test(backendUrl);

  return {
    envDir: path.resolve(__dirname, "."),
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: useApiProxy
        ? {
            "/api": {
              target: backendUrl,
              changeOrigin: true,
              secure: true,
              rewrite: (p) => p.replace(/^\/api/, "") || "/",
            },
          }
        : undefined,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
