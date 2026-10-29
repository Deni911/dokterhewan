import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // default 500
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/node_modules/lottie-react/") ||
            id.includes("/node_modules/lottie-web/")
          ) {
            return "lottie";
          }

          if (
            id.includes("/node_modules/gsap/") ||
            id.includes("/node_modules/@gsap/react/")
          ) {
            return "gsap";
          }

          if (
            id.includes("/node_modules/framer-motion/") ||
            id.includes("/node_modules/motion-dom/") ||
            id.includes("/node_modules/motion-utils/")
          ) {
            return "motion";
          }
        },
      },
    },
  },
});
