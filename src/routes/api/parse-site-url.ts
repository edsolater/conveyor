import { APIEvent } from 'solid-start'
import { getPostJSONData } from '../../packages/networkkit/getPostBodyFromData'
import { createNewResponse } from '../../packages/networkkit/wrapToNewResponse'

export type PostBodyData = {
  url: string
}

export async function POST({ request }: APIEvent) {
  const postBodyData = (await getPostJSONData(request)) as PostBodyData
  const url = postBodyData.url

  const res = fetch(url)
  res.then((r) => {
    r.text().then((t) => {
      console.log('t: ', t)
    })
  })
  return createNewResponse(res)
}
