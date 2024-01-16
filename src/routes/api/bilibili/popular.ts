import { APIEvent } from '@solidjs/start/server/types'
import { createNewResponse } from '../../../packages/networkkit/wrapToNewResponse'

export async function GET({ params }: APIEvent) {
  const res = fetch('https://api.bilibili.com/x/web-interface/popular')
  return createNewResponse(res)
}
