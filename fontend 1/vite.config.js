// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ESM-compatible Vite config
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Ensure this points to your PostCSS config
  },
});
