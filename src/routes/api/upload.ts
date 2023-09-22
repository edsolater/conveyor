import { APIEvent } from 'solid-start'

export async function POST({ request }: APIEvent) {
  const postBodyData = request.body
  console.log('postBodyData: ', postBodyData)
}
