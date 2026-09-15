import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), react(), svgr()],
  resolve: {
    tsconfigPaths: true,
  },
});
