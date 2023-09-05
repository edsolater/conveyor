import { APIEvent, json } from 'solid-start'

export async function GET({ params }: APIEvent) {
  const r2 = await globalThis.fetch('https://api.bilibili.com/x/web-interface/popular').then((res) => res.json())
  return json(r2)
}
