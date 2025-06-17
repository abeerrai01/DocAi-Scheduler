import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: [
      'doc-ai-4sty.onrender.com',
      'doc-ai-scheduler.vercel.app',
      'docai-frontend-backend-production.up.railway.app',
      'docai-scheduler-production.up.railway.app',
      'docai-scheduler-production.up.railway.app/api/patient/submit-all',
      'doc-ai-ml.onrender.com'
    ]
  }
})
