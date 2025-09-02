import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dynamicImport from 'vite-plugin-dynamic-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dynamicImport()],
  server: {
    open: true,
    port: 3006,
  },
});