import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@auth": path.resolve(__dirname, "./src/modules/auth"),
      "@user": path.resolve(__dirname, "./src/modules/user"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
