import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    hmr: false,
    watch: {
      usePolling: false
    }
  },
  optimizeDeps: {
    force: true
  },
  build: {
    sourcemap: false,
    cssCodeSplit: false
  },
  assetsInclude: ['**/*.gltf', '**/*.glb'],
})
