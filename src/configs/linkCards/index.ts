import { MayArray } from '@edsolater/fnkit'
import { Tuples } from '../../packages/fnkit'
import { bilibiliLinkCardItem } from './bilibili'

type Href = string

export type LinkCardItem = {
  name: string
  site: Href
  /** youtube need vpn  */
  needVPN?: boolean
  /* default is other */
  category?: 'video' | 'game' | 'music' | 'shopping' | 'news' | 'social' | 'other'
  description: string
  keywords: string[]
  headerLogo?: Href
  favicon: Href
  howToPlay?: MayArray<string>
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
  subreddits?: {
    category?: string
    screenshot?: MayArray<Href>
    url: Href
  }[]
}

/**
 * big Card may have sub cards
 */
export type SubLinkCard = {
  subName: string
  search?: {
    url: string
  }
} & Omit<LinkCardItem, 'name' | 'subCards'>

export const linkCards = [bilibiliLinkCardItem] satisfies Tuples
