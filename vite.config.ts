import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to resolve paths relative to the project root
const resolvePath = (p: string) => path.resolve(__dirname, p);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolvePath('./src'),
      '@modules': resolvePath('./src/modules'),
      '@app': resolvePath('./src/app'),
      '@libs/ui': resolvePath('./src/libs/ui/index.ts'),
      '@libs/utils': resolvePath('./src/libs/utils/index.ts'),
      '@libs/types': resolvePath('./src/libs/types/index.ts'),
      '@libs/store': resolvePath('./src/libs/store/index.ts'),
      '@libs/constants': resolvePath('./src/libs/constants/index.ts'),
      '@libs/query': resolvePath('./src/libs/query/index.ts'),
      '@libs/hooks': resolvePath('./src/libs/hooks/index.ts'),
      '@libs/configs': resolvePath('./src/libs/configs/index.ts'),
      '@libs/pages': resolvePath('./src/libs/pages/index.ts'),
      '@services': resolvePath('./src/services'),
    },
  },
  // server: {
  //   port: 3000,  
  //   strictPort: true,
  //   host: true, 
  // },
});