import { APIEvent } from 'solid-start'
import { getPostBodyFromData } from '../../packages/networkkit/getPostBodyFromData'
import { wrapToNewResponse } from '../../packages/networkkit/wrapToNewResponse'

export type PostBodyData = {
  simulateUrl: string
}

export async function POST({ request }: APIEvent) {
  const postBodyData = (await getPostBodyFromData(request)) as PostBodyData
  const url = postBodyData.simulateUrl
  const res = fetch(url)
  return wrapToNewResponse(res)
}
