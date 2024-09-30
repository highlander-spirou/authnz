import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@user": resolve(__dirname, "./src/pages/user"),
      "@root": resolve(__dirname, "./src/pages/root"),
      "@auth": resolve(__dirname, "./src/pages/auth"),
    },
  },
});
