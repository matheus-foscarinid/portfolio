/* eslint-env node */
import { fileURLToPath, URL } from 'node:url'
import { Readable } from 'node:stream'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

// vercel serves api/ in production. this runs the same handler under `npm run dev`
const serveApiInDev = () => ({
  name: 'serve-api-in-dev',
  configureServer(server) {
    Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), 'GROQ_'))

    server.middlewares.use('/api/chat', async (req, res, next) => {
      if (req.method !== 'POST') return next()
      const { POST } = await server.ssrLoadModule('/api/chat.js')
      const request = new Request(new URL(req.url, 'http://localhost'), {
        method: req.method,
        headers: req.headers,
        body: Readable.toWeb(req),
        duplex: 'half'
      })
      const response = await POST(request)
      res.writeHead(response.status, Object.fromEntries(response.headers))
      res.end(await response.text())
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    serveApiInDev(),
    process.env.ANALYZE &&
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true
      })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
