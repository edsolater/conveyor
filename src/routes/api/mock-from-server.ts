import { APIEvent } from 'solid-start'
import { getPostData } from '../../packages/networkkit/getPostBodyFromData'
import { createNewResponse } from '../../packages/networkkit/wrapToNewResponse'

export type PostBodyData = {
  simulateUrl: string
}

export async function POST({ request }: APIEvent) {
  const postBodyData = (await getPostData(request)) as PostBodyData
  const url = postBodyData.simulateUrl
  const res = fetch(url)
  return createNewResponse(res)
}
