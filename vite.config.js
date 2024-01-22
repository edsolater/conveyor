import { defineConfig } from '@solidjs/start/config'

/**
 * @see https://vitejs.dev/config/shared-options#define
 */
export default defineConfig({ start: { ssr: false, server: { preset: 'vercel' } },
 'define': {} })
