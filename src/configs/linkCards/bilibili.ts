import { SiteCardItem } from '.'

interface BilibiliLinkCardItem extends SiteCardItem {
  searchUrl: {
    breif: 'https://search.bilibili.com/all'
    regex: RegExp
    vars: {
      keyword: string
      /** default is 'all' */
      category?:
        | 'all' /* 全部 */
        | 'video' /* 视频 */
        | 'bangumi' /* 番剧 */
        | 'pgc' /* 影视 */
        | 'live' /* 直播 */
        | 'article' /* 专栏 */
        | 'upuser' /* 用户 */
      order?: 'click' /* 最多点击 */ | 'pubdate' /* 最新发布 */ | 'dm' /* 做多弹幕 */ | 'stow' /* 最多收藏 */
    }
  }
}

export const bilibiliLinkCardItem: BilibiliLinkCardItem = {
  name: 'bilibili',
  url: 'https://www.bilibili.com/',
  tags: ['video'],
  description: 'bilibili web site',
  keywords: ['video', 'anime', 'game'],
  headerLogo: '/websites/bilibili/header-logo.svg',
  favicon: '/websites/bilibili/favicon.svg',
  howToUse: 'search the text',
  screenshot: '/websites/bilibili/screenshots/bilibili_home_page_screenshot.png',
  // TODO: not elegant!!!
  searchUrl: {
    breif: 'https://search.bilibili.com/all',
    regex: /https:\/\/search\.bilibili\.com\/(<?category>all|video|bangui|pgc|live|article|upuser)/,
    vars: {
      keyword: 'hello+world'
    }
  },
  subreddits: [
    {
      name: 'movie',
      screenshot: '/websites/bilibili/screenshots/bilibili_movie.png'
    },
    {
      name: 'anime',
      url: 'https://www.bilibili.com/anime',
      screenshot: '/websites/bilibili/screenshots/bilibili_anime.png'
    },
    {
      name: 'documentary',
      url: 'https://www.bilibili.com/documentary',
      screenshot: '/websites/bilibili/screenshots/bilibili_documentary.png'
    },

  ]
}
