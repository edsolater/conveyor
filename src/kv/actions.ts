import { LinkItem } from '../configs/links'
import { myDB } from './instance'

/** dangerous it's very slow */
export const queryAllKeys = () => myDB.keys('*')

export const queryLinks = async () => await myDB.get<LinkItem[]>('site-links')

/**
 *
 * @param link new link to add
 */
export const addLink = async (link: LinkItem) => {
  const oldLinks = (await queryLinks()) ?? []
  const newLinks = [...oldLinks, link]
  myDB.set('site-links', newLinks)
}
