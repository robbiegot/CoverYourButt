import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const mode = 'development';

export default defineConfig({
  plugins: [react()],
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
    minify: mode === 'development' ? false : 'esbuild',
    sourcemap: mode === 'development' ? true : false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: '../public',
});
