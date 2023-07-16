import { MayArray } from '@edsolater/fnkit'
import { Tuples } from '../../packages/fnkit'
import { bilibiliLinkCardItem } from './bilibili'

type Href = string

type AvailableTag =
  /** youtube need vpn  */
  'vpn' | 'video' | 'game' | 'music' | 'shopping' | 'news' | 'social' | 'other'

type RatingNumber = number /* 1 ~ 5 */

export type SiteCardItem = {
  name: string
  url?: Href
  rating?: RatingNumber
  tags?: AvailableTag[]
  description?: string
  keywords?: string[]
  headerLogo?: Href
  favicon?: Href
  howToUse?: MayArray<string>
  screenshot?: MayArray<
    | Href
    | {
        src: Href
        linkAddress?: Href
      }
  >
  searchUrl?: {
    breif: string
    regex: RegExp
    vars: {
      [key: string]: unknown
    }
  }
  subreddits?: SiteCardItem[]
}

export const linkCards = [bilibiliLinkCardItem] satisfies Tuples
