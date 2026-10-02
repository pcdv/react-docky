import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// The examples import react-docky as an application would, but get its sources: there is no need
// to build the library, and changes are reloaded right away.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^react-docky\/assets\/(.*)$/, replacement: resolve(import.meta.dirname, '../assets/$1') },
      { find: /^react-docky$/, replacement: resolve(import.meta.dirname, '../src/index.ts') },
    ],
  },
})
