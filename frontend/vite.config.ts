// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     port: parseInt(process.env.FRONTEND_PORT || '5173', 10),
//   },
// })

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Load .env vars based on the current mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    server: {
      port: parseInt(env.FRONTEND_PORT || '5173', 10)
    },
  }
})
