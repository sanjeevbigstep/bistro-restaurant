import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  console.log("modevalue", mode);
  // Load env file based on `mode` (development, production, etc.)
  // process.cwd() tells Vite to look for .env in the project root
  const env = loadEnv("", process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          // Use the loaded env variable here
          target: env.VITE_BACKEND_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
