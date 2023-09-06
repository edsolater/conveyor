import { MayPromise } from '@edsolater/fnkit'
import { isPromise } from 'util/types'

export function wrapToNewResponse(res: Response): Response
export function wrapToNewResponse(res: Promise<Response>): Promise<Response>
export function wrapToNewResponse(res: MayPromise<Response>): Response | Promise<Response> {
  if (isPromise(res)) {
    return res.then(wrapToNewResponse)
  } else {
    return new Response(res.body, {
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json;charset=UTF-8',
      },
    })
  }
}
