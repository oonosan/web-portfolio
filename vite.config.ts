import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 4200 },
  preview: { port: 4300 },
  // The 3D scene (three + drei + postprocessing) is one lazy chunk by design.
  build: { chunkSizeWarningLimit: 1200 },
});
