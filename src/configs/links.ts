import { JSX } from 'solid-js'

type Url = string
type Base64Image = `data:image/${string};base64,${string}`
type Image = Url | JSX.Element | Base64Image
type RatingNumber = number /* 1 ~ 5 */

export type LinkItem = {
  name: string
  url?: Url

  rating?: RatingNumber
  tags?: string[]
  description?: string
  keywords?: string[]

  // auto-detect by script
  images?: {
    headerLogo?: Image
    icon?: Image
    screenshots?: Image[]
  }

  updateAt?: Date
  createAt?: Date
}

export const links: LinkItem[] = [
  {
    name: 'bilibili',
    url: 'https://www.bilibili.com/',
    tags: ['video'],
    description: 'bilibili web site',
    keywords: ['video', 'anime', 'game'],
  },
]
