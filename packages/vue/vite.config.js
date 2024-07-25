import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@tidbcloud/tisqleditor'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
