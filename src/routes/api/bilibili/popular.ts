import { APIEvent, json } from 'solid-start'

export async function GET({ params, fetch }: APIEvent) {
  const res = await fetch('https://api.bilibili.com/x/web-interface/popular', {}).then(i=>i.text())
  console.log('res: ', res)
  return json({ res: 'hello' })
}
