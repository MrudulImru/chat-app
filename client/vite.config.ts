import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";
// https://vitejs.dev/config/

dotenv.config();
export default defineConfig({
  plugins: [vue()],
  server: {
    port: Number(process.env.VITE_PORT) || 3000, // Default to 3000 if not defined
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      // Authentication proxy
      "/auth": {
        target: process.env.VITE_AUTH_BASE_URL || "http://localhost:8000/auth",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""),
      },
    },
  },
});
