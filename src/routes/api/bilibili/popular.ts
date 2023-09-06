import { APIEvent } from 'solid-start'
import { wrapToNewResponse } from '../../../packages/networkkit/wrapToNewResponse'

export async function GET({ params }: APIEvent) {
  const res = fetch('https://api.bilibili.com/x/web-interface/popular')
  return wrapToNewResponse(res)
}
