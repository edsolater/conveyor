import { createClient } from '@vercel/kv'
import { KV_REST_API_TOKEN, KV_REST_API_URL } from './env'

const kvDB = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
})

export { kvDB }

