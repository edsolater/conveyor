import { JSX } from 'solid-js'
import favourites from '../configs/browser_favorites.json'

type Url = string
type Base64Image = `data:image/${string};base64,${string}`
type Image = Url | JSX.Element | Base64Image
type RatingNumber = number /* 1 ~ 5 */

export type LinkItem = {
  name: string
  url?: Url

  icon?: Base64Image | string
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
  date?: number | string // (s)
}

export const links: LinkItem[] = favourites
