import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"],
        },
      },
    }),
    cssInjectedByJsPlugin(),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "RetracedLogsViewer",
      fileName: "retraced-logs-viewer",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
        },
      },
    },
  },
});
