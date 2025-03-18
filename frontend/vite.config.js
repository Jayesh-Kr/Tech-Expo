import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd());
  
  return {
    plugins: [react()],
    define: {
      // Use import.meta.env format for Vite
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
      'process.env.REACT_APP_CLERK_PUBLISHABLE_KEY': JSON.stringify(env.VITE_CLERK_PUBLISHABLE_KEY),
    },
    server: {
      port: 5173  // Default Vite port
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    }
  };
});
