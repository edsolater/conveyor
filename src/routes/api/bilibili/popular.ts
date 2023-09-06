import { APIEvent } from 'solid-start'
import { createNewResponse } from '../../../packages/networkkit/wrapToNewResponse'

export async function GET({ params }: APIEvent) {
  const res = fetch('https://api.bilibili.com/x/web-interface/popular')
  return createNewResponse(res)
}
