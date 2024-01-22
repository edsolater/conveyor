import { LinkItem } from '../configs/links'
import { myDB } from './instance'
import { queryLinks } from './fetchers'

/**
 *
 * @param link new link to add
 */
export const addLink = async (link: LinkItem) => {
  const oldLinks = (await queryLinks()) ?? []
  const newLinks = [...oldLinks, link]
  myDB.set('site-links', newLinks)
}
