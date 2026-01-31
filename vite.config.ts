import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
    // Настройки dev-сервера (используются только при npm run dev)
  server: {
      host: '0.0.0.0', // Позволяет подключаться извне контейнера
      port: 5173, // Стандартный порт Vite dev-сервера
      strictPort: false, // Если порт занят, попробует следующий
      allowedHosts: ['app.chillguyvpn.com'],
    },
    // Настройки production build
    build: {
      outDir: 'dist',
      sourcemap: !isProduction, // Source maps только для разработки
      minify: isProduction ? 'esbuild' : false, // Минификация для продакшена
      cssMinify: isProduction, // Минификация CSS для продакшена
      // Оптимизация chunk splitting
      rollupOptions: {
        output: {
          manualChunks: {
            // Выделяем vendor библиотеки в отдельные chunks
            'react-vendor': ['react', 'react-dom'],
            'tanstack-vendor': [
              '@tanstack/react-query',
              '@tanstack/react-router',
              '@tanstack/react-table',
            ],
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
            ],
          },
        },
      },
      // Увеличиваем лимит предупреждений для больших бандлов
      chunkSizeWarningLimit: 1000,
    },
    // Оптимизация для продакшена
    ...(isProduction && {
      // Отключаем dev-инструменты в продакшене
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    }),
  }
})
