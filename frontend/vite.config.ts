import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

export default defineConfig(({ mode }) => {
  // Load .env vars from root directory
  const rootDir = path.resolve(process.cwd(), '..')
  const env = loadEnv(mode, rootDir, '')

  return {
    plugins: [vue()],
    // Tell Vite to look for .env files in the root directory
    envDir: rootDir,
    server: {
      port: parseInt(env.FRONTEND_PORT || '5173', 10)
    },
  }
})
