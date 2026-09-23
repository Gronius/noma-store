import { defineConfig } from "vite";
import { mockApiPlugin } from "./vite.mock-api.js";

export default defineConfig({
  css: {
    devSourcemap: true,
  },

  plugins: [
    mockApiPlugin(),
  ],
});
