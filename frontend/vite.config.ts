import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

export default defineConfig(({ mode }) => {
  // Load .env vars from root directory
  // This will load all variables including existing ones (API keys, etc.)
  const rootDir = path.resolve(process.cwd(), '..')
  const env = loadEnv(mode, rootDir, '')
  
  // Read explicitly set values from .env
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:3000/api'
  const frontendPort = parseInt(env.FRONTEND_PORT || '5173', 10)

  return {
    plugins: [vue()],
    // Tell Vite to look for .env files in the root directory
    envDir: rootDir,
    server: {
      port: frontendPort
    },
  }
})
