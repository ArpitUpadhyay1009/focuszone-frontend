import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/assets/components"),
      "@pages": path.resolve(__dirname, "src/assets/pages"),
      "@context": path.resolve(__dirname, "src/assets/context"),
      "@images": path.resolve(__dirname, "src/assets/images"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001", // change if your dev backend runs on another port
        changeOrigin: true,
      },
    },
  },
});
