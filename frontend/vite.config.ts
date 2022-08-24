import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8084'
    }
  },
  plugins: [svelte()],
  build: {
    target: "",
    outDir: "../server/dist/public",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
      }
    }
  },
})
