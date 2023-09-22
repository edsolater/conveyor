type Url = string
type Base64Image = `data:image/${string}`
type Image = Url | Base64Image
type RatingNumber = number /* 1 ~ 5 */

export type LinkItemScreenshot = {
  src: Image
  url?: Url
}

export type LinkItem = {
  name: string
  url?: Url

  icon?: Base64Image | string
  rating?: RatingNumber
  tags?: string[]
  description?: string
  keywords?: string[]

  // auto-detect by script
  headerLogo?: Image
  screenshots?: LinkItemScreenshot[]

  updateAt?: Date
  createAt?: Date
  date?: number | string // (s)
}

export const links: LinkItem[] = [
  {
    name: 'bilibili',
    url: 'https://www.bilibili.com/',
    tags: ['video'],
    description: 'bilibili web site',
    keywords: ['video', 'anime', 'game'],
  },
  {
    name: 'youtube',
    url: 'https://www.youtube.com/',
    tags: ['video'],
    description: 'youtube web site',
    keywords: ['video', 'music', 'game'],
  },
]
