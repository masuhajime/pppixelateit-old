import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// import { dirname } from 'path'
// import { createRequire } from 'module'

// const __dirname = dirname(__filename)
// const require = createRequire(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(),
  nodePolyfills({
    // To exclude specific polyfills, add them to this list.
    exclude: [
      //'fs', // Excludes the polyfill for `fs` and `node:fs`.
    ],
    // Whether to polyfill specific globals.
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
      process: true,
    },
    // Whether to polyfill `node:` protocol imports.
    protocolImports: true,
  }),
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
}));
